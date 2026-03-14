"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    MapPin,
    BookOpen,
    Building2,
    Award,
    GraduationCap,
    Globe,
    Sparkles,
    Zap,
    ArrowRight,
    TrendingUp,
    ClipboardCheck,
    GitCompareArrows,
} from "lucide-react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { Price } from "@/components/currency/PriceDisplay";
import { useTranslations } from "next-intl";

interface University {
    id: string;
    slug: string;
    name: string;
    city: string;
    province: string;
    programs: number;
    minTuition: string;
    minTuitionFee?: number;
    currency?: string;
    badges: string[];
    logo?: string;
    photo?: string;
    ranking?: string;
    type?: string;
    university_type?: string;
    institution_category?: string;
    has_fast_track?: boolean;
    availableLevels?: string[];
    availableLanguages?: string[];
    hasScholarship?: boolean;
    hasCscaExam?: boolean;
}

interface UniversityCardProps {
    university: University;
    variant?: 'grid' | 'list';
    isComparing?: boolean;
    onToggleCompare?: () => void;
    compareDisabled?: boolean;
}

export const UniversityCard = React.memo(function UniversityCard({ university, variant = 'grid', isComparing, onToggleCompare, compareDisabled }: UniversityCardProps) {
    const t = useTranslations('UniversitiesCard');

    if (variant === 'list') {
        return <UniversityListCard university={university} t={t} isComparing={isComparing} onToggleCompare={onToggleCompare} compareDisabled={compareDisabled} />;
    }

    return <UniversityGridCard university={university} t={t} isComparing={isComparing} onToggleCompare={onToggleCompare} compareDisabled={compareDisabled} />;
});

