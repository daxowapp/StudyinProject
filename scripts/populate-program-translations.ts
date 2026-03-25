/**
 * Standalone CLI script to populate the `program_translations` table
 * with AI-generated overview and curriculum content for all programs.
 *
 * Usage:
 *   npx tsx scripts/populate-program-translations.ts [options]
 *
 * Options:
 *   --locales=en,tr,ar   Comma-separated locales (default: all 9)
 *   --overwrite          Regenerate even if content already exists (default: resume)
 *   --delay=200          Milliseconds between OpenAI calls per worker (default: 200)
 *   --concurrency=5      Parallel OpenAI requests (default: 5)
 *
 * Examples:
 *   npx tsx scripts/populate-program-translations.ts
 *   npx tsx scripts/populate-program-translations.ts --locales=en,ar --overwrite
 *   npx tsx scripts/populate-program-translations.ts --concurrency=10
 *   npx tsx scripts/populate-program-translations.ts --locales=tr --delay=1000
 */

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// ── Load .env.local ──────────────────────────────────────────────────
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const PORTAL_KEY = process.env.NEXT_PUBLIC_PORTAL_KEY || "studyatchina";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ── Constants ────────────────────────────────────────────────────────

const ALL_LOCALES = ["en", "tr", "ar", "fa", "tk", "zh", "fr", "es", "ru"] as const;

const LOCALE_LANGUAGES: Record<string, string> = {
    en: "English",
    tr: "Turkish",
    ar: "Arabic",
    fa: "Persian (Farsi)",
    tk: "Turkmen",
    zh: "Chinese (Simplified)",
    fr: "French",
    es: "Spanish",
    ru: "Russian",
};

// ── Types ────────────────────────────────────────────────────────────

interface ProgramRow {
    id: string;
    program_title: string;
    display_title: string;
    university_name: string;
    level: string;
    duration: string;
    language_name: string;
    city: string;
    tuition_fee: number;
    currency: string;
    intake: string;
    program_description: string;
}

interface GeneratedContent {
    title: string;
    overview: string;
    curriculum: string[];
}

// ── CLI Arg Parsing ──────────────────────────────────────────────────

function parseArgs() {
    const args = process.argv.slice(2);
    let locales: string[] = [...ALL_LOCALES];
    let overwrite = false;
    let delay = 200;
    let concurrency = 5;

    for (const arg of args) {
        if (arg.startsWith("--locales=")) {
            const val = arg.split("=")[1];
            locales = val.split(",").filter((l) => (ALL_LOCALES as readonly string[]).includes(l));
            if (locales.length === 0) {
                console.error(`❌ No valid locales in "${val}". Valid: ${ALL_LOCALES.join(", ")}`);
                process.exit(1);
            }
        } else if (arg === "--overwrite") {
            overwrite = true;
        } else if (arg.startsWith("--delay=")) {
            delay = parseInt(arg.split("=")[1], 10) || 200;
        } else if (arg.startsWith("--concurrency=")) {
            concurrency = Math.max(1, parseInt(arg.split("=")[1], 10) || 5);
        }
    }

    return { locales, overwrite, delay, concurrency };
}

// ── Prompt (same as API route) ───────────────────────────────────────

