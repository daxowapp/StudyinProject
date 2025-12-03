"use client";

import Link from "next/link";
import { Search, UserPlus, Upload, CreditCard, CheckCircle, Plane, Sparkles, ArrowRight, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        title: "Discover Programs",
        description: "Browse 500+ programs from top Chinese universities tailored to your goals.",
        icon: Search,
        color: "bg-red-500",
        lightColor: "bg-red-100",
        delay: 0
    },
    {
        title: "Create Profile",
        description: "Set up your account and complete your academic profile in minutes.",
        icon: UserPlus,
        color: "bg-purple-500",
        lightColor: "bg-purple-100",
        delay: 0.2
    },
    {
        title: "Upload Documents",
        description: "Submit certificates, transcripts, and required documents securely.",
        icon: Upload,
        color: "bg-indigo-500",
        lightColor: "bg-indigo-100",
        delay: 0.4
    },
    {
        title: "Pay Application Fee",
        description: "Make secure payments via Stripe with multiple currency options.",
        icon: CreditCard,
        color: "bg-yellow-500",
        lightColor: "bg-yellow-100",
        delay: 0.6
    },
    {
        title: "Track Progress",
        description: "Monitor your application status with real-time updates and notifications.",
        icon: CheckCircle,
        color: "bg-teal-500",
        lightColor: "bg-teal-100",
        delay: 0.8
    },
    {
        title: "Get Admission",
        description: "Receive your offer letter, visa documents, and start your journey!",
        icon: Plane,
        color: "bg-emerald-500",
        lightColor: "bg-emerald-100",
        delay: 1
    },
];

interface HowItWorksSectionProps {
    isLoggedIn?: boolean;
}

export function HowItWorksSection({ isLoggedIn = false }: HowItWorksSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} id="how-it-works" className="py-16 bg-gradient-to-b from-background via-blue-50/30 to-background relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/20 font-semibold text-sm mb-6"
                    >
                        <Zap className="h-4 w-4 text-red-600" />
                        <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">Lightning Fast Process</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter font-heading mb-6">
                        From Application to{" "}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-600 to-orange-600">
                                Admission
                            </span>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={isInView ? { scaleX: 1 } : {}}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full"
                            />
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        A streamlined 6-step journey designed to get you from browsing programs to receiving your admission letter in record time.
                    </p>
                </motion.div>

                {/* Horizontal Timeline */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Horizontal connecting line */}
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 opacity-20" />

                    {/* Steps in horizontal grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: step.delay, duration: 0.5 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                {/* Step Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={isInView ? { scale: 1 } : {}}
                                    transition={{ delay: step.delay + 0.2, type: "spring", stiffness: 200 }}
                                    className="relative mb-4"
                                >
                                    {/* Pulsing Ring */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: step.delay }}
                                        className={`absolute inset-0 ${step.color} rounded-full`}
                                    />

                                    {/* Main Circle */}
                                    <div className={`relative h-20 w-20 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                                        <step.icon className="h-10 w-10 text-white" strokeWidth={2.5} />

                                        {/* Step Number */}
                                        <div className="absolute -top-1 -right-1 h-7 w-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-background">
                                            <span className={`text-sm font-black ${step.color.replace('bg-', 'text-')}`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: step.delay + 0.4, duration: 0.5 }}
                                >
                                    <h3 className="text-base font-bold mb-2 text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="mt-24 text-center"
                >
                    <Link href={isLoggedIn ? "/programs" : "/auth/login"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group px-12 py-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                            <span className="relative z-10 flex items-center gap-2">
                                Start Your Application Now
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">
                        ⚡ Average completion time: <span className="font-bold text-foreground">15 minutes</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
