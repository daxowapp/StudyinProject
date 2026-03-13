"use client";

import { useState, useCallback, type ReactNode } from "react";
import { UniversityHeroSearch } from "./UniversityHeroSearch";
import { UniversitiesClient, University } from "./UniversitiesClient";

interface Props {
    universities: University[];
    /** The server-rendered hero section — the search bar will be injected inside it */
    heroContent: ReactNode;
}

export function UniversitiesPageClient({ universities, heroContent }: Props) {
    const [heroQuery, setHeroQuery] = useState<string | undefined>(undefined);
    const [isHeroSearching, setIsHeroSearching] = useState(false);

    const handleHeroSearch = useCallback((query: string) => {
        setHeroQuery(query);
        setIsHeroSearching(false);
    }, []);

    const handleHeroTyping = useCallback(() => {
        setIsHeroSearching(true);
    }, []);

    return (
        <>
            {/* Hero Section with embedded search */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-3xl">
                        {heroContent}
                        <UniversityHeroSearch
                            onSearch={handleHeroSearch}
                            isSearching={isHeroSearching}
                            onTyping={handleHeroTyping}
                        />
                    </div>
                </div>
            </div>

            {/* University List */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <UniversitiesClient
                    universities={universities}
                    heroSearchQuery={heroQuery}
                />
            </div>
        </>
    );
}
