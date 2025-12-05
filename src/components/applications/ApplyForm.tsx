'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  FileCheck,
  ArrowRight,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { COUNTRIES, COUNTRY_CODES } from '@/lib/constants/countries';
import { useTranslations } from 'next-intl';

interface ApplyFormProps {
  program: {
    id: string;
    intake: string;
    application_fee: number;
    service_fee?: number;
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

  const [step, setStep] = useState(1); // 1: Info, 2: Documents, 3: Payment, 4: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Form state - pre-fill from user metadata or profile
  const [formData, setFormData] = useState({
    student_name: profile?.full_name || profile?.name || (profile?.first_name ? `${profile.first_name} ${profile.last_name}` : '') || user.user_metadata?.full_name || user.user_metadata?.name || '',
    student_email: user.email || '',
    student_phone: profile?.phone || user.user_metadata?.phone || '',
    student_country: profile?.nationality || profile?.country || user.user_metadata?.country || '',
    student_passport: profile?.passport_number || profile?.passport || user.user_metadata?.passport || '',
    preferred_intake: program.intake || '',
    emergency_contact_name: profile?.emergency_contact_name || user.user_metadata?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || user.user_metadata?.emergency_contact_phone || '',
    emergency_contact_relationship: profile?.emergency_contact_relationship || user.user_metadata?.emergency_contact_relationship || '',
  });

  // Helper function to get list of missing required fields
  const getMissingFields = () => {
    const missing: string[] = [];
    if (!formData.student_name) missing.push(t('labels.fullName'));
    if (!formData.student_email) missing.push(t('labels.email'));
    if (!formData.student_phone) missing.push(t('labels.phone'));
    if (!formData.student_country) missing.push(t('labels.country'));
    if (!formData.student_passport) missing.push(t('labels.passport'));
    if (!formData.preferred_intake) missing.push(t('labels.preferredIntake'));
    if (!formData.emergency_contact_name) missing.push(t('labels.emergencyContactName'));
    if (!formData.emergency_contact_phone) missing.push(t('labels.emergencyContactPhone'));
    if (!formData.emergency_contact_relationship) missing.push(t('labels.emergencyContactRelationship'));
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

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const totalFee = (program.application_fee || 0) + (program.service_fee || 0);
  const requiresPayment = program.force_payment && totalFee > 0;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        student_name: formData.student_name,
        student_email: formData.student_email,
        student_phone: `${phoneCountryCode} ${formData.student_phone}`,
        student_country: formData.student_country,
        student_passport: formData.student_passport,
        preferred_intake: formData.preferred_intake,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: `${emergencyPhoneCode} ${formData.emergency_contact_phone}`,
        emergency_contact_relationship: formData.emergency_contact_relationship,
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
        full_name: formData.student_name,
        phone: formData.student_phone,
        phone_country_code: phoneCountryCode,
        nationality: formData.student_country,
        passport_number: formData.student_passport,
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

  // Show success screen
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-none shadow-2xl bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-16 h-16 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully! 🎉
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Your application has been received and is now under review.
            </p>

            <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">Application ID:</span>
                <span className="text-lg font-bold text-blue-600">{applicationId?.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">Program:</span>
                <span className="text-sm font-medium text-gray-900">{program.program_catalog?.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">University:</span>
                <span className="text-sm font-medium text-gray-900">{program.university.name}</span>
              </div>
            </div>

            <div className="space-y-3 text-left bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What&apos;s Next?</h3>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">You&apos;ll receive a confirmation email shortly</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">Our team will review your application within 2-3 business days</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">Track your application status in your dashboard</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Redirecting to your dashboard in 3 seconds...
            </p>

            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg"
            >
              Go to Dashboard Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Apply to {program.program_catalog?.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <span>{program.university.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <span>{program.program_catalog?.level}</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps - Responsive */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center justify-center gap-2 md:gap-4 min-w-max px-4">
          {[
            { num: 1, label: 'Info', fullLabel: 'Personal Info' },
            { num: 2, label: 'Docs', fullLabel: 'Documents' },
            ...(requiresPayment ? [{ num: 3, label: 'Pay', fullLabel: 'Payment' }] : []),
            { num: requiresPayment ? 4 : 3, label: 'Review', fullLabel: 'Review' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-semibold text-sm ${step >= s.num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" /> : s.num}
              </div>
              <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">
                {s.fullLabel}
              </span>
              <span className="ml-1 text-xs font-medium text-gray-700 sm:hidden">
                {s.label}
              </span>
              {idx < (requiresPayment ? 3 : 2) && (
                <div className="w-4 md:w-12 h-0.5 bg-gray-300 mx-1 md:mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Please provide your personal details for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_name">{t('labels.fullName')} *</Label>
                  <Input
                    id="student_name"
                    name="student_name"
                    placeholder={t('placeholders.fullName')}
                    value={formData.student_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_email">{t('labels.email')} *</Label>
                  <Input
                    id="student_email"
                    name="student_email"
                    type="email"
                    placeholder={t('placeholders.email')}
                    value={formData.student_email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_phone">{t('labels.phone')} *</Label>
                  <p className="text-xs text-muted-foreground">{t('hints.phoneHint')}</p>
                  <div className="flex gap-2">
                    <Select value={phoneCountryId} onValueChange={(value) => handlePhoneCountryChange(value, 'student')}>
                      <SelectTrigger className="w-[100px] md:w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.code} {item.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="student_phone"
                      name="student_phone"
                      type="tel"
                      placeholder="e.g. 555 123 4567"
                      value={formData.student_phone}
                      onChange={handleInputChange}
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_country">{t('labels.country')} *</Label>
                  <Select value={formData.student_country} onValueChange={(value) => handleSelectChange('student_country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_passport">{t('labels.passport')} *</Label>
                  <Input
                    id="student_passport"
                    name="student_passport"
                    placeholder={t('placeholders.passport')}
                    value={formData.student_passport}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_intake">{t('labels.preferredIntake')} *</Label>
                  <Select value={formData.preferred_intake} onValueChange={(value) => handleSelectChange('preferred_intake', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake period" />
                    </SelectTrigger>
                    <SelectContent>
                      {intakes.length > 0 ? (
                        intakes.map((intake) => (
                          <SelectItem key={intake.id} value={intake.name}>
                            {intake.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="September 2025">September 2025</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">{t('labels.emergencyContactName')} *</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      placeholder={t('placeholders.emergencyName')}
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">{t('labels.emergencyContactPhone')} *</Label>
                    <div className="flex gap-2">
                      <Select value={emergencyPhoneCountryId} onValueChange={(value) => handlePhoneCountryChange(value, 'emergency')}>
                        <SelectTrigger className="w-[100px] md:w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map((item) => (
                            <SelectItem key={`emergency-${item.id}`} value={item.id}>
                              {item.code} {item.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="emergency_contact_phone"
                        name="emergency_contact_phone"
                        type="tel"
                        placeholder="e.g. 555 123 4567"
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_relationship">{t('labels.emergencyContactRelationship')} *</Label>
                    <Input
                      id="emergency_contact_relationship"
                      name="emergency_contact_relationship"
                      value={formData.emergency_contact_relationship}
                      onChange={handleInputChange}
                      placeholder={t('placeholders.relationship')}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Missing Fields Indicator */}
              {missingFields.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">{t('validation.missingFieldsTitle')}</p>
                      <ul className="mt-2 text-sm text-amber-700 list-disc list-inside space-y-1">
                        {missingFields.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className={!canProceedToStep2 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {t('buttons.continueToDocuments')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Document Upload */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Please upload all required documents for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requirements.length === 0 ? (
                <Alert>
                  <FileCheck className="h-4 w-4" />
                  <AlertDescription>
                    No specific documents required for this program. You can proceed to the next step.
                  </AlertDescription>
                </Alert>
              ) : (
                requirements.map((req) => {
                  const docType = req.requirement.title.toLowerCase().replace(/\s+/g, '_');
                  const existingDoc = existingDocuments.find(d => d.document_type === docType);
                  const isReused = reusedDocuments[req.requirement.id];
                  const isUploaded = uploadedDocuments[req.requirement.id];

                  return (
                    <div
                      key={req.requirement.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {req.requirement.title}
                            {req.is_required && (
                              <span className="text-red-500 text-sm">*</span>
                            )}
                          </h4>
                          {req.requirement.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {req.requirement.description}
                            </p>
                          )}
                        </div>
                        {(isUploaded || isReused) && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>

                      {/* Existing Document Option */}
                      {existingDoc && !isUploaded && !isReused && (
                        <div className="bg-blue-50 p-3 rounded-md flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <FileCheck className="w-4 h-4" />
                            <span>Found existing: <strong>{existingDoc.document_name}</strong></span>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white hover:bg-blue-100 text-blue-700 border border-blue-200"
                            onClick={() => {
                              setReusedDocuments((prev) => ({
                                ...prev,
                                [req.requirement.id]: {
                                  id: existingDoc.id,
                                  file_url: existingDoc.file_url,
                                  file_name: existingDoc.file_name,
                                  document_name: existingDoc.document_name || existingDoc.file_name,
                                  file_type: existingDoc.file_type || 'application/octet-stream',
                                  file_size: existingDoc.file_size || 0
                                }
                              }));
                              setDocumentUrls({ ...documentUrls, [req.requirement.id]: existingDoc.file_url });
                            }}
                          >
                            Use Existing
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {isReused ? (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md w-full border border-green-100">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Using existing: <strong>{existingDoc?.document_name}</strong></span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                const newReused = { ...reusedDocuments };
                                delete newReused[req.requirement.id];
                                setReusedDocuments(newReused);

                                const newUrls = { ...documentUrls };
                                delete newUrls[req.requirement.id];
                                setDocumentUrls(newUrls);
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(req.requirement.id, file);
                                }
                              }}
                              disabled={loading}
                            />
                            {uploadedDocuments[req.requirement.id] && (
                              <span className="text-sm text-green-600 whitespace-nowrap">
                                {uploadedDocuments[req.requirement.id].name}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(requiresPayment ? 3 : 3)}
                  disabled={!allRequiredDocumentsUploaded() && requirements.length > 0}
                >
                  Continue to {requiresPayment ? 'Payment' : 'Review'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Payment (if required) */}
      {step === 3 && requiresPayment && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Required
              </CardTitle>
              <CardDescription>
                This program requires payment before submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to the payment page after submitting your application.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Fee:</span>
                  <span className="font-semibold">
                    {program.application_fee} {program.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-semibold">
                    {program.service_fee} {program.currency}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-blue-600">
                    {totalFee} {program.currency}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Continue to Review
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Final Step: Review & Submit */}
      {step === (requiresPayment ? 4 : 3) && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Review & Submit
              </CardTitle>
              <CardDescription>
                Please review your application before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info Summary */}
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{formData.student_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{formData.student_email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{formData.student_phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Country:</span>
                    <p className="font-medium">{formData.student_country}</p>
                  </div>
                </div>
              </div>

              {/* Documents Summary */}
              <div>
                <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {Object.entries(uploadedDocuments).map(([reqId, file]) => {
                    const req = requirements.find((r) => r.requirement.id === reqId);
                    return (
                      <div
                        key={reqId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{req?.requirement.title}: {file.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {requiresPayment && (
                <Alert>
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    After submission, you will be redirected to complete the payment of{' '}
                    <strong>
                      {totalFee} {program.currency}
                    </strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(requiresPayment ? 3 : 2)}
                >
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
