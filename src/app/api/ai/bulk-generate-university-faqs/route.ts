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

interface UniversityRow {
    id: string;
    name: string;
    name_local: string;
    city: string;
    province: string;
    description: string;
    founded: string;
    ranking: string;
    total_students: string;
    international_students: string;
    features: string[];
    website: string;
    accommodation_available: boolean;
    accommodation_description: string;
    accommodation_fee_range: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

function buildUniversityFAQPrompt(university: UniversityRow, locale: string): string {
    const language = LOCALE_LANGUAGES[locale] || "English";

    const languageInstruction = locale === "en"
        ? "Write all questions and answers in English."
        : `Write ALL questions and answers in ${language}. The questions and answers MUST be written entirely in ${language}, not in English. Keep proper nouns (university names, city names) in their original form.`;

    return `You are an expert education content writer specializing in Chinese universities. You work for "Study at China" — a platform that helps international students find and apply to programs at Chinese universities.

Generate exactly 10 unique, creative FAQ question-answer pairs about this UNIVERSITY (not about specific programs).

${languageInstruction}

🏫 UNIVERSITY DETAILS:
- Name: ${university.name}
${university.name_local && university.name_local !== university.name ? `- Local Name: ${university.name_local}` : ''}
- City: ${university.city || 'China'}
- Province: ${university.province || 'Not specified'}
${university.founded ? `- Founded: ${university.founded}` : ''}
${university.ranking ? `- Ranking: ${university.ranking}` : ''}
${university.total_students ? `- Total Students: ${university.total_students}` : ''}
${university.international_students ? `- International Students: ${university.international_students}` : ''}
${university.description ? `- Description: ${university.description.slice(0, 500)}` : ''}
${university.features && university.features.length > 0 ? `- Key Features: ${university.features.join(', ')}` : ''}
${university.website ? `- Website: ${university.website}` : ''}
${university.accommodation_available ? '- On-campus accommodation available' : ''}
${university.accommodation_fee_range ? `- Accommodation Fee Range: ${university.accommodation_fee_range}` : ''}

📝 RULES:
1. Write questions as a prospective international student would search on Google or ask AI assistants about this UNIVERSITY
2. Each answer must be 3-5 sentences long, detailed, informative, and helpful
3. Include the university name naturally in both questions AND answers
4. Optimize for SEO (long-tail keywords), GEO (location-specific queries about ${university.city || 'China'}), and AEO (clear, concise answers that AI snippets can extract)
5. NEVER mention any other agency, company, or platform name — only "Study at China" when referencing an agency
6. Cover DIVERSE topics across these categories (at least one from each):
   - University overview & reputation
   - Campus facilities & student life
   - City life & living in ${university.city || 'China'}
   - Scholarships & financial aid (CSC, university scholarships)
   - Application process & deadlines
   - Accommodation & housing options
   - Cost of living & expenses
   - Visa & travel information
   - Student support & international office
   - Career prospects & alumni network
7. Questions should be natural, conversational, and varied — NOT templated or repetitive
8. Answers should provide specific, actionable information — not generic filler
9. Focus on UNIVERSITY-LEVEL information, not specific programs

Return a valid JSON array of objects with "question" and "answer" fields:
[
  { "question": "...", "answer": "..." },
  ...
]

IMPORTANT: Return ONLY the JSON array, no markdown, no code blocks, no extra text.`;
}

async function generateFAQsForUniversity(university: UniversityRow, locale: string): Promise<FAQItem[] | null> {
    const prompt = buildUniversityFAQPrompt(university, locale);

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
        console.error("Failed to parse university FAQ response for", university.name, locale);
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

                // Fetch all universities with pagination
                const universities: UniversityRow[] = [];
                const PAGE_SIZE = 500;
                let page = 0;
                let hasMore = true;

                while (hasMore) {
                    const from = page * PAGE_SIZE;
                    const to = from + PAGE_SIZE - 1;
                    const { data, error } = await supabase
                        .from("universities")
                        .select("id, name, name_local, city, province, description, founded, ranking, total_students, international_students, features, website, accommodation_available, accommodation_description, accommodation_fee_range")
                        .eq("portal_key", PORTAL_KEY)
                        .order("name")
                        .range(from, to);

                    if (error) {
                        send({ type: "error", message: `Failed to fetch universities: ${error.message}` });
                        controller.close();
                        return;
                    }

                    if (data && data.length > 0) {
                        universities.push(...(data as UniversityRow[]));
                        hasMore = data.length === PAGE_SIZE;
                        page++;
                    } else {
                        hasMore = false;
                    }
                }

                if (universities.length === 0) {
                    send({ type: "error", message: "No universities found" });
                    controller.close();
                    return;
                }

                // Build a map of which (university_id, locale) pairs already have FAQs
                const existingPairs = new Set<string>();
                if (!overwrite) {
                    let faqPage = 0;
                    let faqHasMore = true;
                    while (faqHasMore) {
                        const from = faqPage * 1000;
                        const to = from + 999;
                        const { data: existingFaqs } = await supabase
                            .from("university_faqs")
                            .select("university_id, locale")
                            .range(from, to);

                        if (existingFaqs && existingFaqs.length > 0) {
                            for (const f of existingFaqs) {
                                existingPairs.add(`${f.university_id}::${f.locale}`);
                            }
                            faqHasMore = existingFaqs.length === 1000;
                            faqPage++;
                        } else {
                            faqHasMore = false;
                        }
                    }
                }

                // Build the work queue: (university, locale) pairs that need generation
                const workQueue: { university: UniversityRow; locale: string }[] = [];
                for (const university of universities) {
                    for (const locale of requestedLocales) {
                        if (overwrite || !existingPairs.has(`${university.id}::${locale}`)) {
                            workQueue.push({ university, locale });
                        }
                    }
                }

                const totalPossible = universities.length * requestedLocales.length;
                const skipped = totalPossible - workQueue.length;

                send({
                    type: "start",
                    total: workQueue.length,
                    totalAll: totalPossible,
                    skipped,
                    locales: requestedLocales,
                    message: `Starting university FAQ generation: ${workQueue.length} tasks (${universities.length} universities × ${requestedLocales.length} languages, ${skipped} already done)...`,
                });

                let processed = 0;
                let generated = 0;
                let errors = 0;

                for (const { university, locale } of workQueue) {
                    processed++;
                    const langName = LOCALE_LANGUAGES[locale] || locale;

                    send({
                        type: "progress",
                        processed,
                        total: workQueue.length,
                        generated,
                        errors,
                        current: university.name,
                        locale,
                        status: "generating",
                        message: `[${processed}/${workQueue.length}] Generating ${langName} FAQs for ${university.name}...`,
                    });

                    try {
                        const faqs = await generateFAQsForUniversity(university, locale);

                        if (faqs) {
                            // If overwriting, delete existing first
                            if (overwrite) {
                                await supabase
                                    .from("university_faqs")
                                    .delete()
                                    .eq("university_id", university.id)
                                    .eq("locale", locale);
                            }

                            const faqRows = faqs.map((faq, index) => ({
                                university_id: university.id,
                                locale,
                                question: faq.question,
                                answer: faq.answer,
                                display_order: index + 1,
                            }));

                            const { error: insertError } = await supabase
                                .from("university_faqs")
                                .insert(faqRows);

                            if (insertError) {
                                errors++;
                                send({
                                    type: "progress",
                                    processed,
                                    total: workQueue.length,
                                    generated,
                                    errors,
                                    current: university.name,
                                    locale,
                                    status: "error",
                                    message: `✗ DB error for ${university.name} [${langName}]: ${insertError.message}`,
                                });
                            } else {
                                generated++;
                                send({
                                    type: "progress",
                                    processed,
                                    total: workQueue.length,
                                    generated,
                                    errors,
                                    current: university.name,
                                    locale,
                                    status: "done",
                                    message: `✓ ${university.name} [${langName}] — ${faqs.length} FAQs saved`,
                                });
                            }
                        } else {
                            errors++;
                            send({
                                type: "progress",
                                processed,
                                total: workQueue.length,
                                generated,
                                errors,
                                current: university.name,
                                locale,
                                status: "error",
                                message: `✗ Failed to generate FAQs for ${university.name} [${langName}]`,
                            });
                        }
                    } catch (err: unknown) {
                        errors++;
                        const errMsg = err instanceof Error ? err.message : "Unknown error";
                        send({
                            type: "progress",
                            processed,
                            total: workQueue.length,
                            generated,
                            errors,
                            current: university.name,
                            locale,
                            status: "error",
                            message: `✗ Error for ${university.name} [${langName}]: ${errMsg}`,
                        });
                    }

                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                send({
                    type: "complete",
                    processed,
                    total: workQueue.length,
                    generated,
                    errors,
                    skipped,
                    message: `Done! Generated FAQs for ${generated} university-locale pairs. ${errors} errors. ${skipped} skipped (already exist).`,
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown error";
                send({ type: "error", message: `Fatal error: ${message}` });
            }

            controller.close();
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
