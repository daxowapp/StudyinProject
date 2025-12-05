"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, Sparkles, Search, GitCompareArrows, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface WelcomeTourProps {
    storageKey?: string;
    onComplete?: () => void;
}

export function WelcomeTour({ storageKey = "welcomeTourComplete", onComplete }: WelcomeTourProps) {
    const t = useTranslations("GuidedTour");
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            icon: Search,
            title: t("programs.search.title"),
            content: t("programs.search.content"),
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: GraduationCap,
            title: t("programs.filters.title"),
            content: t("programs.filters.content"),
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: GitCompareArrows,
            title: t("programs.compare.title"),
            content: t("programs.compare.content"),
            color: "from-primary to-orange-500",
        },
    ];

    useEffect(() => {
        // Check if tour has been shown
        const completed = localStorage.getItem(storageKey);
        if (!completed) {
            // Delay showing to let page render
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [storageKey]);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem(storageKey, "true");
        setIsOpen(false);
        onComplete?.();
    };

    const handleSkip = () => {
        localStorage.setItem(storageKey, "true");
        setIsOpen(false);
    };

    const slide = slides[currentSlide];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-0">
                {/* Top gradient */}
                <div className={`h-32 bg-gradient-to-r ${slide.color} flex items-center justify-center relative`}>
                    <motion.div
                        key={currentSlide}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                        <slide.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    {/* Decorative sparkles */}
                    <Sparkles className="absolute top-4 left-4 h-5 w-5 text-white/50" />
                    <Sparkles className="absolute bottom-4 right-4 h-4 w-4 text-white/30" />
                </div>

                {/* Content */}
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl text-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {slide.title}
                                </motion.span>
                            </AnimatePresence>
                        </DialogTitle>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentSlide}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-muted-foreground text-center mb-6"
                        >
                            {slide.content}
                        </motion.p>
                    </AnimatePresence>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-2 rounded-full transition-all ${i === currentSlide
                                        ? "w-6 bg-primary"
                                        : "w-2 bg-muted hover:bg-muted-foreground/30"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={handleSkip}>
                            {t("skip")}
                        </Button>
                        <Button className="flex-1 gap-1" onClick={handleNext}>
                            {currentSlide === slides.length - 1 ? t("finish") : t("next")}
                            {currentSlide < slides.length - 1 && <ChevronRight className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Export for use on programs page
export function ProgramsTour() {
    return <WelcomeTour storageKey="programsTourComplete" />;
}
