"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    Sparkles,
    ChevronDown,
    User,
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
import { signout } from "@/app/(public)/auth/actions";
import { CurrencySelector } from "@/components/currency/CurrencySelector";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const universityCategories = [
    {
        title: "Top Ranked",
        href: "/universities?sort=rank",
        description: "Explore the highest-ranked universities in China.",
        icon: Award
    },
    {
        title: "Medical Schools",
        href: "/universities?category=medical",
        description: "Leading institutions for medicine and healthcare.",
        icon: Stethoscope
    },
    {
        title: "Engineering",
        href: "/universities?category=engineering",
        description: "Top technical universities for engineering.",
        icon: Cpu
    },
    {
        title: "Business & Economics",
        href: "/universities?category=business",
        description: "Premier business schools and economic institutes.",
        icon: Briefcase
    },
    {
        title: "Arts & Humanities",
        href: "/universities?category=arts",
        description: "Centers for arts, culture, and humanities.",
        icon: Palette
    },
    {
        title: "All Universities",
        href: "/universities",
        description: "Browse our complete list of partner universities.",
        icon: Building2
    }
];

const programLevels = [
    {
        title: "Bachelor's Degree",
        href: "/programs?level=bachelor",
        description: "Undergraduate programs for high school graduates.",
        icon: GraduationCap
    },
    {
        title: "Master's Degree",
        href: "/programs?level=master",
        description: "Graduate programs for bachelor's degree holders.",
        icon: BookOpen
    },
    {
        title: "PhD Programs",
        href: "/programs?level=phd",
        description: "Doctoral research programs.",
        icon: Award
    },
    {
        title: "Non-Degree",
        href: "/programs?level=non-degree",
        description: "Language courses and short-term programs.",
        icon: Globe
    }
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const router = useRouter();
    const supabase = createClient();

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
        } catch (error) {
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
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group mr-8">
                        <div className="relative h-10 w-auto">
                            <img
                                src={showSolid ? "/logo-red.png" : "/logo-white.png"}
                                alt="StudyAtChina Logo"
                                className="h-10 w-auto object-contain group-hover:scale-105 transition-all duration-500"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation - Mega Menu */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-2">
                                <NavigationMenuItem>
                                    <Link href="/" legacyBehavior passHref>
                                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                            <Home className="mr-2 h-4 w-4" />
                                            Home
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn(showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Universities
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Programs
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
                                                    View All Programs
                                                </Link>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={cn(showSolid ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Resources
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                        href="/how-to-apply"
                                                    >
                                                        <HelpCircle className="h-6 w-6" />
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            How to Apply
                                                        </div>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Step-by-step guide to applying for universities in China.
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <ListItem href="/articles" title="Articles" icon={Newspaper}>
                                                Latest news and guides about studying in China.
                                            </ListItem>
                                            <ListItem href="/contact" title="Contact Us" icon={Mail}>
                                                Get in touch with our support team.
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
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

                            <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full font-medium ${scrolled
                                    ? "text-foreground hover:bg-muted"
                                    : "text-white hover:bg-white/10"
                                    }`}
                            >
                                EN
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>

                            {!loading && (
                                user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`rounded-full font-medium pl-2 pr-4 ${showSolid
                                                    ? "text-foreground hover:bg-muted"
                                                    : "text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium">{user.user_metadata?.full_name || 'My Account'}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                My Applications
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log out
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
                                                Sign In
                                            </Button>
                                        </Link>

                                        <Link href="/auth/register">
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-6"
                                            >
                                                Get Started
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
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-2 p-0">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b">
                                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                            <img
                                                src="/logo-red.png"
                                                alt="StudyAtChina Logo"
                                                className="h-8 w-auto object-contain"
                                            />
                                        </Link>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-6 px-4">
                                        <div className="flex flex-col gap-6">
                                            {/* Universities Section */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-muted-foreground px-2">Universities</h4>
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
                                                        <span className="text-sm font-medium">View All Universities</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Programs Section */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-muted-foreground px-2">Programs</h4>
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
                                                <h4 className="text-sm font-medium text-muted-foreground px-2">Resources</h4>
                                                <div className="grid grid-cols-1 gap-1">
                                                    <Link
                                                        href="/how-to-apply"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <HelpCircle className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">How to Apply</span>
                                                    </Link>
                                                    <Link
                                                        href="/articles"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Newspaper className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">Articles & Guides</span>
                                                    </Link>
                                                    <Link
                                                        href="/contact"
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <Mail className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">Contact Us</span>
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
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold">{user.user_metadata?.full_name || 'My Account'}</p>
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
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        My Applications
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-muted-foreground hover:text-destructive"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleLogout();
                                                        }}
                                                    >
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        Log out
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                                        <Button variant="outline" className="w-full">
                                                            Sign In
                                                        </Button>
                                                    </Link>
                                                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full bg-primary hover:bg-primary/90">
                                                            Get Started
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

const ListItem = ({ className, title, children, href, icon: Icon, ...props }: any) => {
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
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1 pl-6">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
};
