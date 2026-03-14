"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, MapPin, Calendar, DollarSign, GraduationCap, Building2, ArrowRight, Eye, GitCompareArrows, Sparkles, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/currency/PriceDisplay";
import { useTranslations } from "next-intl";
import { useCompare } from "./CompareContext";
import { useState } from "react";

interface Program {
    id: string;
    slug?: string;
    name: string;
    university: string;
    city: string;
    level: string;
    duration: string;
    language?: string;
    tuition: string;
    tuition_fee?: number;
    currency?: string;
    deadline: string;
    badges: string[];
    scholarship_chance?: string;
    has_fast_track?: boolean;
    csca_exam_require?: boolean;
}

interface ProgramCardProps {
    program: Program;
    variant?: 'grid' | 'list';
}

export function ProgramCard({ program, variant = 'grid' }: ProgramCardProps) {
    const t = useTranslations("Programs.card");
    const { addProgram, removeProgram, isSelected, canAdd } = useCompare();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const selected = isSelected(program.id);

    const handleCompareToggle = () => {
        if (selected) {
            removeProgram(program.id);
        } else if (canAdd) {
            addProgram(program);
        }
    };

    const hasScholarship = program.scholarship_chance || program.badges.some(b =>
        b.toLowerCase().includes('scholarship')
    );

    if (variant === 'list') {
        return (
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border shadow-sm bg-card relative">
                <div className="flex flex-col sm:flex-row">
                    {/* Left accent bar */}
                    <div className="hidden sm:block w-1.5 bg-gradient-to-b from-primary via-primary/80 to-primary/60 shrink-0" />
                    <div className="sm:hidden h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

                    <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                        {/* Left: Icon + Program Info */}
                        <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0">
                            <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
                                <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <Badge
                                        variant={program.level === "Master" ? "default" : "secondary"}
                                        className="text-[10px] px-2 py-0.5"
                                    >
                                        {program.level}
                                    </Badge>
                                    {program.language && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border-transparent"
                                        >
                                            <Globe className="h-2.5 w-2.5 mr-1" />
                                            {program.language}
                                        </Badge>
                                    )}
                                    {hasScholarship && (
                                        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 text-[10px] px-2 py-0.5">
                                            <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                            {t("scholarship")}
                                        </Badge>
                                    )}
                                    {program.has_fast_track && (
                                        <Badge className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 border-yellow-200">
                                            <Zap className="h-2.5 w-2.5 mr-0.5 fill-yellow-600 text-yellow-600" />
                                            {t("fastTrack") || 'Fast Track'}
                                        </Badge>
                                    )}
                                    {program.csca_exam_require && (
                                        <Badge variant="destructive" className="bg-amber-600 text-[10px] px-2 py-0.5">
                                            📝 Requires CSCA
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
                                    {program.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1 truncate">
                                        <Building2 className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                                        <span className="truncate">{program.university}</span>
                                    </span>
                                    <span className="flex items-center gap-1 shrink-0">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        {program.city}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Key Details */}
                        <div className="flex items-center gap-4 sm:gap-6 text-sm sm:shrink-0">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {t("duration")}
                                </span>
                                <span className="font-semibold text-sm">{program.duration}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {t("intake")}
                                </span>
                                <span className="font-semibold text-sm truncate max-w-[100px]">
                                    {program.deadline || t("contact")}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> {t("tuitionFee")}
                                </span>
                                <span className="font-semibold text-sm text-primary">
                                    {typeof program.tuition_fee === "number" ? (
                                        <Price amount={program.tuition_fee} currency={program.currency || "CNY"} />
                                    ) : (
                                        program.tuition
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:shrink-0 sm:ml-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all cursor-pointer ${selected
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted/50 hover:bg-primary/10"
                                                }`}
                                            onClick={handleCompareToggle}
                                        >
                                            <Checkbox
                                                checked={selected}
                                                disabled={!selected && !canAdd}
                                                className="h-3.5 w-3.5 border-none data-[state=checked]:bg-transparent"
                                            />
                                            <GitCompareArrows className="h-3 w-3" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{selected ? t("removeFromCompare") : t("addToCompare")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-11 w-11 sm:h-9 sm:w-9 shrink-0 active:scale-[0.97] transition-transform">
                                        <Eye className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            {program.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <QuickViewContent program={program} onClose={() => setIsQuickViewOpen(false)} />
                                </DialogContent>
                            </Dialog>

                            <Link href={`/programs/${program.slug || program.id}`}>
                                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group h-11 sm:h-9 active:scale-[0.97] transition-transform">
                                    {t("viewProgram")}
                                    <ArrowRight className="ml-1.5 h-4 w-4 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    /* ===========================
       GRID CARD VARIANT — Simplified Mobile
       =========================== */
    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 shadow-sm bg-card flex flex-col h-full relative md:hover:-translate-y-1">
            {/* Scholarship Badge — compact on mobile */}
            {hasScholarship && (
                <div className="absolute top-2.5 md:top-3 left-2.5 md:left-3 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md text-[10px] md:text-xs px-2 md:px-2.5 py-0.5">
                        <Sparkles className="h-2.5 md:h-3 w-2.5 md:w-3 mr-0.5 md:mr-1" />
                        {t("scholarship")}
                    </Badge>
                </div>
            )}

            {/* Compare checkbox — hidden on mobile */}
            <div className="absolute top-3 right-3 z-10 hidden md:block">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all cursor-pointer ${selected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white/90 backdrop-blur-sm hover:bg-primary/10"
                                    }`}
                                onClick={handleCompareToggle}
                            >
                                <Checkbox
                                    checked={selected}
                                    disabled={!selected && !canAdd}
                                    className="h-4 w-4 border-none data-[state=checked]:bg-transparent"
                                />
                                <GitCompareArrows className="h-3 w-3" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{selected ? t("removeFromCompare") : t("addToCompare")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Accent bar — hidden on mobile, shown on desktop */}
            <div className="hidden md:block h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

            <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                {/* Top Section — Level & Language badges (no large icon on mobile) */}
                <div className="flex items-center gap-2 flex-wrap mb-2.5 md:mb-4">
                    <Badge
                        variant={program.level === "Master" ? "default" : "secondary"}
                        className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 font-semibold"
                    >
                        {program.level}
                    </Badge>
                    {program.language && (
                        <Badge
                            variant="secondary"
                            className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border-transparent"
                        >
                            <Globe className="h-2.5 md:h-3 w-2.5 md:w-3 mr-0.5 md:mr-1" />
                            {program.language}
                        </Badge>
                    )}
                    {/* Large icon — desktop only */}
                    <div className="hidden md:flex ml-auto h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <GraduationCap className="h-7 w-7 text-primary" />
                    </div>
                </div>

                {/* Program Info */}
                <div className="mb-3 md:mb-4 flex-1">
                    <div className="flex items-center gap-1.5 text-[13px] md:text-sm font-semibold text-primary mb-1.5 md:mb-2">
                        <Building2 className="h-3.5 md:h-4 w-3.5 md:w-4 shrink-0" />
                        <span className="line-clamp-1">{program.university}</span>
                    </div>
                    <h3 className="font-bold text-base md:text-lg leading-tight mb-2 md:mb-3 line-clamp-2 min-h-[2.75rem] md:min-h-[3.5rem] group-hover:text-primary transition-colors">
                        {program.name}
                    </h3>
                    <div className="flex items-center text-[13px] md:text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <span className="truncate">{program.city}</span>
                    </div>
                </div>

                {/* Details — compact 2-col grid */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4 p-3 md:p-4 bg-muted/30 rounded-lg">
                    <div className="flex flex-col">
                        <span className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                            <Clock className="h-3 w-3" /> {t("duration")}
                        </span>
                        <span className="text-[13px] md:text-sm font-semibold">{program.duration}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                            <Calendar className="h-3 w-3" /> {t("intake")}
                        </span>
                        <span className="text-[13px] md:text-sm font-semibold truncate">
                            {program.deadline || t("contact")}
                        </span>
                    </div>
                </div>

                {/* Tuition — clean and simple on mobile */}
                <div className="flex items-center justify-between p-3 md:p-3.5 bg-primary/5 md:bg-gradient-to-r md:from-primary/10 md:to-primary/5 rounded-lg mb-3 md:mb-4 border border-primary/10 md:border-primary/20">
                    <span className="text-[12px] md:text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" /> {t("tuitionFee")}
                    </span>
                    <span className="text-base md:text-base font-bold text-primary">
                        {typeof program.tuition_fee === "number" ? (
                            <Price amount={program.tuition_fee} currency={program.currency || "CNY"} />
                        ) : (
                            program.tuition
                        )}
                    </span>
                </div>

                {/* Badges — max 2 on mobile, max 3 on desktop */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-auto">
                    {program.has_fast_track && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs hover:bg-yellow-200 border-yellow-200 px-2 py-0.5">
                            <Zap className="h-2.5 md:h-3 w-2.5 md:w-3 mr-0.5 fill-yellow-600 text-yellow-600" />
                            {t("fastTrack") || 'Fast Track'}
                        </Badge>
                    )}
                    {program.csca_exam_require && (
                        <Badge variant="destructive" className="bg-amber-600 text-[10px] md:text-xs font-semibold shadow-sm px-2 py-0.5">
                            📝 CSCA
                        </Badge>
                    )}
                    {/* Show fewer badges on mobile */}
                    {program.badges.slice(0, 2).map((badge, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] md:text-xs font-normal px-2 py-0.5 hidden first:inline-flex [&:nth-child(2)]:inline-flex md:inline-flex">
                            {badge}
                        </Badge>
                    ))}
                    {/* Additional badges — desktop only */}
                    {program.badges.length > 2 && (
                        <Badge variant="outline" className="hidden md:inline-flex text-xs font-normal px-2 py-0.5">
                            {program.badges[2]}
                        </Badge>
                    )}
                    {program.badges.length > 3 && (
                        <Badge variant="outline" className="hidden md:inline-flex text-xs font-normal px-2 py-0.5">
                            +{program.badges.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>

            {/* Footer — single button on mobile, icon + button on desktop */}
            <CardFooter className="p-4 md:p-6 pt-0 flex gap-2">
                {/* Quick View — desktop only */}
                <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 hidden md:flex h-10 w-10 active:scale-[0.97] transition-transform">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                {program.name}
                            </DialogTitle>
                        </DialogHeader>
                        <QuickViewContent program={program} onClose={() => setIsQuickViewOpen(false)} />
                    </DialogContent>
                </Dialog>

                {/* View Program Button — full width on mobile */}
                <Link href={`/programs/${program.slug || program.id}`} className="flex-1">
                    <Button className="w-full h-10 md:h-10 text-sm gap-1.5 group/btn active:scale-[0.97] transition-transform">
                        {t("viewProgram")}
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

function QuickViewContent({ program, onClose }: { program: Program; onClose: () => void }) {
    const t = useTranslations("Programs.card");

    return (
        <div className="space-y-6 mt-4">
            {/* University Info */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="font-semibold">{program.university}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {program.city}
                    </p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <GraduationCap className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("level")}</p>
                    <p className="font-semibold text-sm">{program.level}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("duration")}</p>
                    <p className="font-semibold text-sm">{program.duration}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("intake")}</p>
                    <p className="font-semibold text-sm">{program.deadline || "-"}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("tuitionFee")}</p>
                    <p className="font-semibold text-sm">
                        {typeof program.tuition_fee === "number" ? (
                            <Price amount={program.tuition_fee} currency={program.currency || "CNY"} />
                        ) : (
                            program.tuition
                        )}
                    </p>
                </div>
            </div>

            {/* Badges */}
            <div>
                <p className="text-sm font-medium mb-2">{t("features")}</p>
                <div className="flex flex-wrap gap-2">
                    {program.csca_exam_require && (
                        <Badge variant="destructive" className="bg-amber-600">
                            📝 Requires CSCA
                        </Badge>
                    )}
                    {program.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary">
                            {badge}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
                <Link href={`/programs/${program.slug || program.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        {t("viewFullDetails")}
                    </Button>
                </Link>
                <Link href={`/apply/${program.slug || program.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                        {t("applyNow")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
