"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface ViewedProgram {
    id: string;
    slug: string;
    name: string;
    university: string;
    city: string;
    level: string;
    viewedAt: number;
}

interface RecentlyViewedContextType {
    recentPrograms: ViewedProgram[];
    addViewedProgram: (program: Omit<ViewedProgram, "viewedAt">) => void;
    clearHistory: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = "recentlyViewedPrograms";
const MAX_ITEMS = 10;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
    const [recentPrograms, setRecentPrograms] = useState<ViewedProgram[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Filter out items older than 7 days
                const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                const recent = parsed.filter((p: ViewedProgram) => p.viewedAt > sevenDaysAgo);
                setRecentPrograms(recent);
            }
        } catch (e) {
            console.error("Error loading recently viewed programs:", e);
        }
    }, []);

    // Save to localStorage when updated
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentPrograms));
        } catch (e) {
            console.error("Error saving recently viewed programs:", e);
        }
    }, [recentPrograms]);

    const addViewedProgram = useCallback((program: Omit<ViewedProgram, "viewedAt">) => {
        setRecentPrograms((prev) => {
            // Remove if already exists
            const filtered = prev.filter((p) => p.id !== program.id);
            // Add to beginning with timestamp
            const updated = [{ ...program, viewedAt: Date.now() }, ...filtered];
            // Keep only most recent
            return updated.slice(0, MAX_ITEMS);
        });
    }, []);

    const clearHistory = useCallback(() => {
        setRecentPrograms([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <RecentlyViewedContext.Provider value={{ recentPrograms, addViewedProgram, clearHistory }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
    }
    return context;
}
