import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, GraduationCap, Building2, Calendar, DollarSign, Sparkles } from "lucide-react";
import Link from "next/link";

const scholarships = [
    {
        title: "Chinese Government Scholarship (CSC)",
        type: "Full Scholarship",
        coverage: ["Tuition Waiver", "Free Accommodation", "Monthly Stipend", "Medical Insurance"],
        eligibility: ["Non-Chinese citizen", "Good health", "High school graduate (for Bachelor)", "Bachelor degree (for Master)"],
        deadline: "January - April",
        icon: GraduationCap,
        color: "from-blue-500/10 to-blue-500/5",
    },
    {
        title: "Confucius Institute Scholarship",
        type: "Full/Partial Scholarship",
        coverage: ["Tuition", "Accommodation", "Stipend"],
        eligibility: ["Chinese language students", "HSK score required", "Non-Chinese citizen"],
        deadline: "March - May",
        icon: Award,
        color: "from-purple-500/10 to-purple-500/5",
    },
    {
        title: "Provincial Government Scholarships",
        type: "Partial Scholarship",
        coverage: ["Tuition Waiver (Partial or Full)"],
        eligibility: ["Varies by province", "Outstanding academic performance"],
        deadline: "February - May",
        icon: Building2,
        color: "from-green-500/10 to-green-500/5",
    },
];

export default function ScholarshipsPage() {
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
                            Scholarships & Financial Aid
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Discover funding opportunities to support your studies in China. From full government scholarships to university-specific grants.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* Stats Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-6 text-center">
                            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="h-7 w-7 text-primary" />
                            </div>
                            <div className="text-3xl font-bold mb-2">$50M+</div>
                            <p className="text-sm text-muted-foreground">Total Scholarships Available</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-6 text-center">
                            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <Award className="h-7 w-7 text-primary" />
                            </div>
                            <div className="text-3xl font-bold mb-2">15+</div>
                            <p className="text-sm text-muted-foreground">Scholarship Programs</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-6 text-center">
                            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="h-7 w-7 text-primary" />
                            </div>
                            <div className="text-3xl font-bold mb-2">85%</div>
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Scholarships Grid */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-1 bg-primary rounded-full" />
                        <h2 className="text-3xl font-bold font-heading">Available Scholarships</h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {scholarships.map((sch, index) => (
                            <Card key={index} className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${sch.color}`}>
                                <CardHeader>
                                    <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4">
                                        <sch.icon className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl">{sch.title}</CardTitle>
                                    <Badge variant="secondary" className="w-fit mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                                        {sch.type}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4">
                                        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            Coverage
                                        </h4>
                                        <ul className="space-y-2">
                                            {sch.coverage.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4">
                                        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4 text-primary" />
                                            Eligibility
                                        </h4>
                                        <ul className="space-y-2">
                                            {sch.eligibility.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm mb-4 bg-background/50 backdrop-blur-sm rounded-lg p-3">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Deadline:
                                            </span>
                                            <span className="font-medium">{sch.deadline}</span>
                                        </div>
                                        <Link href="/programs?scholarship=true">
                                            <Button className="w-full" size="lg">
                                                Find Eligible Programs
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background">
                    <CardContent className="p-12 text-center">
                        <div className="max-w-2xl mx-auto">
                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Need Help Applying for Scholarships?</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Our team can guide you through the scholarship application process, review your documents, and increase your chances of success.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/register">
                                    <Button size="lg" className="min-w-[200px]">
                                        Create Account & Apply
                                    </Button>
                                </Link>
                                <Link href="/how-to-apply">
                                    <Button size="lg" variant="outline" className="min-w-[200px]">
                                        Learn More
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
