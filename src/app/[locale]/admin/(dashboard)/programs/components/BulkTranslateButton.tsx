"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function BulkTranslateButton() {
    const [loading, setLoading] = useState(false);

    const handleBulkTranslate = async () => {
        if (!confirm("This will generate AI translations for all programs in Arabic, Farsi, and Turkish. This may take several minutes. Continue?")) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/translations/bulk-programs", {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate translations");
            }

            toast.success(data.message);

            if (data.errors && data.errors.length > 0) {
                console.error("Some translations failed:", data.errors);
                toast.warning(`${data.errors.length} translations had errors. Check console for details.`);
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleBulkTranslate}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
            )}
            {loading ? "Generating..." : "Translate All Programs"}
        </Button>
    );
}
