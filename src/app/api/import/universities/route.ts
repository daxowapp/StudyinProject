import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export const maxDuration = 300;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function generateUniversityData(name: string, location: string) {
  const prompt = `You are a Chinese university data expert. Generate accurate data for this Chinese university.

University Name: ${name}
Known Location: ${location || "Unknown"}

Return a JSON object with these fields:
{
  "city": "city name in English (e.g. Beijing, Shanghai)",
  "province": "province name in English (e.g. Beijing, Guangdong)",
  "description": "A compelling 2-3 sentence description of this university for international students. Mention key strengths, rankings, and what makes it attractive.",
  "website": "official website URL (e.g. https://example.edu.cn)",
  "ranking": "approximate QS/THE ranking range or domestic ranking if unranked globally (e.g. 'Top 100 China', 'QS 301-350')",
  "founded_year": "year founded as string (e.g. '1952')",
  "features": ["list of notable features like '985 Project', '211 Project', 'Double First-Class', 'C9 League', etc."]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text. If you are unsure about a field, provide your best estimate. For lesser-known institutions, provide reasonable data based on what you know.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 500,
  });

  const content = completion.choices[0].message.content || "{}";
  // Clean up potential markdown formatting
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  
  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse AI response:", cleaned);
    return {
      city: location || "Unknown",
      province: "",
      description: `${name} is a university in China offering programs for international students.`,
      website: "",
      ranking: "",
      founded_year: "",
      features: [],
    };
  }
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const body = await request.json();
        const { universities } = body as {
          universities: Array<{
            name: string;
            location: string;
            programCount: number;
          }>;
        };

        if (!universities || universities.length === 0) {
          send({ type: "error", message: "No universities provided" });
          controller.close();
          return;
        }

        const supabase = await createAdminClient();
        let processed = 0;
        let created = 0;
        let skipped = 0;
        let errors = 0;

        send({
          type: "start",
          total: universities.length,
          message: `Starting import of ${universities.length} universities...`,
        });

        for (const uni of universities) {
          processed++;

          // Check if already exists
          const { data: existing } = await supabase
            .from("universities")
            .select("id, name")
            .ilike("name", uni.name.trim())
            .limit(1);

          if (existing && existing.length > 0) {
            skipped++;
            send({
              type: "progress",
              processed,
              created,
              skipped,
              errors,
              current: uni.name,
              status: "skipped",
              message: `⏭️ Skipped: ${uni.name} (already exists)`,
              dbId: existing[0].id,
            });
            continue;
          }

          // Generate data with OpenAI
          send({
            type: "progress",
            processed,
            created,
            skipped,
            errors,
            current: uni.name,
            status: "generating",
            message: `🤖 Generating data for: ${uni.name}...`,
          });

          try {
            const aiData = await generateUniversityData(uni.name, uni.location);
            const slug = slugify(uni.name);

            // Check slug doesn't already exist
            const { data: slugCheck } = await supabase
              .from("universities")
              .select("id")
              .eq("slug", slug)
              .limit(1);

            const finalSlug = slugCheck && slugCheck.length > 0
              ? `${slug}-${Date.now()}`
              : slug;

            const { data: inserted, error: insertError } = await supabase
              .from("universities")
              .insert({
                name: uni.name.trim(),
                slug: finalSlug,
                city: aiData.city || "Unknown",
                province: aiData.province || null,
                description: aiData.description || null,
                website: aiData.website || null,
                ranking: aiData.ranking || null,
                founded_year: aiData.founded_year || null,
                features: aiData.features || [],
              })
              .select("id")
              .single();

            if (insertError) {
              errors++;
              send({
                type: "progress",
                processed,
                created,
                skipped,
                errors,
                current: uni.name,
                status: "error",
                message: `❌ Error inserting ${uni.name}: ${insertError.message}`,
              });
            } else {
              created++;
              send({
                type: "progress",
                processed,
                created,
                skipped,
                errors,
                current: uni.name,
                status: "created",
                message: `✅ Created: ${uni.name} (${aiData.city})`,
                dbId: inserted?.id,
                aiData,
              });
            }
          } catch (aiError: any) {
            errors++;
            send({
              type: "progress",
              processed,
              created,
              skipped,
              errors,
              current: uni.name,
              status: "error",
              message: `❌ AI Error for ${uni.name}: ${aiError.message}`,
            });
          }

          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        send({
          type: "complete",
          processed,
          created,
          skipped,
          errors,
          message: `Import complete! Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`,
        });
      } catch (error: any) {
        send({ type: "error", message: error.message });
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
