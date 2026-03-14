"use client";

import { Link } from "@/i18n/routing";
import { Instagram, Linkedin, Mail, MapPin, Phone, Sparkles, ChevronDown } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function Footer() {
    const t = useTranslations('Footer');

    const exploreLinks = [
        { name: t('programs'), href: "/programs" },
        { name: t('universities'), href: "/universities" },
        { name: t('scholarships'), href: "/scholarships" },
        { name: t('howToApply'), href: "/how-to-apply" },
        { name: t('faq'), href: "/faq" }
    ];

    const studentLinks = [
        { name: t('createAccount'), href: "/register" },
        { name: t('trackApplication'), href: "/dashboard" },
        { name: t('documentChecklist'), href: "/dashboard/documents" },
        { name: t('studentPortal'), href: "/dashboard" }
    ];

    return (
        <footer className="relative bg-gradient-to-b from-background to-muted/50 border-t-2 border-border overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-12 md:py-16 md:px-6 lg:py-20 relative z-10">
                {/* Newsletter Section */}
                <div
                    className="mb-12 md:mb-16 rounded-3xl bg-gradient-to-r from-primary to-red-600 p-6 md:p-12 text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-sm font-bold uppercase tracking-wider">{t('stayUpdated')}</span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-black mb-2">{t('getLatestUpdates')}</h3>
                            <p className="text-white/90 text-sm md:text-base">{t('subscribeText')}</p>
                        </div>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Main Footer Content */}
                {/* Desktop: grid layout */}
                <div className="hidden md:grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <Image
                                src="/logo.png"
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
                                { icon: Instagram, href: "https://instagram.com/studyatcn", label: "Instagram" },
                                {
                                    icon: ({ className }: { className?: string }) => (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={className}
                                        >
                                            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                            <path d="M9 10a.5.5 0 0 0 1 1h4a.5.5 0 0 0 1-1v-1a.5.5 0 0 0-1-1H9z" />
                                        </svg>
                                    ),
                                    href: "https://wa.me/905453081000",
                                    label: "WhatsApp"
                                }
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
                            {exploreLinks.map((link) => (
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
                            {studentLinks.map((link) => (
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
                                <div className="flex flex-col">
                                    <a
                                        href="https://wa.me/905453081000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        +90 545 308 10 00
                                    </a>
                                    <a
                                        href="https://wa.me/905453081000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:text-primary/80 transition-colors mt-0.5 font-medium"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
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

                {/* Mobile: Brand + Accordion */}
                <div className="md:hidden mb-10">
                    {/* Brand + Social */}
                    <div className="mb-6">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <Image
                                src="/logo.png"
                                alt="Studyatchina Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                                style={{ width: 'auto' }}
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {t('description')}
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Linkedin, href: "https://www.linkedin.com/company/study-at-china", label: "LinkedIn" },
                                { icon: Instagram, href: "https://instagram.com/studyatcn", label: "Instagram" },
                                {
                                    icon: ({ className }: { className?: string }) => (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={className}
                                        >
                                            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                            <path d="M9 10a.5.5 0 0 0 1 1h4a.5.5 0 0 0 1-1v-1a.5.5 0 0 0-1-1H9z" />
                                        </svg>
                                    ),
                                    href: "https://wa.me/905453081000",
                                    label: "WhatsApp"
                                }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-xl bg-muted hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                                >
                                    <social.icon className="h-5 w-5" />
                                    <span className="sr-only">{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Accordion sections */}
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="explore" className="border-border">
                            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline">
                                {t('explore')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 pb-2">
                                    {exploreLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="students" className="border-border">
                            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline">
                                {t('forStudents')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 pb-2">
                                    {studentLinks.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="contact" className="border-border">
                            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline">
                                {t('contact')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-4 pb-2">
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
                                        <div className="flex flex-col">
                                            <a
                                                href="https://wa.me/905453081000"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                +90 545 308 10 00
                                            </a>
                                            <a
                                                href="https://wa.me/905453081000"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:text-primary/80 transition-colors mt-0.5 font-medium"
                                            >
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">
                                            Beijing, China
                                        </span>
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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
                                {" | Powered by "}
                                <a
                                    href="https://sitconnect.net"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                                >
                                    SitConnect
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

