"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AiGeneratorButtonProps {
    type: "university" | "program";
    onDataReceived: (data: unknown) => void;
    initialQuery?: string;
    buttonText?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
}

export function AiGeneratorButton({
    type,
    onDataReceived,
    initialQuery = "",
    buttonText = "Auto-fill with AI",
    variant = "outline",
    size = "sm",
}: AiGeneratorButtonProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleGenerate = async () => {
        if (!query.trim()) {
            toast.error("Please enter a search term");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type, query }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate data");
            }

            const data = await response.json();
            onDataReceived(data);
            toast.success("Data generated successfully!");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size={size} type="button" className="gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate {type === "university" ? "University" : "Program"} Data</DialogTitle>
                    <DialogDescription>
                        Enter the name of the {type} to fetch details using AI.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="query">Search Query</Label>
                        <Input
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`e.g. ${type === "university" ? "Zhejiang University" : "Computer Science at Tsinghua University"}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
