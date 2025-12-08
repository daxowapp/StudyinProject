import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n, { languages, getInitialLanguage, saveLanguage, isRTL } from '../lib/i18n';
import * as Updates from 'expo-updates';

interface LanguageContextType {
    currentLanguage: string;
    languages: typeof languages;
    isRTL: boolean;
    changeLanguage: (languageCode: string) => Promise<void>;
    t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved language on mount
    useEffect(() => {
        const initLanguage = async () => {
            const savedLanguage = await getInitialLanguage();
            await i18n.changeLanguage(savedLanguage);
            setCurrentLanguage(savedLanguage);

            // Set RTL direction
            const shouldBeRTL = isRTL(savedLanguage);
            if (I18nManager.isRTL !== shouldBeRTL) {
                I18nManager.allowRTL(shouldBeRTL);
                I18nManager.forceRTL(shouldBeRTL);
                // Note: RTL changes require app restart to take effect
            }

            setIsLoaded(true);
        };
        initLanguage();
    }, []);

    const changeLanguage = async (languageCode: string) => {
        await i18n.changeLanguage(languageCode);
        await saveLanguage(languageCode);
        setCurrentLanguage(languageCode);

        // Handle RTL change
        const shouldBeRTL = isRTL(languageCode);
        const currentRTL = I18nManager.isRTL;

        if (shouldBeRTL !== currentRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);

            // RTL changes require app restart
            try {
                await Updates.reloadAsync();
            } catch (error) {
                // In development, just alert user
                console.log('Please restart the app to apply RTL changes');
            }
        }
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                languages,
                isRTL: isRTL(currentLanguage),
                changeLanguage,
                t: (key: string, options?: Record<string, unknown>) => t(key, options ?? {}),
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
