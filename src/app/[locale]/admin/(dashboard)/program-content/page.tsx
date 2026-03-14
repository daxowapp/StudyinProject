"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    Loader2,
    Globe,
    CheckCircle2,
    XCircle,
    RotateCcw,
    PlayCircle,
    Languages,
    BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ALL_LOCALES = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "tr", label: "Turkish", flag: "🇹🇷" },
    { code: "ar", label: "Arabic", flag: "🇸🇦" },
    { code: "fa", label: "Persian", flag: "🇮🇷" },
    { code: "tk", label: "Turkmen", flag: "🇹🇲" },
    { code: "zh", label: "Chinese", flag: "🇨🇳" },
    { code: "fr", label: "French", flag: "🇫🇷" },
    { code: "es", label: "Spanish", flag: "🇪🇸" },
    { code: "ru", label: "Russian", flag: "🇷🇺" },
];

interface LogEntry {
    type: "info" | "success" | "error" | "warning";
    message: string;
    timestamp: string;
}

interface LocaleStats {
    locale: string;
    count: number;
}

function useSSEGenerator(apiEndpoint: string, tableName: string, entityIdField: string, entityCountTable: string) {
    const [selectedLocales, setSelectedLocales] = useState<Set<string>>(new Set(["en"]));
    const [overwrite, setOverwrite] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState({ processed: 0, total: 0, generated: 0, errors: 0 });
    const [localeStats, setLocaleStats] = useState<LocaleStats[]>([]);
    const [totalEntities, setTotalEntities] = useState(0);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const logEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const addLog = useCallback((type: LogEntry["type"], message: string) => {
        setLogs(prev => [
            ...prev,
            { type, message, timestamp: new Date().toLocaleTimeString() },
        ]);
    }, []);

    const fetchStats = useCallback(async () => {
        setIsLoadingStats(true);
        try {
            const supabase = createClient();

            const { count: entityCount } = await supabase
                .from(entityCountTable)
                .select("id", { count: "exact", head: true });

            setTotalEntities(entityCount || 0);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allPairs: any[] = [];
            let page = 0;
            let hasMore = true;
            while (hasMore) {
                const from = page * 1000;
                const to = from + 999;
                const { data } = await supabase
                    .from(tableName)
                    .select("*")
                    .not("overview", "is", null)
                    .range(from, to);

                if (data && data.length > 0) {
                    allPairs.push(...data);
                    hasMore = data.length === 1000;
                    page++;
                } else {
                    hasMore = false;
                }
            }

            const localeMap = new Map<string, Set<string>>();
            for (const pair of allPairs) {
                if (!localeMap.has(pair.locale)) {
                    localeMap.set(pair.locale, new Set());
                }
                localeMap.get(pair.locale)!.add(pair[entityIdField]);
            }

            const finalStats = ALL_LOCALES.map(loc => ({
                locale: loc.code,
                count: localeMap.get(loc.code)?.size || 0,
            }));

            setLocaleStats(finalStats);
        } catch (err) {
            console.error("Failed to load stats:", err);
        } finally {
            setIsLoadingStats(false);
        }
    }, [tableName, entityIdField, entityCountTable]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const toggleLocale = (code: string) => {
        setSelectedLocales(prev => {
            const next = new Set(prev);
            if (next.has(code)) {
                next.delete(code);
            } else {
                next.add(code);
            }
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedLocales.size === ALL_LOCALES.length) {
            setSelectedLocales(new Set());
        } else {
            setSelectedLocales(new Set(ALL_LOCALES.map(l => l.code)));
        }
    };

    const handleStart = async () => {
        if (selectedLocales.size === 0) {
            addLog("warning", "⚠️ Please select at least one language.");
            return;
        }

        setIsRunning(true);
        setLogs([]);
        setProgress({ processed: 0, total: 0, generated: 0, errors: 0 });

        const localesArr = Array.from(selectedLocales);
        addLog("info", `🚀 Starting content generation for ${localesArr.length} language(s): ${localesArr.join(", ")}${overwrite ? " (overwrite mode)" : " (resume mode)"}...`);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locales: localesArr, overwrite }),
                signal: controller.signal,
            });

            if (!response.ok || !response.body) {
                addLog("error", `❌ Server error: ${response.status}`);
                setIsRunning(false);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.message) {
                            const logType: LogEntry["type"] =
                                data.status === "error" ? "error" :
                                data.status === "generated" || data.type === "complete" ? "success" :
                                data.type === "skip" ? "warning" : "info";
                            addLog(logType, data.message);
                        }

                        if (data.processed !== undefined || data.total !== undefined) {
                            setProgress(prev => ({
                                ...prev,
                                ...(data.processed !== undefined ? { processed: data.processed } : {}),
                                ...(data.total !== undefined ? { total: data.total } : {}),
                                ...(data.generated !== undefined ? { generated: data.generated } : {}),
                                ...(data.errors !== undefined ? { errors: data.errors } : {}),
                            }));
                        }

                        if (data.type === "complete") {
                            fetchStats();
                        }
                    } catch {
                        // skip
                    }
                }
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError") {
                addLog("warning", "⚠️ Generation cancelled by user.");
            } else {
                addLog("error", `❌ ${err instanceof Error ? err.message : "Connection error"}`);
            }
        } finally {
            setIsRunning(false);
            abortControllerRef.current = null;
        }
    };

    const handleCancel = () => {
        abortControllerRef.current?.abort();
    };

    return {
        selectedLocales, toggleLocale, toggleAll,
        overwrite, setOverwrite,
        isRunning, handleStart, handleCancel,
        logs, logEndRef,
        progress, localeStats, totalEntities, isLoadingStats,
    };
}

