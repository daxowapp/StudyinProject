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

function normalizeLevel(level: string): string {
  const l = level.trim().toLowerCase();
  if (l === "doctoral" || l === "phd") return "PhD";
  if (l === "master" || l === "masters") return "Master";
  if (l === "bachelor" || l === "bachelors") return "Bachelor";
  if (l === "non-degree" || l === "non degree") return "Non-Degree";
  if (l === "associate") return "Associate";
  return level.trim();
}

function parseFee(feeStr: string): { amount: number | null; currency: string } {
  if (isNA(feeStr)) return { amount: null, currency: "RMB" };

  const cleaned = feeStr.replace(/,/g, "").trim();

  // Try to extract number and currency
  const match = cleaned.match(/(USD|RMB|CNY|EUR)\s*([\d.]+)/i) ||
    cleaned.match(/([\d.]+)\s*(USD|RMB|CNY|EUR)?/i);

  if (!match) return { amount: null, currency: "RMB" };

  let amount: number;
  let currency: string;

  if (match[1] && isNaN(Number(match[1]))) {
    // First capture is currency
    currency = match[1].toUpperCase();
    amount = parseFloat(match[2]);
  } else {
    // First capture is number
    amount = parseFloat(match[1]);
    currency = match[2]?.toUpperCase() || "RMB";
  }

  // Convert USD to RMB (approximate)
  if (currency === "USD") {
    amount = Math.round(amount * 7.2);
    currency = "RMB";
  }

  return { amount: Math.round(amount), currency };
}

function parseDeadline(dateStr: string): string | null {
  if (isNA(dateStr)) return null;

  try {
    // Handle formats like "Aug 31, 2026"
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    }
  } catch {}
  return null;
}

interface ParsedRequirements {
  gpa: number | null;
  ielts: number | null;
  toefl: number | null;
  duolingo: number | null;
  hsk: number | null;
  age_limit: number | null;
  raw_text: string;
}

function parseEntryRequirements(text: string): ParsedRequirements {
  const result: ParsedRequirements = {
    gpa: null,
    ielts: null,
    toefl: null,
    duolingo: null,
    hsk: null,
    age_limit: null,
    raw_text: text,
  };

  if (isNA(text)) return result;

  const t = text;

  // GPA — patterns: "GPA is 3.0", "GPA of 3.0", "cumulative GPA is 3.0", "GPA 3.0/4.0"
  const gpaMatch = t.match(/GPA\s*(?:is|of|:)?\s*([\d.]+)\s*(?:out of|\/)\s*4/i) ||
    t.match(/GPA\s*(?:is|of|:)?\s*([\d.]+)/i);
  if (gpaMatch) result.gpa = parseFloat(gpaMatch[1]);

  // IELTS — patterns: "IELTS≧6.0", "IELTS is 6.0", "IELTS 6.0", "IELTS≥5.5"
  const ieltsMatch = t.match(/IELTS\s*[≧≥>=is ]*\s*([\d.]+)/i);
  if (ieltsMatch) result.ielts = parseFloat(ieltsMatch[1]);

  // TOEFL — patterns: "TOEFL≧70", "TOEFL iBT is 80", "TOEFL 80"
  const toeflMatch = t.match(/TOEFL\s*(?:iBT)?\s*[≧≥>=is ]*\s*([\d.]+)/i);
  if (toeflMatch) result.toefl = parseFloat(toeflMatch[1]);

  // Duolingo — patterns: "Duolingo 120", "Duolingo is 105"
  const duolingoMatch = t.match(/Duolingo\s*[≧≥>=is ]*\s*([\d.]+)/i);
  if (duolingoMatch) result.duolingo = parseFloat(duolingoMatch[1]);

  // HSK — patterns: "HSK 4", "HSK level 4", "HSK certificate of Level 5", "HSK 5 190"
  const hskMatch = t.match(/HSK\s*(?:level|certificate of Level)?\s*(\d)/i);
  if (hskMatch) result.hsk = parseInt(hskMatch[1]);

  // Age limit — "under the age of 35", "at least 18"
  const ageMatch = t.match(/under the age of\s*(\d+)/i);
  if (ageMatch) result.age_limit = parseInt(ageMatch[1]);

  return result;
}

function categorizeProgramTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("medicine") || t.includes("medical") || t.includes("pharmacy") || t.includes("nursing") || t.includes("dentistry") || t.includes("clinical")) return "Medicine & Health";
  if (t.includes("engineering") || t.includes("mechanical") || t.includes("electrical") || t.includes("civil") || t.includes("chemical engineering")) return "Engineering";
  if (t.includes("computer") || t.includes("software") || t.includes("information technology") || t.includes("data science") || t.includes("artificial intelligence") || t.includes("cyber")) return "Computer Science & IT";
  if (t.includes("business") || t.includes("management") || t.includes("mba") || t.includes("marketing") || t.includes("finance") || t.includes("accounting") || t.includes("economics")) return "Business & Management";
  if (t.includes("law") || t.includes("legal") || t.includes("international law")) return "Law";
  if (t.includes("art") || t.includes("design") || t.includes("music") || t.includes("film") || t.includes("media") || t.includes("animation")) return "Arts & Design";
  if (t.includes("education") || t.includes("teaching") || t.includes("tesol") || t.includes("pedagogy")) return "Education";
  if (t.includes("architecture") || t.includes("urban planning") || t.includes("landscape")) return "Architecture";
  if (t.includes("chinese") || t.includes("language") || t.includes("linguistics") || t.includes("translation") || t.includes("literature")) return "Languages & Literature";
  if (t.includes("international relations") || t.includes("political") || t.includes("diplomacy") || t.includes("public policy")) return "Social Sciences";
  if (t.includes("science") || t.includes("physics") || t.includes("chemistry") || t.includes("biology") || t.includes("mathematics")) return "Natural Sciences";
  if (t.includes("agriculture") || t.includes("food science") || t.includes("environmental")) return "Agriculture & Environment";
  return "Other";
}

interface ProgramAIData {
  description: string | null;
  gpa_requirement: string | null;
  score_ielts: number | null;
  score_toefl: number | null;
  score_duolingo: number | null;
  scholarship_chance: string | null;
  duration: string | null;
  intake: string | null;
  application_deadline: string | null;
}

