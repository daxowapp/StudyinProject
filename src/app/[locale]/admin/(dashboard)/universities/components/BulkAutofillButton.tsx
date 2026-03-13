"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2, XCircle, SkipForward } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LogEntry {
    message: string;
    status: "generating" | "updated" | "skipped" | "error" | "info";
}

export function BulkAutofillButton() {
    const [open, setOpen] = useState(false);
    const [running, setRunning] = useState(false);
    const [onlyEmpty, setOnlyEmpty] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState({ updated: 0, errors: 0, skippedFilled: 0 });
    const [complete, setComplete] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const addLog = (entry: LogEntry) => {
        setLogs(prev => [...prev, entry]);
        // Auto-scroll to bottom
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 50);
    };

    const handleStart = async () => {
        setRunning(true);
        setLogs([]);
        setProgress(0);
        setTotal(0);
        setComplete(false);
        setStats({ updated: 0, errors: 0, skippedFilled: 0 });

        try {
            const response = await fetch("/api/ai/bulk-autofill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ onlyEmpty }),
            });

            if (!response.ok) {
                throw new Error("Failed to start bulk autofill");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No response stream");
            }

            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === "start") {
                                setTotal(data.total);
                                setStats(prev => ({ ...prev, skippedFilled: data.skippedAlreadyFilled || 0 }));
                                addLog({ message: data.message, status: "info" });
                            } else if (data.type === "progress") {
                                setProgress(data.processed);
                                setStats(prev => ({
                                    ...prev,
                                    updated: data.updated,
                                    errors: data.errors,
                                }));
                                addLog({ message: data.message, status: data.status });
                            } else if (data.type === "complete") {
                                setComplete(true);
                                addLog({ message: data.message, status: "info" });
                                toast.success(`Bulk autofill complete! Updated: ${data.updated}, Errors: ${data.errors}`);
                            } else if (data.type === "error") {
                                addLog({ message: `❌ ${data.message}`, status: "error" });
                                toast.error(data.message);
                            }
                        } catch {
                            // Skip invalid JSON lines
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to run bulk autofill");
            addLog({ message: "❌ Connection error", status: "error" });
        } finally {
            setRunning(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "updated":
                return <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />;
            case "error":
                return <XCircle className="h-3 w-3 text-red-500 shrink-0" />;
            case "skipped":
                return <SkipForward className="h-3 w-3 text-yellow-500 shrink-0" />;
            case "generating":
                return <Loader2 className="h-3 w-3 text-blue-500 animate-spin shrink-0" />;
            default:
                return <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />;
        }
    };

    const progressPercent = total > 0 ? (progress / total) * 100 : 0;

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!running) setOpen(v); }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Bulk Auto-fill All
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        Bulk AI Auto-fill Universities
                    </DialogTitle>
                    <DialogDescription>
                        Generate missing data for all universities using AI. Only empty fields will be filled — existing data is never overwritten.
                    </DialogDescription>
                </DialogHeader>

                {!running && !complete && (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="only-empty"
                                checked={onlyEmpty}
                                onCheckedChange={setOnlyEmpty}
                            />
                            <Label htmlFor="only-empty">
                                Only process universities with missing data
                            </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            This will call AI for each university to generate: description, location, ranking, founded year, student stats, features, and coordinates.
                        </p>
                    </div>
                )}

                {(running || complete) && (
                    <div className="space-y-4 py-4">
                        {/* Progress bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{progress} / {total} universities</span>
                                <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} />
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 text-sm">
                            <span className="text-green-600">✅ Updated: {stats.updated}</span>
                            <span className="text-red-600">❌ Errors: {stats.errors}</span>
                            {stats.skippedFilled > 0 && (
                                <span className="text-muted-foreground">⏭️ Already filled: {stats.skippedFilled}</span>
                            )}
                        </div>

                        {/* Log output */}
                        <ScrollArea className="h-64 w-full rounded-md border bg-muted/50 p-3" ref={scrollRef}>
                            <div className="space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs font-mono">
                                        {getStatusIcon(log.status)}
                                        <span className="break-all">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                <DialogFooter>
                    {!running && !complete && (
                        <>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleStart} className="gap-2">
                                <Sparkles className="h-4 w-4" />
                                Start Bulk Auto-fill
                            </Button>
                        </>
                    )}
                    {running && (
                        <Button disabled className="gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                        </Button>
                    )}
                    {complete && (
                        <Button onClick={() => { setOpen(false); window.location.reload(); }}>
                            Done — Refresh Page
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
