"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronRight, ChevronLeft, Upload, CreditCard } from "lucide-react";
import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitApplication } from "@/app/[locale]/(public)/applications/actions";
// import { toast } from "sonner"; // Removed unused

const steps = [
    { id: 1, title: "Review Program" },
    { id: 2, title: "Personal Info" },
    { id: 3, title: "Documents" },
    { id: 4, title: "Review & Pay" },
];

interface Program {
    id: string;
    title: string;
    university: {
        id: string;
        name: string;
    };
    duration: string;
    tuition_fee: number;
    language: string;
    intake: string;
    program_catalog: {
        level: string;
    };
}

export default function ApplicationWizardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // const router = useRouter(); // Removed unused
    const [currentStep, setCurrentStep] = useState(1);
    const [program, setProgram] = useState<Program | null>(null);
    // The error was "Unexpected any". I should fix it.
    // I will use a placeholder type or just unknown and cast it.
    // Or better, define a minimal interface.
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        passportNumber: "",
        expiryDate: ""
    });

    useEffect(() => {
        const fetchProgram = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("v_university_programs_full")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error(error);
            } else {
                setProgram(data);
            }
            setLoading(false);
        };
        fetchProgram();
    }, [id]);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const data = new FormData();
        data.append("programId", id);
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("passportNumber", formData.passportNumber);

        // 1. Submit Application to DB
        const result = await submitApplication(data);
        if (result?.error) {
            alert("Error submitting application: " + result.error);
            setIsSubmitting(false);
            return;
        }

        // 2. Initiate Stripe Checkout
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    applicationId: result.applicationId, // We need to update the action to return this
                    amount: 260, // Total amount
                    currency: "usd"
                }),
            });

            const { url, error } = await response.json();
            if (error) throw new Error(error);
            if (url) window.location.href = url;
        } catch (err: unknown) {
            alert("Payment initialization failed: " + (err as Error).message);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading program details...</div>;
    }

    if (!program) {
        return <div className="min-h-screen flex items-center justify-center">Program not found</div>;
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-3xl space-y-8">
                {/* Progress Bar */}
                <div className="relative mb-8">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
                    <div className="relative z-10 flex justify-between">
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step.id <= currentStep
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                                </div>
                                <span className={`text-xs font-medium ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="border-none shadow-xl">
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg">
                                    <h3 className="font-bold text-lg">{program.title}</h3>
                                    <p className="text-muted-foreground">{program.university?.name}</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Duration:</span> {program.duration}
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Tuition:</span> {program.tuition_fee} RMB/Year
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Language:</span> {program.language}
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Intake:</span> {program.intake}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Please review the program details carefully before proceeding.
                                </p>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground bg-blue-50 text-blue-800 p-3 rounded-md">
                                    Please enter your personal details for the application.
                                </p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Passport Number</Label>
                                        <Input
                                            value={formData.passportNumber}
                                            onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                            placeholder="E12345678"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Expiry</Label>
                                        <Input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="font-medium">Upload Passport Photo Page</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="font-medium">Upload High School Diploma</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="font-medium">Upload Transcripts</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold">Payment Summary</h3>
                                    <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Application Fee (University)</span>
                                            <span>800 RMB</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Service Fee (Platform)</span>
                                            <span>150 USD</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-primary">~260 USD</span>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full h-12 text-lg gap-2" onClick={handleNext} disabled={isSubmitting}>
                                    <CreditCard className="h-5 w-5" />
                                    {isSubmitting ? "Processing..." : "Pay & Submit Application"}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Secure payment via Stripe. Your application will be submitted immediately after payment.
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        {currentStep < 4 && (
                            <Button onClick={handleNext} disabled={isSubmitting}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
