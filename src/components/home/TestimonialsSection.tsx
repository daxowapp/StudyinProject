"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Sarah Johnson",
        country: "USA",
        university: "Tsinghua University",
        program: "Computer Science",
        quote: "Studying at Tsinghua was a life-changing experience. The campus is beautiful and the professors are world-class. I've grown both academically and personally.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
        name: "Ahmed Hassan",
        country: "Egypt",
        university: "Zhejiang University",
        program: "Civil Engineering",
        quote: "The application process was smooth thanks to StudyAtChina. I'm now pursuing my Master's in Civil Engineering and loving every moment of it.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
        name: "Maria Garcia",
        country: "Spain",
        university: "Fudan University",
        program: "International Business",
        quote: "Shanghai is an amazing city! I love the culture, the food, and the friends I've made here. The scholarship I received made it all possible.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
];

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

export function TestimonialsSection() {
    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 font-semibold text-sm mb-4">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Success Stories</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        What Our Students Say
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Hear from students who have successfully applied through our platform and are now thriving in China.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-3"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.2 }}
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
                                        "{testimonial.quote}"
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
                                                {testimonial.program} • {testimonial.university}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                📍 {testimonial.country}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Decorative Corner */}
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex flex-wrap items-center justify-center gap-8 px-8 py-6 rounded-2xl bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-semibold">
                                <span className="text-2xl font-black text-foreground">4.9/5</span>
                                <span className="text-muted-foreground ml-2">Average Rating</span>
                            </span>
                        </div>
                        <div className="h-8 w-px bg-border hidden md:block" />
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-semibold">
                                <span className="text-2xl font-black text-foreground">2,500+</span>
                                <span className="text-muted-foreground ml-2">Reviews</span>
                            </span>
                        </div>
                        <div className="h-8 w-px bg-border hidden md:block" />
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-semibold">
                                <span className="text-2xl font-black text-foreground">98%</span>
                                <span className="text-muted-foreground ml-2">Satisfaction</span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
