import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, GraduationCap } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
            } else {
                router.replace('/(tabs)/profile');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={['#991B1B', '#B91C1C', '#DC2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <ArrowLeft size={24} color="#FFF" />
                        </Pressable>
                    </View>
                </SafeAreaView>

                {/* Logo and Title */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.logoSection}
                >
                    <Image
                        source={require('../../assets/logo-white.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text style={styles.subtitleText}>Sign in to continue your journey</Text>
                </MotiView>
            </LinearGradient>

            {/* Form Card */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', delay: 200 }}
                        style={styles.formCard}
                    >
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={[styles.inputContainer, email && styles.inputContainerFocused]}>
                                <Mail size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.inputContainer, password && styles.inputContainerFocused]}>
                                <Lock size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    {showPassword ? (
                                        <EyeOff size={20} color="#9CA3AF" />
                                    ) : (
                                        <Eye size={20} color="#9CA3AF" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <MotiView
                                from={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={styles.errorContainer}
                            >
                                <AlertCircle size={18} color="#DC2626" />
                                <Text style={styles.errorText}>{error}</Text>
                            </MotiView>
                        ) : null}

                        {/* Sign In Button */}
                        <Pressable
                            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#C62828', '#DC2626']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.signInGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signInButtonText}>Sign In</Text>
                                )}
                            </LinearGradient>
                        </Pressable>

                        {/* Forgot Password */}
                        <Pressable style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Buttons */}
                        <View style={styles.socialButtons}>
                            <Pressable style={styles.socialBtn}>
                                <Text style={styles.socialIcon}>G</Text>
                                <Text style={styles.socialText}>Google</Text>
                            </Pressable>
                            <Pressable style={styles.socialBtn} onPress={async () => {
                                try {
                                    setLoading(true);
                                    const credential = await AppleAuthentication.signInAsync({
                                        requestedScopes: [
                                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                        ],
                                    });

                                    if (credential.identityToken) {
                                        const { error } = await supabase.auth.signInWithIdToken({
                                            provider: 'apple',
                                            token: credential.identityToken,
                                        });
                                        if (error) throw error;
                                        router.replace('/(tabs)/profile');
                                    }
                                } catch (e: any) {
                                    if (e.code === 'ERR_REQUEST_CANCELED') {
                                        // handle that the user canceled the sign-in flow
                                    } else {
                                        setError(e.message || 'Apple Sign In failed');
                                    }
                                } finally {
                                    setLoading(false);
                                }
                            }}>
                                <Image
                                    source={require('../../assets/apple-logo.png')}
                                    style={{ width: 20, height: 20, tintColor: '#000' }}
                                    resizeMode="contain"
                                />
                                <Text style={styles.socialText}>Apple</Text>
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
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoSection: {
        alignItems: 'center',
        paddingTop: 20,
    },
    logo: {
        width: 140,
        height: 50,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
    },
    keyboardView: {
        flex: 1,
        marginTop: -20,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    inputContainerFocused: {
        borderColor: '#C62828',
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeBtn: {
        padding: 4,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        gap: 10,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        flex: 1,
    },
    signInButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 16,
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    forgotPassword: {
        alignItems: 'center',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#C62828',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        color: '#9CA3AF',
        fontSize: 13,
        marginHorizontal: 16,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    socialIcon: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    socialText: {
        color: '#374151',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    registerLink: {
        color: '#C62828',
        fontSize: 14,
        fontWeight: '700',
    },
});
