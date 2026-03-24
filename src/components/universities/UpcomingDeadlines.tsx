"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { differenceInDays, format, parseISO, isValid } from "date-fns";
import Link from "next/link";

interface Program {
    id: string;
    slug?: string;
    name: string;
    level: string;
    duration: string;
    language: string;
    intake: string;
    tuition: string;
    tuition_fee?: number;
    currency?: string;
    application_deadline?: string | null;
}

interface UpcomingDeadlinesProps {
    programs: Program[];
}

export function UpcomingDeadlines({ programs }: UpcomingDeadlinesProps) {
    const t = useTranslations("UniversityDetail.deadlines");

    // Filter to programs with valid, non-expired deadlines and sort by soonest
    const upcomingPrograms = programs
        .map((program) => {
            if (!program.application_deadline) return null;
            const date = parseISO(program.application_deadline);
            if (!isValid(date)) return null;
            const daysRemaining = differenceInDays(date, new Date());
            if (daysRemaining < 0) return null; // skip expired
            return { ...program, deadlineDate: date, daysRemaining };
        })
        .filter(Boolean)
        .sort((a, b) => a!.daysRemaining - b!.daysRemaining)
        .slice(0, 5) as (Program & { deadlineDate: Date; daysRemaining: number })[];

    // Render nothing if no upcoming deadlines
    if (upcomingPrograms.length === 0) return null;

    const getUrgencyClasses = (days: number) => {
        if (days === 0) return "border-red-200 bg-red-50";
        if (days <= 7) return "border-red-200 bg-red-50";
        if (days <= 30) return "border-amber-200 bg-amber-50";
        return "border-teal-200 bg-teal-50";
    };

    const getUrgencyTextColor = (days: number) => {
        if (days <= 7) return "text-red-600";
        if (days <= 30) return "text-amber-600";
        return "text-teal-600";
    };

    const getUrgencyBadgeClasses = (days: number) => {
        if (days <= 7) return "bg-red-100 text-red-700";
        if (days <= 30) return "bg-amber-100 text-amber-700";
        return "bg-teal-100 text-teal-700";
    };

    return (
        <div
            id="deadlines-section"
            className="scroll-mt-32 animate-[fadeInUp_0.4s_ease-out_0.15s_both]"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-1.5 bg-primary rounded-full" />
                <h2 className="text-3xl font-bold">{t("title")}</h2>
            </div>

            <div className="grid gap-3">
                {upcomingPrograms.map((program) => (
                    <div
                        key={program.id}
                        className={`group relative rounded-2xl border-2 p-5 transition-all hover:shadow-md ${getUrgencyClasses(program.daysRemaining)}`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left side: program info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    {program.daysRemaining <= 7 && (
                                        <Badge className={`text-xs px-2 py-0.5 border-0 ${getUrgencyBadgeClasses(program.daysRemaining)}`}>
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            {t("urgent")}
                                        </Badge>
                                    )}
                                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs px-2 py-0.5">
                                        {program.level}
                                    </Badge>
                                </div>
                                <h3 className="font-semibold text-base truncate">
                                    {program.name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                                    <CalendarClock className="h-4 w-4 shrink-0" />
                                    <span>
                                        {t("deadline")}:{" "}
                                        {format(program.deadlineDate, "MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>

                            {/* Right side: countdown + CTA */}
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-1.5 font-bold text-sm ${getUrgencyTextColor(program.daysRemaining)}`}>
                                    <Clock className="h-4 w-4" />
                                    {program.daysRemaining === 0
                                        ? t("today")
                                        : t("daysLeft", { days: program.daysRemaining })}
                                </div>
                                <Link
                                    href={`/programs/${program.slug || program.id}`}
                                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline whitespace-nowrap"
                                >
                                    {t("viewProgram")}
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
