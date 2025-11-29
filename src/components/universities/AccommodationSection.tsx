"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Check, DollarSign, Wifi, Wind, Droplet, Shield, Utensils } from "lucide-react";

interface AccommodationType {
    type: string;
    price_cny: number;
    price_usd: number;
    features: string[];
    description: string;
}

interface AccommodationSectionProps {
    accommodationAvailable: boolean;
    accommodationDescription?: string | null;
    accommodationFeeRange?: string | null;
    accommodationFeatures?: string[] | null;
    accommodationTypes?: AccommodationType[] | null;
}

const featureIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Air Conditioning': Wind,
    'AC': Wind,
    'Hot Water': Droplet,
    'Security': Shield,
    'Security 24/7': Shield,
    'Canteen': Utensils,
    'Canteen Nearby': Utensils,
};

export function AccommodationSection({
    accommodationAvailable,
    accommodationDescription,
    accommodationFeeRange,
    accommodationFeatures = [],
    accommodationTypes = []
}: AccommodationSectionProps) {
    if (!accommodationAvailable) {
        return (
            <div className="text-center py-12">
                <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">Accommodation information not available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 font-semibold text-sm mb-4">
                    <Home className="h-4 w-4 text-blue-600" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Student Accommodation
                    </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
                    On-Campus Housing Options
                </h2>
                {accommodationDescription && (
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {accommodationDescription}
                    </p>
                )}
            </div>

            {/* Price Range */}
            {accommodationFeeRange && (
                <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center gap-3">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Price Range</p>
                                <p className="text-2xl font-bold text-blue-600">{accommodationFeeRange}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* General Features */}
            {accommodationFeatures && accommodationFeatures.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-600" />
                            General Facilities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {accommodationFeatures.map((feature, index) => {
                                const Icon = featureIcons[feature] || Check;
                                return (
                                    <Badge 
                                        key={index} 
                                        variant="secondary" 
                                        className="px-3 py-1.5 text-sm"
                                    >
                                        <Icon className="h-4 w-4 mr-1.5" />
                                        {feature}
                                    </Badge>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Room Types */}
            {accommodationTypes && accommodationTypes.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Available Room Types</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {accommodationTypes.map((room, index) => (
                            <Card 
                                key={index}
                                className="border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg mb-1">
                                                {room.type}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {room.description}
                                            </p>
                                        </div>
                                        <Home className="h-5 w-5 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Price */}
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-2xl font-bold text-blue-600">
                                                ¥{room.price_cny.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-muted-foreground">/month</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            ≈ ${room.price_usd}/month
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <p className="text-xs font-semibold mb-2 text-muted-foreground">
                                            Room Features:
                                        </p>
                                        <ul className="space-y-1.5">
                                            {room.features.map((feature, idx) => (
                                                <li 
                                                    key={idx}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Note */}
            <Card className="border-none bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                            <Home className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-sm">Important Information</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Accommodation fees are paid per semester or academic year</li>
                                <li>• Room allocation is subject to availability</li>
                                <li>• Prices may vary and should be confirmed with the university</li>
                                <li>• Deposit may be required upon check-in</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
