import 'react-native-url-polyfill/auto';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { I18nextProvider } from 'react-i18next';
import { useAuth } from '../hooks/useData';
import {
    registerForPushNotificationsAsync,
    savePushToken,
    addNotificationListeners
} from '../lib/notifications';
import AnimatedSplash from '../components/AnimatedSplash';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { FontProvider } from '../contexts/FontContext';
import { NetworkProvider, OfflineBanner } from '../contexts/NetworkContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import i18n from '../lib/i18n';

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { user, loading } = useAuth();
    const notificationListener = useRef<(() => void) | undefined>(undefined);
    const [isAppReady, setIsAppReady] = useState(false);

    // Mark app as ready when auth loading completes
    useEffect(() => {
        if (!loading) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                setIsAppReady(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    // Register for push notifications when user logs in
    useEffect(() => {
        if (user) {
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    savePushToken(user.id, token);
                }
            });
        }
    }, [user]);

    // Set up notification listeners
    useEffect(() => {
        notificationListener.current = addNotificationListeners(
            // Received while app is open
            (notification) => {
                console.log('Notification received:', notification);
            },
            // User tapped notification
            (response) => {
                const data = response.notification.request.content.data;

                // Navigate based on notification type
                if (data?.applicationId) {
                    router.push(`/university/${data.applicationId}`);
                } else if (data?.type === 'new_message') {
                    router.push('/(tabs)/chat');
                } else if (data?.type === 'payment_request') {
                    router.push('/(tabs)/profile');
                }
            }
        );

        return () => {
            if (notificationListener.current) {
                notificationListener.current();
            }
        };
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <ThemeProvider>
                <LanguageProvider>
                    <FontProvider>
                        <CurrencyProvider>
                            <NetworkProvider>
                                <AnimatedSplash isReady={isAppReady}>
                                    <OfflineBanner />
                                    <Slot />
                                </AnimatedSplash>
                            </NetworkProvider>
                        </CurrencyProvider>
                    </FontProvider>
                </LanguageProvider>
            </ThemeProvider>
        </I18nextProvider>
    );
}



