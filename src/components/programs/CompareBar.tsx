"use client";

import { useCompare } from "./CompareContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GitCompareArrows, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { Price } from "@/components/currency/PriceDisplay";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function CompareBar() {
    const t = useTranslations("Programs.compare");
    const { selectedPrograms, removeProgram, clearAll } = useCompare();
    const [isFullPageOpen, setIsFullPageOpen] = useState(false);

    if (selectedPrograms.length === 0) return null;

    return (
        <>
            {/* Floating Compare Bar */}
            <AnimatePresence>
                {!isFullPageOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
                    >
                        <div className="container mx-auto px-4 pb-4">
                            <div className="bg-card/95 backdrop-blur-xl border shadow-2xl rounded-2xl p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    {/* Selected Programs */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                            <GitCompareArrows className="h-5 w-5" />
                                            <span>{t("comparing")} ({selectedPrograms.length}/3)</span>
                                        </div>
                                        {selectedPrograms.map((program) => (
                                            <Badge
                                                key={program.id}
                                                variant="secondary"
                                                className="gap-1 pr-1 max-w-[200px]"
                                            >
                                                <span className="truncate">{program.name}</span>
                                                <button
                                                    onClick={() => removeProgram(program.id)}
                                                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {selectedPrograms.length < 3 && (
                                            <Badge variant="outline" className="text-muted-foreground border-dashed">
                                                +{3 - selectedPrograms.length} {t("more")}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearAll}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            {t("clear")}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/80"
                                            disabled={selectedPrograms.length < 2}
                                            onClick={() => setIsFullPageOpen(true)}
                                        >
                                            <GitCompareArrows className="h-4 w-4 mr-2" />
                                            {t("compareNow")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Page Compare View */}
            <AnimatePresence>
                {isFullPageOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b z-10">
                            <div className="w-full px-4 md:px-8 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsFullPageOpen(false)}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            {t("back") || "Back"}
                                        </Button>
                                        <div className="h-6 w-px bg-border" />
                                        <h1 className="text-xl font-bold flex items-center gap-2">
                                            <GitCompareArrows className="h-5 w-5 text-primary" />
                                            {t("title")}
                                        </h1>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsFullPageOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Compare Content */}
                        <div className="w-full px-4 md:px-8 py-8">
                            <CompareTable programs={selectedPrograms} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

interface Program {
    id: string;
    slug?: string;
    name: string;
    university: string;
    city: string;
    level: string;
    duration: string;
    tuition: string;
    tuition_fee?: number;
    currency?: string;
    deadline: string;
    badges: string[];
}

function CompareTable({ programs }: { programs: Program[] }) {
    const t = useTranslations("Programs.compare");

    const getLanguage = (p: Program) => {
        const langBadge = p.badges?.find(
            (b) => b?.toLowerCase().includes("english") || b?.toLowerCase().includes("chinese")
        );
        return langBadge || "-";
    };

    const rows = [
        { key: "university", label: t("university"), getValue: (p: Program) => p.university },
        { key: "location", label: t("location"), getValue: (p: Program) => p.city },
        { key: "level", label: t("level"), getValue: (p: Program) => p.level },
        { key: "duration", label: t("duration"), getValue: (p: Program) => p.duration },
        {
            key: "tuition",
            label: t("tuition"),
            getValue: (p: Program) => p.tuition_fee ? (
                <span className="text-primary font-bold text-lg">
                    <Price amount={p.tuition_fee} currency={p.currency || "CNY"} />
                </span>
            ) : p.tuition,
            highlight: true
        },
        { key: "intake", label: t("intake"), getValue: (p: Program) => p.deadline || "-" },
        { key: "language", label: t("language"), getValue: (p: Program) => getLanguage(p) },
    ];

    const columnWidth = programs.length === 2 ? 'w-[35%]' : 'w-[28%]';

    return (
        <div className="w-full">
            {/* Comparison Table */}
            <div className="border rounded-2xl overflow-hidden shadow-lg bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="text-left p-6 font-medium text-muted-foreground w-[180px] border-r">

                            </th>
                            {programs.map((program, index) => (
                                <th
                                    key={program.id}
                                    className={`p-6 text-left align-top ${columnWidth} ${index < programs.length - 1 ? 'border-r' : ''}`}
                                >
                                    <div className="space-y-2">
                                        <div
                                            className={`h-1.5 w-16 rounded-full ${index === 0 ? 'bg-blue-500' :
                                                index === 1 ? 'bg-primary' : 'bg-purple-500'
                                                }`}
                                        />
                                        <h3 className="font-bold text-lg">
                                            {program.name}
                                        </h3>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={row.key}
                                className={`${rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'} ${row.highlight ? 'bg-primary/5' : ''
                                    }`}
                            >
                                <td className="p-6 font-semibold text-muted-foreground border-r">
                                    {row.label}
                                </td>
                                {programs.map((program, index) => (
                                    <td
                                        key={program.id}
                                        className={`p-6 ${index < programs.length - 1 ? 'border-r' : ''}`}
                                    >
                                        <span className="text-base">{row.getValue(program)}</span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {/* Action Row */}
                        <tr className="bg-muted/30 border-t">
                            <td className="p-6 border-r"></td>
                            {programs.map((program, index) => (
                                <td
                                    key={program.id}
                                    className={`p-6 ${index < programs.length - 1 ? 'border-r' : ''}`}
                                >
                                    <div className="flex flex-col gap-3">
                                        <Link href={`/programs/${program.slug || program.id}`}>
                                            <Button variant="outline" className="w-full">
                                                {t("viewDetails")}
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                        <Link href={`/apply/${program.slug || program.id}`}>
                                            <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                                                {t("apply")}
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
