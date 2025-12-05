"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgramCardSkeleton() {
    return (
        <Card className="overflow-hidden border-none shadow-lg bg-card flex flex-col h-full">
            {/* Header gradient */}
            <div className="h-2 bg-gradient-to-r from-muted via-muted/80 to-muted/60" />

            <CardContent className="p-6 flex-1 flex flex-col">
                {/* Top Section */}
                <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Program Info */}
                <div className="mb-4 flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Tuition */}
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg mb-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
            </CardFooter>
        </Card>
    );
}

export function ProgramsGridSkeleton({ count = 9 }: { count?: number }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProgramCardSkeleton key={i} />
            ))}
        </div>
    );
}
