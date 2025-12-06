import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { MotiView } from 'moti';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        index: '🏠',
        explore: '🔍',
        scholarships: '🎓',
        messages: '💬',
        profile: '👤',
    };

    return (
        <MotiView
            animate={{
                scale: focused ? 1.1 : 1,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
            }}
        >
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <View style={styles.iconText}>
                    <View style={{ fontSize: 24 }}>{icons[name]}</View>
                </View>
            </View>
        </MotiView>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#DC2626',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
                    paddingTop: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                    elevation: 12,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginTop: 4,
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
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="scholarships"
                options={{
                    title: 'Programs',
                    tabBarIcon: ({ focused }) => <TabIcon name="scholarships" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Saved',
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
        width: 48,
        height: 32,
        borderRadius: 12,
    },
    iconContainerActive: {
        backgroundColor: '#FEE2E2',
    },
    iconText: {
        fontSize: 24,
    },
});
