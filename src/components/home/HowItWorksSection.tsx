"use client";

import { Link } from "@/i18n/routing";
import { Search, UserPlus, Upload, Award, CheckCircle, Plane, ArrowRight, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

interface HowItWorksSectionProps {
    isLoggedIn?: boolean;
}

export function HowItWorksSection({ isLoggedIn = false }: HowItWorksSectionProps) {
    const t = useTranslations('HowItWorks');

    const steps = [
        {
            key: 'discover',
            icon: Search,
            color: "bg-red-500",
            lightColor: "bg-red-100",
            delay: 0
        },
        {
            key: 'profile',
            icon: UserPlus,
            color: "bg-purple-500",
            lightColor: "bg-purple-100",
            delay: 0.1
        },
        {
            key: 'upload',
            icon: Upload,
            color: "bg-indigo-500",
            lightColor: "bg-indigo-100",
            delay: 0.2
        },
        {
            key: 'scholarship',
            icon: Award,
            color: "bg-yellow-500",
            lightColor: "bg-yellow-100",
            delay: 0.3
        },
        {
            key: 'track',
            icon: CheckCircle,
            color: "bg-teal-500",
            lightColor: "bg-teal-100",
            delay: 0.4
        },
        {
            key: 'admission',
            icon: Plane,
            color: "bg-emerald-500",
            lightColor: "bg-emerald-100",
            delay: 0.5
        },
    ];

    return (
        <section id="how-it-works" className="py-10 md:py-16 bg-gradient-to-b from-background via-blue-50/30 to-background relative overflow-hidden">
            {/* Static Background Elements - No infinite animations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-20 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/20 font-semibold text-sm mb-6">
                        <Zap className="h-4 w-4 text-red-600" />
                        <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter font-heading mb-4 md:mb-6">
                        {t.rich('title', {
                            gradient: (chunks) => (
                                <span className="relative inline-block mx-2">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-600 to-orange-600">
                                        {chunks}
                                    </span>
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full" />
                                </span>
                            )
                        })}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                {/* Steps — vertical timeline on mobile, horizontal grid on desktop */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Desktop: horizontal connecting line */}
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 opacity-20" />

                    {/* Desktop grid */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center text-center animate-fade-in-up"
                                style={{ animationDelay: `${step.delay}s` }}
                            >
                                <div className="relative mb-4">
                                    <div className={`relative h-20 w-20 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                                        <step.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
                                        <div className="absolute -top-1 -right-1 h-7 w-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-background">
                                            <span className={`text-sm font-black ${step.color.replace('bg-', 'text-')}`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold mb-2 text-foreground">
                                        {t(`steps.${step.key}.title`)}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {t(`steps.${step.key}.description`)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile: vertical timeline */}
                    <div className="md:hidden relative">
                        {/* Vertical connecting line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-red-500 via-yellow-500 to-emerald-500 opacity-30" />

                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-start gap-4 animate-fade-in-up"
                                    style={{ animationDelay: `${step.delay}s` }}
                                >
                                    {/* Icon circle */}
                                    <div className="relative flex-shrink-0 z-10">
                                        <div className={`relative h-14 w-14 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                                            <step.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                                            <div className="absolute -top-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-background">
                                                <span className={`text-xs font-black ${step.color.replace('bg-', 'text-')}`}>
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-2 pb-2">
                                        <h3 className="text-base font-bold mb-1 text-foreground">
                                            {t(`steps.${step.key}.title`)}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {t(`steps.${step.key}.description`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 md:mt-24 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <Link href={isLoggedIn ? "/programs" : "/login"}>
                        <button className="group w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold text-base md:text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all relative overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                {t('cta.button')}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">
                        ⚡ {t.rich('cta.time', {
                            bold: (chunks) => <span className="font-bold text-foreground">{chunks}</span>
                        })}
                    </p>
                </div>
            </div>
        </section>
    );
}