/* ===========================
   GRID CARD — Separate Mobile / Desktop
   =========================== */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UniversityGridCard({ university, t, isComparing, onToggleCompare, compareDisabled }: { university: University; t: any; isComparing?: boolean; onToggleCompare?: () => void; compareDisabled?: boolean }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Card className="overflow-hidden transition-all duration-300 bg-card group flex flex-col h-full border border-border/60 shadow-sm hover:shadow-md">
                <div className="flex flex-col h-full">
                <Link href={`/universities/${university.slug}`} className="flex flex-col h-full">
                    {/* Compact hero with logo inline */}
                    <div className="relative h-32 overflow-hidden shrink-0">
                        {university.photo ? (
                            <Image
                                src={university.photo}
                                alt={university.name}
                                fill
                                sizes="100vw"
                                loading="lazy"
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-muted-foreground/15" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Top badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center gap-1.5">
                            {university.ranking && (
                                <div className="bg-amber-500/90 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                                    <Award className="h-2.5 w-2.5" />
                                    #{university.ranking}
                                </div>
                            )}
                            {university.has_fast_track && (
                                <div className="bg-emerald-500/90 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                                    <Zap className="h-2.5 w-2.5" />
                                    {t('fastTrack')}
                                </div>
                            )}
                        </div>

                        {/* Logo chip at bottom-left of image */}
                        <div className="absolute bottom-2.5 left-2.5 h-11 w-11 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
                            {university.logo ? (
                                <Image
                                    src={university.logo}
                                    alt={`${university.name} logo`}
                                    fill
                                    sizes="44px"
                                    loading="lazy"
                                    className="object-contain p-1"
                                />
                            ) : (
                                <Building2 className="h-5 w-5 text-primary/70" />
                            )}
                        </div>

                        {/* Program count chip */}
                        <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-primary" />
                            {university.programs}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pt-3 pb-2 flex-1 flex flex-col">
                        {/* Name */}
                        <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-foreground mb-1">
                            {university.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-[13px] text-muted-foreground mb-2.5">
                            <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-primary/60" />
                            <span className="truncate">{university.city}, {university.province}</span>
                        </div>

                        {/* Key badges — max 2 */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {university.hasScholarship && (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-medium px-2 py-0.5 gap-1">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {t('scholarship')}
                                </Badge>
                            )}
                            {university.hasCscaExam && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium px-2 py-0.5 gap-1">
                                    <ClipboardCheck className="h-2.5 w-2.5" />
                                    {t('cscaExam')}
                                </Badge>
                            )}
                        </div>

                        {/* Tuition — clean line */}
                        <div className="mt-auto pt-2.5 border-t border-border/40 flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                                {university.minTuitionFee && university.minTuitionFee > 0 ? t('tuitionFrom') : t('tuition')}
                            </span>
                            <span className="font-bold text-[15px] text-primary">
                                {university.minTuitionFee && typeof university.minTuitionFee === 'number' ? (
                                    <Price amount={university.minTuitionFee} currency={university.currency || 'CNY'} />
                                ) : (
                                    <span className="text-[13px] text-muted-foreground font-medium">{t('contactForPricing')}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Single CTA */}
                <div className="px-4 pb-4">
                    <Link href={`/universities/${university.slug}`} className="block">
                        <Button className="w-full h-10 text-sm gap-1.5 active:scale-[0.97] transition-transform">
                            {t('viewUniversity')}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden transition-all duration-300 bg-card group flex flex-col h-full border border-border/60 shadow-sm hover:shadow-md md:hover:shadow-xl md:hover:-translate-y-1">
            <div className="flex flex-col h-full">
                {/* Hero Banner */}
                <Link
                    href={`/universities/${university.slug}`}
                    className="h-44 relative overflow-hidden shrink-0 block"
                >
                    {university.photo ? (
                        <Image
                            src={university.photo}
                            alt={university.name}
                            fill
                            sizes="(max-width: 1280px) 50vw, 33vw"
                            loading="lazy"
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 flex items-center justify-center">
                            <Building2 className="h-16 w-16 text-muted-foreground/15" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Ranking + Fast Track */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                        {university.ranking && (
                            <div className="bg-amber-500/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-lg">
                                <Award className="h-3 w-3" />
                                #{university.ranking}
                            </div>
                        )}
                        {university.has_fast_track && (
                            <div className="bg-emerald-500/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-lg ml-auto">
                                <Zap className="h-3 w-3" />
                                {t('fastTrack')}
                            </div>
                        )}
                    </div>

                    {/* Program count */}
                    <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-background/95 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md">
                        <BookOpen className="h-3 w-3 text-primary" />
                        {university.programs} {t('programs')}
                    </div>
                </Link>

                <CardContent className="px-5 pt-12 pb-4 relative flex-1 flex flex-col">
                    {/* Logo */}
                    <div className="absolute -top-10 left-5 h-20 w-20 rounded-2xl bg-white dark:bg-card shadow-lg flex items-center justify-center border-4 border-background overflow-hidden z-10 ring-1 ring-border/30">
                        {university.logo ? (
                            <Image
                                src={university.logo}
                                alt={`${university.name} logo`}
                                fill
                                sizes="80px"
                                loading="lazy"
                                className="object-contain p-2"
                            />
                        ) : (
                            <Building2 className="h-8 w-8 text-primary/70" />
                        )}
                    </div>

                    {/* Name & Location */}
                    <div className="mb-3">
                        <Link href={`/universities/${university.slug}`} className="block group/title">
                            <h3 className="font-bold text-[15px] leading-snug group-hover/title:text-primary transition-colors line-clamp-2 min-h-11">
                                {university.name}
                            </h3>
                        </Link>
                        <div className="flex items-center text-[13px] text-muted-foreground mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-primary/60" />
                            <span className="truncate">{university.city}, {university.province}</span>
                        </div>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {university.hasScholarship && (
                            <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] font-medium px-2 py-0.5 gap-1">
                                <Sparkles className="h-2.5 w-2.5" />
                                {t('scholarship')}
                            </Badge>
                        )}
                        {university.hasCscaExam && (
                            <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px] font-medium px-2 py-0.5 gap-1">
                                <ClipboardCheck className="h-2.5 w-2.5" />
                                {t('cscaExam')}
                            </Badge>
                        )}
                        {university.availableLevels && university.availableLevels.length > 0 && (
                            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 gap-1">
                                <GraduationCap className="h-2.5 w-2.5" />
                                {university.availableLevels.slice(0, 2).join(' · ')}
                                {university.availableLevels.length > 2 && ` +${university.availableLevels.length - 2}`}
                            </Badge>
                        )}
                        {university.availableLanguages && university.availableLanguages.length > 0 && (
                            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 gap-1">
                                <Globe className="h-2.5 w-2.5" />
                                {university.availableLanguages.slice(0, 2).join(' · ')}
                            </Badge>
                        )}
                    </div>

                    {/* Feature badges */}
                    {university.badges && university.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {university.badges.slice(0, 3).map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-[10px] font-normal px-2 py-0.5 bg-muted/70">
                                    {badge}
                                </Badge>
                            ))}
                            {university.badges.length > 3 && (
                                <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5 bg-muted/70">
                                    +{university.badges.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Tuition */}
                    <div className="mt-auto pt-3 border-t border-dashed border-border/60">
                        <div className="flex items-baseline justify-between">
                            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                                {university.minTuitionFee && university.minTuitionFee > 0 ? t('tuitionFrom') : t('tuition')}
                            </span>
                            <span className="font-bold text-base text-primary">
                                {university.minTuitionFee && typeof university.minTuitionFee === 'number' ? (
                                    <Price amount={university.minTuitionFee} currency={university.currency || 'CNY'} />
                                ) : (
                                    <span className="text-sm text-muted-foreground font-medium">{t('contactForPricing')}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="px-5 pb-5 gap-2 shrink-0">
                    <Link href={`/universities/${university.slug}`} className="flex-1">
                        <Button className="w-full h-9 text-[13px] gap-1.5 group/btn active:scale-[0.97] transition-transform" size="sm">
                            {t('viewUniversity')}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                    </Link>
                    <Link href={`/programs?university=${university.slug}`}>
                        <Button variant="outline" size="sm" className="h-9 w-auto px-3 text-[13px]">
                            <BookOpen className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                    {onToggleCompare && (
                        <Button
                            variant={isComparing ? "default" : "outline"}
                            size="sm"
                            className={`h-9 w-auto px-3 text-[13px] ${isComparing ? 'bg-primary' : ''}`}
                            onClick={(e) => { e.preventDefault(); onToggleCompare(); }}
                            disabled={compareDisabled}
                            title={isComparing ? t('removeFromCompare') : t('addToCompare')}
                        >
                            <GitCompareArrows className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </CardFooter>
            </div>
        </Card>
    );
    // end desktop return
}

/* ===========================
   LIST CARD VARIANT
   =========================== */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UniversityListCard({ university, t, isComparing, onToggleCompare, compareDisabled }: { university: University; t: any; isComparing?: boolean; onToggleCompare?: () => void; compareDisabled?: boolean }) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 shadow-sm bg-card group">
            <div className="flex flex-col sm:flex-row">
                {/* Left: Photo + Logo */}
                <Link
                    href={`/universities/${university.slug}`}
                    className="w-full sm:w-52 h-36 sm:h-auto bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden shrink-0 block"
                >
                    {university.photo ? (
                        <Image
                            src={university.photo}
                            alt={university.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 208px"
                            loading="lazy"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
                            <Building2 className="h-12 w-12 text-muted-foreground/15" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/5" />

                    {university.ranking && (
                        <div className="absolute top-2.5 left-2.5 bg-amber-500/95 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md">
                            <Award className="h-2.5 w-2.5" />
                            #{university.ranking}
                        </div>
                    )}
                    <div className="absolute bottom-2.5 left-2.5 h-14 w-14 rounded-xl bg-white dark:bg-card shadow-lg flex items-center justify-center border-2 border-background overflow-hidden ring-1 ring-border/20">
                        {university.logo ? (
                            <Image
                                src={university.logo}
                                alt={`${university.name} logo`}
                                fill
                                sizes="56px"
                                loading="lazy"
                                className="object-contain p-1.5"
                            />
                        ) : (
                            <Building2 className="h-5 w-5 text-primary/70" />
                        )}
                    </div>
                </Link>

                {/* Right: Content */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                        <Link href={`/universities/${university.slug}`} className="block group/title">
                            <h3 className="font-bold text-base leading-snug group-hover/title:text-primary transition-colors line-clamp-1 mb-1">
                                {university.name}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2.5">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                                <span className="truncate">{university.city}, {university.province}</span>
                            </span>
                            {university.has_fast_track && (
                                <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] font-medium px-2 py-0 gap-1">
                                    <Zap className="h-2.5 w-2.5" />
                                    {t('fastTrack')}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {university.hasScholarship && (
                                <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] font-medium px-2 py-0 gap-1">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {t('scholarship')}
                                </Badge>
                            )}
                            {university.hasCscaExam && (
                                <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px] font-medium px-2 py-0 gap-1">
                                    <ClipboardCheck className="h-2.5 w-2.5" />
                                    {t('cscaExam')}
                                </Badge>
                            )}
                            {university.availableLevels && university.availableLevels.length > 0 && (
                                <Badge variant="outline" className="text-[10px] font-medium px-2 py-0 gap-1">
                                    <GraduationCap className="h-2.5 w-2.5" />
                                    {university.availableLevels.join(' · ')}
                                </Badge>
                            )}
                            {university.availableLanguages && university.availableLanguages.length > 0 && (
                                <Badge variant="outline" className="text-[10px] font-medium px-2 py-0 gap-1">
                                    <Globe className="h-2.5 w-2.5" />
                                    {university.availableLanguages.join(' · ')}
                                </Badge>
                            )}
                        </div>
                        {university.badges && university.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {university.badges.slice(0, 4).map((badge, index) => (
                                    <Badge key={index} variant="secondary" className="text-[10px] font-normal px-2 py-0 bg-muted/70">
                                        {badge}
                                    </Badge>
                                ))}
                                {university.badges.length > 4 && (
                                    <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0 bg-muted/70">
                                        +{university.badges.length - 4}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-5 sm:shrink-0 text-sm">
                        <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-muted/40">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-0.5">
                                <BookOpen className="h-3 w-3" /> {t('programs')}
                            </span>
                            <span className="font-bold text-lg">{university.programs}</span>
                        </div>
                        <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-primary/5">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-0.5">
                                <TrendingUp className="h-3 w-3" />
                                {university.minTuitionFee && university.minTuitionFee > 0 ? t('tuitionFrom') : t('tuition')}
                            </span>
                            <span className="font-bold text-primary">
                                {university.minTuitionFee && typeof university.minTuitionFee === 'number' ? (
                                    <Price amount={university.minTuitionFee} currency={university.currency || 'CNY'} />
                                ) : (
                                    <span className="text-sm text-muted-foreground">{t('contactForPricing')}</span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:shrink-0">
                        <Link href={`/universities/${university.slug}`}>
                            <Button size="sm" className="h-9 gap-1.5 group/btn active:scale-[0.97] transition-transform">
                                {t('viewUniversity')}
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                            </Button>
                        </Link>
                        <Link href={`/programs?university=${university.slug}`}>
                            <Button variant="outline" size="sm" className="h-9 active:scale-[0.97] transition-transform">
                                {t('viewPrograms')}
                            </Button>
                        </Link>
                        {onToggleCompare && (
                            <Button
                                variant={isComparing ? "default" : "outline"}
                                size="sm"
                                className={`h-9 active:scale-[0.97] transition-transform ${isComparing ? 'bg-primary' : ''}`}
                                onClick={(e) => { e.preventDefault(); onToggleCompare(); }}
                                disabled={compareDisabled}
                                title={isComparing ? t('removeFromCompare') : t('addToCompare')}
                            >
                                <GitCompareArrows className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
