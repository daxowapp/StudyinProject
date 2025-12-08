import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import {
    FileText, Clock, CheckCircle, AlertCircle, ChevronRight,
    GraduationCap, DollarSign, Mail, Bell, Settings, Building2, Sparkles
} from 'lucide-react-native';
import { useAuth, useUserApplications, useUnreadMessages, useSavedPrograms } from '../../hooks/useData';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalTabBar from '../../components/GlobalTabBar';
import { Linking } from 'react-native';

// Status badge configurations
const STATUS_CONFIG: Record<string, { color: string; bgColor: string; icon: any; label: string }> = {
    pending: { color: '#D97706', bgColor: '#FEF3C7', icon: Clock, label: 'Pending' },
    submitted: { color: '#2563EB', bgColor: '#DBEAFE', icon: FileText, label: 'Submitted' },
    under_review: { color: '#7C3AED', bgColor: '#EDE9FE', icon: Clock, label: 'Under Review' },
    pending_documents: { color: '#EA580C', bgColor: '#FFEDD5', icon: FileText, label: 'Docs Required' },
    pending_payment: { color: '#DC2626', bgColor: '#FEE2E2', icon: DollarSign, label: 'Payment Due' },
    accepted: { color: '#059669', bgColor: '#D1FAE5', icon: CheckCircle, label: 'Accepted' },
    rejected: { color: '#DC2626', bgColor: '#FEE2E2', icon: AlertCircle, label: 'Rejected' },
};

