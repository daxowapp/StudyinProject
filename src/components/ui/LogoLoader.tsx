"use client";

import Image from "next/image";

interface LogoLoaderProps {
    size?: "sm" | "md" | "lg";
    text?: string;
}

export function LogoLoader({ size = "md", text }: LogoLoaderProps) {
    const sizeClasses = {
        sm: "w-12 h-12",
        md: "w-20 h-20",
        lg: "w-32 h-32",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`relative ${sizeClasses[size]} animate-logo-pulse`}>
                <Image
                    src="/logo.png"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    priority
                />
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping-slow" />
            </div>
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

// Skeleton wrapper that uses the logo loader
export function SectionSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center py-20 ${className}`}>
            <LogoLoader size="lg" />
        </div>
    );
}
