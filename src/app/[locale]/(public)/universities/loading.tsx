import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUniversities() {
    return (
        <main className="min-h-screen bg-background pt-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-5 w-96 mx-auto" />
                </div>

                {/* Search Skeleton */}
                <div className="flex justify-center mb-8">
                    <Skeleton className="h-12 w-full max-w-md" />
                </div>

                {/* Universities Grid Skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card overflow-hidden">
                            <Skeleton className="h-40 w-full" />
                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-3/4 mb-1" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
