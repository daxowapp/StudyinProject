"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Check, X, AlertCircle, Globe } from "lucide-react";
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
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "fa", name: "Farsi", flag: "🇮🇷" },
    { code: "tr", name: "Turkish", flag: "🇹🇷" },
];

export function BulkTranslateButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [translations, setTranslations] = useState<TranslationStatus[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, error: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const abortRef = useRef(false);

    const fetchPrograms = async () => {
        setLoading(true);
        const supabase = createClient();

        const { data: programsData } = await supabase
            .from("v_university_programs_full")
            .select("id, display_title, program_title, program_description")
            .eq("is_active", true);

        const { data: existingTranslations } = await supabase
            .from("program_translations")
            .select("program_id, locale");

        const existingSet = new Set(
            existingTranslations?.map(t => `${t.program_id}_${t.locale}`) || []
        );

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
        setProgress({ current: 0, total: translationsNeeded.length, success: 0, error: 0 });
        setLoading(false);
    };

    const processTranslations = useCallback(async () => {
        setIsRunning(true);
        abortRef.current = false;
        const supabase = createClient();

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < translations.length; i++) {
            if (abortRef.current) break;

            const current = translations[i];
            const program = programs.find(p => p.id === current.programId);

            if (!program) {
                errorCount++;
                setTranslations(prev => prev.map((t, idx) =>
                    idx === i ? { ...t, status: "error", error: "Program not found" } : t
                ));
                setProgress(prev => ({ ...prev, current: i + 1, error: errorCount }));
                continue;
            }

            setTranslations(prev => prev.map((t, idx) =>
                idx === i ? { ...t, status: "processing" } : t
            ));

            try {
                const title = program.display_title || program.program_title;
                const description = program.program_description || "";

                const aiResponse = await fetch("/api/ai/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "translation",
                        query: `Translate to ${LOCALES.find(l => l.code === current.locale)?.name}: ${JSON.stringify({
                            name: title,
                            description: description,
                            features: []
                        })}`
                    }),
                });

                if (!aiResponse.ok) {
                    throw new Error(`API error: ${aiResponse.status}`);
                }

                const translatedData = await aiResponse.json();

                const { error: insertError } = await supabase
                    .from("program_translations")
                    .insert({
                        program_id: current.programId,
                        locale: current.locale,
                        title: translatedData.name || title,
                        description: translatedData.description || description,
                        requirements: [],
                        career_prospects: [],
                    });

                if (insertError) {
                    throw new Error(insertError.message);
                }

                successCount++;
                setTranslations(prev => prev.map((t, idx) =>
                    idx === i ? { ...t, status: "success" } : t
                ));
            } catch (error) {
                errorCount++;
                setTranslations(prev => prev.map((t, idx) =>
                    idx === i ? { ...t, status: "error", error: (error as Error).message } : t
                ));
            }

            setProgress(prev => ({ ...prev, current: i + 1, success: successCount, error: errorCount }));
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setIsRunning(false);
        toast.success(`Completed! ${successCount} translations generated, ${errorCount} failed.`);
    }, [translations, programs]);

    const handleOpen = () => {
        setOpen(true);
        fetchPrograms();
    };

    const handleClose = () => {
        if (isRunning) {
            if (!confirm("Translation is in progress. Stop and close?")) {
                return;
            }
            abortRef.current = true;
        }
        setOpen(false);
        setIsRunning(false);
        setTranslations([]);
        setProgress({ current: 0, total: 0, success: 0, error: 0 });
    };

    const getLocaleFlag = (code: string) => LOCALES.find(l => l.code === code)?.flag || "🌐";
    const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

    return (
        <>
            <Button variant="outline" onClick={handleOpen}>
                <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                Translate All
            </Button>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Bulk Translate Programs
                        </DialogTitle>
                        <DialogDescription>
                            Generate AI translations for Arabic, Farsi, and Turkish.
                        </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading programs...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Stats Bar */}
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{translations.length} translations</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                        <Check className="h-4 w-4" /> {progress.success}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-red-500 font-medium">
                                        <X className="h-4 w-4" /> {progress.error}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {(isRunning || progress.current > 0) && (
                                <div className="space-y-2">
                                    <Progress value={progressPercent} className="h-2" />
                                    <p className="text-xs text-center text-muted-foreground">
                                        {progress.current} of {progress.total} completed ({Math.round(progressPercent)}%)
                                    </p>
                                </div>
                            )}

                            {/* Translations List */}
                            <ScrollArea className="h-[320px] rounded-lg border">
                                <div className="divide-y">
                                    {translations.map((t, index) => (
                                        <div
                                            key={`${t.programId}-${t.locale}`}
                                            className={`flex items-center justify-between px-3 py-2.5 transition-colors ${t.status === "processing" ? "bg-blue-50 dark:bg-blue-950/30" :
                                                    t.status === "success" ? "bg-green-50/50 dark:bg-green-950/20" :
                                                        t.status === "error" ? "bg-red-50/50 dark:bg-red-950/20" :
                                                            ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className="text-base">{getLocaleFlag(t.locale)}</span>
                                                <span className="font-medium truncate text-sm">{t.programName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {t.status === "pending" && (
                                                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                                                        Pending
                                                    </span>
                                                )}
                                                {t.status === "processing" && (
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                )}
                                                {t.status === "success" && (
                                                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                                {t.status === "error" && (
                                                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                                                        <X className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {translations.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <Check className="h-10 w-10 text-green-500 mb-2" />
                                            <p className="font-medium">All Done!</p>
                                            <p className="text-sm">All programs have translations.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={handleClose}>
                                    {isRunning ? "Stop & Close" : "Close"}
                                </Button>
                                <Button
                                    onClick={processTranslations}
                                    disabled={isRunning || translations.length === 0}
                                    className="min-w-[140px]"
                                >
                                    {isRunning ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Translating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Start
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
