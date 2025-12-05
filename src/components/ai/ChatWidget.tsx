'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, Minimize2, Maximize2, History, LogIn, UserPlus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChineseAvatar, ChineseAvatarSmall } from './ChineseAvatar';
import { ChatMessageContent } from './ChatMessageContent';
import { CHEN_WEI_GREETINGS } from '@/lib/ai/prompts';
import Link from 'next/link';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

interface ChatSession {
    id: string;
    messages: Message[];
    updated_at: string;
}

interface ChatWidgetProps {
    className?: string;
}

export function ChatWidget({ className }: ChatWidgetProps) {
    const t = useTranslations('AIChat');
    const locale = useLocale() as 'en' | 'ar' | 'fa' | 'tr';
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const [userLocation, setUserLocation] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check auth status and load chat history
    useEffect(() => {
        const checkAuthAndLoadHistory = async () => {
            try {
                const response = await fetch('/api/ai/chat');
                const data = await response.json();

                setIsAuthenticated(data.isAuthenticated);
                if (data.sessions && data.sessions.length > 0) {
                    setChatHistory(data.sessions);
                }
            } catch (error) {
                console.error('Failed to check auth status:', error);
            }
        };

        checkAuthAndLoadHistory();
    }, []);

    // Detect user's location/timezone for greeting
    useEffect(() => {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserLocation(timezone);
        } catch {
            setUserLocation('Unknown');
        }
    }, []);

    // Auto-open chat on first visit
    useEffect(() => {
        const hasSeenChat = localStorage.getItem('chenwei_chat_seen');
        if (!hasSeenChat && !hasAutoOpened) {
            // Delay auto-open for better UX
            const timer = setTimeout(() => {
                setIsOpen(true);
                setHasAutoOpened(true);
                localStorage.setItem('chenwei_chat_seen', 'true');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [hasAutoOpened]);

    // Initial greeting based on locale
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = CHEN_WEI_GREETINGS[locale] || CHEN_WEI_GREETINGS.en;
            setMessages([
                {
                    id: 'greeting',
                    role: 'assistant',
                    content: greeting,
                    timestamp: new Date().toISOString(),
                },
            ]);
        }
    }, [isOpen, messages.length, locale]);

    // Scroll to bottom on new messages
    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                // ScrollArea uses a viewport div inside
                const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (viewport) {
                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: 'smooth',
                    });
                } else {
                    scrollRef.current.scrollTo({
                        top: scrollRef.current.scrollHeight,
                        behavior: 'smooth',
                    });
                }
            }
        };

        // Scroll immediately and after a small delay for streaming content
        scrollToBottom();
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);

    const loadChatSession = (session: ChatSession) => {
        setMessages(session.messages);
        setCurrentSessionId(session.id);
        setShowHistory(false);
    };

    const startNewChat = () => {
        setMessages([]);
        setCurrentSessionId(null);
        setShowHistory(false);
        // Greeting will be added by useEffect
    };

    const sendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setIsTalking(true);

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
                    sessionId: currentSessionId,
                    userLocation,
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

                            // Capture session ID if returned
                            if (parsed.sessionId && !currentSessionId) {
                                setCurrentSessionId(parsed.sessionId);
                            }

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
            setIsTalking(false);
        }
    }, [input, isLoading, messages, locale, currentSessionId, userLocation, t]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickActions = [
        { label: t('quickFind') || '🎓 Find Programs', query: 'Help me find a program that matches my interests' },
        { label: t('quickScholarship') || '💰 Scholarships', query: 'What scholarships are available for international students?' },
        { label: t('quickApply') || '📝 Start Application', query: "I'd like to apply for a program" },
    ];

    const handleQuickAction = (query: string) => {
        setInput(query);
        setTimeout(() => sendMessage(), 100);
    };

    return (
        <>
            {/* Floating Button with Chen Wei Avatar */}
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
                            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 p-0 overflow-visible"
                        >
                            <ChineseAvatar size="lg" isAnimating={true} />
                        </Button>
                        {/* Notification badge */}
                        <motion.span
                            className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <MessageSquare className="h-3 w-3 text-white" />
                        </motion.span>
                        {/* Name tag */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                        >
                            <span className="text-sm font-medium text-gray-800">
                                {locale === 'ar' ? 'مرحباً! أنا تشن وي' :
                                    locale === 'fa' ? 'سلام! من چن وی هستم' :
                                        locale === 'tr' ? 'Merhaba! Ben Chen Wei' :
                                            "Hi! I'm Chen Wei 👋"}
                            </span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-white transform rotate-45" />
                        </motion.div>
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
                                : 'bottom-6 right-6 w-[400px] h-[650px] max-h-[85vh]',
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10">
                            <div className="flex items-center gap-3">
                                <ChineseAvatar size="md" isAnimating={true} isTalking={isTalking} />
                                {!isMinimized && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Chen Wei 陈伟</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {isTalking ? (t('typing') || 'Typing...') : (t('subtitle') || 'Your Study Advisor')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {!isMinimized && isAuthenticated && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowHistory(!showHistory)}
                                        className="h-8 w-8"
                                        title="Chat History"
                                    >
                                        <History className="h-4 w-4" />
                                    </Button>
                                )}
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
                                {/* History Panel */}
                                {showHistory && (
                                    <div className="absolute inset-0 top-[72px] bg-background z-10 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold">{t('chatHistory') || 'Chat History'}</h4>
                                            <Button variant="outline" size="sm" onClick={startNewChat}>
                                                {t('newChat') || 'New Chat'}
                                            </Button>
                                        </div>
                                        <ScrollArea className="h-[calc(100%-60px)]">
                                            {chatHistory.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-8">
                                                    {t('noHistory') || 'No previous conversations'}
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {chatHistory.map((session) => (
                                                        <button
                                                            key={session.id}
                                                            onClick={() => loadChatSession(session)}
                                                            className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
                                                        >
                                                            <p className="text-sm font-medium truncate">
                                                                {session.messages[1]?.content.slice(0, 50) || 'New conversation'}...
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {new Date(session.updated_at).toLocaleDateString()}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-2"
                                            onClick={() => setShowHistory(false)}
                                        >
                                            {t('backToChat') || 'Back to Chat'}
                                        </Button>
                                    </div>
                                )}

                                {/* Login prompt for guests */}
                                {!isAuthenticated && messages.length > 2 && (
                                    <div className="mx-4 mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                                        <p className="text-xs text-gray-600 mb-2">
                                            {t('loginPrompt') || '🔐 Log in to save your chat history and track applications'}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link href={`/${locale}/login`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full text-xs">
                                                    <LogIn className="h-3 w-3 mr-1" />
                                                    {t('login') || 'Log In'}
                                                </Button>
                                            </Link>
                                            <Link href={`/${locale}/register`} className="flex-1">
                                                <Button size="sm" className="w-full text-xs bg-gradient-to-r from-red-500 to-orange-500">
                                                    <UserPlus className="h-3 w-3 mr-1" />
                                                    {t('register') || 'Register'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Messages */}
                                <ScrollArea className={cn(
                                    "p-4",
                                    !isAuthenticated && messages.length > 2 ? "h-[calc(100%-220px)]" : "h-[calc(100%-140px)]"
                                )} ref={scrollRef}>
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    'flex gap-3',
                                                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                                )}
                                            >
                                                {message.role === 'assistant' ? (
                                                    <ChineseAvatarSmall isTalking={isTalking && message.id === messages[messages.length - 1]?.id} />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                                        <span className="text-sm">👤</span>
                                                    </div>
                                                )}
                                                <div
                                                    className={cn(
                                                        'rounded-2xl px-4 py-3 max-w-[85%]',
                                                        message.role === 'user'
                                                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-br-sm'
                                                            : 'bg-white border border-gray-100 shadow-sm rounded-bl-sm'
                                                    )}
                                                >
                                                    {message.content ? (
                                                        <ChatMessageContent
                                                            content={message.content}
                                                            isUser={message.role === 'user'}
                                                        />
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-sm text-gray-500">
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
                                            <div className="flex flex-col gap-2">
                                                {quickActions.map((action) => (
                                                    <Button
                                                        key={action.label}
                                                        variant="outline"
                                                        size="sm"
                                                        className="justify-start text-xs h-auto py-2 px-3"
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
                                            className="rounded-full shrink-0 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
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
