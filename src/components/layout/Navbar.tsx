"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        handleScroll(); // Check initial position
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <nav
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-500 ease-out animate-[slideDown_0.5s_ease-out]",
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
                                src={showSolid ? "/logo.png" : "/logo-white.png"}
                                alt="Studyatchina Logo"
                                fill
                                className="object-contain"
                                sizes="144px"
                                priority
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
                                                        src="/logo.png"
                                                        alt="Studyatchina Logo"
                                                        fill
                                                        className="object-contain"
                                                        sizes="100px"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                        {/* User greeting (only if logged in) */}
                                        {!loading && user && (
                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/[0.06]">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                                    <UserIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{user.user_metadata?.full_name || t('user.myAccount')}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Mobile Language & Currency */}
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/[0.06]">
                                            <LanguageSwitcher />
                                            <CurrencySelector variant="navbar" className="text-foreground/70 hover:bg-black/[0.04] rounded-full" />
                                        </div>
                                    </div>

                                    {/* Mobile Nav Links — Accordion Sections */}
                                    <div className="flex-1 overflow-y-auto py-3 px-3">
                                        {/* Home (always visible) */}
                                        <Link
                                            href="/"
                                            className="flex items-center gap-3 px-3 py-3.5 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all duration-200 mb-1"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                                                <Home className="h-4.5 w-4.5 text-primary" />
                                            </div>
                                            <span className="text-sm font-semibold">{t('home')}</span>
                                        </Link>

                                        <Accordion type="single" collapsible className="w-full">
                                            {/* Universities */}
                                            <AccordionItem value="universities" className="border-b border-black/[0.04]">
                                                <AccordionTrigger className="px-3 py-4 min-h-[52px] hover:no-underline hover:bg-black/[0.03] active:bg-black/[0.06] rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                                                            <Building2 className="h-4.5 w-4.5 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-semibold">{t('universities')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-2 ps-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        {universityCategories.map((item) => (
                                                            <Link
                                                                key={item.title}
                                                                href={item.href}
                                                                className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                <item.icon className="h-4 w-4 text-primary/70 shrink-0" />
                                                                <span className="text-sm text-foreground/80">{item.title}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Programs */}
                                            <AccordionItem value="programs" className="border-b border-black/[0.04]">
                                                <AccordionTrigger className="px-3 py-4 min-h-[52px] hover:no-underline hover:bg-black/[0.03] active:bg-black/[0.06] rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                                                            <GraduationCap className="h-4.5 w-4.5 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-semibold">{t('programs')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-2 ps-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        {programLevels.map((item) => (
                                                            <Link
                                                                key={item.title}
                                                                href={item.href}
                                                                className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                <item.icon className="h-4 w-4 text-primary/70 shrink-0" />
                                                                <span className="text-sm text-foreground/80">{item.title}</span>
                                                            </Link>
                                                        ))}
                                                        <Link
                                                            href="/programs"
                                                            className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-primary/5 active:bg-primary/10 text-primary transition-all"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <ChevronRight className="h-4 w-4 shrink-0" />
                                                            <span className="text-sm font-semibold">{t('levels.viewAll')}</span>
                                                        </Link>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Destinations */}
                                            <AccordionItem value="destinations" className="border-b border-black/[0.04]">
                                                <AccordionTrigger className="px-3 py-4 min-h-[52px] hover:no-underline hover:bg-black/[0.03] active:bg-black/[0.06] rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                                                            <MapPin className="h-4.5 w-4.5 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-semibold">{t('destinations.title')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-2 ps-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        {destinations.map((item) => (
                                                            <Link
                                                                key={item.title}
                                                                href={item.href}
                                                                className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                <item.icon className="h-4 w-4 text-primary/70 shrink-0" />
                                                                <span className="text-sm text-foreground/80">{item.title}</span>
                                                            </Link>
                                                        ))}
                                                        <Link
                                                            href="/destinations"
                                                            className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-primary/5 active:bg-primary/10 text-primary transition-all"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <ChevronRight className="h-4 w-4 shrink-0" />
                                                            <span className="text-sm font-semibold">{t('destinations.viewAll')}</span>
                                                        </Link>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Resources */}
                                            <AccordionItem value="resources" className="border-b-0">
                                                <AccordionTrigger className="px-3 py-4 min-h-[52px] hover:no-underline hover:bg-black/[0.03] active:bg-black/[0.06] rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                                                            <BookOpen className="h-4.5 w-4.5 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-semibold">{t('resources.title')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-2 ps-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        <Link href="/scholarships" className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all" onClick={() => setIsOpen(false)}>
                                                            <Award className="h-4 w-4 text-primary/70 shrink-0" />
                                                            <span className="text-sm text-foreground/80">{t('resources.scholarships')}</span>
                                                        </Link>
                                                        <Link href="/how-to-apply" className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all" onClick={() => setIsOpen(false)}>
                                                            <HelpCircle className="h-4 w-4 text-primary/70 shrink-0" />
                                                            <span className="text-sm text-foreground/80">{t('resources.howToApply')}</span>
                                                        </Link>
                                                        <Link href="/articles" className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all" onClick={() => setIsOpen(false)}>
                                                            <Newspaper className="h-4 w-4 text-primary/70 shrink-0" />
                                                            <span className="text-sm text-foreground/80">{t('resources.articles')}</span>
                                                        </Link>
                                                        <Link href="/scholarships/filter" className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all" onClick={() => setIsOpen(false)}>
                                                            <Filter className="h-4 w-4 text-primary/70 shrink-0" />
                                                            <span className="text-sm text-foreground/80">{t('resources.scholarshipFilter')}</span>
                                                        </Link>
                                                        <Link href="/articles/csca-guide" className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all" onClick={() => setIsOpen(false)}>
                                                            <BookOpen className="h-4 w-4 text-primary/70 shrink-0" />
                                                            <span className="text-sm text-foreground/80">CSCA Exam Guide</span>
                                                        </Link>
                                                        <Link href="/qs-rankings" className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all" onClick={() => setIsOpen(false)}>
                                                            <Trophy className="h-4 w-4 text-primary/70 shrink-0" />
                                                            <span className="text-sm text-foreground/80">{t('resources.qsRankings')}</span>
                                                        </Link>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Contact (always visible) */}
                                        <Link
                                            href="/contact"
                                            className="flex items-center gap-3 px-3 py-3.5 min-h-[48px] rounded-xl hover:bg-black/[0.03] active:bg-black/[0.06] transition-all duration-200 mt-1"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                                                <Mail className="h-4.5 w-4.5 text-primary" />
                                            </div>
                                            <span className="text-sm font-semibold">{t('contact')}</span>
                                        </Link>
                                    </div>

                                    {/* Mobile Footer Auth */}
                                    <div className="p-5 border-t border-black/[0.06] bg-black/[0.02]" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
                                        {!loading && (
                                            user ? (
                                                <div className="space-y-3">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start rounded-xl h-12 active:scale-[0.98] transition-transform"
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
                                                        className="w-full justify-start text-muted-foreground hover:text-destructive rounded-xl h-12 active:scale-[0.98] transition-transform"
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
                                                        <Button variant="outline" className="w-full rounded-xl h-12 font-medium active:scale-[0.98] transition-transform">
                                                            {t('user.signIn')}
                                                        </Button>
                                                    </Link>
                                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 font-semibold active:scale-[0.98]">
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
            </nav>
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
