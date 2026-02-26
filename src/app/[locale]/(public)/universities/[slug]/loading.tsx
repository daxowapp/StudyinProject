import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUniversityDetail() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Header Skeleton */}
            <div className="relative h-[400px] bg-muted">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto">
                        <div className="flex items-end gap-6">
                            <Skeleton className="h-24 w-24 rounded-xl" />
                            <div className="flex-1">
                                <Skeleton className="h-10 w-96 mb-3" />
                                <Skeleton className="h-5 w-48" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* About Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <Skeleton className="h-8 w-48 mb-6" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Programs Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-muted/30">
                                        <Skeleton className="h-6 w-3/4 mb-3" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-red-100 to-yellow-100 rounded-3xl p-8">
                            <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-6" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
