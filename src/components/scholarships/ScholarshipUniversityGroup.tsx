"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown, ChevronUp, ExternalLink, Award, Home, Heart, Wallet, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ScholarshipProgram } from "./ScholarshipSearchClient";
import { useTranslations } from "next-intl";

interface ScholarshipUniversityGroupProps {
    universityName: string;
    universitySlug: string;
    city: string;
    logo?: string | null;
    programs: ScholarshipProgram[];
}

export function ScholarshipUniversityGroup({
    universityName,
    universitySlug,
    city,
    logo,
    programs,
}: ScholarshipUniversityGroupProps) {
    const t = useTranslations("Scholarships");
    const [expanded, setExpanded] = useState(true);

    // Group programs by program (same program, different scholarship types)
    const programMap = new Map<string, ScholarshipProgram[]>();
    programs.forEach(p => {
        const key = p.program_id;
        if (!programMap.has(key)) programMap.set(key, []);
        programMap.get(key)!.push(p);
    });

    // Get the best scholarship for display (highest coverage)
    const uniquePrograms = [...programMap.entries()].map(([, scholarshipOptions]) => {
        // Sort by coverage descending
        const sorted = [...scholarshipOptions].sort(
            (a, b) => b.tuition_coverage_percentage - a.tuition_coverage_percentage
        );
        return {
            program: sorted[0], // Use highest coverage as primary display
            allOptions: sorted,
        };
    });

    // Count unique benefits across all scholarships
    const hasAccommodation = programs.some(p => p.includes_accommodation);
    const hasStipend = programs.some(p => p.includes_stipend);
    const hasInsurance = programs.some(p => p.includes_medical_insurance);
    const maxCoverage = Math.max(...programs.map(p => p.tuition_coverage_percentage));

    return (
        <Card className="overflow-hidden border-0 shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl hover:shadow-xl transition-all duration-300">
            {/* University Header */}
            <CardHeader
                className="bg-white dark:bg-slate-950 border-b cursor-pointer p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        {/* Logo */}
                        <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                            {logo ? (
                                <Image
                                    src={logo}
                                    alt={universityName}
                                    width={56}
                                    height={56}
                                    className="object-contain"
                                />
                            ) : (
                                <Award className="h-8 w-8 text-primary/30" />
                            )}
                        </div>

                        <div>
                            <Link
                                href={`/universities/${universitySlug}`}
                                className="text-xl font-bold font-heading hover:text-primary transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {universityName}
                            </Link>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground mt-1.5">
                                <span className="flex items-center gap-1.5 text-slate-500">
                                    <MapPin className="h-4 w-4" />
                                    {city}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="flex items-center gap-1.5 text-primary/80">
                                    <GraduationCap className="h-4 w-4" />
                                    {uniquePrograms.length} {t("search.programsAvailable")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Benefit Badges */}
                        <div className="hidden lg:flex items-center gap-2">
                            <Badge variant="secondary" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 rounded-lg px-2.5 py-1 transition-colors">
                                <Award className="h-3.5 w-3.5 mr-1.5" />
                                {t("search.upTo")} {maxCoverage}%
                            </Badge>
                            {hasAccommodation && (
                                <Badge variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 rounded-lg px-2.5 py-1 transition-colors">
                                    <Home className="h-3.5 w-3.5 mr-1.5" />
                                    {t("search.accommodation")}
                                </Badge>
                            )}
                            {hasStipend && (
                                <Badge variant="secondary" className="bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 border-0 rounded-lg px-2.5 py-1 transition-colors">
                                    <Wallet className="h-3.5 w-3.5 mr-1.5" />
                                    {t("search.stipend")}
                                </Badge>
                            )}
                            {hasInsurance && (
                                <Badge variant="secondary" className="bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border-0 rounded-lg px-2.5 py-1 transition-colors">
                                    <Heart className="h-3.5 w-3.5 mr-1.5" />
                                    {t("search.insurance")}
                                </Badge>
                            )}
                        </div>
                        <div className="p-2 rounded-full hover:bg-muted transition-colors">
                             {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet benefit badges */}
                <div className="flex lg:hidden flex-wrap gap-2 mt-4 pt-4 border-t border-dashed">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 rounded-md">
                        {t("search.upTo")} {maxCoverage}%
                    </Badge>
                    {hasAccommodation && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0 rounded-md">
                            <Home className="h-3 w-3 mr-1" />
                            {t("search.accommodation")}
                        </Badge>
                    )}
                    {hasStipend && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-0 rounded-md">
                            <Wallet className="h-3 w-3 mr-1" />
                            {t("search.stipend")}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            {/* Programs Table */}
            {expanded && (
                <CardContent className="p-0">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50 text-muted-foreground">
                                    <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider">{t("search.program")}</th>
                                    <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider">{t("search.teachingLanguage")}</th>
                                    <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider">{t("search.startingDate")}</th>
                                    <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider">{t("search.scholarshipCoverage")}</th>
                                    <th className="text-left py-4 px-5 font-semibold text-xs uppercase tracking-wider">{t("search.youNeedToPay")}</th>
                                    <th className="text-right py-4 px-5 font-semibold text-xs uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniquePrograms.map(({ program: p, allOptions }) => (
                                    <tr key={p.program_id} className="border-b last:border-0 hover:bg-muted/10 transition-colors group cursor-pointer" onClick={() => window.location.href = `/scholarships/${p.program_slug}`}>
                                        <td className="py-5 px-5">
                                            <Link
                                                href={`/scholarships/${p.program_slug}`}
                                                className="font-semibold text-primary group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors block text-base mb-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {p.display_title || p.program_title}
                                            </Link>
                                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 flex-wrap">
                                                <Badge variant="outline" className="font-normal text-xs">{p.level}</Badge>
                                                <span className="text-slate-300">•</span>
                                                <span>{p.duration}</span>
                                                {p.csca_exam_require && (
                                                    <Badge variant="destructive" className="bg-amber-600 text-[10px] px-1.5 py-0 border-0 h-5 shadow-none">
                                                        CSCA Req
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-5 text-muted-foreground font-medium text-sm">
                                            {p.language_name}
                                        </td>
                                        <td className="py-5 px-5 text-muted-foreground font-medium text-sm">
                                            {p.intake || "Sep, 2026"}
                                        </td>
                                        <td className="py-5 px-5">
                                            <div className="space-y-1.5">
                                                <div className="text-sm">
                                                    <span className="font-medium text-muted-foreground">{t("search.tuition")}:</span>{" "}
                                                    <span className="font-semibold text-foreground">¥{p.tuition_fee?.toLocaleString()}</span>
                                                </div>
                                                {p.includes_accommodation && (
                                                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 w-max px-2 py-0.5 rounded-md">
                                                        <Home className="h-3 w-3" />
                                                        {t("search.accommodation")}: ✓
                                                    </div>
                                                )}
                                                {p.includes_stipend && p.stipend_amount_monthly && (
                                                    <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 w-max px-2 py-0.5 rounded-md">
                                                        <Wallet className="h-3 w-3" />
                                                        {t("search.stipend")}: ¥{p.stipend_amount_monthly}/mo
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-5">
                                            <div className="space-y-1.5">
                                                <div className="text-xl">
                                                    <span className="text-sm font-medium text-muted-foreground mr-1.5">{t("search.tuition")}:</span>{" "}
                                                    <span className={p.student_pays_tuition === 0 ? "text-emerald-500 font-bold" : "font-bold text-foreground"}>
                                                        {p.student_pays_tuition === 0
                                                            ? t("search.free")
                                                            : `¥${p.student_pays_tuition?.toLocaleString()}`}
                                                    </span>
                                                </div>
                                                {p.includes_accommodation && (
                                                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                        {t("search.accommodation")}: {t("search.free")}
                                                    </div>
                                                )}
                                                {allOptions.length > 1 && (
                                                    <Badge variant="outline" className="mt-1 font-normal text-muted-foreground border-dashed">
                                                        +{allOptions.length - 1} {t("search.moreOptions")}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-5 text-right">
                                            <Link href={`/scholarships/${p.program_slug}`}>
                                                <Button size="sm" variant="default" className="h-9 px-4 rounded-xl shadow-none">
                                                    {t("search.learnMore")}
                                                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y">
                        {uniquePrograms.map(({ program: p, allOptions }) => (
                            <div key={p.program_id} className="p-4 space-y-3">
                                <div>
                                    <Link
                                        href={`/scholarships/${p.program_slug}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {p.display_title || p.program_title}
                                    </Link>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <span>{p.level}</span>
                                        <span>•</span>
                                        <span>{p.language_name}</span>
                                        <span>•</span>
                                        <span>{p.intake}</span>
                                        {p.csca_exam_require && (
                                            <Badge variant="destructive" className="bg-amber-600 text-[10px] px-1.5 py-0 border-0 h-4 shadow-none">
                                                CSCA Req
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="bg-muted/50 rounded-lg p-2.5">
                                        <div className="text-muted-foreground mb-1">{t("search.scholarshipCoverage")}</div>
                                        <div className="font-semibold">¥{p.tuition_fee?.toLocaleString()}</div>
                                        {p.includes_accommodation && (
                                            <div className="text-blue-600 mt-0.5">{t("search.accommodation")}: ✓</div>
                                        )}
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-2.5">
                                        <div className="text-muted-foreground mb-1">{t("search.youNeedToPay")}</div>
                                        <div className={`font-semibold ${p.student_pays_tuition === 0 ? "text-emerald-600" : ""}`}>
                                            {p.student_pays_tuition === 0
                                                ? t("search.free")
                                                : `¥${p.student_pays_tuition?.toLocaleString()}`}
                                        </div>
                                        {allOptions.length > 1 && (
                                            <div className="text-muted-foreground mt-0.5">
                                                +{allOptions.length - 1} {t("search.moreOptions")}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Link href={`/scholarships/${p.program_slug}`} className="block mt-4">
                                    <Button size="sm" className="w-full h-9 rounded-xl font-medium">
                                        {t("search.learnMore")}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
