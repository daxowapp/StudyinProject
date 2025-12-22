import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import ar from '../locales/ar.json';
import fa from '../locales/fa.json';
import tr from '../locales/tr.json';
import zh from '../locales/zh.json';
import tk from '../locales/tk.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import ru from '../locales/ru.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

export const languages = [
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
    { code: 'fa', name: 'Farsi', nativeName: 'فارسی', isRTL: true },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isRTL: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false },
    { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', isRTL: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false },
];

const resources = {
    en: { translation: en },
    ar: { translation: ar },
    fa: { translation: fa },
    tr: { translation: tr },
    zh: { translation: zh },
    tk: { translation: tk },
    es: { translation: es },
    fr: { translation: fr },
    ru: { translation: ru },
};

// Get saved language or detect from device
export const getInitialLanguage = async (): Promise<string> => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && languages.find(l => l.code === savedLanguage)) {
            return savedLanguage;
        }
    } catch (error) {
        console.error('Error loading saved language:', error);
    }

    // Detect from device locale
    const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
    const supportedLanguage = languages.find(l => l.code === deviceLocale);
    return supportedLanguage ? deviceLocale : 'en';
};

// Save language preference
export const saveLanguage = async (languageCode: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
        console.error('Error saving language:', error);
    }
};

// Check if language is RTL
export const isRTL = (languageCode: string): boolean => {
    const language = languages.find(l => l.code === languageCode);
    return language?.isRTL || false;
};

// Initialize i18next
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default, will be updated on app load
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
