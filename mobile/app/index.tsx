import { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/(tabs)');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 200 }}
                style={styles.logoContainer}
            >
                <Text style={styles.logoText}>StudyIn</Text>
            </MotiView>

            <View style={styles.dotsContainer}>
                {[0, 1, 2].map((index) => (
                    <MotiView
                        key={index}
                        from={{ scale: 0.6, opacity: 0.3 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: 'timing',
                            duration: 600,
                            loop: true,
                            delay: index * 200,
                        }}
                        style={styles.dot}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C62828',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 160,
        height: 160,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 60,
        gap: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
});
