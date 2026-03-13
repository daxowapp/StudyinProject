'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  FileCheck,
  ArrowRight,
  Shield,
  Phone,
  Sparkles,
  GraduationCap,
  Languages,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { createClient } from '@/lib/supabase/client';
import { COUNTRY_CODES } from '@/lib/constants/countries';
import { useTranslations } from 'next-intl';
import {
  GlassCard,
  SectionHeader,
  SmartField,
  SmartSelect,
  DateField,
  TextAreaField,
  PhoneField,
  CountrySelect,
  IntakeSelect,
  DocumentUploadZone,
  ProgressTopBar,
  DocumentNoticePanel,
  ConditionalDocumentSection,
  ServiceBanner,
  CUCAS_UNIVERSAL_DOCS,
  CUCAS_CHINA_DOCS,
  CUCAS_UNDER18_DOCS,
  ReviewSection,
  ReviewField,
  StepNavigation,
  SubStepIndicator,
} from './ApplyFormSteps';
import {
  normalizeLevel,
  isSectionVisible,
  isFieldVisible,
  getRequiredFields,
  getSubStepSections,
} from './formConfig';
import type { SubStepDef } from './formConfig';

interface ApplyFormProps {
  program: {
    id: string;
    intake: string;
    application_fee: number;
    force_payment?: boolean;
    currency?: string;
    university: {
      name: string;
    };
    title: string;
    program_catalog?: {
      title: string;
      level: string;
    };
  };
  requirements: {
    id: string;
    document_name: string;
    is_mandatory: boolean;
    is_required?: boolean;
    requirement: {
      id: string;
      title: string;
      description?: string;
    };
  }[];
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      name?: string;
      phone?: string;
      country?: string;
      passport?: string;
      emergency_contact_name?: string;
      emergency_contact_phone?: string;
      emergency_contact_relationship?: string;
      phone_country_code?: string;
      emergency_phone_code?: string;
    };
  };
  profile?: {
    full_name?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    nationality?: string;
    country?: string;
    passport_number?: string;
    passport?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;
    phone_country_code?: string;
    emergency_phone_code?: string;
    phone_country_id?: string;
    emergency_phone_country_id?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    gender?: string;
  } | null;
  intakes?: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  }[];
}

