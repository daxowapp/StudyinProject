import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPrograms() {
    return (
        <main className="min-h-screen bg-background pt-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Skeleton - Hidden on mobile for speed */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24 space-y-6 p-6 rounded-xl border bg-card">
                            <Skeleton className="h-6 w-24 mb-4" />
                            <Skeleton className="h-10 w-full mb-3" />
                            <Skeleton className="h-10 w-full mb-3" />
                            <Skeleton className="h-10 w-full mb-3" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </aside>

                    {/* Programs Grid Skeleton */}
                    <div className="flex-1 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card overflow-hidden">
                                <Skeleton className="h-44 w-full" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-5 w-4/5" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
