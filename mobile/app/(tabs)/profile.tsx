import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { User, Settings, Bell, Globe, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Mail } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';

const menuItems = [
    { Icon: User, label: 'Edit Profile', description: 'Update your personal information', color: '#C62828' },
    { Icon: Bell, label: 'Notifications', description: 'Manage notification preferences', color: '#FF9800' },
    { Icon: Globe, label: 'Language', description: 'English', color: '#2196F3' },
    { Icon: Shield, label: 'Privacy & Security', description: 'Manage your account security', color: '#9C27B0' },
    { Icon: CreditCard, label: 'Payment Methods', description: 'Add or manage payment options', color: '#4CAF50' },
    { Icon: HelpCircle, label: 'Help & Support', description: 'Get help or contact us', color: '#FF5722' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    if (!user) {
        return (
            <View style={styles.container}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    {/* Guest Header */}
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring' }}
                    >
                        <View style={styles.guestHeader}>
                            <MotiView
                                animate={{ rotate: 360 }}
                                transition={{ type: 'timing', duration: 20000, loop: true }}
                                style={styles.headerBlob}
                            />
                            <View style={styles.headerContent}>
                                <Text style={styles.guestHeaderTitle}>Profile</Text>
                                <Pressable style={styles.settingsBtn}>
                                    <Settings size={20} color="#FFFFFF" />
                                </Pressable>
                            </View>
                        </View>
                    </MotiView>

                    {/* Guest Content */}
                    <MotiView
                        from={{ opacity: 0, translateY: 30, scale: 0.9 }}
                        animate={{ opacity: 1, translateY: 0, scale: 1 }}
                        transition={{ type: 'spring', delay: 200 }}
                        style={styles.guestContainer}
                    >
                        <MotiView
                            from={{ scale: 0, rotate: '-180deg' }}
                            animate={{ scale: 1, rotate: '0deg' }}
                            transition={{ type: 'spring', delay: 300 }}
                        >
                            <View style={styles.guestIcon}>
                                <User size={48} color="#FFFFFF" />
                            </View>
                        </MotiView>

                        <Text style={styles.guestTitle}>Welcome to StudyIn!</Text>
                        <Text style={styles.guestSubtitle}>
                            Sign in to track applications, save favorites, and connect with universities
                        </Text>

                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', delay: 500 }}
                            style={{ width: '100%' }}
                        >
                            <Pressable
                                style={styles.signInButton}
                                onPress={() => router.push('/(auth)/login')}
                            >
                                <Text style={styles.signInButtonText}>Sign In</Text>
                            </Pressable>
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 600 }}
                            style={{ width: '100%' }}
                        >
                            <Pressable
                                style={styles.createAccountButton}
                                onPress={() => router.push('/(auth)/register')}
                            >
                                <Text style={styles.createAccountText}>Create Account</Text>
                            </Pressable>
                        </MotiView>

                        {/* Guest Features */}
                        <View style={styles.features}>
                            {[
                                { Icon: Mail, label: 'Track Applications' },
                                { Icon: Bell, label: 'Notifications' },
                                { Icon: User, label: 'Saved Programs' },
                            ].map((feature, index) => (
                                <MotiView
                                    key={index}
                                    from={{ opacity: 0, translateY: 10 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'spring', delay: 700 + index * 100 }}
                                    style={styles.featureItem}
                                >
                                    <View style={styles.featureIcon}>
                                        <feature.Icon size={20} color="#737373" />
                                    </View>
                                    <Text style={styles.featureText}>{feature.label}</Text>
                                </MotiView>
                            ))}
                        </View>
                    </MotiView>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView edges={['top']}>
                    {/* Header */}
                    <View style={styles.header}>
                        <MotiView
                            animate={{ rotate: 360 }}
                            transition={{ type: 'timing', duration: 20000, loop: true }}
                            style={styles.headerBlob}
                        />
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>Profile</Text>
                            <Pressable style={styles.settingsBtn}>
                                <Settings size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>

                        {/* Profile Card */}
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', delay: 200 }}
                            style={styles.profileCard}
                        >
                            <View style={styles.profileRow}>
                                <View style={styles.avatar}>
                                    <User size={32} color="#C62828" />
                                </View>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.userName}>{user.email?.split('@')[0] || 'Student'}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>
                            </View>

                            {/* Stats */}
                            <View style={styles.statsRow}>
                                {[
                                    { value: '3', label: 'Applications' },
                                    { value: '5', label: 'Saved' },
                                    { value: '12', label: 'Messages' },
                                ].map((stat, index) => (
                                    <MotiView
                                        key={index}
                                        from={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', delay: 300 + index * 100 }}
                                        style={styles.statItem}
                                    >
                                        <Text style={styles.statNumber}>{stat.value}</Text>
                                        <Text style={styles.statLabel}>{stat.label}</Text>
                                    </MotiView>
                                ))}
                            </View>
                        </MotiView>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuSection}>
                        {menuItems.map((item, index) => (
                            <MotiView
                                key={item.label}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ type: 'spring', delay: 400 + index * 80 }}
                            >
                                <Pressable style={styles.menuItem}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                                        <item.Icon size={22} color={item.color} />
                                    </View>
                                    <View style={styles.menuContent}>
                                        <Text style={styles.menuTitle}>{item.label}</Text>
                                        <Text style={styles.menuSubtitle}>{item.description}</Text>
                                    </View>
                                    <ChevronRight size={20} color="#CBD5E1" />
                                </Pressable>
                            </MotiView>
                        ))}
                    </View>

                    {/* Sign Out */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1000 }}
                        style={styles.signOutContainer}
                    >
                        <Pressable style={styles.signOutButton} onPress={signOut}>
                            <LogOut size={20} color="#C62828" />
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </Pressable>
                        <Text style={styles.versionText}>Version 1.0.0</Text>
                    </MotiView>

                    <View style={{ height: 100 }} />
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    safeArea: {
        flex: 1,
    },
    guestHeader: {
        backgroundColor: '#C62828',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#C62828',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    headerBlob: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.08)',
        top: -80,
        right: -60,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    guestHeaderTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    settingsBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    guestIcon: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#C62828',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#C62828',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 8,
    },
    guestTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 15,
        color: '#737373',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        maxWidth: 280,
        fontWeight: '500',
    },
    signInButton: {
        width: '100%',
        backgroundColor: '#C62828',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#C62828',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    createAccountButton: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    createAccountText: {
        color: '#1A1A1A',
        fontSize: 16,
        fontWeight: '700',
    },
    features: {
        flexDirection: 'row',
        gap: 20,
    },
    featureItem: {
        alignItems: 'center',
    },
    featureIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    featureText: {
        fontSize: 12,
        color: '#737373',
        fontWeight: '600',
        textAlign: 'center',
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 30,
        elevation: 6,
        position: 'relative',
        zIndex: 10,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#737373',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#737373',
        fontWeight: '600',
    },
    menuSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#737373',
        fontWeight: '500',
    },
    signOutContainer: {
        paddingHorizontal: 20,
        marginTop: 24,
        alignItems: 'center',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        width: '100%',
        borderWidth: 2,
        borderColor: '#FFEBEE',
        borderRadius: 16,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#C62828',
    },
    versionText: {
        fontSize: 12,
        color: '#A0A0A0',
        marginTop: 20,
        fontWeight: '600',
    },
});
