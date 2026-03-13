import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const { type, query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        if (type === "university") {
            const prompt = `You are a Chinese university data expert. Generate accurate data for this Chinese university.

University Name: ${query}

Return a JSON object with these fields:
{
  "name": "official English name",
  "name_local": "Chinese name (中文名称)",
  "city": "city name in English (e.g. Beijing, Shanghai)",
  "province": "province name in English (e.g. Beijing, Guangdong)",
  "description": "A compelling 2-3 sentence description of this university for international students. Mention key strengths, rankings, and what makes it attractive.",
  "website": "official website URL (e.g. https://example.edu.cn)",
  "ranking": "approximate QS/THE ranking range or domestic ranking if unranked globally (e.g. 'Top 100 China', 'QS 301-350')",
  "founded": "year founded as string (e.g. '1952')",
  "total_students": "approximate total students as string (e.g. '30000')",
  "international_students": "approximate international students as string (e.g. '2000')",
  "features": ["list of notable features like '985 Project', '211 Project', 'Double First-Class', 'C9 League', etc."],
  "latitude": "latitude as string (e.g. '39.9042')",
  "longitude": "longitude as string (e.g. '116.4074')",
  "address": "full street address in English (e.g. '1 Zhongguancun North Street, Haidian District, Beijing, China 100871')"
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text.`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 800,
            });

            const content = completion.choices[0].message.content || "{}";
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

            try {
                const data = JSON.parse(cleaned);
                return NextResponse.json(data);
            } catch {
                console.error("Failed to parse AI response:", cleaned);
                return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
            }
        } else if (type === "program") {
            const prompt = `You are a Chinese university program expert. Generate accurate data for this program.

Program: ${query}

Return a JSON object with these fields:
{
  "name": "official program name in English",
  "description": "A compelling 2-3 sentence description of this program for international students.",
  "duration": "program duration (e.g. '4 years')",
  "tuition_fee": "approximate annual tuition in CNY as number",
  "language": "teaching language (e.g. 'English', 'Chinese', 'English/Chinese')",
  "degree_level": "degree level (e.g. 'Bachelor', 'Master', 'PhD')"
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text.`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 500,
            });

            const content = completion.choices[0].message.content || "{}";
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

            try {
                const data = JSON.parse(cleaned);
                return NextResponse.json(data);
            } catch {
                console.error("Failed to parse AI response:", cleaned);
                return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
            }
        } else if (type === "translation") {
            // Handle translation requests
            const prompt = query;
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 2000,
            });

            const content = completion.choices[0].message.content || "{}";
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

            try {
                const data = JSON.parse(cleaned);
                return NextResponse.json(data);
            } catch {
                return NextResponse.json({ raw: cleaned });
            }
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error: unknown) {
        console.error("AI generate error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
