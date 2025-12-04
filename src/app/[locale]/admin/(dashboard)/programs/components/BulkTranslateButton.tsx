"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Program {
    id: string;
    display_title: string;
    program_title: string;
    program_description: string;
}

interface TranslationStatus {
    programId: string;
    programName: string;
    locale: string;
    status: "pending" | "processing" | "success" | "error";
    error?: string;
}

const LOCALES = [
    { code: "ar", name: "Arabic" },
    { code: "fa", name: "Farsi" },
    { code: "tr", name: "Turkish" },
];

export function BulkTranslateButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [translations, setTranslations] = useState<TranslationStatus[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const fetchPrograms = async () => {
        setLoading(true);
        const supabase = createClient();

        // Get all active programs
        const { data: programsData } = await supabase
            .from("v_university_programs_full")
            .select("id, display_title, program_title, program_description")
            .eq("is_active", true);

        // Get existing translations
        const { data: existingTranslations } = await supabase
            .from("program_translations")
            .select("program_id, locale");

        const existingSet = new Set(
            existingTranslations?.map(t => `${t.program_id}_${t.locale}`) || []
        );

        // Filter programs that need translations
        const translationsNeeded: TranslationStatus[] = [];

        programsData?.forEach(program => {
            LOCALES.forEach(locale => {
                if (!existingSet.has(`${program.id}_${locale.code}`)) {
                    translationsNeeded.push({
                        programId: program.id,
                        programName: program.display_title || program.program_title,
                        locale: locale.code,
                        status: "pending"
                    });
                }
            });
        });

        setPrograms(programsData || []);
        setTranslations(translationsNeeded);
        setLoading(false);
    };

    const startTranslation = async () => {
        setIsRunning(true);
        setCurrentIndex(0);
    };

    useEffect(() => {
        if (!isRunning || currentIndex >= translations.length) {
            if (currentIndex >= translations.length && translations.length > 0) {
                setIsRunning(false);
                const successCount = translations.filter(t => t.status === "success").length;
                toast.success(`Completed! ${successCount} translations generated.`);
            }
            return;
        }

        const processCurrentTranslation = async () => {
            const current = translations[currentIndex];

            // Update status to processing
            setTranslations(prev => prev.map((t, i) =>
                i === currentIndex ? { ...t, status: "processing" } : t
            ));

            try {
                const supabase = createClient();
                const program = programs.find(p => p.id === current.programId);

                if (!program) {
                    throw new Error("Program not found");
                }

                const title = program.display_title || program.program_title;
                const description = program.program_description || "";

                // Call AI to generate translation
                const aiResponse = await fetch("/api/ai/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "program_translation",
                        query: `Translate to ${LOCALES.find(l => l.code === current.locale)?.name}: ${JSON.stringify({ title, description })}`
                    }),
                });

                if (!aiResponse.ok) {
                    throw new Error("AI generation failed");
                }

                const translatedData = await aiResponse.json();

                // Save to database
                const { error: insertError } = await supabase
                    .from("program_translations")
                    .insert({
                        program_id: current.programId,
                        locale: current.locale,
                        title: translatedData.title || title,
                        description: translatedData.description || description,
                        requirements: translatedData.requirements || [],
                        career_prospects: translatedData.career_prospects || [],
                    });

                if (insertError) {
                    throw new Error(insertError.message);
                }

                // Mark as success
                setTranslations(prev => prev.map((t, i) =>
                    i === currentIndex ? { ...t, status: "success" } : t
                ));
            } catch (error) {
                // Mark as error
                setTranslations(prev => prev.map((t, i) =>
                    i === currentIndex ? { ...t, status: "error", error: (error as Error).message } : t
                ));
            }

            // Move to next
            setCurrentIndex(prev => prev + 1);
        };

        processCurrentTranslation();
    }, [isRunning, currentIndex, translations, programs]);

    const handleOpen = () => {
        setOpen(true);
        fetchPrograms();
    };

    const handleClose = () => {
        if (isRunning) {
            if (!confirm("Translation is in progress. Are you sure you want to close?")) {
                return;
            }
        }
        setOpen(false);
        setIsRunning(false);
        setTranslations([]);
        setCurrentIndex(0);
    };

    const successCount = translations.filter(t => t.status === "success").length;
    const errorCount = translations.filter(t => t.status === "error").length;
    const progress = translations.length > 0 ? (currentIndex / translations.length) * 100 : 0;

    return (
        <>
            <Button variant="outline" onClick={handleOpen}>
                <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                Translate All Programs
            </Button>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Bulk Translate Programs</DialogTitle>
                        <DialogDescription>
                            Generate AI translations for all programs in Arabic, Farsi, and Turkish.
                        </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm">
                                <span>{translations.length} translations needed</span>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Check className="h-4 w-4" /> {successCount}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-600">
                                        <X className="h-4 w-4" /> {errorCount}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {isRunning && (
                                <div className="space-y-2">
                                    <Progress value={progress} />
                                    <p className="text-sm text-center text-muted-foreground">
                                        {currentIndex} / {translations.length} completed
                                    </p>
                                </div>
                            )}

                            {/* Translations List */}
                            <ScrollArea className="h-[400px] border rounded-lg p-2">
                                <div className="space-y-1">
                                    {translations.map((t, index) => (
                                        <div
                                            key={`${t.programId}-${t.locale}`}
                                            className={`flex items-center justify-between p-2 rounded text-sm ${t.status === "processing" ? "bg-blue-50 dark:bg-blue-950" :
                                                    t.status === "success" ? "bg-green-50 dark:bg-green-950" :
                                                        t.status === "error" ? "bg-red-50 dark:bg-red-950" :
                                                            "bg-muted/50"
                                                }`}
                                        >
                                            <div className="flex-1 truncate">
                                                <span className="font-medium">{t.programName}</span>
                                                <span className="text-muted-foreground ml-2">({t.locale.toUpperCase()})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {t.status === "pending" && (
                                                    <span className="text-muted-foreground">Pending</span>
                                                )}
                                                {t.status === "processing" && (
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                )}
                                                {t.status === "success" && (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                )}
                                                {t.status === "error" && (
                                                    <div className="flex items-center gap-1 text-red-600">
                                                        <AlertCircle className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {translations.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            All programs already have translations!
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={startTranslation}
                                    disabled={isRunning || translations.length === 0}
                                >
                                    {isRunning ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Translating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Start Translation
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
