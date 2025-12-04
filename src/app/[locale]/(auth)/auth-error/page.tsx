"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
                    <CardDescription>
                        There was a problem signing you in with Google.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        This could be due to:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                        <li>Cancelled authentication</li>
                        <li>Network connection issues</li>
                        <li>Temporary service unavailability</li>
                    </ul>
                    <div className="flex flex-col gap-2 pt-4">
                        <Link href="/login" className="w-full">
                            <Button className="w-full">
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full">
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
