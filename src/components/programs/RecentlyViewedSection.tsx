"use client";

import { useRecentlyViewed } from "./RecentlyViewedContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, GraduationCap, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export function RecentlyViewedSection() {
    const t = useTranslations("Programs.recentlyViewed");
    const { recentPrograms, clearHistory } = useRecentlyViewed();

    if (recentPrograms.length === 0) return null;

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t("justNow");
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t("minutesAgo", { count: minutes });
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return t("hoursAgo", { count: hours });
        const days = Math.floor(hours / 24);
        return t("daysAgo", { count: days });
    };

    return (
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {t("title")}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("clear")}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 scrollbar-thin">
                    <AnimatePresence mode="popLayout">
                        {recentPrograms.slice(0, 5).map((program, index) => (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/programs/${program.slug}`}>
                                    <div className="flex-shrink-0 w-64 p-3 rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {program.level}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTimeAgo(program.viewedAt)}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                            {program.name}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <GraduationCap className="h-3 w-3" />
                                                {program.university.split(' ').slice(0, 2).join(' ')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {program.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-end mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            {t("viewAgain")}
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
