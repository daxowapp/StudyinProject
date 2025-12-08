
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { House, Search, Building2, MessageCircle, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const ICONS = {
    index: House,
    explore: Search,
    universities: Building2,
    chat: MessageCircle,
    profile: User,
};

// Labels will be translated inside component


function TabBarIcon({ name, focused }: { name: keyof typeof ICONS; focused: boolean }) {
    const { t } = useTranslation();
    const { isRTL, currentLanguage } = useLanguage();
    const Icon = ICONS[name];
    const color = focused ? '#C62828' : '#64748B'; // Primary Red vs Slate 500

    // Use Cairo font for Arabic and Farsi
    const isRTLLanguage = currentLanguage === 'ar' || currentLanguage === 'fa';
    const fontFamily = isRTLLanguage ? 'Cairo-Medium' : undefined;

    const labels: Record<string, string> = {
        index: t('navigation.home'),
        explore: t('navigation.search'),
        universities: t('navigation.unis'),
        chat: t('navigation.chat'),
        profile: t('navigation.profile'),
    };

    return (
        <View style={styles.iconContainer}>
            <Icon
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
            />
            <Text numberOfLines={1} style={[styles.label, { color, fontWeight: focused ? '600' : '500', fontFamily }]}>
                {labels[name]}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F1F5F9',
                    height: 56 + insets.bottom, // Dynamic height based on device
                    paddingTop: 8,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    elevation: 0,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon name="index" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon name="explore" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="universities"
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon name="universities" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon name="chat" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon name="profile" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: 65, // Fixed width to prevent overlap
    },
    label: {
        fontSize: 10,
        textAlign: 'center',
    },
});
