import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, RefreshControl, Dimensions, Linking, Share, Text as RNText } from 'react-native';
import { Image } from 'expo-image';
import Loader from '../../components/Loader';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { ChevronLeft, MapPin, Star, Users, BookOpen, Globe, Calendar, DollarSign, CheckCircle, Share2, Globe as GlobeIcon, Award, Clock, Heart, FileText, Building2, Home, Check, GraduationCap, ChevronRight } from 'lucide-react-native';
import { Price } from '../../components/currency/Price';
import { useProgram, useUniversity } from '../../hooks/useData';
import { useFavorites } from '../../hooks/useFavorites';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import GlobalTabBar from '../../components/GlobalTabBar';
import { ThemedText as Text } from '../../components/ThemedText';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProgramDetailScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { program, scholarships, accommodation, loading, error, refetch } = useProgram(slug || '');
    const { isFavorited, toggleFavorite } = useFavorites();
    const { top } = useSafeAreaInsets();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${program?.title} at ${program?.university_name} on Studyin!`,
                url: `https://studyin.ai/program/${slug}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getIconForCategory = (cat: string) => {
        switch (cat) {
            case 'document': return '📄';
            case 'academic': return '🎓';
            case 'language': return '🌐';
            case 'financial': return '💰';
            case 'health': return '💊';
            default: return '📋';
        }
    };

    const requirements = program?.raw_requirements?.map((r: any) => ({
        icon: getIconForCategory(r.category),
        title: r.title,
        desc: r.description || r.custom_note || 'Required'
    })) || [];

    if (loading || !program) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }
    if (error || !program) {
        return (
            <View style={styles.errorContainer}>
                <MotiView
                    from={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.errorCard}
                >
                    <Text style={styles.errorIcon}>📚</Text>
                    <Text style={styles.errorTitle}>{t('program.notFound')}</Text>
                    <Text style={styles.errorSubtext}>{t('program.notFoundDesc')}</Text>
                    <Pressable style={styles.errorButton} onPress={() => router.back()}>
                        <Text style={styles.errorButtonText}>{t('common.back')}</Text>
                    </Pressable>
                </MotiView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient
                colors={['#FAFAFA', '#F0F0F5']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={[styles.headerActions, { paddingTop: (top || 0) + 10 }]}>
                        <Pressable
                            style={styles.iconButton}
                            onPress={() => router.back()}
                        >
                            <ChevronLeft size={24} color="#374151" />
                        </Pressable>
                        <View style={styles.rightIcons}>
                            <Pressable
                                style={styles.iconButton}
                                onPress={() => toggleFavorite('program', program?.id || '')}
                            >
                                <Heart
                                    size={22}
                                    color={isFavorited('program', program?.id || '') ? '#EF4444' : '#374151'}
                                    fill={isFavorited('program', program?.id || '') ? '#EF4444' : 'transparent'}
                                />
                            </Pressable>
                            <Pressable
                                style={styles.iconButton}
                                onPress={handleShare}
                            >
                                <Share2 size={22} color="#374151" />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                bounces={true}
            >
                {/* Hero Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.heroCard}
                >
                    <LinearGradient
                        colors={['#C62828', '#B91C1C', '#991B1B']}
                        style={styles.heroGradient}
                    >
                        {/* University Badge */}
                        <View style={styles.universityBadge}>
                            {program.university_logo ? (
                                <Image
                                    source={{ uri: program.university_logo }}
                                    style={styles.universityLogo}
                                    contentFit="contain"
                                    transition={500}
                                />
                            ) : (
                                <View style={styles.universityLogoPlaceholder}>
                                    <Building2 size={20} color="#C62828" />
                                </View>
                            )}
                            <View style={styles.universityInfo}>
                                <Text style={styles.universityName} numberOfLines={1}>
                                    {program.university_name}
                                </Text>
                                <View style={styles.locationRow}>
                                    <MapPin size={12} color="rgba(255,255,255,0.8)" />
                                    <Text style={styles.locationText}>{program.city}, China</Text>
                                </View>
                            </View>
                        </View>

                        {/* Degree Badge */}
                        <View style={styles.degreeBadge}>
                            <GraduationCap size={14} color="#C62828" />
                            <Text style={styles.degreeBadgeText}>{program.level || t('common.degree')}</Text>
                        </View>

                        {/* Program Title */}
                        <Text style={styles.programTitle}>{program.title}</Text>

                        {/* Quick Tags */}
                        <View style={styles.tagsRow}>
                            <View style={styles.tag}>
                                <Clock size={12} color="#FFF" />
                                <Text style={styles.tagText}>{program.duration || '4 years'}</Text>
                            </View>
                            <View style={styles.tag}>
                                <Globe size={12} color="#FFF" />
                                <Text style={styles.tagText}>{program.language_name || 'English'}</Text>
                            </View>
                            <View style={styles.tag}>
                                <Calendar size={12} color="#FFF" />
                                <Text style={styles.tagText}>{program.intake || 'September'}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </MotiView>

                {/* Key Facts Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 200 }}
                    style={styles.factsCard}
                >
                    <View style={styles.factsHeader}>
                        <Star size={18} color="#F59E0B" />
                        <Text style={styles.factsTitle}>{t('program.highlights')}</Text>
                    </View>

                    <View style={styles.factsGrid}>
                        <View style={styles.factItem}>
                            <View style={[styles.factIcon, { backgroundColor: '#FEE2E2' }]}>
                                <DollarSign size={20} color="#C62828" />
                            </View>
                            <Text style={styles.factLabel}>{t('program.tuitionYear')}</Text>
                            <Price amount={program.tuition_fee || 0} currency="CNY" style={styles.factValue} />
                        </View>

                        <View style={styles.factItem}>
                            <View style={[styles.factIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Clock size={20} color="#2563EB" />
                            </View>
                            <Text style={styles.factLabel}>{t('program.duration')}</Text>
                            <Text style={styles.factValue}>{program.duration || '4 years'}</Text>
                        </View>

                        <View style={styles.factItem}>
                            <View style={[styles.factIcon, { backgroundColor: '#D1FAE5' }]}>
                                <Globe size={20} color="#059669" />
                            </View>
                            <Text style={styles.factLabel}>{t('program.language')}</Text>
                            <Text style={styles.factValue}>{program.language_name || 'English'}</Text>
                        </View>

                        <View style={styles.factItem}>
                            <View style={[styles.factIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Calendar size={20} color="#D97706" />
                            </View>
                            <Text style={styles.factLabel}>{t('program.intake')}</Text>
                            <Text style={styles.factValue}>{program.intake || 'September'}</Text>
                        </View>
                    </View>
                </MotiView>

                {/* About Section */}
                {program.description && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 300 }}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <BookOpen size={18} color="#C62828" />
                            <Text style={styles.sectionTitle}>{t('program.about')}</Text>
                        </View>
                        <Text style={styles.descriptionText}>{program.description}</Text>
                    </MotiView>
                )}

                {/* Requirements Section */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 400 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeader}>
                        <CheckCircle size={18} color="#C62828" />
                        <Text style={styles.sectionTitle}>{t('program.requirements')}</Text>
                    </View>

                    <View style={styles.requirementsList}>
                        {(requirements.length > 0 ? requirements : [
                            { icon: '📄', title: 'Academic Transcripts', desc: 'Official transcripts from previous education' },
                            { icon: '🛂', title: 'Valid Passport', desc: 'With 12+ months validity' },
                            { icon: '🌐', title: 'Language Certificate', desc: 'IELTS 6.0+ / TOEFL 80+ or HSK 4+' },
                            { icon: '💊', title: 'Health Certificate', desc: 'Physical examination form' },
                        ]).map((req: any, index: number) => (
                            <View key={index} style={styles.requirementItem}>
                                <Text style={styles.requirementIcon}>{req.icon}</Text>
                                <View style={styles.requirementContent}>
                                    <Text style={styles.requirementTitle}>{req.title}</Text>
                                    <Text style={styles.requirementDesc}>{req.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </MotiView>

                {/* Scholarships Section */}
                {scholarships && scholarships.length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 450 }}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <Award size={18} color="#D97706" />
                            <Text style={styles.sectionTitle}>{t('program.scholarships')}</Text>
                        </View>

                        <View style={styles.scholarshipsList}>
                            {scholarships.slice(0, 3).map((scholarship: any, index: number) => (
                                <View key={scholarship.id || index} style={styles.scholarshipCard}>
                                    <View style={styles.scholarshipIcon}>
                                        <Award size={20} color="#D97706" />
                                    </View>
                                    <View style={styles.scholarshipInfo}>
                                        <Text style={styles.scholarshipName} numberOfLines={1}>
                                            {scholarship.display_name || scholarship.type_name || 'Scholarship'}
                                        </Text>
                                        <Text style={styles.scholarshipType}>
                                            {scholarship.tuition_coverage_percentage ? `${scholarship.tuition_coverage_percentage}% Tuition Coverage` : 'Available'}
                                        </Text>
                                        {(scholarship.includes_accommodation || scholarship.includes_stipend) && (
                                            <View style={styles.coverageRow}>
                                                <DollarSign size={12} color="#059669" />
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                                    {scholarship.includes_accommodation && <Text style={styles.coverageText}>Accommodation</Text>}
                                                    {scholarship.includes_accommodation && scholarship.includes_stipend && <Text style={styles.coverageText}> + </Text>}
                                                    {scholarship.includes_stipend && (
                                                        <Price amount={scholarship.stipend_amount_monthly || 0} currency="CNY" style={styles.coverageText} suffix="/mo stipend" />
                                                    )}
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </MotiView>
                )}

                {/* Accommodation Section */}
                {accommodation && accommodation.length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 475 }}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <Home size={18} color="#2563EB" />
                            <Text style={styles.sectionTitle}>{t('program.accommodation')}</Text>
                        </View>

                        <View style={styles.accommodationList}>
                            {accommodation.slice(0, 3).map((acc: any, index: number) => (
                                <View key={acc.id || index} style={styles.accommodationCard}>
                                    <View style={styles.accommodationHeader}>
                                        <Text style={styles.accommodationType}>{acc.type || acc.room_type || 'Room'}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {acc.price_cny ? (
                                                <Price amount={Number(acc.price_cny)} currency="CNY" style={styles.accommodationPrice} suffix="/mo" />
                                            ) : acc.price_min && acc.price_max ? (
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Price amount={Number(acc.price_min)} currency="CNY" style={styles.accommodationPrice} />
                                                    <Text style={styles.accommodationPrice}> - </Text>
                                                    <Price amount={Number(acc.price_max)} currency="CNY" style={styles.accommodationPrice} suffix="/mo" />
                                                </View>
                                            ) : (
                                                <Text style={styles.accommodationPrice}>{t('program.contactPrice')}</Text>
                                            )}
                                        </View>
                                    </View>
                                    {acc.description && (
                                        <Text style={styles.accommodationDesc} numberOfLines={2}>{acc.description}</Text>
                                    )}
                                    {acc.features && acc.features.length > 0 && (
                                        <View style={styles.featuresList}>
                                            {acc.features.slice(0, 3).map((feature: string, fIndex: number) => (
                                                <View key={fIndex} style={styles.featureItem}>
                                                    <Check size={12} color="#059669" />
                                                    <Text style={styles.featureText}>{feature}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </MotiView>
                )}

                {/* University Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 500 }}
                >
                    <Pressable
                        style={styles.universityCard}
                        onPress={() => router.push(`/university/${program.university_slug}`)}
                    >
                        <View style={styles.universityCardTop}>
                            {program.university_logo ? (
                                <Image
                                    source={{ uri: program.university_logo }}
                                    style={styles.universityCardLogo}
                                    contentFit="contain"
                                    transition={500}
                                />
                            ) : (
                                <View style={styles.universityCardLogoPlaceholder}>
                                    <Building2 size={24} color="#9CA3AF" />
                                </View>
                            )}
                            <View style={styles.universityCardInfo}>
                                <Text style={styles.universityCardLabel}>{t('program.offeredBy')}</Text>
                                <Text style={styles.universityCardName} numberOfLines={2}>{program.university_name}</Text>
                            </View>
                        </View>
                        <View style={styles.viewButton}>
                            <Text style={styles.viewButtonText}>{t('common.viewDetails')}</Text>
                            <ChevronRight size={16} color="#C62828" />
                        </View>
                    </Pressable>
                </MotiView>

                {/* Bottom Spacer */}
                <View style={{ height: 180 }} />
            </ScrollView>

            {/* Fixed Apply Button */}
            <View style={styles.bottomBar}>
                <SafeAreaView edges={['bottom']}>
                    <View style={styles.bottomContent}>
                        <View style={styles.priceInfo}>
                            <Text style={styles.priceLabel}>{t('program.tuitionFee')}</Text>
                            <Price amount={program.tuition_fee || 0} currency="CNY" style={styles.priceValue} suffix="/yr" />
                        </View>
                        <Pressable
                            style={styles.applyButton}
                            onPress={() => router.push(`/apply/${program.id}`)}
                        >
                            <LinearGradient
                                colors={['#C62828', '#B91C1C']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.applyButtonGradient}
                            >
                                <Text style={styles.applyButtonText}>{t('common.apply')}</Text>
                                <ChevronRight size={18} color="#FFF" />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </View>
            <GlobalTabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    loadingCard: {
        backgroundColor: '#FFF',
        padding: 32,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        padding: 24,
    },
    errorCard: {
        backgroundColor: '#FFF',
        padding: 40,
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 8,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    errorButton: {
        backgroundColor: '#C62828',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 14,
    },
    errorButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 15,
    },
    headerGradient: {
        width: width,
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    headerLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#374151',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 180, // Space for fixed bottom bar + tab bar
    },
    heroCard: {
        marginTop: 8,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#C62828',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    heroGradient: {
        padding: 24,
    },
    universityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    universityLogo: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    universityLogoPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    universityInfo: {
        flex: 1,
    },
    universityName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    locationText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    degreeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 14,
    },
    degreeBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#C62828',
    },
    programTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 16,
        lineHeight: 34,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '500',
    },
    factsCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 3,
    },
    factsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    factsTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    factsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    factItem: {
        width: '50%',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    factIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    factLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    factValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 24,
        color: '#4B5563',
    },
    requirementsList: {
        gap: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F9FAFB',
        padding: 14,
        borderRadius: 14,
        gap: 14,
    },
    requirementIcon: {
        fontSize: 24,
    },
    requirementContent: {
        flex: 1,
    },
    requirementTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    requirementDesc: {
        fontSize: 12,
        color: '#6B7280',
    },
    universityCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        gap: 12,
    },
    universityCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    universityCardInfo: {
        flex: 1,
    },
    universityCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    universityCardLogo: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
    },
    universityCardLogoPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    universityCardLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    universityCardName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 2,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
    },
    viewButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#C62828',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 85, // Above the GlobalTabBar
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingHorizontal: 20,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -10 },
        elevation: 10,
    },
    bottomContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    priceInfo: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    applyButton: {
        borderRadius: 16,
        overflow: 'hidden',
        flex: 1.5,
    },
    applyButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 6,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    // Scholarship styles
    scholarshipsList: {
        gap: 12,
    },
    scholarshipCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFBEB',
        borderRadius: 14,
        padding: 14,
        gap: 12,
    },
    scholarshipIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scholarshipInfo: {
        flex: 1,
    },
    scholarshipName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    scholarshipType: {
        fontSize: 12,
        color: '#92400E',
        marginBottom: 4,
    },
    coverageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    coverageText: {
        fontSize: 11,
        color: '#059669',
    },
    // Accommodation styles
    accommodationList: {
        gap: 12,
    },
    accommodationCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 14,
        padding: 14,
    },
    accommodationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    accommodationType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    accommodationPrice: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },
    accommodationDesc: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    featuresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 11,
        color: '#4B5563',
    },
});
