"use client";

import { Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login, loginWithGoogle } from "@/app/[locale]/(auth)/actions";
import { SubmitButton } from "@/components/ui/submit-button";

import { useState } from "react";
import { toast } from "sonner";

import { Suspense } from "react";
import { useTranslations } from "next-intl";

function LoginContent() {
    const t = useTranslations('Auth.login');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await login(formData);
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success(t('success'));
                router.push(returnUrl);
            }
        } catch {
            toast.error(t('error'));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
        } catch {
            toast.error(t('googleError'));
            setIsGoogleLoading(false);
        }
    }

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
                <CardDescription className="text-center">
                    {t('description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('emailLabel')}</Label>
                        <Input id="email" name="email" type="email" placeholder={t('emailPlaceholder')} required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">{t('passwordLabel')}</Label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                {t('forgotPassword')}
                            </Link>
                        </div>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <SubmitButton>{t('submit')}</SubmitButton>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t('orContinueWith')}
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                >
                    {isGoogleLoading ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            {t('connecting')}
                        </>
                    ) : (
                        <>
                            <Chrome className="mr-2 h-4 w-4" />
                            {t('continueWithGoogle')}
                        </>
                    )}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                    {t('noAccount')}{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        {t('signUp')}
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
