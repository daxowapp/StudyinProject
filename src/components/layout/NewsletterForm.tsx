"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { toast } from "sonner";

export function NewsletterForm() {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", email);

            const result = await subscribeToNewsletter(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Successfully subscribed to newsletter!");
                setEmail("");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button
                type="submit"
                disabled={isPending}
                className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl px-6"
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
            </Button>
        </form>
    );
}
