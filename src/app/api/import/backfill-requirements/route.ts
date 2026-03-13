import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import * as XLSX from "xlsx";
import * as path from "path";
import { PORTAL_KEY } from "@/lib/constants/portal";

export const maxDuration = 300;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function isNA(val: string): boolean {
  return !val || val.trim() === "" || val.trim() === "N/A" || val.trim() === "None";
}

async function rewriteEntryRequirements(rawText: string): Promise<string> {
  if (!rawText || isNA(rawText)) return "";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `You are a university admissions editor. Rewrite the following raw entry requirements text into a clean, well-structured, and professional format.

Raw text:
"${rawText}"

Rules:
- Keep ALL original information — do not add or invent requirements
- Format as a clean bullet-point list using "• " for each item
- Separate different requirement types (academic, language, documents, etc.) clearly
- Clean up formatting issues, abbreviations, and inconsistencies
- Use proper English and full sentences where needed
- Keep it concise but complete
- Do NOT use markdown headers or bold formatting — just plain text with bullet points
- If the text mentions specific scores (IELTS, TOEFL, HSK, GPA), preserve the exact values

Return ONLY the cleaned text, nothing else.`
      }],
      temperature: 0.2,
      max_tokens: 500,
    });

    const cleaned = completion.choices[0].message.content?.trim();
    return cleaned || rawText;
  } catch (err) {
    console.error(`[AI-Reqs] Error rewriting entry requirements:`, err);
    return rawText;
  }
}

interface ExcelRow {
  program_name: string;
  entry_requirements: string;
  university_name: string;
}

function parseExcelRow(row: (string | number | undefined)[]): ExcelRow {
  return {
    program_name: row[1]?.toString() || "",
    entry_requirements: row[5]?.toString() || "",
    university_name: row[13]?.toString() || "",
  };
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const body = await request.json();
        const { startFromUniversity } = body as { startFromUniversity?: string };

        send({ type: "info", message: "📖 Reading Excel file..." });

        // Read Excel file
        const excelPath = path.join(process.cwd(), "supabase", "combined_data_2026-03-0.xlsx");
        const workbook = XLSX.readFile(excelPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const dataRows = rawData.slice(1).filter(row => row.length > 0);

        const supabase = await createAdminClient();

        // Build Excel lookup: key = "university_name|||program_name" -> raw entry_requirements
        const excelRequirements: Map<string, string> = new Map();
        for (const row of dataRows) {
          const parsed = parseExcelRow(row);
          if (parsed.university_name && parsed.program_name && !isNA(parsed.entry_requirements)) {
            const key = `${parsed.university_name.toLowerCase().trim()}|||${parsed.program_name.toLowerCase().trim()}`;
            excelRequirements.set(key, parsed.entry_requirements);
          }
        }

        send({ type: "info", message: `📊 Found ${excelRequirements.size} programs with entry requirements in Excel` });

        // Get all programs that need fixing: entry_requirements IS NULL or looks like raw text
        // We'll fetch programs that have NULL entry_requirements, grouped by university
        const { data: allUnis } = await supabase
          .from("universities")
          .select("id, name")
          .eq("portal_key", PORTAL_KEY)
          .order("name");

        if (!allUnis || allUnis.length === 0) {
          send({ type: "error", message: "No universities found" });
          controller.close();
          return;
        }

        let totalFixed = 0;
        let totalSkipped = 0;
        let totalErrors = 0;
        let uniProcessed = 0;
        const totalUnis = allUnis.length;

        // Resume support
        let resumeReached = !startFromUniversity;

        for (const uni of allUnis) {
          if (!resumeReached) {
            const uniLower = uni.name.toLowerCase().trim();
            const resumeLower = startFromUniversity?.toLowerCase().trim() || "";
            if (uniLower === resumeLower || uniLower.includes(resumeLower) || resumeLower.includes(uniLower)) {
              resumeReached = true;
              send({ type: "resume", message: `▶️ Resuming from ${uni.name}` });
            } else {
              uniProcessed++;
              continue;
            }
          }

          uniProcessed++;

          // Get programs for this university that need entry_requirements fixed
          const { data: programs } = await supabase
            .from("university_programs")
            .select("id, program_catalog_id, entry_requirements, program_catalog!inner(title)")
            .eq("university_id", uni.id)
            .eq("portal_key", PORTAL_KEY);

          if (!programs || programs.length === 0) continue;

          // Filter to programs that need fixing (NULL or contains raw dashes/semicolons)
          const needsFix = programs.filter(p => {
            if (!p.entry_requirements) return true; // NULL
            // Check if it's raw-style (contains "- " lines, or semicolons indicating raw paste)
            const text = p.entry_requirements as string;
            if (text.includes("\n- ") || text.startsWith("- ")) return true;
            if (text.includes(";") && !text.includes("•")) return true;
            return false;
          });

          if (needsFix.length === 0) {
            // All programs already have clean entry_requirements
            continue;
          }

          send({
            type: "uni-start",
            university: uni.name,
            message: `📚 ${uni.name}: ${needsFix.length}/${programs.length} programs need fixing`,
            uniProcessed,
            totalUnis,
            totalFixed,
            totalSkipped,
          });

          for (const prog of needsFix) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const catalog = prog.program_catalog as any;
            const programTitle = catalog?.title || "Unknown";
            const lookupKey = `${uni.name.toLowerCase().trim()}|||${programTitle.toLowerCase().trim()}`;

            // Get raw text from Excel
            const rawText = excelRequirements.get(lookupKey);

            if (!rawText) {
              totalSkipped++;
              continue;
            }

            try {
              // AI rewrite
              const cleanedText = await rewriteEntryRequirements(rawText);

              if (cleanedText) {
                const { error } = await supabase
                  .from("university_programs")
                  .update({ entry_requirements: cleanedText })
                  .eq("id", prog.id);

                if (error) {
                  totalErrors++;
                  send({
                    type: "error",
                    message: `❌ ${programTitle}: ${error.message}`,
                  });
                } else {
                  totalFixed++;
                }
              } else {
                totalSkipped++;
              }

              // Rate limit: small delay between AI calls
              await new Promise(resolve => setTimeout(resolve, 150));
            } catch (err) {
              totalErrors++;
              send({
                type: "error",
                message: `❌ ${programTitle}: ${err instanceof Error ? err.message : String(err)}`,
              });
            }
          }

          send({
            type: "uni-done",
            university: uni.name,
            message: `✅ ${uni.name} done`,
            uniProcessed,
            totalUnis,
            totalFixed,
            totalSkipped,
            totalErrors,
          });
        }

        send({
          type: "complete",
          totalFixed,
          totalSkipped,
          totalErrors,
          message: `🎉 Backfill complete! Fixed: ${totalFixed}, Skipped: ${totalSkipped}, Errors: ${totalErrors}`,
        });
      } catch (error: unknown) {
        send({ type: "error", message: error instanceof Error ? error.message : String(error) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
