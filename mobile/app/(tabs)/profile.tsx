import { View, ScrollView, StyleSheet, Pressable, Image, Switch, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { User, Settings, Bell, Globe, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Mail, FileText, Moon, Sun, DollarSign } from 'lucide-react-native';
import { useAuth, useUserApplications, useUserProfile, useUnreadMessages } from '../../hooks/useData';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { ThemedText as Text } from '../../components/ThemedText';
import React, { useMemo } from 'react';

export default function ProfileScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user, signOut, loading: authLoading } = useAuth();
    const { applications, loading: appsLoading } = useUserApplications();
    const { profile, completionPercentage } = useUserProfile();
    const { count: unreadCount } = useUnreadMessages();
    const { isDark, toggleTheme, theme } = useTheme();
    const { currencyInfo } = useCurrency();
    const { currentLanguage, languages, isRTL } = useLanguage();

    const currentLanguageInfo = languages.find(l => l.code === currentLanguage);

    const menuItems = useMemo(() => [
        { Icon: User, label: t('profile.menu.editProfile'), description: t('profile.menu.editProfileDesc'), color: '#C62828', action: 'edit_profile' },
        { Icon: Bell, label: t('profile.menu.notifications'), description: t('profile.menu.notificationsDesc'), color: '#FF9800', action: 'notifications' },
        { Icon: Moon, label: t('profile.menu.darkMode'), description: t('profile.menu.toggleDark'), color: '#6366F1', action: 'dark_mode', isToggle: true },
        { Icon: Globe, label: t('profile.menu.language'), description: currentLanguageInfo?.nativeName || 'English', color: '#2196F3', action: 'language' },
        { Icon: Shield, label: t('profile.menu.privacy'), description: t('profile.menu.privacyDesc'), color: '#9C27B0', action: 'security' },
        { Icon: CreditCard, label: t('profile.menu.payments'), description: t('profile.menu.paymentsDesc'), color: '#4CAF50', action: 'payment' },
        { Icon: HelpCircle, label: t('profile.menu.help'), description: t('profile.menu.helpDesc'), color: '#FF5722', action: 'help' },
    ], [t, currentLanguageInfo]);

    // Guest settings items (available before login)
    const guestSettingsItems = useMemo(() => [
        { Icon: isDark ? Moon : Sun, label: t('profile.menu.darkMode'), description: isDark ? t('profile.menu.darkActive') : t('profile.menu.lightActive'), color: '#6366F1', action: 'dark_mode', isToggle: true },
        { Icon: Globe, label: t('profile.menu.language'), description: currentLanguageInfo?.nativeName || 'English', color: '#2196F3', action: 'language' },
        { Icon: DollarSign, label: t('profile.menu.currency'), description: `${currencyInfo.flag} ${currencyInfo.code}`, color: '#4CAF50', action: 'currency' },
    ], [t, isDark, currentLanguageInfo, currencyInfo]);

    const handleMenuPress = (action: string) => {
        switch (action) {
            case 'edit_profile':
                router.push('/profile/edit');
                break;
            case 'notifications':
                router.push('/messages');
                break;
            case 'dark_mode':
                toggleTheme();
                break;
            case 'language':
                router.push('/profile/language');
                break;
            case 'currency':
                router.push('/profile/currency');
                break;
            case 'security':
                alert('Privacy & Security - Coming Soon!');
                break;
            case 'payment':
                router.push('/profile/payments');
                break;
            case 'help':
                router.push('/support');
                break;
        }
    };

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, direction: isRTL ? 'rtl' : 'ltr' }]}>
                <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.primary }]}>
                    {/* Guest Header */}
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring' }}
                    >
                        <View style={styles.guestHeader}>
                            <MotiView
                                animate={{ rotate: '360deg' }}
                                transition={{ type: 'timing', duration: 20000, loop: true }}
                                style={styles.headerBlob}
                            />
                            <View style={styles.headerContent}>
                                <Text style={styles.guestHeaderTitle}>{t('profile.title')}</Text>
                                <Pressable style={styles.settingsBtn}>
                                    <Settings size={20} color="#FFFFFF" />
                                </Pressable>
                            </View>
                        </View>
                    </MotiView>

                    {/* Guest Content */}
                    <ScrollView contentContainerStyle={styles.guestScrollContent}>
                        <MotiView
                            from={{ opacity: 0, translateY: 30, scale: 0.9 }}
                            animate={{ opacity: 1, translateY: 0, scale: 1 }}
                            transition={{ type: 'spring', delay: 200 }}
                            style={[styles.guestContainer, { backgroundColor: theme.card }]}
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

                            <Text style={[styles.guestTitle, { color: theme.text }]}>{t('profile.welcome')}</Text>
                            <Text style={[styles.guestSubtitle, { color: theme.textSecondary }]}>
                                {t('profile.signInDesc')}
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
                                    <Text style={styles.signInButtonText}>{t('profile.signIn')}</Text>
                                </Pressable>
                            </MotiView>

                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 600 }}
                                style={{ width: '100%' }}
                            >
                                <Pressable
                                    style={[styles.createAccountButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                                    onPress={() => router.push('/(auth)/register')}
                                >
                                    <Text style={[styles.createAccountText, { color: theme.text }]}>{t('profile.createAccount')}</Text>
                                </Pressable>
                            </MotiView>

                            {/* Guest Features */}
                            <View style={styles.features}>
                                {[
                                    { Icon: Mail, label: t('profile.features.trackApps') },
                                    { Icon: Bell, label: t('profile.features.notifications') },
                                    { Icon: User, label: t('profile.features.savedPrograms') },
                                ].map((feature, index) => (
                                    <MotiView
                                        key={index}
                                        from={{ opacity: 0, translateY: 10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ type: 'spring', delay: 700 + index * 100 }}
                                        style={styles.featureItem}
                                    >
                                        <View style={[styles.featureIcon, { backgroundColor: theme.background }]}>
                                            <feature.Icon size={20} color={theme.textSecondary} />
                                        </View>
                                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>{feature.label}</Text>
                                    </MotiView>
                                ))}
                            </View>
                        </MotiView>

                        {/* Guest Settings Section */}
                        <View style={[styles.guestSettingsSection, { backgroundColor: theme.card }]}>
                            <Text style={[styles.guestSettingsTitle, { color: theme.textSecondary }]}>{t('profile.settings')}</Text>
                            {guestSettingsItems.map((item, index) => (
                                <MotiView
                                    key={item.label}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: 'spring', delay: 800 + index * 80 }}
                                >
                                    <Pressable
                                        style={[
                                            styles.guestMenuItem,
                                            index < guestSettingsItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                                        ]}
                                        onPress={() => handleMenuPress(item.action)}
                                    >
                                        <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                                            <item.Icon size={22} color={item.color} />
                                        </View>
                                        <View style={styles.menuContent}>
                                            <Text style={[styles.menuTitle, { color: theme.text }]}>{item.label}</Text>
                                            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        {item.isToggle ? (
                                            <Switch
                                                value={isDark}
                                                onValueChange={toggleTheme}
                                                trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                                                thumbColor={isDark ? '#FFFFFF' : '#F3F4F6'}
                                            />
                                        ) : (
                                            <ChevronRight size={20} color={theme.textMuted} />
                                        )}
                                    </Pressable>
                                </MotiView>
                            ))}
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background, direction: isRTL ? 'rtl' : 'ltr' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView edges={['top']} style={{ backgroundColor: theme.primary }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <MotiView
                            animate={{ rotate: '360deg' }}
                            transition={{ type: 'timing', duration: 20000, loop: true }}
                            style={styles.headerBlob}
                        />
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>{t('profile.title')}</Text>
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
                                    {profile?.profile_photo_url ? (
                                        <Image
                                            source={{ uri: profile.profile_photo_url }}
                                            style={{ width: 60, height: 60, borderRadius: 30 }}
                                        />
                                    ) : (
                                        <User size={32} color="#C62828" />
                                    )}
                                </View>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.userName}>
                                        {profile?.full_name || user.email?.split('@')[0] || 'Student'}
                                    </Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                    {completionPercentage < 100 && (
                                        <View style={styles.completionBadge}>
                                            <Text style={styles.completionText}>
                                                {t('profile.complete', { percent: completionPercentage })}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Stats */}
                            <View style={styles.statsRow}>
                                {[
                                    { value: applications.length.toString(), label: t('profile.stats.applications'), action: 'dashboard' },
                                    { value: '0', label: t('profile.stats.saved'), action: 'saved' },
                                    { value: unreadCount.toString(), label: t('profile.stats.messages'), action: 'messages' },
                                ].map((stat, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => {
                                            if (stat.action === 'dashboard') {
                                                router.push('/dashboard');
                                            } else if (stat.action === 'messages') {
                                                router.push('/messages');
                                            } else if (stat.action === 'saved') {
                                                router.push('/profile/saved');
                                            }
                                        }}
                                        style={styles.statWrapper}
                                    >
                                        <MotiView
                                            from={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: 'spring', delay: 300 + index * 100 }}
                                            style={styles.statItem}
                                        >
                                            <Text style={styles.statNumber}>{stat.value}</Text>
                                            <Text style={styles.statLabel}>{stat.label}</Text>
                                        </MotiView>
                                    </Pressable>
                                ))}
                            </View>
                        </MotiView>
                    </View>

                    {/* Menu Items */}
                    <View style={[styles.menuSection, { backgroundColor: theme.card }]}>
                        {menuItems.map((item, index) => (
                            <MotiView
                                key={item.label}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ type: 'spring', delay: 400 + index * 80 }}
                            >
                                <Pressable
                                    style={[styles.menuItem, { borderBottomColor: theme.border }]}
                                    onPress={() => handleMenuPress(item.action)}
                                >
                                    <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                                        {item.action === 'dark_mode' ? (
                                            isDark ? <Moon size={22} color={item.color} /> : <Sun size={22} color={item.color} />
                                        ) : (
                                            <item.Icon size={22} color={item.color} />
                                        )}
                                        {item.action === 'notifications' && unreadCount > 0 && (
                                            <View style={styles.notificationBadge}>
                                                <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.menuContent}>
                                        <Text style={[styles.menuTitle, { color: theme.text }]}>{item.label}</Text>
                                        <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                                            {item.action === 'dark_mode'
                                                ? (isDark ? t('profile.menu.darkActive') : t('profile.menu.lightActive'))
                                                : item.action === 'notifications' && unreadCount > 0
                                                    ? t('profile.unreadMessages_plural', { count: unreadCount })
                                                    : item.description}
                                        </Text>
                                    </View>
                                    {item.action === 'dark_mode' ? (
                                        <Switch
                                            value={isDark}
                                            onValueChange={toggleTheme}
                                            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                                            thumbColor={isDark ? '#FFFFFF' : '#F3F4F6'}
                                        />
                                    ) : (
                                        <ChevronRight size={20} color={theme.textMuted} />
                                    )}
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
                            <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
                        </Pressable>
                        <Text style={styles.versionText}>{t('profile.version', { version: '1.0.0' })}</Text>
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
        marginStart: 16,
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
    statWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    statItem: {
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
        marginStart: 14,
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
    completionBadge: {
        marginTop: 6,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    completionText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#D97706',
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    notificationBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFF',
    },
    guestScrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    guestSettingsSection: {
        marginTop: 20,
        borderRadius: 18,
        overflow: 'hidden',
    },
    guestSettingsTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    guestMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
});
