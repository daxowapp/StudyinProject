import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, DollarSign, Sparkles, Check, Info, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";

import { getScholarshipStats, ScholarshipStats } from "@/lib/scholarship-stats";

const baseScholarshipTypes = [
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

function formatPrice(min: number, max: number) {
    if (!min && !max) return "Contact";
    if (min === max) return min.toLocaleString();
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
}

export default async function ScholarshipsPage() {
    const stats = await getScholarshipStats();

    // Map base types to dynamic data, with fallbacks
    const scholarshipTypes = baseScholarshipTypes.map(type => {
        // Special mapping or key matching
        // The stats keys are "Type A", "Type B", "Type C". 
        // "Self-Funded" might not be in DB or might be distinct.

        // For Self-Funded, we use manual fallback or check if DB has it.
        // Assuming Self-Funded is static for now as per previous code ($1500), 
        // OR we can look for it if it exists. 
        // Previous static value: 1500 USD.

        const typeStats = stats[type.name];

        let serviceFeeUSD = "1,500"; // Fallback for Self-Funded
        let serviceFeeCNY = "11,000";

        if (typeStats) {
            serviceFeeUSD = formatPrice(typeStats.minUSD, typeStats.maxUSD);
            serviceFeeCNY = formatPrice(typeStats.minCNY, typeStats.maxCNY);
        } else if (type.name === "Self-Funded") {
            // Keep static if not found
            serviceFeeUSD = "1,500";
            serviceFeeCNY = "11,000";
        }

        return {
            ...type,
            serviceFeeUSD,
            serviceFeeCNY
        };
    });


    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            Financial Support Available
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Scholarship Types & Service Fees
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Understand how the Chinese scholarship system works. Choose the scholarship type that fits your budget and get comprehensive support throughout your application journey.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* How It Works Section */}
                <Card className="border-none shadow-xl mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Info className="h-5 w-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl">How the Scholarship System Works</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                            Chinese universities offer different scholarship types with varying tuition coverage. Each type has an associated service fee that covers application support, visa assistance, and other essential services.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Scholarship Coverage
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Scholarships cover a percentage of your tuition fees (50%, 75%, or 100%). The remaining tuition is paid directly to the university. This is separate from the service fee.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    Service Fees
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Service fees are one-time payments that cover comprehensive application support, document preparation, visa assistance, and pre-departure guidance. Higher scholarship types have higher service fees.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Scholarship Types Grid */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-1 bg-primary rounded-full" />
                        <h2 className="text-3xl font-bold font-heading">Scholarship Types</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {scholarshipTypes.map((type, index) => (
                            <Card key={index} className={`border-2 ${type.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${type.color} relative overflow-hidden`}>
                                {type.popular && (
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
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
                                    {/* Coverage Badge */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center">
                                        <div className="text-4xl font-bold text-primary mb-1">
                                            {type.coverage}%
                                        </div>
                                        <p className="text-xs text-muted-foreground">Tuition Coverage</p>
                                    </div>

                                    {/* Service Fee */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
                                        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-primary" />
                                            Service Fee
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">USD:</span>
                                                <span className="font-bold text-lg">${type.serviceFeeUSD}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">CNY:</span>
                                                <span className="font-semibold">¥{type.serviceFeeCNY}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Benefits */}
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

                                    <Link href="/programs">
                                        <Button className="w-full" variant={type.popular ? "default" : "outline"}>
                                            Apply Now
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
                            <CardTitle className="text-2xl">Required Documents</CardTitle>
                        </div>
                        <CardDescription>
                            Prepare these documents for your scholarship application
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
                            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                            <h4 className="font-semibold mb-2">What does the service fee cover?</h4>
                            <p className="text-sm text-muted-foreground">
                                The service fee is a one-time payment that covers comprehensive application support, document preparation and translation assistance, visa application guidance, university communication, admission processing, and pre-departure orientation.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <h4 className="font-semibold mb-2">Is the service fee refundable?</h4>
                            <p className="text-sm text-muted-foreground">
                                Service fees are generally non-refundable once the application process begins, as they cover the work and resources invested in your application. However, specific refund policies may vary.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <h4 className="font-semibold mb-2">How do I pay the remaining tuition after scholarship?</h4>
                            <p className="text-sm text-muted-foreground">
                                After receiving your scholarship (e.g., 50% coverage), you pay the remaining tuition directly to the university. For example, if tuition is ¥93,000 and you have a 50% scholarship, you pay ¥46,500 to the university.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <h4 className="font-semibold mb-2">Can I apply for multiple scholarship types?</h4>
                            <p className="text-sm text-muted-foreground">
                                You can only receive one scholarship type per program. We recommend choosing the type that best fits your budget and needs. Our team can help you decide which option is best for you.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA Section */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background">
                    <CardContent className="p-12 text-center">
                        <div className="max-w-2xl mx-auto">
                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Application?</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Choose your scholarship type and let our team guide you through every step of the application process. We&apos;re here to make studying in China accessible and affordable.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/programs">
                                    <Button size="lg" className="min-w-[200px]">
                                        Browse Programs
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="min-w-[200px]">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
