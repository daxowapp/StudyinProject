import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, StyleSheet, Pressable, Image, RefreshControl, Dimensions, Text as RNText, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Filter, Star, ChevronDown, Sparkles, Building2, GraduationCap, X, ChevronRight } from 'lucide-react-native';
import { useUniversities } from '../../hooks/useData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Loader from '../../components/Loader';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedText as Text } from '../../components/ThemedText';

export default function UniversitiesScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();
    const { city } = useLocalSearchParams<{ city: string }>();
    const { universities, loading, refetch } = useUniversities();

    // Filter universities if city param is present
    const displayedUniversities = city
        ? universities.filter(u => u.city === city)
        : universities;
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch?.();
        setRefreshing(false);
    }, [refetch]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <LinearGradient colors={isDark ? [theme.gradientStart, theme.gradientEnd] : ['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>{t('university.title')}</Text>
                        <Text style={styles.headerSubtitle}>{t('university.subtitle')}</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Search Bar */}
            <Pressable
                style={[styles.searchBar, { backgroundColor: theme.card }]}
                onPress={() => router.push('/(tabs)/explore')}
            >
                <Search size={20} color={theme.textMuted} />
                <Text style={[styles.searchPlaceholder, { color: theme.textMuted }]}>{t('university.searchPlaceholder')}</Text>
            </Pressable>

            {/* Active Filter Chip */}
            {city && (
                <View style={styles.filterContainer}>
                    <View style={styles.filterChip}>
                        <MapPin size={14} color="#FFF" />
                        <Text style={styles.filterText}>{t('common.city')}: {city}</Text>
                        <Pressable onPress={() => router.setParams({ city: '' })} hitSlop={10}>
                            <X size={14} color="#FFF" />
                        </Pressable>
                    </View>
                </View>
            )}

            {loading && !universities.length ? (
                <View style={styles.loadingContainer}>
                    <Loader />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t('university.loading')}</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                    }
                >
                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={[styles.statItem, { backgroundColor: theme.card }]}>
                            <Text style={[styles.statNumber, { color: theme.primary }]}>{displayedUniversities.length}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('university.count')}</Text>
                        </View>
                    </View>

                    {/* Universities List */}
                    <View style={styles.universitiesList}>
                        {displayedUniversities.map((uni: any, index: number) => (
                            <MotiView
                                key={uni.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'spring', delay: index * 50 }}
                            >
                                <Pressable
                                    style={[styles.universityCard, { backgroundColor: theme.card }]}
                                    onPress={() => router.push(`/university/${uni.slug}`)}
                                >
                                    {/* Cover Image */}
                                    <View style={styles.coverContainer}>
                                        {uni.cover_photo_url ? (
                                            <Image
                                                source={{ uri: uni.cover_photo_url }}
                                                style={styles.coverImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <LinearGradient
                                                colors={['#1E3A5F', '#4A6FA5']}
                                                style={styles.coverImage}
                                            />
                                        )}
                                        <View style={styles.logoOverlay}>
                                            {uni.logo_url ? (
                                                <Image
                                                    source={{ uri: uni.logo_url }}
                                                    style={[styles.logo, { borderColor: theme.card }]}
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <View style={[styles.logoPlaceholder, { backgroundColor: theme.card, borderColor: theme.card }]}>
                                                    <Building2 size={24} color={theme.primary} />
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {/* Info */}
                                    <View style={styles.cardInfo}>
                                        <Text style={[styles.universityName, { color: theme.text }]} numberOfLines={2}>{uni.name}</Text>
                                        <View style={styles.locationRow}>
                                            <MapPin size={14} color={theme.textSecondary} />
                                            <Text style={[styles.locationText, { color: theme.textSecondary }]}>{uni.city}, China</Text>
                                        </View>
                                        <View style={styles.statsRow2}>
                                            <View style={[styles.programsBadge, { backgroundColor: isDark ? theme.backgroundSecondary : '#FEE2E2' }]}>
                                                <GraduationCap size={12} color={theme.primary} />
                                                <Text style={[styles.programsText, { color: theme.primary }]}>{uni.program_count || 0} {t('university.programs')}</Text>
                                            </View>
                                            <ChevronRight size={18} color={theme.textMuted} />
                                        </View>
                                    </View>
                                </Pressable>
                            </MotiView>
                        ))}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
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
        paddingBottom: 16,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        gap: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginTop: -8,
        marginBottom: 16,
        padding: 14,
        borderRadius: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    searchPlaceholder: {
        color: '#9CA3AF',
        fontSize: 15,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginEnd: 8,
        gap: 6,
    },
    filterText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statItem: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#C62828',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    universitiesList: {
        gap: 16,
    },
    universityCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 3,
    },
    coverContainer: {
        height: 100,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    logoOverlay: {
        position: 'absolute',
        bottom: -25,
        start: 16,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    cardInfo: {
        flex: 1,
        gap: 4,
        padding: 16,
        paddingTop: 32,
    },
    universityName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    locationText: {
        fontSize: 13,
        color: '#6B7280',
    },
    statsRow2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    programsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    programsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#C62828',
    },
});
