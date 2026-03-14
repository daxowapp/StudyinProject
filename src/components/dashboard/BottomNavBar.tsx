"use client";

import { Link, usePathname } from "@/i18n/routing";
import { LayoutDashboard, Mail, FileText, CreditCard, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface BottomNavBarProps {
    unreadMessages?: number;
    pendingPayments?: number;
    pendingDocuments?: number;
    hasUnreadDocuments?: boolean;
}

export function BottomNavBar({
    unreadMessages = 0,
    pendingPayments = 0,
    pendingDocuments = 0,
    hasUnreadDocuments = false,
}: BottomNavBarProps) {
    const pathname = usePathname();
    const t = useTranslations("Dashboard.sidebar");

    const tabs = [
        {
            href: "/dashboard" as const,
            icon: LayoutDashboard,
            label: t("myApplications"),
            shortLabel: "Home",
            badge: 0,
            matchExact: true,
        },
        {
            href: "/dashboard/messages" as const,
            icon: Mail,
            label: t("messages"),
            shortLabel: "Messages",
            badge: unreadMessages,
            badgeColor: "bg-red-500",
        },
        {
            href: "/dashboard/documents" as const,
            icon: FileText,
            label: t("documents"),
            shortLabel: "Docs",
            badge: pendingDocuments,
            badgeColor: hasUnreadDocuments ? "bg-red-500" : "bg-gray-400",
        },
        {
            href: "/dashboard/payments" as const,
            icon: CreditCard,
            label: t("payments"),
            shortLabel: "Pay",
            badge: pendingPayments,
            badgeColor: "bg-yellow-500",
        },
        {
            href: "/dashboard/profile" as const,
            icon: User,
            label: t("profile"),
            shortLabel: "Profile",
            badge: 0,
        },
    ];

    const isActive = (href: string, matchExact?: boolean) => {
        if (matchExact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/50 bg-background/80 backdrop-blur-xl pb-safe">
            <div className="flex items-center justify-around h-16 px-1">
                {tabs.map((tab) => {
                    const active = isActive(tab.href, tab.matchExact);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`
                                relative flex flex-col items-center justify-center gap-0.5
                                flex-1 h-full
                                transition-colors duration-200
                                active:scale-95 active:opacity-80
                                ${active ? "text-primary" : "text-muted-foreground"}
                            `}
                        >
                            {/* Active indicator pill */}
                            {active && (
                                <span className="absolute top-1 w-8 h-1 rounded-full bg-primary" />
                            )}

                            {/* Icon with badge */}
                            <span className="relative mt-1">
                                <tab.icon
                                    className={`h-5 w-5 transition-all duration-200 ${
                                        active ? "scale-110" : ""
                                    }`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                {tab.badge > 0 && (
                                    <span
                                        className={`
                                            absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px]
                                            flex items-center justify-center
                                            rounded-full text-white text-[10px] font-bold
                                            px-1 shadow-sm
                                            ${tab.badgeColor || "bg-red-500"}
                                        `}
                                    >
                                        {tab.badge > 99 ? "99+" : tab.badge}
                                    </span>
                                )}
                            </span>

                            {/* Label */}
                            <span
                                className={`text-[10px] font-medium leading-tight ${
                                    active ? "font-semibold" : ""
                                }`}
                            >
                                {tab.shortLabel}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
