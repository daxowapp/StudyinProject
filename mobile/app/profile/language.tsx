import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Globe } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function LanguageSettingsScreen() {
    const router = useRouter();
    const { currentLanguage, languages, changeLanguage } = useLanguage();
    const { theme, isDark } = useTheme();

    const handleLanguageSelect = async (languageCode: string) => {
        if (languageCode !== currentLanguage) {
            await changeLanguage(languageCode);
        }
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.primary }}>
                <View style={[styles.header, { backgroundColor: theme.primary }]}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFF" />
                    </Pressable>
                    <View>
                        <Text style={styles.headerTitle}>Language</Text>
                        <Text style={styles.headerSubtitle}>Choose your preferred language</Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.languageList, { backgroundColor: theme.card }]}>
                    {languages.map((language, index) => (
                        <MotiView
                            key={language.code}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ type: 'spring', delay: index * 100 }}
                        >
                            <Pressable
                                style={[
                                    styles.languageItem,
                                    index < languages.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                                ]}
                                onPress={() => handleLanguageSelect(language.code)}
                            >
                                <View style={styles.languageInfo}>
                                    <View style={[styles.flagContainer, { backgroundColor: theme.primary + '15' }]}>
                                        <Globe size={20} color={theme.primary} />
                                    </View>
                                    <View>
                                        <Text style={[styles.languageName, { color: theme.text }]}>
                                            {language.nativeName}
                                        </Text>
                                        <Text style={[styles.languageNameEn, { color: theme.textSecondary }]}>
                                            {language.name}
                                        </Text>
                                    </View>
                                </View>
                                {currentLanguage === language.code && (
                                    <View style={[styles.checkContainer, { backgroundColor: theme.success }]}>
                                        <Check size={16} color="#FFF" />
                                    </View>
                                )}
                            </Pressable>
                        </MotiView>
                    ))}
                </View>

                <Text style={[styles.note, { color: theme.textMuted }]}>
                    {languages.find(l => l.code === currentLanguage)?.isRTL
                        ? 'The app will restart to apply RTL layout changes.'
                        : 'Language changes are applied immediately.'}
                </Text>
            </ScrollView>
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
    languageList: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    languageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    flagContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
    },
    languageNameEn: {
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
    note: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 16,
    },
});
