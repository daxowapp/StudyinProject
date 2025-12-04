"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, MapPin, Calendar, DollarSign, GraduationCap, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/currency/Price";
import { useTranslations } from "next-intl";

interface Program {
    id: string;
    slug?: string;
    name: string;
    university: string;
    city: string;
    level: string;
    duration: string;
    tuition: string;
    tuition_fee?: number; // Raw number for Price component
    currency?: string; // Currency code
    deadline: string;
    badges: string[];
}

interface ProgramCardProps {
    program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
    const t = useTranslations('Programs.card');

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-lg bg-card flex flex-col h-full">
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
                            <Clock className="h-3 w-3" /> {t('duration')}
                        </span>
                        <span className="text-sm font-semibold">{program.duration}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" /> {t('intake')}
                        </span>
                        <span className="text-sm font-semibold truncate">{program.deadline || t('contact')}</span>
                    </div>
                </div>

                {/* Tuition - Highlighted */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg mb-4 border border-primary/20">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" /> {t('tuitionFee')}
                    </span>
                    <span className="text-base font-bold text-primary">
                        {typeof program.tuition_fee === 'number' ? (
                            <Price amount={program.tuition_fee} currency={program.currency || 'CNY'} />
                        ) : (
                            program.tuition
                        )}
                    </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
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

            <CardFooter className="p-6 pt-0">
                <Link href={`/programs/${program.slug || program.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                        {t('viewProgram')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

