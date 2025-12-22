import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, Home, Heart, Wallet, Award, MapPin, GraduationCap, X, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalTabBar from '../../components/GlobalTabBar';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedText as Text } from '../../components/ThemedText';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

interface Scholarship {
    id: string;
    university_id: string;
    university_name: string;
    university_slug: string;
    university_city: string;
    university_logo: string | null;
    type_name: string;
    tuition_coverage_percentage: number;
    service_fee_usd: number;
    includes_accommodation: boolean;
    includes_stipend: boolean;
    stipend_amount_monthly: number | null;
    includes_medical_insurance: boolean;
}

interface UniversityGroup {
    university_id: string;
    university_name: string;
    university_slug: string;
    university_city: string;
    university_logo: string | null;
    scholarships: Scholarship[];
    hasAccommodation: boolean;
    hasMedicalInsurance: boolean;
    hasStipend: boolean;
    maxCoverage: number;
    scholarshipCount: number;
}

export default function ScholarshipFilterScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        hasAccommodation: false,
        hasMedicalInsurance: false,
        hasStipend: false,
        coverage100: false,
        coverage75: false,
        coverage50: false,
    });

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('university_scholarships')
                .select(`
                    id,
                    university_id,
                    type_name,
                    tuition_coverage_percentage,
                    service_fee_usd,
                    includes_accommodation,
                    includes_stipend,
                    stipend_amount_monthly,
                    includes_medical_insurance,
                    universities!inner (
                        name,
                        slug,
                        city,
                        logo_url
                    )
                `)
                .eq('is_active', true)
                .order('tuition_coverage_percentage', { ascending: false });

            if (error) throw error;

            // Transform data
            const formattedScholarships = data?.map((s: any) => {
                const uni = Array.isArray(s.universities) ? s.universities[0] : s.universities;
                return {
                    id: s.id,
                    university_id: s.university_id,
                    university_name: uni?.name || 'Unknown University',
                    university_slug: uni?.slug || '',
                    university_city: uni?.city || '',
                    university_logo: uni?.logo_url || null,
                    type_name: s.type_name,
                    tuition_coverage_percentage: s.tuition_coverage_percentage || 0,
                    service_fee_usd: s.service_fee_usd || 0,
                    includes_accommodation: s.includes_accommodation || false,
                    includes_stipend: s.includes_stipend || false,
                    stipend_amount_monthly: s.stipend_amount_monthly,
                    includes_medical_insurance: s.includes_medical_insurance || false,
                };
            }) || [];

            setScholarships(formattedScholarships);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group scholarships by university
    const universityGroups = useMemo(() => {
        const groups: Record<string, UniversityGroup> = {};

        scholarships.forEach((s) => {
            if (!groups[s.university_id]) {
                groups[s.university_id] = {
                    university_id: s.university_id,
                    university_name: s.university_name,
                    university_slug: s.university_slug,
                    university_city: s.university_city,
                    university_logo: s.university_logo,
                    scholarships: [],
                    hasAccommodation: false,
                    hasMedicalInsurance: false,
                    hasStipend: false,
                    maxCoverage: 0,
                    scholarshipCount: 0,
                };
            }

            groups[s.university_id].scholarships.push(s);
            groups[s.university_id].scholarshipCount++;

            if (s.includes_accommodation) groups[s.university_id].hasAccommodation = true;
            if (s.includes_medical_insurance) groups[s.university_id].hasMedicalInsurance = true;
            if (s.includes_stipend) groups[s.university_id].hasStipend = true;
            if (s.tuition_coverage_percentage > groups[s.university_id].maxCoverage) {
                groups[s.university_id].maxCoverage = s.tuition_coverage_percentage;
            }
        });

        return Object.values(groups);
    }, [scholarships]);

    // Filter universities based on selected criteria
    const filteredUniversities = useMemo(() => {
        return universityGroups.filter((uni) => {
            if (filters.hasAccommodation && !uni.hasAccommodation) return false;
            if (filters.hasMedicalInsurance && !uni.hasMedicalInsurance) return false;
            if (filters.hasStipend && !uni.hasStipend) return false;

            const coverageFiltersActive = filters.coverage100 || filters.coverage75 || filters.coverage50;
            if (coverageFiltersActive) {
                const matchesCoverage =
                    (filters.coverage100 && uni.maxCoverage >= 100) ||
                    (filters.coverage75 && uni.maxCoverage >= 75) ||
                    (filters.coverage50 && uni.maxCoverage >= 50);
                if (!matchesCoverage) return false;
            }

            return true;
        });
    }, [universityGroups, filters]);

    const clearFilters = () => {
        setFilters({
            hasAccommodation: false,
            hasMedicalInsurance: false,
            hasStipend: false,
            coverage100: false,
            coverage75: false,
            coverage50: false,
        });
    };

    const toggleFilter = (key: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <Loader />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: theme.card }]}>
                <View style={styles.headerRow}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={24} color={theme.text} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        {t('scholarshipFilter.title')}
                    </Text>
                    <Pressable
                        style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} color={activeFilterCount > 0 ? '#FFF' : theme.text} />
                        {activeFilterCount > 0 && (
                            <Text style={styles.filterCount}>{activeFilterCount}</Text>
                        )}
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Filter Panel */}
            {showFilters && (
                <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={[styles.filterPanel, { backgroundColor: theme.card }]}
                >
                    <View style={styles.filterSection}>
                        <Text style={[styles.filterSectionTitle, { color: theme.textSecondary }]}>
                            {t('scholarshipFilter.benefits')}
                        </Text>
                        <View style={styles.filterOptions}>
                            <Pressable
                                style={[styles.filterChip, filters.hasAccommodation && styles.filterChipActive]}
                                onPress={() => toggleFilter('hasAccommodation')}
                            >
                                <Home size={16} color={filters.hasAccommodation ? '#FFF' : '#3B82F6'} />
                                <Text style={[styles.filterChipText, filters.hasAccommodation && styles.filterChipTextActive]}>
                                    {t('scholarshipFilter.freeAccommodation')}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.filterChip, filters.hasMedicalInsurance && styles.filterChipActive]}
                                onPress={() => toggleFilter('hasMedicalInsurance')}
                            >
                                <Heart size={16} color={filters.hasMedicalInsurance ? '#FFF' : '#EF4444'} />
                                <Text style={[styles.filterChipText, filters.hasMedicalInsurance && styles.filterChipTextActive]}>
                                    {t('scholarshipFilter.medicalInsurance')}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.filterChip, filters.hasStipend && styles.filterChipActive]}
                                onPress={() => toggleFilter('hasStipend')}
                            >
                                <Wallet size={16} color={filters.hasStipend ? '#FFF' : '#10B981'} />
                                <Text style={[styles.filterChipText, filters.hasStipend && styles.filterChipTextActive]}>
                                    {t('scholarshipFilter.monthlySalary')}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={[styles.filterSectionTitle, { color: theme.textSecondary }]}>
                            {t('scholarshipFilter.tuitionCoverage')}
                        </Text>
                        <View style={styles.filterOptions}>
                            <Pressable
                                style={[styles.filterChip, filters.coverage100 && styles.filterChipActive]}
                                onPress={() => toggleFilter('coverage100')}
                            >
                                <Text style={[styles.filterChipText, filters.coverage100 && styles.filterChipTextActive]}>
                                    100%
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.filterChip, filters.coverage75 && styles.filterChipActive]}
                                onPress={() => toggleFilter('coverage75')}
                            >
                                <Text style={[styles.filterChipText, filters.coverage75 && styles.filterChipTextActive]}>
                                    75%+
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.filterChip, filters.coverage50 && styles.filterChipActive]}
                                onPress={() => toggleFilter('coverage50')}
                            >
                                <Text style={[styles.filterChipText, filters.coverage50 && styles.filterChipTextActive]}>
                                    50%+
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {activeFilterCount > 0 && (
                        <Pressable style={styles.clearButton} onPress={clearFilters}>
                            <X size={16} color="#EF4444" />
                            <Text style={styles.clearButtonText}>{t('scholarshipFilter.clearAll')}</Text>
                        </Pressable>
                    )}
                </MotiView>
            )}

            {/* Results Count */}
            <View style={[styles.resultsBar, { backgroundColor: theme.backgroundSecondary }]}>
                <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
                    {t('scholarshipFilter.showingUniversities', { count: filteredUniversities.length })}
                </Text>
            </View>

            {/* University List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filteredUniversities.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Award size={64} color={theme.textMuted} style={{ opacity: 0.3 }} />
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            {t('scholarshipFilter.noResults')}
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                            {t('scholarshipFilter.tryAdjusting')}
                        </Text>
                        <Pressable style={styles.emptyButton} onPress={clearFilters}>
                            <Text style={styles.emptyButtonText}>{t('scholarshipFilter.clearAll')}</Text>
                        </Pressable>
                    </View>
                ) : (
                    filteredUniversities.map((uni, index) => (
                        <MotiView
                            key={uni.university_id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'spring', delay: index * 50 }}
                        >
                            <Pressable
                                style={[styles.universityCard, { backgroundColor: theme.card }]}
                                onPress={() => router.push(`/university/${uni.university_slug}`)}
                            >
                                {/* Header with Logo */}
                                <LinearGradient
                                    colors={[theme.primary + '20', theme.primary + '10']}
                                    style={styles.cardHeader}
                                >
                                    <View style={styles.cardHeaderContent}>
                                        {uni.university_logo ? (
                                            <Image
                                                source={{ uri: uni.university_logo }}
                                                style={styles.universityLogo}
                                                contentFit="cover"
                                            />
                                        ) : (
                                            <View style={[styles.logoPlaceholder, { backgroundColor: theme.primary + '30' }]}>
                                                <GraduationCap size={24} color={theme.primary} />
                                            </View>
                                        )}
                                        <View style={styles.universityInfo}>
                                            <Text style={[styles.universityName, { color: theme.text }]} numberOfLines={2}>
                                                {uni.university_name}
                                            </Text>
                                            {uni.university_city && (
                                                <View style={styles.locationRow}>
                                                    <MapPin size={12} color={theme.textSecondary} />
                                                    <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                                                        {uni.university_city}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </LinearGradient>

                                {/* Coverage Badge */}
                                <View style={styles.coverageBadge}>
                                    <Text style={[styles.coverageValue, { color: theme.primary }]}>
                                        {t('scholarshipFilter.upTo')} {uni.maxCoverage}%
                                    </Text>
                                    <Text style={[styles.coverageLabel, { color: theme.textSecondary }]}>
                                        {t('scholarshipFilter.tuitionCoverage')}
                                    </Text>
                                </View>

                                {/* Benefits */}
                                <View style={styles.benefitsSection}>
                                    <Text style={[styles.benefitsLabel, { color: theme.textSecondary }]}>
                                        {t('scholarshipFilter.benefitsAvailable')}:
                                    </Text>
                                    <View style={styles.benefitsList}>
                                        {uni.hasAccommodation && (
                                            <View style={[styles.benefitBadge, { backgroundColor: '#DBEAFE' }]}>
                                                <Home size={12} color="#3B82F6" />
                                                <Text style={[styles.benefitText, { color: '#3B82F6' }]}>
                                                    {t('scholarshipFilter.accommodation')}
                                                </Text>
                                            </View>
                                        )}
                                        {uni.hasMedicalInsurance && (
                                            <View style={[styles.benefitBadge, { backgroundColor: '#FEE2E2' }]}>
                                                <Heart size={12} color="#EF4444" />
                                                <Text style={[styles.benefitText, { color: '#EF4444' }]}>
                                                    {t('scholarshipFilter.insurance')}
                                                </Text>
                                            </View>
                                        )}
                                        {uni.hasStipend && (
                                            <View style={[styles.benefitBadge, { backgroundColor: '#D1FAE5' }]}>
                                                <Wallet size={12} color="#10B981" />
                                                <Text style={[styles.benefitText, { color: '#10B981' }]}>
                                                    {t('scholarshipFilter.salary')}
                                                </Text>
                                            </View>
                                        )}
                                        {!uni.hasAccommodation && !uni.hasMedicalInsurance && !uni.hasStipend && (
                                            <View style={[styles.benefitBadge, { backgroundColor: theme.backgroundSecondary }]}>
                                                <Text style={[styles.benefitText, { color: theme.textSecondary }]}>
                                                    {t('scholarshipFilter.tuitionOnly')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Scholarship Types */}
                                <View style={styles.typesSection}>
                                    <Text style={[styles.typesLabel, { color: theme.textSecondary }]}>
                                        {uni.scholarshipCount} {t('scholarshipFilter.scholarshipTypes')}
                                    </Text>
                                    <View style={styles.typesList}>
                                        {uni.scholarships.slice(0, 3).map((s) => (
                                            <View key={s.id} style={[styles.typeBadge, { borderColor: theme.border }]}>
                                                <Text style={[styles.typeText, { color: theme.text }]}>
                                                    {s.type_name} ({s.tuition_coverage_percentage}%)
                                                </Text>
                                            </View>
                                        ))}
                                        {uni.scholarships.length > 3 && (
                                            <View style={[styles.typeBadge, { borderColor: theme.border }]}>
                                                <Text style={[styles.typeText, { color: theme.textSecondary }]}>
                                                    +{uni.scholarships.length - 3}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* View Button */}
                                <Pressable style={[styles.viewButton, { backgroundColor: theme.primary }]}>
                                    <Check size={16} color="#FFF" />
                                    <Text style={styles.viewButtonText}>
                                        {t('scholarshipFilter.viewUniversity')}
                                    </Text>
                                </Pressable>
                            </Pressable>
                        </MotiView>
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            <GlobalTabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    filterButtonActive: {
        backgroundColor: '#C62828',
    },
    filterCount: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 2,
    },
    filterPanel: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    filterSection: {
        marginBottom: 16,
    },
    filterSectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    filterChipActive: {
        backgroundColor: '#C62828',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    filterChipTextActive: {
        color: '#FFF',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#EF4444',
    },
    resultsBar: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    resultsText: {
        fontSize: 13,
        fontWeight: '500',
    },
    scrollContent: {
        padding: 16,
    },
    universityCard: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        padding: 16,
    },
    cardHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    universityLogo: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    universityInfo: {
        flex: 1,
    },
    universityName: {
        fontSize: 15,
        fontWeight: '700',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    locationText: {
        fontSize: 12,
    },
    coverageBadge: {
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    coverageValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    coverageLabel: {
        fontSize: 11,
        marginTop: 2,
    },
    benefitsSection: {
        paddingHorizontal: 16,
        marginTop: 12,
    },
    benefitsLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 8,
    },
    benefitsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    benefitBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    benefitText: {
        fontSize: 11,
        fontWeight: '500',
    },
    typesSection: {
        paddingHorizontal: 16,
        marginTop: 12,
    },
    typesLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 8,
    },
    typesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    typeText: {
        fontSize: 11,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginVertical: 16,
        paddingVertical: 12,
        borderRadius: 10,
    },
    viewButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
    },
    emptyButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#C62828',
    },
    emptyButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
