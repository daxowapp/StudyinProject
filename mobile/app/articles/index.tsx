import React from 'react';
import { View, StyleSheet, ScrollView, FlatList, Pressable, Image, RefreshControl, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Calendar, Clock, Eye } from 'lucide-react-native';
import { useArticles } from '../../hooks/useData';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText as Text } from '../../components/ThemedText';

export default function ArticlesScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();
    const { articles, loading, refetch } = useArticles();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch?.();
        setRefreshing(false);
    }, [refetch]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <LinearGradient
                colors={isDark ? [theme.gradientStart, theme.gradientEnd] : ['#991B1B', '#B91C1C']}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#FFF" />
                        </Pressable>
                        <View>
                            <Text style={styles.headerTitle}>{t('articles.title')}</Text>
                            <Text style={styles.headerSubtitle}>{t('articles.subtitle')}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {loading && !articles.length ? (
                <View style={styles.loadingContainer}>
                    <Loader />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t('common.loading')}</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                    }
                >
                    <View style={styles.articlesList}>
                        {articles.map((article: any) => (
                            <Pressable
                                key={article.id}
                                style={[styles.articleCard, { backgroundColor: theme.card }]}
                                onPress={() => router.push(`/articles/${article.slug}` as any)}
                            >
                                {article.featured_image ? (
                                    <Image
                                        source={{ uri: article.featured_image }}
                                        style={styles.articleImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.articleImagePlaceholder, { backgroundColor: isDark ? theme.backgroundSecondary : '#E0F2FE' }]}>
                                        <FileText size={32} color={theme.primary} />
                                    </View>
                                )}
                                <View style={styles.articleInfo}>
                                    {article.category_name && (
                                        <Text style={[styles.category, { color: article.category_color || theme.primary }]}>
                                            {article.category_name}
                                        </Text>
                                    )}
                                    <Text style={[styles.articleTitle, { color: theme.text }]} numberOfLines={2}>
                                        {article.title}
                                    </Text>
                                    {article.excerpt && (
                                        <Text style={[styles.excerpt, { color: theme.textSecondary }]} numberOfLines={2}>
                                            {article.excerpt}
                                        </Text>
                                    )}
                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Calendar size={12} color={theme.textMuted} />
                                            <Text style={[styles.metaText, { color: theme.textMuted }]}>
                                                {new Date(article.published_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        {article.reading_time && (
                                            <View style={styles.metaItem}>
                                                <Clock size={12} color={theme.textMuted} />
                                                <Text style={[styles.metaText, { color: theme.textMuted }]}>
                                                    {article.reading_time} {t('common.minRead')}
                                                </Text>
                                            </View>
                                        )}
                                        {article.views !== undefined && (
                                            <View style={styles.metaItem}>
                                                <Eye size={12} color={theme.textMuted} />
                                                <Text style={[styles.metaText, { color: theme.textMuted }]}>
                                                    {article.views} {t('common.views')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    {articles.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <FileText size={48} color={theme.textMuted} />
                            <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('home.noArticles')}</Text>
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('home.checkBackSoon')}</Text>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    articlesList: {
        gap: 16,
    },
    articleCard: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    articleImage: {
        width: '100%',
        height: 160,
    },
    articleImagePlaceholder: {
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    articleInfo: {
        padding: 16,
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        lineHeight: 22,
    },
    excerpt: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 14,
    },
});
