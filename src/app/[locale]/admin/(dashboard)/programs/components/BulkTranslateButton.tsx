"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Check, X, Globe, RotateCcw } from "lucide-react";
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
    status: "existing" | "pending" | "processing" | "success" | "error";
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
    const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, error: 0, existing: 0 });
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

        const allTranslations: TranslationStatus[] = [];
        let existingCount = 0;

        programsData?.forEach(program => {
            LOCALES.forEach(locale => {
                const key = `${program.id}_${locale.code}`;
                const exists = existingSet.has(key);
                if (exists) existingCount++;

                allTranslations.push({
                    programId: program.id,
                    programName: program.display_title || program.program_title,
                    locale: locale.code,
                    status: exists ? "existing" : "pending"
                });
            });
        });

        setPrograms(programsData || []);
        setTranslations(allTranslations);
        setProgress({
            current: 0,
            total: allTranslations.filter(t => t.status === "pending").length,
            success: 0,
            error: 0,
            existing: existingCount
        });
        setLoading(false);
    };

    const processTranslations = useCallback(async (retryFailed = false) => {
        setIsRunning(true);
        abortRef.current = false;
        const supabase = createClient();

        // Get items to process
        const itemsToProcess = translations
            .map((t, idx) => ({ ...t, originalIndex: idx }))
            .filter(t => retryFailed ? t.status === "error" : t.status === "pending");

        let successCount = progress.success;
        let errorCount = retryFailed ? 0 : progress.error;
        let processed = 0;

        setProgress(prev => ({ ...prev, total: itemsToProcess.length, current: 0 }));

        for (const item of itemsToProcess) {
            if (abortRef.current) break;

            const program = programs.find(p => p.id === item.programId);

            if (!program) {
                errorCount++;
                setTranslations(prev => prev.map((t, idx) =>
                    idx === item.originalIndex ? { ...t, status: "error", error: "Program not found" } : t
                ));
                processed++;
                setProgress(prev => ({ ...prev, current: processed, error: errorCount }));
                continue;
            }

            setTranslations(prev => prev.map((t, idx) =>
                idx === item.originalIndex ? { ...t, status: "processing" } : t
            ));

            try {
                const title = program.display_title || program.program_title;
                const description = program.program_description || "";

                const aiResponse = await fetch("/api/ai/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "translation",
                        query: `Translate to ${LOCALES.find(l => l.code === item.locale)?.name}: ${JSON.stringify({
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
                    .upsert({
                        program_id: item.programId,
                        locale: item.locale,
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
                    idx === item.originalIndex ? { ...t, status: "success" } : t
                ));
            } catch (error) {
                errorCount++;
                setTranslations(prev => prev.map((t, idx) =>
                    idx === item.originalIndex ? { ...t, status: "error", error: (error as Error).message } : t
                ));
            }

            processed++;
            setProgress(prev => ({ ...prev, current: processed, success: successCount, error: errorCount }));
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setIsRunning(false);
        toast.success(`Completed! ${successCount} translations generated, ${errorCount} failed.`);
    }, [translations, programs, progress.success, progress.error]);

    const retryFailed = () => {
        processTranslations(true);
    };

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
        setProgress({ current: 0, total: 0, success: 0, error: 0, existing: 0 });
    };

    const getLocaleFlag = (code: string) => LOCALES.find(l => l.code === code)?.flag || "🌐";
    const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
    const pendingCount = translations.filter(t => t.status === "pending").length;
    const errorCount = translations.filter(t => t.status === "error").length;
    const successCount = translations.filter(t => t.status === "success" || t.status === "existing").length;

    return (
        <>
            <Button variant="outline" onClick={handleOpen}>
                <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                Translate All
            </Button>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh]">
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
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="font-medium">{successCount} Done</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                        <span className="font-medium">{pendingCount} Pending</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        <span className="font-medium">{errorCount} Failed</span>
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {translations.length} total
                                </span>
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
                            <ScrollArea className="h-[350px] rounded-lg border">
                                <div className="divide-y">
                                    {translations.map((t) => (
                                        <div
                                            key={`${t.programId}-${t.locale}`}
                                            className={`flex items-center justify-between px-3 py-2 transition-colors ${t.status === "processing" ? "bg-blue-50 dark:bg-blue-950/30" :
                                                    t.status === "success" ? "bg-green-50/50 dark:bg-green-950/20" :
                                                        t.status === "existing" ? "bg-green-50/30 dark:bg-green-950/10" :
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
                                                {(t.status === "success" || t.status === "existing") && (
                                                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                                {t.status === "error" && (
                                                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center" title={t.error}>
                                                        <X className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {translations.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <Check className="h-10 w-10 text-green-500 mb-2" />
                                            <p className="font-medium">No programs found</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <div className="flex justify-between gap-2 pt-2">
                                <div>
                                    {errorCount > 0 && !isRunning && (
                                        <Button variant="outline" onClick={retryFailed}>
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Retry {errorCount} Failed
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handleClose}>
                                        {isRunning ? "Stop & Close" : "Close"}
                                    </Button>
                                    <Button
                                        onClick={() => processTranslations(false)}
                                        disabled={isRunning || pendingCount === 0}
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
                                                Start ({pendingCount})
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
