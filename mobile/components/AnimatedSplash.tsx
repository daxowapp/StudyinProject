import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

// Keep splash visible while we animate
SplashScreen.preventAutoHideAsync();

interface AnimatedSplashProps {
    children: React.ReactNode;
    isReady: boolean;
}

export default function AnimatedSplash({ children, isReady }: AnimatedSplashProps) {
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        if (isReady) {
            // Start fade out after content is ready
            const timer = setTimeout(() => {
                setAnimationComplete(true);
                SplashScreen.hideAsync();
            }, 2000); // 2 seconds of animation

            return () => clearTimeout(timer);
        }
    }, [isReady]);

    if (animationComplete) {
        return <>{children}</>;
    }

    return (
        <View style={styles.container}>
            {/* Show children behind splash for smooth transition */}
            <View style={StyleSheet.absoluteFill}>{children}</View>

            {/* Animated Splash Overlay */}
            <MotiView
                from={{ opacity: 1 }}
                animate={{ opacity: isReady ? 0 : 1 }}
                transition={{ type: 'timing', duration: 500, delay: 1500 }}
                style={StyleSheet.absoluteFill}
            >
                <LinearGradient
                    colors={['#991B1B', '#B91C1C', '#C62828']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {/* Logo Only */}
                    <MotiView
                        from={{
                            opacity: 0,
                            scale: 0.5,
                            translateY: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            translateY: 0,
                        }}
                        transition={{
                            type: 'spring',
                            damping: 15,
                            stiffness: 100,
                            delay: 200,
                        }}
                        style={styles.logoContainer}
                    >
                        <Image
                            source={require('../assets/logo-white.png')}
                            style={[styles.logo, { width: 200, height: 80 }]}
                            resizeMode="contain"
                        />
                    </MotiView>
                </LinearGradient>
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    logo: {
        width: width * 0.5,
        height: 80,
    },
    ring: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
});
