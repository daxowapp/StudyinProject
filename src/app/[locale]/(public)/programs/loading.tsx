import { ProgramsGridSkeleton } from "@/components/programs/ProgramCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPrograms() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section Skeleton */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-3xl">
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-6 w-full max-w-lg" />
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6 p-6 rounded-xl border bg-card">
                            <Skeleton className="h-6 w-24 mb-4" />
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Programs Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-10 w-40" />
                        </div>
                        <ProgramsGridSkeleton count={9} />
                    </div>
                </div>
            </div>
        </div>
    );
}
