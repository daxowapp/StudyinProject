import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { PORTAL_KEY } from "@/lib/constants/portal";

export const maxDuration = 300;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    overview: string;
    curriculum: string[];
}

function buildContentPrompt(program: ProgramRow, locale: string): string {
    const programName = program.display_title || program.program_title;
    const universityName = program.university_name;
    const language = LOCALE_LANGUAGES[locale] || "English";

    const languageInstruction = locale === "en"
        ? "Write all content in English."
        : `Write ALL content in ${language}. The overview and course names MUST be written entirely in ${language}, not in English. Keep proper nouns (university names, program names, city names) in their original form.`;

    return `You are an expert education content writer specializing in international study programs in China. You work for "Study at China" — a platform that helps international students find and apply to programs at Chinese universities.

Generate TWO pieces of content for this program:

${languageInstruction}

📋 PROGRAM DETAILS:
- Program: ${programName}
- University: ${universityName}
- Level: ${program.level || 'Not specified'}
- Duration: ${program.duration || 'Not specified'}
- Teaching Language: ${program.language_name || 'Not specified'}
- City: ${program.city || 'China'}
- Tuition Fee: ${program.tuition_fee ? `${program.tuition_fee} ${program.currency || 'CNY'}/year` : 'Contact for details'}
- Intake: ${program.intake || 'September'}
${program.program_description ? `- Current Description: ${program.program_description.slice(0, 300)}` : ''}

📝 CONTENT TO GENERATE:

1. **OVERVIEW** (5-6 sentences):
   - Describe what this program covers and its academic focus
   - Mention the university's strengths or reputation in this field
   - Highlight what students will learn and the skills they will develop
   - Mention career prospects or research opportunities after graduation
   - Include the city/location context briefly
   - Make it informative, engaging, and helpful for prospective international students
   - Do NOT mention any specific tuition fees or application deadlines in the overview
   - Do NOT mention "Study at China" in the overview

2. **CURRICULUM** (8-12 core courses):
   - List realistic core courses that a ${program.level} student in ${programName} would study
   - Courses should be appropriate for the ${program.level} level (Bachelor/Master/PhD)
   - Include a mix of foundational and specialized courses
   - Each course name should be concise (2-6 words)
   - Make courses specific to ${programName}, not generic

Return a valid JSON object with this structure:
{
  "overview": "The detailed 5-6 sentence overview text...",
  "curriculum": ["Course Name 1", "Course Name 2", "Course Name 3", ...]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text.`;
}

async function generateContentForProgram(program: ProgramRow, locale: string): Promise<GeneratedContent | null> {
    const prompt = buildContentPrompt(program, locale);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
        const parsed = JSON.parse(cleaned);
        if (parsed.overview && Array.isArray(parsed.curriculum) && parsed.curriculum.length > 0) {
            return {
                overview: parsed.overview,
                curriculum: parsed.curriculum,
            };
        }
        return null;
    } catch {
        console.error("Failed to parse content response for", program.display_title || program.program_title, locale);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const { searchParams } = new URL(request.url);
                const overwrite = searchParams.get("overwrite") === "true";
                const localesParam = searchParams.getAll("locales");
                const requestedLocales: string[] = localesParam.length > 0
                    ? localesParam.filter((l: string) => ALL_LOCALES.includes(l as typeof ALL_LOCALES[number]))
                    : ["en"];

                const supabase = await createAdminClient();

                // Fetch all programs with pagination
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
                        send({ type: "error", message: `Failed to fetch programs: ${error.message}` });
                        controller.close();
                        return;
                    }

                    if (data && data.length > 0) {
                        programs.push(...(data as ProgramRow[]));
                        hasMore = data.length === PAGE_SIZE;
                        page++;
                    } else {
                        hasMore = false;
                    }
                }

                if (programs.length === 0) {
                    send({ type: "error", message: "No programs found" });
                    controller.close();
                    return;
                }

                // Build a map of which (program_id, locale) pairs already have content
                const existingPairs = new Set<string>();
                if (!overwrite) {
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
                }

                // Build the work queue
                const workQueue: { program: ProgramRow; locale: string }[] = [];
                for (const program of programs) {
                    for (const locale of requestedLocales) {
                        if (overwrite || !existingPairs.has(`${program.id}::${locale}`)) {
                            workQueue.push({ program, locale });
                        }
                    }
                }

                const totalPossible = programs.length * requestedLocales.length;
                const skipped = totalPossible - workQueue.length;

                send({
                    type: "start",
                    total: workQueue.length,
                    totalAll: totalPossible,
                    skipped,
                    locales: requestedLocales,
                    message: `Starting content generation: ${workQueue.length} tasks (${programs.length} programs × ${requestedLocales.length} languages, ${skipped} already done)...`,
                });

                let processed = 0;
                let generated = 0;
                let errors = 0;

                for (const { program, locale } of workQueue) {
                    processed++;
                    const programName = program.display_title || program.program_title;
                    const uniName = program.university_name;
                    const langName = LOCALE_LANGUAGES[locale] || locale;

                    send({
                        type: "progress",
                        processed,
                        total: workQueue.length,
                        generated,
                        errors,
                        current: `${programName} @ ${uniName}`,
                        locale,
                        status: "generating",
                        message: `🤖 [${locale.toUpperCase()}] Generating ${langName} content for: ${programName} at ${uniName}...`,
                    });

                    try {
                        const content = await generateContentForProgram(program, locale);

                        if (!content) {
                            errors++;
                            send({
                                type: "progress",
                                processed,
                                total: workQueue.length,
                                generated,
                                errors,
                                current: `${programName} @ ${uniName}`,
                                locale,
                                status: "error",
                                message: `❌ [${locale.toUpperCase()}] Failed to generate content for: ${programName}`,
                            });
                            continue;
                        }

                        // Upsert into program_translations
                        const { error: upsertError } = await supabase
                            .from("program_translations")
                            .upsert(
                                {
                                    program_id: program.id,
                                    locale,
                                    overview: content.overview,
                                    curriculum: content.curriculum,
                                },
                                { onConflict: "program_id,locale" }
                            );

                        if (upsertError) {
                            errors++;
                            send({
                                type: "progress",
                                processed,
                                total: workQueue.length,
                                generated,
                                errors,
                                current: `${programName} @ ${uniName}`,
                                locale,
                                status: "error",
                                message: `❌ [${locale.toUpperCase()}] DB error for ${programName}: ${upsertError.message}`,
                            });
                        } else {
                            generated++;
                            send({
                                type: "progress",
                                processed,
                                total: workQueue.length,
                                generated,
                                errors,
                                current: `${programName} @ ${uniName}`,
                                locale,
                                status: "generated",
                                message: `✅ [${locale.toUpperCase()}] Generated ${langName} content for: ${programName} at ${uniName} (${content.curriculum.length} courses)`,
                            });
                        }
                    } catch (aiError: unknown) {
                        errors++;
                        const msg = aiError instanceof Error ? aiError.message : "Unknown error";
                        send({
                            type: "progress",
                            processed,
                            total: workQueue.length,
                            generated,
                            errors,
                            current: `${programName} @ ${uniName}`,
                            locale,
                            status: "error",
                            message: `❌ [${locale.toUpperCase()}] AI Error for ${programName}: ${msg}`,
                        });
                    }

                    // Delay to avoid OpenAI rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                send({
                    type: "complete",
                    processed,
                    generated,
                    errors,
                    message: `✅ Bulk content generation complete! Generated: ${generated}, Errors: ${errors}, Skipped: ${skipped}`,
                });
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : "Unknown error";
                send({ type: "error", message: msg });
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
