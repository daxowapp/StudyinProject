import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Image, useWindowDimensions, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, Eye, Share2 } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText as Text } from '../../components/ThemedText';

export default function ArticleDetailScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { theme, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    async function fetchArticle() {
        try {
            setLoading(true);
            console.log('[ArticleDetail] Fetching article:', slug);

            const { data, error } = await supabase
                .from('v_published_articles')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('[ArticleDetail] Error:', error);
            } else {
                setArticle(data);
                // Increment view count
                if (data?.id) {
                    supabase
                        .from('articles')
                        .update({ views: (data.views || 0) + 1 })
                        .eq('id', data.id)
                        .then(() => console.log('[ArticleDetail] View count updated'));
                }
            }
        } catch (err) {
            console.error('[ArticleDetail] Error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <SafeAreaView style={styles.loadingContainer}>
                    <Loader />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t('common.loading')}</Text>
                </SafeAreaView>
            </View>
        );
    }

    if (!article) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <SafeAreaView style={styles.errorContainer}>
                    <Text style={[styles.errorTitle, { color: theme.text }]}>{t('articles.notFound')}</Text>
                    <Pressable
                        style={[styles.backBtn, { backgroundColor: theme.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backBtnText}>{t('common.back')}</Text>
                    </Pressable>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                {article.featured_image ? (
                    <View style={styles.heroContainer}>
                        <Image
                            source={{ uri: article.featured_image }}
                            style={[styles.heroImage, { width }]}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.heroGradient}
                        />
                        <SafeAreaView edges={['top']} style={styles.headerOverlay}>
                            <Pressable onPress={() => router.back()} style={styles.backButton}>
                                <ChevronLeft size={24} color="#FFF" />
                            </Pressable>
                        </SafeAreaView>
                    </View>
                ) : (
                    <SafeAreaView edges={['top']}>
                        <View style={[styles.header, { backgroundColor: theme.card }]}>
                            <Pressable onPress={() => router.back()} style={styles.backButtonDark}>
                                <ChevronLeft size={24} color={theme.text} />
                            </Pressable>
                        </View>
                    </SafeAreaView>
                )}

                {/* Content */}
                <View style={[styles.content, { backgroundColor: theme.background }]}>
                    {/* Category */}
                    {article.category_name && (
                        <Text style={[styles.category, { color: article.category_color || theme.primary }]}>
                            {article.category_name}
                        </Text>
                    )}

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.text }]}>
                        {article.title}
                    </Text>

                    {/* Meta */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Calendar size={14} color={theme.textMuted} />
                            <Text style={[styles.metaText, { color: theme.textMuted }]}>
                                {new Date(article.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Text>
                        </View>
                        {article.reading_time && (
                            <View style={styles.metaItem}>
                                <Clock size={14} color={theme.textMuted} />
                                <Text style={[styles.metaText, { color: theme.textMuted }]}>
                                    {article.reading_time} {t('common.minRead')}
                                </Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Eye size={14} color={theme.textMuted} />
                            <Text style={[styles.metaText, { color: theme.textMuted }]}>
                                {article.views || 0} {t('common.views')}
                            </Text>
                        </View>
                    </View>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <Text style={[styles.excerpt, { color: theme.textSecondary }]}>
                            {article.excerpt}
                        </Text>
                    )}

                    {/* Body - Simple text rendering */}
                    {article.content && (
                        <Text style={[styles.body, { color: theme.text }]}>
                            {article.content.replace(/<[^>]*>/g, '')}
                        </Text>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
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
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    backBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    heroContainer: {
        position: 'relative',
    },
    heroImage: {
        height: 280,
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    backButton: {
        padding: 12,
        margin: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    header: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    backButtonDark: {
        padding: 4,
    },
    content: {
        padding: 20,
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    category: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        lineHeight: 34,
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 13,
    },
    excerpt: {
        fontSize: 17,
        lineHeight: 26,
        fontStyle: 'italic',
        marginBottom: 24,
    },
    body: {
        fontSize: 16,
        lineHeight: 28,
    },
});