async function generateProgramAIData(
  programs: Array<{
    title: string;
    level: string;
    university: string;
    language: string;
    hasDuration: boolean;
    hasIntake: boolean;
    hasTuition: boolean;
    hasDeadline: boolean;
  }>
): Promise<Record<string, ProgramAIData>> {
  const prompt = `You are a university program data expert for Chinese universities. For each program below, provide realistic, accurate data that international students would need.

University: ${programs[0].university}

Programs:
${programs.map((p, i) => {
  const missing: string[] = [];
  if (!p.hasDuration) missing.push("duration");
  if (!p.hasIntake) missing.push("intake period");
  if (!p.hasTuition) missing.push("tuition info");
  if (!p.hasDeadline) missing.push("deadline");
  return `${i + 1}. ${p.title} (${p.level}, taught in ${p.language})${missing.length > 0 ? ` — missing: ${missing.join(", ")}` : ""}`;
}).join("\n")}

For EACH program, return a JSON object with these fields:
- description: A compelling 2-sentence description for international students
- gpa_requirement: Minimum GPA requirement as a string like "2.5" or "3.0" — ALWAYS provide this regardless of teaching language
- score_ielts: Minimum IELTS score (number, e.g. 5.5, 6.0, 6.5). For Chinese-taught programs use null
- score_toefl: Minimum TOEFL score (number, e.g. 60, 80, 90). For Chinese-taught programs use null
- score_duolingo: Minimum Duolingo score (number, e.g. 95, 105, 115). For Chinese-taught programs use null
- scholarship_chance: Scholarship availability as percentage range like "10-30%" or "50-80%" or "None"
- duration: Program duration like "4 Years", "2-3 Years", "3 Years" (only if not already provided)
- intake: Typical intake period like "September 2026", "March & September" (only if not already provided)
- application_deadline: Application deadline in YYYY-MM-DD format (only if not already provided). Use realistic deadlines for Chinese universities: Spring intake=Dec 15, Fall intake=Jun 15-Jul 31 of previous year. For the current year 2026, typical deadlines are 2026-06-15 to 2026-07-31.

Rules:
- GPA is REQUIRED for ALL programs regardless of language — use typical Chinese university standards: Bachelor=2.0-2.5, Master=2.5-3.0, PhD=3.0-3.5
- For English-taught programs, provide IELTS/TOEFL/Duolingo scores
- For Chinese-taught programs, set language scores to null but STILL provide GPA
- Use actual typical durations: Bachelor=4yr (Medicine=5-6yr), Master=2-3yr, PhD=3-4yr
- Application deadlines must be realistic dates in YYYY-MM-DD format

Return ONLY a JSON object where keys are program titles and values are the data objects. No markdown, no code blocks.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const content = completion.choices[0].message.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    console.log(`[AI] Generated data for ${Object.keys(parsed).length} programs:`, Object.keys(parsed));
    // Log sample data for first key
    const firstKey = Object.keys(parsed)[0];
    if (firstKey) console.log(`[AI] Sample (${firstKey}):`, JSON.stringify(parsed[firstKey]));
    return parsed;
  } catch (err) {
    console.error(`[AI] Error generating program data:`, err);
    return {};
  }
}

/**
 * AI-rewrite raw entry_requirements text into clean, well-formatted content.
 * Returns the cleaned text or the original if AI fails.
 */
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
    return rawText; // Fall back to original text
  }
}

interface ExcelRow {
  program_name: string;
  level: string;
  duration: string;
  tuition_fee: string;
  entry_requirements: string;
  special_exams: string;
  location: string;
  start_date: string;
  application_deadline: string;
  application_fee: string;
  service_fee: string;
  program_language: string;
  university_name: string;
  csca_exam_required: string;
}

function parseExcelRow(row: (string | number | undefined)[]): ExcelRow {
  return {
    program_name: row[1]?.toString() || "",
    level: row[2]?.toString() || "",
    duration: row[3]?.toString() || "",
    tuition_fee: row[4]?.toString() || "",
    entry_requirements: row[5]?.toString() || "",
    special_exams: row[6]?.toString() || "",
    location: row[7]?.toString() || "",
    start_date: row[8]?.toString() || "",
    application_deadline: row[9]?.toString() || "",
    application_fee: row[10]?.toString() || "",
    service_fee: row[11]?.toString() || "",
    program_language: row[12]?.toString() || "",
    university_name: row[13]?.toString() || "",
    csca_exam_required: row[14]?.toString() || "",
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
        const { universityNames, startFromUniversity, onlyEmptyUniversities } = body as { universityNames: string[]; startFromUniversity?: string; onlyEmptyUniversities?: boolean };

        if (!universityNames || universityNames.length === 0) {
          send({ type: "error", message: "No university names provided" });
          controller.close();
          return;
        }

        // Read Excel file
        const excelPath = path.join(process.cwd(), "supabase", "combined_data_2026-03-0.xlsx");
        const workbook = XLSX.readFile(excelPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const dataRows = rawData.slice(1).filter(row => row.length > 0);

        const supabase = await createAdminClient();

        // Get all universities from DB
        const { data: allUnis } = await supabase
          .from("universities")
          .select("id, name")
          .eq("portal_key", PORTAL_KEY);

        const uniLookup: Record<string, string> = {};
        (allUnis || []).forEach(u => {
          uniLookup[u.name.toLowerCase().trim()] = u.id;
        });

        // Get all languages from DB for lookup
        const { data: allLanguages } = await supabase
          .from("languages")
          .select("id, name");

        const languageLookup: Record<string, string> = {};
        (allLanguages || []).forEach(l => {
          languageLookup[l.name.toLowerCase().trim()] = l.id;
        });

        // Get existing program_catalog entries for dedup
        // IMPORTANT: Supabase has a 1000-row default limit, so we must paginate
        const allCatalogRows: Array<{ id: string; title: string; level: string; category: string; description: string | null }> = [];
        let catPageStart = 0;
        const catPageSize = 1000;
        let catHasMore = true;

        while (catHasMore) {
          const { data: catBatch } = await supabase
            .from("program_catalog")
            .select("id, title, level, category, description")
            .range(catPageStart, catPageStart + catPageSize - 1);

          if (catBatch && catBatch.length > 0) {
            allCatalogRows.push(...catBatch as typeof allCatalogRows);
            catPageStart += catPageSize;
            catHasMore = catBatch.length === catPageSize;
          } else {
            catHasMore = false;
          }
        }

        console.log(`[Catalog] Fetched ${allCatalogRows.length} catalog entries (${Math.ceil(allCatalogRows.length / catPageSize)} pages)`);

        // Build lookup by title only (unique constraint is on title, not title+level)
        const catalogLookup: Record<string, string> = {};
        const catalogDescriptionLookup: Record<string, string | null> = {};
        allCatalogRows.forEach(c => {
          const key = c.title.toLowerCase().trim();
          catalogLookup[key] = c.id;
          catalogDescriptionLookup[key] = c.description;
        });

        // Note: entry_requirements text is now AI-rewritten per-program during insert

        let totalPrograms = 0;
        let created = 0;
        let skipped = 0;
        let errors = 0;
        let uniProcessed = 0;

        // First pass: count programs per university in the Excel file
        const targetNames = new Set(universityNames.map(n => n.toLowerCase().trim()));
        const allProgramsByUni: Record<string, ExcelRow[]> = {};

        for (const row of dataRows) {
          const parsed = parseExcelRow(row);
          const uniKey = parsed.university_name.toLowerCase().trim();
          if (targetNames.has(uniKey)) {
            if (!allProgramsByUni[parsed.university_name.trim()]) {
              allProgramsByUni[parsed.university_name.trim()] = [];
            }
            allProgramsByUni[parsed.university_name.trim()].push(parsed);
          }
        }

        // If onlyIncompleteUniversities is true, compare Excel counts vs DB counts
        // and only keep universities where DB has fewer programs than the Excel
        let programsByUni: Record<string, ExcelRow[]>;

        if (onlyEmptyUniversities) {
          // Get per-university program counts from DB
          // IMPORTANT: Supabase has a 1000-row default limit, so we must paginate
          const allDbProgramRows: { university_id: string }[] = [];
          let pageStart = 0;
          const pageSize = 1000;
          let hasMore = true;

          while (hasMore) {
            const { data: batch } = await supabase
              .from("university_programs")
              .select("university_id")
              .eq("portal_key", PORTAL_KEY)
              .range(pageStart, pageStart + pageSize - 1);

            if (batch && batch.length > 0) {
              allDbProgramRows.push(...batch);
              pageStart += pageSize;
              hasMore = batch.length === pageSize; // If we got a full page, there might be more
            } else {
              hasMore = false;
            }
          }

          send({
            type: "info",
            message: `📊 Fetched ${allDbProgramRows.length} total program records from database (${Math.ceil(allDbProgramRows.length / pageSize)} pages)`,
          });

          // Count programs per university_id
          const dbCountByUniId: Record<string, number> = {};
          allDbProgramRows.forEach((p) => {
            dbCountByUniId[p.university_id] = (dbCountByUniId[p.university_id] || 0) + 1;
          });

          // Build reverse lookup: uni name → DB program count
          const dbCountByName: Record<string, number> = {};
          (allUnis || []).forEach(u => {
            dbCountByName[u.name.toLowerCase().trim()] = dbCountByUniId[u.id] || 0;
          });

          // Filter: only keep universities where DB count is at least 5 less than Excel count
          const MIN_MISSING_THRESHOLD = 5;
          programsByUni = {};
          const incompleteList: Array<{ name: string; excelCount: number; dbCount: number; missing: number }> = [];
          let skippedBelowThreshold = 0;

          for (const [uniName, programs] of Object.entries(allProgramsByUni)) {
            const uniKey = uniName.toLowerCase().trim();
            const excelCount = programs.length;
            const dbCount = dbCountByName[uniKey] ?? 0;
            const missing = excelCount - dbCount;

            if (dbCount === 0 || missing >= MIN_MISSING_THRESHOLD) {
              programsByUni[uniName] = programs;
              totalPrograms += excelCount;
              incompleteList.push({
                name: uniName,
                excelCount,
                dbCount,
                missing,
              });
            } else if (missing > 0) {
              skippedBelowThreshold++;
            }
          }

          // Sort: DB=0 first, then by fewest missing (smallest universities first for easier debugging)
          incompleteList.sort((a, b) => {
            if (a.dbCount === 0 && b.dbCount !== 0) return -1;
            if (a.dbCount !== 0 && b.dbCount === 0) return 1;
            return a.missing - b.missing;
          });

          // Rebuild programsByUni in sorted order
          const sortedProgramsByUni: Record<string, ExcelRow[]> = {};
          for (const item of incompleteList) {
            sortedProgramsByUni[item.name] = programsByUni[item.name];
          }
          programsByUni = sortedProgramsByUni;

          // Send preview with full details
          send({
            type: "incomplete-preview",
            totalIncomplete: incompleteList.length,
            totalMissing: incompleteList.reduce((s, u) => s + u.missing, 0),
            totalPrograms,
            universities: incompleteList,
            message: `🔍 Found ${incompleteList.length} universities with ≥${MIN_MISSING_THRESHOLD} missing programs (${incompleteList.reduce((s, u) => s + u.missing, 0)} total missing). Skipped ${skippedBelowThreshold} universities with <${MIN_MISSING_THRESHOLD} missing.`,
          });
        } else {
          // No filter — process all selected universities
          programsByUni = allProgramsByUni;
          for (const programs of Object.values(programsByUni)) {
            totalPrograms += programs.length;
          }
        }

        send({
          type: "start",
          totalPrograms,
          totalUniversities: Object.keys(programsByUni).length,
          message: `Starting import of ${totalPrograms} programs across ${Object.keys(programsByUni).length} universities...`,
        });

        // Resume support: skip universities until we reach the startFromUniversity
        let resumeReached = !startFromUniversity; // if no resume point, process all
        let resumeSkipped = 0;

        for (const [uniName, programs] of Object.entries(programsByUni)) {
          // Skip universities before the resume point
          if (!resumeReached) {
            const uniLower = uniName.toLowerCase().trim();
            const resumeLower = startFromUniversity?.toLowerCase().trim() || "";
            // Fuzzy match: exact, includes, or starts-with
            if (uniLower === resumeLower || uniLower.includes(resumeLower) || resumeLower.includes(uniLower)) {
              resumeReached = true;
              send({
                type: "resume",
                university: uniName,
                message: `▶️ Resuming from ${uniName}`,
                uniProcessed,
                totalPrograms,
                created,
                skipped,
                errors,
              });
            } else {
              uniProcessed++;
              resumeSkipped += programs.length;
              send({
                type: "uni-skip",
                university: uniName,
                message: `⏭️ Skipping ${uniName} (already imported)`,
                uniProcessed,
                totalPrograms,
                created,
                skipped,
                errors,
              });
              continue;
            }
          }
          uniProcessed++;
          const universityId = uniLookup[uniName.toLowerCase().trim()];

          if (!universityId) {
            errors += programs.length;
            send({
              type: "uni-error",
              university: uniName,
              message: `❌ University not found in DB: ${uniName} (${programs.length} programs skipped)`,
              uniProcessed,
              totalPrograms,
              created,
              skipped,
              errors,
            });
            continue;
          }

          // Step: Build map of existing programs for upsert (update existing, insert new — no deletion)
          // This is safe: if the import is interrupted, no data is lost
          const { data: existingPrograms } = await supabase
            .from("university_programs")
            .select("id, program_catalog_id")
            .eq("university_id", universityId);

          const existingUniProgramMap = new Map<string, string>();
          (existingPrograms || []).forEach((p: { id: string; program_catalog_id: string }) => {
            existingUniProgramMap.set(p.program_catalog_id, p.id);
          });

          // When onlyEmptyUniversities is true, skip programs that already exist in the DB
          // This avoids calling AI enrichment on programs we already have
          let programsToProcess = programs;

          if (onlyEmptyUniversities && existingUniProgramMap.size > 0) {
            // Pre-filter: only keep programs whose catalog_id is NOT in the existing map
            const newPrograms: ExcelRow[] = [];
            let earlySkipped = 0;

            for (const prog of programs) {
              const catKey = prog.program_name.toLowerCase().trim();
              const catId = catalogLookup[catKey];
              if (catId && existingUniProgramMap.has(catId)) {
                earlySkipped++;
              } else {
                newPrograms.push(prog);
              }
            }

            send({
              type: "dedup",
              university: uniName,
              message: `📋 Skipping ${earlySkipped} existing programs, importing only ${newPrograms.length} new programs for ${uniName}`,
              totalPrograms,
              created,
              skipped: skipped + earlySkipped,
              errors,
            });
            skipped += earlySkipped;
            programsToProcess = newPrograms;
          } else if (existingUniProgramMap.size > 0) {
            send({
              type: "dedup",
              university: uniName,
              message: `📋 Found ${existingUniProgramMap.size} existing programs (will update, not duplicate)`,
              totalPrograms,
              created,
              skipped,
              errors,
            });
          }

          // Now show the actual count being processed
          send({
            type: "uni-start",
            university: uniName,
            programCount: programsToProcess.length,
            uniProcessed,
            message: `📚 Processing ${programsToProcess.length} programs for ${uniName}...`,
          });

          // Process programs in batches of 5 for AI enrichment
          const batchSize = 5;
          for (let i = 0; i < programsToProcess.length; i += batchSize) {
            const batch = programsToProcess.slice(i, i + batchSize);

            // Generate AI data for all missing fields in the batch
            let aiData: Record<string, ProgramAIData> = {};
            try {
              aiData = await generateProgramAIData(
                batch.map(p => ({
                  title: p.program_name,
                  level: normalizeLevel(p.level),
                  university: uniName,
                  language: isNA(p.program_language) ? "English" : p.program_language,
                  hasDuration: !isNA(p.duration),
                  hasIntake: !isNA(p.start_date),
                  hasTuition: !isNA(p.tuition_fee),
                  hasDeadline: !isNA(p.application_deadline),
                }))
              );
            } catch (err) {
              console.error(`[AI] Batch error for ${uniName}:`, err);
            }

            // Insert programs one by one
            for (const program of batch) {
              const normalizedLevel = normalizeLevel(program.level);
              const catalogKey = program.program_name.toLowerCase().trim();

              // Step 1: Find or create program_catalog entry
              let catalogId = catalogLookup[catalogKey];
              const aiDescription = aiData[program.program_name]?.description ||
                `${program.program_name} is a ${normalizedLevel} program offered at ${uniName} for international students.`;

              if (!catalogId) {
                // Create new catalog entry
                const category = categorizeProgramTitle(program.program_name);
                const { data: newCatalog, error: catalogError } = await supabase
                  .from("program_catalog")
                  .insert({
                    title: program.program_name.trim(),
                    level: normalizedLevel,
                    category,
                    description: aiDescription,
                  })
                  .select("id")
                  .single();

                if (catalogError) {
                  // Try to find it again (race condition / unique constraint)
                  // Use .limit(1) instead of .single() — .single() errors on multiple matches
                  const { data: existingRows } = await supabase
                    .from("program_catalog")
                    .select("id")
                    .ilike("title", program.program_name.trim())
                    .limit(1);

                  if (existingRows && existingRows.length > 0) {
                    catalogId = existingRows[0].id as string;
                    // Update the lookup so future programs with the same title don't fail
                    catalogLookup[catalogKey] = catalogId;
                  } else {
                    errors++;
                    send({
                      type: "program-error",
                      university: uniName,
                      program: program.program_name,
                      message: `❌ ${program.program_name}: Failed to create catalog entry: ${catalogError.message}`,
                      totalPrograms,
                      created,
                      skipped,
                      errors,
                    });
                    continue;
                  }
                } else {
                  catalogId = newCatalog.id as string;
                  catalogLookup[catalogKey] = catalogId;
                  catalogDescriptionLookup[catalogKey] = aiDescription;
                }
              } else if (!catalogDescriptionLookup[catalogKey]) {
                // Backfill: existing catalog entry has no description — update it
                await supabase
                  .from("program_catalog")
                  .update({ description: aiDescription })
                  .eq("id", catalogId);
                catalogDescriptionLookup[catalogKey] = aiDescription;
                console.log(`[Backfill] Updated description for: ${program.program_name}`);
              }

              // Step 2: Resolve language_id
              const langName = isNA(program.program_language) ? "english" : program.program_language.toLowerCase().trim();
              let languageId = languageLookup[langName] || null;

              // Try partial match if exact match fails
              if (!languageId) {
                const matchedLang = (allLanguages || []).find(l =>
                  l.name.toLowerCase().includes(langName) || langName.includes(l.name.toLowerCase())
                );
                if (matchedLang) {
                  languageId = matchedLang.id;
                }
              }

              // Step 3: Parse fees, deadline, and entry requirements
              const tuition = parseFee(program.tuition_fee);
              const appFee = parseFee(program.application_fee);
              const deadline = parseDeadline(program.application_deadline);
              const cscaRequired = !isNA(program.csca_exam_required) && program.csca_exam_required.toLowerCase() === "yes";

              // Step 4: Parse entry_requirements for structured data (GPA, IELTS, TOEFL, Duolingo, HSK)
              const reqs = parseEntryRequirements(program.entry_requirements);

              // Step 5: Get AI-enriched data for this program (fills remaining gaps)
              // Try exact match first, then fuzzy match on program name
              let ai: Partial<ProgramAIData> = aiData[program.program_name] || {};
              if (!ai.gpa_requirement && !ai.application_deadline && Object.keys(aiData).length > 0) {
                const nameKey = program.program_name.toLowerCase().trim();
                console.log(`[AI] No exact match for "${program.program_name}", trying fuzzy. AI keys:`, Object.keys(aiData));
                const fuzzyMatch = Object.keys(aiData).find(k => 
                  k.toLowerCase().trim() === nameKey || 
                  k.toLowerCase().includes(nameKey) || 
                  nameKey.includes(k.toLowerCase())
                );
                if (fuzzyMatch) {
                  console.log(`[AI] Fuzzy matched "${program.program_name}" → "${fuzzyMatch}"`);
                  ai = aiData[fuzzyMatch];
                } else {
                  console.log(`[AI] No fuzzy match found for "${program.program_name}"`);
                }
              }

              // Log the final data being used
              console.log(`[Insert] ${program.program_name}: gpa=${ai.gpa_requirement}, deadline=${ai.application_deadline}, ielts=${ai.score_ielts}`);

              // Step: AI-rewrite entry_requirements text for cleaner display
              let cleanedEntryReqs: string | null = null;
              if (!isNA(program.entry_requirements)) {
                cleanedEntryReqs = await rewriteEntryRequirements(program.entry_requirements);
              }

              // Build the program data object
              const programData = {
                university_id: universityId,
                program_catalog_id: catalogId,
                custom_title: null,
                duration: !isNA(program.duration) ? program.duration : (ai.duration || null),
                tuition_fee: tuition.amount || 0,
                currency: tuition.currency,
                language_id: languageId,
                intake: !isNA(program.start_date) ? program.start_date : (ai.intake || null),
                is_active: true,
                scholarship_chance: ai.scholarship_chance || null,
                application_fee: appFee.amount || 0,
                force_payment: false,
                application_deadline: deadline || (ai.application_deadline ? ai.application_deadline : null),
                gpa_requirement: reqs.gpa ?? (ai.gpa_requirement ? parseFloat(ai.gpa_requirement) : null),
                score_ielts: reqs.ielts ?? ai.score_ielts ?? null,
                score_toefl: reqs.toefl ?? ai.score_toefl ?? null,
                score_duolingo: reqs.duolingo ?? ai.score_duolingo ?? null,
                csca_exam_require: cscaRequired,
                portal_key: PORTAL_KEY,
                entry_requirements: cleanedEntryReqs,
              };

              // Step 6: Insert or Update
              const existingRowId = existingUniProgramMap.get(catalogId);

              if (existingRowId) {
                // UPDATE existing program
                const { error: updateError } = await supabase
                  .from("university_programs")
                  .update(programData)
                  .eq("id", existingRowId);

                if (updateError) {
                  errors++;
                  send({
                    type: "program-error",
                    university: uniName,
                    program: program.program_name,
                    message: `❌ ${program.program_name}: Update failed: ${updateError.message}`,
                    totalPrograms,
                    created,
                    skipped,
                    errors,
                  });
                } else {
                  skipped++; // counted as "updated"
                }
              } else {
                // INSERT new program
                const { data: insertedRow, error: insertError } = await supabase
                  .from("university_programs")
                  .insert(programData)
                  .select("id")
                  .single();

                if (insertError) {
                  errors++;
                  send({
                    type: "program-error",
                    university: uniName,
                    program: program.program_name,
                    message: `❌ ${program.program_name}: ${insertError.message}`,
                    totalPrograms,
                    created,
                    skipped,
                    errors,
                  });
                } else {
                  created++;
                  if (insertedRow?.id) {
                    existingUniProgramMap.set(catalogId, insertedRow.id as string);
                  }
                }
              }

            }

            send({
              type: "batch-done",
              university: uniName,
              batchCreated: batch.length,
              message: `✅ Batch ${Math.floor(i / batchSize) + 1}: processed`,
              totalPrograms,
              created,
              skipped,
              errors,
            });

            // Rate limit delay
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          // Entry requirements are now AI-rewritten per-program and stored directly on the program record

          send({
            type: "uni-done",
            university: uniName,
            uniProcessed,
            message: `✅ Completed ${uniName}`,
            totalPrograms,
            created,
            skipped,
            errors,
          });
        }

        // Warn if resume point was never found
        if (startFromUniversity && !resumeReached) {
          send({
            type: "warning",
            message: `⚠️ Resume point "${startFromUniversity}" was not found in the university list. No programs were processed.`,
            totalPrograms,
            created,
            skipped,
            errors,
          });
        }

        const resumeNote = resumeSkipped > 0 ? ` (${resumeSkipped} skipped from previous run)` : "";
        send({
          type: "complete",
          totalPrograms,
          created,
          skipped,
          errors,
          message: `🎉 Import complete! Created: ${created}, Skipped: ${skipped}, Errors: ${errors}${resumeNote}`,
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
