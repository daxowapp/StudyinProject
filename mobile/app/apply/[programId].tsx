import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator, Alert, Platform, Modal, FlatList } from 'react-native';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, User, FileText, Check, ChevronRight, Phone, Mail, MapPin, ChevronDown, CheckCircle, Upload, X } from 'lucide-react-native';
import { useProgram, useAuth, useUserProfile } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { MotiView } from 'moti';

// Steps matching website (Education removed)
const STEPS = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Documents', icon: FileText },
    { id: 3, title: 'Review', icon: Check },
];

export default function ApplyScreen() {
    const { programId } = useLocalSearchParams<{ programId: string }>();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { program, loading: programLoading } = useProgram(programId);
    const { profile } = useUserProfile();

    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Dynamic Data
    const [intakes, setIntakes] = useState<any[]>([]);
    const [requirements, setRequirements] = useState<any[]>([]);
    const [existingDocs, setExistingDocs] = useState<any[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        studentName: '',
        email: '',
        phone: '',
        nationality: '',
        passportNumber: '',
        preferredIntake: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelationship: '',
    });

    // Upload State
    const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({});
    const [reusedDocuments, setReusedDocuments] = useState<Record<string, any>>({});
    const [uploading, setUploading] = useState<Record<string, boolean>>({});

    // Modals
    const [intakeModalVisible, setIntakeModalVisible] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (programId && user) {
            fetchDependencyData();
        }
    }, [programId, user]);

    // Pre-fill Profile
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                studentName: profile.full_name || prev.studentName,
                email: user?.email || prev.email,
                phone: profile.phone || prev.phone,
                nationality: profile.nationality || prev.nationality,
                passportNumber: profile.passport_number || prev.passportNumber,
                emergencyName: profile.emergency_contact_name || prev.emergencyName,
                emergencyPhone: profile.emergency_contact_phone || prev.emergencyPhone,
                emergencyRelationship: prev.emergencyRelationship, // Not usually in profile but kept for parity
            }));
        } else if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
    }, [profile, user]);

    const fetchDependencyData = async () => {
        try {
            setLoadingData(true);

            // 1. Fetch Program details to get university_id (if not loaded)
            if (!program) return; // Wait for program hook

            // 2. Fetch Intakes
            const { data: intakeData } = await supabase
                .from('intakes')
                .select(`
                    id, name, start_date, is_open,
                    academic_year:academic_year_id (is_active)
                `)
                .eq('is_open', true)
                .order('start_date', { ascending: true });

            if (intakeData) {
                const validIntakes = intakeData.filter(i => (i.academic_year as any)?.is_active);
                setIntakes(validIntakes);
                if (validIntakes.length > 0 && !formData.preferredIntake) {
                    setFormData(prev => ({ ...prev, preferredIntake: validIntakes[0].name }));
                }
            }

            // 3. Fetch Requirements
            const { data: reqData } = await supabase
                .from('university_admission_requirements')
                .select(`
                    *,
                    requirement:requirement_id (id, title, description, requirement_type)
                `)
                .eq('university_id', program.university_id);

            // Filter by level if possible, for now take all
            if (reqData) setRequirements(reqData);

            // 4. Fetch User's Existing Documents
            if (user) {
                const { data: docData } = await supabase
                    .from('student_documents')
                    .select('*')
                    .eq('student_id', user.id);
                if (docData) setExistingDocs(docData);
            }

        } catch (error) {
            console.error('Error fetching dependency data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    // Re-trigger fetch if program loads late
    useEffect(() => {
        if (program && !intakes.length) fetchDependencyData();
    }, [program]);


    const handlePickDocument = async (requirementId: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/jpeg', 'image/png'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];

            // Upload immediately
            await uploadFile(requirementId, file);

        } catch (err) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const uploadFile = async (requirementId: string, file: any) => {
        setUploading(prev => ({ ...prev, [requirementId]: true }));
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}/${requirementId}/${Date.now()}.${fileExt}`;

            // Read file (Expo handles native file URI for upload with FormData usually, 
            // but Supabase JS client expects Blob/File. In RN with Supabase, usage involves FormData wrapping)

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf',
            } as any);

            const { data, error } = await supabase.storage
                .from('application-documents')
                .upload(fileName, formData, {
                    contentType: file.mimeType || 'application/pdf',
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('application-documents')
                .getPublicUrl(fileName);

            setUploadedDocuments(prev => ({
                ...prev,
                [requirementId]: {
                    ...file,
                    publicUrl,
                    fileName
                }
            }));

            // Clear reuse if new upload
            const newReused = { ...reusedDocuments };
            delete newReused[requirementId];
            setReusedDocuments(newReused);

        } catch (error: any) {
            Alert.alert('Upload Failed', error.message);
        } finally {
            setUploading(prev => ({ ...prev, [requirementId]: false }));
        }
    };

    const handleReuseDocument = (requirementId: string, docType: string) => {
        const existing = existingDocs.find(d => d.document_type === docType);
        if (existing) {
            setReusedDocuments(prev => ({
                ...prev,
                [requirementId]: existing
            }));
            // Clear upload if exists
            const newUploaded = { ...uploadedDocuments };
            delete newUploaded[requirementId];
            setUploadedDocuments(newUploaded);
        }
    };

    const validateStep = (step: number) => {
        if (step === 1) {
            return formData.studentName && formData.email && formData.phone &&
                formData.nationality && formData.passportNumber && formData.preferredIntake &&
                formData.emergencyName && formData.emergencyPhone;
        }
        if (step === 2) {
            // Check mandatory requirements
            const mandatory = requirements.filter(r => r.is_required);
            for (const req of mandatory) {
                if (!uploadedDocuments[req.requirement.id] && !reusedDocuments[req.requirement.id]) return false;
            }
            return true;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!user || !program) return;
        setSubmitting(true);

        try {
            const totalFee = (program.application_fee || 0) + (program.service_fee || 0);
            const requiresPayment = (program as any).force_payment && totalFee > 0;

            const applicationData = {
                student_name: formData.studentName,
                student_email: formData.email,
                student_phone: formData.phone,
                student_country: formData.nationality,
                student_passport: formData.passportNumber,
                preferred_intake: formData.preferredIntake,
                emergency_contact_name: formData.emergencyName,
                emergency_contact_phone: formData.emergencyPhone,
                emergency_contact_relationship: formData.emergencyRelationship,
                status: requiresPayment ? 'pending_payment' : 'submitted',
                payment_amount: totalFee,
                payment_currency: (program as any).currency || 'RMB',
                documents_complete: true,
            };

            const documentsData = Object.entries(uploadedDocuments).map(([reqId, file]: [string, any]) => ({
                requirement_id: reqId,
                document_name: file.name,
                document_type: file.mimeType,
                file_url: file.publicUrl,
                file_size: file.size,
                file_type: file.name.split('.').pop(),
            })).concat(Object.entries(reusedDocuments).map(([reqId, doc]: [string, any]) => ({
                requirement_id: reqId,
                document_name: doc.document_name,
                document_type: doc.file_type || 'application/pdf',
                file_url: doc.file_url,
                file_size: doc.file_size || 0,
                file_type: (doc.document_name || '').split('.').pop(),
            })));

            const profileData = {
                full_name: formData.studentName,
                phone: formData.phone,
                nationality: formData.nationality,
                passport_number: formData.passportNumber,
                emergency_contact_name: formData.emergencyName,
                emergency_contact_phone: formData.emergencyPhone,
                emergency_contact_relationship: formData.emergencyRelationship,
            };

            const { data, error } = await supabase.rpc('submit_application', {
                p_student_id: user.id,
                p_program_id: program.id,
                p_application_data: applicationData,
                p_documents_data: documentsData,
                p_profile_data: profileData
            });

            if (error) throw error;
            if (data && !data.success) throw new Error(data.error);

            // Upsert documents for reuse
            // ... (Simplified: assume server handles or skip for now to save complexity)

            Alert.alert('Success', 'Application submitted successfully!', [
                { text: 'OK', onPress: () => router.replace('/dashboard') }
            ]);

        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || programLoading || (loadingData && currentStep === 1)) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C62828" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Please Login</Text>
                    <Pressable onPress={() => router.push('/(auth)/login')}><Text style={{ color: 'red' }}>Login</Text></Pressable>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={24} color="#FFF" />
                        </Pressable>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerTitle}>Apply Now</Text>
                            <Text style={styles.headerSubtitle} numberOfLines={1}>{program?.title}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Steps */}
            <View style={styles.stepsContainer}>
                {STEPS.map((step, index) => (
                    <View key={step.id} style={styles.stepWrapper}>
                        <View style={[styles.stepCircle, currentStep >= step.id && styles.stepCircleActive]}>
                            <step.icon size={14} color={currentStep >= step.id ? '#FFF' : '#9CA3AF'} />
                        </View>
                        {index < STEPS.length - 1 && (
                            <View style={[styles.stepLine, currentStep > step.id && styles.stepLineActive]} />
                        )}
                    </View>
                ))}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {currentStep === 1 && (
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput style={styles.input} value={formData.studentName} onChangeText={t => setFormData({ ...formData, studentName: t })} placeholder="Full Name" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput style={styles.input} value={formData.email} onChangeText={t => setFormData({ ...formData, email: t })} placeholder="Email" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone *</Text>
                            <TextInput style={styles.input} value={formData.phone} onChangeText={t => setFormData({ ...formData, phone: t })} placeholder="With country code" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Country *</Text>
                            <TextInput style={styles.input} value={formData.nationality} onChangeText={t => setFormData({ ...formData, nationality: t })} placeholder="Country" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Passport Number *</Text>
                            <TextInput style={styles.input} value={formData.passportNumber} onChangeText={t => setFormData({ ...formData, passportNumber: t })} placeholder="Passport No." />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Preferred Intake *</Text>
                            <Pressable style={styles.selectInput} onPress={() => setIntakeModalVisible(true)}>
                                <Text style={formData.preferredIntake ? styles.inputText : styles.placeholderText}>
                                    {formData.preferredIntake || "Select Intake"}
                                </Text>
                                <ChevronDown size={20} color="#666" />
                            </Pressable>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Emergency Contact</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contact Name *</Text>
                            <TextInput style={styles.input} value={formData.emergencyName} onChangeText={t => setFormData({ ...formData, emergencyName: t })} placeholder="Name" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contact Phone *</Text>
                            <TextInput style={styles.input} value={formData.emergencyPhone} onChangeText={t => setFormData({ ...formData, emergencyPhone: t })} placeholder="Phone" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Relationship *</Text>
                            <TextInput style={styles.input} value={formData.emergencyRelationship} onChangeText={t => setFormData({ ...formData, emergencyRelationship: t })} placeholder="e.g. Parent" />
                        </View>
                    </View>
                )}

                {currentStep === 2 && (
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Required Documents</Text>
                        {requirements.map((req) => {
                            const isUploaded = !!uploadedDocuments[req.requirement.id];
                            const isReused = !!reusedDocuments[req.requirement.id];
                            const docType = req.requirement.title.toLowerCase().replace(/\s+/g, '_');
                            const canReuse = existingDocs.find(d => d.document_type === docType) && !isUploaded && !isReused;

                            return (
                                <View key={req.requirement.id} style={styles.docCard}>
                                    <View style={styles.docHeader}>
                                        <Text style={styles.docTitle}>{req.requirement.title} {req.is_required && <Text style={{ color: 'red' }}>*</Text>}</Text>
                                        {(isUploaded || isReused) && <CheckCircle size={20} color="green" />}
                                    </View>
                                    <Text style={styles.docDesc}>{req.requirement.description}</Text>

                                    {canReuse && (
                                        <Pressable style={styles.reuseBtn} onPress={() => handleReuseDocument(req.requirement.id, docType)}>
                                            <Text style={styles.reuseText}>Use existing {docType.replace('_', ' ')}</Text>
                                        </Pressable>
                                    )}

                                    <Pressable
                                        style={[styles.uploadBtn, (isUploaded || isReused) && styles.uploadBtnDone]}
                                        onPress={() => handlePickDocument(req.requirement.id)}
                                        disabled={uploading[req.requirement.id]}
                                    >
                                        {uploading[req.requirement.id] ? (
                                            <Loader size={20} color="#FFF" />
                                        ) : (
                                            <>
                                                <Upload size={18} color={isUploaded || isReused ? "green" : "#C62828"} />
                                                <Text style={[styles.uploadText, (isUploaded || isReused) && { color: 'green' }]}>
                                                    {isUploaded || isReused ? 'Replace File' : 'Upload File'}
                                                </Text>
                                            </>
                                        )}
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                )}

                {currentStep === 3 && (
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Review Application</Text>
                        {/* Simple Review Cards */}
                        <View style={styles.reviewCard}>
                            <Text style={styles.label}>Program</Text>
                            <Text style={styles.value}>{program?.title}</Text>
                        </View>
                        <View style={styles.reviewCard}>
                            <Text style={styles.label}>Applicant</Text>
                            <Text style={styles.value}>{formData.studentName}</Text>
                            <Text style={styles.value}>{formData.email}</Text>
                        </View>
                        <View style={styles.reviewCard}>
                            <Text style={styles.label}>Documents</Text>
                            <Text style={styles.value}>{Object.keys(uploadedDocuments).length + Object.keys(reusedDocuments).length} documents attached</Text>
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.bottomBar}>
                <SafeAreaView edges={['bottom']}>
                    <View style={styles.bottomRow}>
                        {currentStep > 1 && (
                            <Pressable style={styles.backBtn} onPress={() => setCurrentStep(prev => prev - 1)}>
                                <Text style={styles.backText}>Back</Text>
                            </Pressable>
                        )}
                        <Pressable
                            style={[styles.nextBtn, currentStep === 1 && { flex: 1 }]}
                            onPress={() => {
                                if (currentStep < 3) {
                                    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
                                    else Alert.alert('Required', 'Please fill all required fields/documents');
                                } else {
                                    handleSubmit();
                                }
                            }}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader size={24} color="#FFF" />
                            ) : (
                                <Text style={styles.nextText}>{currentStep === 3 ? 'Submit Application' : 'Continue'}</Text>
                            )}
                        </Pressable>
                    </View>
                </SafeAreaView>
            </View>

            {/* Intake Modal */}
            <Modal visible={intakeModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Intake</Text>
                            <Pressable onPress={() => setIntakeModalVisible(false)}>
                                <X size={24} color="#000" />
                            </Pressable>
                        </View>
                        <FlatList
                            data={intakes}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Pressable style={styles.modalItem} onPress={() => {
                                    setFormData(prev => ({ ...prev, preferredIntake: item.name }));
                                    setIntakeModalVisible(false);
                                }}>
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                    {formData.preferredIntake === item.name && <Check size={20} color="#C62828" />}
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, gap: 16 },
    backButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
    stepsContainer: { flexDirection: 'row', justifyContent: 'center', padding: 20, backgroundColor: '#FFF' },
    stepWrapper: { flexDirection: 'row', alignItems: 'center' },
    stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
    stepCircleActive: { backgroundColor: '#C62828' },
    stepLine: { width: 40, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
    stepLineActive: { backgroundColor: '#C62828' },
    content: { flex: 1, padding: 20 },
    formSection: { gap: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: '600', color: '#374151' },
    input: { backgroundColor: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', color: '#111' },
    selectInput: { backgroundColor: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between' },
    inputText: { color: '#111' },
    placeholderText: { color: '#9CA3AF' },
    docCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', gap: 12 },
    docHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    docTitle: { fontWeight: '600', color: '#111' },
    docDesc: { fontSize: 12, color: '#666' },
    reuseBtn: { backgroundColor: '#EFF6FF', padding: 10, borderRadius: 8, alignItems: 'center' },
    reuseText: { color: '#2563EB', fontWeight: '500', fontSize: 13 },
    uploadBtn: { borderWidth: 1, borderColor: '#C62828', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', gap: 8, alignItems: 'center' },
    uploadBtnDone: { borderColor: 'green', backgroundColor: '#F0FDF4' },
    uploadText: { color: '#C62828', fontWeight: '600' },
    bottomBar: { backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
    bottomRow: { flexDirection: 'row', gap: 12 },
    backBtn: { flex: 1, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, alignItems: 'center' },
    backText: { fontWeight: '600', color: '#374151' },
    nextBtn: { flex: 2, padding: 16, backgroundColor: '#C62828', borderRadius: 12, alignItems: 'center' },
    nextText: { fontWeight: '700', color: '#FFF' },
    value: { fontSize: 15, color: '#111', marginTop: 4 },
    reviewCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between' },
    modalItemText: { fontSize: 16, color: '#111' }
});
