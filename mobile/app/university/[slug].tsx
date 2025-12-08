import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Image, Dimensions, Linking } from 'react-native';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUniversity } from '../../hooks/useData';
import { ArrowLeft, MapPin, Globe, Users, Calendar, GraduationCap, Building2, ChevronRight, BookOpen, Phone, Mail, Star, Trophy, Clock, Home, Award, DollarSign, Check } from 'lucide-react-native';
import { Price } from '../../components/currency/Price';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalTabBar from '../../components/GlobalTabBar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedText as Text } from '../../components/ThemedText';

const { width } = Dimensions.get('window');

export default function UniversityDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { university, programs, accommodation, scholarships, loading, error } = useUniversity(slug || '');

    if (loading || !university) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    if (error || !university) {
        return (
            <View style={styles.errorContainer}>
                <MotiView
                    from={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.errorCard}
                >
                    <Text style={styles.errorIcon}>🏛️</Text>
                    <Text style={styles.errorTitle}>{t('university.notFound')}</Text>
                    <Text style={styles.errorSubtext}>{t('university.notFoundDesc')}</Text>
                    <Pressable style={styles.errorButton} onPress={() => router.back()}>
                        <Text style={styles.errorButtonText}>{t('university.goBack')}</Text>
                    </Pressable>
                </MotiView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Hero Section with Cover Photo */}
            <View style={styles.heroContainer}>
                {university.cover_photo_url ? (
                    <Image
                        source={{ uri: university.cover_photo_url }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                ) : (
                    <LinearGradient
                        colors={['#1E3A5F', '#2E5077', '#4A6FA5']}
                        style={styles.coverImage}
                    />
                )}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.coverOverlay}
                />

                {/* Header Buttons */}
                <SafeAreaView edges={['top']} style={styles.headerAbsolute}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.backBtn} onPress={() => router.back()}>
                            <ArrowLeft size={22} color="#FFF" />
                        </Pressable>
                        <View style={styles.headerActions}>
                            <Pressable style={styles.actionBtn}>
                                <Star size={20} color="#FFF" />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>

                {/* University Info Overlay */}
                <View style={styles.heroInfo}>
                    <View style={styles.logoContainer}>
                        {university.logo_url ? (
                            <Image source={{ uri: university.logo_url }} style={styles.logo} resizeMode="contain" />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Building2 size={32} color="#C62828" />
                            </View>
                        )}
                    </View>
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.universityName} numberOfLines={2}>{university.name}</Text>
                        <View style={styles.locationBadge}>
                            <MapPin size={14} color="#FFF" />
                            <Text style={styles.locationText}>{university.city}, China</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={true}
            >
                {/* Stats Row */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.statsCard}
                >
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#FEE2E2' }]}>
                                <BookOpen size={18} color="#C62828" />
                            </View>
                            <Text style={styles.statNumber}>{programs.length}</Text>
                            <Text style={styles.statLabel}>{t('university.programs')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Users size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.statNumber}>{university.total_students?.toLocaleString() || 'N/A'}</Text>
                            <Text style={styles.statLabel}>{t('university.students')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
                                <Globe size={18} color="#059669" />
                            </View>
                            <Text style={styles.statNumber}>{university.international_students?.toLocaleString() || 'N/A'}</Text>
                            <Text style={styles.statLabel}>{t('university.intlStudents')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Calendar size={18} color="#D97706" />
                            </View>
                            <Text style={styles.statNumber}>{university.founded || 'N/A'}</Text>
                            <Text style={styles.statLabel}>{t('university.founded')}</Text>
                        </View>
                    </View>
                </MotiView>

                {/* Ranking Badge */}
                {university.ranking && (
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 150 }}
                        style={styles.rankingCard}
                    >
                        <LinearGradient
                            colors={['#F59E0B', '#D97706']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.rankingGradient}
                        >
                            <Trophy size={20} color="#FFF" />
                            <Text style={styles.rankingText}>{t('university.rankedInChina', { rank: university.ranking })}</Text>
                        </LinearGradient>
                    </MotiView>
                )}

                {/* About Section */}
                {university.description && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 200 }}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <BookOpen size={18} color="#C62828" />
                            <Text style={styles.sectionTitle}>{t('university.about')}</Text>
                        </View>
                        <Text style={styles.descriptionText}>{university.description}</Text>
                    </MotiView>
                )}

                {/* Programs Section */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 300 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionHeader}>
                            <GraduationCap size={18} color="#C62828" />
                            <Text style={styles.sectionTitle}>Programs</Text>
                        </View>
                        <Text style={styles.programCountBadge}>{programs.length} available</Text>
                    </View>

                    {programs.length === 0 ? (
                        <View style={styles.emptyPrograms}>
                            <Text style={styles.emptyIcon}>📋</Text>
                            <Text style={styles.emptyText}>{t('university.noPrograms')}</Text>
                        </View>
                    ) : (
                        <View style={styles.programsList}>
                            {programs.slice(0, 6).map((program: any, index: number) => (
                                <MotiView
                                    key={program.id}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: 'spring', delay: 350 + index * 50 }}
                                >
                                    <Pressable
                                        style={styles.programCard}
                                        onPress={() => router.push(`/program/${program.slug}`)}
                                    >
                                        <View style={styles.programCardLeft}>
                                            <View style={[
                                                styles.programBadge,
                                                {
                                                    backgroundColor: program.level === 'Bachelor' ? '#DBEAFE' :
                                                        program.level === 'Master' ? '#EDE9FE' : '#D1FAE5'
                                                }
                                            ]}>
                                                <Text style={[
                                                    styles.programBadgeText,
                                                    {
                                                        color: program.level === 'Bachelor' ? '#2563EB' :
                                                            program.level === 'Master' ? '#7C3AED' : '#059669'
                                                    }
                                                ]}>{program.level?.[0] || 'P'}</Text>
                                            </View>
                                            <View style={styles.programInfo}>
                                                <Text style={styles.programTitle} numberOfLines={2}>{program.title}</Text>
                                                <View style={styles.programMeta}>
                                                    <View style={styles.metaItem}>
                                                        <Clock size={12} color="#9CA3AF" />
                                                        <Text style={styles.metaText}>{program.duration || '4 years'}</Text>
                                                    </View>
                                                    <View style={styles.metaItem}>
                                                        <Globe size={12} color="#9CA3AF" />
                                                        <Text style={styles.metaText}>{program.language_name || 'English'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.programCardRight}>
                                            <Price amount={program.tuition_fee || 0} currency="CNY" style={styles.programFee} />
                                            <ChevronRight size={18} color="#9CA3AF" />
                                        </View>
                                    </Pressable>
                                </MotiView>
                            ))}
                        </View>
                    )}

                    {programs.length > 6 && (
                        <Pressable style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>{t('common.viewAll')} {programs.length} {t('university.programs')}</Text>
                            <ChevronRight size={18} color="#C62828" />
                        </Pressable>
                    )}
                </MotiView>

                {/* Scholarships Section */}
                {scholarships && scholarships.length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 350 }}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeaderRow}>
                            <View style={styles.sectionHeader}>
                                <Award size={18} color="#D97706" />
                                <Text style={styles.sectionTitle}>{t('university.scholarships')}</Text>
                            </View>
                            <Text style={styles.programCountBadge}>{t('university.programsAvailable', { count: scholarships.length })}</Text>
                        </View>

                        <View style={styles.scholarshipsList}>
                            {scholarships.slice(0, 4).map((scholarship: any, index: number) => (
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
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Price amount={scholarship.stipend_amount_monthly || 0} currency="CNY" style={styles.coverageText} suffix="/mo stipend" />
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        )}
                                        {(scholarship.service_fee_usd || scholarship.service_fee_cny) && (
                                            <View style={styles.serviceFeeRow}>
                                                <Text style={styles.serviceFeeLabel}>Service Fee: </Text>
                                                <Price
                                                    amount={scholarship.service_fee_cny ? Number(scholarship.service_fee_cny) : Number(scholarship.service_fee_usd)}
                                                    currency={scholarship.service_fee_cny ? "CNY" : "USD"}
                                                    style={styles.serviceFeeValue}
                                                />
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
                        transition={{ type: 'spring', delay: 375 }}
                        style={styles.sectionCard}
                    >
                        <View style={styles.sectionHeader}>
                            <Home size={18} color="#2563EB" />
                            <Text style={styles.sectionTitle}>{t('university.accommodation')}</Text>
                        </View>

                        <View style={styles.accommodationList}>
                            {accommodation.map((acc: any, index: number) => (
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
                                                <Text style={styles.accommodationPrice}>Contact for price</Text>
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

                {/* Contact Section */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 400 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeader}>
                        <Phone size={18} color="#C62828" />
                        <Text style={styles.sectionTitle}>{t('university.contact')}</Text>
                    </View>

                    <View style={styles.contactList}>
                        {university.website && (
                            <View style={styles.contactItem}>
                                <View style={[styles.contactIcon, { backgroundColor: '#DBEAFE' }]}>
                                    <Globe size={18} color="#2563EB" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Website</Text>
                                    <Text style={styles.contactValue} numberOfLines={1}>{university.website}</Text>
                                </View>
                            </View>
                        )}
                        <View style={styles.contactItem}>
                            <View style={[styles.contactIcon, { backgroundColor: '#FEE2E2' }]}>
                                <Mail size={18} color="#C62828" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>admissions@university.edu.cn</Text>
                            </View>
                        </View>
                        <View style={styles.contactItem}>
                            <View style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}>
                                <MapPin size={18} color="#059669" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Location</Text>
                                <Text style={styles.contactValue}>{university.city}, {university.province || 'China'}</Text>
                            </View>
                        </View>
                    </View>
                </MotiView>

                {/* CTA Section */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 500 }}
                    style={styles.ctaCard}
                >
                    <LinearGradient
                        colors={['#7F1D1D', '#991B1B']}
                        style={styles.ctaGradient}
                    >
                        <Text style={styles.ctaTitle}>{t('university.readyToApply')}</Text>
                        <Text style={styles.ctaSubtext}>{t('university.startApplication', { name: university.name })}</Text>
                        <Pressable style={styles.ctaButton}>
                            <Text style={styles.ctaButtonText}>{t('university.browsePrograms')}</Text>
                            <ChevronRight size={18} color="#C62828" />
                        </Pressable>
                    </LinearGradient>
                </MotiView>

                <View style={{ height: 100 }} />
            </ScrollView>
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
    heroContainer: {
        height: 260,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    headerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroInfo: {
        alignItems: 'flex-end',
        gap: 16,
    },
    logoContainer: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    logo: {
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    logoPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    heroTextContainer: {
        flex: 1,
    },
    universityName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    locationText: {
        fontSize: 13,
        color: '#FFF',
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    statsCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 3,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
    },
    rankingCard: {
        marginTop: 16,
        borderRadius: 14,
        overflow: 'hidden',
    },
    rankingGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
    },
    rankingText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
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
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    programCountBadge: {
        fontSize: 12,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 24,
        color: '#4B5563',
        marginTop: 12,
    },
    emptyPrograms: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
    },
    programsList: {
        gap: 10,
    },
    programCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        padding: 14,
    },
    programCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    programBadge: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    programBadgeText: {
        fontSize: 16,
        fontWeight: '800',
    },
    programInfo: {
        flex: 1,
    },
    programTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    programMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: '#6B7280',
    },
    programCardRight: {
        alignItems: 'flex-end',
        marginStart: 8,
    },
    programFee: {
        fontSize: 14,
        fontWeight: '700',
        color: '#C62828',
        marginBottom: 4,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#C62828',
    },
    contactList: {
        gap: 12,
        marginTop: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    contactValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginTop: 2,
    },
    ctaCard: {
        marginTop: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    ctaGradient: {
        padding: 28,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    ctaSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 20,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
    },
    ctaButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#C62828',
    },
    // Scholarships styles
    scholarshipsList: {
        gap: 10,
    },
    scholarshipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
    },
    scholarshipIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
        color: '#92400E',
    },
    scholarshipType: {
        fontSize: 12,
        color: '#B45309',
        marginTop: 2,
    },
    coverageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    coverageText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    // Accommodation styles
    accommodationList: {
        gap: 10,
        marginTop: 12,
    },
    accommodationCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 14,
    },
    accommodationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    accommodationType: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E40AF',
    },
    accommodationPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
    },
    featuresList: {
        gap: 6,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featureText: {
        fontSize: 12,
        color: '#1E3A8A',
    },
    accommodationDesc: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    serviceFeeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    serviceFeeLabel: {
        fontSize: 11,
        color: '#6B7280',
    },
    serviceFeeValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2563EB',
    },
});
