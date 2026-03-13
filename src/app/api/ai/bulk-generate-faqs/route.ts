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
    gpa_requirement: string;
    score_ielts: string;
    score_toefl: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

function buildFAQPrompt(program: ProgramRow, locale: string): string {
    const programName = program.display_title || program.program_title;
    const universityName = program.university_name;
    const language = LOCALE_LANGUAGES[locale] || "English";

    const languageInstruction = locale === "en"
        ? "Write all questions and answers in English."
        : `Write ALL questions and answers in ${language}. The questions and answers MUST be written entirely in ${language}, not in English. Keep proper nouns (university names, program names, city names) in their original form.`;

    return `You are an expert education content writer specializing in international study programs in China. You work for "Study at China" — a platform that helps international students find and apply to programs at Chinese universities.

Generate exactly 10 unique, creative FAQ question-answer pairs for this program.

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
${program.program_description ? `- Description: ${program.program_description.slice(0, 300)}` : ''}
${program.gpa_requirement ? `- GPA Requirement: ${program.gpa_requirement}` : ''}
${program.score_ielts ? `- IELTS Requirement: ${program.score_ielts}` : ''}
${program.score_toefl ? `- TOEFL Requirement: ${program.score_toefl}` : ''}

📝 RULES:
1. Write questions as a prospective international student would search on Google or ask AI assistants
2. Each answer must be 3-5 sentences long, detailed, informative, and helpful
3. Include the university name and program name naturally in both questions AND answers
4. Optimize for SEO (long-tail keywords), GEO (location-specific queries about ${program.city || 'China'}), and AEO (clear, concise answers that AI snippets can extract)
5. NEVER mention any other agency, company, or platform name — only "Study at China" when referencing an agency
6. Cover DIVERSE topics across these categories (at least one from each):
   - Program duration & structure
   - Admission requirements & eligibility
   - Tuition fees & cost of living
   - Scholarships & financial aid available
   - Career prospects & degree recognition
   - Campus life & student facilities
   - Accommodation options
   - Visa & application process
   - Language requirements
   - City life & cultural experience in ${program.city || 'China'}
7. Questions should be natural, conversational, and varied — NOT templated or repetitive
8. Answers should provide specific, actionable information — not generic filler

Return a valid JSON array of objects with "question" and "answer" fields:
[
  { "question": "...", "answer": "..." },
  ...
]

IMPORTANT: Return ONLY the JSON array, no markdown, no code blocks, no extra text.`;
}

async function generateFAQsForProgram(program: ProgramRow, locale: string): Promise<FAQItem[] | null> {
    const prompt = buildFAQPrompt(program, locale);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
    });

    const content = completion.choices[0].message.content || "[]";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
        const faqs = JSON.parse(cleaned);
        if (Array.isArray(faqs) && faqs.length > 0) {
            return faqs;
        }
        return null;
    } catch {
        console.error("Failed to parse FAQ response for", program.display_title || program.program_title, locale);
        return null;
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
                const body = await request.json().catch(() => ({}));
                const overwrite = body.overwrite === true;
                const requestedLocales: string[] = Array.isArray(body.locales) && body.locales.length > 0
                    ? body.locales.filter((l: string) => ALL_LOCALES.includes(l as typeof ALL_LOCALES[number]))
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
                        .select("id, program_title, display_title, university_name, level, duration, language_name, city, tuition_fee, currency, intake, program_description, gpa_requirement, score_ielts, score_toefl")
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

                // Build a map of which (program_id, locale) pairs already have FAQs
                const existingPairs = new Set<string>();
                if (!overwrite) {
                    // Fetch all existing FAQ program_id + locale combos
                    let faqPage = 0;
                    let faqHasMore = true;
                    while (faqHasMore) {
                        const from = faqPage * 1000;
                        const to = from + 999;
                        const { data: existingFaqs } = await supabase
                            .from("program_faqs")
                            .select("program_id, locale")
                            .range(from, to);

                        if (existingFaqs && existingFaqs.length > 0) {
                            for (const f of existingFaqs) {
                                existingPairs.add(`${f.program_id}::${f.locale}`);
                            }
                            faqHasMore = existingFaqs.length === 1000;
                            faqPage++;
                        } else {
                            faqHasMore = false;
                        }
                    }
                }

                // Build the work queue: (program, locale) pairs that need generation
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
                    message: `Starting FAQ generation: ${workQueue.length} tasks (${programs.length} programs × ${requestedLocales.length} languages, ${skipped} already done)...`,
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
                        message: `🤖 [${locale.toUpperCase()}] Generating ${langName} FAQs for: ${programName} at ${uniName}...`,
                    });

                    try {
                        const faqs = await generateFAQsForProgram(program, locale);

                        if (!faqs) {
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
                                message: `❌ [${locale.toUpperCase()}] Failed to generate FAQs for: ${programName}`,
                            });
                            continue;
                        }

                        // If overwriting, delete existing FAQs for this program+locale
                        if (overwrite) {
                            await supabase
                                .from("program_faqs")
                                .delete()
                                .eq("program_id", program.id)
                                .eq("locale", locale);
                        }

                        // Insert the FAQs
                        const faqRows = faqs.map((faq, index) => ({
                            program_id: program.id,
                            locale,
                            question: faq.question,
                            answer: faq.answer,
                            display_order: index + 1,
                        }));

                        const { error: insertError } = await supabase
                            .from("program_faqs")
                            .insert(faqRows);

                        if (insertError) {
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
                                message: `❌ [${locale.toUpperCase()}] DB error for ${programName}: ${insertError.message}`,
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
                                message: `✅ [${locale.toUpperCase()}] Generated ${faqs.length} ${langName} FAQs for: ${programName} at ${uniName}`,
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
                    message: `✅ Bulk FAQ generation complete! Generated: ${generated}, Errors: ${errors}, Skipped: ${skipped}`,
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
