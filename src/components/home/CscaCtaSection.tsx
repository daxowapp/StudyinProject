"use client";

import { Link } from '@/i18n/routing';
import { ArrowRight, BookOpen, GraduationCap, CheckCircle2, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CscaCtaSection() {
    const t = useTranslations('CscaCta');

    return (
        <section className="py-10 md:py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-t border-b border-border/50 relative overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">

                    {/* Content */}
                    <div className="flex-1 space-y-6 text-center lg:text-start">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {t('badge')}
                        </div>

                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground animate-fade-in [animation-delay:100ms]">
                            <div dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
                        </h2>

                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in [animation-delay:200ms]">
                            {t('description')}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-fade-in [animation-delay:300ms]">
                            <Link
                                href="/articles/csca-guide"
                                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-1"
                            >
                                <BookOpen className="w-5 h-5" />
                                {t('readGuide')}
                            </Link>
                            <Link
                                href="/programs"
                                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-card text-foreground font-semibold rounded-xl border border-border hover:bg-accent/50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <GraduationCap className="w-5 h-5" />
                                {t('findPrograms')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Feature Card / Visual */}
                    <div className="flex-1 w-full max-w-md lg:max-w-full animate-fade-in [animation-delay:200ms]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl transform rotate-3 scale-95 rounded-3xl" />
                            <div className="relative bg-card border border-border/50 p-8 rounded-3xl shadow-xl backdrop-blur-sm">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <CheckCircle2 className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-1">{t('proTip1.title')}</h3>
                                            <p className="text-muted-foreground">{t('proTip1.text')}</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border/50" />

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <TrendingUp className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-1">{t('proTip2.title')}</h3>
                                            <p className="text-muted-foreground">{t('proTip2.text')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
