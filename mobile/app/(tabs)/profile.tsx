import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, initialized, signOut, initialize } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);

    useEffect(() => {
        if (!initialized) {
            initialize();
        }
    }, [initialized]);

    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    async function fetchApplications() {
        try {
            setLoadingApps(true);
            const { data, error } = await supabase
                .from('applications')
                .select(`
          id,
          status,
          created_at,
          university_programs (
            title,
            universities (name)
          )
        `)
                .eq('student_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (!error && data) {
                setApplications(data);
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
        } finally {
            setLoadingApps(false);
        }
    }

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(tabs)');
    };

    // Not initialized yet
    if (!initialized) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DC2626" />
                </View>
            </SafeAreaView>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.content}
                >
                    <View style={styles.loginCard}>
                        <Text style={styles.loginIcon}>👤</Text>
                        <Text style={styles.loginTitle}>Welcome to StudyIn</Text>
                        <Text style={styles.loginSubtitle}>
                            Sign in to track your applications, manage documents, and more
                        </Text>

                        <Pressable
                            style={styles.signInButton}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        </Pressable>

                        <Pressable
                            style={styles.registerButton}
                            onPress={() => router.push('/(auth)/register')}
                        >
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        </Pressable>
                    </View>

                    {/* Quick Links */}
                    <View style={styles.quickLinks}>
                        <Text style={styles.quickLinksTitle}>Quick Links</Text>

                        {[
                            { icon: '📚', label: 'How to Apply', route: '/' },
                            { icon: '❓', label: 'FAQs', route: '/' },
                            { icon: '📞', label: 'Contact Support', route: '/' },
                            { icon: '📖', label: 'About StudyIn', route: '/' },
                        ].map((item, index) => (
                            <MotiView
                                key={item.label}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ type: 'spring', delay: 200 + index * 100 }}
                            >
                                <Pressable style={styles.quickLinkItem}>
                                    <Text style={styles.quickLinkIcon}>{item.icon}</Text>
                                    <Text style={styles.quickLinkLabel}>{item.label}</Text>
                                    <Text style={styles.quickLinkArrow}>→</Text>
                                </Pressable>
                            </MotiView>
                        ))}
                    </View>
                </MotiView>
            </SafeAreaView>
        );
    }

    // Logged in - Dashboard
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';
    const pendingCount = applications.filter(a =>
        ['pending', 'submitted', 'under_review'].includes(a.status)
    ).length;
    const acceptedCount = applications.filter(a => a.status === 'accepted').length;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.dashboardHeader}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                    <Pressable style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                            {userName.charAt(0).toUpperCase()}
                        </Text>
                    </Pressable>
                </View>

                {/* Stats Cards */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring' }}
                >
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
                            <Text style={styles.statNumber}>{applications.length}</Text>
                            <Text style={styles.statLabel}>Applications</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={styles.statNumber}>{pendingCount}</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
                            <Text style={styles.statNumber}>{acceptedCount}</Text>
                            <Text style={styles.statLabel}>Accepted</Text>
                        </View>
                    </View>
                </MotiView>

                {/* Quick Actions */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.actionsGrid}>
                            {[
                                { icon: '📂', label: 'Applications' },
                                { icon: '📄', label: 'Documents' },
                                { icon: '💳', label: 'Payments' },
                                { icon: '⚙️', label: 'Settings' },
                            ].map((action, index) => (
                                <MotiView
                                    key={action.label}
                                    from={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', delay: 200 + index * 50 }}
                                >
                                    <Pressable style={styles.actionCard}>
                                        <Text style={styles.actionIcon}>{action.icon}</Text>
                                        <Text style={styles.actionLabel}>{action.label}</Text>
                                    </Pressable>
                                </MotiView>
                            ))}
                        </View>
                    </View>
                </MotiView>

                {/* Recent Applications */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 200 }}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent Applications</Text>

                        {loadingApps ? (
                            <ActivityIndicator color="#DC2626" style={{ paddingVertical: 20 }} />
                        ) : applications.length === 0 ? (
                            <View style={styles.emptyApps}>
                                <Text style={styles.emptyIcon}>📋</Text>
                                <Text style={styles.emptyText}>No applications yet</Text>
                                <Pressable
                                    style={styles.browseButton}
                                    onPress={() => router.push('/(tabs)/explore')}
                                >
                                    <Text style={styles.browseButtonText}>Browse Programs</Text>
                                </Pressable>
                            </View>
                        ) : (
                            applications.map((app, index) => (
                                <MotiView
                                    key={app.id}
                                    from={{ opacity: 0, translateX: 20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: 'spring', delay: 300 + index * 50 }}
                                >
                                    <Pressable style={styles.applicationCard}>
                                        <View style={styles.appInfo}>
                                            <Text style={styles.appProgram} numberOfLines={1}>
                                                {app.university_programs?.title || 'Program'}
                                            </Text>
                                            <Text style={styles.appUniversity} numberOfLines={1}>
                                                {app.university_programs?.universities?.name || 'University'}
                                            </Text>
                                        </View>
                                        <View style={[styles.statusBadge, getStatusStyle(app.status)]}>
                                            <Text style={styles.statusText}>{formatStatus(app.status)}</Text>
                                        </View>
                                    </Pressable>
                                </MotiView>
                            ))
                        )}
                    </View>
                </MotiView>

                {/* Sign Out */}
                <View style={styles.signOutSection}>
                    <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </Pressable>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'accepted':
            return { backgroundColor: '#D1FAE5' };
        case 'rejected':
            return { backgroundColor: '#FEE2E2' };
        case 'under_review':
            return { backgroundColor: '#DBEAFE' };
        default:
            return { backgroundColor: '#FEF3C7' };
    }
}

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loginCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    loginIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    loginTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    loginSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    signInButton: {
        backgroundColor: '#DC2626',
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton: {
        paddingVertical: 14,
        paddingHorizontal: 48,
        width: '100%',
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: '600',
    },
    quickLinks: {
        marginTop: 32,
    },
    quickLinksTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    quickLinkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    quickLinkIcon: {
        fontSize: 20,
        marginRight: 14,
    },
    quickLinkLabel: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    quickLinkArrow: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    // Dashboard styles
    dashboardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    welcomeText: {
        fontSize: 14,
        color: '#6B7280',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    emptyApps: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    browseButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    browseButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    applicationCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    appInfo: {
        flex: 1,
        marginRight: 12,
    },
    appProgram: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    appUniversity: {
        fontSize: 13,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#374151',
    },
    signOutSection: {
        paddingHorizontal: 20,
    },
    signOutButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    signOutText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: '600',
    },
});
