import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUniversity } from '../../hooks/useData';

const { width } = Dimensions.get('window');

export default function UniversityDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();
    const { university, programs, loading, error } = useUniversity(slug || '');

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#DC2626" />
                <Text style={styles.loadingText}>Loading university...</Text>
            </View>
        );
    }

    if (error || !university) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>😔</Text>
                <Text style={styles.errorTitle}>University Not Found</Text>
                <Text style={styles.errorText}>{error || 'Unable to load university details'}</Text>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Hero Image */}
            <View style={styles.heroContainer}>
                <View style={styles.heroImage}>
                    {university.logo_url ? (
                        <Image source={{ uri: university.logo_url }} style={styles.heroImageContent} />
                    ) : (
                        <View style={styles.heroPlaceholder}>
                            <Text style={styles.heroPlaceholderText}>🏛️</Text>
                        </View>
                    )}
                    <View style={styles.heroOverlay} />
                </View>

                {/* Back Button */}
                <SafeAreaView edges={['top']} style={styles.headerAbsolute}>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>←</Text>
                    </Pressable>
                    <View style={styles.headerActions}>
                        <Pressable style={styles.actionBtn}>
                            <Text style={styles.actionBtnText}>❤️</Text>
                        </Pressable>
                        <Pressable style={styles.actionBtn}>
                            <Text style={styles.actionBtnText}>↗️</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
            >
                {/* University Info Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring' }}
                    style={styles.infoCard}
                >
                    <View style={styles.logoContainer}>
                        {university.logo_url ? (
                            <Image source={{ uri: university.logo_url }} style={styles.logo} />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Text style={styles.logoPlaceholderText}>🏛️</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.universityName}>{university.name}</Text>

                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText}>{university.city}, China</Text>
                    </View>

                    {university.ranking && (
                        <View style={styles.rankingBadge}>
                            <Text style={styles.rankingText}>🏆 Ranked #{university.ranking} in China</Text>
                        </View>
                    )}
                </MotiView>

                {/* Stats Grid */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.statsGrid}
                >
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📚</Text>
                        <Text style={styles.statNumber}>{programs.length || 0}</Text>
                        <Text style={styles.statLabel}>Programs</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>👨‍🎓</Text>
                        <Text style={styles.statNumber}>{university.total_students?.toLocaleString() || 'N/A'}</Text>
                        <Text style={styles.statLabel}>Students</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🌍</Text>
                        <Text style={styles.statNumber}>{university.international_students?.toLocaleString() || 'N/A'}</Text>
                        <Text style={styles.statLabel}>International</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📅</Text>
                        <Text style={styles.statNumber}>{university.founded || 'N/A'}</Text>
                        <Text style={styles.statLabel}>Founded</Text>
                    </View>
                </MotiView>

                {/* About Section */}
                {university.description && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 150 }}
                        style={styles.section}
                    >
                        <Text style={styles.sectionTitle}>About</Text>
                        <View style={styles.aboutCard}>
                            <Text style={styles.aboutText}>{university.description}</Text>
                        </View>
                    </MotiView>
                )}

                {/* Programs Section */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 200 }}
                    style={styles.section}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Available Programs</Text>
                        <Text style={styles.programCount}>{programs.length} programs</Text>
                    </View>

                    {programs.length === 0 ? (
                        <View style={styles.emptyPrograms}>
                            <Text style={styles.emptyIcon}>📋</Text>
                            <Text style={styles.emptyText}>No programs available yet</Text>
                        </View>
                    ) : (
                        programs.slice(0, 5).map((program: any, index: number) => (
                            <MotiView
                                key={program.id}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ type: 'spring', delay: 250 + index * 80 }}
                            >
                                <Pressable style={styles.programCard}>
                                    <View style={styles.programIcon}>
                                        <Text style={styles.programIconText}>📚</Text>
                                    </View>
                                    <View style={styles.programContent}>
                                        <Text style={styles.programTitle} numberOfLines={1}>{program.title}</Text>
                                        <View style={styles.programMeta}>
                                            <View style={styles.programBadge}>
                                                <Text style={styles.programBadgeText}>{program.level || 'Bachelor'}</Text>
                                            </View>
                                            {program.duration && (
                                                <Text style={styles.programDuration}>⏱️ {program.duration}</Text>
                                            )}
                                        </View>
                                    </View>
                                    {program.tuition_fee && (
                                        <Text style={styles.programFee}>
                                            ¥{program.tuition_fee.toLocaleString()}
                                        </Text>
                                    )}
                                </Pressable>
                            </MotiView>
                        ))
                    )}

                    {programs.length > 5 && (
                        <Pressable style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All Programs →</Text>
                        </Pressable>
                    )}
                </MotiView>

                {/* CTA */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 400 }}
                    style={styles.ctaSection}
                >
                    <View style={styles.ctaCard}>
                        <Text style={styles.ctaTitle}>Ready to Apply?</Text>
                        <Text style={styles.ctaText}>Start your application to {university.name}</Text>
                        <Pressable style={styles.applyButton}>
                            <Text style={styles.applyButtonText}>Apply Now</Text>
                        </Pressable>
                    </View>
                </MotiView>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0B',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0A0A0B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#71717A',
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#0A0A0B',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#71717A',
        textAlign: 'center',
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 14,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    heroContainer: {
        height: 200,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#27272A',
    },
    heroImageContent: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#18181B',
    },
    heroPlaceholderText: {
        fontSize: 60,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backBtnText: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontSize: 18,
    },
    scrollView: {
        flex: 1,
        marginTop: -40,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    infoCard: {
        backgroundColor: '#18181B',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27272A',
        marginBottom: 20,
    },
    logoContainer: {
        marginTop: -60,
        marginBottom: 16,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#18181B',
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#27272A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#18181B',
    },
    logoPlaceholderText: {
        fontSize: 36,
    },
    universityName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    locationText: {
        fontSize: 14,
        color: '#71717A',
    },
    rankingBadge: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    rankingText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: (width - 60) / 2 - 6,
        backgroundColor: '#18181B',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27272A',
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#71717A',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    programCount: {
        fontSize: 13,
        color: '#71717A',
    },
    aboutCard: {
        backgroundColor: '#18181B',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    aboutText: {
        fontSize: 14,
        color: '#A1A1AA',
        lineHeight: 24,
    },
    emptyPrograms: {
        backgroundColor: '#18181B',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27272A',
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#71717A',
    },
    programCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        borderRadius: 18,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    programIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    programIconText: {
        fontSize: 22,
    },
    programContent: {
        flex: 1,
        marginLeft: 14,
    },
    programTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    programMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    programBadge: {
        backgroundColor: '#27272A',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    programBadgeText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    programDuration: {
        fontSize: 12,
        color: '#71717A',
        marginLeft: 10,
    },
    programFee: {
        fontSize: 14,
        fontWeight: '700',
        color: '#DC2626',
    },
    viewAllButton: {
        backgroundColor: '#27272A',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    ctaSection: {
        marginTop: 8,
    },
    ctaCard: {
        backgroundColor: '#18181B',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DC2626',
    },
    ctaTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    ctaText: {
        fontSize: 14,
        color: '#71717A',
        textAlign: 'center',
        marginBottom: 20,
    },
    applyButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 48,
        paddingVertical: 18,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
