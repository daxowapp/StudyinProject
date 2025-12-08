import React, { useState, useEffect, useMemo } from 'react';
import { View, Modal, StyleSheet, ScrollView, Pressable, Switch, TextInput, Platform, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { ProgramFilters } from '../../hooks/useData';
import { useTranslation } from 'react-i18next';
import { ThemedText as Text } from '../../components/ThemedText';
import { useTheme } from '../../contexts/ThemeContext';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    filters: ProgramFilters;
    onApply: (filters: ProgramFilters) => void;
    onReset: () => void;
}

export function FilterModal({ visible, onClose, filters, onApply, onReset }: FilterModalProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [localFilters, setLocalFilters] = useState<ProgramFilters>(filters);

    const degrees = useMemo(() => [
        { label: t('common.studyFields.all'), value: 'all' },
        { label: t('explore.filters.bachelor'), value: 'bachelor' },
        { label: t('explore.filters.master'), value: 'master' },
        { label: t('explore.filters.phd'), value: 'phd' },
    ], [t]);

    const fields = useMemo(() => [
        { label: t('common.studyFields.all'), value: 'all' },
        { label: t('common.studyFields.engineering'), value: 'engineering' },
        { label: t('common.studyFields.business'), value: 'business' },
        { label: t('common.studyFields.medicine'), value: 'medicine' },
        { label: t('common.studyFields.computer'), value: 'computer' },
        { label: t('common.studyFields.arts'), value: 'arts' },
        { label: t('common.studyFields.science'), value: 'science' },
        { label: t('common.studyFields.law'), value: 'law' },
    ], [t]);

    const languages = useMemo(() => [
        { label: t('common.studyFields.all'), value: 'all' },
        { label: 'English', value: 'English' }, // Assuming these are kept as is or add keys if strictly needed
        { label: 'Chinese', value: 'Chinese' },
    ], [t]);

    const budgets = useMemo(() => [
        { label: t('common.studyFields.all'), value: 200000 },
        { label: '< ¥10k', value: 10000 },
        { label: '< ¥20k', value: 20000 },
        { label: '< ¥30k', value: 30000 },
        { label: '< ¥50k', value: 50000 },
    ], [t]);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, visible]);

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        onReset();
        onClose();
    };

    const updateFilter = (key: keyof ProgramFilters, value: any) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const renderPills = (
        items: { label: string; value: any }[],
        currentValue: any,
        filterKey: keyof ProgramFilters
    ) => (
        <View style={styles.pillsContainer}>
            {items.map((item) => {
                const isActive = (currentValue || 'all') === item.value;
                return (
                    <Pressable
                        key={String(item.value)}
                        style={[styles.pill, isActive && styles.pillActive]}
                        onPress={() => updateFilter(filterKey, item.value)}
                    >
                        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    return (
        <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('common.filters')}</Text>
                    <Pressable style={styles.closeBtn} onPress={onClose}>
                        <X size={24} color="#1F2937" />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Degree Level */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('common.degree')}</Text>
                        {renderPills(degrees, localFilters.degree, 'degree')}
                    </View>

                    {/* Field of Study */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('common.field')}</Text>
                        {renderPills(fields, localFilters.field, 'field')}
                    </View>

                    {/* Language */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('common.language')}</Text>
                        {renderPills(languages, localFilters.language, 'language')}
                    </View>

                    {/* Max Budget */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('common.tuitionRange')} ({t('common.years')})</Text>
                        {renderPills(budgets, localFilters.maxTuition || 200000, 'maxTuition')}
                    </View>

                    {/* City (Text Input) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('common.city')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('common.enterCity')}
                            value={localFilters.city === 'all' ? '' : localFilters.city}
                            onChangeText={(text) => updateFilter('city', text)}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Scholarship (Switch) */}
                    <View style={styles.rowSection}>
                        <Text style={styles.sectionTitle}>{t('common.fullScholarship')}</Text>
                        <Switch
                            value={!!localFilters.scholarship}
                            onValueChange={(val) => updateFilter('scholarship', val)}
                            trackColor={{ false: '#E5E7EB', true: '#EF4444' }}
                            thumbColor={'#FFF'}
                        />
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <Pressable style={styles.resetBtn} onPress={handleReset}>
                        <Text style={styles.resetText}>{t('common.resetAll')}</Text>
                    </Pressable>
                    <Pressable style={styles.applyBtn} onPress={handleApply}>
                        <Text style={styles.applyText}>{t('common.applyFilters')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 12,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    pillActive: {
        backgroundColor: '#FEF2F2',
        borderColor: '#C62828',
    },
    pillText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    pillTextActive: {
        color: '#C62828',
        fontWeight: '700',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Fallback, but should ideally use theme font if possible on input
    },
    rowSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingVertical: 8,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 16,
    },
    resetBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    resetText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
    },
    applyBtn: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#C62828',
    },
    applyText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
});
