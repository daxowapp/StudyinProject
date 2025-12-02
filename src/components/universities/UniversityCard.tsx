import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, BookOpen, DollarSign, Building2, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Price } from "@/components/currency/Price";

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
}

export function UniversityCard({ university }: UniversityCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-card group flex flex-col h-full">
            {/* University Photo/Banner */}
            <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden shrink-0">
                {university.photo ? (
                    <img
                        src={university.photo}
                        alt={university.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
            </div>

            <CardContent className="p-6 pt-14 relative flex-1 flex flex-col">
                {/* Logo */}
                <div className="absolute -top-12 left-6 h-24 w-24 rounded-xl bg-white dark:bg-background shadow-xl flex items-center justify-center border-4 border-background overflow-hidden z-10">
                    {university.logo ? (
                        <img
                            src={university.logo}
                            alt={`${university.name} logo`}
                            className="w-full h-full object-contain p-2"
                        />
                    ) : (
                        <Building2 className="h-10 w-10 text-primary" />
                    )}
                </div>

                {/* Content with proper spacing from logo */}
                <div className="pl-0 pt-0 mb-3">
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                        {university.name}
                    </h3>
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
                            <BookOpen className="h-3 w-3" /> Programs
                        </span>
                        <span className="font-semibold">{university.programs}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> Tuition From
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
                    <Button className="w-full">View University</Button>
                </Link>
                <Link href={`/programs?university=${university.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">View Programs</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