function buildContentPrompt(program: ProgramRow, locale: string): string {
    const programName = program.display_title || program.program_title;
    const universityName = program.university_name;
    const language = LOCALE_LANGUAGES[locale] || "English";

    const languageInstruction =
        locale === "en"
            ? "Write all content in English."
            : `Write ALL content in ${language}. The title, overview, and course names MUST be written entirely in ${language}, not in English. Keep proper nouns (university names, city names) in their original form, but translate the program/degree name itself.`;

    return `You are an expert education content writer specializing in international study programs in China. You work for "Study at China" — a platform that helps international students find and apply to programs at Chinese universities.

Generate THREE pieces of content for this program:

${languageInstruction}

📋 PROGRAM DETAILS:
- Program: ${programName}
- University: ${universityName}
- Level: ${program.level || "Not specified"}
- Duration: ${program.duration || "Not specified"}
- Teaching Language: ${program.language_name || "Not specified"}
- City: ${program.city || "China"}
- Tuition Fee: ${program.tuition_fee ? `${program.tuition_fee} ${program.currency || "CNY"}/year` : "Contact for details"}
- Intake: ${program.intake || "September"}
${program.program_description ? `- Current Description: ${program.program_description.slice(0, 300)}` : ""}

📝 CONTENT TO GENERATE:

1. **TITLE** (translated program name):
   - Translate the program name "${programName}" into ${language}
   - Keep it concise and professional, like a degree program name
   - Example: "Electronic Information" → "Elektronik Bilgisi" (Turkish)
   - If it includes a lab/center name in parentheses, translate that too

2. **OVERVIEW** (5-6 sentences):
   - Describe what this program covers and its academic focus
   - Mention the university's strengths or reputation in this field
   - Highlight what students will learn and the skills they will develop
   - Mention career prospects or research opportunities after graduation
   - Include the city/location context briefly
   - Make it informative, engaging, and helpful for prospective international students
   - Do NOT mention any specific tuition fees or application deadlines in the overview
   - Do NOT mention "Study at China" in the overview

3. **CURRICULUM** (8-12 core courses):
   - List realistic core courses that a ${program.level} student in ${programName} would study
   - Courses should be appropriate for the ${program.level} level (Bachelor/Master/PhD)
   - Include a mix of foundational and specialized courses
   - Each course name should be concise (2-6 words)
   - Make courses specific to ${programName}, not generic

Return a valid JSON object with this structure:
{
  "title": "Translated program name in ${language}",
  "overview": "The detailed 5-6 sentence overview text...",
  "curriculum": ["Course Name 1", "Course Name 2", "Course Name 3", ...]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text.`;
}

// ── AI Generation ────────────────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 2000): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt === maxRetries) throw err;
            const delay = baseDelay * Math.pow(2, attempt - 1); // 2s, 4s, 8s
            const msg = err instanceof Error ? err.message : "Unknown error";
            process.stdout.write(` ⚠️ Retry ${attempt}/${maxRetries} in ${delay / 1000}s (${msg})`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error("Unreachable");
}

