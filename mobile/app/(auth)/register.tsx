import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp, loading } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
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
        const result = await signUp(email, password, {
            first_name: firstName,
            last_name: lastName,
        });

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <SafeAreaView style={styles.container}>
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.successContent}
                >
                    <Text style={styles.successIcon}>✅</Text>
                    <Text style={styles.successTitle}>Registration Successful!</Text>
                    <Text style={styles.successText}>
                        Please check your email to verify your account.
                    </Text>
                    <Pressable
                        style={styles.signInButton}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.signInButtonText}>Go to Login</Text>
                    </Pressable>
                </MotiView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring' }}
                        style={styles.content}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Pressable onPress={() => router.back()} style={styles.backBtn}>
                                <Text style={styles.backBtnText}>← Back</Text>
                            </Pressable>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join StudyIn to start your journey</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.nameRow}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>First Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First"
                                        placeholderTextColor="#9CA3AF"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Last"
                                        placeholderTextColor="#9CA3AF"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
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

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            {error ? (
                                <MotiView
                                    from={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Text style={styles.errorText}>{error}</Text>
                                </MotiView>
                            ) : null}

                            <Pressable
                                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signInButtonText}>Create Account</Text>
                                )}
                            </Pressable>
                        </View>

                        {/* Login Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Pressable onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.registerLink}>Sign In</Text>
                            </Pressable>
                        </View>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    successContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        fontSize: 64,
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    successText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    header: {
        marginBottom: 32,
    },
    backBtn: {
        marginBottom: 24,
    },
    backBtnText: {
        color: '#6B7280',
        fontSize: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    form: {
        marginBottom: 24,
    },
    nameRow: {
        flexDirection: 'row',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    signInButton: {
        backgroundColor: '#DC2626',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    registerLink: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '600',
    },
});
