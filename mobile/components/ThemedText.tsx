import React from 'react';
import { Text as RNText, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useFont } from '../contexts/FontContext';

interface ThemedTextProps extends TextProps {
    children?: React.ReactNode;
}

/**
 * ThemedText component that automatically applies Cairo font for RTL languages
 * Use this instead of React Native's Text component for proper Arabic/Farsi rendering
 */
export function ThemedText({ style, children, ...props }: ThemedTextProps) {
    const { getFontStyle, isRTLFont, fontsLoaded } = useFont();

    // Apply Cairo font for RTL languages
    const finalStyle = React.useMemo(() => {
        if (!isRTLFont || !fontsLoaded) {
            return style;
        }

        // Extract the text style to apply font
        const flatStyle = StyleSheet.flatten(style) as TextStyle | undefined;
        return getFontStyle(flatStyle);
    }, [style, isRTLFont, fontsLoaded, getFontStyle]);

    return (
        <RNText style={finalStyle} {...props}>
            {children}
        </RNText>
    );
}

/**
 * Override the default Text component to use Cairo font for RTL languages
 * This should be called once at app startup
 */
export function setDefaultFont() {
    // This is a hack to set default font for all Text components
    // It modifies the Text prototype to add default styles
    const oldRender = (RNText as any).render;

    if (oldRender) {
        (RNText as any).render = function (...args: any[]) {
            const origin = oldRender.call(this, ...args);
            return React.cloneElement(origin, {
                style: [origin.props.style],
            });
        };
    }
}

export default ThemedText;
