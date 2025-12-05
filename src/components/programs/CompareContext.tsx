"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Program {
    id: string;
    slug?: string;
    name: string;
    university: string;
    city: string;
    level: string;
    duration: string;
    tuition: string;
    tuition_fee?: number;
    currency?: string;
    deadline: string;
    badges: string[];
}

interface CompareContextType {
    selectedPrograms: Program[];
    addProgram: (program: Program) => void;
    removeProgram: (programId: string) => void;
    isSelected: (programId: string) => boolean;
    clearAll: () => void;
    canAdd: boolean;
    maxPrograms: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
    const maxPrograms = 3;

    const addProgram = useCallback((program: Program) => {
        setSelectedPrograms((prev) => {
            if (prev.length >= maxPrograms) return prev;
            if (prev.find((p) => p.id === program.id)) return prev;
            return [...prev, program];
        });
    }, []);

    const removeProgram = useCallback((programId: string) => {
        setSelectedPrograms((prev) => prev.filter((p) => p.id !== programId));
    }, []);

    const isSelected = useCallback(
        (programId: string) => selectedPrograms.some((p) => p.id === programId),
        [selectedPrograms]
    );

    const clearAll = useCallback(() => {
        setSelectedPrograms([]);
    }, []);

    const canAdd = selectedPrograms.length < maxPrograms;

    return (
        <CompareContext.Provider
            value={{
                selectedPrograms,
                addProgram,
                removeProgram,
                isSelected,
                clearAll,
                canAdd,
                maxPrograms,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
