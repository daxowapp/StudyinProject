import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, MessageCircle, ChevronRight, HelpCircle, FileQuestion, BookOpen } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function SupportScreen() {
    const router = useRouter();
    const { isRTL } = useLanguage();
    const { t } = useTranslation();

    const faqs = [
        {
            question: 'How do I apply for a program?',
            answer: 'Search for a program, click "Apply Now", and follow the instructions to upload your documents.'
        },
        {
            question: 'What documents are required?',
            answer: 'Typically, you need a passport, transcripts, and a photo. Specific programs may require more.'
        },
        {
            question: 'How do I pay application fees?',
            answer: 'Go to Profile > Payments to view and pay pending application fees securely.'
        },
        {
            question: 'Can I apply for scholarships?',
            answer: 'Yes, many programs offer scholarships. Look for the "Scholarship Available" tag on program listings.'
        }
    ];

    const handleEmail = () => {
        Linking.openURL('mailto:support@studyatchina.com');
    };

    return (
        <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
            <SafeAreaView edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('support.title')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('support.contactUs')}</Text>
                    <Pressable style={styles.contactCard} onPress={() => router.push('/(tabs)/chat')}>
                        <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                            <MessageCircle size={24} color="#4F46E5" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{t('support.chatWithAI')}</Text>
                            <Text style={styles.cardDesc}>{t('support.instantAnswers')}</Text>
                        </View>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </Pressable>
                    <Pressable style={styles.contactCard} onPress={handleEmail}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                            <Mail size={24} color="#DC2626" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{t('support.emailSupport')}</Text>
                            <Text style={styles.cardDesc}>support@studyatchina.com</Text>
                        </View>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('support.faq')}</Text>
                    {faqs.map((faq, index) => (
                        <View key={index} style={styles.faqCard}>
                            <View style={styles.faqHeader}>
                                <HelpCircle size={18} color="#C62828" style={{ marginTop: 2 }} />
                                <Text style={styles.question}>{faq.question}</Text>
                            </View>
                            <Text style={styles.answer}>{faq.answer}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    backButton: {
        padding: 8,
        marginStart: -8,
    },
    content: {
        padding: 20,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    faqCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    faqHeader: {
        flexDirection: 'row',
        gap: 10,
    },
    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    answer: {
        lineHeight: 20,
        paddingStart: 28,
    },
});
