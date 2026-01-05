"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, ExternalLink, Heart, Share2, GraduationCap, Star, Award, Users, Calendar, TrendingUp, Zap, FileText, Video, Phone, MessageCircle, Info } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { RequestInformationDialog } from "./RequestInformationDialog";
import { useTranslations } from "next-intl";

interface UniversityStats {
    founded?: string;
    students?: string;
    ranking?: string;
    intlStudents?: string;
}

interface University {
    id: string;
    name: string;
    nameLocal?: string;
    city: string;
    province: string;
    cover_photo_url?: string;
    gallery_images?: string[];
    logo_url?: string;
    has_fast_track?: boolean;
    badges?: string[];
    stats: UniversityStats;
    website?: string;
    brochure_url?: string;
    virtual_tour_url?: string;
    schedule_call_url?: string;
    advisor_chat_url?: string;
}

interface UniversityHeaderProps {
    university: University;
}

export function UniversityHeader({ university }: UniversityHeaderProps) {
    const t = useTranslations('UniversityHeader');
    const [isSaved, setIsSaved] = useState(false);

    // Default URLs if not provided by university
    const scheduleCallUrl = university.schedule_call_url || "https://booking.studyinturkiye.com/";
    const advisorChatUrl = university.advisor_chat_url || "https://wa.me/905543081000";

    return (
        <div className="relative overflow-hidden">
            {/* Banner Image with Parallax Effect */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                {/* Background Image */}
                {university.cover_photo_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url(${university.cover_photo_url})` }}
                    />
                ) : university.gallery_images && university.gallery_images.length > 0 ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url(${university.gallery_images[0]})` }}
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-orange-600"
                    />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                {/* Animated Gradient Accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-yellow-500/20 animate-pulse" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="container mx-auto px-4 md:px-6 pb-8">
                        <div className="max-w-4xl">
                            {/* Ranking Badge */}
                            <div className="mb-4 flex flex-wrap gap-2">
                                {university.has_fast_track && (
                                    <Badge
                                        className="bg-yellow-400/90 backdrop-blur-md text-yellow-950 border-yellow-400/30 px-3 py-1 text-sm font-bold shadow-[0_0_15px_rgba(250,204,21,0.6)] border-yellow-300"
                                    >
                                        <Zap className="h-3 w-3 mr-1 fill-yellow-950 animate-pulse" />
                                        {t('fastTrack')}
                                    </Badge>
                                )}
                                {university.badges && university.badges.length > 0 && (
                                    university.badges.slice(0, 3).map((badge: string, index: number) => (
                                        <Badge
                                            key={index}
                                            className="bg-white/20 backdrop-blur-md text-white border-white/30 px-3 py-1 text-sm font-semibold"
                                        >
                                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                            {badge}
                                        </Badge>
                                    ))
                                )}
                            </div>

                            {/* University Name */}
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-2xl">
                                {university.name}
                            </h1>

                            {/* Local Name */}
                            {university.nameLocal && university.nameLocal !== university.name && (
                                <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
                                    {university.nameLocal}
                                </p>
                            )}

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-4 md:gap-6 text-white/90 mb-6">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm font-medium">{university.city}, {university.province}</span>
                                </div>
                                {university.stats.founded && university.stats.founded !== "N/A" && (
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm font-medium">{t('est', { founded: university.stats.founded })}</span>
                                    </div>
                                )}
                                {university.stats.students && university.stats.students !== "N/A" && (
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Users className="h-4 w-4" />
                                        <span className="text-sm font-medium">{t('studentsCount', { students: university.stats.students })}</span>
                                    </div>
                                )}
                                {university.website && (
                                    <a
                                        href={university.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span className="text-sm font-medium">{t('website')}</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-500/50 font-bold px-8"
                                >
                                    <GraduationCap className="mr-2 h-5 w-5" />
                                    {t('applyNow')}
                                </Button>

                                <RequestInformationDialog
                                    universityName={university.name}
                                    universityId={university.id}
                                    trigger={
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-lg"
                                        >
                                            <Info className="mr-2 h-5 w-5" />
                                            {t('requestInfo')}
                                        </Button>
                                    }
                                />

                                {university.brochure_url && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 font-semibold"
                                        asChild
                                    >
                                        <a href={university.brochure_url} target="_blank" rel="noopener noreferrer">
                                            <FileText className="mr-2 h-4 w-4" />
                                            {t('brochure')}
                                        </a>
                                    </Button>
                                )}

                                {university.virtual_tour_url && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 font-semibold"
                                        asChild
                                    >
                                        <a href={university.virtual_tour_url} target="_blank" rel="noopener noreferrer">
                                            <Video className="mr-2 h-4 w-4" />
                                            {t('virtualTour')}
                                        </a>
                                    </Button>
                                )}

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 font-semibold"
                                    asChild
                                >
                                    <a href={scheduleCallUrl} target="_blank" rel="noopener noreferrer">
                                        <Phone className="mr-2 h-4 w-4" />
                                        {t('scheduleCall')}
                                    </a>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 font-semibold"
                                    asChild
                                >
                                    <a href={advisorChatUrl} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        {t('chatAdvisor')}
                                    </a>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 font-semibold"
                                    onClick={() => setIsSaved(!isSaved)}
                                >
                                    <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                                    {isSaved ? t('saved') : t('save')}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 font-semibold"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    {t('share')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* University Logo Card - Overlapping */}
            <div className="container mx-auto px-4 md:px-6 relative -mt-20 mb-12 z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-gray-100">
                    {/* Logo */}
                    <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl flex items-center justify-center border-2 border-gray-200 shrink-0 overflow-hidden">
                        {university.logo_url ? (
                            <Image
                                src={university.logo_url}
                                alt={`${university.name} logo`}
                                fill
                                className="object-contain p-4"
                            />
                        ) : (
                            <div className="text-3xl font-black text-gray-700 text-center p-2">
                                {university.name.split(' ').map((word: string) => word[0]).join('').slice(0, 2)}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            <div className="text-center md:text-start">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-xs font-medium mb-2">
                                    <Calendar className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                                    <span>{t('founded')}</span>
                                </div>
                                <div className="text-3xl font-black text-gray-900">
                                    {university.stats.founded || "N/A"}
                                </div>
                            </div>
                            <div className="text-center md:text-start">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-xs font-medium mb-2">
                                    <Users className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                                    <span>{t('students')}</span>
                                </div>
                                <div className="text-3xl font-black text-gray-900">
                                    {university.stats.students || "N/A"}
                                </div>
                            </div>
                            <div className="text-center md:text-start">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-xs font-medium mb-2">
                                    <Award className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                                    <span>{t('ranking')}</span>
                                </div>
                                <div className="text-3xl font-black text-gray-900">
                                    {university.stats.ranking || "N/A"}
                                </div>
                            </div>
                            <div className="text-center md:text-start">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-xs font-medium mb-2">
                                    <TrendingUp className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                                    <span>{t('international')}</span>
                                </div>
                                <div className="text-3xl font-black text-gray-900">
                                    {university.stats.intlStudents || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