export default function ProgramContentPage() {
    const gen = useSSEGenerator(
        "/api/ai/bulk-generate-program-content",
        "program_translations",
        "program_id",
        "university_programs"
    );

    const pct = gen.progress.total > 0
        ? Math.round((gen.progress.processed / gen.progress.total) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    Program Content Generator
                </h1>
                <p className="text-muted-foreground mt-1">
                    Generate AI-powered program overviews and core curriculum for all programs
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Programs</div>
                        <div className="text-2xl font-bold mt-1">
                            {gen.isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : gen.totalEntities}
                        </div>
                    </CardContent>
                </Card>
                {gen.isRunning && (
                    <>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-sm text-muted-foreground">Progress</div>
                                <div className="text-2xl font-bold mt-1 text-blue-600">
                                    {gen.progress.processed} / {gen.progress.total}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-sm text-muted-foreground">Generated</div>
                                <div className="text-2xl font-bold mt-1 text-green-600">{gen.progress.generated}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-sm text-muted-foreground">Errors</div>
                                <div className="text-2xl font-bold mt-1 text-red-600">{gen.progress.errors}</div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Per-locale coverage */}
            {!gen.isLoadingStats && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Content Coverage by Language
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {ALL_LOCALES.map(loc => {
                                const stat = gen.localeStats.find(s => s.locale === loc.code);
                                const count = stat?.count || 0;
                                const total = gen.totalEntities;
                                const pctDone = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={loc.code} className="rounded-lg border p-3 text-center">
                                        <div className="text-lg">{loc.flag}</div>
                                        <div className="text-xs font-medium">{loc.label}</div>
                                        <div className="text-lg font-bold mt-1">{count}</div>
                                        <div className="text-xs text-muted-foreground">{pctDone}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Language Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Select Languages
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={gen.toggleAll}>
                            {gen.selectedLocales.size === ALL_LOCALES.length ? "Deselect All" : "Select All"}
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {ALL_LOCALES.map(locale => (
                            <button
                                key={locale.code}
                                onClick={() => gen.toggleLocale(locale.code)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                    gen.selectedLocales.has(locale.code)
                                        ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-1 ring-purple-500/30"
                                        : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                                }`}
                            >
                                <span>{locale.flag}</span>
                                <span>{locale.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 pt-2 border-t">
                        <Checkbox
                            id="overwrite-content"
                            checked={gen.overwrite}
                            onCheckedChange={(checked) => gen.setOverwrite(checked === true)}
                        />
                        <label htmlFor="overwrite-content" className="text-sm text-muted-foreground">
                            Overwrite existing content (regenerate all)
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
                {!gen.isRunning ? (
                    <Button
                        onClick={gen.handleStart}
                        disabled={gen.selectedLocales.size === 0}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Generate Program Content
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={gen.handleCancel}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Stop
                    </Button>
                )}
            </div>

            {/* Progress Bar */}
            {gen.isRunning && gen.progress.total > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{gen.progress.processed} / {gen.progress.total}</span>
                        <span>{pct}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Logs */}
            {gen.logs.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Generation Log</CardTitle>
                            <div className="flex gap-2 text-xs">
                                <Badge variant="default" className="bg-green-600">
                                    {gen.progress.generated} generated
                                </Badge>
                                <Badge variant="destructive">{gen.progress.errors} errors</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-80 rounded-md border bg-muted/30 p-3">
                            <div className="space-y-1 font-mono text-xs">
                                {gen.logs.map((log, i) => (
                                    <div key={i} className={`flex gap-2 ${
                                        log.type === "success" ? "text-green-600 dark:text-green-400" :
                                        log.type === "error" ? "text-red-600 dark:text-red-400" :
                                        log.type === "warning" ? "text-yellow-600 dark:text-yellow-400" :
                                        "text-muted-foreground"
                                    }`}>
                                        <span className="opacity-50 shrink-0">{log.timestamp}</span>
                                        <span>{log.message}</span>
                                    </div>
                                ))}
                                {gen.isRunning && (
                                    <div className="flex items-center gap-2 text-purple-500">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                )}
                                <div ref={gen.logEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
