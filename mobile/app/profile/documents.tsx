import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Upload, CheckCircle, Clock, AlertCircle, Eye, Trash2 } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useData';

export default function DocumentsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchDocuments();
    }, [user]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('student_documents')
                .select('*')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') { // Ignore table not found
                throw error;
            }

            setDocuments(data || []);
        } catch (error) {
            console.log('Error fetching documents:', error);
            // Fallback for demo if table doesn't exist
            setDocuments([
                { id: '1', title: 'Passport', status: 'verified', type: 'application/pdf', size: '2.4 MB', created_at: new Date().toISOString() },
                { id: '2', title: 'High School Transcript', status: 'pending', type: 'image/jpeg', size: '1.1 MB', created_at: new Date().toISOString() },
                { id: '3', title: 'Language Certificate', status: 'missing', type: null, size: null, created_at: null }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = () => {
        Alert.alert('Upload Document', 'Document upload functionality will be available in the next update.');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return '#059669';
            case 'pending': return '#D97706';
            case 'missing': return '#DC2626';
            default: return '#6B7280';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle size={16} color="#059669" />;
            case 'pending': return <Clock size={16} color="#D97706" />;
            case 'missing': return <AlertCircle size={16} color="#DC2626" />;
            default: return <FileText size={16} color="#6B7280" />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <FileText size={24} color="#6B7280" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.docTitle}>{item.title}</Text>
                {item.status !== 'missing' ? (
                    <Text style={styles.docMeta}>{item.size} • {new Date(item.created_at).toLocaleDateString()}</Text>
                ) : (
                    <Text style={[styles.docMeta, { color: '#DC2626' }]}>Required</Text>
                )}
            </View>
            <View style={styles.actions}>
                <View style={[styles.statusBadge, { borderColor: getStatusColor(item.status) + '40', backgroundColor: getStatusColor(item.status) + '10' }]}>
                    {getStatusIcon(item.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                </View>
                {item.status === 'missing' && (
                    <Pressable style={styles.uploadMiniBtn} onPress={handleUpload}>
                        <Upload size={16} color="#FFF" />
                    </Pressable>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </Pressable>
                    <Text style={styles.headerTitle}>My Documents</Text>
                    <Pressable onPress={handleUpload}>
                        <Upload size={24} color="#C62828" />
                    </Pressable>
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#C62828" />
                </View>
            ) : (
                <FlatList
                    data={documents}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <FileText size={48} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No Documents</Text>
                            <Text style={styles.emptyText}>Upload your required documents here.</Text>
                            <Pressable style={styles.uploadBtn} onPress={handleUpload}>
                                <Text style={styles.uploadBtnText}>Upload Document</Text>
                            </Pressable>
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
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
    },
    docTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    docMeta: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    actions: {
        alignItems: 'flex-end',
        gap: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    uploadMiniBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#C62828',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
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
        marginBottom: 24,
    },
    uploadBtn: {
        backgroundColor: '#C62828',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    uploadBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
