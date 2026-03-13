"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface HeroSearchProps {
    onSearch: (query: string) => void;
    isSearching?: boolean;
    onTyping?: () => void;
}

export function UniversityHeroSearch({ onSearch, isSearching, onTyping }: HeroSearchProps) {
    const t = useTranslations('Universities');
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const [query, setQuery] = useState(initialQuery);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Sync initial URL param on mount only
    useEffect(() => {
        const q = searchParams.get("search") || "";
        if (q && q !== query) {
            setQuery(q);
            onSearch(q);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (value: string) => {
        setQuery(value);
        onTyping?.();
        // Debounce: fire callback after 250ms of no typing
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onSearch(value);
        }, 250);
    };

    // Cleanup on unmount
    useEffect(() => () => clearTimeout(timerRef.current), []);

    return (
        <div className="w-full max-w-2xl">
            <div className="relative">
                {isSearching ? (
                    <Loader2 className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                ) : (
                    <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                )}
                <Input
                    placeholder={t('search.placeholder')}
                    className="pl-12 rtl:pr-12 rtl:pl-4 h-14 text-lg rounded-full bg-background/95 backdrop-blur text-foreground border border-border/50 shadow-lg focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
        </div>
    );
}
