import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LOCALES = ["ar", "fa", "tr"];

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

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
                    const aiResponse = await fetch(`${request.nextUrl.origin}/api/ai/generate`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            type: "program_translation",
                            query: `Translate to ${locale === "ar" ? "Arabic" : locale === "fa" ? "Farsi" : "Turkish"}: ${JSON.stringify({ title, description })}`
                        }),
                    });

                    if (!aiResponse.ok) {
                        errors.push(`Failed to translate program ${program.id} to ${locale}`);
                        continue;
                    }

                    const translatedData = await aiResponse.json();

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
