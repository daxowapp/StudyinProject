import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Image, Dimensions, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { ArrowLeft, BookOpen, Users, Star, MapPin, Heart, Award, GraduationCap, Building2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useFavorites } from '../../hooks/useFavorites';
import { useUniversities, useFeaturedPrograms } from '../../hooks/useData';
import Loader from '../../components/Loader';
import { ThemedText } from '../../components/ThemedText';

const { width } = Dimensions.get('window');

type TabType = 'universities' | 'programs';

export default function SavedScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const { favorites, loading: favoritesLoading, toggleFavorite } = useFavorites();
    const { universities, loading: universitiesLoading } = useUniversities();
    const { programs, loading: programsLoading } = useFeaturedPrograms();
    const [activeTab, setActiveTab] = useState<TabType>('universities');
    const [refreshing, setRefreshing] = useState(false);

    const isRTL = i18n.language === 'ar' || i18n.language === 'fa';

    // Filter favs
    const displayedUniversities = universities.filter(u => favorites.some(f => f.item_type === 'university' && f.item_id === u.id));
    const displayedPrograms = programs.filter(p => favorites.some(f => f.item_type === 'program' && f.item_id === p.id));

    const onRefresh = async () => {
        setRefreshing(true);
        // In a real app we might refetch favorites here
        setTimeout(() => setRefreshing(false), 1000);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            paddingTop: 60,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: theme.card,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#333' : '#E5E7EB',
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 4,
            textAlign: isRTL ? 'right' : 'left',
        },
        headerSubtitle: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
        },
        tabs: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            padding: 16,
            gap: 12,
        },
        tab: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
        },
        activeTab: {
            backgroundColor: '#C62828',
            borderColor: '#C62828',
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.textSecondary,
        },
        activeTabText: {
            color: '#FFF',
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 100,
        },
        emptyState: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 100,
            gap: 16,
        },
        emptyText: {
            fontSize: 16,
            color: theme.textSecondary,
            textAlign: 'center',
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: 16,
            marginBottom: 16,
            overflow: 'hidden',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderWidth: 1,
            borderColor: isDark ? '#333' : '#F3F4F6',
        },
        cardImage: {
            width: '100%',
            height: 150,
            backgroundColor: '#EEE',
        },
        cardContent: {
            padding: 16,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 8,
            textAlign: isRTL ? 'right' : 'left',
        },
        cardLocation: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 12,
        },
        cardLocationText: {
            fontSize: 14,
            color: theme.textSecondary,
        },
        cardFooter: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#333' : '#F3F4F6',
        },
        ratingContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 4,
        },
        ratingText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.text,
        },
        favoriteButton: {
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            zIndex: 10,
        },
        programBadge: {
            position: 'absolute',
            top: 12,
            left: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
        },
        programBadgeText: {
            color: '#FFF',
            fontSize: 10,
            fontWeight: '600',
        },
        feeText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#C62828',
        },
    });

    if (favoritesLoading && !refreshing) return <Loader />;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={{ marginBottom: 16, alignSelf: isRTL ? 'flex-end' : 'flex-start' }}>
                    <ArrowLeft size={24} color={theme.text} />
                </Pressable>
                <ThemedText style={styles.headerTitle}>{t('profile.savedItems', 'Saved Items')}</ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                    {favorites.length} {favorites.length === 1 ? t('common.item', 'item') : t('common.items', 'items')}
                </ThemedText>
            </View>

            <View style={styles.tabs}>
                <Pressable
                    style={[styles.tab, activeTab === 'universities' && styles.activeTab]}
                    onPress={() => setActiveTab('universities')}
                >
                    <ThemedText style={[styles.tabText, activeTab === 'universities' && styles.activeTabText]}>
                        {t('common.universities', 'Universities')}
                    </ThemedText>
                </Pressable>
                <Pressable
                    style={[styles.tab, activeTab === 'programs' && styles.activeTab]}
                    onPress={() => setActiveTab('programs')}
                >
                    <ThemedText style={[styles.tabText, activeTab === 'programs' && styles.activeTabText]}>
                        {t('common.programs', 'Programs')}
                    </ThemedText>
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {activeTab === 'universities' ? (
                    displayedUniversities.length > 0 ? (
                        displayedUniversities.map((uni, index) => (
                            <MotiView
                                key={uni.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 100 }}
                            >
                                <Pressable
                                    style={styles.card}
                                    onPress={() => router.push(`/university/${uni.slug}`)}
                                >
                                    <Image source={{ uri: uni.cover_photo_url }} style={styles.cardImage} resizeMode="cover" />
                                    <Pressable
                                        style={styles.favoriteButton}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite('university', uni.id);
                                        }}
                                    >
                                        <Heart size={20} color="#C62828" fill="#C62828" />
                                    </Pressable>
                                    <View style={styles.cardContent}>
                                        <ThemedText style={styles.cardTitle}>{uni.name}</ThemedText>
                                        <View style={styles.cardLocation}>
                                            <MapPin size={14} color={theme.textSecondary} />
                                            <ThemedText style={styles.cardLocationText}>{uni.city}, China</ThemedText>
                                        </View>
                                        <View style={styles.cardFooter}>
                                            <View style={styles.ratingContainer}>
                                                <Star size={16} color="#FBBF24" fill="#FBBF24" />
                                                <ThemedText style={styles.ratingText}>{uni.ranking || 'N/A'}</ThemedText>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </MotiView>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Building2 size={48} color={theme.border} />
                            <ThemedText style={styles.emptyText}>{t('profile.noSavedUniversities', 'No saved universities yet')}</ThemedText>
                        </View>
                    )
                ) : (
                    displayedPrograms.length > 0 ? (
                        displayedPrograms.map((program, index) => (
                            <MotiView
                                key={program.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 100 }}
                            >
                                <Pressable
                                    style={styles.card}
                                    onPress={() => router.push(`/program/${program.slug}`)}
                                >
                                    <View>
                                        <Image source={{ uri: program.university_cover }} style={styles.cardImage} resizeMode="cover" />
                                        <View style={styles.programBadge}>
                                            <ThemedText style={styles.programBadgeText}>{program.level}</ThemedText>
                                        </View>
                                        <Pressable
                                            style={styles.favoriteButton}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite('program', program.id);
                                            }}
                                        >
                                            <Heart size={20} color="#C62828" fill="#C62828" />
                                        </Pressable>
                                    </View>
                                    <View style={styles.cardContent}>
                                        <ThemedText style={styles.cardTitle} numberOfLines={2}>{program.title}</ThemedText>
                                        <View style={styles.cardLocation}>
                                            <GraduationCap size={14} color={theme.textSecondary} />
                                            <ThemedText style={styles.cardLocationText}>{program.university_name}</ThemedText>
                                        </View>
                                        <View style={styles.cardFooter}>
                                            <ThemedText style={styles.feeText}>
                                                {program.tuition_fee ? `¥${program.tuition_fee.toLocaleString()}/yr` : t('common.contactForPrice', 'Contact for Price')}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </Pressable>
                            </MotiView>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <BookOpen size={48} color={theme.border} />
                            <ThemedText style={styles.emptyText}>{t('profile.noSavedPrograms', 'No saved programs yet')}</ThemedText>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },
    tabs: {
        padding: 16,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    activeTab: {
        backgroundColor: '#C62828',
        borderColor: '#C62828',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFF',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
    },
    cardImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#EEE',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardLocation: {
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    cardLocationText: {
        fontSize: 14,
    },
    cardFooter: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    ratingContainer: {
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10,
    },
    programBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    programBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
    feeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#C62828',
    },
});

