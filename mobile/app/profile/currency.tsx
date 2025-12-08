import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, DollarSign } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CURRENCY_GROUPS, CurrencyCode } from '../../constants/currencies';

export default function CurrencySettingsScreen() {
    const router = useRouter();
    const { currency, setCurrency, currencyInfo } = useCurrency();
    const { theme } = useTheme();

    const handleCurrencySelect = async (currencyCode: CurrencyCode) => {
        if (currencyCode !== currency) {
            await setCurrency(currencyCode);
        }
        router.back();
    };

    const sections = [
        { title: 'Major Currencies', data: CURRENCY_GROUPS.major },
        { title: 'MENA Region', data: CURRENCY_GROUPS.mena },
        { title: 'CIS Countries', data: CURRENCY_GROUPS.cis },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.primary }}>
                <View style={[styles.header, { backgroundColor: theme.primary }]}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFF" />
                    </Pressable>
                    <View>
                        <Text style={styles.headerTitle}>Currency</Text>
                        <Text style={styles.headerSubtitle}>
                            Current: {currencyInfo.flag} {currencyInfo.code}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.code}
                contentContainerStyle={styles.content}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                        {title}
                    </Text>
                )}
                renderItem={({ item, index, section }) => (
                    <MotiView
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ type: 'spring', delay: index * 50 }}
                    >
                        <Pressable
                            style={[
                                styles.currencyItem,
                                { backgroundColor: theme.card },
                                index < section.data.length - 1 && { marginBottom: 1 },
                                index === 0 && styles.firstItem,
                                index === section.data.length - 1 && styles.lastItem,
                            ]}
                            onPress={() => handleCurrencySelect(item.code)}
                        >
                            <View style={styles.currencyInfo}>
                                <Text style={styles.flag}>{item.flag}</Text>
                                <View>
                                    <Text style={[styles.currencyName, { color: theme.text }]}>
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.currencyCode, { color: theme.textSecondary }]}>
                                        {item.code} ({item.symbol})
                                    </Text>
                                </View>
                            </View>
                            {currency === item.code && (
                                <View style={[styles.checkContainer, { backgroundColor: theme.success }]}>
                                    <Check size={16} color="#FFF" />
                                </View>
                            )}
                        </Pressable>
                    </MotiView>
                )}
                renderSectionFooter={() => <View style={{ height: 16 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 8,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    firstItem: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    lastItem: {
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    currencyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    flag: {
        fontSize: 28,
    },
    currencyName: {
        fontSize: 16,
        fontWeight: '600',
    },
    currencyCode: {
        fontSize: 13,
        marginTop: 2,
    },
    checkContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
