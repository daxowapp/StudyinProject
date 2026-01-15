"use client";

import { differenceInDays, format, parseISO, isValid } from "date-fns";
import { Clock, AlertCircle, CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DeadlineCountdownProps {
    deadline: string | null;
    className?: string;
}

export function DeadlineCountdown({ deadline, className }: DeadlineCountdownProps) {
    const t = useTranslations('ProgramDetail.deadline');
    const [mounted, setMounted] = useState(false);

    // Hydration mismatch prevention
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!deadline) return null;

    const date = parseISO(deadline);
    if (!isValid(date)) return null;

    const today = new Date();
    const daysRemaining = differenceInDays(date, today);
    const isExpired = daysRemaining < 0;
    const isToday = daysRemaining === 0;

    // Do not render on server to avoid hydration mismatch with "Today" calculations
    if (!mounted) return null;

    return (
        <div className={cn("rounded-xl border p-4 shadow-sm",
            isExpired ? "bg-destructive/5 border-destructive/20" :
                isToday ? "bg-orange-500/10 border-orange-500/20" :
                    "bg-primary/5 border-primary/10",
            className
        )}>
            <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg shrink-0",
                    isExpired ? "bg-destructive/10 text-destructive" :
                        isToday ? "bg-orange-500/10 text-orange-600" :
                            "bg-primary/10 text-primary"
                )}>
                    {isExpired ? <AlertCircle className="w-6 h-6" /> : <CalendarClock className={cn("w-6 h-6", (isToday || (daysRemaining > 0 && daysRemaining <= 3)) && "animate-pulse")} />}
                </div>

                <div className="space-y-1">
                    <h3 className={cn("font-bold text-lg leading-none",
                        isExpired ? "text-destructive" :
                            isToday ? "text-orange-600" :
                                "text-primary"
                    )}>
                        {isExpired ? t('closed') :
                            isToday ? t('endingToday') :
                                t('daysRemaining', { days: daysRemaining })}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                        {t('deadline')}: {format(date, "MMMM d, yyyy")}
                    </p>
                </div>
            </div>
        </div>
    );
}
