import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { universityId, universityName, city, province } = await request.json();

        if (!universityId || !universityName) {
            return NextResponse.json(
                { error: "universityId and universityName are required" },
                { status: 400 }
            );
        }

        const prompt = `You are a Chinese geography expert. Provide the accurate street address for this Chinese university.

University: ${universityName}
City: ${city || "Unknown"}
Province: ${province || "Unknown"}

Return ONLY a JSON object:
{
  "address": "Full street address in English (e.g. '1 Zhongguancun North Street, Haidian District, Beijing, China 100871')"
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 200,
        });

        const content = completion.choices[0].message.content || "{}";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        let data;
        try {
            data = JSON.parse(cleaned);
        } catch {
            console.error("Failed to parse AI response:", cleaned);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        if (data.address) {
            const { error } = await supabase
                .from("universities")
                .update({ address: data.address })
                .eq("id", universityId);

            if (error) {
                console.error("Failed to save address:", error);
                return NextResponse.json({ error: "Failed to save address to database" }, { status: 500 });
            }
        }

        return NextResponse.json({ address: data.address });
    } catch (error: unknown) {
        console.error("Generate address error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
