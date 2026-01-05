"use client";

import { Link } from "@/i18n/routing";
import { Instagram, Linkedin, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function Footer() {
    const t = useTranslations('Footer');
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    return (
        <footer className="relative bg-gradient-to-b from-background to-muted/50 border-t-2 border-border overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-16 md:px-6 lg:py-20 relative z-10">
                {/* Newsletter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 rounded-3xl bg-gradient-to-r from-primary to-red-600 p-8 md:p-12 text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-sm font-bold uppercase tracking-wider">{t('stayUpdated')}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black mb-2">{t('getLatestUpdates')}</h3>
                            <p className="text-white/90">{t('subscribeText')}</p>
                        </div>
                        <NewsletterForm />
                    </div>
                </motion.div>

                {/* Main Footer Content */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <Image
                                src="/logo-red.png"
                                alt="Studyatchina Logo"
                                width={150}
                                height={48}
                                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                                style={{ width: 'auto' }}
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
                            {t('description')}
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Linkedin, href: "https://www.linkedin.com/company/study-at-china", label: "LinkedIn" },
                                { icon: Instagram, href: "https://instagram.com/studyatcn", label: "Instagram" }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-xl bg-muted hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <social.icon className="h-5 w-5" />
                                    <span className="sr-only">{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">{t('explore')}</h3>
                        <ul className="space-y-3">
                            {[
                                { name: t('programs'), href: "/programs" },
                                { name: t('universities'), href: "/universities" },
                                { name: t('scholarships'), href: "/scholarships" },
                                { name: t('howToApply'), href: "/how-to-apply" },
                                { name: t('faq'), href: "/faq" }
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Students */}
                    <div>
                        <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">{t('forStudents')}</h3>
                        <ul className="space-y-3">
                            {[
                                { name: t('createAccount'), href: "/register", show: !user },
                                { name: t('trackApplication'), href: "/dashboard", show: true },
                                { name: t('documentChecklist'), href: "/dashboard/documents", show: true },
                                { name: t('studentPortal'), href: "/dashboard", show: true }
                            ].filter(link => link.show).map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">{t('contact')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <a
                                    href="mailto:support@studyatchina.com"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    support@studyatchina.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://wa.me/905543081000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    +90 554 308 10 00
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                    Beijing, China
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <p className="text-sm text-muted-foreground">
                                &copy; {new Date().getFullYear()} Studyatchina.com. {t('rightsReserved')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t('designedBy')}{" "}
                                <a
                                    href="https://daxow.ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                                >
                                    Daxow
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center">
                            {[
                                { name: t('termsOfService'), href: "/terms-of-service" },
                                { name: t('privacyPolicy'), href: "/privacy-policy" },
                                { name: t('cookiePolicy'), href: "/cookie-policy" }
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
