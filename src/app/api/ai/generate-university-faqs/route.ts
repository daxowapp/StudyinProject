import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { PORTAL_KEY } from "@/lib/constants/portal";

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

interface UniversityData {
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

function buildUniversityFAQPrompt(university: UniversityData, locale: string): string {
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

export async function POST(request: NextRequest) {
    try {
        const { universityId, locale = "en", overwrite } = await request.json();

        if (!universityId) {
            return NextResponse.json({ error: "universityId is required" }, { status: 400 });
        }

        const validLocale = LOCALE_LANGUAGES[locale] ? locale : "en";
        const supabase = await createAdminClient();

        // Check if FAQs already exist for this university+locale
        if (!overwrite) {
            const { count } = await supabase
                .from("university_faqs")
                .select("id", { count: "exact", head: true })
                .eq("university_id", universityId)
                .eq("locale", validLocale);

            if (count && count > 0) {
                return NextResponse.json({
                    message: `FAQs already exist for this university in ${validLocale}`,
                    count,
                    skipped: true,
                });
            }
        }

        // Fetch university data
        const { data: university, error: uniError } = await supabase
            .from("universities")
            .select("id, name, name_local, city, province, description, founded, ranking, total_students, international_students, features, website, accommodation_available, accommodation_description, accommodation_fee_range")
            .eq("id", universityId)
            .eq("portal_key", PORTAL_KEY)
            .single();

        if (uniError || !university) {
            return NextResponse.json({ error: "University not found" }, { status: 404 });
        }

        // Generate FAQs with OpenAI
        const prompt = buildUniversityFAQPrompt(university as UniversityData, validLocale);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
        });

        const content = completion.choices[0].message.content || "[]";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        let faqs: FAQItem[];
        try {
            faqs = JSON.parse(cleaned);
        } catch {
            console.error("Failed to parse university FAQ response:", cleaned);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        if (!Array.isArray(faqs) || faqs.length === 0) {
            return NextResponse.json({ error: "AI returned invalid FAQ format" }, { status: 500 });
        }

        // If overwriting, delete existing FAQs for this university+locale
        if (overwrite) {
            await supabase
                .from("university_faqs")
                .delete()
                .eq("university_id", universityId)
                .eq("locale", validLocale);
        }

        // Insert FAQs into database
        const faqRows = faqs.map((faq, index) => ({
            university_id: universityId,
            locale: validLocale,
            question: faq.question,
            answer: faq.answer,
            display_order: index + 1,
        }));

        const { error: insertError } = await supabase
            .from("university_faqs")
            .insert(faqRows);

        if (insertError) {
            console.error("Failed to insert university FAQs:", insertError);
            return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            universityId,
            locale: validLocale,
            universityName: university.name,
            count: faqs.length,
            faqs,
        });
    } catch (error: unknown) {
        console.error("University FAQ generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
