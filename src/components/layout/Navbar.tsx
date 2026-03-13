"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Menu,
    User as UserIcon,
    LogOut,
    FileText,
    Home,
    Building2,
    GraduationCap,
    Award,
    Newspaper,
    HelpCircle,
    Mail,
    BookOpen,
    Globe,
    Stethoscope,
    Cpu,
    Briefcase,
    Palette,
    Filter,
    MapPin,
    Trophy,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/[locale]/(auth)/actions/index";
import { CurrencySelector } from "@/components/currency/CurrencySelector";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { NotificationBell } from "@/components/notifications/NotificationBell";



export function Navbar() {
    const t = useTranslations('Navbar');
    const locale = useLocale();
    const isRTL = locale === 'ar' || locale === 'fa';
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const router = useRouter();
    const supabase = createClient();

    const universityCategories = [
        {
            title: t('categories.topRanked.title'),
            href: "/universities?sort=rank",
            description: t('categories.topRanked.description'),
            icon: Award
        },
        {
            title: t('categories.medical.title'),
            href: "/universities?category=medical",
            description: t('categories.medical.description'),
            icon: Stethoscope
        },
        {
            title: t('categories.engineering.title'),
            href: "/universities?category=engineering",
            description: t('categories.engineering.description'),
            icon: Cpu
        },
        {
            title: t('categories.business.title'),
            href: "/universities?category=business",
            description: t('categories.business.description'),
            icon: Briefcase
        },
        {
            title: t('categories.arts.title'),
            href: "/universities?category=arts",
            description: t('categories.arts.description'),
            icon: Palette
        },
        {
            title: t('categories.all.title'),
            href: "/universities",
            description: t('categories.all.description'),
            icon: Building2
        }
    ];

    const programLevels = [
        {
            title: t('levels.bachelor.title'),
            href: "/programs?level=bachelor",
            description: t('levels.bachelor.description'),
            icon: GraduationCap
        },
        {
            title: t('levels.master.title'),
            href: "/programs?level=master",
            description: t('levels.master.description'),
            icon: BookOpen
        },
        {
            title: t('levels.phd.title'),
            href: "/programs?level=phd",
            description: t('levels.phd.description'),
            icon: Award
        },
        {
            title: t('levels.nonDegree.title'),
            href: "/programs?level=non-degree",
            description: t('levels.nonDegree.description'),
            icon: Globe
        }
    ];

    const destinations = [
        {
            title: t('destinations.beijing.title'),
            href: "/universities?city=Beijing",
            description: t('destinations.beijing.description'),
            icon: MapPin
        },
        {
            title: t('destinations.shanghai.title'),
            href: "/universities?city=Shanghai",
            description: t('destinations.shanghai.description'),
            icon: MapPin
        },
        {
            title: t('destinations.guangzhou.title'),
            href: "/universities?city=Guangzhou",
            description: t('destinations.guangzhou.description'),
            icon: MapPin
        },
        {
            title: t('destinations.wuhan.title'),
            href: "/universities?city=Wuhan",
            description: t('destinations.wuhan.description'),
            icon: MapPin
        },
        {
            title: t('destinations.hangzhou.title'),
            href: "/universities?city=Hangzhou",
            description: t('destinations.hangzhou.description'),
            icon: MapPin
        },
        {
            title: t('destinations.nanjing.title'),
            href: "/universities?city=Nanjing",
            description: t('destinations.nanjing.description'),
            icon: MapPin
        },
        {
            title: t('destinations.chengdu.title'),
            href: "/universities?city=Chengdu",
            description: t('destinations.chengdu.description'),
            icon: MapPin
        },
        {
            title: t('destinations.xian.title'),
            href: "/universities?city=Xi'an",
            description: t('destinations.xian.description'),
            icon: MapPin
        }
    ];

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        try {
            await signout();
        } catch {
            await supabase.auth.signOut();
            router.push('/login');
        }
    };

    const pathname = usePathname();
    const isHome = pathname === "/";
    const showSolid = !isHome || scrolled;

    // Shared style helpers
    const linkColor = showSolid ? "text-foreground/80 hover:text-foreground" : "text-white/90 hover:text-white";
    const triggerColor = showSolid ? "text-foreground/80 hover:text-foreground" : "text-white/90 hover:text-white";

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-500 ease-out",
                    showSolid
                        ? "navbar-glass border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.04)]"
                        : "bg-transparent border-b border-white/[0.08]"
                )}
            >
                <div className={cn(
                    "container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-500",
                    scrolled ? "h-16" : "h-[72px]"
                )} dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group me-6 shrink-0">
                        <div className="relative h-10 w-36 transition-transform duration-300 group-hover:scale-[1.03]">
                            <Image
                                src={showSolid ? "/logo-red.png" : "/logo-white.png"}
                                alt="Studyatchina Logo"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <NavigationMenu>
                            <NavigationMenuList className={cn("gap-0", isRTL && "flex-row-reverse")}>
                                {/* Home */}
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/"
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "relative nav-link-underline font-medium",
                                                linkColor,
                                                pathname === "/" && "active"
                                            )}
                                        >
                                            {t('home')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* Universities */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn("relative nav-link-underline font-medium", triggerColor)}>
                                        {t('universities')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[520px] lg:w-[600px] p-1" dir={isRTL ? 'rtl' : 'ltr'}>
                                            <div className="px-4 pt-3 pb-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{t('universities')}</p>
                                            </div>
                                            <ul className="grid md:grid-cols-2 gap-0.5 px-1 pb-2">
                                                {universityCategories.map((category) => (
                                                    <ListItem
                                                        key={category.title}
                                                        title={category.title}
                                                        href={category.href}
                                                        icon={category.icon}
                                                    >
                                                        {category.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Programs */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn("relative nav-link-underline font-medium", triggerColor)}>
                                        {t('programs')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[520px] lg:w-[600px] p-1" dir={isRTL ? 'rtl' : 'ltr'}>
                                            <div className="px-4 pt-3 pb-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{t('programs')}</p>
                                            </div>
                                            <ul className="grid md:grid-cols-2 gap-0.5 px-1 pb-1">
                                                {programLevels.map((level) => (
                                                    <ListItem
                                                        key={level.title}
                                                        title={level.title}
                                                        href={level.href}
                                                        icon={level.icon}
                                                    >
                                                        {level.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                            <div className="px-3 pb-3 pt-1">
                                                <Link
                                                    href="/programs"
                                                    className="flex items-center justify-center gap-1.5 w-full p-2.5 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 text-primary transition-all duration-200"
                                                >
                                                    {t('levels.viewAll')}
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Destinations */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn("relative nav-link-underline font-medium", triggerColor)}>
                                        {t('destinations.title')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[520px] lg:w-[600px] p-1" dir={isRTL ? 'rtl' : 'ltr'}>
                                            <div className="px-4 pt-3 pb-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{t('destinations.title')}</p>
                                            </div>
                                            <ul className="grid md:grid-cols-2 gap-0.5 px-1 pb-1">
                                                {destinations.map((dest) => (
                                                    <ListItem
                                                        key={dest.title}
                                                        title={dest.title}
                                                        href={dest.href}
                                                        icon={dest.icon}
                                                    >
                                                        {dest.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                            <div className="px-3 pb-3 pt-1">
                                                <Link
                                                    href="/destinations"
                                                    className="flex items-center justify-center gap-1.5 w-full p-2.5 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 text-primary transition-all duration-200"
                                                >
                                                    {t('destinations.viewAll')}
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Resources */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn("relative nav-link-underline font-medium", triggerColor)}>
                                        {t('resources.title')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[520px] lg:w-[600px] p-1" dir={isRTL ? 'rtl' : 'ltr'}>
                                            <div className="px-4 pt-3 pb-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{t('resources.title')}</p>
                                            </div>
                                            <ul className="grid md:grid-cols-2 gap-0.5 px-1 pb-2">
                                                <ListItem
                                                    title={t('resources.scholarships')}
                                                    href="/scholarships"
                                                    icon={Award}
                                                >
                                                    {t('resources.scholarships')}
                                                </ListItem>
                                                <ListItem
                                                    title={t('resources.howToApply')}
                                                    href="/how-to-apply"
                                                    icon={HelpCircle}
                                                >
                                                    {t('resources.howToApply')}
                                                </ListItem>
                                                <ListItem
                                                    title={t('resources.articles')}
                                                    href="/articles"
                                                    icon={Newspaper}
                                                >
                                                    {t('resources.articles')}
                                                </ListItem>
                                                <ListItem
                                                    title={t('resources.scholarshipFilter')}
                                                    href="/scholarships/filter"
                                                    icon={Filter}
                                                >
                                                    {t('resources.scholarshipFilterDesc')}
                                                </ListItem>
                                                <ListItem
                                                    title="CSCA Exam Guide"
                                                    href="/articles/csca-guide"
                                                    icon={BookOpen}
                                                >
                                                    Comprehensive guide to the new entrance exam
                                                </ListItem>
                                                <ListItem
                                                    title={t('resources.qsRankings')}
                                                    href="/qs-rankings"
                                                    icon={Trophy}
                                                >
                                                    {t('resources.qsRankingsDesc')}
                                                </ListItem>
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Contact */}
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/contact"
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "relative nav-link-underline font-medium",
                                                linkColor,
                                                pathname === "/contact" && "active"
                                            )}
                                        >
                                            {t('contact')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-2">
                        <div className="hidden lg:flex items-center gap-1.5">
                            <CurrencySelector
                                variant="navbar"
                                className={cn(
                                    "rounded-full text-xs h-8 px-3",
                                    showSolid
                                        ? "text-foreground/70 hover:text-foreground hover:bg-black/[0.04]"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                )}
                            />

                            <div className={cn(
                                "w-px h-5 mx-1",
                                showSolid ? "bg-black/10" : "bg-white/20"
                            )} />

                            <LanguageSwitcher />

                            <div className={cn(
                                "w-px h-5 mx-1",
                                showSolid ? "bg-black/10" : "bg-white/20"
                            )} />

                            {!loading && (
                                user ? (
                                    <div className="flex items-center gap-1">
                                        <NotificationBell userId={user.id} className={cn(
                                            "rounded-full h-8 w-8",
                                            showSolid ? "" : "text-white/80 hover:text-white hover:bg-white/10"
                                        )} />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "rounded-full font-medium ps-1.5 pe-3 h-9 gap-2",
                                                        showSolid
                                                            ? "text-foreground hover:bg-black/[0.04]"
                                                            : "text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                                        <UserIcon className="h-3.5 w-3.5 text-primary" />
                                                    </div>
                                                    <span className="text-sm">{user.user_metadata?.full_name?.split(' ')[0] || t('user.account')}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-black/[0.06]">
                                                <DropdownMenuLabel>
                                                    <div className="flex flex-col space-y-1">
                                                        <p className="text-sm font-medium">{user.user_metadata?.full_name || t('user.myAccount')}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-lg mx-1">
                                                    <FileText className="me-2 h-4 w-4" />
                                                    {t('user.myApplications')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={handleLogout} className="rounded-lg mx-1 text-destructive focus:text-destructive">
                                                    <LogOut className="me-2 h-4 w-4" />
                                                    {t('user.logout')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 ms-1">
                                        <Link href="/login">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "rounded-full font-medium h-9 px-4 text-sm",
                                                    showSolid
                                                        ? "text-foreground/80 hover:text-foreground hover:bg-black/[0.04]"
                                                        : "text-white/90 hover:text-white hover:bg-white/10"
                                                )}
                                            >
                                                {t('user.signIn')}
                                            </Button>
                                        </Link>

                                        <Link href="/register">
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.03] px-5 h-9 text-sm animate-cta-glow"
                                            >
                                                <Sparkles className="h-3.5 w-3.5 me-1.5" />
                                                {t('user.getStarted')}
                                            </Button>
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "rounded-full h-10 w-10",
                                        showSolid
                                            ? "text-foreground hover:bg-black/[0.04]"
                                            : "text-white hover:bg-white/10"
                                    )}
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] sm:w-[400px] border-s border-black/[0.06] p-0 bg-white/95 backdrop-blur-2xl">
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="p-5 border-b border-black/[0.06]">
                                        <div className="flex items-center justify-between">
                                            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                                <div className="relative h-8 w-28">
                                                    <Image
                                                        src="/logo-red.png"
                                                        alt="Studyatchina Logo"
                                                        fill
                                                        className="object-contain"
                                                        sizes="100px"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                        {/* Mobile Language & Currency */}
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/[0.06]">
                                            <LanguageSwitcher />
                                            <CurrencySelector variant="navbar" className="text-foreground/70 hover:bg-black/[0.04] rounded-full" />
                                        </div>
                                    </div>

                                    {/* Mobile Nav Links */}
                                    <div className="flex-1 overflow-y-auto py-4 px-4">
                                        <div className="flex flex-col gap-6">
                                            {/* Home */}
                                            <Link
                                                href="/"
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                                                    <Home className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="text-sm font-semibold">{t('home')}</span>
                                            </Link>

                                            {/* Universities Section */}
                                            <div className="space-y-1.5">
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 px-3">{t('universities')}</h4>
                                                <div className="grid grid-cols-1 gap-0.5">
                                                    {universityCategories.slice(0, 4).map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                                <item.icon className="h-4 w-4 text-primary/80" />
                                                            </div>
                                                            <span className="text-sm font-medium text-foreground/80">{item.title}</span>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href="/universities"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 text-primary"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <Building2 className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm font-semibold">{t('viewAllUniversities')}</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Programs Section */}
                                            <div className="space-y-1.5">
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 px-3">{t('programs')}</h4>
                                                <div className="grid grid-cols-1 gap-0.5">
                                                    {programLevels.map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                                <item.icon className="h-4 w-4 text-primary/80" />
                                                            </div>
                                                            <span className="text-sm font-medium text-foreground/80">{item.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Destinations Section */}
                                            <div className="space-y-1.5">
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 px-3">{t('destinations.title')}</h4>
                                                <div className="grid grid-cols-1 gap-0.5">
                                                    {destinations.slice(0, 6).map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                                <item.icon className="h-4 w-4 text-primary/80" />
                                                            </div>
                                                            <span className="text-sm font-medium text-foreground/80">{item.title}</span>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href="/destinations"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 text-primary"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <MapPin className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm font-semibold">{t('destinations.viewAll')}</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Resources Section */}
                                            <div className="space-y-1.5">
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 px-3">{t('resources.title')}</h4>
                                                <div className="grid grid-cols-1 gap-0.5">
                                                    <Link
                                                        href="/scholarships"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <Award className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">{t('resources.scholarships')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/how-to-apply"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <HelpCircle className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">{t('resources.howToApply')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/articles"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <Newspaper className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">{t('resources.articles')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/scholarships/filter"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <Filter className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">{t('resources.scholarshipFilter')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/articles/csca-guide"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <BookOpen className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">CSCA Exam Guide</span>
                                                    </Link>
                                                    <Link
                                                        href="/qs-rankings"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <Trophy className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">{t('resources.qsRankings')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/contact"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200 group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                                                            <Mail className="h-4 w-4 text-primary/80" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground/80">{t('resources.contact')}</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Footer Auth */}
                                    <div className="p-5 border-t border-black/[0.06] bg-black/[0.02]">
                                        {!loading && (
                                            user ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 px-1 mb-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                                            <UserIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold">{user.user_metadata?.full_name || t('user.myAccount')}</p>
                                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start rounded-xl h-10"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            router.push('/dashboard');
                                                        }}
                                                    >
                                                        <FileText className="me-2 h-4 w-4" />
                                                        {t('user.myApplications')}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-muted-foreground hover:text-destructive rounded-xl h-10"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleLogout();
                                                        }}
                                                    >
                                                        <LogOut className="me-2 h-4 w-4" />
                                                        {t('user.logout')}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                                        <Button variant="outline" className="w-full rounded-xl h-11 font-medium">
                                                            {t('user.signIn')}
                                                        </Button>
                                                    </Link>
                                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 font-semibold">
                                                            <Sparkles className="h-4 w-4 me-2" />
                                                            {t('user.getStarted')}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </motion.nav>
            {/* Spacer for non-home pages */}
            {!isHome && <div className={cn("transition-all duration-500", scrolled ? "h-16" : "h-[72px]")} />}
        </>
    );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    title: string;
    href: string;
    icon?: React.ElementType;
}

const ListItem = ({ className, title, children, href, icon: Icon, ...props }: ListItemProps) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        "block select-none rounded-xl p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-black/[0.03] group",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2.5">
                        {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                                <Icon className="h-4 w-4 text-primary/80" />
                            </div>
                        )}
                        <div className="space-y-0.5">
                            <div className="text-sm font-medium leading-none text-foreground/90 group-hover:text-foreground">{title}</div>
                            <p className="line-clamp-1 text-xs leading-relaxed text-muted-foreground/70">
                                {children}
                            </p>
                        </div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
};
