"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, DollarSign, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function useInView() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return { ref, visible };
}

export function ScholarshipsSection() {
    const t = useTranslations('Scholarships');
    const { ref: headerRef, visible: headerVisible } = useInView();
    const { ref: gridRef, visible: gridVisible } = useInView();
    const { ref: statsRef, visible: statsVisible } = useInView();
    const { ref: ctaRef, visible: ctaVisible } = useInView();

    const scholarships = [
        {
            key: 'csc',
            icon: Award,
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-500/10",
            iconColor: "text-yellow-600"
        },
        {
            key: 'university',
            icon: GraduationCap,
            color: "from-blue-500 to-purple-500",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-600"
        },
        {
            key: 'provincial',
            icon: TrendingUp,
            color: "from-green-500 to-teal-500",
            bgColor: "bg-green-500/10",
            iconColor: "text-green-600"
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-background via-yellow-50/20 to-background relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-12 max-w-3xl mx-auto transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 font-semibold text-sm mb-4">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {t('description')}
                    </p>
                </div>

                {/* Scholarships — horizontal scroll on mobile, grid on desktop */}
                <div
                    ref={gridRef}
                    className={`flex gap-6 overflow-x-auto pb-4 scroll-strip md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 mb-12 transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    {scholarships.map((scholarship, index) => (
                        <div
                            key={index}
                            className="min-w-[280px] w-[85vw] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:flex-shrink-1 hover:-translate-y-2 transition-transform duration-300"
                            style={{ transitionDelay: gridVisible ? `${index * 150}ms` : '0ms' }}
                        >
                            <Card className="group h-full border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                                <CardContent className="p-6 md:p-8">
                                    {/* Icon */}
                                    <div className={`relative h-14 w-14 md:h-16 md:w-16 rounded-2xl ${scholarship.bgColor} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <scholarship.icon className={`h-7 w-7 md:h-8 md:w-8 ${scholarship.iconColor}`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">
                                        {t(`items.${scholarship.key}.title`)}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        {t(`items.${scholarship.key}.description`)}
                                    </p>

                                    {/* Amount */}
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">{t('awardAmount')}</p>
                                                <p className={`text-lg font-black bg-gradient-to-r ${scholarship.color} bg-clip-text text-transparent`}>
                                                    {t(`items.${scholarship.key}.amount`)}
                                                </p>
                                            </div>
                                            <Link href="/scholarships">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg h-11 md:h-9 px-4"
                                                >
                                                    {t('learnMore')}
                                                    <ArrowRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Stats Bar */}
                <div
                    ref={statsRef}
                    className={`rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 md:p-10 text-white mb-12 transition-all duration-700 delay-300 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
                        {[
                            { value: "$2M+", label: t('stats.awarded') },
                            { value: "85%", label: t('stats.funding') },
                            { value: "100%", label: t('stats.full') },
                            { value: "500+", label: t('stats.eligible') }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-2xl md:text-4xl font-black mb-1 md:mb-2">{stat.value}</div>
                                <div className="text-xs md:text-sm text-white/90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div
                    ref={ctaRef}
                    className={`text-center transition-all duration-700 delay-[400ms] ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <Link href="/scholarships">
                        <Button size="lg" className="rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8">
                            <Sparkles className="mr-2 h-5 w-5" />
                            {t('viewAll')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
