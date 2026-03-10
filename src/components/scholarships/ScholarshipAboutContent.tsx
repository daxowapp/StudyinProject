"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, DollarSign, Check, Info, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const scholarshipTypes = [
    {
        name: "Type A",
        displayName: "Full Scholarship",
        coverage: 100,
        description: "Best option for students seeking complete tuition coverage",
        benefits: [
            "100% tuition fee coverage",
            "Application support & guidance",
            "Visa assistance",
            "Pre-departure orientation",
            "Accommodation arrangement support"
        ],
        color: "from-emerald-500/10 to-emerald-500/5",
        borderColor: "border-emerald-500/20",
        badgeColor: "bg-emerald-500/10 text-emerald-700",
        popular: true
    },
    {
        name: "Type B",
        displayName: "Partial Scholarship (75%)",
        coverage: 75,
        description: "Great balance between scholarship coverage and service fees",
        benefits: [
            "75% tuition fee coverage",
            "Application support & guidance",
            "Visa assistance",
            "Pre-departure orientation",
            "Accommodation arrangement support"
        ],
        color: "from-blue-500/10 to-blue-500/5",
        borderColor: "border-blue-500/20",
        badgeColor: "bg-blue-500/10 text-blue-700"
    },
    {
        name: "Type C",
        displayName: "Half Scholarship (50%)",
        coverage: 50,
        description: "Affordable option with significant tuition reduction",
        benefits: [
            "50% tuition fee coverage",
            "Application support & guidance",
            "Visa assistance",
            "Pre-departure orientation",
            "Accommodation arrangement support"
        ],
        color: "from-purple-500/10 to-purple-500/5",
        borderColor: "border-purple-500/20",
        badgeColor: "bg-purple-500/10 text-purple-700"
    },
    {
        name: "Self-Funded",
        displayName: "Self-Funded (No Scholarship)",
        coverage: 0,
        description: "Pay full tuition with minimal service fees",
        benefits: [
            "No scholarship (0% coverage)",
            "Application support & guidance",
            "Visa assistance",
            "Pre-departure orientation",
            "Accommodation arrangement"
        ],
        color: "from-slate-500/10 to-slate-500/5",
        borderColor: "border-slate-500/20",
        badgeColor: "bg-slate-500/10 text-slate-700"
    }
];

const requiredDocuments = [
    "Valid passport",
    "High school certificate (translated version)",
    "Transcript (translated version)",
    "English proficiency certificate",
    "Personal statement",
    "Passport-size photo",
    "Portfolio (for Art/Design programs)"
];

export function ScholarshipAboutContent() {
    const t = useTranslations("Scholarships");

    return (
        <div className="container mx-auto px-4 md:px-6 py-16">
            {/* How It Works Section */}
            <Card className="border-none shadow-xl mb-16 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Info className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl">{t("about.howItWorks")}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        {t("about.howItWorksDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                {t("about.scholarshipCoverage")}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {t("about.scholarshipCoverageDescription")}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                {t("about.serviceFees")}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {t("about.serviceFeesDescription")}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Scholarship Types Grid */}
            <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-1 bg-primary rounded-full" />
                    <h2 className="text-3xl font-bold font-heading">{t("about.scholarshipTypes")}</h2>
                </div>

                <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 text-sm text-muted-foreground flex items-start gap-3 mb-8">
                    <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <p>
                        <strong>Note:</strong> {t("about.scholarshipNote")}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {scholarshipTypes.map((type, index) => (
                        <Card key={index} className={`border-2 ${type.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br ${type.color} relative overflow-hidden`}>
                            {type.popular && (
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <CardHeader>
                                <div className="mb-4">
                                    <Badge className={type.badgeColor}>
                                        {type.name}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl mb-2">{type.displayName}</CardTitle>
                                <CardDescription className="text-sm">
                                    {type.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center">
                                    <div className="text-4xl font-bold text-primary mb-1">
                                        {type.coverage}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">Tuition Coverage</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
                                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        What&apos;s Included
                                    </h4>
                                    <ul className="space-y-2">
                                        {type.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href="/scholarships">
                                    <Button className="w-full" variant={type.popular ? "default" : "outline"}>
                                        {t("about.searchPrograms")}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Required Documents */}
            <Card className="border-none shadow-xl mb-16">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{t("about.requiredDocuments")}</CardTitle>
                    </div>
                    <CardDescription>
                        {t("about.requiredDocumentsDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requiredDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{doc}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-none shadow-xl mb-16">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <HelpCircle className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{t("about.faq")}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">{t("about.faq1Question")}</h4>
                        <p className="text-sm text-muted-foreground">{t("about.faq1Answer")}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">{t("about.faq2Question")}</h4>
                        <p className="text-sm text-muted-foreground">{t("about.faq2Answer")}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">{t("about.faq3Question")}</h4>
                        <p className="text-sm text-muted-foreground">{t("about.faq3Answer")}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">{t("about.faq4Question")}</h4>
                        <p className="text-sm text-muted-foreground">{t("about.faq4Answer")}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
