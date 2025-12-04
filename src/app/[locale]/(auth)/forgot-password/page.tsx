"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { resetPassword } from "@/app/[locale]/(auth)/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function handleSubmit(formData: FormData) {
        try {
            const result = await resetPassword(formData);
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                setIsSubmitted(true);
                toast.success("Password reset link sent!");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    if (isSubmitted) {
        return (
            <Card className="border-none shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
                    <CardDescription className="text-center">
                        We have sent a password reset link to your email address.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <div className="text-center text-sm text-muted-foreground w-full">
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Back to login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Forgot password</CardTitle>
                <CardDescription className="text-center">
                    Enter your email address and we&apos;ll send you a link to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <SubmitButton>Send Reset Link</SubmitButton>
                </form>
            </CardContent>
            <CardFooter>
                <div className="text-center text-sm text-muted-foreground w-full">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
