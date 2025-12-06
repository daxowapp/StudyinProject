import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        const result = await signUp(email, password);

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
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
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
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Start your educational journey today</Text>
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputIcon}>👤</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your full name"
                                            placeholderTextColor="#71717A"
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                </View>

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
                                            placeholder="Create a password"
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

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Confirm Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputIcon}>🔒</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm your password"
                                            placeholderTextColor="#71717A"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showPassword}
                                        />
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
                                    style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                                    onPress={handleRegister}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.signUpButtonText}>Create Account</Text>
                                    )}
                                </Pressable>

                                {/* Terms */}
                                <Text style={styles.termsText}>
                                    By creating an account, you agree to our{' '}
                                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                                    <Text style={styles.termsLink}>Privacy Policy</Text>
                                </Text>
                            </View>

                            {/* Login Link */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <Pressable onPress={() => router.push('/(auth)/login')}>
                                    <Text style={styles.loginLink}>Sign In</Text>
                                </Pressable>
                            </View>
                        </MotiView>
                    </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    backBtn: {
        marginBottom: 24,
    },
    backBtnText: {
        color: '#71717A',
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
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
        marginBottom: 16,
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
    signUpButton: {
        backgroundColor: '#DC2626',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 16,
    },
    signUpButtonDisabled: {
        opacity: 0.7,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    termsText: {
        fontSize: 13,
        color: '#71717A',
        textAlign: 'center',
        lineHeight: 20,
    },
    termsLink: {
        color: '#DC2626',
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
    loginLink: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '700',
    },
});
