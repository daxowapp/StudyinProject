import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useFeaturedPrograms, useUniversities } from '../../hooks/useData';

const categories = [
    { id: '1', name: 'Engineering', icon: '⚙️' },
    { id: '2', name: 'Medicine', icon: '🏥' },
    { id: '3', name: 'Business', icon: '💼' },
    { id: '4', name: 'Arts', icon: '🎨' },
    { id: '5', name: 'Science', icon: '🔬' },
    { id: '6', name: 'Law', icon: '⚖️' },
];

export default function HomeScreen() {
    const router = useRouter();
    const { programs, loading: programsLoading } = useFeaturedPrograms();
    const { universities, loading: universitiesLoading } = useUniversities();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 600 }}
                >
                    <View style={styles.hero}>
                        <View style={styles.heroGradient}>
                            <Text style={styles.heroTitle}>Study in China</Text>
                            <Text style={styles.heroSubtitle}>
                                Discover top universities and programs for international students
                            </Text>
                        </View>
                    </View>
                </MotiView>

                {/* Search Bar */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 400, delay: 200 }}
                    style={styles.searchContainer}
                >
                    <Pressable
                        style={styles.searchBar}
                        onPress={() => router.push('/explore')}
                    >
                        <Text style={styles.searchIcon}>🔍</Text>
                        <Text style={styles.searchPlaceholder}>Search programs, universities...</Text>
                    </Pressable>
                </MotiView>

                {/* Categories */}
                <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 300 }}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Browse by Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                            {categories.map((category, index) => (
                                <MotiView
                                    key={category.id}
                                    from={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', delay: 400 + index * 100 }}
                                >
                                    <Pressable style={styles.categoryChip}>
                                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                                        <Text style={styles.categoryName}>{category.name}</Text>
                                    </Pressable>
                                </MotiView>
                            ))}
                        </ScrollView>
                    </View>
                </MotiView>

                {/* Top Universities */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 400 }}
                >
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Top Universities</Text>
                            <Pressable onPress={() => router.push('/explore')}>
                                <Text style={styles.seeAll}>See All →</Text>
                            </Pressable>
                        </View>

                        {universitiesLoading ? (
                            <ActivityIndicator color="#DC2626" style={{ paddingVertical: 20 }} />
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {universities.slice(0, 6).map((uni, index) => (
                                    <MotiView
                                        key={uni.id}
                                        from={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', delay: 500 + index * 100 }}
                                    >
                                        <Pressable
                                            style={styles.universityCard}
                                            onPress={() => router.push(`/university/${uni.slug}`)}
                                        >
                                            <View style={styles.universityLogo}>
                                                <Text style={styles.universityLogoText}>🏛️</Text>
                                            </View>
                                            <Text style={styles.universityName} numberOfLines={2}>{uni.name}</Text>
                                            <Text style={styles.universityCity}>{uni.city}</Text>
                                            {uni.ranking && (
                                                <View style={styles.rankingBadge}>
                                                    <Text style={styles.rankingText}>#{uni.ranking}</Text>
                                                </View>
                                            )}
                                        </Pressable>
                                    </MotiView>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </MotiView>

                {/* Featured Programs */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 500 }}
                >
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Featured Programs</Text>
                            <Pressable onPress={() => router.push('/explore')}>
                                <Text style={styles.seeAll}>See All →</Text>
                            </Pressable>
                        </View>

                        {programsLoading ? (
                            <ActivityIndicator color="#DC2626" style={{ paddingVertical: 20 }} />
                        ) : (
                            programs.slice(0, 4).map((program: any, index: number) => (
                                <MotiView
                                    key={program.id}
                                    from={{ opacity: 0, translateX: 20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: 'spring', delay: 600 + index * 100 }}
                                >
                                    <Pressable style={styles.programCard}>
                                        <View style={styles.programImagePlaceholder}>
                                            <Text style={styles.programImagePlaceholderText}>📚</Text>
                                        </View>
                                        <View style={styles.programInfo}>
                                            <Text style={styles.programTitle} numberOfLines={1}>{program.title}</Text>
                                            <Text style={styles.programUniversity} numberOfLines={1}>
                                                {program.university_name || 'University'}
                                            </Text>
                                            <View style={styles.programMeta}>
                                                <Text style={styles.programLevel}>{program.level}</Text>
                                                {program.tuition_fee && (
                                                    <Text style={styles.programTuition}>
                                                        ¥{program.tuition_fee.toLocaleString()}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </Pressable>
                                </MotiView>
                            ))
                        )}
                    </View>
                </MotiView>

                {/* Scholarship Spotlight */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 800 }}
                >
                    <View style={styles.section}>
                        <Pressable
                            style={styles.scholarshipBanner}
                            onPress={() => router.push('/scholarships')}
                        >
                            <View style={styles.scholarshipBannerGradient}>
                                <Text style={styles.scholarshipBannerIcon}>🎓</Text>
                                <View style={styles.scholarshipBannerContent}>
                                    <Text style={styles.scholarshipBannerTitle}>CSC Scholarship 2025</Text>
                                    <Text style={styles.scholarshipBannerSubtitle}>Full tuition + Monthly stipend</Text>
                                </View>
                                <Text style={styles.scholarshipBannerArrow}>→</Text>
                            </View>
                        </Pressable>
                    </View>
                </MotiView>

                {/* Bottom padding */}
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
    hero: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroGradient: {},
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 24,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginTop: -30,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#9CA3AF',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '600',
    },
    categoriesScroll: {
        marginLeft: -20,
        paddingLeft: 20,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    universityCard: {
        width: 140,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    universityLogo: {
        width: 60,
        height: 60,
        backgroundColor: '#FEE2E2',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    universityLogoText: {
        fontSize: 28,
    },
    universityName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 4,
    },
    universityCity: {
        fontSize: 12,
        color: '#6B7280',
    },
    rankingBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: 8,
    },
    rankingText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#DC2626',
    },
    programCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    programImagePlaceholder: {
        width: 70,
        height: 70,
        backgroundColor: '#DBEAFE',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    programImagePlaceholderText: {
        fontSize: 28,
    },
    programInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    programTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    programUniversity: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 6,
    },
    programMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    programLevel: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: '#6366F1',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
    },
    programTuition: {
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '600',
    },
    scholarshipBanner: {
        overflow: 'hidden',
        borderRadius: 16,
    },
    scholarshipBannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3A5F',
        padding: 20,
        borderRadius: 16,
    },
    scholarshipBannerIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    scholarshipBannerContent: {
        flex: 1,
    },
    scholarshipBannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    scholarshipBannerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    scholarshipBannerArrow: {
        fontSize: 24,
        color: '#FFFFFF',
    },
});
