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

interface ProgramData {
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

function buildFAQPrompt(program: ProgramData, locale: string): string {
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

export async function POST(request: NextRequest) {
    try {
        const { programId, locale = "en", overwrite } = await request.json();

        if (!programId) {
            return NextResponse.json({ error: "programId is required" }, { status: 400 });
        }

        const validLocale = LOCALE_LANGUAGES[locale] ? locale : "en";
        const supabase = await createAdminClient();

        // Check if FAQs already exist for this program+locale
        if (!overwrite) {
            const { count } = await supabase
                .from("program_faqs")
                .select("id", { count: "exact", head: true })
                .eq("program_id", programId)
                .eq("locale", validLocale);

            if (count && count > 0) {
                return NextResponse.json({
                    message: `FAQs already exist for this program in ${validLocale}`,
                    count,
                    skipped: true,
                });
            }
        }

        // Fetch program data
        const { data: program, error: programError } = await supabase
            .from("v_university_programs_full")
            .select("id, program_title, display_title, university_name, level, duration, language_name, city, tuition_fee, currency, intake, program_description, gpa_requirement, score_ielts, score_toefl")
            .eq("id", programId)
            .eq("portal_key", PORTAL_KEY)
            .single();

        if (programError || !program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        // Generate FAQs with OpenAI
        const prompt = buildFAQPrompt(program as ProgramData, validLocale);

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
            console.error("Failed to parse FAQ response:", cleaned);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        if (!Array.isArray(faqs) || faqs.length === 0) {
            return NextResponse.json({ error: "AI returned invalid FAQ format" }, { status: 500 });
        }

        // If overwriting, delete existing FAQs for this program+locale
        if (overwrite) {
            await supabase
                .from("program_faqs")
                .delete()
                .eq("program_id", programId)
                .eq("locale", validLocale);
        }

        // Insert FAQs into database
        const faqRows = faqs.map((faq, index) => ({
            program_id: programId,
            locale: validLocale,
            question: faq.question,
            answer: faq.answer,
            display_order: index + 1,
        }));

        const { error: insertError } = await supabase
            .from("program_faqs")
            .insert(faqRows);

        if (insertError) {
            console.error("Failed to insert FAQs:", insertError);
            return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            programId,
            locale: validLocale,
            programName: program.display_title || program.program_title,
            universityName: program.university_name,
            count: faqs.length,
            faqs,
        });
    } catch (error: unknown) {
        console.error("FAQ generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
