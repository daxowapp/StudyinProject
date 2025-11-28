"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, Shield } from "lucide-react";

const partners = [
    { name: "Tsinghua University", logo: "🎓" },
    { name: "Peking University", logo: "📚" },
    { name: "Fudan University", logo: "🏛️" },
    { name: "Shanghai Jiao Tong", logo: "🎯" },
    { name: "Zhejiang University", logo: "⭐" },
    { name: "Nanjing University", logo: "🌟" },
];

const recognitions = [
    {
        icon: Award,
        title: "UNESCO Recognized",
        description: "All partner universities are UNESCO recognized"
    },
    {
        icon: Shield,
        title: "Government Approved",
        description: "Officially approved by Chinese Ministry of Education"
    },
    {
        icon: CheckCircle,
        title: "Globally Accredited",
        description: "Degrees recognized in 180+ countries worldwide"
    },
];

export function PartnersSection() {
    return (
        <section className="py-16 bg-muted/20 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 font-semibold text-sm mb-4">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Trusted Partners</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        Partner Universities
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        We collaborate with China's most prestigious institutions to bring you the best educational opportunities
                    </p>
                </motion.div>

                {/* University Logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
                        {partners.map((partner, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.1 }}
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                    {partner.logo}
                                </div>
                                <div className="text-xs text-center font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                    {partner.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recognition Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {recognitions.map((recognition, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <recognition.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground mb-1">{recognition.title}</h3>
                                <p className="text-sm text-muted-foreground">{recognition.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
