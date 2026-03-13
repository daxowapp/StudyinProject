"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MessageSquareText,
    Loader2,
    Globe,
    CheckCircle2,
    XCircle,
    RotateCcw,
    PlayCircle,
    Languages,
    BarChart3,
    GraduationCap,
    Building2,
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

type TabType = "programs" | "universities";

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

            // Count total entities
            const { count: entityCount } = await supabase
                .from(entityCountTable)
                .select("id", { count: "exact", head: true });

            setTotalEntities(entityCount || 0);

            // Fetch all unique (entity_id, locale) pairs
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
                    .range(from, to);

                if (data && data.length > 0) {
                    allPairs.push(...data);
                    hasMore = data.length === 1000;
                    page++;
                } else {
                    hasMore = false;
                }
            }

            // Count distinct entities per locale
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

    // Fetch stats on mount
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Auto-scroll logs
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
        addLog("info", `🚀 Starting FAQ generation for ${localesArr.length} language(s): ${localesArr.join(", ")}${overwrite ? " (overwrite mode)" : " (resume mode)"}...`);

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

                        if (data.type === "start") {
                            setProgress({ processed: 0, total: data.total, generated: 0, errors: 0 });
                            addLog("info", data.message);
                        } else if (data.type === "progress") {
                            setProgress({
                                processed: data.processed,
                                total: data.total,
                                generated: data.generated,
                                errors: data.errors,
                            });
                            const logType = data.status === "error" ? "error" :
                                data.status === "generated" ? "success" : "info";
                            addLog(logType, data.message);
                        } else if (data.type === "complete") {
                            addLog("success", data.message);
                        } else if (data.type === "error") {
                            addLog("error", `❌ ${data.message}`);
                        }
                    } catch {
                        // ignore parse errors on partial lines
                    }
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === "AbortError") {
                addLog("warning", "⏹️ Generation stopped by user.");
            } else {
                addLog("error", `❌ ${err instanceof Error ? err.message : "Unknown error"}`);
            }
        } finally {
            setIsRunning(false);
            abortControllerRef.current = null;
            // Refresh stats after generation
            fetchStats();
        }
    };

    const handleStop = () => {
        abortControllerRef.current?.abort();
    };

    const clearLogs = () => {
        setLogs([]);
        setProgress({ processed: 0, total: 0, generated: 0, errors: 0 });
    };

    return {
        selectedLocales,
        overwrite,
        setOverwrite,
        isRunning,
        logs,
        progress,
        localeStats,
        totalEntities,
        isLoadingStats,
        logEndRef,
        toggleLocale,
        toggleAll,
        handleStart,
        handleStop,
        clearLogs,
    };
}

