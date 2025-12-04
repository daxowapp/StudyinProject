"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, Award } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/currency/Price";

interface ScholarshipType {
    name: string;
    displayName: string;
    coverage: number;
    serviceFeeUSD: number;
    serviceFeeCNY: number;
    description: string;
    benefits: string[];
    color: string;
    borderColor: string;
    badgeColor: string;
    popular?: boolean;
}

const scholarshipTypes: ScholarshipType[] = [
    {
        name: "Type A",
        displayName: "Full Scholarship",
        coverage: 100,
        serviceFeeUSD: 3500,
        serviceFeeCNY: 25000,
        description: "Best option for complete tuition coverage",
        benefits: [
            "100% tuition fee coverage",
            "Application support",
            "Visa assistance",
            "Pre-departure orientation"
        ],
        color: "from-emerald-500/10 to-emerald-500/5",
        borderColor: "border-emerald-500/20",
        badgeColor: "bg-emerald-500/10 text-emerald-700",
        popular: true
    },
    {
        name: "Type B",
        displayName: "Partial (75%)",
        coverage: 75,
        serviceFeeUSD: 2800,
        serviceFeeCNY: 20000,
        description: "Great balance of coverage and fees",
        benefits: [
            "75% tuition fee coverage",
            "Application support",
            "Visa assistance",
            "Pre-departure orientation"
        ],
        color: "from-blue-500/10 to-blue-500/5",
        borderColor: "border-blue-500/20",
        badgeColor: "bg-blue-500/10 text-blue-700"
    },
    {
        name: "Type C",
        displayName: "Half (50%)",
        coverage: 50,
        serviceFeeUSD: 2200,
        serviceFeeCNY: 16000,
        description: "Affordable with significant reduction",
        benefits: [
            "50% tuition fee coverage",
            "Application support",
            "Visa assistance",
            "Pre-departure orientation"
        ],
        color: "from-purple-500/10 to-purple-500/5",
        borderColor: "border-purple-500/20",
        badgeColor: "bg-purple-500/10 text-purple-700"
    },
    {
        name: "Self-Funded",
        displayName: "Self-Funded",
        coverage: 0,
        serviceFeeUSD: 1500,
        serviceFeeCNY: 11000,
        description: "Full tuition with minimal fees",
        benefits: [
            "No scholarship (0% coverage)",
            "Application support",
            "Visa assistance",
            "Accommodation arrangement"
        ],
        color: "from-slate-500/10 to-slate-500/5",
        borderColor: "border-slate-500/20",
        badgeColor: "bg-slate-500/10 text-slate-700"
    }
];

interface ScholarshipTypesSectionProps {
    title?: string;
    description?: string;
    compact?: boolean;
}

export function ScholarshipTypesSection({
    title = "Available Scholarship Types",
    description = "Choose the scholarship type that fits your budget",
    compact = false
}: ScholarshipTypesSectionProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 font-semibold text-sm mb-4">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Scholarship Options</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Scholarship Cards */}
            <div className={`grid gap - 6 ${compact ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'} `}>
                {scholarshipTypes.map((type, index) => (
                    <Card
                        key={index}
                        className={`border - 2 ${type.borderColor} shadow - lg hover: shadow - xl transition - all duration - 300 bg - gradient - to - br ${type.color} relative overflow - hidden`}
                    >
                        {type.popular && (
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs">
                                    Popular
                                </Badge>
                            </div>
                        )}
                        <CardHeader className={compact ? "p-4" : "p-6"}>
                            <div className="mb-3">
                                <Badge className={type.badgeColor}>
                                    {type.name}
                                </Badge>
                            </div>
                            <CardTitle className={compact ? "text-lg" : "text-xl"}>{type.displayName}</CardTitle>
                            <CardDescription className="text-xs">
                                {type.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={compact ? "p-4 pt-0 space-y-4" : "p-6 pt-0 space-y-4"}>
                            {/* Coverage Badge */}
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 text-center">
                                <div className="text-3xl font-bold text-primary mb-1">
                                    {type.coverage}%
                                </div>
                                <p className="text-xs text-muted-foreground">Tuition Coverage</p>
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
                                        <span className="font-bold">${type.serviceFeeUSD.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Service Fee:</span>
                                        <span className="font-semibold text-sm">
                                            <Price amount={type.serviceFeeCNY} currency="CNY" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            {!compact && (
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2 text-xs flex items-center gap-2">
                                        <Check className="h-3 w-3 text-primary" />
                                        Included
                                    </h4>
                                    <ul className="space-y-1">
                                        {type.benefits.slice(0, 3).map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
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
