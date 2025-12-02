"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, Award, Home, Heart, Activity } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UniversityScholarship {
    id: string;
    type_name: string;
    display_name: string | null;
    description: string | null;
    tuition_coverage_percentage: number;
    duration_years: number | null;
    service_fee_usd: number;
    service_fee_cny: number;
    includes_accommodation: boolean;
    accommodation_type: string | null;
    includes_stipend: boolean;
    stipend_amount_monthly: number | null;
    stipend_currency: string;
    stipend_duration_months: number | null;
    includes_medical_insurance: boolean;
    one_time_allowance: number | null;
    one_time_allowance_currency: string;
}

interface UniversityScholarshipsSectionProps {
    universityId: string;
    title?: string;
    description?: string;
    showHeader?: boolean;
}

export function UniversityScholarshipsSection({
    universityId,
    title = "Available Scholarship Types",
    description = "Choose the scholarship type that fits your budget",
    showHeader = true
}: UniversityScholarshipsSectionProps) {
    const [scholarships, setScholarships] = useState<UniversityScholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchScholarships();
    }, [universityId]);

    const fetchScholarships = async () => {
        try {
            const { data, error } = await supabase
                .from("university_scholarships")
                .select("*")
                .eq("university_id", universityId)
                .eq("is_active", true)
                .order("display_order", { ascending: true });

            if (error) throw error;
            setScholarships(data || []);
        } catch (error) {
            console.error("Error fetching scholarships:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading scholarships...</div>;
    }

    if (!scholarships || scholarships.length === 0) {
        return (
            <div className="text-center py-12">
                <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No scholarships available for this university yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showHeader && (
                <>
                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 font-semibold text-sm mb-4">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Scholarship Options</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div>

                    {/* Call to Action */}
                    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-orange-500/5 to-red-500/10 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="max-w-2xl mx-auto space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold text-sm mb-2">
                                    <Award className="h-4 w-4" />
                                    <span>Discover More Opportunities</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold font-heading">
                                    Explore All Scholarship Options
                                </h3>
                                <p className="text-muted-foreground max-w-xl mx-auto">
                                    Not sure which scholarship is right for you? Browse our complete scholarship guide to compare all options, understand eligibility requirements, and find the perfect fit for your academic journey.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                    <a href="#scholarship-cards">
                                        <Button
                                            size="lg"
                                            className="bg-gradient-to-r from-primary via-orange-500 to-red-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-600/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById('scholarship-cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                        >
                                            <Award className="mr-2 h-5 w-5" />
                                            View All Scholarships
                                        </Button>
                                    </a>
                                    <Link href="/contact">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-2 border-primary/30 hover:bg-primary/10 font-semibold px-8"
                                        >
                                            <Heart className="mr-2 h-5 w-5" />
                                            Get Personalized Advice
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Scholarship Cards */}
            <div id="scholarship-cards" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scholarships.map((scholarship, index) => {
                    // Determine theme based on index or type
                    const themes = [
                        {
                            color: "emerald",
                            border: "border-emerald-500/20",
                            bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5",
                            badge: "bg-emerald-500/10 text-emerald-700",
                            popularBadge: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                        },
                        {
                            color: "blue",
                            border: "border-blue-500/20",
                            bg: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
                            badge: "bg-blue-500/10 text-blue-700",
                            popularBadge: "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        },
                        {
                            color: "purple",
                            border: "border-purple-500/20",
                            bg: "bg-gradient-to-br from-purple-500/10 to-purple-500/5",
                            badge: "bg-purple-500/10 text-purple-700",
                            popularBadge: "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                        },
                        {
                            color: "slate",
                            border: "border-slate-500/20",
                            bg: "bg-gradient-to-br from-slate-500/10 to-slate-500/5",
                            badge: "bg-slate-500/10 text-slate-700",
                            popularBadge: "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
                        }
                    ];

                    const theme = themes[index % themes.length];
                    const isPopular = index === 0 && scholarship.tuition_coverage_percentage >= 100;

                    const benefits = [];
                    if (scholarship.tuition_coverage_percentage > 0) {
                        benefits.push(`${scholarship.tuition_coverage_percentage}% tuition fee coverage`);
                    } else {
                        benefits.push("No scholarship (0% coverage)");
                    }
                    benefits.push("Application support & guidance");
                    benefits.push("Visa assistance");
                    benefits.push("Pre-departure orientation");
                    if (scholarship.includes_accommodation) {
                        benefits.push("Accommodation arrangement support");
                    }

                    return (
                        <div
                            key={scholarship.id}
                            className={`text-card-foreground flex flex-col gap-6 rounded-xl py-6 border-2 ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 ${theme.bg} relative overflow-hidden`}
                        >
                            {isPopular && (
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-transparent ${theme.popularBadge}`}>
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 border-b pb-6 border-border/50">
                                <div className="mb-4">
                                    <span className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-transparent ${theme.badge}`}>
                                        {scholarship.type_name}
                                    </span>
                                </div>
                                <div className="font-semibold text-xl mb-2 line-clamp-2 min-h-[3.5rem]">
                                    {scholarship.display_name || scholarship.type_name}
                                </div>
                                <div className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
                                    {scholarship.description || "Great option for international students."}
                                </div>
                            </div>

                            <div className="px-6 space-y-6 flex-1 flex flex-col">
                                {/* Coverage Box */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm">
                                    <div className="text-4xl font-bold text-primary mb-1">
                                        {scholarship.tuition_coverage_percentage}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">Tuition Coverage</p>
                                </div>

                                {/* Service Fee Box */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        Service Fee
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">USD:</span>
                                            <span className="font-bold text-lg">${Number(scholarship.service_fee_usd).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">CNY:</span>
                                            <span className="font-semibold">¥{Number(scholarship.service_fee_cny).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* What's Included Box */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm flex-1">
                                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        What's Included
                                    </h4>
                                    <ul className="space-y-2">
                                        {benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Apply Button */}
                                <Link href="/programs" className="mt-auto">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                                        Apply Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Note */}
            <Card className="border-none bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                            <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-sm">How Scholarships Work</h4>
                            <p className="text-xs text-muted-foreground">
                                The scholarship covers a percentage of your tuition fees. You pay the remaining tuition to the university + the one-time service fee for application support, visa assistance, and guidance.
                            </p>
                            <Link href="/scholarships" className="inline-block mt-2">
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    Learn more about scholarships →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
