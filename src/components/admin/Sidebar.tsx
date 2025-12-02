"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
    LayoutDashboard,
    Building2,
    FileText,
    Users,
    Settings,
    LogOut,
    GraduationCap,
    MessageSquare,
    Calendar,
    Languages,
    Award,
    BarChart3,
    BookOpen,
    ClipboardCheck,
    Newspaper,
    Mail,
    ChevronRight,
    ChevronDown,
    User,
    Sparkles
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(new Set());

    const toggleGroup = (index: number) => {
        const newCollapsed = new Set(collapsedGroups);
        if (newCollapsed.has(index)) {
            newCollapsed.delete(index);
        } else {
            newCollapsed.add(index);
        }
        setCollapsedGroups(newCollapsed);
    };

    const sidebarGroups = [
        {
            label: "Overview",
            icon: Sparkles,
            items: [
                { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
                { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
            ]
        },
        {
            label: "Academic Management",
            icon: GraduationCap,
            items: [
                { icon: Building2, label: "Universities", href: "/admin/universities" },
                { icon: GraduationCap, label: "University Programs", href: "/admin/programs" },
                { icon: BookOpen, label: "Program Catalog", href: "/admin/program-catalog" },
                { icon: Award, label: "Scholarships", href: "/admin/scholarships" },
                { icon: ClipboardCheck, label: "Admission Requirements", href: "/admin/admission-requirements" },
                { icon: Calendar, label: "Academic Years", href: "/admin/academic-years" },
                { icon: Languages, label: "Languages", href: "/admin/languages" },
            ]
        },
        {
            label: "Applications & Users",
            icon: Users,
            items: [
                { icon: FileText, label: "Applications", href: "/admin/applications", badge: 12 },
                { icon: MessageSquare, label: "Leads", href: "/admin/leads", badge: 5 },
                { icon: Users, label: "Users", href: "/admin/users" },
            ]
        },
        {
            label: "Content & Media",
            icon: Newspaper,
            items: [
                { icon: Newspaper, label: "Articles", href: "/admin/articles" },
                { icon: Mail, label: "Messages", href: "/admin/messages", badge: 3 },
            ]
        },
        {
            label: "System",
            icon: Settings,
            items: [
                { icon: Settings, label: "Settings", href: "/admin/settings" },
            ]
        }
    ];

    return (
        <aside className={cn("hidden w-72 flex-col border-r bg-gradient-to-b from-card/80 to-card/50 backdrop-blur-xl md:flex shadow-xl", className)}>
            {/* Logo Section */}
            <div className="flex h-20 items-center border-b px-6 bg-gradient-to-r from-primary/10 via-orange-500/5 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                <Link href="/admin" className="flex items-center gap-3 font-bold text-xl tracking-tight group relative z-10">
                    <img
                        src="/logo-red.png"
                        alt="StudyAtChina Admin"
                        className="h-11 w-auto object-contain group-hover:scale-110 transition-all duration-300"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-6 px-3">
                <div className="space-y-6">
                    {sidebarGroups.map((group, groupIndex) => {
                        const isCollapsed = collapsedGroups.has(groupIndex);
                        const hasActiveItem = group.items.some(item => pathname === item.href);

                        return (
                            <div key={groupIndex} className="space-y-2">
                                <button
                                    onClick={() => toggleGroup(groupIndex)}
                                    className="w-full px-3 py-2 flex items-center gap-2 text-xs font-bold text-muted-foreground/70 uppercase tracking-wider hover:text-foreground transition-colors rounded-lg hover:bg-muted/30 group"
                                >
                                    <group.icon className="h-3.5 w-3.5" />
                                    <span className="flex-1 text-left">{group.label}</span>
                                    <ChevronDown className={cn(
                                        "h-3.5 w-3.5 transition-transform duration-200",
                                        isCollapsed && "-rotate-90"
                                    )} />
                                </button>

                                <div className={cn(
                                    "space-y-1 overflow-hidden transition-all duration-200",
                                    isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
                                )}>
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link key={item.href} href={item.href}>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start gap-3 px-4 py-5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                                        isActive
                                                            ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 font-semibold shadow-sm border border-primary/20"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-[1.02]"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <>
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-gradient-to-b from-primary to-orange-500 shadow-lg shadow-primary/50" />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                                                        </>
                                                    )}
                                                    <item.icon className={cn(
                                                        "h-5 w-5 transition-all duration-200",
                                                        isActive ? "text-primary drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                                                    )} />
                                                    <span className="flex-1 relative z-10 text-left">{item.label}</span>
                                                    {item.badge && (
                                                        <Badge
                                                            variant={isActive ? "default" : "secondary"}
                                                            className={cn(
                                                                "h-5 min-w-5 px-1.5 text-[10px] font-bold",
                                                                isActive && "bg-primary text-primary-foreground shadow-sm"
                                                            )}
                                                        >
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                    {isActive && <ChevronRight className="h-4 w-4 text-primary/60 animate-in fade-in slide-in-from-left-1 duration-300" />}
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* User Profile Section */}
            <div className="border-t p-4 bg-gradient-to-r from-muted/20 to-transparent">
                <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-muted/30 border border-border/50">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">admin@studyatchina.com</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-4 py-5 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
                >
                    <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-left">Sign Out</span>
                </Button>
            </div>
        </aside>
    );
}
