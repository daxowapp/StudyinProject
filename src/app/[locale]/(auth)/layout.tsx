import { GraduationCap, Globe, Users, Award } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 text-primary-foreground">
                <div>
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-12">
                        <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        StudyAtChina
                    </Link>
                    
                    <div className="space-y-8 max-w-md">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">
                                Your Gateway to Chinese Universities
                            </h1>
                            <p className="text-lg text-primary-foreground/90">
                                Join thousands of international students pursuing their dreams in China&apos;s top universities.
                            </p>
                        </div>

                        <div className="space-y-6 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">500+ Programs</h3>
                                    <p className="text-sm text-primary-foreground/80">
                                        Access programs from top Chinese universities
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Expert Guidance</h3>
                                    <p className="text-sm text-primary-foreground/80">
                                        Get support throughout your application journey
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Scholarship Opportunities</h3>
                                    <p className="text-sm text-primary-foreground/80">
                                        Explore various scholarship options available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-primary-foreground/70">
                    © 2024 StudyAtChina. All rights reserved.
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="flex lg:hidden items-center justify-center gap-2 text-xl font-bold mb-8">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        StudyAtChina
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
