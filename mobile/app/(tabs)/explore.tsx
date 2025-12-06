import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useUniversities } from '../../hooks/useData';

const filters = ['All', 'Beijing', 'Shanghai', 'Hangzhou', 'Guangzhou'];

export default function ExploreScreen() {
    const router = useRouter();
    const { universities, loading, error } = useUniversities();
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const filteredUniversities = activeFilter === 'All'
        ? universities
        : universities.filter(u => u.city?.toLowerCase().includes(activeFilter.toLowerCase()));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
                <Text style={styles.headerSubtitle}>Find your perfect university</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search universities..."
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                {filters.map((filter) => (
                    <Pressable
                        key={filter}
                        style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                            {filter}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* View Toggle */}
            <View style={styles.viewToggle}>
                <Text style={styles.resultsCount}>
                    {loading ? 'Loading...' : `${filteredUniversities.length} Universities`}
                </Text>
                <View style={styles.toggleButtons}>
                    <Pressable
                        style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
                        onPress={() => setViewMode('list')}
                    >
                        <Text>☰</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
                        onPress={() => setViewMode('grid')}
                    >
                        <Text>▦</Text>
                    </Pressable>
                </View>
            </View>

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DC2626" />
                    <Text style={styles.loadingText}>Loading universities...</Text>
                </View>
            )}

            {/* Error State */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            )}

            {/* University List */}
            {!loading && !error && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredUniversities.map((uni, index) => (
                        <MotiView
                            key={uni.id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'spring', delay: index * 50 }}
                        >
                            <Pressable
                                style={styles.universityCard}
                                onPress={() => router.push(`/university/${uni.slug}`)}
                            >
                                <View style={styles.universityImage}>
                                    <Text style={styles.universityImageText}>🏛️</Text>
                                </View>
                                <View style={styles.universityInfo}>
                                    <View style={styles.universityHeader}>
                                        <Text style={styles.universityName} numberOfLines={1}>{uni.name}</Text>
                                        {uni.ranking && (
                                            <Text style={styles.universityRanking}>#{uni.ranking}</Text>
                                        )}
                                    </View>
                                    <Text style={styles.universityLocation}>📍 {uni.city}{uni.province ? `, ${uni.province}` : ''}</Text>
                                    {uni.total_students && (
                                        <Text style={styles.universityPrograms}>
                                            {uni.total_students.toLocaleString()} Students
                                        </Text>
                                    )}
                                </View>
                            </Pressable>
                        </MotiView>
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
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
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    filtersContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
    },
    filterText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    viewToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    toggleButtons: {
        flexDirection: 'row',
    },
    toggleBtn: {
        padding: 8,
        marginLeft: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    toggleBtnActive: {
        backgroundColor: '#FEE2E2',
        borderColor: '#DC2626',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    loadingText: {
        marginTop: 12,
        color: '#6B7280',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#DC2626',
        textAlign: 'center',
    },
    universityCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    universityImage: {
        width: 70,
        height: 70,
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    universityImageText: {
        fontSize: 28,
    },
    universityInfo: {
        flex: 1,
        marginLeft: 14,
    },
    universityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    universityName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
    },
    universityRanking: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#DC2626',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    universityLocation: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    universityPrograms: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '500',
        marginTop: 4,
    },
});
