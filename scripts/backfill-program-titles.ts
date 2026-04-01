/**
 * Backfill the `title` field in `program_translations` for rows
 * where overview exists but title is null.
 *
 * This is a lightweight script — it only translates the short program name,
 * not the full overview + curriculum (already populated).
 *
 * Usage:
 *   npx tsx scripts/backfill-program-titles.ts [options]
 *
 * Options:
 *   --locales=tr,ar       Comma-separated locales (default: all 9)
 *   --concurrency=10      Parallel requests (default: 10)
 *   --delay=100           Ms between requests per worker (default: 100)
 */

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing env vars");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const ALL_LOCALES = ["en", "tr", "ar", "fa", "tk", "zh", "fr", "es", "ru"];

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

function parseArgs() {
    const args = process.argv.slice(2);
    let locales = [...ALL_LOCALES];
    let concurrency = 10;
    let delay = 100;

    for (const arg of args) {
        if (arg.startsWith("--locales=")) {
            locales = arg.split("=")[1].split(",").filter((l) => ALL_LOCALES.includes(l));
        } else if (arg.startsWith("--concurrency=")) {
            concurrency = Math.max(1, parseInt(arg.split("=")[1], 10) || 10);
        } else if (arg.startsWith("--delay=")) {
            delay = parseInt(arg.split("=")[1], 10) || 100;
        }
    }
    return { locales, concurrency, delay };
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelay = 2000): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt === retries) throw err;
            const d = baseDelay * Math.pow(2, attempt - 1);
            await new Promise((r) => setTimeout(r, d));
        }
    }
    throw new Error("Unreachable");
}

async function translateTitle(programName: string, locale: string): Promise<string> {
    const lang = LOCALE_LANGUAGES[locale] || "English";

    if (locale === "en") {
        return programName; // English title is the original
    }

    const resp = await withRetry(() =>
        openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a professional translator for university programs. Your sole job is to translate academic program names into ${lang}.`
                },
                {
                    role: "user",
                    content: `Translate this academic program name into ${lang}. 
IMPORTANT: 
- DO NOT keep the name in English unless the target language is English.
- Keep proper nouns (university names, city names) in their original form.
- Translate the program/degree name and any descriptors (e.g., lab names) strictly into ${lang}.
- Return ONLY the translated name, nothing else. No quotes, no explanation.

Program name: "${programName}"`,
                },
            ],
            temperature: 0.1,
            max_tokens: 150,
        })
    );

    return resp.choices[0].message.content?.trim().replace(/^["']|["']$/g, "") || programName;
}

async function main() {
    const { locales, concurrency, delay } = parseArgs();

    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║      📝 Backfill Program Titles                             ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`  Locales:     ${locales.join(", ")}`);
    console.log(`  Workers:     ${concurrency}`);
    console.log(`  Delay:       ${delay}ms\n`);

    // Fetch all translations where title is null but overview exists
    console.log("⏳ Finding translations with missing titles...");

    interface TransRow {
        program_id: string;
        locale: string;
    }

    const work: (TransRow & { programName: string })[] = [];
    const PAGE_SIZE = 1000;
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error } = await supabase
            .from("program_translations")
            .select("program_id, locale")
            .is("title", null)
            .not("overview", "is", null)
            .in("locale", locales)
            .range(from, to);

        if (error) {
            console.error("❌ Query error:", error.message);
            process.exit(1);
        }
        if (data && data.length > 0) {
            for (const row of data) {
                work.push({ ...row, programName: "" });
            }
            hasMore = data.length === PAGE_SIZE;
            page++;
        } else {
            hasMore = false;
        }
    }

    console.log(`📋 Found ${work.length} translations missing titles\n`);
    if (work.length === 0) {
        console.log("✅ All titles are already populated!");
        return;
    }

    // Fetch program names in bulk
    console.log("⏳ Fetching program names...");
    const programIds = [...new Set(work.map((w) => w.program_id))];
    const programNames = new Map<string, string>();

    for (let i = 0; i < programIds.length; i += 500) {
        const batch = programIds.slice(i, i + 500);
        const { data: programs } = await supabase
            .from("v_university_programs_full")
            .select("id, program_title, display_title")
            .in("id", batch);
        if (programs) {
            for (const p of programs) {
                programNames.set(p.id, p.display_title || p.program_title);
            }
        }
    }

    // Assign names
    for (const item of work) {
        const name = programNames.get(item.program_id);
        if (!name) {
            console.warn(`⚠️  Skipping program ${item.program_id} - no name found in view`);
            continue;
        }
        item.programName = name;
    }

    console.log(`✅ Loaded names for ${programNames.size} programs\n`);

    // Process with worker pool
    let processed = 0;
    let updated = 0;
    let errors = 0;
    const total = work.length;

    async function processItem(item: (typeof work)[0]) {
        const idx = ++processed;
        const lang = LOCALE_LANGUAGES[item.locale] || item.locale;
        process.stdout.write(`[${idx}/${total}] 📝 [${item.locale.toUpperCase()}] ${item.programName.slice(0, 50)}...`);

        try {
            const title = await translateTitle(item.programName, item.locale);

            const { error } = await supabase
                .from("program_translations")
                .update({ title })
                .eq("program_id", item.program_id)
                .eq("locale", item.locale);

            if (error) {
                errors++;
                console.log(` ❌ DB: ${error.message}`);
            } else {
                updated++;
                console.log(` ✅ "${title}"`);
            }
        } catch (err: unknown) {
            errors++;
            const msg = err instanceof Error ? err.message : "Unknown";
            console.log(` ❌ AI: ${msg}`);
        }

        await new Promise((r) => setTimeout(r, delay));
    }

    let queueIndex = 0;
    async function worker() {
        while (queueIndex < work.length) {
            const idx = queueIndex++;
            await processItem(work[idx]);
        }
    }

    const workers = Array.from({ length: Math.min(concurrency, work.length) }, () => worker());
    await Promise.all(workers);

    console.log("\n╔═══════════════════════════════════════════════════════════════╗");
    console.log("║      📊 Summary                                             ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`  Updated: ${updated}`);
    console.log(`  Errors:  ${errors}`);
    console.log(`  Total:   ${total}`);
    console.log("");
}

main().catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
});
