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
                {scholarships.map((scholarship) => {
                    const benefits = [];
                    if (scholarship.tuition_coverage_percentage > 0) {
                        benefits.push(`${scholarship.tuition_coverage_percentage}% tuition coverage`);
                    }
                    if (scholarship.includes_accommodation) {
                        benefits.push(scholarship.accommodation_type || "Free accommodation");
                    }
                    if (scholarship.includes_stipend && scholarship.stipend_amount_monthly) {
                        benefits.push(`${scholarship.stipend_amount_monthly} ${scholarship.stipend_currency}/month stipend`);
                    }
                    if (scholarship.includes_medical_insurance) {
                        benefits.push("Medical insurance");
                    }
                    if (scholarship.one_time_allowance && scholarship.one_time_allowance > 0) {
                        benefits.push(`${scholarship.one_time_allowance} ${scholarship.one_time_allowance_currency} allowance`);
                    }

                    return (
                        <Card
                            key={scholarship.id}
                            className="h-full border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden flex flex-col"
                        >
                            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                                {/* Type Badge */}
                                <div className="mb-3">
                                    <Badge className="bg-primary/10 text-primary">
                                        {scholarship.type_name}
                                    </Badge>
                                </div>

                                {/* Display Name */}
                                <h3 className="text-lg font-bold min-h-[3.5rem] flex items-center">
                                    {scholarship.display_name || scholarship.type_name}
                                </h3>

                                {/* Description */}
                                <div className="min-h-[2.5rem]">
                                    {scholarship.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {scholarship.description}
                                        </p>
                                    )}
                                </div>

                                {/* Coverage Badge */}
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">
                                        {scholarship.tuition_coverage_percentage}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">Tuition Coverage</p>
                                    {scholarship.duration_years && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {scholarship.duration_years} year{scholarship.duration_years > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                {/* Service Fee */}
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2 text-xs flex items-center gap-2">
                                        <DollarSign className="h-3 w-3 text-primary" />
                                        Service Fee
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">USD:</span>
                                            <span className="font-bold">${Number(scholarship.service_fee_usd).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">CNY:</span>
                                            <span className="font-semibold text-sm">¥{Number(scholarship.service_fee_cny).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits Icons */}
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2 text-xs flex items-center gap-2">
                                        <Check className="h-3 w-3 text-primary" />
                                        Includes
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {scholarship.includes_accommodation && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Home className="h-3 w-3 mr-1" />
                                                Housing
                                            </Badge>
                                        )}
                                        {scholarship.includes_stipend && (
                                            <Badge variant="secondary" className="text-xs">
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                Stipend
                                            </Badge>
                                        )}
                                        {scholarship.includes_medical_insurance && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Activity className="h-3 w-3 mr-1" />
                                                Insurance
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Benefits List */}
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 flex-1 min-h-[8rem]">
                                    <ul className="space-y-1">
                                        {benefits.slice(0, 4).map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
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
