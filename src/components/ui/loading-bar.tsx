"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start loading
        setIsLoading(true);
        setProgress(20);

        // Simulate progress
        const timer1 = setTimeout(() => setProgress(40), 100);
        const timer2 = setTimeout(() => setProgress(60), 300);
        const timer3 = setTimeout(() => setProgress(80), 600);

        // Complete loading
        const completeTimer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 200);
        }, 1000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(completeTimer);
        };
    }, [pathname, searchParams]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
                    exit={{ scaleX: 1, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-red-500 z-[9999] origin-left shadow-lg shadow-primary/50"
                />
            )}
        </AnimatePresence>
    );
}
