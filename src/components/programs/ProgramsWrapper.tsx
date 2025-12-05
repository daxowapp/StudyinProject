"use client";

import { ReactNode } from "react";
import { CompareProvider } from "./CompareContext";
import { CompareBar } from "./CompareBar";
import { ProgramsTour } from "@/components/ui/GuidedTour";

interface ProgramsWrapperProps {
    children: ReactNode;
}

export function ProgramsWrapper({ children }: ProgramsWrapperProps) {
    return (
        <CompareProvider>
            {children}
            <CompareBar />
            <ProgramsTour />
        </CompareProvider>
    );
}
