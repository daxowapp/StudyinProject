"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

const navLinks = [
    { name: "Universities", href: "/universities" },
    { name: "Programs", href: "/programs" },
    { name: "Scholarships", href: "/scholarships" },
    { name: "Articles", href: "/articles" },
    { name: "How to Apply", href: "/how-to-apply" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setScrolled(latest > 50);
        });
    }, [scrollY]);

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
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-500 text-white font-black text-2xl shadow-xl group-hover:scale-105 transition-transform">
                            S
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl font-black tracking-tight font-heading transition-colors ${showSolid ? "text-foreground" : "text-white"
                            }`}>
                            StudyAtChina
                        </span>
                        <span className={`text-xs font-medium transition-colors ${showSolid ? "text-muted-foreground" : "text-white/60"
                            }`}>
                            Your Future Awaits
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${showSolid
                                ? "text-foreground hover:bg-primary/10 hover:text-primary"
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white font-bold text-xl">
                                        S
                                    </div>
                                    <span className="text-xl font-bold">StudyAtChina</span>
                                </Link>

                                {/* Mobile Links */}
                                <div className="flex flex-col gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="px-4 py-3 rounded-xl text-lg font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Auth Buttons */}
                                <div className="flex flex-col gap-3 pt-4 border-t">
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
