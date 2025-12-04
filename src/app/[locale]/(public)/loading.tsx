import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingHomepage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Skeleton */}
            <div className="relative h-[600px] bg-muted animate-pulse" />

            {/* Why Study Section Skeleton */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto mb-12" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-6 rounded-xl border bg-card">
                                <Skeleton className="h-12 w-12 mb-4" />
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4 mt-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Programs Grid Skeleton */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-4">
                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
