import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LOCALES = ["ar", "fa", "tr"];

export async function POST(_request: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Verify the request is from an authenticated admin
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
        }

        // Get all programs that need translations
        const { data: programs, error: programsError } = await supabase
            .from("v_university_programs_full")
            .select("id, display_title, program_title, program_description")
            .eq("is_active", true);

        if (programsError) {
            return NextResponse.json({ error: programsError.message }, { status: 500 });
        }

        if (!programs || programs.length === 0) {
            return NextResponse.json({ message: "No programs found" }, { status: 200 });
        }

        // Get existing translations to avoid duplicates
        const { data: existingTranslations } = await supabase
            .from("program_translations")
            .select("program_id, locale");

        const existingSet = new Set(
            existingTranslations?.map(t => `${t.program_id}_${t.locale}`) || []
        );

        let generatedCount = 0;
        let skippedCount = 0;
        const errors: string[] = [];

        // Process each program
        for (const program of programs) {
            const title = program.display_title || program.program_title;
            const description = program.program_description || "";

            // Skip if no content to translate
            if (!title && !description) {
                skippedCount++;
                continue;
            }

            // Generate translations for each locale
            for (const locale of LOCALES) {
                // Skip if translation already exists
                if (existingSet.has(`${program.id}_${locale}`)) {
                    skippedCount++;
                    continue;
                }

                try {
                    // Call the AI generation endpoint
                    const targetLang = locale === 'ar' ? 'Arabic' : locale === 'fa' ? 'Farsi' : 'Turkish';
                    const prompt = `You are a professional educational translator. Translate this content into ${targetLang}.
Context: This is a university program description for an international student platform.

Rules:
1. Translate both 'title' and 'description' accurately.
2. Keep the translation natural and professional.
3. Do not add any conversational text.
4. MUST return ONLY a valid JSON object.

Input JSON:
${JSON.stringify({ title, description })}

Output JSON format (must match this exactly):
{
  "title": "translated title",
  "description": "translated description"
}`;
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
                    
                    const aiResponse = await fetch(geminiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ role: "user", parts: [{ text: prompt }] }],
                            systemInstruction: {
                                role: "system",
                                parts: [{ text: "You are a professional translator. ALWAYS return valid JSON matching the requested structure. NEVER return markdown formatting like \`\`\`json" }]
                            },
                            generationConfig: {
                                temperature: 0.3,
                                responseMimeType: "application/json"
                            }
                        }),
                    });

                    if (!aiResponse.ok) {
                        const errText = await aiResponse.text();
                        console.error('Gemini error:', errText);
                        errors.push(`Failed to translate program ${program.id} to ${locale}`);
                        continue;
                    }

                    const aiData = await aiResponse.json();
                    const textContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (!textContent) {
                        errors.push(`No translation returned for program ${program.id} to ${locale}`);
                        continue;
                    }

                    let translatedData;
                    try {
                        translatedData = JSON.parse(textContent);
                    } catch (_e) {
                        console.error('Failed to parse Gemini JSON:', textContent);
                        errors.push(`Invalid JSON returned for program ${program.id} to ${locale}`);
                        continue;
                    }

                    // Save translation to database
                    const { error: insertError } = await supabase
                        .from("program_translations")
                        .insert({
                            program_id: program.id,
                            locale: locale,
                            title: translatedData.title || title,
                            description: translatedData.description || description,
                            requirements: translatedData.requirements || [],
                            career_prospects: translatedData.career_prospects || [],
                        });

                    if (insertError) {
                        errors.push(`Failed to save translation for program ${program.id} to ${locale}: ${insertError.message}`);
                    } else {
                        generatedCount++;
                    }
                } catch (err) {
                    errors.push(`Error processing program ${program.id} for ${locale}: ${(err as Error).message}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Generated ${generatedCount} translations, skipped ${skippedCount} (already exist or no content)`,
            generatedCount,
            skippedCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error("Bulk translation error:", error);
        return NextResponse.json(
            { error: "Failed to generate translations" },
            { status: 500 }
        );
    }
}
