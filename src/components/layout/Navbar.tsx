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
    Palette
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/[locale]/(auth)/actions"; // Corrected path based on assumption, will verify
import { CurrencySelector } from "@/components/currency/CurrencySelector";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";
import { User } from "@supabase/supabase-js";



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

    // ... (keep useEffects)

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setScrolled(latest > 50);
        });
    }, [scrollY]);

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
            router.push('/auth/login');
        }
    };

    const pathname = usePathname();
    const isHome = pathname === "/";
    const showSolid = !isHome || scrolled;

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 z-50 w-full transition-all duration-500 ${showSolid
                    ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
                    : "bg-transparent border-b border-white/10"
                    }`}
            >
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group me-8">
                        <div className="relative h-10 w-32">
                            <Image
                                src={showSolid ? "/logo-red.png" : "/logo-white.png"}
                                alt="StudyAtChina Logo"
                                fill
                                className="object-contain group-hover:scale-105 transition-all duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation - Mega Menu */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-2">
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link href="/" className={cn(navigationMenuTriggerStyle(), showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                            <Home className="me-2 h-4 w-4" />
                                            {t('home')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn(showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                        <Building2 className="me-2 h-4 w-4" />
                                        {t('universities')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {/* ... (Keep existing content for now, maybe translate titles later) */}
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {/* We need to access universityCategories here. 
                                                Since I can't easily modify the array outside, I'll just render it as is for now 
                                                or I should have moved it inside. 
                                                Let's assume the array is still available in scope. 
                                            */}
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
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn(showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                        <GraduationCap className="me-2 h-4 w-4" />
                                        {t('programs')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                                            <li className="col-span-2 mt-2 pt-2 border-t">
                                                <Link
                                                    href="/programs"
                                                    className="flex items-center justify-center w-full p-2 text-sm font-medium text-center rounded-md bg-muted hover:bg-muted/80 transition-colors"
                                                >
                                                    {t('levels.viewAll')}
                                                </Link>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn(showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                        <Award className="me-2 h-4 w-4" />
                                        {t('resources.title')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
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
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link href="/contact" className={cn(navigationMenuTriggerStyle(), showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                            <Mail className="me-2 h-4 w-4" />
                                            {t('contact')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Side (Auth & Mobile Menu) */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-3">
                            <CurrencySelector
                                variant="navbar"
                                className={scrolled
                                    ? "text-foreground hover:bg-muted"
                                    : "text-white hover:bg-white/10"
                                }
                            />

                            <LanguageSwitcher />

                            {!loading && (
                                user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`rounded-full font-medium ps-2 pe-4 ${showSolid
                                                    ? "text-foreground hover:bg-muted"
                                                    : "text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center me-2">
                                                    <UserIcon className="h-4 w-4 text-primary" />
                                                </div>
                                                {user.user_metadata?.full_name?.split(' ')[0] || t('user.account')}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium">{user.user_metadata?.full_name || t('user.myAccount')}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                                                <FileText className="me-2 h-4 w-4" />
                                                {t('user.myApplications')}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout}>
                                                <LogOut className="me-2 h-4 w-4" />
                                                {t('user.logout')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <>
                                        <Link href="/auth/login">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`rounded-full font-medium ${showSolid
                                                    ? "text-foreground hover:bg-muted"
                                                    : "text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                {t('user.signIn')}
                                            </Button>
                                        </Link>

                                        <Link href="/auth/register">
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-6"
                                            >
                                                {t('user.getStarted')}
                                            </Button>
                                        </Link>
                                    </>
                                )
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full ${showSolid
                                        ? "text-foreground hover:bg-muted"
                                        : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-s-2 p-0">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b">
                                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                            <div className="relative h-8 w-24">
                                                <Image
                                                    src="/logo-red.png"
                                                    alt="StudyAtChina Logo"
                                                    fill
                                                    className="object-contain"
                                                    sizes="100px"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-6 px-4 relative">
                                        <div className="flex flex-col gap-6">
                                            {/* Universities Section */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-muted-foreground px-2">{t('universities')}</h4>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {universityCategories.slice(0, 4).map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <item.icon className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-medium">{item.title}</span>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href="/universities"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-primary"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Building2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{t('viewAllUniversities')}</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Programs Section */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-muted-foreground px-2">{t('programs')}</h4>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {programLevels.map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <item.icon className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-medium">{item.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Resources Section */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-muted-foreground px-2">{t('resources.title')}</h4>
                                                <div className="grid grid-cols-1 gap-1">
                                                    <Link
                                                        href="/scholarships"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Award className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{t('resources.scholarships')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/how-to-apply"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <HelpCircle className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{t('resources.howToApply')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/articles"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Newspaper className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{t('resources.articles')}</span>
                                                    </Link>
                                                    <Link
                                                        href="/contact"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Mail className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{t('resources.contact')}</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t bg-muted/20">
                                        {!loading && (
                                            user ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 px-2 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <UserIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold">{user.user_metadata?.full_name || t('user.myAccount')}</p>
                                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start"
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
                                                        className="w-full justify-start text-muted-foreground hover:text-destructive"
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
                                                <div className="space-y-3">
                                                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                                        <Button variant="outline" className="w-full">
                                                            {t('user.signIn')}
                                                        </Button>
                                                    </Link>
                                                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full bg-primary hover:bg-primary/90">
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
            {!isHome && <div className="h-20" />}
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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {Icon && <Icon className="h-4 w-4 text-primary" />}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1 ps-6">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
};
