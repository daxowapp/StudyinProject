import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useUniversities } from '../../hooks/useData';

const filters = ['All', 'Beijing', 'Shanghai', 'Hangzhou', 'Guangzhou', 'Wuhan'];

export default function ExploreScreen() {
    const router = useRouter();
    const { universities, loading, error } = useUniversities();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUniversities = universities.filter(u => {
        const matchesFilter = activeFilter === 'All' || u.city?.toLowerCase().includes(activeFilter.toLowerCase());
        const matchesSearch = !searchQuery || u.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
                            <Text style={styles.headerTitle}>Explore</Text>
                            <Text style={styles.headerSubtitle}>Find your dream university</Text>
                        </View>
                        <View style={styles.filterIcon}>
                            <Text style={styles.filterIconText}>⚙️</Text>
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
                            placeholder="Search universities..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <Text style={styles.clearButton}>✕</Text>
                            </Pressable>
                        )}
                    </View>
                </MotiView>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersScroll}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {filters.map((filter, index) => (
                        <MotiView
                            key={filter}
                            from={{ opacity: 0, translateX: -10 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ type: 'spring', delay: 200 + index * 50 }}
                        >
                            <Pressable
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter && styles.filterChipActive
                                ]}
                                onPress={() => setActiveFilter(filter)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.filterTextActive
                                ]}>
                                    {filter}
                                </Text>
                            </Pressable>
                        </MotiView>
                    ))}
                </ScrollView>

                {/* Results Info */}
                <View style={styles.resultsInfo}>
                    <Text style={styles.resultsText}>
                        {loading ? 'Loading...' : `${filteredUniversities.length} universities found`}
                    </Text>
                </View>
            </SafeAreaView>

            {/* University List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#DC2626" />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>😔</Text>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    filteredUniversities.map((uni, index) => (
                        <MotiView
                            key={uni.id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'spring', delay: index * 60 }}
                        >
                            <Pressable
                                style={styles.universityCard}
                                onPress={() => router.push(`/university/${uni.slug}`)}
                            >
                                <View style={styles.cardImageContainer}>
                                    {uni.logo_url ? (
                                        <Image source={{ uri: uni.logo_url }} style={styles.cardImage} />
                                    ) : (
                                        <View style={styles.cardImagePlaceholder}>
                                            <Text style={styles.cardPlaceholderText}>🏛️</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.cardContent}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{uni.name}</Text>
                                        {uni.ranking && (
                                            <View style={styles.cardRankBadge}>
                                                <Text style={styles.cardRankText}>#{uni.ranking}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.cardLocation}>
                                        <Text style={styles.cardLocationIcon}>📍</Text>
                                        <Text style={styles.cardLocationText}>{uni.city}</Text>
                                    </View>
                                    <View style={styles.cardFooter}>
                                        <View style={styles.cardTags}>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>Programs</Text>
                                            </View>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>International</Text>
                                            </View>
                                        </View>
                                        <View style={styles.viewButton}>
                                            <Text style={styles.viewButtonText}>View</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </MotiView>
                    ))
                )}
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    safeArea: {
        backgroundColor: '#FCFCFC',
    },
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
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    filterIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    filterIconText: {
        fontSize: 20,
    },
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
    },
    clearButton: {
        fontSize: 18,
        color: '#94A3B8',
        padding: 4,
    },
    filtersScroll: {
        marginBottom: 16,
    },
    filtersContainer: {
        paddingHorizontal: 24,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    filterChipActive: {
        backgroundColor: '#DC2626',
    },
    filterText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    resultsInfo: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    resultsText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    listContainer: {
        paddingHorizontal: 24,
    },
    loadingContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    errorContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 14,
        color: '#DC2626',
        textAlign: 'center',
    },
    universityCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardImageContainer: {
        width: 110,
        backgroundColor: '#F8FAFC',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardImagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardPlaceholderText: {
        fontSize: 36,
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        lineHeight: 22,
        marginRight: 8,
    },
    cardRankBadge: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cardRankText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cardLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLocationIcon: {
        fontSize: 12,
        marginRight: 6,
    },
    cardLocationText: {
        fontSize: 13,
        color: '#64748B',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTags: {
        flexDirection: 'row',
        gap: 6,
    },
    tag: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '500',
    },
    viewButton: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    viewButtonText: {
        fontSize: 13,
        color: '#78350F',
        fontWeight: '700',
    },
});
