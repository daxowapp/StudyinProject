import React from 'react';
import { View, StyleSheet, Image, ViewStyle } from 'react-native';
import { MotiView } from 'moti';

interface LoaderProps {
    size?: number;
    color?: string; // Kept for compatibility but might not be used if using Image
    style?: ViewStyle;
}

export default function Loader({ size = 200, color, style }: LoaderProps) {
    return (
        <View style={[styles.container, style]}>
            <MotiView
                from={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{
                    type: 'timing',
                    duration: 800,
                    loop: true,
                    repeatReverse: true,
                }}
            >
                <Image
                    source={require('../assets/logo-red.png')}
                    style={[{ width: size, height: size }, color ? { tintColor: color } : undefined]}
                    resizeMode="contain"
                />
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
