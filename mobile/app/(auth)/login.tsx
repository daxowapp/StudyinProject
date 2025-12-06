import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        const result = await signIn(email, password);

        if (result.error) {
            setError(result.error);
        } else {
            router.replace('/(tabs)/profile');
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring' }}
                        style={styles.content}
                    >
                        {/* Back Button */}
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <Text style={styles.backBtnText}>← Back</Text>
                        </Pressable>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logo}>🎓</Text>
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputIcon}>📧</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#71717A"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputIcon}>🔒</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#71717A"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                                        <Text style={styles.showPassword}>{showPassword ? '🙈' : '👁️'}</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {error ? (
                                <MotiView
                                    from={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={styles.errorContainer}
                                >
                                    <Text style={styles.errorIcon}>⚠️</Text>
                                    <Text style={styles.errorText}>{error}</Text>
                                </MotiView>
                            ) : null}

                            <Pressable
                                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signInButtonText}>Sign In</Text>
                                )}
                            </Pressable>

                            <Pressable style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </Pressable>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login */}
                        <View style={styles.socialButtons}>
                            <Pressable style={styles.socialBtn}>
                                <Text style={styles.socialIcon}>🍎</Text>
                                <Text style={styles.socialText}>Apple</Text>
                            </Pressable>
                            <Pressable style={styles.socialBtn}>
                                <Text style={styles.socialIcon}>G</Text>
                                <Text style={styles.socialText}>Google</Text>
                            </Pressable>
                        </View>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Pressable onPress={() => router.push('/(auth)/register')}>
                                <Text style={styles.registerLink}>Sign Up</Text>
                            </Pressable>
                        </View>
                    </MotiView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0B',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    backBtn: {
        position: 'absolute',
        top: 20,
        left: 0,
    },
    backBtnText: {
        color: '#71717A',
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logo: {
        fontSize: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#71717A',
    },
    form: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        borderWidth: 1,
        borderColor: '#27272A',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    showPassword: {
        fontSize: 18,
        padding: 4,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    errorIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        flex: 1,
    },
    signInButton: {
        backgroundColor: '#DC2626',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 16,
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    forgotPassword: {
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#27272A',
    },
    dividerText: {
        color: '#71717A',
        fontSize: 13,
        marginHorizontal: 16,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#18181B',
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    socialIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    socialText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#71717A',
        fontSize: 14,
    },
    registerLink: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '700',
    },
});
