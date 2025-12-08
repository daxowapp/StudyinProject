import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, ChevronRight, MessageCircle, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useData';

interface Message {
    id: string;
    application_id: string;
    subject: string;
    message: string;
    is_read: boolean;
    sender_type: string;
    created_at: string;
    application?: {
        university_program?: {
            program_catalog?: { title: string };
            university?: { name: string };
        };
    };
}

export default function MessagesScreen() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMessages = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('application_messages')
                .select(`
                    *,
                    application:application_id (
                        university_program:university_program_id (
                            program_catalog:program_catalog_id (title),
                            university:university_id (name)
                        )
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMessages();
        }
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMessages();
        setRefreshing(false);
    };

    const markAsRead = async (messageId: string) => {
        await supabase
            .from('application_messages')
            .update({ is_read: true })
            .eq('id', messageId);

        // Update local state
        setMessages(prev => prev.map(m =>
            m.id === messageId ? { ...m, is_read: true } : m
        ));
    };

    const handleMessagePress = (message: Message) => {
        markAsRead(message.id);
        router.push(`/application/${message.application_id}`);
    };

    if (authLoading || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C62828" />
            </View>
        );
    }

    if (!user) {
        router.replace('/(auth)/login');
        return null;
    }

    const unreadCount = messages.filter(m => !m.is_read && m.sender_type === 'admin').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
                            <ArrowLeft size={22} color="#FFF" />
                        </Pressable>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>Messages</Text>
                            {unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.headerBtn} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C62828" />}
            >
                {messages.length === 0 ? (
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring' }}
                        style={styles.emptyState}
                    >
                        <MessageCircle size={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No Messages Yet</Text>
                        <Text style={styles.emptyText}>
                            You'll receive messages from admissions teams here when you have active applications.
                        </Text>
                    </MotiView>
                ) : (
                    <View style={styles.messagesList}>
                        {messages.map((message, index) => (
                            <MotiView
                                key={message.id}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ type: 'spring', delay: index * 50 }}
                            >
                                <Pressable
                                    style={[
                                        styles.messageCard,
                                        !message.is_read && message.sender_type === 'admin' && styles.messageCardUnread
                                    ]}
                                    onPress={() => handleMessagePress(message)}
                                >
                                    <View style={styles.messageLeft}>
                                        <View style={[
                                            styles.messageDot,
                                            { backgroundColor: !message.is_read && message.sender_type === 'admin' ? '#C62828' : '#D1D5DB' }
                                        ]} />
                                        <View style={styles.messageContent}>
                                            <Text style={[
                                                styles.messageSubject,
                                                !message.is_read && message.sender_type === 'admin' && styles.messageSubjectUnread
                                            ]} numberOfLines={1}>
                                                {message.subject}
                                            </Text>
                                            <Text style={styles.messageProgramName} numberOfLines={1}>
                                                {message.application?.university_program?.program_catalog?.title || 'Application'}
                                            </Text>
                                            <View style={styles.messageFooter}>
                                                <Clock size={12} color="#9CA3AF" />
                                                <Text style={styles.messageDate}>
                                                    {new Date(message.created_at).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <ChevronRight size={20} color="#D1D5DB" />
                                </Pressable>
                            </MotiView>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
    header: { paddingBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
    headerBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    unreadBadge: { backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    unreadBadgeText: { fontSize: 11, fontWeight: '700', color: '#C62828' },
    content: { flex: 1, padding: 16 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16 },
    emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 32 },
    messagesList: { gap: 10 },
    messageCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
    messageCardUnread: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
    messageLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 12 },
    messageDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
    messageContent: { flex: 1 },
    messageSubject: { fontSize: 15, fontWeight: '500', color: '#374151', marginBottom: 4 },
    messageSubjectUnread: { fontWeight: '700', color: '#1F2937' },
    messageProgramName: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
    messageFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    messageDate: { fontSize: 12, color: '#9CA3AF' },
});
