"use client";

import { motion, useInView } from "framer-motion";
import { GraduationCap, Users, Building2, Award, Globe, TrendingUp, BookOpen, CheckCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function CountUpAnimation({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isInView]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
};

export function StatsSection() {
    const t = useTranslations('Stats');

    const stats = [
        {
            key: 'universities',
            icon: Building2,
            value: 500,
            suffix: "+",
            color: "from-red-500 to-orange-500",
            bgColor: "bg-red-500/10"
        },
        {
            key: 'students',
            icon: Users,
            value: 50000,
            suffix: "+",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10"
        },
        {
            key: 'programs',
            icon: BookOpen,
            value: 1000,
            suffix: "+",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10"
        },
        {
            key: 'success',
            icon: Award,
            value: 98,
            suffix: "%",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10"
        },
        {
            key: 'countries',
            icon: Globe,
            value: 200,
            suffix: "+",
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-500/10"
        },
        {
            key: 'scholarships',
            icon: TrendingUp,
            value: 2,
            suffix: "M+",
            color: "from-indigo-500 to-purple-500",
            bgColor: "bg-indigo-500/10"
        },
        {
            key: 'time',
            icon: CheckCircle,
            value: 15,
            suffix: " min",
            color: "from-teal-500 to-cyan-500",
            bgColor: "bg-teal-500/10"
        },
        {
            key: 'employment',
            icon: GraduationCap,
            value: 95,
            suffix: "%",
            color: "from-pink-500 to-rose-500",
            bgColor: "bg-pink-500/10"
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 font-semibold text-sm mb-4 text-white">
                        <TrendingUp className="h-4 w-4 text-yellow-400" />
                        <span>{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4 text-white">
                        {t('title')}
                    </h2>
                    <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8, scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="group"
                        >
                            <div className="relative h-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                {/* Icon */}
                                <div className={`h-12 w-12 rounded-xl ${stat.bgColor} backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`h-6 w-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} strokeWidth={2.5} style={{ stroke: 'url(#gradient)' }} />
                                    <svg width="0" height="0">
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" className="text-red-500" style={{ stopColor: 'currentColor' }} />
                                                <stop offset="100%" className="text-orange-500" style={{ stopColor: 'currentColor' }} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Value */}
                                <div className={`text-3xl md:text-4xl font-black mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                                    <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                                </div>

                                {/* Label */}
                                <div className="text-sm md:text-base font-bold text-white mb-1">
                                    {t(`items.${stat.key}.label`)}
                                </div>

                                {/* Description */}
                                <div className="text-xs text-white/60">
                                    {t(`items.${stat.key}.description`)}
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
