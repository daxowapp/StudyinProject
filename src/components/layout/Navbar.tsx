"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Universities", href: "/universities", icon: Building2 },
    { name: "Programs", href: "/programs", icon: GraduationCap },
    { name: "Articles", href: "/articles", icon: Newspaper },
    { name: "How to Apply", href: "/how-to-apply", icon: HelpCircle },
    { name: "Contact", href: "/contact", icon: Mail },
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
        // Check user authentication
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const pathname = usePathname();
    const isHome = pathname === "/";
    // Always show solid navbar on non-home pages, or when scrolled on home page
    const showSolid = !isHome || scrolled;

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 z-50 w-full transition-all duration-500 ${showSolid
                    ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
                    : "bg-transparent border-b border-white/10"
                    }`}
            >
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-12 w-auto">
                            <img
                                src={showSolid ? "/logo-red.png" : "/logo-white.png"}
                                alt="StudyAtChina Logo"
                                className="h-12 w-auto object-contain group-hover:scale-105 transition-all duration-500"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${showSolid
                                        ? "text-foreground hover:bg-primary/10 hover:text-primary"
                                        : "text-white/90 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side (Auth & Mobile Menu) */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Language Selector */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-xl font-semibold ${scrolled
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
                                                className={`rounded-xl font-semibold ${showSolid
                                                    ? "text-foreground hover:bg-muted"
                                                    : "text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'}
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
                                                className={`rounded-xl font-semibold ${showSolid
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
                                                className="rounded-xl bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-6"
                                            >
                                                <Sparkles className="mr-2 h-4 w-4" />
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
                                    className={`rounded-xl ${showSolid
                                        ? "text-foreground hover:bg-muted"
                                        : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-2">
                                <div className="flex flex-col gap-8 py-8">
                                    {/* Mobile Logo */}
                                    <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                        <img
                                            src="/logo-red.png"
                                            alt="StudyAtChina Logo"
                                            className="h-10 w-auto object-contain"
                                        />
                                    </Link>

                                    {/* Mobile Links */}
                                    <div className="flex flex-col gap-2">
                                        {navLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Mobile Auth Buttons */}
                                    <div className="flex flex-col gap-3 pt-4 border-t">
                                        {!loading && (
                                            user ? (
                                                <>
                                                    <div className="px-4 py-3 bg-muted rounded-xl">
                                                        <p className="text-sm font-semibold">{user.user_metadata?.full_name || 'My Account'}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-xl font-semibold h-12"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            router.push('/dashboard');
                                                        }}
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        My Applications
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-xl font-semibold h-12"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleLogout();
                                                        }}
                                                    >
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        Log out
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                                        <Button variant="outline" className="w-full rounded-xl font-semibold h-12">
                                                            Sign In
                                                        </Button>
                                                    </Link>
                                                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-red-600 font-bold h-12 shadow-lg">
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Get Started
                                                        </Button>
                                                    </Link>
                                                </>
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
