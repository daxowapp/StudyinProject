"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
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
    status: "searching" | "imported" | "notfound" | "error" | "info";
}

export function BulkMediaImportButton() {
    const [open, setOpen] = useState(false);
    const [running, setRunning] = useState(false);
    const [onlyEmpty, setOnlyEmpty] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState({ logosImported: 0, coversImported: 0, errors: 0, skippedFilled: 0 });
    const [complete, setComplete] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const addLog = (entry: LogEntry) => {
        setLogs(prev => [...prev, entry]);
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
        setStats({ logosImported: 0, coversImported: 0, errors: 0, skippedFilled: 0 });

        try {
            const response = await fetch("/api/ai/bulk-media-import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ onlyEmpty }),
            });

            if (!response.ok) {
                throw new Error("Failed to start media import");
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
                                    logosImported: data.logosImported,
                                    coversImported: data.coversImported,
                                    errors: data.errors,
                                }));
                                addLog({ message: data.message, status: data.status });
                            } else if (data.type === "complete") {
                                setComplete(true);
                                addLog({ message: data.message, status: "info" });
                                toast.success(`Media import complete! Logos: ${data.logosImported}, Covers: ${data.coversImported}`);
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
            toast.error("Failed to run media import");
            addLog({ message: "❌ Connection error", status: "error" });
        } finally {
            setRunning(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "imported":
                return <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />;
            case "error":
                return <XCircle className="h-3 w-3 text-red-500 shrink-0" />;
            case "notfound":
                return <AlertTriangle className="h-3 w-3 text-yellow-500 shrink-0" />;
            case "searching":
                return <Loader2 className="h-3 w-3 text-blue-500 animate-spin shrink-0" />;
            default:
                return <ImageIcon className="h-3 w-3 text-cyan-500 shrink-0" />;
        }
    };

    const progressPercent = total > 0 ? (progress / total) * 100 : 0;

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!running) setOpen(v); }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <ImageIcon className="h-4 w-4 text-cyan-500" />
                    Import Media
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-cyan-500" />
                        Bulk Media Import — Logos & Cover Photos
                    </DialogTitle>
                    <DialogDescription>
                        Downloads university logos and campus photos from the web and saves them to storage. No external links — all images are stored locally.
                    </DialogDescription>
                </DialogHeader>

                {!running && !complete && (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="only-empty-media"
                                checked={onlyEmpty}
                                onCheckedChange={setOnlyEmpty}
                            />
                            <Label htmlFor="only-empty-media">
                                Only process universities with missing images
                            </Label>
                        </div>
                        <div className="rounded-lg border p-3 bg-muted/50 text-sm space-y-1">
                            <p><strong>Logos:</strong> Fetched from university website (Clearbit Logo API + favicon fallback)</p>
                            <p><strong>Cover Photos:</strong> Searched on Wikimedia Commons by university name</p>
                            <p className="text-muted-foreground">Images are downloaded and saved to Supabase Storage — no external URL dependencies.</p>
                        </div>
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
                        <div className="flex gap-4 text-sm flex-wrap">
                            <span className="text-green-600">🖼️ Logos: {stats.logosImported}</span>
                            <span className="text-blue-600">🏫 Covers: {stats.coversImported}</span>
                            <span className="text-red-600">❌ Errors: {stats.errors}</span>
                            {stats.skippedFilled > 0 && (
                                <span className="text-muted-foreground">⏭️ Already have media: {stats.skippedFilled}</span>
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
                                <ImageIcon className="h-4 w-4" />
                                Start Media Import
                            </Button>
                        </>
                    )}
                    {running && (
                        <Button disabled className="gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Importing...
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
