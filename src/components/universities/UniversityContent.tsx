"use client";

import { useState } from "react";
import { ExpandableText } from "./ExpandableText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UniversityScholarshipsSection } from "@/components/scholarships/UniversityScholarshipsSection";
import { 
    CheckCircle2, Globe, MapPin, Users, Calendar, 
    GraduationCap, DollarSign, Clock, Languages,
    Award, TrendingUp, BookOpen, FileText, Play,
    Star, Heart, Share2, Download, ChevronRight,
    Sparkles, Target, Trophy, Building2, Mail,
    Video, Image as ImageIcon, Phone, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface UniversityContentProps {
    university: any;
}

export function UniversityContent({ university }: UniversityContentProps) {
    const [programLevel, setProgramLevel] = useState<string>("all");
    
    // Get unique program levels
    const uniqueLevels = university.programs?.map((p: any) => p.level as string) || [];
    const programLevels: string[] = ["all", ...Array.from(new Set(uniqueLevels))];
    
    // Filter programs by level
    const filteredPrograms = programLevel === "all" 
        ? university.programs 
        : university.programs?.filter((p: any) => p.level === programLevel);
    
    return (
        <div className="container mx-auto px-4 -mt-8 pb-20">
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Content - 8 columns */}
                <div className="lg:col-span-8 space-y-8">
                    {/* About Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                            <h2 className="text-4xl font-black">About</h2>
                        </div>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            <ExpandableText text={university.overview} maxLength={500} />
                        </div>
                    </motion.div>

                    {/* Why Choose Section */}
                    {university.highlights && university.highlights.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Sparkles className="h-8 w-8" />
                                    <h2 className="text-4xl font-black">Why Choose Us</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {university.highlights.map((highlight: string, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all group"
                                        >
                                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <p className="font-semibold text-lg">{highlight}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Programs Section */}
                    {university.programs && university.programs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                                    <h2 className="text-4xl font-black">Programs</h2>
                                </div>
                                <Badge className="bg-red-600 text-white px-4 py-2 text-lg">
                                    {filteredPrograms?.length || 0} Programs
                                </Badge>
                            </div>
                            
                            {/* Program Level Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {programLevels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setProgramLevel(level)}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                            programLevel === level
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-200'
                                        }`}
                                    >
                                        {level === "all" ? "All Programs" : level}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-4">
                                {filteredPrograms && filteredPrograms.length > 0 ? (
                                    filteredPrograms.map((program: any, index: number) => (
                                    <motion.div
                                        key={program.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:border-red-200"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                                    {program.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1">
                                                        <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                                                        {program.level}
                                                    </Badge>
                                                    <Badge className="bg-purple-100 text-purple-700 border-0 px-3 py-1">
                                                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                        {program.duration}
                                                    </Badge>
                                                    <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1">
                                                        <Languages className="h-3.5 w-3.5 mr-1.5" />
                                                        {program.language}
                                                    </Badge>
                                                    <Badge className="bg-orange-100 text-orange-700 border-0 px-3 py-1">
                                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                                        {program.intake}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500 mb-1">Tuition Fee</div>
                                                    <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                                                        {program.tuition}
                                                    </div>
                                                    <div className="text-xs text-gray-500">per year</div>
                                                </div>
                                                <Link href={`/programs/${program.slug || program.id}`}>
                                                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shrink-0">
                                                        View Program
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500 text-lg">No programs found for this level.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Scholarship Types Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
                    >
                        <UniversityScholarshipsSection 
                            universityId={university.id}
                            title="Available Scholarship Options"
                            description="Choose the scholarship type that best fits your budget for programs at this university"
                        />
                    </motion.div>

                    {/* Video Section */}
                    {university.video_url && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                                    <h2 className="text-4xl font-black">Campus Tour</h2>
                                </div>
                            </div>
                            <div className="aspect-video bg-black">
                                {university.video_url.includes('youtube.com') || university.video_url.includes('youtu.be') ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${university.video_url.includes('youtu.be') 
                                            ? university.video_url.split('youtu.be/')[1]?.split('?')[0]
                                            : university.video_url.split('v=')[1]?.split('&')[0]
                                        }`}
                                        title="University Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : null}
                            </div>
                        </motion.div>
                    )}

                    {/* Gallery Section */}
                    {university.gallery_images && university.gallery_images.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                                <h2 className="text-4xl font-black">Campus Gallery</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {university.gallery_images.map((image: string, index: number) => (
                                    <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-red-200 transition-all">
                                        <img 
                                            src={image} 
                                            alt={`Campus ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <p className="text-white font-semibold">View Image</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Admission Requirements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                            <h2 className="text-4xl font-black">Admission Requirements</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-900">
                                    <FileText className="h-6 w-6" />
                                    Academic Requirements
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>High school diploma or equivalent</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>Minimum GPA of 3.0/4.0</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>Academic transcripts</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-900">
                                    <Languages className="h-6 w-6" />
                                    Language Requirements
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>IELTS 6.0 or TOEFL 80+</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>HSK 4 for Chinese programs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>English proficiency certificate</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar - 4 columns */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Apply CTA - Sticky */}
                    <div className="sticky top-24 space-y-6">
                        {/* Main CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                            
                            <div className="relative z-10">
                                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                                    <GraduationCap className="h-8 w-8" />
                                </div>
                                <h3 className="text-3xl font-black mb-2">Ready to Apply?</h3>
                                <p className="text-white/90 mb-6">
                                    Start your journey at {university.name}
                                </p>
                                <div className="space-y-3">
                                    <Button size="lg" className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold text-lg h-14 shadow-xl">
                                        Apply Now
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full border-2 border-white text-white hover:bg-white/10 h-12">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Brochure
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: FileText, label: "Request Information", color: "blue" },
                                    { icon: MessageCircle, label: "Chat with Advisor", color: "purple" },
                                    { icon: Video, label: "Virtual Campus Tour", color: "green" },
                                    { icon: Phone, label: "Schedule a Call", color: "orange" },
                                ].map((action, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group text-left"
                                    >
                                        <div className={`h-12 w-12 rounded-xl bg-${action.color}-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{action.label}</div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, label: "Location", value: `${university.city}, ${university.province}`, color: "text-red-600" },
                                    { icon: Calendar, label: "Founded", value: university.stats.founded, color: "text-blue-600" },
                                    { icon: Users, label: "Students", value: university.stats.students, color: "text-purple-600" },
                                    { icon: TrendingUp, label: "International", value: university.stats.intlStudents, color: "text-green-600" },
                                    { icon: Award, label: "Ranking", value: university.stats.ranking, color: "text-yellow-600" },
                                ].map((fact, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <fact.icon className={`h-5 w-5 ${fact.color}`} />
                                            <span className="text-sm text-gray-600">{fact.label}</span>
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">{fact.value}</span>
                                    </div>
                                ))}
                            </div>
                            {university.website && (
                                <Link href={university.website} target="_blank">
                                    <Button variant="outline" className="w-full mt-4">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Official Website
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
