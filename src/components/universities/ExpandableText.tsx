"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
}

export function ExpandableText({ text, maxLength = 300 }: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;
    
    const displayText = shouldTruncate && !isExpanded 
        ? text.slice(0, maxLength) + "..." 
        : text;

    if (!shouldTruncate) {
        return (
            <p className="whitespace-pre-line leading-relaxed text-base">
                {text}
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <p className="whitespace-pre-line leading-relaxed text-base">
                {displayText}
            </p>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 font-semibold -ml-2"
            >
                {isExpanded ? (
                    <>
                        Show Less
                        <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                ) : (
                    <>
                        Read More
                        <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                )}
            </Button>
        </div>
    );
}
