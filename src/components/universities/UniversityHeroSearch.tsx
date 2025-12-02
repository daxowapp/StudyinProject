"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export function UniversityHeroSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery] = useDebounce(query, 500);

    // Update local state if URL changes externally
    useEffect(() => {
        setQuery(searchParams.get("search") || "");
    }, [searchParams]);

    // Update URL when debounced query changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) {
            params.set("search", debouncedQuery);
        } else {
            params.delete("search");
        }
        router.replace(`/universities?${params.toString()}`, { scroll: false });
    }, [debouncedQuery, router, searchParams]);

    return (
        <div className="w-full max-w-2xl mt-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by university name, city, or ranking..."
                    className="pl-12 h-14 text-lg bg-background/95 backdrop-blur text-foreground border-0 shadow-xl"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </div>
    );
}
