import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ terms: [] });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{
                role: "system",
                content: `You are an academic search assistant. The user searches for a term, and you must return a JSON object with a "terms" array containing 5-8 related academic search terms, program names, or major synonyms. Focus on university degrees.

IMPORTANT:
1. First correct any typos, misspellings, or phonetic approximations in the user's query.
2. **ALWAYS RETURN THE TERMS IN ENGLISH**, regardless of the language the user searches in. The system only contains English program names.
3. If the user searches in Arabic, Chinese, Turkish, etc., translate their intent to the corresponding English academic terms.

Examples:
User: "softwore" (typo for software)
Response: {"terms": ["Software Engineering", "Computer Science", "Information Technology", "Web Development", "Programming"]}

User: "mangmnet" (typo for management)
Response: {"terms": ["Business Management", "Business Administration", "Project Management", "Marketing", "Economics", "Human Resources"]}

User: "كمبيوتر" (Arabic for Computer)
Response: {"terms": ["Computer Science", "Software Engineering", "Information Technology", "Data Science", "Artificial Intelligence"]}

User: "medicina" (Spanish for Medicine)
Response: {"terms": ["Medicine", "Clinical Medicine", "MBBS", "Pharmacy", "Nursing", "Biomedical"]}

User: "ai"
Response: {"terms": ["Artificial Intelligence", "Computer Science", "Machine Learning", "Data Science", "Robotics"]}

User: "medcine" (typo for medicine)
Response: {"terms": ["Medicine", "Clinical Medicine", "MBBS", "Pharmacy", "Nursing", "Biomedical"]}`
            },
            {
                role: "user",
                content: query
            }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const content = completion.choices[0].message.content;
        if (!content) return NextResponse.json({ terms: [query] });

        const result = JSON.parse(content);
        // Handle various potential JSON structures (terms, keywords, or just array in a key)
        const terms = Array.isArray(result.terms) ? result.terms :
            Array.isArray(result) ? result :
                [query];

        return NextResponse.json({ terms });

    } catch (error) {
        console.error('AI Search Error:', error);
        // Fallback to original query on error
        return NextResponse.json({ terms: [query] });
    }
}
