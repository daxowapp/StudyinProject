import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { PORTAL_KEY } from "@/lib/constants/portal";

export const maxDuration = 300;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Detect if entry_requirements text looks "raw" / unformatted and needs AI cleanup.
 * Returns true if it should be re-processed.
 */
function needsFixing(text: string | null): boolean {
  if (!text) return false; // NULL — nothing to fix (no source data)
  const t = text.trim();
  if (t === "" || t === "N/A" || t === "None") return false;

  // Already formatted with bullet points → probably already cleaned
  if (t.includes("• ") && !t.includes("\n- ")) return false;

  // Raw indicators:
  if (t.startsWith("- ")) return true;                 // Markdown-style list
  if (t.includes("\n- ")) return true;                  // Multi-line dashes
  if (t.includes(";") && !t.includes("•")) return true; // Semicolon-separated (raw paste)
  if (t.includes("\\n")) return true;                   // Literal \n (escaped newlines)
  if (/\d\.\s/.test(t) && !t.includes("•")) return true; // Numbered list without bullets
  if (t.length > 50 && !t.includes("•")) return true;  // Long text without any formatting

  return false;
}

async function rewriteEntryRequirements(rawText: string): Promise<string> {
  if (!rawText || rawText.trim() === "") return "";

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
    console.error(`[BulkFix] Error rewriting entry requirements:`, err);
    return rawText;
  }
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
        const { startFromUniversity, forceAll } = body as {
          startFromUniversity?: string;
          forceAll?: boolean;
        };

        send({ type: "info", message: "🔍 Scanning database for programs needing entry requirements fix..." });

        const supabase = await createAdminClient();

        // Get all universities
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
        let totalScanned = 0;
        let uniProcessed = 0;
        const totalUnis = allUnis.length;

        // Resume support
        let resumeReached = !startFromUniversity;

        for (const uni of allUnis) {
          // Resume logic
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

          // Get programs for this university with their entry_requirements
          const { data: programs } = await supabase
            .from("university_programs")
            .select("id, entry_requirements, program_catalog!inner(title)")
            .eq("university_id", uni.id)
            .eq("portal_key", PORTAL_KEY);

          if (!programs || programs.length === 0) continue;

          // Filter to programs that actually need fixing
          const toFix = forceAll
            ? programs.filter(p => p.entry_requirements && p.entry_requirements.trim() !== "")
            : programs.filter(p => needsFixing(p.entry_requirements as string | null));

          totalScanned += programs.length;

          if (toFix.length === 0) continue;

          send({
            type: "uni-start",
            university: uni.name,
            message: `📚 ${uni.name}: ${toFix.length}/${programs.length} programs need fixing`,
            uniProcessed,
            totalUnis,
            totalFixed,
            totalSkipped,
            totalScanned,
          });

          for (const prog of toFix) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const catalog = prog.program_catalog as any;
            const programTitle = catalog?.title || "Unknown";
            const rawText = prog.entry_requirements as string;

            if (!rawText || rawText.trim() === "") {
              totalSkipped++;
              continue;
            }

            try {
              const cleanedText = await rewriteEntryRequirements(rawText);

              if (cleanedText && cleanedText !== rawText) {
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
            message: `✅ ${uni.name}: fixed ${toFix.length} programs`,
            uniProcessed,
            totalUnis,
            totalFixed,
            totalSkipped,
            totalErrors,
            totalScanned,
          });
        }

        send({
          type: "complete",
          totalFixed,
          totalSkipped,
          totalErrors,
          totalScanned,
          message: `🎉 Bulk fix complete! Fixed: ${totalFixed}, Skipped: ${totalSkipped}, Errors: ${totalErrors} (Scanned: ${totalScanned} programs)`,
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
