"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "When is the application deadline?",
        answer: "Deadlines vary by university and program. Generally, for the September intake, applications close between March and June. Check specific program pages for exact dates.",
    },
    {
        question: "Do I need to know Chinese to study in China?",
        answer: "Not necessarily! There are thousands of English-taught programs available for Bachelor, Master, and PhD degrees. However, learning some basic Chinese is recommended for daily life.",
    },
    {
        question: "Can I work while studying?",
        answer: "International students can work part-time or take internships with permission from their university and the immigration office. Policies have become more flexible in recent years.",
    },
    {
        question: "How do I apply for scholarships?",
        answer: "You can apply for scholarships directly through our platform when submitting your application. We will guide you on the required documents for CSC and university scholarships.",
    },
    {
        question: "What are the visa requirements?",
        answer: "You'll need a valid passport, admission letter, and JW202 form from your university. We provide comprehensive visa guidance and support throughout the process.",
    },
    {
        question: "How long does the application process take?",
        answer: "The typical application process takes 2-4 weeks. Once submitted, universities usually respond within 4-8 weeks. We keep you updated at every step.",
    },
];

export function FAQPreviewSection() {
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
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Got Questions?</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Find answers to common questions about studying in China
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
                        {faqs.map((faq, index) => (
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
                                        <span>{faq.question}</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pl-9 pb-5">
                                    {faq.answer}
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
                                See All FAQs
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button 
                                size="lg" 
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        Still have questions? Our support team is available 24/7 to help you.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
