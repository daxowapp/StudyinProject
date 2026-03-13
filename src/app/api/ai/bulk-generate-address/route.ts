import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();
    const { overwrite = false } = await request.json().catch(() => ({}));

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: string, data: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            try {
                // Fetch universities
                let query = supabase
                    .from("universities")
                    .select("id, name, city, province, address")
                    .order("name");

                if (!overwrite) {
                    query = query.is("address", null);
                }

                const { data: universities, error } = await query;

                if (error || !universities) {
                    send("error", { message: "Failed to fetch universities" });
                    controller.close();
                    return;
                }

                send("info", {
                    message: `Found ${universities.length} universities to process`,
                    total: universities.length,
                });

                let processed = 0;
                let generated = 0;
                let errors = 0;

                for (const uni of universities) {
                    try {
                        const prompt = `You are a Chinese geography expert. Provide the accurate street address for this Chinese university.

University: ${uni.name}
City: ${uni.city || "Unknown"}
Province: ${uni.province || "Unknown"}

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
                        const data = JSON.parse(cleaned);

                        if (data.address) {
                            await supabase
                                .from("universities")
                                .update({ address: data.address })
                                .eq("id", uni.id);
                            generated++;
                        }

                        processed++;
                        send("progress", {
                            processed,
                            generated,
                            errors,
                            total: universities.length,
                            current: uni.name,
                            address: data.address || null,
                        });

                        // Rate limit: 200ms between requests
                        await new Promise((r) => setTimeout(r, 200));
                    } catch (err) {
                        errors++;
                        processed++;
                        send("progress", {
                            processed,
                            generated,
                            errors,
                            total: universities.length,
                            current: uni.name,
                            error: err instanceof Error ? err.message : "Unknown error",
                        });
                    }
                }

                send("done", { processed, generated, errors });
            } catch (err) {
                send("error", {
                    message: err instanceof Error ? err.message : "Unknown error",
                });
            }

            controller.close();
        },
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
