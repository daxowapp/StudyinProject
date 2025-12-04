"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function FAQPreviewSection() {
    const t = useTranslations('FAQ');

    const faqs = [
        'deadline',
        'language',
        'work',
        'scholarships',
        'visa',
        'process'
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 font-semibold text-sm mb-4">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {t('description')}
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faqKey, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-border last:border-0"
                            >
                                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary transition-colors py-5 hover:no-underline">
                                    <span className="flex items-start gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span>{t(`items.${faqKey}.question`)}</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pl-9 pb-5">
                                    {t(`items.${faqKey}.answer`)}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row gap-4">
                        <Link href="/faq">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all"
                            >
                                {t('seeAll')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                {t('contactSupport')}
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        {t('footer')}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
