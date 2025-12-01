'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  Mail,
  Phone,
  Globe,
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
import { COUNTRIES, COUNTRY_CODES, INTAKE_PERIODS } from '@/lib/constants/countries';

interface ApplyFormProps {
  program: any;
  requirements: any[];
  user: any;
  profile?: any;
}

export function ApplyForm({ program, requirements, user, profile }: ApplyFormProps) {
  const router = useRouter();
  const supabase = createClient();

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

  const [phoneCountryCode, setPhoneCountryCode] = useState(profile?.phone_country_code || user.user_metadata?.phone_country_code || '+86');
  const [emergencyPhoneCode, setEmergencyPhoneCode] = useState(profile?.emergency_phone_code || user.user_metadata?.emergency_phone_code || '+86');

  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});

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

      const { data, error: uploadError } = await supabase.storage
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
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Check if all required documents are uploaded
  const allRequiredDocumentsUploaded = () => {
    const mandatoryRequirements = requirements.filter(
      (req) => req.requirement.is_mandatory
    );
    return mandatoryRequirements.every((req) => uploadedDocuments[req.requirement.id]);
  };

  // Create application
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create application with phone numbers including country codes
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert({
          student_id: user.id,
          university_program_id: program.id,
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
        })
        .select()
        .single();

      if (appError) throw appError;

      // Upload document records
      const documentRecords = Object.entries(documentUrls).map(([reqId, url]) => ({
        application_id: application.id,
        requirement_id: reqId,
        document_name: uploadedDocuments[reqId].name,
        document_type: uploadedDocuments[reqId].type,
        file_url: url,
        file_size: uploadedDocuments[reqId].size,
        file_type: uploadedDocuments[reqId].name.split('.').pop(),
      }));

      if (documentRecords.length > 0) {
        const { error: docsError } = await supabase
          .from('application_documents')
          .insert(documentRecords);

        if (docsError) throw docsError;
      }

      // Show success state
      setApplicationId(application.id);
      setSuccess(true);
      setLoading(false);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
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
                <span className="text-sm font-medium text-gray-900">{program.program_catalog.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">University:</span>
                <span className="text-sm font-medium text-gray-900">{program.university.name}</span>
              </div>
            </div>

            <div className="space-y-3 text-left bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">You'll receive a confirmation email shortly</p>
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
          Apply to {program.program_catalog.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <span>{program.university.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <span>{program.program_catalog.level}</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Documents' },
          ...(requiresPayment ? [{ num: 3, label: 'Payment' }] : []),
          { num: requiresPayment ? 4 : 3, label: 'Review' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= s.num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                }`}
            >
              {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {s.label}
            </span>
            {idx < (requiresPayment ? 3 : 2) && (
              <div className="w-12 h-0.5 bg-gray-300 mx-4" />
            )}
          </div>
        ))}
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
                  <Label htmlFor="student_name">Full Name *</Label>
                  <Input
                    id="student_name"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_email">Email *</Label>
                  <Input
                    id="student_email"
                    name="student_email"
                    type="email"
                    value={formData.student_email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((item) => (
                          <SelectItem key={item.id} value={item.code}>
                            {item.code} {item.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="student_phone"
                      name="student_phone"
                      type="tel"
                      placeholder="123456789"
                      value={formData.student_phone}
                      onChange={handleInputChange}
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_country">Country *</Label>
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
                  <Label htmlFor="student_passport">Passport Number *</Label>
                  <Input
                    id="student_passport"
                    name="student_passport"
                    value={formData.student_passport}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_intake">Preferred Intake *</Label>
                  <Select value={formData.preferred_intake} onValueChange={(value) => handleSelectChange('preferred_intake', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake period" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTAKE_PERIODS.map((intake) => (
                        <SelectItem key={intake} value={intake}>
                          {intake}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Name *</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Phone *</Label>
                    <div className="flex gap-2">
                      <Select value={emergencyPhoneCode} onValueChange={setEmergencyPhoneCode}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map((item) => (
                            <SelectItem key={`emergency-${item.id}`} value={item.code}>
                              {item.code} {item.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="emergency_contact_phone"
                        name="emergency_contact_phone"
                        type="tel"
                        placeholder="123456789"
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_relationship">Relationship *</Label>
                    <Input
                      id="emergency_contact_relationship"
                      name="emergency_contact_relationship"
                      value={formData.emergency_contact_relationship}
                      onChange={handleInputChange}
                      placeholder="e.g., Parent, Spouse"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.student_name ||
                    !formData.student_email ||
                    !formData.student_phone ||
                    !formData.student_country ||
                    !formData.student_passport ||
                    !formData.preferred_intake ||
                    !formData.emergency_contact_name ||
                    !formData.emergency_contact_phone ||
                    !formData.emergency_contact_relationship
                  }
                >
                  Continue to Documents
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
                requirements.map((req) => (
                  <div
                    key={req.requirement.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {req.requirement.title}
                          {req.requirement.is_mandatory && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                        </h4>
                        {req.requirement.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {req.requirement.description}
                          </p>
                        )}
                      </div>
                      {uploadedDocuments[req.requirement.id] && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
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
                    </div>
                  </div>
                ))
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
