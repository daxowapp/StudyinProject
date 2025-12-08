import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, MapPin, Users, Camera, Save, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfile, useAuth } from '../../hooks/useData';
import * as ImagePicker from 'expo-image-picker';

// Country codes for phone selection
const COUNTRY_CODES = [
    { id: 'CN', code: '+86', country: 'China' },
    { id: 'US', code: '+1', country: 'USA' },
    { id: 'GB', code: '+44', country: 'UK' },
    { id: 'AE', code: '+971', country: 'UAE' },
    { id: 'SA', code: '+966', country: 'Saudi' },
    { id: 'IN', code: '+91', country: 'India' },
    { id: 'PK', code: '+92', country: 'Pakistan' },
    { id: 'BD', code: '+880', country: 'Bangladesh' },
    { id: 'NG', code: '+234', country: 'Nigeria' },
    { id: 'EG', code: '+20', country: 'Egypt' },
];

export default function ProfileEditScreen() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { profile, loading, saving, updateProfile, uploadProfilePhoto, completionPercentage } = useUserProfile();

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        phone_country_code: '+86',
        nationality: '',
        passport_number: '',
        date_of_birth: '',
        address: '',
        city: '',
        postal_code: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_phone_code: '+86',
        emergency_contact_relationship: '',
    });

    // Initialize form with profile data
    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                phone_country_code: profile.phone_country_code || '+86',
                nationality: profile.nationality || '',
                passport_number: profile.passport_number || '',
                date_of_birth: profile.date_of_birth || '',
                address: profile.address || '',
                city: profile.city || '',
                postal_code: profile.postal_code || '',
                emergency_contact_name: profile.emergency_contact_name || '',
                emergency_contact_phone: profile.emergency_contact_phone || '',
                emergency_phone_code: profile.emergency_phone_code || '+86',
                emergency_contact_relationship: profile.emergency_contact_relationship || '',
            });
        }
    }, [profile]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        const result = await updateProfile(formData);
        if (result.success) {
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Error', result.error || 'Failed to update profile');
        }
    };

    const handlePhotoUpload = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const uploadResult = await uploadProfilePhoto({
                    uri: asset.uri,
                    name: `profile_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                });

                if (uploadResult.success) {
                    Alert.alert('Success', 'Profile photo updated!');
                } else {
                    Alert.alert('Error', uploadResult.error || 'Failed to upload photo');
                }
            }
        } catch (error) {
            console.error('Photo upload error:', error);
            Alert.alert('Error', 'Failed to select photo');
        }
    };

    // Wait for auth to load before checking user
    if (authLoading || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C62828" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    // Only redirect if auth is loaded AND no user
    if (!authLoading && !user) {
        router.replace('/(auth)/login');
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={22} color="#FFF" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                        <Pressable
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#C62828" />
                            ) : (
                                <Save size={20} color="#C62828" />
                            )}
                        </Pressable>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Completion Progress */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={styles.progressCard}
                >
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Profile Completion</Text>
                        <Text style={styles.progressValue}>{completionPercentage}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
                    </View>
                    <Text style={styles.progressHint}>Complete your profile for faster applications</Text>
                </MotiView>

                {/* Profile Photo */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 150 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeader}>
                        <Camera size={18} color="#C62828" />
                        <Text style={styles.sectionTitle}>Profile Photo</Text>
                    </View>
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            {profile?.profile_photo_url ? (
                                <Image source={{ uri: profile.profile_photo_url }} style={styles.profilePhoto} />
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <User size={40} color="#C62828" />
                                </View>
                            )}
                        </View>
                        <Pressable style={styles.uploadButton} onPress={handlePhotoUpload}>
                            <Camera size={18} color="#FFF" />
                            <Text style={styles.uploadButtonText}>Change Photo</Text>
                        </Pressable>
                    </View>
                </MotiView>

                {/* Personal Information */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 200 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeader}>
                        <User size={18} color="#C62828" />
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.full_name}
                            onChangeText={(v) => handleInputChange('full_name', v)}
                            placeholder="Enter your full name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.date_of_birth}
                            onChangeText={(v) => handleInputChange('date_of_birth', v)}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryCodeBox}>
                                <Text style={styles.countryCodeText}>{formData.phone_country_code}</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.phoneInput]}
                                value={formData.phone}
                                onChangeText={(v) => handleInputChange('phone', v)}
                                placeholder="Phone number"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nationality</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.nationality}
                            onChangeText={(v) => handleInputChange('nationality', v)}
                            placeholder="e.g., Egyptian, Indian"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Passport Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.passport_number}
                            onChangeText={(v) => handleInputChange('passport_number', v)}
                            placeholder="A12345678"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </MotiView>

                {/* Address */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 250 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeader}>
                        <MapPin size={18} color="#C62828" />
                        <Text style={styles.sectionTitle}>Address</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Street Address</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address}
                            onChangeText={(v) => handleInputChange('address', v)}
                            placeholder="123 Main Street"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.rowInputs}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>City</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.city}
                                onChangeText={(v) => handleInputChange('city', v)}
                                placeholder="City"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>Postal Code</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.postal_code}
                                onChangeText={(v) => handleInputChange('postal_code', v)}
                                placeholder="12345"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </MotiView>

                {/* Emergency Contact */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 300 }}
                    style={styles.sectionCard}
                >
                    <View style={styles.sectionHeader}>
                        <Users size={18} color="#C62828" />
                        <Text style={styles.sectionTitle}>Emergency Contact</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Contact Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.emergency_contact_name}
                            onChangeText={(v) => handleInputChange('emergency_contact_name', v)}
                            placeholder="Emergency contact name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Contact Phone</Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryCodeBox}>
                                <Text style={styles.countryCodeText}>{formData.emergency_phone_code}</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.phoneInput]}
                                value={formData.emergency_contact_phone}
                                onChangeText={(v) => handleInputChange('emergency_contact_phone', v)}
                                placeholder="Phone number"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Relationship</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.emergency_contact_relationship}
                            onChangeText={(v) => handleInputChange('emergency_contact_relationship', v)}
                            placeholder="e.g., Mother, Father, Spouse"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </MotiView>

                {/* Save Button */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 350 }}
                >
                    <Pressable
                        style={[styles.saveFullButton, saving && styles.saveFullButtonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Check size={20} color="#FFF" />
                                <Text style={styles.saveFullButtonText}>Save Changes</Text>
                            </>
                        )}
                    </Pressable>
                </MotiView>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
    },
    header: {
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    saveButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    progressCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    progressValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#C62828',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#C62828',
        borderRadius: 3,
    },
    progressHint: {
        marginTop: 8,
        fontSize: 12,
        color: '#9CA3AF',
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    photoSection: {
        alignItems: 'center',
        gap: 16,
    },
    photoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#C62828',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    uploadButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
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
        fontSize: 15,
        color: '#1F2937',
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 10,
    },
    countryCodeBox: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        justifyContent: 'center',
    },
    countryCodeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    phoneInput: {
        flex: 1,
    },
    rowInputs: {
        flexDirection: 'row',
    },
    saveFullButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#C62828',
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: '#C62828',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    saveFullButtonDisabled: {
        opacity: 0.7,
    },
    saveFullButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
