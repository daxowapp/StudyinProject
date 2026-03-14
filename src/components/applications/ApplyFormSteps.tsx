'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCheck,
  Upload,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRIES, COUNTRY_CODES } from '@/lib/constants/countries';
import { useState, useRef, useCallback } from 'react';

// ─── Glass Card ─────────────────────────────────────
export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ${className}`}>
      <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-white/10 pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────
export function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Pre-filled Badge ───────────────────────────────
function PrefilledBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider border border-emerald-100">
      <CheckCircle2 className="w-3 h-3" /> Pre-filled
    </span>
  );
}

// ─── Smart Input Field ──────────────────────────────
export function SmartField({
  id, name, label, value, onChange, placeholder, type = 'text', required = false, prefilled = false, error,
}: {
  id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; required?: boolean; prefilled?: boolean; error?: string;
}) {
  const isValid = required ? value.trim().length > 0 : true;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {prefilled && value && <PrefilledBadge />}
      </div>
      <div className="relative">
        <Input
          id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
          className={`h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''}`}
        />
        {required && value && isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

// ─── Phone Field with Country Code ──────────────────
export function PhoneField({
  id, name, label, value, onChange, countryId, onCountryChange, required = false, prefilled = false,
}: {
  id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryId: string; onCountryChange: (id: string) => void; required?: boolean; prefilled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {prefilled && value && <PrefilledBadge />}
      </div>
      <div className="flex gap-2">
        <Select value={countryId} onValueChange={onCountryChange}>
          <SelectTrigger className="w-[110px] h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((item) => (
              <SelectItem key={item.id} value={item.id}>{item.code} {item.country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            id={id} name={name} type="tel" placeholder="555 123 4567" value={value} onChange={onChange} required={required}
            className="h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          {required && value && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
        </div>
      </div>
    </div>
  );
}

// ─── Country Select ─────────────────────────────────
export function CountrySelect({
  value, onChange, label, required = false, prefilled = false,
}: {
  value: string; onChange: (value: string) => void; label: string; required?: boolean; prefilled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {prefilled && value && <PrefilledBadge />}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country} value={country}>{country}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {required && value && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 hidden" />}
    </div>
  );
}

// ─── Intake Select ──────────────────────────────────
export function IntakeSelect({
  value, onChange, intakes, label, required = false,
}: {
  value: string; onChange: (value: string) => void; intakes: { id: string; name: string }[]; label: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm">
          <SelectValue placeholder="Select intake period" />
        </SelectTrigger>
        <SelectContent>
          {intakes.length > 0 ? (
            intakes.map((intake) => (
              <SelectItem key={intake.id} value={intake.name}>{intake.name}</SelectItem>
            ))
          ) : (
            <SelectItem value="September 2025">September 2025</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Smart Select Field ─────────────────────────────
export function SmartSelect({
  id, label, value, onChange, options, placeholder, required = false, prefilled = false,
}: {
  id: string; label: string; value: string; onChange: (value: string) => void;
  options: { value: string; label: string }[]; placeholder?: string; required?: boolean; prefilled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {prefilled && value && <PrefilledBadge />}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm">
          <SelectValue placeholder={placeholder || 'Select...'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Date Field ─────────────────────────────────────
export function DateField({
  id, name, label, value, onChange, required = false, prefilled = false,
}: {
  id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; prefilled?: boolean;
}) {
  const isValid = required ? value.trim().length > 0 : true;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {prefilled && value && <PrefilledBadge />}
      </div>
      <div className="relative">
        <Input
          id={id} name={name} type="date" value={value} onChange={onChange} required={required}
          className="h-11 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
        {required && value && isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
        )}
      </div>
    </div>
  );
}

// ─── TextArea Field ─────────────────────────────────
export function TextAreaField({
  id, name, label, value, onChange, placeholder, required = false, prefilled = false, rows = 2,
}: {
  id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; prefilled?: boolean; rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {prefilled && value && <PrefilledBadge />}
      </div>
      <textarea
        id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows}
        className="w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-2.5 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:outline-none resize-none"
      />
    </div>
  );
}

// ─── Document Upload Zone (CUCAS-style ribbon) ─────
export function DocumentUploadZone({
  requirement, isUploaded, isReused, uploadedFile, existingDoc, loading,
  onUpload, onReuse, onRemoveReuse, isRequired,
}: {
  requirement: { id: string; title: string; description?: string };
  isUploaded: boolean; isReused: boolean; uploadedFile?: File;
  existingDoc?: { id: string; file_url: string; file_name: string; document_name?: string; file_type?: string; file_size?: number };
  loading: boolean; isRequired: boolean;
  onUpload: (file: File) => void; onReuse: () => void; onRemoveReuse: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  }, [onUpload]);

  const done = isUploaded || isReused;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${done ? 'border-emerald-200 bg-emerald-50/30' : isDragging ? 'border-blue-400 bg-blue-50/50 scale-[1.01]' : 'border-gray-200 bg-white/60 hover:border-gray-300'}`}
    >
      {/* Orange ribbon header */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${
        done
          ? 'bg-linear-to-r from-emerald-500 to-emerald-600'
          : 'bg-linear-to-r from-orange-500 to-amber-500'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          {done ? <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> : <FileText className="w-4 h-4 text-white/90 shrink-0" />}
          <h4 className="font-semibold text-white text-sm truncate">{requirement.title}</h4>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
          done
            ? 'bg-white/20 text-white'
            : isRequired
            ? 'bg-white/25 text-white'
            : 'bg-white/20 text-white/80'
        }`}>
          {done ? '✓ Done' : isRequired ? 'Required' : 'Optional'}
        </span>
      </div>

      <div className="p-4">
        {/* Description */}
        {requirement.description && (
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{requirement.description}</p>
        )}

        {/* Existing document reuse option */}
        {existingDoc && !isUploaded && !isReused && (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <FileCheck className="w-4 h-4" />
              <span>Found: <strong>{existingDoc.document_name}</strong></span>
            </div>
            <Button size="sm" variant="secondary" className="h-7 text-xs bg-white hover:bg-blue-100 text-blue-700 border border-blue-200" onClick={onReuse}>
              Use Existing
            </Button>
          </div>
        )}

        {isReused ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2.5 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            <span className="flex-1">Using: <strong>{existingDoc?.document_name}</strong></span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={onRemoveReuse}>
              Change
            </Button>
          </div>
        ) : isUploaded && uploadedFile ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2.5 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            <span className="flex-1 truncate">{uploadedFile.name}</span>
            <span className="text-xs text-emerald-400">{(uploadedFile.size / 1024).toFixed(0)} KB</span>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-6 cursor-pointer rounded-lg border border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
          >
            <Upload className={`w-8 h-8 mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-300'}`} />
            <p className="text-sm text-gray-500">
              <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">RAR, PDF, JPG, PNG, GIF, DOC, DOCX — max 5MB</p>
            <input
              ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.rar" className="hidden" disabled={loading}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file); }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}


// ─── Progress Top Bar (replaces sidebar + mobile bar) ────
export function ProgressTopBar({
  steps, currentStep, program, onStepClick,
}: {
  steps: { num: number; label: string; icon: React.ElementType; completed: boolean }[];
  currentStep: number;
  program: { university: { name: string; logo_url?: string }; program_catalog?: { title: string; level: string } };
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="mb-6">
      <GlassCard className="p-4 md:p-5">
        {/* Top row: Program info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          {program.university.logo_url ? (
            <img src={program.university.logo_url} alt="" className="w-9 h-9 rounded-lg object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {program.university.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 font-medium truncate">{program.university.name}</p>
            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{program.program_catalog?.title}</p>
          </div>
          {program.program_catalog?.level && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold shrink-0">
              <BookOpen className="w-3 h-3" /> {program.program_catalog.level}
            </span>
          )}
        </div>

        {/* Bottom row: Horizontal steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.num;
            const isCompleted = step.completed;
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <button
                  onClick={() => onStepClick?.(step.num)}
                  disabled={!isCompleted && !isActive}
                  className={`flex items-center gap-2 group transition-all ${
                    isCompleted && !isActive ? 'cursor-pointer' : !isActive ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0 transition-all text-xs font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted && !isActive ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`hidden md:block text-sm font-semibold whitespace-nowrap ${
                    isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                  }`}>{step.label}</span>
                </button>

                {/* Connector line */}
                {!isLast && (
                  <div className="flex-1 mx-2 md:mx-3">
                    <div className="h-0.5 rounded-full bg-gray-100 relative overflow-hidden">
                      {isCompleted && (
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Document Notice Panel (CUCAS-style) ────────────
export function DocumentNoticePanel() {
  const notices = [
    <><span className="text-red-600 font-bold">&quot;*&quot;</span> means necessary documents that you must provide in your application.</>,
    'To avoid delays in admission, please upload each document according to the description.',
    'Please make sure the scanned or photographed documents are clearly readable and can be printed.',
    'The system only accepts the following formats: RAR, PDF, JPG, PNG, GIF, DOC, DOCX.',
    'Single upload file size cannot exceed 5MB.',
    'For applicants who are in China: If you are an employee, you still need to provide employment separation certificate and your current residence permit. If you are a student, you need to provide transfer certificate, leaving certificate, certificate of attendance rate issued by previous school and your current residence permit. You can compress related documents together and upload in any item.',
  ];

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100/80 border-b border-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <h4 className="text-sm font-bold text-amber-800">Notice</h4>
      </div>
      <ol className="px-4 py-3 space-y-2 list-none">
        {notices.map((rule, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed">
            <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-amber-200/60 text-amber-700 text-[10px] font-bold">{i + 1}</span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Conditional Document Section (CUCAS-style) ─────
// CUCAS uses inverted logic: "I never studied in China before" checkbox.
// When UNCHECKED (user HAS studied in China), documents are shown.
export function ConditionalDocumentSection({
  sectionNumber, heading, checkboxLabel, expanded, onToggle, children,
}: {
  sectionNumber: string;
  heading: string;
  checkboxLabel: string;
  expanded: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      {/* Section heading */}
      <div className="flex items-start gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{sectionNumber}</div>
        <p className="text-sm font-bold text-gray-900 leading-snug">{heading}</p>
      </div>

      {/* CUCAS-style checkbox (inverted: checking = "I do NOT need these") */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none group mb-3">
        <input
          type="checkbox"
          checked={!expanded}
          onChange={(e) => onToggle(!e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{checkboxLabel}</span>
      </label>

      {/* Collapsible doc list */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 pl-1"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

// ─── Service Banner (Translation + Guardian links) ───
export function ServiceBanner() {
  return (
    <div className="mb-5 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-sm text-gray-700 leading-relaxed">
      <p>
        If you want to book our <a href="#" className="text-blue-600 underline font-medium">translation service</a>, please pay and book it at least <strong>2 weeks</strong> before the application deadline for submission of all documents.
      </p>
      <p className="mt-1.5">
        If you want to book our <a href="#" className="text-blue-600 underline font-medium">guardian service</a>, you need to pay and book it <strong>2 months</strong> before the application deadline, just in case your application fails because of failed to submit application documents in time.
      </p>
    </div>
  );
}

// ─── Universal Document Section (CUCAS "More Notes" / Section I) ───
export interface UniversalDoc {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  downloadUrl?: string;
  downloadLabel?: string;
}

export const CUCAS_UNIVERSAL_DOCS: UniversalDoc[] = [
  {
    id: 'a0000001-0000-4000-8000-000000000001',
    title: 'Passport',
    description: 'A clear, full-color scan of your passport information page, showing your name, passport number, expiration date, and photo. Some universities may also require blank visa pages, so you are advised to upload a few blank pages as well.',
    isRequired: true,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000002',
    title: 'Photo',
    description: 'A recent passport-sized ID photo (2 × 2 inches) with a plain white background. Full face visible, no headwear (except for religious reasons). Taken within the last 6 months.',
    isRequired: true,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000003',
    title: 'Highest Degree Graduation Certificate',
    description: 'A formal graduation certificate of your highest completed education level (e.g., Senior High School, Bachelor\'s, or Master\'s degree). If the document is not in Chinese or English, it must be translated into Chinese or English and notarized by an authorized translation agency or relevant authority. Self-translations are not accepted.',
    isRequired: false,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000004',
    title: 'Highest Degree Academic Transcripts',
    description: 'Formal academic transcripts of your highest completed education level, covering ALL academic years, NOT just the final year. If the document is not in Chinese or English, it must be translated into Chinese or English and notarized by an authorized translation agency or relevant authority.',
    isRequired: false,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000005',
    title: 'Chinese Language Proficiency Certificate (For Chinese Medium Programs)',
    description: 'For Bachelor\'s degree programs taught in Chinese, HSK Level 4 or above with a minimum score of 180 is usually required. For Master\'s degree programs, HSK Level 5 with a score of 180 or above is generally required. Higher scores and levels are preferred.',
    isRequired: false,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000006',
    title: 'English Language Proficiency Certificate (For English Medium Programs)',
    description: 'IELTS (6.0 or above) or TOEFL iBT (90 or above) is generally preferred. If unable to provide these, you may submit alternative proof such as a Duolingo English Test score or an official English proficiency certificate from your previous school/university.',
    isRequired: false,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000007',
    title: 'Non-criminal Record Certificate',
    description: 'This document is generally valid for only 6 months. Obtain this certificate from the local police station of your current residence, confirming no criminal record during the 6 months prior to issuance. If currently in China, the certificate must be issued by the local Chinese police. If not in Chinese or English, it must be translated and notarized.',
    isRequired: false,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000008',
    title: 'Physical Examination Form',
    description: 'Download the form template, print it, and bring it to a hospital for the required medical tests. The medical examination must cover all items listed. Ensure your photo is attached and the form is stamped and signed by the hospital. Medical results are valid for 6 months only. The document must be in English or Chinese.',
    isRequired: false,
    downloadUrl: '#',
    downloadLabel: 'Download Template',
  },
];

export const CUCAS_CHINA_DOCS: UniversalDoc[] = [
  {
    id: 'a0000001-0000-4000-8000-000000000009',
    title: 'A Non-objection Transfer Certificate (无异议转学证明)',
    description: 'Issued by your previous Chinese university. This document should include your personal information, academic performance (including attendance), estimated graduation date, and your current university\'s approval of your transfer application. It must also contain the university\'s contact information (email and phone), issue date, and official stamp.',
    isRequired: true,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000010',
    title: 'Scanned copies of all passport pages with entry and exit stamps for China',
    description: '',
    isRequired: true,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000011',
    title: 'Scanned copies of all visa pages (X1, X2, T, or others) and residence permit pages (if applicable)',
    description: '',
    isRequired: true,
  },
  {
    id: 'a0000001-0000-4000-8000-000000000012',
    title: 'A Recommendation Letter From Previous Chinese University',
    description: 'Some universities may also request a recommendation letter from your previous university or other supporting documents.',
    isRequired: false,
  },
];

export const CUCAS_UNDER18_DOCS: UniversalDoc[] = [
  {
    id: 'a0000001-0000-4000-8000-000000000013',
    title: 'Notarized Guardian\'s Letter of Commitment',
    description: 'Students under 18 must find a Chinese guardian who resides in the same city as the university you are applying to. Upload a scanned copy of the notarized Guardian\'s Letter of Commitment. This document must be certified in your home country and notarized in China. A Notarization of Declaration (声明公证) issued in China is eventually required. A scanned copy is acceptable at the initial stage.',
    isRequired: true,
  },
];

// ─── Review Section ─────────────────────────────────
export function ReviewSection({
  title, icon: Icon, children, onEdit,
}: {
  title: string; icon: React.ElementType; children: React.ReactNode; onEdit?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-gray-100 bg-white/60 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-gray-900 flex-1 text-left">{title}</span>
        {onEdit && (
          <span
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
          >
            Edit
          </span>
        )}
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

// ─── Review Field ───────────────────────────────────
export function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );
}

// ─── Step Navigation Buttons ────────────────────────
export function StepNavigation({
  onBack, onNext, nextLabel, nextDisabled = false, loading = false, isSubmit = false, subStepLabel,
}: {
  onBack?: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean; loading?: boolean; isSubmit?: boolean;
  subStepLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
      {onBack ? (
        <Button variant="outline" onClick={onBack} className="rounded-xl h-11 px-6 border-gray-200">
          Back
        </Button>
      ) : <div />}
      <div className="flex items-center gap-3">
        {subStepLabel && (
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">{subStepLabel}</span>
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled || loading}
          className={`rounded-xl h-11 px-8 font-semibold shadow-lg transition-all ${
            isSubmit
              ? 'bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25 text-white'
              : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25 text-white'
          } ${nextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Submitting...
            </span>
          ) : nextLabel}
        </Button>
      </div>
    </div>
  );
}

// ─── Sub-Step Indicator (compact dots) ──────────────
export function SubStepIndicator({
  current, total, labels,
}: {
  current: number; total: number; labels: string[];
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <div key={i} className="flex items-center gap-2">
            {/* Dot */}
            <motion.div
              layout
              className={`flex items-center gap-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-blue-100 border border-blue-300 px-3 py-1'
                  : isCompleted
                  ? 'bg-emerald-100 border border-emerald-200 px-2 py-1'
                  : 'bg-gray-100 border border-gray-200 px-2 py-1'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`} />
              )}
              {(isActive || isCompleted) && labels[i] && (
                <span className={`text-[11px] font-medium ${isActive ? 'text-blue-700' : 'text-emerald-600'}`}>
                  {labels[i]}
                </span>
              )}
            </motion.div>
            {/* Connector line */}
            {i < total - 1 && (
              <div className={`w-3 h-px ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

