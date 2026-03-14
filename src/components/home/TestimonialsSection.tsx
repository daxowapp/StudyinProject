"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, MessageCircle, Heart } from "lucide-react";
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

export function TestimonialsSection() {
    const t = useTranslations('Testimonials');
    const { ref: headerRef, visible: headerVisible } = useInView();
    const { ref: gridRef, visible: gridVisible } = useInView();
    const { ref: trustRef, visible: trustVisible } = useInView();

    const testimonials = [
        {
            key: 'sarah',
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            name: "Sarah Johnson"
        },
        {
            key: 'ahmed',
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            name: "Ahmed Hassan"
        },
        {
            key: 'maria',
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            name: "Maria Garcia"
        },
    ];

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-12 max-w-3xl mx-auto transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 font-semibold text-sm mb-4">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {t('description')}
                    </p>
                </div>

                {/* Testimonials — horizontal scroll on mobile, grid on desktop */}
                <div
                    ref={gridRef}
                    className={`flex gap-6 overflow-x-auto pb-4 scroll-strip md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="min-w-[300px] w-[85vw] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:flex-shrink-1 hover:-translate-y-2 transition-transform duration-300"
                            style={{ transitionDelay: gridVisible ? `${index * 150}ms` : '0ms' }}
                        >
                            <Card className="group h-full border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white relative overflow-hidden">
                                {/* Quote Icon Background */}
                                <div className="absolute top-4 right-4 text-purple-500/10">
                                    <Quote className="h-20 w-20" />
                                </div>

                                <CardContent className="p-8 relative z-10">
                                    {/* Rating Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-base text-foreground leading-relaxed mb-6 italic">
                                        &quot;{t(`testimonials.${testimonial.key}.quote`)}&quot;
                                    </p>

                                    {/* Student Info */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-border">
                                        <Avatar className="h-12 w-12 border-2 border-purple-500/20">
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                                                {testimonial.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-bold text-foreground">{testimonial.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {t(`testimonials.${testimonial.key}.program`)} • {t(`testimonials.${testimonial.key}.university`)}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                📍 {t(`testimonials.${testimonial.key}.country`)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Decorative Corner */}
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div
                    ref={trustRef}
                    className={`mt-16 text-center transition-all duration-700 delay-300 ${trustVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <div className="inline-flex flex-wrap items-center justify-center gap-8 px-8 py-6 rounded-2xl bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-semibold">
                                <span className="text-2xl font-black text-foreground">4.9/5</span>
                                <span className="text-muted-foreground ml-2">{t('averageRating')}</span>
                            </span>
                        </div>
                        <div className="h-8 w-px bg-border hidden md:block" />
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-semibold">
                                <span className="text-2xl font-black text-foreground">2,500+</span>
                                <span className="text-muted-foreground ml-2">{t('reviews')}</span>
                            </span>
                        </div>
                        <div className="h-8 w-px bg-border hidden md:block" />
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-semibold">
                                <span className="text-2xl font-black text-foreground">98%</span>
                                <span className="text-muted-foreground ml-2">{t('satisfaction')}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
