import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Dimensions, Image, ImageBackground } from 'react-native';
import Loader from '../../components/Loader';
import PopularCities from '../../components/PopularCities';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GraduationCap, Building2, Award, TrendingUp, Sparkles, MessageCircle, ChevronRight, MapPin, Search, FileText } from 'lucide-react-native';
import { useFeaturedPrograms, useUniversities, useArticles } from '../../hooks/useData';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ThemedText as Text } from '../../components/ThemedText';

const { width } = Dimensions.get('window');

const stats = [
    { labelKey: "home.stats.universities", value: "500+", Icon: Building2 },
    { labelKey: "home.stats.students", value: "50K+", Icon: GraduationCap },
    { labelKey: "home.stats.success", value: "98%", Icon: TrendingUp },
    { labelKey: "home.stats.scholarships", value: "$2M+", Icon: Award },
];

const quickActions = [
    { labelKey: "home.quickActions.findPrograms", Icon: GraduationCap, color: '#C62828', bg: '#C62828', route: '/explore' },
    { labelKey: "home.quickActions.universities", Icon: Building2, color: '#F59E0B', bg: '#FFF7ED', route: '/(tabs)/universities' },
    { labelKey: "home.quickActions.scholarships", Icon: Award, color: '#FF9800', bg: '#FFF3E0', route: '/(tabs)/explore' },
];

