import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, DollarSign, ChevronRight, Clock, CheckCircle } from 'lucide-react-native';
import { useUserApplications } from '../../hooks/useData';

export default function PaymentsScreen() {
    const router = useRouter();
    const { applications, loading } = useUserApplications();

    // Filter applications that might have payments
    // In a real app, this would be a separate payments table or field
    const payments = applications.map(app => ({
        id: app.id,
        title: `Application Fee - ${app.program_title || 'Program'}`,
        amount: 150, // Mock amount
        currency: 'USD',
        status: app.status === 'pending_payment' ? 'pending' : 'paid',
        date: app.created_at,
        university: app.university_name
    }));

    const renderItem = ({ item }: { item: any }) => (
        <Pressable style={styles.card} onPress={() => router.push(`/application/${item.id}`)}>
            <View style={[styles.iconContainer, { backgroundColor: item.status === 'pending' ? '#FEE2E2' : '#D1FAE5' }]}>
                {item.status === 'pending' ? (
                    <Clock size={24} color="#DC2626" />
                ) : (
                    <CheckCircle size={24} color="#059669" />
                )}
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.paymentTitle}>{item.title}</Text>
                <Text style={styles.paymentUniversity}>{item.university}</Text>
                <Text style={styles.paymentDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>${item.amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'pending' ? '#FEE2E2' : '#D1FAE5' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'pending' ? '#DC2626' : '#059669' }]}>
                        {item.status === 'pending' ? 'Due' : 'Paid'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Payments & Invoices</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#C62828" />
                </View>
            ) : payments.length === 0 ? (
                <View style={styles.emptyState}>
                    <CreditCard size={48} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>No Payments</Text>
                    <Text style={styles.emptyText}>You don't have any payment history yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={payments}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Due</Text>
                            <Text style={styles.summaryAmount}>
                                ${payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0)}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        gap: 16,
    },
    summaryCard: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 20,
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 4,
    },
    summaryAmount: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '700',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    paymentUniversity: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    paymentDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    amountContainer: {
        alignItems: 'flex-end',
        gap: 6,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
    },
});
