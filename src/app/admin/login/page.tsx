"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLogin } from "@/app/admin/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export default function AdminLoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the admin panel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={adminLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="admin@studyatchina.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <SubmitButton>Sign In</SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
