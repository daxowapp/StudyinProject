import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUniversity } from '../../hooks/useData';

export default function UniversityDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();
    const { university, programs, loading, error } = useUniversity(slug || '');

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DC2626" />
                    <Text style={styles.loadingText}>Loading university...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !university) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>😕</Text>
                    <Text style={styles.errorTitle}>University not found</Text>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                >
                    <View style={styles.hero}>
                        <Pressable style={styles.backBtn} onPress={() => router.back()}>
                            <Text style={styles.backBtnText}>← Back</Text>
                        </Pressable>
                        <View style={styles.heroContent}>
                            <View style={styles.logoPlaceholder}>
                                <Text style={styles.logoEmoji}>🏛️</Text>
                            </View>
                            <Text style={styles.universityName}>{university.name}</Text>
                            <Text style={styles.universityLocation}>
                                📍 {university.city}{university.province ? `, ${university.province}` : ''}
                            </Text>
                        </View>
                    </View>
                </MotiView>

                {/* Stats Row */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                >
                    <View style={styles.statsRow}>
                        {university.ranking && (
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>#{university.ranking}</Text>
                                <Text style={styles.statLabel}>Ranking</Text>
                            </View>
                        )}
                        {university.total_students && (
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>
                                    {university.total_students > 1000
                                        ? `${(university.total_students / 1000).toFixed(0)}K`
                                        : university.total_students}
                                </Text>
                                <Text style={styles.statLabel}>Students</Text>
                            </View>
                        )}
                        {university.founded && (
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{university.founded}</Text>
                                <Text style={styles.statLabel}>Founded</Text>
                            </View>
                        )}
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{programs.length}</Text>
                            <Text style={styles.statLabel}>Programs</Text>
                        </View>
                    </View>
                </MotiView>

                {/* Description */}
                {university.description && (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing', delay: 200 }}
                    >
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.description} numberOfLines={6}>
                                {university.description}
                            </Text>
                        </View>
                    </MotiView>
                )}

                {/* Programs */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 300 }}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Programs ({programs.length})</Text>

                        {programs.length === 0 ? (
                            <View style={styles.emptyPrograms}>
                                <Text style={styles.emptyText}>No programs available</Text>
                            </View>
                        ) : (
                            programs.slice(0, 10).map((program, index) => (
                                <MotiView
                                    key={program.id}
                                    from={{ opacity: 0, translateX: 20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: 'spring', delay: 400 + index * 50 }}
                                >
                                    <Pressable style={styles.programCard}>
                                        <View style={styles.programInfo}>
                                            <Text style={styles.programTitle}>{program.title}</Text>
                                            <View style={styles.programMeta}>
                                                <Text style={styles.programLevel}>{program.level}</Text>
                                                {program.duration && (
                                                    <Text style={styles.programDuration}>• {program.duration}</Text>
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

                        {programs.length > 10 && (
                            <Pressable style={styles.viewAllButton}>
                                <Text style={styles.viewAllText}>View All {programs.length} Programs</Text>
                            </Pressable>
                        )}
                    </View>
                </MotiView>

                {/* Apply CTA */}
                <View style={styles.ctaSection}>
                    <Pressable style={styles.applyButton}>
                        <Text style={styles.applyButtonText}>Apply Now</Text>
                    </Pressable>
                    {university.website && (
                        <Pressable style={styles.websiteButton}>
                            <Text style={styles.websiteButtonText}>Visit Website</Text>
                        </Pressable>
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    hero: {
        backgroundColor: '#DC2626',
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backBtn: {
        marginBottom: 20,
    },
    backBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    heroContent: {
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoEmoji: {
        fontSize: 40,
    },
    universityName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    universityLocation: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: -20,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    statCard: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
    },
    emptyPrograms: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    emptyText: {
        color: '#6B7280',
    },
    programCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    programInfo: {
        flex: 1,
    },
    programTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    programMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    programLevel: {
        fontSize: 13,
        color: '#6B7280',
    },
    programDuration: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 6,
    },
    programFee: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },
    viewAllButton: {
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    viewAllText: {
        color: '#DC2626',
        fontWeight: '600',
    },
    ctaSection: {
        paddingHorizontal: 20,
        marginTop: 24,
        gap: 12,
    },
    applyButton: {
        backgroundColor: '#DC2626',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    websiteButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    websiteButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
});
