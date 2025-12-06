import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useScholarships } from '../../hooks/useData';

function getDaysUntil(deadline: string): number {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function ScholarshipsScreen() {
    const { scholarships, loading, error } = useScholarships();

    // Get featured scholarship (first one or one with highest value)
    const featured = scholarships.length > 0 ? scholarships[0] : null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Scholarships</Text>
                <Text style={styles.headerSubtitle}>Find funding for your studies</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DC2626" />
                    <Text style={styles.loadingText}>Loading scholarships...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Featured Scholarship */}
                    {featured && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring' }}
                        >
                            <Pressable style={styles.featuredCard}>
                                <View style={styles.featuredBadge}>
                                    <Text style={styles.featuredBadgeText}>🌟 Featured</Text>
                                </View>
                                <Text style={styles.featuredTitle}>{featured.name}</Text>
                                <Text style={styles.featuredSubtitle}>{featured.type || 'Scholarship'}</Text>

                                <View style={styles.featuredDetails}>
                                    <View style={styles.featuredDetailItem}>
                                        <Text style={styles.featuredDetailLabel}>Award</Text>
                                        <Text style={styles.featuredDetailValue}>
                                            {featured.award_amount
                                                ? `¥${featured.award_amount.toLocaleString()}`
                                                : 'Full Ride'}
                                        </Text>
                                    </View>
                                    {featured.deadline && (
                                        <>
                                            <View style={styles.featuredDetailItem}>
                                                <Text style={styles.featuredDetailLabel}>Deadline</Text>
                                                <Text style={styles.featuredDetailValue}>
                                                    {new Date(featured.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </Text>
                                            </View>
                                            <View style={styles.featuredDetailItem}>
                                                <Text style={styles.featuredDetailLabel}>Days Left</Text>
                                                <Text style={[styles.featuredDetailValue, { color: '#FCA5A5' }]}>
                                                    {getDaysUntil(featured.deadline)}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </View>

                                <Pressable style={styles.applyButton}>
                                    <Text style={styles.applyButtonText}>Apply Now</Text>
                                </Pressable>
                            </Pressable>
                        </MotiView>
                    )}

                    {/* All Scholarships */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {scholarships.length > 0 ? `All Scholarships (${scholarships.length})` : 'No Scholarships Available'}
                        </Text>

                        {scholarships.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>🎓</Text>
                                <Text style={styles.emptyText}>
                                    Scholarship information is being updated. Check back soon!
                                </Text>
                            </View>
                        ) : (
                            scholarships.map((scholarship, index) => (
                                <MotiView
                                    key={scholarship.id}
                                    from={{ opacity: 0, translateY: 20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'spring', delay: index * 80 }}
                                >
                                    <Pressable style={styles.scholarshipCard}>
                                        <View style={styles.scholarshipHeader}>
                                            <View style={styles.typeChip}>
                                                <Text style={styles.typeChipText}>{scholarship.type || 'Scholarship'}</Text>
                                            </View>
                                            {scholarship.deadline && (
                                                <Text style={styles.daysLeft}>
                                                    {getDaysUntil(scholarship.deadline)} days left
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={styles.scholarshipName}>{scholarship.name}</Text>
                                        {scholarship.award_amount && (
                                            <Text style={styles.scholarshipAward}>
                                                💰 ¥{scholarship.award_amount.toLocaleString()}
                                            </Text>
                                        )}
                                        {scholarship.deadline && (
                                            <Text style={styles.scholarshipDeadline}>
                                                📅 Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                            </Text>
                                        )}
                                        {scholarship.description && (
                                            <Text style={styles.scholarshipDescription} numberOfLines={2}>
                                                {scholarship.description}
                                            </Text>
                                        )}
                                    </Pressable>
                                </MotiView>
                            ))
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
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
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#DC2626',
    },
    featuredCard: {
        marginHorizontal: 20,
        backgroundColor: '#1E3A5F',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    featuredBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    featuredBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    featuredTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    featuredSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
    },
    featuredDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    featuredDetailItem: {
        alignItems: 'center',
    },
    featuredDetailLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
    },
    featuredDetailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    applyButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#1E3A5F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    scholarshipCard: {
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
    scholarshipHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeChip: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1D4ED8',
    },
    daysLeft: {
        fontSize: 12,
        color: '#DC2626',
        fontWeight: '600',
    },
    scholarshipName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    scholarshipAward: {
        fontSize: 14,
        color: '#059669',
        marginBottom: 4,
    },
    scholarshipDeadline: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    scholarshipDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
});
