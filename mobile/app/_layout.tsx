import 'react-native-url-polyfill/auto';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { useEffect, useRef } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../stores/auth';
import {
    registerForPushNotificationsAsync,
    savePushToken,
    addNotificationListeners
} from '../lib/notifications';

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { initialize, initialized, user } = useAuth();
    const notificationListener = useRef<(() => void) | undefined>(undefined);

    // Initialize auth
    useEffect(() => {
        if (!initialized) {
            initialize();
        }
    }, [initialized]);

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
                    router.push('/(tabs)/messages');
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

    return <Slot />;
}
