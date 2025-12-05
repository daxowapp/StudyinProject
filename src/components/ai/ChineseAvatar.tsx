'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChineseAvatarProps {
    size?: 'sm' | 'md' | 'lg';
    isAnimating?: boolean;
    isTalking?: boolean;
    className?: string;
}

export function ChineseAvatar({
    size = 'md',
    isAnimating = true,
    isTalking = false,
    className
}: ChineseAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    const avatarVariants: Variants = {
        idle: {
            y: [0, -2, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        talking: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className={cn(
                'relative rounded-full overflow-hidden flex items-center justify-center',
                'bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400',
                'shadow-lg shadow-red-500/30',
                sizeClasses[size],
                className
            )}
            variants={avatarVariants}
            animate={isAnimating ? (isTalking ? 'talking' : 'idle') : undefined}
        >
            {/* Background pattern - Chinese style */}
            <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <pattern id="chinesePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="2" fill="white" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#chinesePattern)" />
                </svg>
            </div>

            {/* Character face - Stylized */}
            <svg
                viewBox="0 0 100 100"
                className={cn(
                    'relative z-10',
                    size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'
                )}
            >
                {/* Face base */}
                <circle cx="50" cy="50" r="35" fill="#FFE4C4" />

                {/* Blush */}
                <ellipse cx="28" cy="55" rx="8" ry="5" fill="#FFB6C1" opacity="0.5" />
                <ellipse cx="72" cy="55" rx="8" ry="5" fill="#FFB6C1" opacity="0.5" />

                {/* Eyes */}
                <motion.g
                    animate={isTalking ? { scaleY: [1, 0.8, 1] } : {}}
                    transition={{ duration: 0.2, repeat: isTalking ? Infinity : 0 }}
                >
                    {/* Left eye */}
                    <ellipse cx="38" cy="45" rx="5" ry="6" fill="#1a1a1a" />
                    <circle cx="36" cy="43" r="2" fill="white" />

                    {/* Right eye */}
                    <ellipse cx="62" cy="45" rx="5" ry="6" fill="#1a1a1a" />
                    <circle cx="60" cy="43" r="2" fill="white" />
                </motion.g>

                {/* Eyebrows */}
                <path d="M30 38 Q38 35 44 38" stroke="#333" strokeWidth="1.5" fill="none" />
                <path d="M56 38 Q62 35 70 38" stroke="#333" strokeWidth="1.5" fill="none" />

                {/* Nose */}
                <ellipse cx="50" cy="55" rx="3" ry="2" fill="#E8C4A8" />

                {/* Mouth */}
                <motion.path
                    d={isTalking ? "M40 65 Q50 75 60 65" : "M40 65 Q50 70 60 65"}
                    stroke="#E85D5D"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    animate={isTalking ? { d: ["M40 65 Q50 72 60 65", "M40 65 Q50 68 60 65", "M40 65 Q50 72 60 65"] } : {}}
                    transition={{ duration: 0.3, repeat: isTalking ? Infinity : 0 }}
                />

                {/* Hair */}
                <path
                    d="M20 35 Q25 15 50 12 Q75 15 80 35 Q82 25 75 18 Q60 8 50 8 Q40 8 25 18 Q18 25 20 35"
                    fill="#1a1a1a"
                />

                {/* Hair shine */}
                <path
                    d="M35 18 Q40 15 50 14"
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>

            {/* Decorative Chinese character  */}
            {size === 'lg' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold text-red-600 shadow-md">
                    伟
                </div>
            )}

            {/* Glow effect when talking */}
            {isTalking && (
                <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
}

// Smaller version for chat messages
export function ChineseAvatarSmall({ isTalking = false }: { isTalking?: boolean }) {
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400 flex items-center justify-center shadow-md">
            <motion.span
                className="text-white font-bold text-sm"
                animate={isTalking ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3, repeat: isTalking ? Infinity : 0 }}
            >
                陈
            </motion.span>
        </div>
    );
}
