"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScholarshipSearchClient, type ScholarshipProgram } from "./ScholarshipSearchClient";
import { ScholarshipAboutContent } from "./ScholarshipAboutContent";
import { Search, Info } from "lucide-react";
import { useTranslations } from "next-intl";

interface ScholarshipPageContentProps {
    programs: ScholarshipProgram[];
    logoMap: Record<string, string | null>;
}

export function ScholarshipPageContent({ programs, logoMap = {} }: ScholarshipPageContentProps) {
    const t = useTranslations("Scholarships");

    return (
        <Tabs defaultValue="search" className="w-full">
            <div className="border-b border-white/10 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 sticky top-16 z-30 shadow-sm">
                <div className="container mx-auto px-4 md:px-6 py-2">
                    <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 p-1 h-auto rounded-xl">
                        <TabsTrigger
                            value="search"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg py-2.5 px-6 gap-2 text-sm font-medium transition-all"
                        >
                            <Search className="h-4 w-4" />
                            {t("tabs.search")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="about"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg py-2.5 px-6 gap-2 text-sm font-medium transition-all"
                        >
                            <Info className="h-4 w-4" />
                            {t("tabs.about")}
                        </TabsTrigger>
                    </TabsList>
                </div>
            </div>

            <TabsContent value="search" className="mt-0">
                <ScholarshipSearchClient programs={programs} logoMap={logoMap} />
            </TabsContent>

            <TabsContent value="about" className="mt-0">
                <ScholarshipAboutContent />
            </TabsContent>
        </Tabs>
    );
}
