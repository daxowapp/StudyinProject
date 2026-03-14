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
    timestamp: Date;
}

export default function ProgramContentPage() {
    const [selectedLocales, setSelectedLocales] = useState<string[]>(["en"]);
    const [overwrite, setOverwrite] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [stats, setStats] = useState({ success: 0, error: 0, skipped: 0 });
    const [totalPrograms, setTotalPrograms] = useState<number | null>(null);
    const [existingCount, setExistingCount] = useState<number | null>(null);
    const logEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();
            const { count: programCount } = await supabase
                .from("university_programs")
                .select("*", { count: "exact", head: true });
            setTotalPrograms(programCount || 0);

            const { count: translationCount } = await supabase
                .from("program_translations")
                .select("*", { count: "exact", head: true })
                .not("overview", "is", null);
            setExistingCount(translationCount || 0);
        };
        fetchStats();
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const addLog = useCallback((type: LogEntry["type"], message: string) => {
        setLogs((prev) => [...prev, { type, message, timestamp: new Date() }]);
    }, []);

    const toggleLocale = (code: string) => {
        setSelectedLocales((prev) =>
            prev.includes(code)
                ? prev.filter((l) => l !== code)
                : [...prev, code]
        );
    };

    const selectAllLocales = () => setSelectedLocales(ALL_LOCALES.map((l) => l.code));
    const clearAllLocales = () => setSelectedLocales([]);

    const startGeneration = async () => {
        if (selectedLocales.length === 0) {
            addLog("error", "Please select at least one locale");
            return;
        }

        setIsGenerating(true);
        setLogs([]);
        setProgress({ current: 0, total: 0 });
        setStats({ success: 0, error: 0, skipped: 0 });

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const params = new URLSearchParams();
            selectedLocales.forEach((l) => params.append("locales", l));
            if (overwrite) params.append("overwrite", "true");

            addLog("info", `Starting program content generation for ${selectedLocales.length} locale(s)...`);

            const response = await fetch(
                `/api/ai/bulk-generate-program-content?${params.toString()}`,
                { signal: abortController.signal }
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                const lines = text.split("\n");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const data = line.slice(6).trim();
                    if (!data || data === "[DONE]") continue;

                    try {
                        const event = JSON.parse(data);
                        switch (event.type) {
                            case "start":
                                setProgress({ current: 0, total: event.total || 0 });
                                addLog("info", `Found ${event.total} program-locale pairs to process`);
                                break;
                            case "progress":
                                setProgress((p) => ({ ...p, current: event.current || p.current }));
                                break;
                            case "success":
                                setStats((s) => ({ ...s, success: s.success + 1 }));
                                addLog("success", event.message || "Generated content");
                                break;
                            case "skip":
                                setStats((s) => ({ ...s, skipped: s.skipped + 1 }));
                                addLog("warning", event.message || "Skipped");
                                break;
                            case "error":
                                setStats((s) => ({ ...s, error: s.error + 1 }));
                                addLog("error", event.message || "Error occurred");
                                break;
                            case "complete":
                                addLog("info", `✅ Generation complete! ${event.summary || ""}`);
                                break;
                        }
                    } catch (e) {
                        // skip unparseable lines
                    }
                }
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                addLog("error", `Generation failed: ${err.message}`);
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    const stopGeneration = () => {
        abortControllerRef.current?.abort();
        addLog("warning", "Generation stopped by user");
        setIsGenerating(false);
    };

    const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
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
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <BarChart3 className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Programs</p>
                                <p className="text-2xl font-bold">{totalPrograms ?? "..."}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">With Content</p>
                                <p className="text-2xl font-bold">{existingCount ?? "..."}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Globe className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Selected Locales</p>
                                <p className="text-2xl font-bold">{selectedLocales.length} / {ALL_LOCALES.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Languages + Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        Language Selection
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={selectAllLocales}>Select All</Button>
                        <Button variant="outline" size="sm" onClick={clearAllLocales}>Clear All</Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {ALL_LOCALES.map((locale) => (
                            <button
                                key={locale.code}
                                onClick={() => toggleLocale(locale.code)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                    selectedLocales.includes(locale.code)
                                        ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                        : "border-border hover:border-muted-foreground/50"
                                }`}
                            >
                                <span>{locale.flag}</span>
                                <span>{locale.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                            id="overwrite"
                            checked={overwrite}
                            onCheckedChange={(checked) => setOverwrite(checked === true)}
                        />
                        <label htmlFor="overwrite" className="text-sm text-muted-foreground">
                            Overwrite existing content (regenerate all)
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex gap-3">
                {!isGenerating ? (
                    <Button
                        onClick={startGeneration}
                        disabled={selectedLocales.length === 0}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Generate Program Content
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={stopGeneration}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Stop Generation
                    </Button>
                )}
            </div>

            {/* Progress */}
            {(isGenerating || logs.length > 0) && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Generation Progress</CardTitle>
                            <div className="flex gap-2">
                                <Badge variant="default" className="bg-green-600">{stats.success} ✓</Badge>
                                <Badge variant="secondary">{stats.skipped} skipped</Badge>
                                <Badge variant="destructive">{stats.error} ✗</Badge>
                            </div>
                        </div>
                        {progress.total > 0 && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{progress.current} / {progress.total}</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-64 rounded-lg border bg-muted/30 p-3">
                            <div className="space-y-1 font-mono text-xs">
                                {logs.map((log, i) => (
                                    <div key={i} className={`flex gap-2 ${
                                        log.type === "success" ? "text-green-600 dark:text-green-400" :
                                        log.type === "error" ? "text-red-600 dark:text-red-400" :
                                        log.type === "warning" ? "text-yellow-600 dark:text-yellow-400" :
                                        "text-muted-foreground"
                                    }`}>
                                        <span className="opacity-50 shrink-0">
                                            {log.timestamp.toLocaleTimeString()}
                                        </span>
                                        <span>{log.message}</span>
                                    </div>
                                ))}
                                {isGenerating && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                )}
                                <div ref={logEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
