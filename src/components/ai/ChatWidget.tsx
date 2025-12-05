'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatWidgetProps {
    className?: string;
}

export function ChatWidget({ className }: ChatWidgetProps) {
    const t = useTranslations('AIChat');
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 'greeting',
                    role: 'assistant',
                    content: t('greeting') || "Hi! 👋 I'm your AI study advisor. I can help you find programs, learn about scholarships, and guide you through the application process. How can I help you today?",
                },
            ]);
        }
    }, [isOpen, messages.length, t]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Add placeholder for assistant response
        const assistantId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    locale,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No reader available');
            }

            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                fullContent += parsed.content;
                                setMessages(prev =>
                                    prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, content: fullContent }
                                            : m
                                    )
                                );
                            }
                        } catch {
                            // Ignore parse errors for malformed chunks
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantId
                        ? { ...m, content: t('error') || "Sorry, I encountered an error. Please try again." }
                        : m
                )
            );
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, locale, t]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickActions = [
        { label: t('quickFind') || 'Find Programs', query: 'Help me find a program' },
        { label: t('quickScholarship') || 'Scholarships', query: 'What scholarships are available?' },
        { label: t('quickApply') || 'How to Apply', query: 'How do I apply to a Chinese university?' },
    ];

    const handleQuickAction = (query: string) => {
        setInput(query);
        setTimeout(() => sendMessage(), 100);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={cn('fixed bottom-6 right-6 z-50', className)}
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            size="lg"
                            className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            'fixed z-50 bg-background border shadow-2xl rounded-2xl overflow-hidden',
                            isMinimized
                                ? 'bottom-6 right-6 w-80 h-14'
                                : 'bottom-6 right-6 w-96 h-[600px] max-h-[80vh]',
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                {!isMinimized && (
                                    <div>
                                        <h3 className="font-semibold">{t('title') || 'AI Advisor'}</h3>
                                        <p className="text-xs text-muted-foreground">{t('subtitle') || 'Here to help you'}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="h-8 w-8"
                                >
                                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <ScrollArea className="h-[calc(100%-140px)] p-4" ref={scrollRef}>
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    'flex gap-3',
                                                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                                                        message.role === 'user'
                                                            ? 'bg-primary text-white'
                                                            : 'bg-gradient-to-r from-primary/20 to-purple-500/20'
                                                    )}
                                                >
                                                    {message.role === 'user' ? (
                                                        <User className="h-4 w-4" />
                                                    ) : (
                                                        <Bot className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <div
                                                    className={cn(
                                                        'rounded-2xl px-4 py-2 max-w-[80%] whitespace-pre-wrap',
                                                        message.role === 'user'
                                                            ? 'bg-primary text-white rounded-br-sm'
                                                            : 'bg-muted rounded-bl-sm'
                                                    )}
                                                >
                                                    {message.content || (
                                                        <span className="flex items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            {t('thinking') || 'Thinking...'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick Actions (show only at start) */}
                                    {messages.length <= 1 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs text-muted-foreground">{t('quickStart') || 'Quick start'}:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {quickActions.map((action) => (
                                                    <Button
                                                        key={action.label}
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-full text-xs"
                                                        onClick={() => handleQuickAction(action.query)}
                                                    >
                                                        {action.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Input */}
                                <div className="p-4 border-t bg-muted/30">
                                    <div className="flex gap-2">
                                        <Input
                                            ref={inputRef}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={t('inputPlaceholder') || 'Type your message...'}
                                            disabled={isLoading}
                                            className="rounded-full"
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            disabled={!input.trim() || isLoading}
                                            size="icon"
                                            className="rounded-full shrink-0"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
