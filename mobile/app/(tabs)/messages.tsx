import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';
import { supabase } from '../../lib/supabase';

interface Message {
    id: string;
    subject: string;
    content: string;
    is_read: boolean;
    created_at: string;
    sender_name?: string;
}

export default function MessagesScreen() {
    const router = useRouter();
    const { user, initialized } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMessages();
        }
    }, [user]);

    async function fetchMessages() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('recipient_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setMessages(data);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    }

    // Not logged in
    if (!user) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <Text style={styles.headerSubtitle}>Stay connected with advisors</Text>
                </View>

                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.content}
                >
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💬</Text>
                        <Text style={styles.emptyTitle}>No Messages Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Sign in to view messages from your application advisors
                        </Text>
                        <Pressable
                            style={styles.signInButton}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        </Pressable>
                    </View>
                </MotiView>
            </SafeAreaView>
        );
    }

    // Logged in
    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <Text style={styles.headerSubtitle}>
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DC2626" />
                </View>
            ) : messages.length === 0 ? (
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.content}
                >
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>No Messages</Text>
                        <Text style={styles.emptySubtitle}>
                            Messages from your advisors will appear here
                        </Text>
                    </View>
                </MotiView>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {messages.map((message, index) => (
                        <MotiView
                            key={message.id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'spring', delay: index * 50 }}
                        >
                            <Pressable
                                style={[
                                    styles.messageCard,
                                    !message.is_read && styles.unreadCard
                                ]}
                            >
                                <View style={styles.messageHeader}>
                                    <View style={styles.avatarSmall}>
                                        <Text style={styles.avatarSmallText}>
                                            {(message.sender_name || 'A').charAt(0)}
                                        </Text>
                                    </View>
                                    <View style={styles.messageInfo}>
                                        <Text style={styles.senderName}>
                                            {message.sender_name || 'StudyIn Advisor'}
                                        </Text>
                                        <Text style={styles.messageTime}>
                                            {formatTime(message.created_at)}
                                        </Text>
                                    </View>
                                    {!message.is_read && <View style={styles.unreadDot} />}
                                </View>
                                <Text style={styles.messageSubject} numberOfLines={1}>
                                    {message.subject || 'No Subject'}
                                </Text>
                                <Text style={styles.messagePreview} numberOfLines={2}>
                                    {message.content}
                                </Text>
                            </Pressable>
                        </MotiView>
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    signInButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
    },
    unreadCard: {
        borderLeftWidth: 3,
        borderLeftColor: '#DC2626',
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarSmallText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1D4ED8',
    },
    messageInfo: {
        flex: 1,
    },
    senderName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    messageTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DC2626',
    },
    messageSubject: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    messagePreview: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
});
