"use client";

import { Link } from "@/i18n/routing";
import { GraduationCap, Globe, TrendingUp, ShieldCheck, Sparkles, Users, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

export function WhyStudySection() {
    const t = useTranslations('WhyStudy');

    const features = [
        {
            title: t('features.worldClass.title'),
            description: t('features.worldClass.description'),
            icon: GraduationCap,
            gradient: "from-primary to-red-600",
            iconBg: "bg-primary/10",
            iconColor: "text-primary"
        },
        {
            title: t('features.affordable.title'),
            description: t('features.affordable.description'),
            icon: TrendingUp,
            gradient: "from-secondary to-yellow-500",
            iconBg: "bg-secondary/10",
            iconColor: "text-secondary"
        },
        {
            title: t('features.career.title'),
            description: t('features.career.description'),
            icon: Globe,
            gradient: "from-accent to-yellow-500",
            iconBg: "bg-accent/10",
            iconColor: "text-accent"
        },
        {
            title: t('features.safe.title'),
            description: t('features.safe.description'),
            icon: ShieldCheck,
            gradient: "from-blue-500 to-purple-500",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            title: t('features.culture.title'),
            description: t('features.culture.description'),
            icon: Sparkles,
            gradient: "from-purple-500 to-pink-500",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-500"
        },
        {
            title: t('features.network.title'),
            description: t('features.network.description'),
            icon: Users,
            gradient: "from-pink-500 to-rose-500",
            iconBg: "bg-pink-500/10",
            iconColor: "text-pink-500"
        },
        {
            title: t('features.english.title'),
            description: t('features.english.description'),
            icon: BookOpen,
            gradient: "from-orange-500 to-amber-500",
            iconBg: "bg-orange-500/10",
            iconColor: "text-orange-500"
        },
        {
            title: t('features.recognition.title'),
            description: t('features.recognition.description'),
            icon: Trophy,
            gradient: "from-amber-500 to-yellow-500",
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-500"
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>{t('badge')}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter font-heading mb-6">
                        {t.rich('title', {
                            gradient: (chunks) => (
                                <>
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-600 to-orange-500">
                                        {chunks}
                                    </span>
                                </>
                            )
                        })}
                    </h2>
                    <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        {t('description')}
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative"
                        >
                            <div className="relative h-full rounded-3xl bg-card border border-border p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Gradient Overlay on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                {/* Icon */}
                                <div className={`relative h-16 w-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row gap-4">
                        <Link href="/programs">
                            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-red-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                {t('cta.explore')}
                            </button>
                        </Link>
                        <Link href="/download-guide">
                            <button className="px-8 py-4 rounded-2xl border-2 border-primary text-primary font-bold text-lg hover:bg-primary hover:text-white transition-all">
                                {t('cta.download')}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