export function ApplyForm({ program, requirements, user, profile, intakes = [] }: ApplyFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations('Apply');

  // Derive the normalized program level for field visibility
  const programLevel = normalizeLevel(program.program_catalog?.level);

  const [step, setStep] = useState(1); // 1: Info, 2: Documents, 3: Payment, 4: Review
  const [subStep, setSubStep] = useState(0); // Sub-step index within Step 1

  // Build sub-step definitions (level-aware)
  const subStepDefs: SubStepDef[] = getSubStepSections(programLevel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Form state - pre-fill from user metadata or profile
  const [formData, setFormData] = useState({
    // Identity
    first_name: profile?.first_name || (profile?.full_name || user.user_metadata?.full_name || '').split(' ')[0] || '',
    last_name: profile?.last_name || (profile?.full_name || user.user_metadata?.full_name || '').split(' ').slice(1).join(' ') || '',
    student_email: user.email || '',
    student_passport: profile?.passport_number || profile?.passport || user.user_metadata?.passport || '',
    student_country: profile?.nationality || profile?.country || user.user_metadata?.country || '',
    gender: profile?.gender || '',
    date_of_birth: profile?.date_of_birth || '',
    religion: '',
    marital_status: '',
    // Contact
    student_phone: profile?.phone || user.user_metadata?.phone || '',
    wechat_id: '',
    address: profile?.address || '',
    city: profile?.city || '',
    postal_code: profile?.postal_code || '',
    preferred_intake: program.intake || '',
    // Education Background
    highest_education: '',
    school_name: '',
    major_field: '',
    graduation_year: '',
    gpa_score: '',
    // Language Proficiency
    chinese_proficiency: '',
    english_proficiency: '',
    test_score: '',
    // Emergency Contact
    emergency_contact_name: profile?.emergency_contact_name || user.user_metadata?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || user.user_metadata?.emergency_contact_phone || '',
    emergency_contact_relationship: profile?.emergency_contact_relationship || user.user_metadata?.emergency_contact_relationship || '',
  });

  // Backward compat: computed full name
  const studentFullName = `${formData.first_name} ${formData.last_name}`.trim();

  // Helper function to get list of missing required fields (level-aware)
  const requiredFieldKeys = getRequiredFields(programLevel);

  const fieldLabelMap: Record<string, string> = {
    first_name: t('labels.firstName'),
    last_name: t('labels.lastName'),
    student_email: t('labels.email'),
    gender: t('labels.gender'),
    date_of_birth: t('labels.dateOfBirth'),
    student_country: t('labels.country'),
    student_passport: t('labels.passport'),
    student_phone: t('labels.phone'),
    preferred_intake: t('labels.preferredIntake'),
    highest_education: t('labels.highestEducation'),
    school_name: t('labels.schoolName'),
    emergency_contact_name: t('labels.emergencyContactName'),
    emergency_contact_phone: t('labels.emergencyContactPhone'),
    emergency_contact_relationship: t('labels.emergencyContactRelationship'),
  };

  const getMissingFields = () => {
    const missing: string[] = [];
    for (const key of requiredFieldKeys) {
      if (!formData[key as keyof typeof formData]) {
        const label = fieldLabelMap[key];
        if (label) missing.push(label);
      }
    }
    return missing;
  };

  const missingFields = getMissingFields();
  const canProceedToStep2 = missingFields.length === 0;

  const initialPhoneCode = profile?.phone_country_code || user.user_metadata?.phone_country_code || '+86';
  const initialEmergencyCode = profile?.emergency_phone_code || user.user_metadata?.emergency_phone_code || '+86';

  const [phoneCountryCode, setPhoneCountryCode] = useState(initialPhoneCode);
  const [emergencyPhoneCode, setEmergencyPhoneCode] = useState(initialEmergencyCode);

  const [phoneCountryId, setPhoneCountryId] = useState(() =>
    COUNTRY_CODES.find(c => c.code === initialPhoneCode)?.id || 'CN'
  );
  const [emergencyPhoneCountryId, setEmergencyPhoneCountryId] = useState(() =>
    COUNTRY_CODES.find(c => c.code === initialEmergencyCode)?.id || 'CN'
  );

  const handlePhoneCountryChange = (id: string, type: 'student' | 'emergency') => {
    const country = COUNTRY_CODES.find(c => c.id === id);
    if (!country) return;

    if (type === 'student') {
      setPhoneCountryId(id);
      setPhoneCountryCode(country.code);
    } else {
      setEmergencyPhoneCountryId(id);
      setEmergencyPhoneCode(country.code);
    }
  };

  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [existingDocuments, setExistingDocuments] = useState<{ id: string; document_type: string; file_url: string; file_name: string; document_name?: string; file_type?: string; file_size?: number }[]>([]);
  const [reusedDocuments, setReusedDocuments] = useState<Record<string, { id: string; file_url: string; file_name: string; document_name: string; file_type: string; file_size: number }>>({});
  // CUCAS-style conditional sections
  const [studiedInChina, setStudiedInChina] = useState(false);
  const [isUnder18, setIsUnder18] = useState(false);
  const [conditionalUploads, setConditionalUploads] = useState<Record<string, File>>({});

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_id', user.id);
      if (data) setExistingDocuments(data);
    };
    fetchDocuments();
  }, [user.id, supabase]);

  // Scroll to top when step or sub-step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, subStep]);

  const totalFee = program.application_fee || 0;
  const requiresPayment = program.force_payment && totalFee > 0;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle textarea changes
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload
  const handleFileUpload = async (requirementId: string, file: File) => {
    try {
      setLoading(true);
      setError(null);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${requirementId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('application-documents')
        .getPublicUrl(fileName);

      setUploadedDocuments({
        ...uploadedDocuments,
        [requirementId]: file,
      });

      setDocumentUrls({
        ...documentUrls,
        [requirementId]: publicUrl,
      });

      setLoading(false);
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  // Check if all required documents are uploaded
  const allRequiredDocumentsUploaded = () => {
    const mandatoryRequirements = requirements.filter(
      (req) => req.is_required
    );
    return mandatoryRequirements.every((req) => uploadedDocuments[req.requirement.id] || reusedDocuments[req.requirement.id]);
  };

  // Create application
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for RPC
      const applicationData = {
        student_name: studentFullName,
        student_email: formData.student_email,
        student_phone: `${phoneCountryCode} ${formData.student_phone}`,
        student_country: formData.student_country,
        student_passport: formData.student_passport,
        preferred_intake: formData.preferred_intake,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: `${emergencyPhoneCode} ${formData.emergency_contact_phone}`,
        emergency_contact_relationship: formData.emergency_contact_relationship,
        // New fields
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        religion: formData.religion,
        marital_status: formData.marital_status,
        wechat_id: formData.wechat_id,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        highest_education: formData.highest_education,
        school_name: formData.school_name,
        major_field: formData.major_field,
        graduation_year: formData.graduation_year,
        gpa_score: formData.gpa_score,
        chinese_proficiency: formData.chinese_proficiency,
        english_proficiency: formData.english_proficiency,
        test_score: formData.test_score,
        status: requiresPayment ? 'pending_payment' : 'submitted',
        payment_amount: totalFee,
        payment_currency: program.currency || 'RMB',
        documents_complete: allRequiredDocumentsUploaded(),
      };

      const documentsData = Object.entries(documentUrls).map(([reqId, url]) => {
        const uploadedFile = uploadedDocuments[reqId];
        const reusedDoc = reusedDocuments[reqId];

        if (uploadedFile) {
          return {
            requirement_id: reqId,
            document_name: uploadedFile.name,
            document_type: uploadedFile.type,
            file_url: url,
            file_size: uploadedFile.size,
            file_type: uploadedFile.name.split('.').pop(),
          };
        } else if (reusedDoc) {
          return {
            requirement_id: reqId,
            document_name: reusedDoc.document_name,
            document_type: reusedDoc.file_type,
            file_url: url,
            file_size: reusedDoc.file_size,
            file_type: reusedDoc.document_name.split('.').pop(),
          };
        }
        return null;
      }).filter(Boolean);

      const profileData = {
        full_name: studentFullName,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.student_phone,
        phone_country_code: phoneCountryCode,
        nationality: formData.student_country,
        passport_number: formData.student_passport,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postal_code || null,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_phone_code: emergencyPhoneCode,
        emergency_contact_relationship: formData.emergency_contact_relationship,
      };

      // Call RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('submit_application', {
        p_student_id: user.id,
        p_program_id: program.id,
        p_application_data: applicationData,
        p_documents_data: documentsData,
        p_profile_data: profileData
      });

      if (rpcError) throw rpcError;
      if (!rpcData.success) throw new Error(rpcData.error || 'Submission failed');

      const newApplicationId = rpcData.application_id;

      // Save documents to student_documents for reuse in future applications
      // (This is separate from the main submission transaction, so failures here are non-critical)
      for (const [reqId, file] of Object.entries(uploadedDocuments)) {
        const req = requirements.find(r => r.requirement?.id === reqId);
        if (req) {
          const documentType = req.requirement.title.toLowerCase().replace(/\s+/g, '_');

          // Upsert to student_documents (replace if exists)
          const { error: studentDocError } = await supabase
            .from('student_documents')
            .upsert({
              student_id: user.id,
              document_type: documentType,
              document_name: file.name,
              file_url: documentUrls[reqId],
              file_size: file.size,
              file_type: file.type,
              uploaded_at: new Date().toISOString(),
            }, {
              onConflict: 'student_id,document_type'
            });

          if (studentDocError) {
            console.error('Error saving to student_documents:', studentDocError);
          }
        }
      }

      // Show success state
      setApplicationId(newApplicationId);
      setSuccess(true);
      setLoading(false);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setError((err as Error).message || 'Failed to submit application');
      setLoading(false);
    }
  };

  // Step definitions
  const reviewStep = requiresPayment ? 4 : 3;
  const stepDefs = [
    { num: 1, label: t('steps.info'), icon: User, completed: canProceedToStep2 },
    { num: 2, label: t('steps.documents'), icon: FileText, completed: allRequiredDocumentsUploaded() || requirements.length === 0 },
    ...(requiresPayment ? [{ num: 3, label: t('steps.payment'), icon: CreditCard, completed: step > 3 }] : []),
    { num: reviewStep, label: t('steps.review'), icon: FileCheck, completed: false },
  ];

  // Show success screen
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <GlassCard className="p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-14 h-14 text-white" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('review.success')} 🎉
            </h2>
            <p className="text-gray-500 mb-8">{t('review.successMessage')}</p>
          </motion.div>

          <div className="bg-white/80 rounded-xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Application ID</span>
              <span className="text-lg font-bold text-blue-600 font-mono">{applicationId?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Program</span>
              <span className="text-sm font-semibold text-gray-900">{program.program_catalog?.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">University</span>
              <span className="text-sm font-semibold text-gray-900">{program.university.name}</span>
            </div>
          </div>

          <div className="space-y-3 text-left bg-blue-50/80 rounded-xl p-5 mb-8 border border-blue-100">
            <h3 className="font-bold text-gray-900 text-sm">What&apos;s Next?</h3>
            {[
              'You\'ll receive a confirmation email shortly',
              'Our team will review your application within 2-3 business days',
              'Track your application status in your dashboard',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            size="lg"
            className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 rounded-xl h-12 px-8"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top Progress Bar */}
        <ProgressTopBar
          steps={stepDefs}
          currentStep={step}
          program={program}
          onStepClick={(s) => {
            if (stepDefs.find(sd => sd.num === s)?.completed || s === step) setStep(s);
          }}
        />

        {/* Main Content */}
        <div>
            {/* Error Alert */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* ═══ STEP 1: Personal Information (Sub-Step Wizard) ═══ */}
              {step === 1 && (() => {
                const currentDef = subStepDefs[subStep];
                const isLastSubStep = subStep === subStepDefs.length - 1;
                const isFirstSubStep = subStep === 0;

                // Per-sub-step validation: check only the current section's required fields
                const subStepMissing = currentDef?.requiredKeys.filter(
                  (key) => !formData[key as keyof typeof formData]
                ) ?? [];
                const canAdvanceSubStep = subStepMissing.length === 0;

                // Icon lookup for section headers
                const iconMap: Record<string, typeof User> = { User, Phone, MapPin, GraduationCap, Languages, Shield };

                // Sub-step labels for the indicator
                const subStepLabels = subStepDefs.map((d) => {
                  try { return t(`sections.${d.labelKey}`); } catch { return d.labelKey; }
                });

                // Section subtitle helper
                const getSubtitle = (id: string) => {
                  try { return t(`sections.${id}Subtitle`); } catch { return undefined; }
                };

                return (
                  <motion.div key={`step1-sub${subStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <GlassCard className="p-6 md:p-8">
                      {/* Sub-step indicator */}
                      <SubStepIndicator
                        current={subStep}
                        total={subStepDefs.length}
                        labels={subStepLabels}
                      />

                      {/* Section header */}
                      <SectionHeader
                        icon={iconMap[currentDef.iconName] || User}
                        title={subStepLabels[subStep]}
                        subtitle={getSubtitle(currentDef.sectionId)}
                      />

                      {/* ── Section content based on sectionId ── */}
                      <AnimatePresence mode="wait">
                        <motion.div key={currentDef.sectionId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                          {currentDef.sectionId === 'identity' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <SmartField
                                id="first_name" name="first_name" label={t('labels.firstName')}
                                value={formData.first_name} onChange={handleInputChange}
                                placeholder={t('placeholders.firstName')} required prefilled={!!profile?.first_name}
                              />
                              <SmartField
                                id="last_name" name="last_name" label={t('labels.lastName')}
                                value={formData.last_name} onChange={handleInputChange}
                                placeholder={t('placeholders.lastName')} required prefilled={!!profile?.last_name}
                              />
                              <SmartField
                                id="student_email" name="student_email" label={t('labels.email')} type="email"
                                value={formData.student_email} onChange={handleInputChange}
                                placeholder={t('placeholders.email')} required prefilled={!!user.email}
                              />
                              <SmartField
                                id="student_passport" name="student_passport" label={t('labels.passport')}
                                value={formData.student_passport} onChange={handleInputChange}
                                placeholder={t('placeholders.passport')} required prefilled={!!profile?.passport_number}
                              />
                              <CountrySelect
                                value={formData.student_country}
                                onChange={(value) => handleSelectChange('student_country', value)}
                                label={t('labels.country')} required prefilled={!!profile?.nationality}
                              />
                              <SmartSelect
                                id="gender" label={t('labels.gender')} value={formData.gender}
                                onChange={(value) => handleSelectChange('gender', value)} required
                                options={[
                                  { value: 'male', label: t('options.male') },
                                  { value: 'female', label: t('options.female') },
                                ]}
                                placeholder={t('placeholders.selectGender')}
                              />
                              <DateField
                                id="date_of_birth" name="date_of_birth" label={t('labels.dateOfBirth')}
                                value={formData.date_of_birth} onChange={handleInputChange}
                                required prefilled={!!profile?.date_of_birth}
                              />
                              {isFieldVisible('religion', programLevel) && (
                                <SmartSelect
                                  id="religion" label={t('labels.religion')} value={formData.religion}
                                  onChange={(value) => handleSelectChange('religion', value)}
                                  options={[
                                    { value: 'islam', label: t('options.islam') },
                                    { value: 'christianity', label: t('options.christianity') },
                                    { value: 'buddhism', label: t('options.buddhism') },
                                    { value: 'hinduism', label: t('options.hinduism') },
                                    { value: 'none', label: t('options.noReligion') },
                                    { value: 'other', label: t('options.other') },
                                  ]}
                                  placeholder={t('placeholders.selectReligion')}
                                />
                              )}
                              {isFieldVisible('marital_status', programLevel) && (
                                <SmartSelect
                                  id="marital_status" label={t('labels.maritalStatus')} value={formData.marital_status}
                                  onChange={(value) => handleSelectChange('marital_status', value)}
                                  options={[
                                    { value: 'single', label: t('options.single') },
                                    { value: 'married', label: t('options.married') },
                                    { value: 'divorced', label: t('options.divorced') },
                                  ]}
                                  placeholder={t('placeholders.selectMaritalStatus')}
                                />
                              )}
                            </div>
                          )}

                          {currentDef.sectionId === 'contact' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <PhoneField
                                id="student_phone" name="student_phone" label={t('labels.phone')}
                                value={formData.student_phone} onChange={handleInputChange}
                                countryId={phoneCountryId}
                                onCountryChange={(id) => handlePhoneCountryChange(id, 'student')}
                                required prefilled={!!profile?.phone}
                              />
                              <SmartField
                                id="wechat_id" name="wechat_id" label={t('labels.wechatId')}
                                value={formData.wechat_id} onChange={handleInputChange}
                                placeholder={t('placeholders.wechatId')}
                              />
                              <IntakeSelect
                                value={formData.preferred_intake}
                                onChange={(value) => handleSelectChange('preferred_intake', value)}
                                intakes={intakes} label={t('labels.preferredIntake')} required
                              />
                            </div>
                          )}

                          {currentDef.sectionId === 'address' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              <div className="md:col-span-3">
                                <TextAreaField
                                  id="address" name="address" label={t('labels.address')}
                                  value={formData.address} onChange={handleTextAreaChange}
                                  placeholder={t('placeholders.address')} rows={2}
                                />
                              </div>
                              <SmartField
                                id="city" name="city" label={t('labels.city')}
                                value={formData.city} onChange={handleInputChange}
                                placeholder={t('placeholders.city')}
                              />
                              <SmartField
                                id="postal_code" name="postal_code" label={t('labels.postalCode')}
                                value={formData.postal_code} onChange={handleInputChange}
                                placeholder={t('placeholders.postalCode')}
                              />
                            </div>
                          )}

                          {currentDef.sectionId === 'education' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <SmartSelect
                                id="highest_education" label={t('labels.highestEducation')} value={formData.highest_education}
                                onChange={(value) => handleSelectChange('highest_education', value)} required
                                options={[
                                  { value: 'high_school', label: t('options.highSchool') },
                                  { value: 'diploma', label: t('options.diploma') },
                                  { value: 'bachelor', label: t('options.bachelor') },
                                  { value: 'master', label: t('options.master') },
                                  { value: 'doctorate', label: t('options.doctorate') },
                                ]}
                                placeholder={t('placeholders.selectEducation')}
                              />
                              <SmartField
                                id="school_name" name="school_name" label={t('labels.schoolName')}
                                value={formData.school_name} onChange={handleInputChange}
                                placeholder={t('placeholders.schoolName')} required
                              />
                              <SmartField
                                id="major_field" name="major_field" label={t('labels.majorField')}
                                value={formData.major_field} onChange={handleInputChange}
                                placeholder={t('placeholders.majorField')}
                              />
                              <SmartField
                                id="graduation_year" name="graduation_year" label={t('labels.graduationYear')}
                                value={formData.graduation_year} onChange={handleInputChange}
                                placeholder={t('placeholders.graduationYear')}
                              />
                              <SmartField
                                id="gpa_score" name="gpa_score" label={t('labels.gpaScore')}
                                value={formData.gpa_score} onChange={handleInputChange}
                                placeholder={t('placeholders.gpaScore')}
                              />
                            </div>
                          )}

                          {currentDef.sectionId === 'language' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              <SmartSelect
                                id="chinese_proficiency" label={t('labels.chineseProficiency')} value={formData.chinese_proficiency}
                                onChange={(value) => handleSelectChange('chinese_proficiency', value)}
                                options={[
                                  { value: 'none', label: t('options.noProficiency') },
                                  { value: 'hsk1', label: 'HSK 1' },
                                  { value: 'hsk2', label: 'HSK 2' },
                                  { value: 'hsk3', label: 'HSK 3' },
                                  { value: 'hsk4', label: 'HSK 4' },
                                  { value: 'hsk5', label: 'HSK 5' },
                                  { value: 'hsk6', label: 'HSK 6' },
                                  { value: 'native', label: t('options.native') },
                                ]}
                                placeholder={t('placeholders.selectChinese')}
                              />
                              <SmartSelect
                                id="english_proficiency" label={t('labels.englishProficiency')} value={formData.english_proficiency}
                                onChange={(value) => handleSelectChange('english_proficiency', value)}
                                options={[
                                  { value: 'none', label: t('options.noProficiency') },
                                  { value: 'basic', label: t('options.basic') },
                                  { value: 'intermediate', label: t('options.intermediate') },
                                  { value: 'advanced', label: t('options.advanced') },
                                  { value: 'native', label: t('options.native') },
                                ]}
                                placeholder={t('placeholders.selectEnglish')}
                              />
                              <SmartField
                                id="test_score" name="test_score" label={t('labels.testScore')}
                                value={formData.test_score} onChange={handleInputChange}
                                placeholder={t('placeholders.testScore')}
                              />
                            </div>
                          )}

                          {currentDef.sectionId === 'emergency' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              <SmartField
                                id="emergency_contact_name" name="emergency_contact_name" label={t('labels.emergencyContactName')}
                                value={formData.emergency_contact_name} onChange={handleInputChange}
                                placeholder={t('placeholders.emergencyName')} required
                              />
                              <PhoneField
                                id="emergency_contact_phone" name="emergency_contact_phone" label={t('labels.emergencyContactPhone')}
                                value={formData.emergency_contact_phone} onChange={handleInputChange}
                                countryId={emergencyPhoneCountryId}
                                onCountryChange={(id) => handlePhoneCountryChange(id, 'emergency')}
                                required
                              />
                              <SmartField
                                id="emergency_contact_relationship" name="emergency_contact_relationship" label={t('labels.emergencyContactRelationship')}
                                value={formData.emergency_contact_relationship} onChange={handleInputChange}
                                placeholder={t('placeholders.relationship')} required
                              />
                            </div>
                          )}

                        </motion.div>
                      </AnimatePresence>

                      {/* Sub-step navigation */}
                      <StepNavigation
                        onBack={isFirstSubStep ? undefined : () => setSubStep(subStep - 1)}
                        onNext={() => {
                          if (isLastSubStep) {
                            setStep(2);
                            setSubStep(0);
                          } else {
                            setSubStep(subStep + 1);
                          }
                        }}
                        nextLabel={isLastSubStep ? t('buttons.continueToDocuments') : t('buttons.next') || 'Next'}
                        nextDisabled={isLastSubStep ? !canProceedToStep2 : !canAdvanceSubStep}
                        subStepLabel={`${subStep + 1} / ${subStepDefs.length}`}
                      />
                    </GlassCard>
                  </motion.div>
                );
              })()}

              {/* ═══ STEP 2: Documents ═══ */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <GlassCard className="p-6 md:p-8">
                    <SectionHeader icon={FileText} title={t('documents.title')} subtitle={t('documents.description')} />

                    {/* CUCAS-style upload guidelines */}
                    <DocumentNoticePanel />

                    {/* Service links banner */}
                    <ServiceBanner />

                    {/* Section I: Universal documents */}
                    <div className="mb-6">
                      <div className="flex items-start gap-2 mb-4">
                        <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">I</div>
                        <p className="text-sm font-bold text-gray-900">Universal Documents</p>
                      </div>
                      <div className="space-y-3">
                        {CUCAS_UNIVERSAL_DOCS.map(doc => (
                          <DocumentUploadZone
                            key={doc.id}
                            requirement={{ id: doc.id, title: doc.title, description: doc.description }}
                            isUploaded={!!uploadedDocuments[doc.id]}
                            isReused={false}
                            uploadedFile={uploadedDocuments[doc.id]}
                            loading={loading}
                            isRequired={doc.isRequired}
                            onUpload={(file) => handleFileUpload(doc.id, file)}
                            onReuse={() => {}}
                            onRemoveReuse={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                    {requirements.length === 0 ? (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 mb-4">
                        <FileCheck className="w-5 h-5" />
                        <p className="text-sm">No specific documents required for this program. You can proceed.</p>
                      </div>
                    ) : (
                      <>
                        {/* Section I: Required Documents */}
                        {requirements.filter(r => r.is_required).length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-md bg-red-500 text-white flex items-center justify-center text-xs font-bold">I</div>
                              <h4 className="text-sm font-bold text-gray-900">Required Documents</h4>
                              <span className="ml-auto text-xs text-red-500 font-medium">{requirements.filter(r => r.is_required).filter(r => !!uploadedDocuments[r.requirement.id] || !!reusedDocuments[r.requirement.id]).length}/{requirements.filter(r => r.is_required).length} uploaded</span>
                            </div>
                            <div className="space-y-3">
                              {requirements.filter(r => r.is_required).map((req) => {
                                const docType = req.requirement.title.toLowerCase().replace(/\s+/g, '_');
                                const existingDoc = existingDocuments.find(d => d.document_type === docType);
                                return (
                                  <DocumentUploadZone
                                    key={req.requirement.id}
                                    requirement={req.requirement}
                                    isUploaded={!!uploadedDocuments[req.requirement.id]}
                                    isReused={!!reusedDocuments[req.requirement.id]}
                                    uploadedFile={uploadedDocuments[req.requirement.id]}
                                    existingDoc={existingDoc}
                                    loading={loading}
                                    isRequired={true}
                                    onUpload={(file) => handleFileUpload(req.requirement.id, file)}
                                    onReuse={() => {
                                      if (existingDoc) {
                                        setReusedDocuments(prev => ({ ...prev, [req.requirement.id]: {
                                          id: existingDoc.id, file_url: existingDoc.file_url, file_name: existingDoc.file_name,
                                          document_name: existingDoc.document_name || existingDoc.file_name,
                                          file_type: existingDoc.file_type || 'application/octet-stream', file_size: existingDoc.file_size || 0,
                                        }}));
                                        setDocumentUrls(prev => ({ ...prev, [req.requirement.id]: existingDoc.file_url }));
                                      }
                                    }}
                                    onRemoveReuse={() => {
                                      const newReused = { ...reusedDocuments }; delete newReused[req.requirement.id];
                                      const newUrls = { ...documentUrls }; delete newUrls[req.requirement.id];
                                      setReusedDocuments(newReused); setDocumentUrls(newUrls);
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Section II: Optional Documents */}
                        {requirements.filter(r => !r.is_required).length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-md bg-gray-400 text-white flex items-center justify-center text-xs font-bold">II</div>
                              <h4 className="text-sm font-bold text-gray-900">Optional Documents</h4>
                            </div>
                            <div className="space-y-3">
                              {requirements.filter(r => !r.is_required).map((req) => {
                                const docType = req.requirement.title.toLowerCase().replace(/\s+/g, '_');
                                const existingDoc = existingDocuments.find(d => d.document_type === docType);
                                return (
                                  <DocumentUploadZone
                                    key={req.requirement.id}
                                    requirement={req.requirement}
                                    isUploaded={!!uploadedDocuments[req.requirement.id]}
                                    isReused={!!reusedDocuments[req.requirement.id]}
                                    uploadedFile={uploadedDocuments[req.requirement.id]}
                                    existingDoc={existingDoc}
                                    loading={loading}
                                    isRequired={false}
                                    onUpload={(file) => handleFileUpload(req.requirement.id, file)}
                                    onReuse={() => {
                                      if (existingDoc) {
                                        setReusedDocuments(prev => ({ ...prev, [req.requirement.id]: {
                                          id: existingDoc.id, file_url: existingDoc.file_url, file_name: existingDoc.file_name,
                                          document_name: existingDoc.document_name || existingDoc.file_name,
                                          file_type: existingDoc.file_type || 'application/octet-stream', file_size: existingDoc.file_size || 0,
                                        }}));
                                        setDocumentUrls(prev => ({ ...prev, [req.requirement.id]: existingDoc.file_url }));
                                      }
                                    }}
                                    onRemoveReuse={() => {
                                      const newReused = { ...reusedDocuments }; delete newReused[req.requirement.id];
                                      const newUrls = { ...documentUrls }; delete newUrls[req.requirement.id];
                                      setReusedDocuments(newReused); setDocumentUrls(newUrls);
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* CUCAS-style conditional sections */}
                    <ConditionalDocumentSection
                      sectionNumber="II"
                      heading="If you are currently studying in China and want to transfer to another university, the following documents are also required:"
                      checkboxLabel="I have never studied in China before (check to skip this section)"
                      expanded={studiedInChina}
                      onToggle={setStudiedInChina}
                    >
                      {CUCAS_CHINA_DOCS.map(doc => (
                        <DocumentUploadZone
                          key={doc.id}
                          requirement={{ id: doc.id, title: doc.title, description: doc.description }}
                          isUploaded={!!conditionalUploads[doc.id]}
                          isReused={false}
                          uploadedFile={conditionalUploads[doc.id]}
                          loading={loading}
                          isRequired={doc.isRequired}
                          onUpload={(file) => setConditionalUploads(prev => ({ ...prev, [doc.id]: file }))}
                          onReuse={() => {}}
                          onRemoveReuse={() => {}}
                        />
                      ))}
                    </ConditionalDocumentSection>

                    <ConditionalDocumentSection
                      sectionNumber="III"
                      heading="If you are under 18 years old:"
                      checkboxLabel="I am 18 years old or above (check to skip this section)"
                      expanded={isUnder18}
                      onToggle={setIsUnder18}
                    >
                      {CUCAS_UNDER18_DOCS.map(doc => (
                        <DocumentUploadZone
                          key={doc.id}
                          requirement={{ id: doc.id, title: doc.title, description: doc.description }}
                          isUploaded={!!conditionalUploads[doc.id]}
                          isReused={false}
                          uploadedFile={conditionalUploads[doc.id]}
                          loading={loading}
                          isRequired={doc.isRequired}
                          onUpload={(file) => setConditionalUploads(prev => ({ ...prev, [doc.id]: file }))}
                          onReuse={() => {}}
                          onRemoveReuse={() => {}}
                        />
                      ))}
                    </ConditionalDocumentSection>

                    <StepNavigation
                      onBack={() => setStep(1)}
                      onNext={() => setStep(requiresPayment ? 3 : reviewStep)}
                      nextLabel={requiresPayment ? t('buttons.continueToPayment') : t('buttons.continueToReview')}
                      nextDisabled={!allRequiredDocumentsUploaded() && requirements.length > 0}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {/* ═══ STEP 3: Payment (if required) ═══ */}
              {step === 3 && requiresPayment && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <GlassCard className="p-6 md:p-8">
                    <SectionHeader icon={CreditCard} title={t('payment.title')} subtitle="This program requires payment before submission" />

                    <div className="bg-white/80 rounded-xl p-6 space-y-4 border border-gray-100 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{t('payment.applicationFee')}</span>
                        <span className="font-semibold text-gray-900">${program.application_fee} USD</span>
                      </div>
                      <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <span className="font-bold text-gray-900">{t('payment.total')}</span>
                        <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${totalFee} USD</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
                      <Sparkles className="w-5 h-5 shrink-0" />
                      <p>You will be redirected to the payment page after submitting your application.</p>
                    </div>

                    <StepNavigation
                      onBack={() => setStep(2)}
                      onNext={() => setStep(reviewStep)}
                      nextLabel={t('buttons.continueToReview')}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {/* ═══ FINAL STEP: Review & Submit ═══ */}
              {step === reviewStep && (
                <motion.div key="stepReview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <GlassCard className="p-6 md:p-8">
                    <SectionHeader icon={FileCheck} title={t('review.title')} subtitle="Please review your application before submitting" />

                    <div className="space-y-4 mb-6">
                      {/* Identity Review */}
                      <ReviewSection title={t('review.personalDetails')} icon={User} onEdit={() => setStep(1)}>
                        <ReviewField label={t('labels.firstName')} value={formData.first_name} />
                        <ReviewField label={t('labels.lastName')} value={formData.last_name} />
                        <ReviewField label={t('labels.email')} value={formData.student_email} />
                        <ReviewField label={t('labels.passport')} value={formData.student_passport} />
                        <ReviewField label={t('labels.country')} value={formData.student_country} />
                        <ReviewField label={t('labels.gender')} value={formData.gender} />
                        <ReviewField label={t('labels.dateOfBirth')} value={formData.date_of_birth} />
                        {isFieldVisible('religion', programLevel) && formData.religion && <ReviewField label={t('labels.religion')} value={formData.religion} />}
                        {isFieldVisible('marital_status', programLevel) && formData.marital_status && <ReviewField label={t('labels.maritalStatus')} value={formData.marital_status} />}
                      </ReviewSection>

                      {/* Contact Review */}
                      <ReviewSection title={t('sections.contact')} icon={Phone} onEdit={() => setStep(1)}>
                        <ReviewField label={t('labels.phone')} value={`${phoneCountryCode} ${formData.student_phone}`} />
                        {formData.wechat_id && <ReviewField label={t('labels.wechatId')} value={formData.wechat_id} />}
                        <ReviewField label={t('labels.preferredIntake')} value={formData.preferred_intake} />
                        {isSectionVisible('address', programLevel) && formData.address && <ReviewField label={t('labels.address')} value={`${formData.address}${formData.city ? `, ${formData.city}` : ''}${formData.postal_code ? ` ${formData.postal_code}` : ''}`} />}
                      </ReviewSection>

                      {/* Education Review */}
                      {isSectionVisible('education', programLevel) && (
                        <ReviewSection title={t('sections.education')} icon={GraduationCap} onEdit={() => setStep(1)}>
                          <ReviewField label={t('labels.highestEducation')} value={formData.highest_education} />
                          <ReviewField label={t('labels.schoolName')} value={formData.school_name} />
                          {formData.major_field && <ReviewField label={t('labels.majorField')} value={formData.major_field} />}
                          {formData.graduation_year && <ReviewField label={t('labels.graduationYear')} value={formData.graduation_year} />}
                          {formData.gpa_score && <ReviewField label={t('labels.gpaScore')} value={formData.gpa_score} />}
                        </ReviewSection>
                      )}

                      {/* Language Review */}
                      {isSectionVisible('language', programLevel) && (formData.chinese_proficiency || formData.english_proficiency || formData.test_score) && (
                        <ReviewSection title={t('sections.language')} icon={Languages} onEdit={() => setStep(1)}>
                          {formData.chinese_proficiency && <ReviewField label={t('labels.chineseProficiency')} value={formData.chinese_proficiency} />}
                          {formData.english_proficiency && <ReviewField label={t('labels.englishProficiency')} value={formData.english_proficiency} />}
                          {formData.test_score && <ReviewField label={t('labels.testScore')} value={formData.test_score} />}
                        </ReviewSection>
                      )}

                      {/* Emergency Contact Review */}
                      {isSectionVisible('emergency', programLevel) && (
                        <ReviewSection title={t('sections.emergency')} icon={Shield} onEdit={() => setStep(1)}>
                          <ReviewField label={t('labels.emergencyContactName')} value={formData.emergency_contact_name} />
                          <ReviewField label={t('labels.emergencyContactPhone')} value={`${emergencyPhoneCode} ${formData.emergency_contact_phone}`} />
                          <ReviewField label={t('labels.emergencyContactRelationship')} value={formData.emergency_contact_relationship} />
                        </ReviewSection>
                      )}

                      {/* Documents Review */}
                      <ReviewSection title={t('review.uploadedDocuments')} icon={FileText} onEdit={() => setStep(2)}>
                        {Object.entries(uploadedDocuments).map(([reqId, file]) => {
                          const req = requirements.find((r) => r.requirement.id === reqId);
                          return (
                            <div key={reqId} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs text-gray-500">{req?.requirement.title}:</span>
                              <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                            </div>
                          );
                        })}
                        {Object.entries(reusedDocuments).map(([reqId, doc]) => {
                          const req = requirements.find((r) => r.requirement.id === reqId);
                          return (
                            <div key={reqId} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-gray-500">{req?.requirement.title}:</span>
                              <span className="text-sm font-medium text-gray-900 truncate">{doc.document_name}</span>
                              <span className="text-[10px] text-blue-500 font-medium">(reused)</span>
                            </div>
                          );
                        })}
                      </ReviewSection>

                      {/* Payment Review */}
                      {requiresPayment && (
                        <ReviewSection title="Payment" icon={CreditCard} onEdit={() => setStep(3)}>
                          <ReviewField label="Application Fee" value={`$${totalFee} ${program.currency || 'USD'}`} />
                          <ReviewField label="Status" value="Pending — redirect after submission" />
                        </ReviewSection>
                      )}
                    </div>

                    <StepNavigation
                      onBack={() => setStep(requiresPayment ? 3 : 2)}
                      onNext={handleSubmit}
                      nextLabel={t('buttons.submitApplication')}
                      loading={loading}
                      isSubmit
                    />
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
}
