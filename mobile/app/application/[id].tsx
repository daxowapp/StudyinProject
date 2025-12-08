import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, ActivityIndicator, RefreshControl, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft, Building2, GraduationCap, Clock, Calendar,
    CheckCircle, AlertCircle, FileText, CreditCard, Mail,
    ChevronRight, Upload, ExternalLink
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useData';

// Status configurations
const STATUS_CONFIG: Record<string, { color: string; bgColor: string; borderColor: string; icon: any; label: string }> = {
    pending: { color: '#D97706', bgColor: '#FEF3C7', borderColor: '#F59E0B', icon: Clock, label: 'Pending' },
    submitted: { color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#3B82F6', icon: FileText, label: 'Submitted' },
    under_review: { color: '#7C3AED', bgColor: '#EDE9FE', borderColor: '#8B5CF6', icon: Clock, label: 'Under Review' },
    pending_documents: { color: '#EA580C', bgColor: '#FFEDD5', borderColor: '#F97316', icon: FileText, label: 'Documents Required' },
    pending_payment: { color: '#DC2626', bgColor: '#FEE2E2', borderColor: '#EF4444', icon: CreditCard, label: 'Payment Required' },
    accepted: { color: '#059669', bgColor: '#D1FAE5', borderColor: '#10B981', icon: CheckCircle, label: 'Accepted' },
    rejected: { color: '#DC2626', bgColor: '#FEE2E2', borderColor: '#EF4444', icon: AlertCircle, label: 'Rejected' },
};

export default function ApplicationDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user, loading: authLoading } = useAuth();

    const [application, setApplication] = useState<any>(null);
    const [paymentTransactions, setPaymentTransactions] = useState<any[]>([]);
    const [documentRequests, setDocumentRequests] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchApplicationData = async () => {
        if (!id || !user) return;

        try {
            // Fetch application with program and university info
            const { data: appData, error: appError } = await supabase
                .from('applications')
                .select(`
                    *,
                    university_program:university_program_id (
                        id,
                        tuition_fee,
                        duration,
                        program_catalog:program_catalog_id (
                            title,
                            level,
                            description
                        ),
                        university:university_id (
                            name,
                            logo_url
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (appError) throw appError;
            setApplication(appData);

            // Fetch payment transactions
            const { data: payments } = await supabase
                .from('payment_transactions')
                .select('*')
                .eq('application_id', id)
                .order('created_at', { ascending: false });
            setPaymentTransactions(payments || []);

            // Fetch document requests
            const { data: docs } = await supabase
                .from('document_requests')
                .select('*')
                .eq('application_id', id)
                .order('created_at', { ascending: false });
            setDocumentRequests(docs || []);

            // Fetch messages
            const { data: msgs } = await supabase
                .from('application_messages')
                .select('id, subject, created_at, is_read, sender_type')
                .eq('application_id', id)
                .order('created_at', { ascending: false })
                .limit(5);
            setMessages(msgs || []);

        } catch (error) {
            console.error('Error fetching application:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && id) {
            fetchApplicationData();
        }
    }, [user, id]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchApplicationData();
        setRefreshing(false);
    };

    if (authLoading || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C62828" />
                <Text style={styles.loadingText}>Loading application...</Text>
            </View>
        );
    }

    if (!user) {
        router.replace('/(auth)/login');
        return null;
    }

    if (!application) {
        return (
            <View style={styles.errorContainer}>
                <AlertCircle size={48} color="#DC2626" />
                <Text style={styles.errorText}>Application not found</Text>
                <Pressable style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const unreadMessages = messages.filter(m => !m.is_read && m.sender_type === 'admin').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
                            <ArrowLeft size={22} color="#FFF" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Application Details</Text>
                        <Pressable style={styles.headerBtn} onPress={() => router.push('/messages')}>
                            <Mail size={22} color="#FFF" />
                            {unreadMessages > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadMessages}</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C62828" />}
            >
                {/* Application Overview Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.overviewCard}
                >
                    <View style={styles.overviewHeader}>
                        {application.university_program?.university?.logo_url ? (
                            <Image
                                source={{ uri: application.university_program.university.logo_url }}
                                style={styles.universityLogo}
                            />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Building2 size={28} color="#9CA3AF" />
                            </View>
                        )}
                        <View style={styles.overviewInfo}>
                            <Text style={styles.programName}>
                                {application.university_program?.program_catalog?.title || 'Program'}
                            </Text>
                            <Text style={styles.universityName}>
                                {application.university_program?.university?.name || 'University'}
                            </Text>
                        </View>
                    </View>

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor }]}>
                        <StatusIcon size={16} color={statusConfig.color} />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                    </View>

                    {/* Quick Info */}
                    <View style={styles.quickInfo}>
                        <View style={styles.quickInfoItem}>
                            <GraduationCap size={16} color="#6B7280" />
                            <Text style={styles.quickInfoText}>
                                {application.university_program?.program_catalog?.level || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.quickInfoItem}>
                            <Clock size={16} color="#6B7280" />
                            <Text style={styles.quickInfoText}>
                                {application.university_program?.duration || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.quickInfoItem}>
                            <Calendar size={16} color="#6B7280" />
                            <Text style={styles.quickInfoText}>
                                {new Date(application.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </MotiView>

                {/* Quick Stats */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 150 }}
                    style={styles.statsRow}
                >
                    <View style={[styles.miniStat, { backgroundColor: '#DBEAFE' }]}>
                        <Mail size={20} color="#2563EB" />
                        <Text style={[styles.miniStatNumber, { color: '#2563EB' }]}>{messages.length}</Text>
                        <Text style={styles.miniStatLabel}>Messages</Text>
                    </View>
                    <View style={[styles.miniStat, { backgroundColor: '#FFEDD5' }]}>
                        <FileText size={20} color="#EA580C" />
                        <Text style={[styles.miniStatNumber, { color: '#EA580C' }]}>{documentRequests.length}</Text>
                        <Text style={styles.miniStatLabel}>Documents</Text>
                    </View>
                    <View style={[styles.miniStat, { backgroundColor: '#FEF3C7' }]}>
                        <CreditCard size={20} color="#D97706" />
                        <Text style={[styles.miniStatNumber, { color: '#D97706' }]}>{paymentTransactions.length}</Text>
                        <Text style={styles.miniStatLabel}>Payments</Text>
                    </View>
                </MotiView>

                {/* Pending Payments */}
                {paymentTransactions.filter(p => p.status === 'pending').length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 200 }}
                        style={styles.section}
                    >
                        <View style={styles.sectionHeader}>
                            <CreditCard size={18} color="#D97706" />
                            <Text style={styles.sectionTitle}>Pending Payments</Text>
                        </View>
                        {paymentTransactions.filter(p => p.status === 'pending').map((payment, index) => (
                            <View key={payment.id} style={styles.paymentCard}>
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.paymentType}>{payment.payment_type || 'Payment'}</Text>
                                    <Text style={styles.paymentAmount}>
                                        {payment.amount} {payment.currency}
                                    </Text>
                                    {payment.notes && (
                                        <Text style={styles.paymentNotes}>{payment.notes}</Text>
                                    )}
                                </View>
                                <View style={styles.paymentActions}>
                                    <Pressable
                                        style={styles.payNowBtn}
                                        onPress={() => {
                                            if (payment.payment_link) {
                                                Linking.openURL(payment.payment_link);
                                            } else {
                                                // Fallback to website dashboard for payment
                                                Linking.openURL(`https://studyatchina.com/en/dashboard/applications/${id}`);
                                                Alert.alert('Payment', 'Redirecting to website to complete secure card payment.');
                                            }
                                        }}
                                    >
                                        <CreditCard size={14} color="#FFF" />
                                        <Text style={styles.payNowText}>Pay by Card</Text>
                                    </Pressable>

                                    <Pressable
                                        style={styles.uploadReceiptBtn}
                                        onPress={() => Alert.alert(
                                            'Upload Receipt',
                                            'Please send your payment receipt to support@studyatchina.com or contact us via WhatsApp.',
                                            [{ text: 'OK' }]
                                        )}
                                    >
                                        <Upload size={14} color="#D97706" />
                                        <Text style={styles.uploadReceiptText}>Upload Receipt</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </MotiView>
                )}

                {/* Document Requests */}
                {documentRequests.filter(d => d.status !== 'approved').length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 250 }}
                        style={styles.section}
                    >
                        <View style={styles.sectionHeader}>
                            <FileText size={18} color="#EA580C" />
                            <Text style={styles.sectionTitle}>Document Requests</Text>
                        </View>
                        {documentRequests.filter(d => d.status !== 'approved').map((doc, index) => (
                            <View key={doc.id} style={styles.documentCard}>
                                <View style={styles.documentInfo}>
                                    <Text style={styles.documentName}>{doc.document_type || 'Document'}</Text>
                                    <Text style={styles.documentNote}>{doc.notes || 'Please upload this document'}</Text>
                                </View>
                                <Pressable style={styles.uploadBtn}>
                                    <Upload size={16} color="#EA580C" />
                                </Pressable>
                            </View>
                        ))}
                    </MotiView>
                )}

                {/* Application Info */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 300 }}
                    style={styles.section}
                >
                    <View style={styles.sectionHeader}>
                        <FileText size={18} color="#374151" />
                        <Text style={styles.sectionTitle}>Application Information</Text>
                    </View>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Application ID</Text>
                            <Text style={styles.infoValue}>{application.id.slice(0, 8)}...</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <Text style={[styles.infoValue, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Student Name</Text>
                            <Text style={styles.infoValue}>{application.student_name || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{application.student_email || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Submitted</Text>
                            <Text style={styles.infoValue}>
                                {new Date(application.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Last Updated</Text>
                            <Text style={styles.infoValue}>
                                {new Date(application.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </Text>
                        </View>
                    </View>

                    {application.admin_notes && (
                        <View style={styles.adminNotes}>
                            <AlertCircle size={16} color="#2563EB" />
                            <View style={styles.adminNotesContent}>
                                <Text style={styles.adminNotesLabel}>Admin Notes</Text>
                                <Text style={styles.adminNotesText}>{application.admin_notes}</Text>
                            </View>
                        </View>
                    )}
                </MotiView>

                {/* Recent Messages */}
                {messages.length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 350 }}
                        style={styles.section}
                    >
                        <View style={styles.sectionHeaderRow}>
                            <View style={styles.sectionHeader}>
                                <Mail size={18} color="#374151" />
                                <Text style={styles.sectionTitle}>Recent Messages</Text>
                            </View>
                            <Pressable onPress={() => router.push('/messages')}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </Pressable>
                        </View>
                        {messages.slice(0, 3).map((msg, index) => (
                            <View key={msg.id} style={styles.messageItem}>
                                <View style={[
                                    styles.messageDot,
                                    { backgroundColor: !msg.is_read && msg.sender_type === 'admin' ? '#2563EB' : '#D1D5DB' }
                                ]} />
                                <View style={styles.messageContent}>
                                    <Text style={styles.messageSubject}>{msg.subject}</Text>
                                    <Text style={styles.messageDate}>
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                                {!msg.is_read && msg.sender_type === 'admin' && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>New</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </MotiView>
                )}

                {/* All Caught Up */}
                {paymentTransactions.filter(p => p.status === 'pending').length === 0 &&
                    documentRequests.filter(d => d.status !== 'approved').length === 0 && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', delay: 400 }}
                            style={styles.allCaughtUp}
                        >
                            <CheckCircle size={40} color="#059669" />
                            <Text style={styles.allCaughtUpTitle}>All Caught Up!</Text>
                            <Text style={styles.allCaughtUpText}>
                                You have no pending actions. We'll notify you if anything is needed.
                            </Text>
                        </MotiView>
                    )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
    loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', padding: 24 },
    errorText: { marginTop: 12, fontSize: 16, color: '#DC2626', fontWeight: '600' },
    backBtn: { marginTop: 16, backgroundColor: '#C62828', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    backBtnText: { fontSize: 14, color: '#FFF', fontWeight: '600' },
    header: { paddingBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
    headerBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFF', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
    badgeText: { fontSize: 11, fontWeight: '700', color: '#C62828' },
    content: { flex: 1, padding: 16 },
    overviewCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
    overviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    universityLogo: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#F9FAFB' },
    logoPlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
    overviewInfo: { flex: 1 },
    programName: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
    universityName: { fontSize: 14, color: '#6B7280' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    statusText: { fontSize: 13, fontWeight: '600' },
    quickInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    quickInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    quickInfoText: { fontSize: 13, color: '#6B7280' },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    miniStat: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12 },
    miniStatNumber: { fontSize: 20, fontWeight: '700', marginTop: 4 },
    miniStatLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
    section: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    viewAllText: { fontSize: 13, color: '#C62828', fontWeight: '600' },
    paymentCard: { padding: 14, backgroundColor: '#FEF3C7', borderRadius: 12, marginBottom: 10 },
    paymentInfo: { flex: 1 },
    paymentType: { fontSize: 14, fontWeight: '600', color: '#92400E' },
    paymentAmount: { fontSize: 16, fontWeight: '700', color: '#D97706', marginTop: 2 },
    payNowBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#C62828', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    payNowText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
    documentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#FFEDD5', borderRadius: 12, marginBottom: 8 },
    documentInfo: { flex: 1 },
    documentName: { fontSize: 14, fontWeight: '600', color: '#9A3412' },
    documentNote: { fontSize: 12, color: '#C2410C', marginTop: 2 },
    uploadBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    infoItem: { width: '45%' },
    infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#374151' },
    adminNotes: { flexDirection: 'row', gap: 10, marginTop: 16, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
    adminNotesContent: { flex: 1 },
    adminNotesLabel: { fontSize: 12, fontWeight: '600', color: '#1E40AF', marginBottom: 4 },
    adminNotesText: { fontSize: 13, color: '#1E3A8A' },
    messageItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F9FAFB', borderRadius: 10, marginBottom: 8 },
    messageDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
    messageContent: { flex: 1 },
    messageSubject: { fontSize: 14, fontWeight: '500', color: '#374151' },
    messageDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    newBadge: { backgroundColor: '#2563EB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    newBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
    allCaughtUp: { alignItems: 'center', padding: 24, backgroundColor: '#D1FAE5', borderRadius: 16, marginBottom: 16 },
    allCaughtUpTitle: { fontSize: 18, fontWeight: '700', color: '#065F46', marginTop: 12 },
    allCaughtUpText: { fontSize: 13, color: '#047857', textAlign: 'center', marginTop: 6 },
    paymentNotes: { fontSize: 12, color: '#B45309', marginTop: 4 },
    paymentActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
    uploadReceiptBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#D97706', flex: 1 },
    uploadReceiptText: { fontSize: 13, fontWeight: '600', color: '#D97706' },
});
