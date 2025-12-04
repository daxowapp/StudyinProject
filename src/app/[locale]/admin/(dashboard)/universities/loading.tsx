import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Loading() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Universities</h1>
                    <p className="text-muted-foreground">Manage universities and their programs.</p>
                </div>
                <Button disabled>
                    <Plus className="mr-2 h-4 w-4" /> Add University
                </Button>
            </div>

            {/* Filters Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Table Skeleton */}
            <div className="border rounded-md">
                <div className="p-4 border-b">
                    <div className="grid grid-cols-6 gap-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>
                <div className="space-y-4 p-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-6 gap-4 items-center">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
