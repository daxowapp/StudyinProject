"use client";

import { Chrome } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signup, loginWithGoogle } from "@/app/[locale]/(auth)/actions";
import { SubmitButton } from "@/components/ui/submit-button";

import { useState } from "react";
import { toast } from "sonner";

import { Suspense } from "react";

function RegisterContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await signup(formData);
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success("Account created successfully!");
                router.push(returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleSignup() {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
        } catch {
            toast.error("Failed to sign up with Google");
            setIsGoogleLoading(false);
        }
    }

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Enter your information to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" name="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" name="lastName" placeholder="Doe" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </Label>
                    </div>
                    <SubmitButton>Create Account</SubmitButton>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignup} disabled={isGoogleLoading || isLoading}>
                    {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                </Button>
                <div className="text-center text-sm text-muted-foreground w-full">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
