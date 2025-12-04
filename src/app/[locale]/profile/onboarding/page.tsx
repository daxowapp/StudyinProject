"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
    { id: 1, title: "Basic Info" },
    { id: 2, title: "Contact Info" },
    { id: 3, title: "Education" },
    { id: 4, title: "Language" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit
            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-2xl space-y-8">
                {/* Progress Bar */}
                <div className="relative">
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
                        <CardDescription>Please fill in your details to complete your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentStep === 1 && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input placeholder="Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Nationality</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usa">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="china">China</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Address</Label>
                                    <Input placeholder="123 Main St" />
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input placeholder="New York" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Country</Label>
                                    <Input placeholder="USA" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input type="tel" placeholder="+1 234 567 890" />
                                </div>
                                <div className="space-y-2">
                                    <Label>WhatsApp (Optional)</Label>
                                    <Input type="tel" placeholder="+1 234 567 890" />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Highest Education Level</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="highschool">High School</SelectItem>
                                            <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                                            <SelectItem value="master">Master&apos;s Degree</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Institution Name</Label>
                                    <Input placeholder="University of Example" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Graduation Year</Label>
                                        <Input type="number" placeholder="2023" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>GPA</Label>
                                        <Input placeholder="3.5/4.0" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>English Proficiency</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="native">Native Speaker</SelectItem>
                                            <SelectItem value="ielts">IELTS</SelectItem>
                                            <SelectItem value="toefl">TOEFL</SelectItem>
                                            <SelectItem value="none">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chinese Proficiency</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hsk1">HSK 1</SelectItem>
                                            <SelectItem value="hsk2">HSK 2</SelectItem>
                                            <SelectItem value="hsk3">HSK 3</SelectItem>
                                            <SelectItem value="hsk4">HSK 4</SelectItem>
                                            <SelectItem value="hsk5">HSK 5</SelectItem>
                                            <SelectItem value="hsk6">HSK 6</SelectItem>
                                            <SelectItem value="none">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep === steps.length ? "Complete Profile" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
