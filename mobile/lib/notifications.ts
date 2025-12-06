import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token = null;

    // Must be a physical device
    if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
    }

    // Get the token
    try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: 'your-project-id', // Replace with your Expo project ID
        });
        token = tokenData.data;
        console.log('Push token:', token);
    } catch (error) {
        console.error('Error getting push token:', error);
    }

    // Android needs a notification channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#DC2626',
        });
    }

    return token;
}

// Save push token to user profile in Supabase
export async function savePushToken(userId: string, token: string) {
    try {
        await supabase
            .from('profiles')
            .update({ push_token: token })
            .eq('id', userId);
        console.log('Push token saved to profile');
    } catch (error) {
        console.error('Error saving push token:', error);
    }
}

// Schedule a local notification
export async function scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>,
    seconds: number = 1
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
            sound: true,
        },
        trigger: { seconds, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL },
    });
}

// Cancel all notifications
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get notification listeners
export function addNotificationListeners(
    onReceive: (notification: Notifications.Notification) => void,
    onResponse: (response: Notifications.NotificationResponse) => void
) {
    const receivedListener = Notifications.addNotificationReceivedListener(onReceive);
    const responseListener = Notifications.addNotificationResponseReceivedListener(onResponse);

    return () => {
        receivedListener.remove();
        responseListener.remove();
    };
}

// Notification types for the app
export type NotificationType =
    | 'new_message'
    | 'payment_request'
    | 'document_request'
    | 'status_update'
    | 'acceptance';

export interface AppNotification {
    type: NotificationType;
    title: string;
    body: string;
    data?: {
        applicationId?: string;
        messageId?: string;
        paymentId?: string;
        documentId?: string;
    };
}