export default function DashboardScreen() {
    const router = useRouter();
    const { user, signOut, loading: authLoading } = useAuth();
    const { applications, loading: appsLoading, refresh } = useUserApplications();
    const { count: unreadCount } = useUnreadMessages();
    const { count: savedCount } = useSavedPrograms();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refresh?.();
        setRefreshing(false);
    }, [refresh]);

    // Calculate stats
    const stats = {
        total: applications.length,
        pending: applications.filter(a => ['pending', 'submitted', 'under_review'].includes(a.status)).length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        needsAction: applications.filter(a => ['pending_documents', 'pending_payment'].includes(a.status)).length,
    };

    if (authLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C62828" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <SafeAreaView edges={['top']}>
                    <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                    </LinearGradient>
                </SafeAreaView>
                <View style={styles.guestContainer}>
                    <GraduationCap size={64} color="#C62828" />
                    <Text style={styles.guestTitle}>Student Dashboard</Text>
                    <Text style={styles.guestSubtitle}>Sign in to track your applications</Text>
                    <Pressable style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
                        <Text style={styles.signInBtnText}>Sign In</Text>
                    </Pressable>
                </View>
                <GlobalTabBar />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.userName}>{user.email?.split('@')[0] || 'Student'}</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <Pressable style={styles.headerBtn}>
                                <Bell size={20} color="#FFF" />
                            </Pressable>
                            <Pressable style={styles.headerBtn} onPress={() => router.push('/(tabs)/profile')}>
                                <Settings size={20} color="#FFF" />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C62828" />}
            >
                {/* Stats Cards */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.statsGrid}
                >
                    <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
                        <FileText size={22} color="#2563EB" />
                        <Text style={[styles.statNumber, { color: '#2563EB' }]}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
                        <Clock size={22} color="#D97706" />
                        <Text style={[styles.statNumber, { color: '#D97706' }]}>{stats.pending}</Text>
                        <Text style={styles.statLabel}>In Progress</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
                        <CheckCircle size={22} color="#059669" />
                        <Text style={[styles.statNumber, { color: '#059669' }]}>{stats.accepted}</Text>
                        <Text style={styles.statLabel}>Accepted</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
                        <AlertCircle size={22} color="#DC2626" />
                        <Text style={[styles.statNumber, { color: '#DC2626' }]}>{stats.needsAction}</Text>
                        <Text style={styles.statLabel}>Action Needed</Text>
                    </View>
                </MotiView>

                {/* AI Advisor Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 150 }}
                    style={styles.aiCard}
                >
                    <Pressable
                        style={styles.aiContent}
                        onPress={() => router.push('/chat')}
                    >
                        <LinearGradient
                            colors={['#7C3AED', '#6D28D9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.aiGradient}
                        >
                            <View style={styles.aiIconContainer}>
                                <Sparkles size={24} color="#FFF" />
                            </View>
                            <View style={styles.aiTextContainer}>
                                <Text style={styles.aiTitle}>AI Study Advisor</Text>
                                <Text style={styles.aiSubtitle}>Get personalized guidance instantly</Text>
                            </View>
                            <View style={styles.aiButton}>
                                <Text style={styles.aiButtonText}>Chat</Text>
                                <ChevronRight size={16} color="#7C3AED" />
                            </View>
                        </LinearGradient>
                    </Pressable>
                </MotiView>

                {/* Quick Actions */}
                {stats.needsAction > 0 && (
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 200 }}
                        style={styles.alertCard}
                    >
                        <AlertCircle size={22} color="#DC2626" />
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>{stats.needsAction} Application(s) Need Action</Text>
                            <Text style={styles.alertSubtext}>Complete required documents or payments</Text>
                        </View>
                        <ChevronRight size={20} color="#DC2626" />
                    </MotiView>
                )}

                {/* Applications List */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 300 }}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Applications</Text>
                        <Text style={styles.sectionCount}>{applications.length}</Text>
                    </View>

                    {appsLoading ? (
                        <View style={styles.loadingApps}>
                            <ActivityIndicator size="small" color="#C62828" />
                            <Text style={styles.loadingText}>Loading applications...</Text>
                        </View>
                    ) : applications.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FileText size={48} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No applications yet</Text>
                            <Text style={styles.emptySubtext}>Start exploring programs to apply</Text>
                            <Pressable style={styles.exploreBtn} onPress={() => router.push('/(tabs)/explore')}>
                                <Text style={styles.exploreBtnText}>Explore Programs</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.applicationsList}>
                            {applications.map((app: any, index: number) => {
                                const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <MotiView
                                        key={app.id}
                                        from={{ opacity: 0, translateX: -20 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        transition={{ type: 'spring', delay: 350 + index * 50 }}
                                    >
                                        <Pressable
                                            style={[
                                                styles.applicationCard,
                                                app.status === 'pending_documents' || app.status === 'pending_payment'
                                                    ? styles.applicationCardAction
                                                    : null
                                            ]}
                                            onPress={() => router.push(`/application/${app.id}`)}
                                        >
                                            {/* University Logo */}
                                            <View style={styles.appLogo}>
                                                {app.university_logo ? (
                                                    <Image source={{ uri: app.university_logo }} style={styles.appLogoImage} />
                                                ) : (
                                                    <Building2 size={24} color="#9CA3AF" />
                                                )}
                                            </View>

                                            {/* App Info */}
                                            <View style={styles.appInfo}>
                                                <Text style={styles.appProgram} numberOfLines={1}>
                                                    {app.program_title || 'Program'}
                                                </Text>
                                                <Text style={styles.appUniversity} numberOfLines={1}>
                                                    {app.university_name || 'University'}
                                                </Text>
                                                <View style={styles.appMeta}>
                                                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                                                        <StatusIcon size={12} color={statusConfig.color} />
                                                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                                            {statusConfig.label}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.appDate}>
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>

                                            <ChevronRight size={20} color="#9CA3AF" />
                                        </Pressable>
                                    </MotiView>
                                );
                            })}
                        </View>
                    )}
                </MotiView>

                <View style={{ height: 100 }} />
            </ScrollView>
            <GlobalTabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    header: {
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    welcomeText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 20,
    },
    statCard: {
        width: '47%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'flex-start',
        gap: 8,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 14,
        marginTop: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#991B1B',
    },
    alertSubtext: {
        fontSize: 12,
        color: '#B91C1C',
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 28,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionCount: {
        fontSize: 14,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    loadingApps: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderStyle: 'dashed',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    exploreBtn: {
        marginTop: 20,
        backgroundColor: '#C62828',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    exploreBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    applicationsList: {
        gap: 12,
    },
    applicationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        gap: 14,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    applicationCardAction: {
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    appLogo: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    appLogoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    appInfo: {
        flex: 1,
    },
    appProgram: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    appUniversity: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    appMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    appDate: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    // Guest styles
    guestContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    guestTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 20,
    },
    guestSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 8,
    },
    signInBtn: {
        marginTop: 24,
        backgroundColor: '#C62828',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 14,
    },
    signInBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    aiCard: {
        marginTop: 20,
        marginBottom: 8,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#7C3AED',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    aiContent: {
        width: '100%',
    },
    aiGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    aiIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiTextContainer: {
        flex: 1,
    },
    aiTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    aiSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    aiButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 4,
    },
    aiButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#7C3AED',
    },
});
