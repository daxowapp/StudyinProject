import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

const mockScholarships = [
    {
        id: '1',
        name: 'Chinese Government Scholarship (CSC)',
        type: 'Full',
        coverage: ['Tuition', 'Accommodation', 'Stipend', 'Insurance'],
        deadline: '2025-03-01',
        eligibility: 'All international students',
        color: '#DC2626',
    },
    {
        id: '2',
        name: 'Provincial Government Scholarship',
        type: 'Partial',
        coverage: ['Tuition', 'Stipend'],
        deadline: '2025-04-15',
        eligibility: 'Undergraduate & Masters',
        color: '#F59E0B',
    },
    {
        id: '3',
        name: 'University Excellence Award',
        type: 'Merit',
        coverage: ['Tuition Waiver'],
        deadline: '2025-05-01',
        eligibility: 'High achievers',
        color: '#10B981',
    },
    {
        id: '4',
        name: 'Belt & Road Scholarship',
        type: 'Full',
        coverage: ['Tuition', 'Accommodation', 'Stipend'],
        deadline: '2025-02-28',
        eligibility: 'B&R countries',
        color: '#8B5CF6',
    },
];

export default function ScholarshipsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500 }}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Scholarships</Text>
                            <Text style={styles.headerSubtitle}>Fund your education</Text>
                        </View>
                        <View style={styles.headerIcon}>
                            <Text style={styles.headerIconText}>🎓</Text>
                        </View>
                    </View>
                </MotiView>

                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.bannerContainer}
                >
                    <View style={styles.banner}>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerEmoji}>🌟</Text>
                            <View style={styles.bannerText}>
                                <Text style={styles.bannerTitle}>CSC Scholarship 2025</Text>
                                <Text style={styles.bannerSubtitle}>Applications now open!</Text>
                            </View>
                        </View>
                        <Pressable style={styles.bannerButton}>
                            <Text style={styles.bannerButtonText}>Apply</Text>
                        </Pressable>
                    </View>
                </MotiView>

                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 200 }}
                    style={styles.statsContainer}
                >
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>4</Text>
                        <Text style={styles.statLabel}>Available</Text>
                    </View>
                    <View style={[styles.statCard, styles.statCardAccent]}>
                        <Text style={[styles.statNumber, styles.statNumberWhite]}>100%</Text>
                        <Text style={[styles.statLabel, styles.statLabelWhite]}>Coverage</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>30+</Text>
                        <Text style={styles.statLabel}>Days Left</Text>
                    </View>
                </MotiView>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                <Text style={styles.sectionTitle}>Available Scholarships</Text>

                {mockScholarships.map((scholarship, index) => (
                    <MotiView
                        key={scholarship.id}
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 300 + index * 80 }}
                    >
                        <Pressable style={styles.scholarshipCard}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.cardIcon, { backgroundColor: scholarship.color }]}>
                                    <Text style={styles.cardIconText}>🎓</Text>
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle} numberOfLines={2}>{scholarship.name}</Text>
                                    <View style={styles.cardMeta}>
                                        <View style={[styles.typeBadge, { backgroundColor: scholarship.color + '26' }]}>
                                            <Text style={[styles.typeText, { color: scholarship.color }]}>{scholarship.type}</Text>
                                        </View>
                                        <Text style={styles.deadline}>
                                            📅 {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.coverageSection}>
                                <Text style={styles.coverageLabel}>Coverage:</Text>
                                <View style={styles.coverageTags}>
                                    {scholarship.coverage.map((item, i) => (
                                        <View key={i} style={styles.coverageTag}>
                                            <Text style={styles.coverageTagText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={styles.eligibility}>✓ {scholarship.eligibility}</Text>
                                <Pressable style={styles.learnMoreButton}>
                                    <Text style={styles.learnMoreText}>Learn More</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </MotiView>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    safeArea: {
        backgroundColor: '#FC FCFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    headerIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    headerIconText: {
        fontSize: 24,
    },
    bannerContainer: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    banner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#FEE2E2',
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bannerEmoji: {
        fontSize: 32,
        marginRight: 16,
    },
    bannerText: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    bannerButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    bannerButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    statCardAccent: {
        backgroundColor: '#DC2626',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    statNumberWhite: {
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
    statLabelWhite: {
        color: 'rgba(255,255,255,0.9)',
    },
    listContent: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    scholarshipCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardIconText: {
        fontSize: 26,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        lineHeight: 22,
        marginBottom: 8,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        marginRight: 12,
    },
    typeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    deadline: {
        fontSize: 12,
        color: '#64748B',
    },
    coverageSection: {
        marginBottom: 16,
    },
    coverageLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 8,
    },
    coverageTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    coverageTag: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    coverageTagText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eligibility: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '500',
    },
    learnMoreButton: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    learnMoreText: {
        fontSize: 13,
        color: '#78350F',
        fontWeight: '700',
    },
});
