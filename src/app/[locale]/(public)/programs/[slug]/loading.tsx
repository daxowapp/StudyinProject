import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProgramDetail() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
            {/* Hero Section Skeleton */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                    <div className="max-w-4xl">
                        {/* Breadcrumb */}
                        <div className="flex gap-2 mb-6">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-12 w-3/4 mb-4" />

                        {/* University Info */}
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div>
                                <Skeleton className="h-5 w-48 mb-1" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <Skeleton className="h-10 w-28 rounded-full" />
                            <Skeleton className="h-10 w-24 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-full" />
                            <Skeleton className="h-10 w-28 rounded-full" />
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4">
                            <Skeleton className="h-12 w-36 rounded-lg" />
                            <Skeleton className="h-12 w-40 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Facts Card */}
                        <div className="rounded-xl border bg-card p-8 shadow-xl">
                            <Skeleton className="h-6 w-32 mb-6" />
                            <div className="grid md:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-6 w-28" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overview Card */}
                        <div className="rounded-xl border bg-card p-8 shadow-xl">
                            <Skeleton className="h-8 w-40 mb-6" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="space-y-3 mb-6">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <Skeleton className="h-12 w-full rounded-lg mb-3" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
