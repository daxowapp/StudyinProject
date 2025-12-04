"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, DollarSign, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

export function ScholarshipsSection() {
    const t = useTranslations('Scholarships');

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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 max-w-3xl mx-auto"
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
                </motion.div>

                {/* Scholarships Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-3 mb-12"
                >
                    {scholarships.map((scholarship, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="group h-full border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                                <CardContent className="p-8">
                                    {/* Icon */}
                                    <div className={`relative h-16 w-16 rounded-2xl ${scholarship.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <scholarship.icon className={`h-8 w-8 ${scholarship.iconColor}`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
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
                                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg"
                                                >
                                                    {t('learnMore')}
                                                    <ArrowRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-8 md:p-10 text-white mb-12"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: "$2M+", label: t('stats.awarded') },
                            { value: "85%", label: t('stats.funding') },
                            { value: "100%", label: t('stats.full') },
                            { value: "500+", label: t('stats.eligible') }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-3xl md:text-4xl font-black mb-2">{stat.value}</div>
                                <div className="text-sm text-white/90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Link href="/scholarships">
                        <Button size="lg" className="rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8">
                            <Sparkles className="mr-2 h-5 w-5" />
                            {t('viewAll')}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
