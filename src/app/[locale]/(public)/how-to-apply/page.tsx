import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, Upload, Award, CheckCircle, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        title: "Discover Programs",
        description: "Browse 500+ programs from top Chinese universities tailored to your goals.",
        icon: Search,
    },
    {
        title: "Create Profile",
        description: "Set up your account and complete your academic profile in minutes.",
        icon: UserPlus,
    },
    {
        title: "Upload Documents",
        description: "Submit certificates, transcripts, and required documents securely.",
        icon: Upload,
    },
    {
        title: "Choose Scholarship Type",
        description: "Each university has scholarship types available. Choose one and apply.",
        icon: Award,
    },
    {
        title: "Track Progress",
        description: "Monitor your application status with real-time updates and notifications.",
        icon: CheckCircle,
    },
    {
        title: "Get Admission",
        description: "Receive your offer letter, visa documents, and start your journey!",
        icon: Plane,
    },
];

export default function HowToApplyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl font-bold font-heading mb-4">How to Apply</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A simple, transparent process to get you from application to admission.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
                <div className="space-y-16">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-8 md:gap-12 items-start relative">
                            {/* Connector Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[32px] top-20 bottom-[-64px] w-1 bg-gradient-to-b from-primary to-primary/20 rounded-full md:left-[36px]" />
                            )}

                            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shrink-0 shadow-xl z-10">
                                <step.icon className="h-7 w-7 md:h-9 md:w-9" />
                            </div>

                            <div className="pt-3 flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-primary/40 text-2xl font-bold">0{index + 1}</span>
                                    <h3 className="text-2xl md:text-3xl font-bold">
                                        {step.title}
                                    </h3>
                                </div>
                                <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
                                    <CardContent className="p-6">
                                        <p className="text-muted-foreground leading-relaxed text-base">
                                            {step.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-none shadow-xl rounded-2xl p-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Begin Your Journey?</h3>
                    <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                        Join thousands of students who have successfully applied through our platform.
                    </p>
                    <Link href="/programs">
                        <Button size="lg" className="gap-2 text-lg px-10 h-14">
                            Start Your Application <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
