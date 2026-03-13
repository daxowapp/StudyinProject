import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { PORTAL_KEY } from "@/lib/constants/portal";

export const maxDuration = 300;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateUniversityData(name: string) {
    const prompt = `You are a Chinese university data expert. Generate accurate data for this Chinese university.

University Name: ${name}

Return a JSON object with these fields:
{
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
  "university_type": "one of: Public, Private, Research, Comprehensive, Specialized, Vocational"
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text. If you are unsure about a field, provide your best estimate.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
    });

    const content = completion.choices[0].message.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        console.error("Failed to parse AI response for", name, ":", cleaned);
        return null;
    }
}

function needsAutofill(uni: Record<string, unknown>): boolean {
    // A university needs autofill if it's missing key fields
    const keyFields = ["description", "founded", "latitude", "longitude"];
    return keyFields.some(field => !uni[field]);
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
                const onlyEmpty = body.onlyEmpty !== false; // default true: skip already-filled universities

                const supabase = await createAdminClient();

                // Only select the columns we actually need (avoids statement timeout on large tables)
                const selectCols = "id, name, name_local, city, province, description, website, founded, total_students, international_students, ranking, features, latitude, longitude, university_type";

                // Paginated fetch to avoid Supabase's 1000-row limit and statement timeout
                const universities: Record<string, unknown>[] = [];
                const PAGE_SIZE = 500;
                let page = 0;
                let hasMore = true;

                while (hasMore) {
                    const from = page * PAGE_SIZE;
                    const to = from + PAGE_SIZE - 1;
                    const { data, error } = await supabase
                        .from("universities")
                        .select(selectCols)
                        .eq("portal_key", PORTAL_KEY)
                        .order("name")
                        .range(from, to);

                    if (error) {
                        send({ type: "error", message: `Failed to fetch universities: ${error.message}` });
                        controller.close();
                        return;
                    }

                    if (data && data.length > 0) {
                        universities.push(...data);
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

                // Filter to those needing autofill
                const toProcess = onlyEmpty
                    ? universities.filter(needsAutofill)
                    : universities;

                send({
                    type: "start",
                    total: toProcess.length,
                    totalAll: universities.length,
                    skippedAlreadyFilled: universities.length - toProcess.length,
                    message: `Starting AI autofill for ${toProcess.length} universities (${universities.length - toProcess.length} already have data)...`,
                });

                let processed = 0;
                let updated = 0;
                let errors = 0;

                for (const uni of toProcess) {
                    processed++;
                    const uniName = uni.name as string;

                    send({
                        type: "progress",
                        processed,
                        total: toProcess.length,
                        updated,
                        errors,
                        current: uniName,
                        status: "generating",
                        message: `🤖 Generating data for: ${uniName}...`,
                    });

                    try {
                        const aiData = await generateUniversityData(uniName);

                        if (!aiData) {
                            errors++;
                            send({
                                type: "progress",
                                processed,
                                total: toProcess.length,
                                updated,
                                errors,
                                current: uniName,
                                status: "error",
                                message: `❌ Failed to parse AI data for: ${uniName}`,
                            });
                            continue;
                        }

                        // Build update object - only update fields that are currently empty
                        const updateData: Record<string, unknown> = {};
                        const uniFeatures = uni.features as unknown[] | null;
                        if (!uni.name_local && aiData.name_local) updateData.name_local = aiData.name_local;
                        if (!uni.description && aiData.description) updateData.description = aiData.description;
                        if (!uni.website && aiData.website) updateData.website = aiData.website;
                        if (!uni.founded && aiData.founded) updateData.founded = aiData.founded;
                        if (!uni.total_students && aiData.total_students) updateData.total_students = aiData.total_students;
                        if (!uni.international_students && aiData.international_students) updateData.international_students = aiData.international_students;
                        if (!uni.ranking && aiData.ranking) updateData.ranking = aiData.ranking;
                        if ((!uniFeatures || uniFeatures.length === 0) && aiData.features) updateData.features = aiData.features;
                        if (!uni.latitude && aiData.latitude) updateData.latitude = aiData.latitude;
                        if (!uni.longitude && aiData.longitude) updateData.longitude = aiData.longitude;
                        if (!uni.university_type && aiData.university_type) updateData.university_type = aiData.university_type;
                        // Fill city/province if missing
                        if (!uni.city && aiData.city) updateData.city = aiData.city;
                        if (!uni.province && aiData.province) updateData.province = aiData.province;

                        if (Object.keys(updateData).length === 0) {
                            send({
                                type: "progress",
                                processed,
                                total: toProcess.length,
                                updated,
                                errors,
                                current: uniName,
                                status: "skipped",
                                message: `⏭️ No empty fields to update for: ${uniName}`,
                            });
                            continue;
                        }

                        // Update in database
                        const { error: updateError } = await supabase
                            .from("universities")
                            .update(updateData)
                            .eq("id", uni.id);

                        if (updateError) {
                            errors++;
                            send({
                                type: "progress",
                                processed,
                                total: toProcess.length,
                                updated,
                                errors,
                                current: uniName,
                                status: "error",
                                message: `❌ DB error for ${uniName}: ${updateError.message}`,
                            });
                        } else {
                            updated++;
                            const fieldsUpdated = Object.keys(updateData).join(", ");
                            send({
                                type: "progress",
                                processed,
                                total: toProcess.length,
                                updated,
                                errors,
                                current: uniName,
                                status: "updated",
                                message: `✅ Updated: ${uniName} (${fieldsUpdated})`,
                            });
                        }
                    } catch (aiError: unknown) {
                        errors++;
                        const msg = aiError instanceof Error ? aiError.message : "Unknown error";
                        send({
                            type: "progress",
                            processed,
                            total: toProcess.length,
                            updated,
                            errors,
                            current: uniName,
                            status: "error",
                            message: `❌ AI Error for ${uniName}: ${msg}`,
                        });
                    }

                    // Small delay to avoid rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                send({
                    type: "complete",
                    processed,
                    updated,
                    errors,
                    message: `✅ Bulk autofill complete! Updated: ${updated}, Errors: ${errors}`,
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
