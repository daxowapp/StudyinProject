'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitLeadForm } from '@/app/[locale]/(public)/apply/lead-actions';
import type { LeadFormData } from '@/app/[locale]/(public)/apply/lead-actions';
import { captureUTMParams, getStoredUTMParams } from '@/lib/utm';
import { toast } from 'sonner';
import {
  Loader2,
  CheckCircle2,
  GraduationCap,
  Globe2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// ── Country Dial Codes ──────────────────────────────────────────
const DIAL_CODES = [
  { code: '+90', flag: '🇹🇷', name: 'TR' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+98', flag: '🇮🇷', name: 'IR' },
  { code: '+993', flag: '🇹🇲', name: 'TM' },
  { code: '+86', flag: '🇨🇳', name: 'CN' },
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+44', flag: '🇬🇧', name: 'GB' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+34', flag: '🇪🇸', name: 'ES' },
  { code: '+7', flag: '🇷🇺', name: 'RU' },
  { code: '+234', flag: '🇳🇬', name: 'NG' },
  { code: '+20', flag: '🇪🇬', name: 'EG' },
  { code: '+212', flag: '🇲🇦', name: 'MA' },
  { code: '+213', flag: '🇩🇿', name: 'DZ' },
  { code: '+216', flag: '🇹🇳', name: 'TN' },
  { code: '+962', flag: '🇯🇴', name: 'JO' },
  { code: '+964', flag: '🇮🇶', name: 'IQ' },
  { code: '+92', flag: '🇵🇰', name: 'PK' },
  { code: '+91', flag: '🇮🇳', name: 'IN' },
  { code: '+880', flag: '🇧🇩', name: 'BD' },
  { code: '+254', flag: '🇰🇪', name: 'KE' },
  { code: '+255', flag: '🇹🇿', name: 'TZ' },
  { code: '+256', flag: '🇺🇬', name: 'UG' },
  { code: '+233', flag: '🇬🇭', name: 'GH' },
  { code: '+237', flag: '🇨🇲', name: 'CM' },
  { code: '+221', flag: '🇸🇳', name: 'SN' },
  { code: '+998', flag: '🇺🇿', name: 'UZ' },
  { code: '+996', flag: '🇰🇬', name: 'KG' },
  { code: '+992', flag: '🇹🇯', name: 'TJ' },
  { code: '+7', flag: '🇰🇿', name: 'KZ' },
  { code: '+994', flag: '🇦🇿', name: 'AZ' },
  { code: '+60', flag: '🇲🇾', name: 'MY' },
  { code: '+62', flag: '🇮🇩', name: 'ID' },
  { code: '+63', flag: '🇵🇭', name: 'PH' },
];

// Timezone → dial code mapping for auto-detection
const TIMEZONE_DIAL_MAP: Record<string, string> = {
  'Europe/Istanbul': '+90',
  'Asia/Istanbul': '+90',
  'Asia/Riyadh': '+966',
  'Asia/Dubai': '+971',
  'Asia/Tehran': '+98',
  'Asia/Ashgabat': '+993',
  'Asia/Shanghai': '+86',
  'Asia/Beijing': '+86',
  'America/New_York': '+1',
  'America/Chicago': '+1',
  'America/Los_Angeles': '+1',
  'Europe/London': '+44',
  'Europe/Paris': '+33',
  'Europe/Madrid': '+34',
  'Europe/Moscow': '+7',
  'Africa/Lagos': '+234',
  'Africa/Cairo': '+20',
  'Africa/Casablanca': '+212',
  'Africa/Algiers': '+213',
  'Africa/Tunis': '+216',
  'Asia/Amman': '+962',
  'Asia/Baghdad': '+964',
  'Asia/Karachi': '+92',
  'Asia/Kolkata': '+91',
  'Asia/Dhaka': '+880',
  'Africa/Nairobi': '+254',
  'Asia/Tashkent': '+998',
  'Asia/Bishkek': '+996',
  'Asia/Almaty': '+7',
  'Asia/Baku': '+994',
  'Asia/Kuala_Lumpur': '+60',
  'Asia/Jakarta': '+62',
  'Asia/Manila': '+63',
};

function detectDialCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_DIAL_MAP[tz]) {
      return TIMEZONE_DIAL_MAP[tz];
    }
  } catch {
    // Fallback
  }
  return '+90'; // Default to Turkey (main market)
}

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function ApplyLeadPage() {
  const t = useTranslations('ApplyForm');
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dialCode, setDialCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [startSemester, setStartSemester] = useState('');

  // Detect country from browser timezone & capture UTM params on mount
  useEffect(() => {
    setDialCode(detectDialCode());
    captureUTMParams();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const utm = getStoredUTMParams();
      const formData: LeadFormData = {
        firstName,
        lastName,
        email,
        phone: `${dialCode}${phoneNumber}`,
        englishLevel: englishLevel as LeadFormData['englishLevel'],
        department: department as LeadFormData['department'],
        startSemester: startSemester as LeadFormData['startSemester'],
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign,
        utmContent: utm.utm_content,
        utmTerm: utm.utm_term,
        locale,
      };

      const result = await submitLeadForm(formData);

      if (result.success) {
        setIsSuccess(true);
        toast.success(t('successTitle'));
      } else {
        toast.error(result.error || t('errorGeneric'));
      }
    } catch {
      toast.error(t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  // ── English Level Options ────────────────────────────────────
  const englishLevels = [
    { value: 'beginner', label: t('englishLevelBeginner') },
    { value: 'intermediate', label: t('englishLevelIntermediate') },
    { value: 'upper_intermediate', label: t('englishLevelUpperIntermediate') },
    { value: 'advanced', label: t('englishLevelAdvanced') },
    { value: 'native', label: t('englishLevelNative') },
  ];

  // ── Department Options ───────────────────────────────────────
  const departments = [
    { value: 'medicine', label: t('departmentMedicine') },
    { value: 'engineering', label: t('departmentEngineering') },
    { value: 'computer_science', label: t('departmentComputerScience') },
    { value: 'business', label: t('departmentBusiness') },
    { value: 'arts', label: t('departmentArts') },
    { value: 'law', label: t('departmentLaw') },
    { value: 'language', label: t('departmentLanguage') },
    { value: 'other', label: t('departmentOther') },
  ];

  // ── Semester Options ─────────────────────────────────────────
  const semesters = [
    { value: 'fall_2026', label: t('semesterFall2026') },
    { value: 'spring_2026', label: t('semesterSpring2026') },
    { value: 'fall_2027', label: t('semesterFall2027') },
  ];

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row bg-white relative">
      {/* Language Switcher - top-right, always visible */}
      <div className="fixed top-3 right-3 z-50 lg:absolute lg:top-4 lg:right-4">
        <LanguageSwitcher />
      </div>

      {/* Hero Section - compact on mobile, half-screen on desktop */}
      <div className="bg-linear-to-br from-red-900 via-red-800 to-amber-900 px-6 py-8 lg:w-1/2 lg:p-16 xl:p-24 lg:flex lg:flex-col lg:justify-center relative overflow-hidden text-white">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium mb-4 lg:mb-8 lg:text-sm lg:px-4 lg:py-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 lg:w-4 lg:h-4" />
            {t('heroTagline')}
          </div>

          {/* Main headline */}
          <h1 className="text-2xl font-bold leading-tight mb-3 tracking-tight sm:text-3xl lg:text-5xl xl:text-6xl lg:mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-sm text-red-200 leading-relaxed sm:text-base lg:text-lg lg:mb-12">
            {t('heroSubtitle')}
          </p>

          {/* Mobile feature pills - compact horizontal */}
          <div className="flex flex-wrap gap-2 mt-4 lg:hidden">
            {[
              { icon: GraduationCap, title: t('featureScholarships') },
              { icon: Globe2, title: t('featureAdmission') },
              { icon: BookOpen, title: t('featurePrograms') },
            ].map((feature, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium border border-white/10"
              >
                <feature.icon className="w-3.5 h-3.5 text-red-300" />
                {feature.title}
              </div>
            ))}
          </div>

          {/* Desktop feature cards */}
          <div className="hidden lg:block space-y-5">
            {[
              { icon: GraduationCap, title: t('featureScholarships'), desc: t('featureScholarshipsDesc') },
              { icon: Globe2, title: t('featureAdmission'), desc: t('featureAdmissionDesc') },
              { icon: BookOpen, title: t('featurePrograms'), desc: t('featureProgramsDesc') },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <div className="shrink-0 w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-red-200/80 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof - desktop only */}
          <div className="hidden lg:block mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['🇸🇦', '🇹🇷', '🇳🇬', '🇮🇷', '🇵🇰'].map((flag, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-red-900 flex items-center justify-center text-sm">
                    {flag}
                  </div>
                ))}
              </div>
              <p className="text-sm text-red-200">{t('socialProof')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-5 py-8 sm:px-8 lg:w-1/2 lg:p-16 xl:p-24 lg:flex lg:flex-col lg:justify-center">
        {!isSuccess ? (
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1 sm:text-2xl lg:text-3xl lg:mb-2">
                {t('formTitle')}
              </h2>
              <p className="text-sm text-slate-500 lg:text-base">
                {t('formSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row - stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">{t('firstName')}</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('firstNamePlaceholder')}
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">{t('lastName')}</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('lastNamePlaceholder')}
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base"
                  />
                </div>
              </div>

              {/* Email - full width */}
              <div className="space-y-1.5">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base"
                />
              </div>

              {/* WhatsApp - full width with dial code */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t('whatsapp')}</Label>
                <div className="flex gap-2">
                  <Select value={dialCode} onValueChange={setDialCode}>
                    <SelectTrigger className="w-[110px] h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {DIAL_CODES.map((dc) => (
                        <SelectItem key={`${dc.code}-${dc.name}`} value={dc.code}>
                          <span className="flex items-center gap-2">
                            <span>{dc.flag}</span>
                            <span className="text-slate-600">{dc.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder={t('whatsappPlaceholder')}
                    required
                    className="flex-1 h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base"
                  />
                </div>
              </div>

              {/* English Level - full width */}
              <div className="space-y-1.5">
                <Label>{t('englishLevel')}</Label>
                <Select value={englishLevel} onValueChange={setEnglishLevel} required>
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base">
                    <SelectValue placeholder={t('englishLevelPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {englishLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department - full width */}
              <div className="space-y-1.5">
                <Label>{t('department')}</Label>
                <Select value={department} onValueChange={setDepartment} required>
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base">
                    <SelectValue placeholder={t('departmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Semester - full width */}
              <div className="space-y-1.5">
                <Label>{t('startSemester')}</Label>
                <Select value={startSemester} onValueChange={setStartSemester} required>
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-base">
                    <SelectValue placeholder={t('startSemesterPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.value} value={sem.value}>
                        {sem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 bg-red-700 hover:bg-red-800 text-white font-bold text-lg shadow-lg shadow-red-700/20 transition-all mt-6!"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    {t('submit')} <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-400 mt-3">
                {t('privacyNote')}
              </p>
            </form>
          </div>
        ) : (
          /* Success State */
          <div className="max-w-md mx-auto w-full text-center py-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 lg:text-3xl">
              {t('successTitle')}
            </h2>
            <p className="text-slate-600 mb-6 text-base lg:text-lg">
              {t('successMessage')}
            </p>
            <Button
              className="h-14 px-8 bg-red-700 hover:bg-red-800 text-white font-bold text-lg shadow-xl gap-2"
              onClick={() => (window.location.href = `/${locale}/programs`)}
            >
              <BookOpen className="w-5 h-5" />
              {t('browsePrograms')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


