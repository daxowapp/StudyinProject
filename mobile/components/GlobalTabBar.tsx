import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { House, Search, Building2, MessageCircle, User } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedText as Text } from './ThemedText';

const TABS = [
    { name: 'index', route: '/(tabs)', label: 'Home', Icon: House },
    { name: 'explore', route: '/(tabs)/explore', label: 'Search', Icon: Search },
    { name: 'universities', route: '/(tabs)/universities', label: 'Unis', Icon: Building2 },
    { name: 'chat', route: '/(tabs)/chat', label: 'Chat', Icon: MessageCircle },
    { name: 'profile', route: '/(tabs)/profile', label: 'Profile', Icon: User },
];

export default function GlobalTabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();

    const isActive = (tab: typeof TABS[0]) => {
        if (tab.name === 'index') {
            return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
        }
        return pathname.includes(tab.name);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.tabBar, borderTopColor: theme.border }]}>
            {TABS.map((tab) => {
                const active = isActive(tab);
                const color = active ? theme.tabBarActive : theme.tabBarInactive;

                return (
                    <Pressable
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => router.push(tab.route as any)}
                    >
                        <tab.Icon
                            size={22}
                            color={color}
                            strokeWidth={active ? 2.5 : 2}
                        />
                        <Text style={[styles.label, { color, fontWeight: active ? '600' : '500' }]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        // Match exact sizing from (tabs)/_layout.tsx
        height: Platform.OS === 'ios' ? 85 : 65,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 25 : 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    label: {
        fontSize: 10,
    },
});
