"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface MobileFilterActionsProps {
    isOpen: boolean;
    matchingCount: number;
    hasChanges: boolean;
    onApply: () => void;
    onClear: () => void;
}

export function MobileFilterActions({
    isOpen,
    matchingCount,
    hasChanges,
    onApply,
    onClear,
}: MobileFilterActionsProps) {
    const t = useTranslations("Programs.filters");

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg lg:hidden"
            >
                <div className="container mx-auto">
                    {/* Result count */}
                    <div className="text-center mb-3">
                        <motion.span
                            key={matchingCount}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-sm font-medium"
                        >
                            <span className="text-primary font-bold">{matchingCount}</span>{" "}
                            {t("matchingPrograms")}
                        </motion.span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={onClear}
                            disabled={!hasChanges}
                        >
                            <X className="h-4 w-4" />
                            {t("clearAll")}
                        </Button>
                        <Button
                            className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
                            onClick={onApply}
                        >
                            <Check className="h-4 w-4" />
                            {t("applyFilters")}
                            {hasChanges && (
                                <span className="ml-1 h-5 w-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