async function generateContentForProgram(program: ProgramRow, locale: string): Promise<GeneratedContent | null> {
    const prompt = buildContentPrompt(program, locale);

    const completion = await withRetry(() =>
        openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 2000,
        })
    );

    const content = completion.choices[0].message.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
        const parsed = JSON.parse(cleaned);
        if (parsed.overview && Array.isArray(parsed.curriculum) && parsed.curriculum.length > 0) {
            return { title: parsed.title || "", overview: parsed.overview, curriculum: parsed.curriculum };
        }
        return null;
    } catch {
        return null;
    }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
    const { locales, overwrite, delay, concurrency } = parseArgs();

    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║      📚 Program Translations Generator                      ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`  Portal:    ${PORTAL_KEY}`);
    console.log(`  Locales:   ${locales.join(", ")}`);
    console.log(`  Mode:      ${overwrite ? "OVERWRITE (regenerate all)" : "RESUME (skip existing)"}`);
    console.log(`  Workers:   ${concurrency} parallel`);
    console.log(`  Delay:     ${delay}ms between requests per worker`);
    console.log("");

    // ── Fetch all programs ───────────────────────────────────────────
    console.log("⏳ Fetching programs...");
    const programs: ProgramRow[] = [];
    const PAGE_SIZE = 500;
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error } = await supabase
            .from("v_university_programs_full")
            .select("id, program_title, display_title, university_name, level, duration, language_name, city, tuition_fee, currency, intake, program_description")
            .eq("portal_key", PORTAL_KEY)
            .order("university_name")
            .range(from, to);

        if (error) {
            console.error(`❌ Failed to fetch programs: ${error.message}`);
            process.exit(1);
        }

        if (data && data.length > 0) {
            programs.push(...(data as ProgramRow[]));
            hasMore = data.length === PAGE_SIZE;
            page++;
        } else {
            hasMore = false;
        }
    }

    console.log(`✅ Found ${programs.length} programs\n`);

    if (programs.length === 0) {
        console.log("Nothing to do.");
        return;
    }

    // ── Build existing pairs set ─────────────────────────────────────
    const existingPairs = new Set<string>();
    if (!overwrite) {
        console.log("⏳ Checking existing translations...");
        let contentPage = 0;
        let contentHasMore = true;
        while (contentHasMore) {
            const from = contentPage * 1000;
            const to = from + 999;
            const { data: existingContent } = await supabase
                .from("program_translations")
                .select("program_id, locale")
                .not("overview", "is", null)
                .range(from, to);

            if (existingContent && existingContent.length > 0) {
                for (const c of existingContent) {
                    existingPairs.add(`${c.program_id}::${c.locale}`);
                }
                contentHasMore = existingContent.length === 1000;
                contentPage++;
            } else {
                contentHasMore = false;
            }
        }
        console.log(`✅ Found ${existingPairs.size} existing translations\n`);
    }

    // ── Build work queue ─────────────────────────────────────────────
    const workQueue: { program: ProgramRow; locale: string }[] = [];
    for (const program of programs) {
        for (const locale of locales) {
            if (overwrite || !existingPairs.has(`${program.id}::${locale}`)) {
                workQueue.push({ program, locale });
            }
        }
    }

    const totalPossible = programs.length * locales.length;
    const skipped = totalPossible - workQueue.length;

    console.log(`📋 Work queue: ${workQueue.length} tasks`);
    console.log(`   (${programs.length} programs × ${locales.length} locales, ${skipped} already done)\n`);

    if (workQueue.length === 0) {
        console.log("✅ All translations already exist. Use --overwrite to regenerate.");
        return;
    }

    // ── Process queue with worker pool ────────────────────────────────
    let processed = 0;
    let generated = 0;
    let errors = 0;
    const total = workQueue.length;

    async function processItem(item: { program: ProgramRow; locale: string }) {
        const { program, locale } = item;
        const programName = program.display_title || program.program_title;
        const uniName = program.university_name;
        const langName = LOCALE_LANGUAGES[locale] || locale;

        const idx = ++processed;
        process.stdout.write(`[${idx}/${total}] 🤖 [${locale.toUpperCase()}] ${programName} @ ${uniName}...`);

        try {
            const content = await generateContentForProgram(program, locale);

            if (!content) {
                errors++;
                console.log(` ❌ Parse failed`);
                return;
            }

            const upsertData: Record<string, unknown> = {
                program_id: program.id,
                locale,
                overview: content.overview,
                curriculum: content.curriculum,
            };
            if (content.title) {
                upsertData.title = content.title;
            }
            const { error: upsertError } = await supabase
                .from("program_translations")
                .upsert(upsertData, { onConflict: "program_id,locale" });

            if (upsertError) {
                errors++;
                console.log(` ❌ DB: ${upsertError.message}`);
            } else {
                generated++;
                console.log(` ✅ ${langName} (${content.curriculum.length} courses)`);
            }
        } catch (err: unknown) {
            errors++;
            const msg = err instanceof Error ? err.message : "Unknown error";
            console.log(` ❌ AI: ${msg}`);
        }

        // Per-worker rate limit
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Worker pool: N workers pulling from the queue
    let queueIndex = 0;
    async function worker() {
        while (queueIndex < workQueue.length) {
            const idx = queueIndex++;
            await processItem(workQueue[idx]);
        }
    }

    const workers = Array.from({ length: Math.min(concurrency, workQueue.length) }, () => worker());
    await Promise.all(workers);

    // ── Summary ──────────────────────────────────────────────────────
    console.log("\n╔═══════════════════════════════════════════════════════════════╗");
    console.log("║      📊 Summary                                             ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`  Generated: ${generated}`);
    console.log(`  Errors:    ${errors}`);
    console.log(`  Skipped:   ${skipped}`);
    console.log(`  Total:     ${totalPossible}`);
    console.log("");
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
