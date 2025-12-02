"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Heart } from "lucide-react";
import Link from "next/link";

export function ScholarshipCTA() {
    return (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-orange-500/5 to-red-500/10 shadow-xl">
            <CardContent className="p-8 text-center">
                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold text-sm mb-2">
                        <Award className="h-4 w-4" />
                        <span>Discover More Opportunities</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold font-heading">
                        Explore All Scholarship Options
                    </h3>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Not sure which scholarship is right for you? Browse our complete scholarship guide to compare all options, understand eligibility requirements, and find the perfect fit for your academic journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <a href="#scholarship-cards">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary via-orange-500 to-red-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-600/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('scholarship-cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                            >
                                <Award className="mr-2 h-5 w-5" />
                                View All Scholarships
                            </Button>
                        </a>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-primary/30 hover:bg-primary/10 font-semibold px-8"
                            >
                                <Heart className="mr-2 h-5 w-5" />
                                Get Personalized Advice
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
