'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitLead } from './actions';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Download, ArrowRight, Star, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DownloadGuidePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const result = await submitLead(formData);

            if (result.error) {
                if (typeof result.error === 'string') {
                    toast.error(result.error);
                } else {
                    toast.error("Please check your inputs");
                }
            } else if (result.success) {
                setIsSuccess(true);
                setDownloadUrl(result.guideUrl || '#');
                toast.success(result.message);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
            {/* Left Side - Visuals */}
            <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 lg:p-16 xl:p-24 flex flex-col justify-center relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    {/* 3D Book Container */}
                    <div className="relative w-64 h-80 md:w-80 md:h-[480px] perspective-1000 mb-12 group">
                        <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-15deg] rotate-y-[-25deg] rotate-x-[10deg]">
                            {/* Front Cover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-r-md shadow-2xl flex flex-col items-center justify-between p-8 border-l-4 border-red-900 transform-style-3d backface-hidden">
                                <div className="text-center">
                                    <div className="text-xs font-bold tracking-[0.2em] text-red-200 mb-2">OFFICIAL GUIDE</div>
                                    <h1 className="text-4xl font-bold font-heading leading-tight mb-2">STUDY IN<br />CHINA</h1>
                                    <div className="w-12 h-1 bg-white/30 mx-auto rounded-full" />
                                </div>

                                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <GraduationCap className="w-16 h-16 text-white" />
                                </div>

                                <div className="text-center w-full">
                                    <div className="flex justify-between text-xs font-medium text-red-100 border-t border-white/20 pt-4 w-full">
                                        <span>2025 EDITION</span>
                                        <span>FREE COPY</span>
                                    </div>
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-r-md pointer-events-none" />
                            </div>

                            {/* Spine */}
                            <div className="absolute top-0 left-0 w-12 h-full bg-red-900 origin-left rotate-y-90 rounded-l-sm flex items-center justify-center">
                                <span className="text-white/50 text-xs font-bold tracking-widest rotate-90 whitespace-nowrap">STUDY IN CHINA GUIDE 2025</span>
                            </div>

                            {/* Pages (Side) */}
                            <div className="absolute top-1 right-0 w-10 h-[98%] bg-white transform translate-z-[-2px] translate-x-[9px] rotate-y-90 origin-right shadow-inner" />

                            {/* Back Cover */}
                            <div className="absolute inset-0 bg-red-800 rounded-l-md transform translate-z-[-40px] shadow-xl" />
                        </div>

                        {/* Shadow */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full h-12 bg-black/40 blur-xl rounded-full transform scale-x-110" />
                    </div>

                    <div className="text-center max-w-md mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                        </div>
                        <p className="text-slate-300 italic">&quot;The most comprehensive resource I found. Helped me get a full scholarship!&quot;</p>
                        <p className="text-slate-400 text-sm mt-2 font-bold">- Sarah J., Medical Student</p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-16 xl:p-24 flex flex-col justify-center bg-white">
                {!isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-md mx-auto w-full"
                    >
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
                                <Download className="w-3 h-3" />
                                Instant Access
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Download Your Free Copy</h2>
                            <p className="text-slate-500">Join 10,000+ students who have used this guide to start their journey.</p>
                        </div>

                        <form action={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="Enter your name" required className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="Enter your email" required className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" placeholder="+1 234..." required className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" name="country" placeholder="Your Country" required className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="study_interest">Study Interest</Label>
                                <Select name="study_interest" required>
                                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20">
                                        <SelectValue placeholder="Select a field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="medicine">Medicine (MBBS)</SelectItem>
                                        <SelectItem value="engineering">Engineering</SelectItem>
                                        <SelectItem value="business">Business & Economics</SelectItem>
                                        <SelectItem value="cs">Computer Science</SelectItem>
                                        <SelectItem value="arts">Arts & Humanities</SelectItem>
                                        <SelectItem value="language">Chinese Language</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg shadow-red-600/20 transition-all mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Get the Guide <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-slate-400 mt-4">
                                By downloading, you agree to receive helpful tips about studying in China. No spam, ever.
                            </p>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto w-full text-center"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Check Your Inbox!</h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            We&apos;ve sent the guide to your email. You can also download it directly here.
                        </p>

                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-xl gap-2 w-full">
                                <Download className="w-5 h-5" />
                                Download PDF
                            </Button>
                        </a>

                        <Button variant="ghost" className="mt-6" onClick={() => window.location.href = '/programs'}>
                            Browse Programs
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