function FAQGeneratorTab({
    entityLabel,
    entityLabelPlural,
    apiEndpoint,
    tableName,
    entityIdField,
    entityCountTable,
}: {
    entityLabel: string;
    entityLabelPlural: string;
    apiEndpoint: string;
    tableName: string;
    entityIdField: string;
    entityCountTable: string;
}) {
    const {
        selectedLocales,
        overwrite,
        setOverwrite,
        isRunning,
        logs,
        progress,
        localeStats,
        totalEntities,
        isLoadingStats,
        logEndRef,
        toggleLocale,
        toggleAll,
        handleStart,
        handleStop,
        clearLogs,
    } = useSSEGenerator(apiEndpoint, tableName, entityIdField, entityCountTable);

    const pct = progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <Card className="border-purple-200 dark:border-purple-800/50 bg-linear-to-r from-purple-50/50 to-transparent dark:from-purple-950/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Coverage Overview
                        {isLoadingStats && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                        {ALL_LOCALES.map(loc => {
                            const stat = localeStats.find(s => s.locale === loc.code);
                            const count = stat?.count || 0;
                            const pctDone = totalEntities > 0 ? Math.round((count / totalEntities) * 100) : 0;
                            const isComplete = count >= totalEntities && totalEntities > 0;

                            return (
                                <div
                                    key={loc.code}
                                    className={`rounded-xl border p-3 text-center transition-all ${
                                        isComplete
                                            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
                                            : count > 0
                                                ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
                                                : "border-border bg-muted/30"
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{loc.flag}</div>
                                    <div className="text-xs font-medium text-muted-foreground uppercase">{loc.code}</div>
                                    <div className="text-lg font-bold mt-1">
                                        {isLoadingStats ? "—" : count}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        {isLoadingStats ? "" : `${pctDone}%`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {!isLoadingStats && (
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            Total {entityLabelPlural}: <strong>{totalEntities}</strong> · {entityLabelPlural} with FAQs shown per language
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Language Selection */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Languages className="h-5 w-5 text-blue-500" />
                            Select Languages
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={`select-all-${entityLabel}`}
                                checked={selectedLocales.size === ALL_LOCALES.length}
                                onCheckedChange={toggleAll}
                                disabled={isRunning}
                            />
                            <label htmlFor={`select-all-${entityLabel}`} className="text-sm font-medium cursor-pointer">
                                Select All ({ALL_LOCALES.length} languages)
                            </label>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ALL_LOCALES.map(loc => (
                                <label
                                    key={loc.code}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                        selectedLocales.has(loc.code)
                                            ? "border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/30"
                                            : "border-border hover:border-muted-foreground/30"
                                    } ${isRunning ? "opacity-60 pointer-events-none" : ""}`}
                                >
                                    <Checkbox
                                        checked={selectedLocales.has(loc.code)}
                                        onCheckedChange={() => toggleLocale(loc.code)}
                                        disabled={isRunning}
                                    />
                                    <span className="text-lg">{loc.flag}</span>
                                    <span className="text-sm font-medium">{loc.label}</span>
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Controls */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="h-5 w-5 text-green-500" />
                            Generation Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-all">
                                <Checkbox
                                    checked={overwrite}
                                    onCheckedChange={(v) => setOverwrite(v === true)}
                                    disabled={isRunning}
                                    className="mt-0.5"
                                />
                                <div>
                                    <p className="text-sm font-medium">Overwrite existing FAQs</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        When OFF (resume mode), {entityLabelPlural} that already have FAQs in the selected language will be skipped.
                                        When ON, all FAQs for selected languages will be regenerated.
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div className="space-y-3">
                            {!isRunning ? (
                                <Button
                                    onClick={handleStart}
                                    disabled={selectedLocales.size === 0}
                                    className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-base"
                                >
                                    <PlayCircle className="h-5 w-5 mr-2" />
                                    {overwrite ? `Generate All ${entityLabel} FAQs` : `Resume ${entityLabel} FAQ Generation`}
                                    <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                                        {selectedLocales.size} lang{selectedLocales.size !== 1 ? "s" : ""}
                                    </Badge>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleStop}
                                    variant="destructive"
                                    className="w-full py-6 text-base"
                                >
                                    <XCircle className="h-5 w-5 mr-2" />
                                    Stop Generation
                                </Button>
                            )}

                            {logs.length > 0 && !isRunning && (
                                <Button
                                    onClick={clearLogs}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Clear Logs
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Section */}
            {(isRunning || progress.total > 0) && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {progress.processed} / {progress.total} tasks
                                </span>
                                <span className="font-medium">{pct}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300 bg-linear-to-r from-purple-500 to-blue-500"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <div className="text-lg font-bold text-green-700 dark:text-green-400">{progress.generated}</div>
                                    <div className="text-xs text-green-600 dark:text-green-500">Generated</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <div>
                                    <div className="text-lg font-bold text-red-700 dark:text-red-400">{progress.errors}</div>
                                    <div className="text-xs text-red-600 dark:text-red-500">Errors</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                <Loader2 className={`h-5 w-5 text-blue-600 ${isRunning ? "animate-spin" : ""}`} />
                                <div>
                                    <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{progress.total - progress.processed}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-500">Remaining</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Logs */}
            {logs.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-80 rounded-lg border bg-muted/20 p-3">
                            <div className="space-y-1 font-mono text-xs">
                                {logs.map((log, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-2 ${
                                            log.type === "error" ? "text-red-600 dark:text-red-400" :
                                                log.type === "success" ? "text-green-600 dark:text-green-400" :
                                                    log.type === "warning" ? "text-amber-600 dark:text-amber-400" :
                                                        "text-muted-foreground"
                                        }`}
                                    >
                                        <span className="text-muted-foreground/50 shrink-0">[{log.timestamp}]</span>
                                        <span className="break-all">{log.message}</span>
                                    </div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function FAQGeneratorPage() {
    const [activeTab, setActiveTab] = useState<TabType>("programs");

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <MessageSquareText className="h-8 w-8 text-purple-500" />
                    FAQ Generator
                </h1>
                <p className="text-muted-foreground mt-1">
                    AI-generate 10 SEO-optimized FAQ Q&A pairs per entity in multiple languages
                </p>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab("programs")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                        activeTab === "programs"
                            ? "border-purple-500 text-purple-700 dark:text-purple-400"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                    <GraduationCap className="h-4 w-4" />
                    Program FAQs
                </button>
                <button
                    onClick={() => setActiveTab("universities")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                        activeTab === "universities"
                            ? "border-purple-500 text-purple-700 dark:text-purple-400"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                    <Building2 className="h-4 w-4" />
                    University FAQs
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "programs" && (
                <FAQGeneratorTab
                    entityLabel="Program"
                    entityLabelPlural="programs"
                    apiEndpoint="/api/ai/bulk-generate-faqs"
                    tableName="program_faqs"
                    entityIdField="program_id"
                    entityCountTable="university_programs"
                />
            )}

            {activeTab === "universities" && (
                <FAQGeneratorTab
                    entityLabel="University"
                    entityLabelPlural="universities"
                    apiEndpoint="/api/ai/bulk-generate-university-faqs"
                    tableName="university_faqs"
                    entityIdField="university_id"
                    entityCountTable="universities"
                />
            )}
        </div>
    );
}
