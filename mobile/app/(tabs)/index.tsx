import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { Search, MapPin, ChevronRight, Star, Users, Award, Sparkles, Bell, GraduationCap } from 'lucide-react-native';

const categories = [
    { id: 'mba', label: 'MBA' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'medicine', label: 'Medicine' },
    { id: 'cs', label: 'Computer Science' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'english', label: 'English Taught' },
];

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                    <SafeAreaView edges={['top']}>
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'spring', delay: 100 }}
                        >
                            <View style={styles.header}>
                                <View>
                                    <Text style={styles.welcomeText}>Welcome to</Text>
                                    <Text style={styles.brandText}>StudyAtChina</Text>
                                </View>
                                <View style={styles.headerActions}>
                                    <Pressable style={styles.notificationBtn}>
                                        <Bell size={20} color="#FFFFFF" />
                                    </Pressable>
                                    <View style={styles.badge}>
                                        <Sparkles size={12} color="#FDD835" />
                                        <Text style={styles.badgeText}>2025 Open</Text>
                                    </View>
                                </View>
                            </View>
                        </MotiView>

                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>Your Future{'\n'}Starts Here</Text>
                            <Text style={styles.heroSubtitle}>
                                Join 50,000+ students at China's top universities
                            </Text>
                        </View>

                        <Pressable
                            style={styles.searchButton}
                            onPress={() => router.push('/explore')}
                        >
                            <View style={styles.searchIconContainer}>
                                <Search size={24} color="#C62828" />
                            </View>
                            <View style={styles.searchContent}>
                                <Text style={styles.searchTitle}>Search Programs</Text>
                                <Text style={styles.searchSubtitle}>500+ programs available</Text>
                            </View>
                            <ChevronRight size={20} color="#94A3B8" />
                        </Pressable>
                    </SafeAreaView>
                </View>

                {/* Stats Card */}
                <View style={styles.statsSection}>
                    <View style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            {[
                                { Icon: GraduationCap, value: '500+', label: 'Universities', color: '#C62828' },
                                { Icon: Users, value: '50k+', label: 'Students', color: '#FF9800' },
                                { Icon: Award, value: '98%', label: 'Success', color: '#4CAF50' },
                            ].map((stat, index) => (
                                <View key={index} style={styles.statItem}>
                                    <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                                        <stat.Icon size={24} color={stat.color} />
                                    </View>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Browse Categories</Text>
                        <Pressable>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.categoriesGrid}>
                        {categories.map((cat) => (
                            <Pressable key={cat.id} style={styles.categoryCard}>
                                <GraduationCap size={28} color="#C62828" />
                                <Text style={styles.categoryLabel}>{cat.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    heroSection: {
        backgroundColor: '#C62828',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    welcomeText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '500',
    },
    brandText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '800',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 193, 7, 0.25)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        color: '#FDD835',
        fontWeight: '700',
    },
    heroContent: {
        marginBottom: 28,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        lineHeight: 48,
        marginBottom: 12,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 24,
        fontWeight: '500',
    },
    searchButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    searchIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContent: {
        flex: 1,
        marginLeft: 14,
    },
    searchTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    searchSubtitle: {
        fontSize: 13,
        color: '#737373',
        fontWeight: '500',
    },
    statsSection: {
        paddingHorizontal: 20,
        marginTop: -20,
        marginBottom: 24,
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statIconBg: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#737373',
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    seeAllText: {
        fontSize: 14,
        color: '#C62828',
        fontWeight: '700',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '30%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#404040',
        textAlign: 'center',
        marginTop: 8,
    },
});
