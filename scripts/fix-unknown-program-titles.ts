/**
 * Fix "Unknown Program" titles in program_translations
 * 
 * Root cause: The backfill-program-titles.ts script used "Unknown Program" as a fallback
 * when it couldn't find a program name, then translated that string into all locales.
 * 
 * This script:
 * 1. Finds all program_translations with "Unknown Program" as EN title
 * 2. Looks up the actual program name from v_university_programs_full
 * 3. For locale=en, sets the correct English name directly
 * 4. For other locales, translates the correct name using OpenAI
 *
 * Usage:
 *   npx tsx scripts/fix-unknown-program-titles.ts [--dry-run] [--concurrency=5]
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
    let dryRun = false;
    let concurrency = 5;

    for (const arg of args) {
        if (arg === "--dry-run") dryRun = true;
        if (arg.startsWith("--concurrency=")) {
            concurrency = Math.max(1, parseInt(arg.split("=")[1], 10) || 5);
        }
    }
    return { dryRun, concurrency };
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
    if (locale === "en") return programName;

    const lang = LOCALE_LANGUAGES[locale] || "English";
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
- Translate the program/degree name and any descriptors strictly into ${lang}.
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

async function fetchAllPaginated<T>(
    tableName: string,
    selectCols: string,
    filters: { column: string; operator: string; value: unknown }[],
    pageSize = 1000
): Promise<T[]> {
    const all: T[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        let query = supabase.from(tableName).select(selectCols).range(from, to);
        
        for (const f of filters) {
            if (f.operator === "eq") query = query.eq(f.column, f.value);
            if (f.operator === "in") query = query.in(f.column, f.value as string[]);
        }
        
        const { data, error } = await query;
        if (error) throw new Error(`Query error: ${error.message}`);
        
        if (data && data.length > 0) {
            all.push(...(data as T[]));
            hasMore = data.length === pageSize;
            page++;
        } else {
            hasMore = false;
        }
    }
    return all;
}

async function main() {
    const { dryRun, concurrency } = parseArgs();

    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║      🔧 Fix Unknown Program Titles                          ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`  Mode:        ${dryRun ? "🔍 DRY RUN (no changes)" : "⚡ LIVE (will update DB)"}`);
    console.log(`  Workers:     ${concurrency}\n`);

    // Step 1: Find ALL "Unknown Program" English translations with pagination
    console.log("⏳ Step 1: Finding all 'Unknown Program' English translations...");
    
    const unknownEnglish = await fetchAllPaginated<{ program_id: string; locale: string; title: string }>(
        "program_translations",
        "program_id, locale, title",
        [
            { column: "locale", operator: "eq", value: "en" },
            { column: "title", operator: "eq", value: "Unknown Program" },
        ]
    );

    const affectedProgramIds = unknownEnglish.map(t => t.program_id);
    console.log(`📋 Found ${affectedProgramIds.length} programs with 'Unknown Program' EN title\n`);

    if (affectedProgramIds.length === 0) {
        console.log("✅ No affected programs found!");
        return;
    }

    // Step 2: Fetch actual program names from the view (batch by 100 to avoid URL length limits)
    console.log("⏳ Step 2: Fetching correct program names from database view...");

    const programNames = new Map<string, string>();
    const BATCH_SIZE = 100;

    for (let i = 0; i < affectedProgramIds.length; i += BATCH_SIZE) {
        const batch = affectedProgramIds.slice(i, i + BATCH_SIZE);
        const { data: programs, error } = await supabase
            .from("v_university_programs_full")
            .select("id, display_title, program_title")
            .in("id", batch);

        if (error) {
            console.error(`  ❌ Batch ${i}-${i + BATCH_SIZE} error:`, error.message);
            continue;
        }

        if (programs) {
            for (const p of programs) {
                const name = p.display_title || p.program_title;
                if (name) programNames.set(p.id, name);
            }
        }
        process.stdout.write(`  Loaded ${programNames.size} / ${affectedProgramIds.length}\r`);
    }

    console.log(`\n✅ Loaded correct names for ${programNames.size} programs\n`);

    // Check for programs we couldn't find names for
    const missingNames = affectedProgramIds.filter(id => !programNames.has(id));
    if (missingNames.length > 0) {
        console.log(`⚠️  ${missingNames.length} programs not found in view (may be deleted/inactive)`);
    }

    // Step 3: Build work items - for each affected program, fix ALL locale translations
    console.log("⏳ Step 3: Finding all translations for affected programs...");

    interface WorkItem {
        program_id: string;
        locale: string;
        currentTitle: string;
        correctName: string;
    }

    const work: WorkItem[] = [];
    const programIdsWithNames = [...programNames.keys()];

    for (let i = 0; i < programIdsWithNames.length; i += BATCH_SIZE) {
        const batch = programIdsWithNames.slice(i, i + BATCH_SIZE);
        const { data: allTrans } = await supabase
            .from("program_translations")
            .select("program_id, locale, title")
            .in("program_id", batch);

        if (allTrans) {
            for (const t of allTrans) {
                const correctName = programNames.get(t.program_id);
                if (!correctName) continue;

                // For EN locale: fix if title is "Unknown Program"
                // For other locales: fix if this program had "Unknown Program" in EN
                // (meaning all locale titles were translated from "Unknown Program")
                work.push({
                    program_id: t.program_id,
                    locale: t.locale,
                    currentTitle: t.title || "",
                    correctName,
                });
            }
        }
        process.stdout.write(`  Scanned ${Math.min(i + BATCH_SIZE, programIdsWithNames.length)} / ${programIdsWithNames.length}\r`);
    }

    console.log(`\n📋 Found ${work.length} translation rows to fix across ${programNames.size} programs\n`);

    if (dryRun) {
        console.log("🔍 DRY RUN - showing sample of items that would be fixed:\n");
        const groupedByProgram = new Map<string, WorkItem[]>();
        for (const item of work) {
            if (!groupedByProgram.has(item.program_id)) {
                groupedByProgram.set(item.program_id, []);
            }
            groupedByProgram.get(item.program_id)!.push(item);
        }

        let shown = 0;
        for (const [programId, items] of groupedByProgram) {
            if (shown >= 5) break;
            shown++;
            console.log(`  📝 ${items[0].correctName}`);
            for (const item of items.slice(0, 3)) {
                console.log(`     [${item.locale.toUpperCase()}] "${item.currentTitle}" → will fix`);
            }
            if (items.length > 3) {
                console.log(`     ... and ${items.length - 3} more locales`);
            }
            console.log("");
        }

        if (groupedByProgram.size > 5) {
            console.log(`  ... and ${groupedByProgram.size - 5} more programs.\n`);
        }

        console.log("💡 Run without --dry-run to apply fixes.");
        return;
    }

    // Step 4: Fix translations
    console.log("⏳ Step 4: Fixing translations...\n");

    let processed = 0;
    let updated = 0;
    let errors = 0;
    const total = work.length;

    async function processItem(item: WorkItem) {
        const idx = ++processed;
        const shortName = item.correctName.length > 40 
            ? item.correctName.slice(0, 37) + "..."
            : item.correctName;
        process.stdout.write(`[${idx}/${total}] [${item.locale.toUpperCase()}] ${shortName}`);

        try {
            const newTitle = await translateTitle(item.correctName, item.locale);

            const { error } = await supabase
                .from("program_translations")
                .update({ title: newTitle })
                .eq("program_id", item.program_id)
                .eq("locale", item.locale);

            if (error) {
                errors++;
                console.log(` ❌ DB: ${error.message}`);
            } else {
                updated++;
                console.log(` ✅ "${newTitle}"`);
            }
        } catch (err: unknown) {
            errors++;
            const msg = err instanceof Error ? err.message : "Unknown";
            console.log(` ❌ AI: ${msg}`);
        }

        // Rate limit
        await new Promise((r) => setTimeout(r, 80));
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
