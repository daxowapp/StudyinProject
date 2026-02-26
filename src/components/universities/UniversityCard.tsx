"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, BookOpen, DollarSign, Building2, Award } from "lucide-react";
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
    minTuitionFee?: number; // Raw number for Price component
    currency?: string; // Currency code
    badges: string[];
    logo?: string;
    photo?: string;
    ranking?: string;
    type?: string;
    university_type?: string;
    institution_category?: string;
    has_fast_track?: boolean;
}

interface UniversityCardProps {
    university: University;
    variant?: 'grid' | 'list';
}

export function UniversityCard({ university, variant = 'grid' }: UniversityCardProps) {
    const t = useTranslations('UniversitiesCard');

    if (variant === 'list') {
        return (
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border shadow-sm bg-card group">
                <div className="flex flex-col sm:flex-row">
                    {/* Left: Photo + Logo */}
                    <Link
                        href={`/universities/${university.slug}`}
                        className="w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden shrink-0 block"
                    >
                        {university.photo ? (
                            <Image
                                src={university.photo}
                                alt={university.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-muted-foreground/20" />
                            </div>
                        )}
                        {university.ranking && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Award className="h-2.5 w-2.5" />
                                #{university.ranking}
                            </div>
                        )}
                        {/* Logo overlay */}
                        <div className="absolute bottom-2 left-2 h-12 w-12 rounded-lg bg-white dark:bg-background shadow-md flex items-center justify-center border-2 border-background overflow-hidden">
                            {university.logo ? (
                                <Image
                                    src={university.logo}
                                    alt={`${university.name} logo`}
                                    fill
                                    className="object-contain p-1"
                                />
                            ) : (
                                <Building2 className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    </Link>

                    {/* Right: Content */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                        {/* University Info */}
                        <div className="flex-1 min-w-0">
                            <Link href={`/universities/${university.slug}`} className="hover:text-primary transition-colors block">
                                <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                    {university.name}
                                </h3>
                            </Link>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{university.city}, {university.province}</span>
                                </span>
                                {university.type && (
                                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                                        {university.type}
                                    </Badge>
                                )}
                            </div>
                            {university.badges && university.badges.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {university.badges.slice(0, 4).map((badge, index) => (
                                        <Badge key={index} variant="secondary" className="text-[10px] font-normal px-2 py-0">
                                            {badge}
                                        </Badge>
                                    ))}
                                    {university.badges.length > 4 && (
                                        <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0">
                                            +{university.badges.length - 4}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-5 sm:shrink-0 text-sm">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" /> {t('programs')}
                                </span>
                                <span className="font-semibold">{university.programs}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {university.minTuitionFee && university.minTuitionFee > 0 ? t('tuitionFrom') : t('tuition')}
                                </span>
                                <span className="font-semibold text-primary">
                                    {university.minTuitionFee && typeof university.minTuitionFee === 'number' ? (
                                        <Price amount={university.minTuitionFee} currency={university.currency || 'CNY'} />
                                    ) : (
                                        university.minTuition
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:shrink-0">
                            <Link href={`/universities/${university.slug}`}>
                                <Button size="sm" className="h-9">{t('viewUniversity')}</Button>
                            </Link>
                            <Link href={`/programs?university=${university.slug}`}>
                                <Button variant="outline" size="sm" className="h-9">{t('viewPrograms')}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-card group flex flex-col h-full">
            {/* University Photo/Banner */}
            <Link
                href={`/universities/${university.slug}`}
                className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden shrink-0 block"
            >
                {university.photo ? (
                    <Image
                        src={university.photo}
                        alt={university.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-muted-foreground/20" />
                    </div>
                )}
                {/* Ranking Badge */}
                {university.ranking && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Award className="h-3 w-3" />
                        #{university.ranking}
                    </div>
                )}
            </Link>

            <CardContent className="p-6 pt-14 relative flex-1 flex flex-col">
                {/* Logo */}
                <div className="absolute -top-12 left-6 h-24 w-24 rounded-xl bg-white dark:bg-background shadow-xl flex items-center justify-center border-4 border-background overflow-hidden z-10">
                    {university.logo ? (
                        <Image
                            src={university.logo}
                            alt={`${university.name} logo`}
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <Building2 className="h-10 w-10 text-primary" />
                    )}
                </div>

                {/* Content with proper spacing from logo */}
                <div className="pl-0 pt-0 mb-3">
                    <Link href={`/universities/${university.slug}`} className="hover:text-primary transition-colors block">
                        <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                            {university.name}
                        </h3>
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <span className="truncate">{university.city}, {university.province}</span>
                    </div>
                    {university.type && (
                        <Badge variant="outline" className="text-xs">
                            {university.type}
                        </Badge>
                    )}
                </div>

                {/* Badges section with fixed height */}
                <div className="min-h-[4rem] mb-4">
                    {university.badges && university.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {university.badges.slice(0, 3).map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-xs font-normal">
                                    {badge}
                                </Badge>
                            ))}
                            {university.badges.length > 3 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                    +{university.badges.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-dashed mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {t('programs')}
                        </span>
                        <span className="font-semibold">{university.programs}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {university.minTuitionFee && university.minTuitionFee > 0 ? t('tuitionFrom') : t('tuition')}
                        </span>
                        <span className="font-semibold text-primary">
                            {university.minTuitionFee && typeof university.minTuitionFee === 'number' ? (
                                <Price amount={university.minTuitionFee} currency={university.currency || 'CNY'} />
                            ) : (
                                university.minTuition
                            )}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex gap-2 shrink-0">
                <Link href={`/universities/${university.slug}`} className="w-full">
                    <Button className="w-full">{t('viewUniversity')}</Button>
                </Link>
                <Link href={`/programs?university=${university.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">{t('viewPrograms')}</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

