"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    SearchX,
    RefreshCcw,
    Sparkles,
    GraduationCap,
    Globe,
    MapPin,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
    activeFilters: {
        levels: string[];
        cities: string[];
        languages: string[];
        field: string;
        scholarship: boolean;
    };
    onClearFilters?: () => void;
    onSuggestedSearch?: (filters: { level?: string; city?: string }) => void;
}

const POPULAR_SEARCHES = [
    { level: "Master", icon: GraduationCap, color: "bg-blue-500/10 text-blue-600" },
    { level: "Bachelor", icon: GraduationCap, color: "bg-green-500/10 text-green-600" },
    { city: "Beijing", icon: MapPin, color: "bg-red-500/10 text-red-600" },
    { city: "Shanghai", icon: MapPin, color: "bg-purple-500/10 text-purple-600" },
];

export function EnhancedEmptyState({ activeFilters, onClearFilters, onSuggestedSearch }: EmptyStateProps) {
    const t = useTranslations("Programs.emptyState");

    const hasFilters =
        activeFilters.levels.length > 0 ||
        activeFilters.cities.length > 0 ||
        activeFilters.languages.length > 0 ||
        activeFilters.field !== "all" ||
        activeFilters.scholarship;

    return (
        <div className="col-span-full">
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-8 text-center border-b">
                    <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                        <SearchX className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t("title")}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        {hasFilters ? t("filteredDescription") : t("description")}
                    </p>
                </div>

                {/* Active Filters Summary */}
                {hasFilters && (
                    <div className="p-6 border-b bg-muted/30">
                        <p className="text-sm font-medium mb-3">{t("currentFilters")}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {activeFilters.levels.map((level) => (
                                <Badge key={level} variant="secondary">
                                    <GraduationCap className="h-3 w-3 mr-1" />
                                    {level}
                                </Badge>
                            ))}
                            {activeFilters.cities.map((city) => (
                                <Badge key={city} variant="secondary">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {city}
                                </Badge>
                            ))}
                            {activeFilters.languages.map((lang) => (
                                <Badge key={lang} variant="secondary">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {lang}
                                </Badge>
                            ))}
                            {activeFilters.field !== "all" && (
                                <Badge variant="secondary">{activeFilters.field}</Badge>
                            )}
                            {activeFilters.scholarship && (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    {t("scholarship")}
                                </Badge>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearFilters}
                            className="gap-2"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            {t("clearFilters")}
                        </Button>
                    </div>
                )}

                {/* Suggestions */}
                <div className="p-6">
                    <p className="text-sm font-medium mb-4">{t("tryInstead")}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {POPULAR_SEARCHES.map((search, i) => (
                            <button
                                key={i}
                                onClick={() => onSuggestedSearch?.(search)}
                                className={`flex items-center gap-2 p-3 rounded-lg border hover:border-primary/50 transition-colors ${search.color}`}
                            >
                                <search.icon className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {search.level || search.city}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Browse All CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Link href="/programs" className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {t("browseAll")}
                            </Button>
                        </Link>
                        <Link href="/universities" className="flex-1">
                            <Button className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80">
                                {t("exploreUniversities")}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