export default function HomeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();
    const { isRTL } = useLanguage();
    const { programs, loading: programsLoading } = useFeaturedPrograms();
    const { universities, loading: unisLoading } = useUniversities();
    const { articles, loading: articlesLoading } = useArticles();

    // Debug: Log when data arrives
    useEffect(() => {
        console.log('[HomeScreen] universities:', universities.length, 'unisLoading:', unisLoading);
        if (universities.length > 0) {
            console.log('[HomeScreen] First uni:', universities[0].name, 'cover:', (universities[0] as any).cover_photo_url?.substring(0, 50));
        }
    }, [universities, unisLoading]);

    useEffect(() => {
        console.log('[HomeScreen] programs:', programs.length, 'programsLoading:', programsLoading);
        if (programs.length > 0) {
            console.log('[HomeScreen] First program:', programs[0].title, 'logo:', programs[0].university_logo?.substring(0, 50));
        }
    }, [programs, programsLoading]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background, direction: isRTL ? 'rtl' : 'ltr' }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Premium Hero Section - matching website design */}
                <View style={styles.headerContainer}>
                    <ImageBackground
                        source={require('../../assets/hero-bg.png')}
                        style={styles.heroBackground}
                        imageStyle={styles.heroImageStyle}
                    >
                        <LinearGradient
                            colors={['rgba(127, 29, 29, 0.95)', 'rgba(153, 27, 27, 0.9)', 'rgba(30, 41, 59, 0.95)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroOverlay}
                        >
                            <SafeAreaView edges={['top']}>
                                <View style={styles.headerContent}>
                                    {/* Logo */}
                                    <Image
                                        source={require('../../assets/logo-white.png')}
                                        style={styles.headerLogo}
                                        resizeMode="contain"
                                    />

                                    {/* Premium Badge */}
                                    <View style={styles.premiumBadge}>
                                        <Sparkles size={14} color="#FBBF24" />
                                        <Text style={styles.premiumBadgeText}>{t('home.admissionsOpen')}</Text>
                                        <View style={styles.pulseDot} />
                                    </View>
                                </View>
                                {/* Tagline */}
                                <Text style={styles.heroTitle}>
                                    {t('home.subtitle')}
                                </Text>

                                <Text style={styles.headerSubtitle}>
                                    {t('home.tagline')}
                                </Text>

                                {/* Quick Search Bar */}
                                <Pressable
                                    style={styles.searchBar}
                                    onPress={() => router.push('/explore')}
                                >
                                    <Search size={18} color="#9CA3AF" />
                                    <Text style={styles.searchPlaceholder}>{t('home.searchPlaceholder')}</Text>
                                </Pressable>
                            </SafeAreaView>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                {/* Floating Stats Card */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                        <View style={styles.statsGrid}>
                            {stats.map((stat, index) => (
                                <View key={index} style={styles.statItem}>
                                    <View style={[styles.statIconCircle, { backgroundColor: isDark ? theme.backgroundSecondary : '#FEF2F2' }]}>
                                        <stat.Icon size={16} color={theme.primary} />
                                    </View>
                                    <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t(stat.labelKey)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.quickActions.title')}</Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.actionButton,
                                    { backgroundColor: index === 0 ? theme.primary : (isDark ? theme.card : action.bg) }
                                ]}
                                onPress={() => router.push(action.route as any)}
                            >
                                <action.Icon
                                    size={24}
                                    color={index === 0 ? '#FFFFFF' : action.color}
                                />
                                <Text style={[
                                    styles.actionLabel,
                                    { color: index === 0 ? '#FFFFFF' : theme.text }
                                ]}>
                                    {t(`home.quickActions.${action.labelKey.split('.').pop()}`)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* AI Advisor Banner */}
                <View style={styles.sectionContainer}>
                    <LinearGradient
                        colors={['#C62828', '#DC2626']} // Primary Gradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.aiBanner}
                    >
                        <Pressable style={styles.aiContent} onPress={() => router.push('/chat')}>
                            <View style={styles.aiIconCircle}>
                                <Sparkles size={24} color="#F59E0B" fill="#F59E0B" />
                            </View>
                            <View style={styles.aiTextContainer}>
                                <Text style={styles.aiTitle}>{t('home.aiTitle')}</Text>
                                <Text style={styles.aiSubtitle}>{t('home.aiSubtitle')}</Text>
                            </View>
                            <MessageCircle size={20} color="#FFFFFF" />
                        </Pressable>
                    </LinearGradient>
                </View>

                {/* Popular Cities */}
                <PopularCities />

                {/* Elite Universities */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.topUniversities')}</Text>
                        <Pressable style={styles.viewAllBtn} onPress={() => router.push('/(tabs)/universities')}>
                            <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('common.viewAll')}</Text>
                            <ChevronRight size={14} color={theme.primary} />
                        </Pressable>
                    </View>

                    {unisLoading ? (
                        <Loader size={40} style={{ padding: 20 }} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.programsScroll}>
                            {universities.slice(0, 5).map((uni: any, index: number) => (
                                <Pressable key={uni.id} style={[styles.programCard, { backgroundColor: theme.card }]} onPress={() => router.push(`/university/${uni.slug}`)}>
                                    <Image
                                        source={{ uri: uni.cover_photo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300' }}
                                        style={styles.programImage}
                                    />
                                    <View style={styles.programInfo}>
                                        <Text style={[styles.programTitle, { color: theme.text }]} numberOfLines={1}>{uni.name}</Text>
                                        <View style={styles.locationRow}>
                                            <MapPin size={10} color={theme.primary} />
                                            <Text style={[styles.locationText, { color: theme.primary }]}>{uni.city || 'China'}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.featuredPrograms')}</Text>
                        <Pressable style={styles.viewAllBtn} onPress={() => router.push('/explore')}>
                            <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('common.viewAll')}</Text>
                            <ChevronRight size={14} color={theme.primary} />
                        </Pressable>
                    </View>

                    {programsLoading ? (
                        <Loader size={40} style={{ padding: 20 }} />
                    ) : (
                        <View style={{ gap: 12 }}>
                            {programs.slice(0, 3).map((program: any) => (
                                <Pressable key={program.id} style={{ flexDirection: 'row', padding: 12, backgroundColor: theme.card, borderRadius: 12, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }} onPress={() => router.push(`/university/${program.university_slug}`)}>
                                    <Image
                                        source={{ uri: program.university_logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300' }}
                                        style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: isDark ? theme.backgroundSecondary : '#FFF7ED' }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: '600', color: theme.text, marginBottom: 2 }}>{program.title}</Text>
                                        <Text style={{ fontSize: 12, color: theme.textSecondary }} numberOfLines={1}>{program.university_name}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <ChevronRight size={16} color={theme.textMuted} />
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                {/* Latest Articles */}
                <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.latestArticles')}</Text>
                        <Pressable style={styles.viewAllBtn} onPress={() => router.push('/articles')}>
                            <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('common.viewAll')}</Text>
                            <ChevronRight size={14} color={theme.primary} />
                        </Pressable>
                    </View>

                    {articlesLoading ? (
                        <Loader size={40} style={{ padding: 20 }} />
                    ) : articles.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: theme.textSecondary }}>{t('home.noArticles')}</Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
                            {articles.slice(0, 3).map((article: any) => (
                                <Pressable
                                    key={article.id}
                                    style={{ flexDirection: 'row', padding: 12, backgroundColor: theme.card, borderRadius: 12, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
                                    onPress={() => router.push(`/articles/${article.slug}`)}
                                >
                                    {article.featured_image ? (
                                        <Image
                                            source={{ uri: article.featured_image }}
                                            style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: isDark ? theme.backgroundSecondary : '#F3F4F6' }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: isDark ? theme.backgroundSecondary : '#E0F2FE', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={24} color={theme.primary} />
                                        </View>
                                    )}
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: '600', color: theme.text, marginBottom: 4 }} numberOfLines={2}>{article.title}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            {article.category_name && (
                                                <Text style={{ fontSize: 11, color: article.category_color || theme.primary }}>{article.category_name}</Text>
                                            )}
                                            <Text style={{ fontSize: 11, color: theme.textMuted }}>
                                                {article.reading_time ? `${article.reading_time} ${t('common.minRead')} ` : new Date(article.published_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <ChevronRight size={16} color={theme.textMuted} />
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    headerContainer: {
        borderBottomStartRadius: 32,
        borderBottomEndRadius: 32,
        overflow: 'hidden',
        minHeight: 280, // Increased height
    },
    heroBackground: {
        width: '100%',
        height: '100%',
    },
    heroImageStyle: {
        resizeMode: 'cover',
    },
    heroOverlay: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 60, // Extra padding for stats overlap
    },
    headerContent: {
        flexDirection: 'row', // Will be controlled dynamically
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 12,
    },
    headerWelcome: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    brandAccent: {
        color: '#F59E0B', // Amber Accent
        fontSize: 20,
        fontWeight: '700',
    },
    brandText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    // New premium hero styles
    headerLogo: {
        width: 180,
        height: 45,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 16,
    },
    premiumBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FBBF24',
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 12,
        lineHeight: 36,
    },
    heroTitleHighlight: {
        color: '#FDE68A', // Yellow-200 for highlight
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 18,
        gap: 12,
        marginTop: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    searchPlaceholder: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginTop: -28, // Negative margin to pull up
        marginBottom: 24,
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    statsGrid: {
        flexDirection: 'row', // Will be controlled dynamically for RTL if needed
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FEF2F2', // Red 50
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    statLabel: {
        fontSize: 10,
        color: '#6B7280',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    quickActionsGrid: {
        flexDirection: 'row', // Will be controlled dynamically for RTL if needed
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: 'center',
        gap: 8,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    aiBanner: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#C62828',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    aiContent: {
        flexDirection: 'row', // Will be controlled dynamically for RTL if needed
        alignItems: 'center',
        gap: 12,
    },
    aiIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginEnd: 12, // changed from implicit gap or margin
    },
    aiTextContainer: {
        flex: 1,
    },
    aiTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    aiSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#C62828',
    },
    programsScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    programCard: {
        width: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginEnd: 12, // changed from marginRight
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    programImage: {
        width: '100%',
        height: 100,
        backgroundColor: '#F3F4F6',
    },
    programInfo: {
        padding: 12,
    },
    programTitle: {
        fontSize: 14,
        fontWeight: '700', // Bolder title
        color: '#1F2937',
        marginBottom: 4,
        height: 40, // Fixed height for 2 lines
    },
    programUni: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationIcon: {
        fontSize: 10,
    },
    locationText: {
        fontSize: 10,
        color: '#C62828',
        fontWeight: '500',
    },
});
