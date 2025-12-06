import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';

// Mock messages data
const mockMessages = [
    {
        id: '1',
        sender: 'Beijing University',
        avatar: '🏛️',
        lastMessage: 'Your application has been reviewed. Congratulations!',
        time: '2 min ago',
        unread: true,
        color: '#DC2626',
    },
    {
        id: '2',
        sender: 'Admissions Team',
        avatar: '👨‍💼',
        lastMessage: 'Please submit your passport copy for verification.',
        time: '1 hour ago',
        unread: true,
        color: '#6366F1',
    },
    {
        id: '3',
        sender: 'Scholarship Office',
        avatar: '🎓',
        lastMessage: 'CSC Scholarship deadline reminder - 30 days left',
        time: 'Yesterday',
        unread: false,
        color: '#10B981',
    },
    {
        id: '4',
        sender: 'Support Team',
        avatar: '💬',
        lastMessage: 'How can we help you today?',
        time: '2 days ago',
        unread: false,
        color: '#F59E0B',
    },
];

export default function MessagesScreen() {
    const router = useRouter();
    const { user } = useAuth();

    if (!user) {
        return (
            <View style={styles.container}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring' }}
                        style={styles.guestContainer}
                    >
                        <View style={styles.guestIcon}>
                            <Text style={styles.guestIconText}>💬</Text>
                        </View>
                        <Text style={styles.guestTitle}>Your Messages</Text>
                        <Text style={styles.guestSubtitle}>
                            Sign in to view messages from universities and our support team
                        </Text>

                        <Pressable
                            style={styles.signInButton}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={styles.signInButtonText}>Sign In to Continue</Text>
                        </Pressable>
                    </MotiView>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                {/* Header */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500 }}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Messages</Text>
                            <Text style={styles.headerSubtitle}>Stay connected</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <Pressable style={styles.headerBtn}>
                                <Text style={styles.headerBtnText}>✏️</Text>
                            </Pressable>
                        </View>
                    </View>
                </MotiView>

                {/* Search */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.searchContainer}
                >
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search messages..."
                            placeholderTextColor="#71717A"
                        />
                    </View>
                </MotiView>

                {/* Quick Filters */}
                <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'spring', delay: 150 }}
                    style={styles.filtersContainer}
                >
                    <Pressable style={[styles.filterChip, styles.filterChipActive]}>
                        <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
                    </Pressable>
                    <Pressable style={styles.filterChip}>
                        <Text style={styles.filterText}>Unread</Text>
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>2</Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.filterChip}>
                        <Text style={styles.filterText}>Universities</Text>
                    </Pressable>
                    <Pressable style={styles.filterChip}>
                        <Text style={styles.filterText}>Support</Text>
                    </Pressable>
                </MotiView>
            </SafeAreaView>

            {/* Messages List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {mockMessages.map((message, index) => (
                    <MotiView
                        key={message.id}
                        from={{ opacity: 0, translateX: -30 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ type: 'spring', delay: 200 + index * 80 }}
                    >
                        <Pressable style={styles.messageCard}>
                            <View style={[styles.avatar, { backgroundColor: message.color }]}>
                                <Text style={styles.avatarText}>{message.avatar}</Text>
                            </View>
                            <View style={styles.messageContent}>
                                <View style={styles.messageHeader}>
                                    <Text style={styles.senderName}>{message.sender}</Text>
                                    <Text style={styles.messageTime}>{message.time}</Text>
                                </View>
                                <Text
                                    style={[
                                        styles.messagePreview,
                                        message.unread && styles.messagePreviewUnread
                                    ]}
                                    numberOfLines={2}
                                >
                                    {message.lastMessage}
                                </Text>
                            </View>
                            {message.unread && <View style={styles.unreadDot} />}
                        </Pressable>
                    </MotiView>
                ))}

                {/* Empty State Hint */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', delay: 600 }}
                    style={styles.hintContainer}
                >
                    <Text style={styles.hintIcon}>💡</Text>
                    <Text style={styles.hintText}>
                        Tip: Enable notifications to never miss important updates from universities
                    </Text>
                </MotiView>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0B',
    },
    safeArea: {
        backgroundColor: '#0A0A0B',
    },
    // Guest styles
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    guestIcon: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#18181B',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    guestIconText: {
        fontSize: 50,
    },
    guestTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    guestSubtitle: {
        fontSize: 16,
        color: '#71717A',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        maxWidth: 280,
    },
    signInButton: {
        backgroundColor: '#DC2626',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#71717A',
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#18181B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#27272A',
    },
    headerBtnText: {
        fontSize: 18,
    },
    // Search
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
    },
    // Filters
    filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 10,
        marginBottom: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#18181B',
        borderWidth: 1,
        borderColor: '#27272A',
    },
    filterChipActive: {
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
    },
    filterText: {
        fontSize: 13,
        color: '#71717A',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    filterBadge: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    filterBadgeText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // Messages List
    listContent: {
        paddingHorizontal: 24,
    },
    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
    },
    messageContent: {
        flex: 1,
        marginLeft: 14,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    senderName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    messageTime: {
        fontSize: 12,
        color: '#71717A',
    },
    messagePreview: {
        fontSize: 13,
        color: '#71717A',
        lineHeight: 20,
    },
    messagePreviewUnread: {
        color: '#A1A1AA',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DC2626',
        marginLeft: 8,
    },
    // Hint
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    hintIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    hintText: {
        flex: 1,
        fontSize: 13,
        color: '#71717A',
        lineHeight: 20,
    },
});
