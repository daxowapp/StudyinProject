import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Star, Heart, FileText, Frown } from 'lucide-react-native';
import { useSavedPrograms } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { MotiView } from 'moti';

export default function SavedProgramsScreen() {
    const router = useRouter();
    const { savedIds, count, isSaved, toggleSave, loading: savedLoading } = useSavedPrograms();
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSavedPrograms = async () => {
        if (savedIds.length === 0) {
            setPrograms([]);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('university_programs')
                .select('*, university:universities(*)')
                .in('id', savedIds);

            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching saved programs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSavedPrograms();
    }, [savedIds]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSavedPrograms();
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100 }}
        >
            <Pressable
                style={styles.card}
                onPress={() => router.push(`/program/${item.slug}`)}
            >
                <Image
                    source={{ uri: item.university?.logo_url || 'https://via.placeholder.com/100' }}
                    style={styles.logo}
                />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.programTitle} numberOfLines={2}>{item.title}</Text>
                        <Pressable onPress={() => toggleSave(item.id)}>
                            <Heart size={20} color="#EF4444" fill="#EF4444" />
                        </Pressable>
                    </View>

                    <Text style={styles.universityName} numberOfLines={1}>
                        {item.university?.name}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MapPin size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{item.university?.city}, China</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FileText size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{item.degree_level}</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.tuitionText}>
                            {item.tuition_fee ? `¥${item.tuition_fee.toLocaleString()}/yr` : 'Scholarship'}
                        </Text>
                        <View style={styles.ratingBadge}>
                            <Star size={12} color="#D97706" fill="#D97706" />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </MotiView>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Saved Programs</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#C62828" />
                </View>
            ) : programs.length === 0 ? (
                <View style={styles.emptyState}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <View style={styles.emptyIcon}>
                            <Heart size={48} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>No Saved Programs</Text>
                        <Text style={styles.emptyText}>Programs you save will appear here.</Text>
                        <Pressable
                            style={styles.exploreButton}
                            onPress={() => router.push('/(tabs)/explore')}
                        >
                            <Text style={styles.exploreButtonText}>Explore Programs</Text>
                        </Pressable>
                    </MotiView>
                </View>
            ) : (
                <FlatList
                    data={programs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C62828" />
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
        padding: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 16,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    cardContent: {
        flex: 1,
        gap: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    programTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 8,
    },
    universityName: {
        fontSize: 13,
        color: '#6B7280',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    tuitionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#C62828',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#D97706',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    exploreButton: {
        backgroundColor: '#C62828',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
