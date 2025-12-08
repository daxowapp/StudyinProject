import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkles, Bot, User } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { ThemedText as Text } from '../../components/ThemedText';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatScreen() {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Initialize welcome message
    useEffect(() => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: t('chat.welcome'),
                timestamp: new Date(),
            }
        ]);
    }, [t]);

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setTimeout(scrollToBottom, 100);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_SITE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: t('chat.errorConnection'),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={isDark ? [theme.gradientStart, theme.gradientEnd] : ['#DC2626', '#B91C1C']}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerTitleContainer}>
                            <View style={styles.botAvatarContainer}>
                                <Bot size={24} color="#DC2626" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>{t('chat.botName')}</Text>
                                <View style={styles.statusContainer}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.statusText}>Online</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message, index) => (
                    <MotiView
                        key={message.id}
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 300 }}
                        style={[
                            styles.messageWrapper,
                            message.role === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
                        ]}
                    >
                        {message.role === 'assistant' && (
                            <View style={[styles.messageAvatar, { backgroundColor: theme.card }]}>
                                <Bot size={16} color={theme.primary} />
                            </View>
                        )}
                        <View
                            style={[
                                styles.messageBubble,
                                message.role === 'user'
                                    ? [styles.userBubble, { backgroundColor: theme.primary }]
                                    : [styles.botBubble, { backgroundColor: theme.card }]
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    { color: message.role === 'user' ? '#FFFFFF' : theme.text }
                                ]}
                            >
                                {message.content}
                            </Text>
                            <Text
                                style={[
                                    styles.timestamp,
                                    { color: message.role === 'user' ? 'rgba(255,255,255,0.7)' : theme.textMuted }
                                ]}
                            >
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        {message.role === 'user' && (
                            <View style={[styles.messageAvatar, { backgroundColor: theme.primary }]}>
                                <User size={16} color="#FFFFFF" />
                            </View>
                        )}
                    </MotiView>
                ))}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <View style={[styles.messageAvatar, { backgroundColor: theme.card }]}>
                            <Bot size={16} color={theme.primary} />
                        </View>
                        <View style={[styles.typingBubble, { backgroundColor: theme.card }]}>
                            <ActivityIndicator size="small" color={theme.primary} />
                        </View>
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                    <View style={[styles.inputWrapper, { backgroundColor: theme.background }]}>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder={t('chat.placeholder')}
                            placeholderTextColor={theme.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <Pressable
                            style={[
                                styles.sendButton,
                                { backgroundColor: inputText.trim() ? theme.primary : theme.border }
                            ]}
                            onPress={handleSend}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <Send size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    safeTop: {
        backgroundColor: '#FFF',
    },
    header: {
        paddingBottom: 12,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    botAvatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    botAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
    },
    statusText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ADE80',
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 100,
    },
    messageWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
        gap: 8,
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    botMessageWrapper: {
        justifyContent: 'flex-start',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
        gap: 8,
    },
    messageRowUser: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarSmall: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatarSmall: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#C62828',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },
    userBubble: {
        backgroundColor: '#C62828',
        borderBottomEndRadius: 4,
    },
    botBubble: {
        backgroundColor: '#FFF',
        borderBottomStartRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    assistantBubble: {
        backgroundColor: '#FFF',
        borderBottomStartRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
        color: '#374151',
    },
    userMessageText: {
        color: '#FFF',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 12,
    },
    typingBubble: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 30,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 22,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        maxHeight: 100,
        color: '#1F2937',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#1F2937',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#C62828',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
});

