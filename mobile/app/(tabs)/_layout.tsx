import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

// Tab bar icons component
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        index: '🏠',
        explore: '🔍',
        scholarships: '🎓',
        messages: '💬',
        profile: '👤',
    };

    return (
        <View style={styles.iconContainer}>
            <Text style={[styles.icon, focused && styles.iconFocused]}>
                {icons[name] || '📱'}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#DC2626',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    height: 88,
                    paddingBottom: 24,
                    paddingTop: 12,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="scholarships"
                options={{
                    title: 'Scholarships',
                    tabBarIcon: ({ focused }) => <TabIcon name="scholarships" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ focused }) => <TabIcon name="messages" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 24,
        opacity: 0.6,
    },
    iconFocused: {
        opacity: 1,
    },
});
