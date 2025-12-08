import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useFonts } from 'expo-font';
import { Text, TextStyle } from 'react-native';
import { useLanguage } from './LanguageContext';

interface FontContextType {
    fontsLoaded: boolean;
    fontFamily: string;
    getFontStyle: (baseStyle?: TextStyle) => TextStyle;
    isRTLFont: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

// RTL languages that should use Cairo font
const RTL_LANGUAGES = ['ar', 'fa'];

export function FontProvider({ children }: { children: ReactNode }) {
    const { currentLanguage } = useLanguage();

    // Load Cairo fonts
    const [fontsLoaded] = useFonts({
        'Cairo-Regular': require('../assets/fonts/Cairo-Regular.ttf'),
        'Cairo-Medium': require('../assets/fonts/Cairo-Medium.ttf'),
    });

    const isRTLFont = RTL_LANGUAGES.includes(currentLanguage);

    // Set default font for all Text components when RTL
    useEffect(() => {
        if (fontsLoaded && isRTLFont) {
            // Apply Cairo font to all Text components by default
            const defaultStyle = { fontFamily: 'Cairo-Regular' };

            // Set default props on Text component
            if (!(Text as any).defaultProps) {
                (Text as any).defaultProps = {};
            }
            (Text as any).defaultProps.style = defaultStyle;

            console.log('[FontContext] Applied Cairo font globally for RTL');
        } else {
            // Remove custom font when not RTL
            if ((Text as any).defaultProps?.style?.fontFamily === 'Cairo-Regular') {
                (Text as any).defaultProps.style = {};
            }
        }
    }, [fontsLoaded, isRTLFont]);

    const fontFamily = isRTLFont && fontsLoaded ? 'Cairo-Regular' : 'System';

    const getFontStyle = (baseStyle?: TextStyle): TextStyle => {
        if (!isRTLFont || !fontsLoaded) {
            return baseStyle || {};
        }

        const weight = (baseStyle?.fontWeight as string) || '400';
        // Use Medium for any weight >= 500
        const cairoFont = (weight >= '500' || weight === 'bold') ? 'Cairo-Medium' : 'Cairo-Regular';

        return {
            ...baseStyle,
            fontFamily: cairoFont,
        };
    };

    // Show loading indicator while fonts load for RTL
    if (!fontsLoaded && isRTLFont) {
        return null; // Or a loading spinner
    }

    return (
        <FontContext.Provider
            value={{
                fontsLoaded,
                fontFamily,
                getFontStyle,
                isRTLFont,
            }}
        >
            {children}
        </FontContext.Provider>
    );
}

export function useFont() {
    const context = useContext(FontContext);
    if (context === undefined) {
        throw new Error('useFont must be used within a FontProvider');
    }
    return context;
}
