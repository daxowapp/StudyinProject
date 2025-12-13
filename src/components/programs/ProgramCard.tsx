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
import { Clock, MapPin, Calendar, DollarSign, GraduationCap, Building2, ArrowRight, Eye, GitCompareArrows, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/currency/Price";
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
    tuition: string;
    tuition_fee?: number;
    currency?: string;
    deadline: string;
    badges: string[];
    scholarship_chance?: string;
    has_fast_track?: boolean;
}

interface ProgramCardProps {
    program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
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

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-lg bg-card flex flex-col h-full relative">
            {/* Compare Checkbox */}
            <div className="absolute top-3 right-3 z-10">
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

            {/* Scholarship Badge */}
            {hasScholarship && (
                <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t("scholarship")}
                    </Badge>
                </div>
            )}

            {/* Header with gradient */}
            <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

            <CardContent className="p-6 flex-1 flex flex-col">
                {/* Top Section - Level Badge & Icon */}
                <div className="flex justify-between items-start mb-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <GraduationCap className="h-7 w-7 text-primary" />
                    </div>
                    <Badge
                        variant={program.level === "Master" ? "default" : "secondary"}
                        className="px-3 py-1 text-xs font-semibold"
                    >
                        {program.level}
                    </Badge>
                </div>

                {/* Program Info */}
                <div className="mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{program.university}</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                        {program.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <span className="truncate">{program.city}</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" /> {t("duration")}
                        </span>
                        <span className="text-sm font-semibold">{program.duration}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" /> {t("intake")}
                        </span>
                        <span className="text-sm font-semibold truncate">
                            {program.deadline || t("contact")}
                        </span>
                    </div>
                </div>

                {/* Tuition - Highlighted */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg mb-4 border border-primary/20">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" /> {t("tuitionFee")}
                    </span>
                    <span className="text-base font-bold text-primary">
                        {typeof program.tuition_fee === "number" ? (
                            <Price amount={program.tuition_fee} currency={program.currency || "CNY"} />
                        ) : (
                            program.tuition
                        )}
                    </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {program.has_fast_track && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-200 border-yellow-200">
                            <Zap className="h-3 w-3 mr-1 fill-yellow-600 text-yellow-600 animate-pulse" />
                            {t("fastTrack") || 'Fast Track'}
                        </Badge>
                    )}
                    {program.badges.slice(0, 3).map((badge, index) => (
                        <Badge key={index} variant="outline" className="text-xs font-normal">
                            {badge}
                        </Badge>
                    ))}
                    {program.badges.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">
                            +{program.badges.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex gap-2">
                {/* Quick View Button */}
                <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
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

                {/* View Program Button */}
                <Link href={`/programs/${program.slug || program.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                        {t("viewProgram")}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
