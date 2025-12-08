import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Image, FlatList, Dimensions, Text as RNText } from 'react-native';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, MapPin, GraduationCap, Clock, Globe, X } from 'lucide-react-native';
import { Price } from '../../components/currency/Price';
import { useSearchPrograms, ProgramFilters } from '../../hooks/useData';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { FilterModal } from '../../components/programs/FilterModal';
import { useTranslation } from 'react-i18next';
import { ThemedText as Text } from '../../components/ThemedText';

export default function ExploreScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { isRTL } = useLanguage();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<ProgramFilters>({ degree: 'all', field: 'all', language: 'all', city: 'all' });
    const [modalVisible, setModalVisible] = useState(false);

    const degreeFilters = useMemo(() => [
        { label: t('explore.filters.all'), value: 'all' },
        { label: t('explore.filters.bachelor'), value: 'bachelor' },
        { label: t('explore.filters.master'), value: 'master' },
        { label: t('explore.filters.phd'), value: 'phd' },
    ], [t]);

    // Use the search hook with filters
    const { results, loading, totalCount } = useSearchPrograms({
        query: searchQuery,
        ...filters,
    });

    const handleDegreeFilter = (value: string) => {
        setFilters(prev => ({ ...prev, degree: value }));
    };

    const handleApplyFilters = (newFilters: ProgramFilters) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({ degree: 'all', field: 'all', language: 'all', city: 'all' });
        setSearchQuery('');
    };

    const renderProgramCard = useCallback(({ item: program }: { item: any }) => (
        <Pressable
            style={[styles.programCard, { backgroundColor: theme.card }]}
            onPress={() => router.push(`/program/${program.slug}`)}
        >
            {/* University Logo */}
            <View style={[styles.cardLogoContainer, { backgroundColor: isDark ? theme.backgroundSecondary : '#F9FAFB' }]}>
                {program.university_logo ? (
                    <Image
                        source={{ uri: program.university_logo }}
                        style={styles.cardLogo}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={[styles.cardLogoPlaceholder, { backgroundColor: theme.backgroundSecondary }]}>
                        <GraduationCap size={24} color={theme.textMuted} />
                    </View>
                )}
            </View>

            {/* Program Info */}
            <View style={styles.cardContent}>
                <Text style={[styles.programTitle, { color: theme.text }]} numberOfLines={2}>
                    {program.title}
                </Text>
                <Text style={[styles.universityName, { color: theme.textSecondary }]} numberOfLines={1}>
                    {program.university_name}
                </Text>

                {/* Tags Row */}
                <View style={styles.tagsRow}>
                    <View style={[styles.tag,
                    {
                        backgroundColor: isDark ? theme.backgroundSecondary :
                            program.level?.toLowerCase().includes('bachelor') ? '#EFF6FF' :
                                program.level?.toLowerCase().includes('master') ? '#FAF5FF' :
                                    program.level?.toLowerCase().includes('phd') ? '#FEF2F2' : theme.backgroundSecondary
                    }
                    ]}>
                        <GraduationCap size={10} color={
                            program.level?.toLowerCase().includes('bachelor') ? '#2563EB' :
                                program.level?.toLowerCase().includes('master') ? '#9333EA' :
                                    program.level?.toLowerCase().includes('phd') ? '#DC2626' : theme.textSecondary
                        } />
                        <Text style={[styles.tagText, { color: theme.textSecondary }]}>{program.level || t('explore.degree')}</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: isDark ? theme.backgroundSecondary : '#D1FAE5' }]}>
                        <Clock size={10} color="#059669" />
                        <Text style={[styles.tagText, { color: theme.textSecondary }]}>{program.duration || '4'} {t('common.years')}</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: isDark ? theme.backgroundSecondary : '#DBEAFE' }]}>
                        <Globe size={10} color="#2563EB" />
                        <Text style={[styles.tagText, { color: theme.textSecondary }]}>{program.language_name || 'English'}</Text>
                    </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.bottomRow}>
                    <View style={styles.locationRow}>
                        <MapPin size={12} color={theme.primary} />
                        <Text style={[styles.locationText, { color: theme.textSecondary }]}>{program.city}</Text>
                    </View>
                    <View style={[styles.tuitionBadge, { backgroundColor: isDark ? theme.backgroundSecondary : '#FEE2E2' }]}>
                        <Price
                            amount={program.tuition_fee || 0}
                            currency="CNY"
                            style={[styles.tuitionText, { color: theme.primary }]}
                            suffix="/yr"
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    ), [router, theme, isDark, t]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background, direction: isRTL ? 'rtl' : 'ltr' }]}>
            {/* Filter Modal */}
            <FilterModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                filters={filters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            {/* Header with Search */}
            <LinearGradient
                colors={isDark ? [theme.gradientStart, theme.gradientEnd] : ['#991B1B', '#B91C1C', '#DC2626']}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>{t('explore.title')}</Text>
                        <Pressable style={styles.filterButton} onPress={() => setModalVisible(true)}>
                            <SlidersHorizontal size={20} color="#FFF" />
                            {(filters.field !== 'all' || filters.language !== 'all' || filters.city !== 'all' || filters.scholarship) && (
                                <View style={styles.activeFilterDot} />
                            )}
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchBar}>
                        <Search size={18} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('explore.searchPlaceholder')}
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <X size={18} color="#9CA3AF" />
                            </Pressable>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Degree Filter Pills */}
            <View style={[styles.filtersWrapper, { backgroundColor: theme.background }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersScroll}
                >
                    {degreeFilters.map((filter) => (
                        <Pressable
                            key={filter.value}
                            style={[
                                styles.filterPill,
                                { backgroundColor: (filters.degree || 'all') === filter.value ? theme.primary : (isDark ? theme.card : '#FFFFFF'), borderColor: (filters.degree || 'all') === filter.value ? theme.primary : theme.border }
                            ]}
                            onPress={() => handleDegreeFilter(filter.value)}
                        >
                            <Text style={[
                                styles.filterPillText,
                                { color: (filters.degree || 'all') === filter.value ? '#FFFFFF' : theme.textSecondary }
                            ]}>
                                {filter.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
                    {loading ? t('explore.searching') : t('explore.resultsFound', { count: totalCount })}
                </Text>
            </View>

            {/* Programs List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Loader size={50} />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t('explore.findingPrograms')}</Text>
                </View>
            ) : results.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <GraduationCap size={48} color={theme.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('explore.noResults')}</Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('explore.noResultsDesc')}</Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderProgramCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingBottom: 20,
        borderBottomStartRadius: 24,
        borderBottomEndRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    filtersWrapper: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    filtersScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterPill: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginEnd: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterPillActive: {
        backgroundColor: '#C62828',
        borderColor: '#C62828',
    },
    filterPillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    filterPillTextActive: {
        color: '#FFFFFF',
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    resultsCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingBottom: 100,
    },
    emptyTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    programCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardLogoContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginEnd: 14,
    },
    cardLogo: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    cardLogoPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
    },
    programTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        lineHeight: 20,
    },
    universityName: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 10,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        color: '#4B5563',
        fontWeight: '500',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: '#6B7280',
    },
    tuitionBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tuitionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#92400E',
    },
    activeFilterDot: {
        position: 'absolute',
        top: 8,
        right: undefined,
        end: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#B91C1C',
    },
});
