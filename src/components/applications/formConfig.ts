/**
 * Smart Application Form — Level-Aware Configuration
 *
 * Defines which sections and fields are visible for each program level.
 * All level strings are normalized to lowercase before comparison.
 */

// ─── Types ─────────────────────────────────────────────────────────────

export type ProgramLevel = 'bachelor' | 'master' | 'phd' | 'non-degree';

/** All recognized levels — anything else falls back to the full form */
const ALL_LEVELS: ProgramLevel[] = ['bachelor', 'master', 'phd', 'non-degree'];

/** Levels that get the full-form experience */
const DEGREE_LEVELS: ProgramLevel[] = ['bachelor', 'master', 'phd'];

export type SectionId =
  | 'identity'
  | 'contact'
  | 'address'
  | 'education'
  | 'language'
  | 'emergency';

/** Icon names (matching lucide-react exports) used by the sub-step wizard */
export type SectionIconName = 'User' | 'Phone' | 'MapPin' | 'GraduationCap' | 'Languages' | 'Shield';

export interface FieldConfig {
  /** Field key matching formData property name */
  key: string;
  /** Which levels show this field */
  levels: ProgramLevel[];
  /** Whether this field is required (for validation) */
  required: boolean;
}

export interface SectionConfig {
  id: SectionId;
  /** Which levels show this section at all */
  levels: ProgramLevel[];
  /** Human-readable label key (matches i18n key under Apply.sections) */
  labelKey: string;
  /** Icon name for this section */
  iconName: SectionIconName;
  /** Fields within this section */
  fields: FieldConfig[];
}

/** Sub-step definition consumed by the wizard UI */
export interface SubStepDef {
  index: number;
  sectionId: SectionId;
  labelKey: string;
  iconName: SectionIconName;
  requiredKeys: string[];
}

// ─── Section & Field Definitions ────────────────────────────────────────

const SECTIONS: SectionConfig[] = [
  {
    id: 'identity',
    levels: ALL_LEVELS,
    labelKey: 'identity',
    iconName: 'User',
    fields: [
      { key: 'first_name',       levels: ALL_LEVELS,    required: true  },
      { key: 'last_name',        levels: ALL_LEVELS,    required: true  },
      { key: 'student_email',    levels: ALL_LEVELS,    required: true  },
      { key: 'student_passport', levels: ALL_LEVELS,    required: true  },
      { key: 'student_country',  levels: ALL_LEVELS,    required: true  },
      { key: 'gender',           levels: ALL_LEVELS,    required: true  },
      { key: 'date_of_birth',    levels: ALL_LEVELS,    required: true  },
      { key: 'religion',         levels: DEGREE_LEVELS, required: false },
      { key: 'marital_status',   levels: DEGREE_LEVELS, required: false },
    ],
  },
  {
    id: 'contact',
    levels: ALL_LEVELS,
    labelKey: 'contact',
    iconName: 'Phone',
    fields: [
      { key: 'student_phone',    levels: ALL_LEVELS, required: true  },
      { key: 'wechat_id',        levels: ALL_LEVELS, required: false },
      { key: 'preferred_intake', levels: ALL_LEVELS, required: true  },
    ],
  },
  {
    id: 'address',
    levels: DEGREE_LEVELS,
    labelKey: 'address',
    iconName: 'MapPin',
    fields: [
      { key: 'address',     levels: DEGREE_LEVELS, required: false },
      { key: 'city',        levels: DEGREE_LEVELS, required: false },
      { key: 'postal_code', levels: DEGREE_LEVELS, required: false },
    ],
  },
  {
    id: 'education',
    levels: DEGREE_LEVELS,
    labelKey: 'education',
    iconName: 'GraduationCap',
    fields: [
      { key: 'highest_education', levels: DEGREE_LEVELS, required: true  },
      { key: 'school_name',       levels: DEGREE_LEVELS, required: true  },
      { key: 'major_field',       levels: DEGREE_LEVELS, required: false },
      { key: 'graduation_year',   levels: DEGREE_LEVELS, required: false },
      { key: 'gpa_score',         levels: DEGREE_LEVELS, required: false },
    ],
  },
  {
    id: 'language',
    levels: DEGREE_LEVELS,
    labelKey: 'language',
    iconName: 'Languages',
    fields: [
      { key: 'chinese_proficiency', levels: DEGREE_LEVELS, required: false },
      { key: 'english_proficiency', levels: DEGREE_LEVELS, required: false },
      { key: 'test_score',          levels: DEGREE_LEVELS, required: false },
    ],
  },
  {
    id: 'emergency',
    levels: DEGREE_LEVELS,
    labelKey: 'emergency',
    iconName: 'Shield',
    fields: [
      { key: 'emergency_contact_name',         levels: DEGREE_LEVELS, required: true },
      { key: 'emergency_contact_phone',        levels: DEGREE_LEVELS, required: true },
      { key: 'emergency_contact_relationship', levels: DEGREE_LEVELS, required: true },
    ],
  },
];

// ─── Public helpers ─────────────────────────────────────────────────────

/**
 * Normalize a raw level string from the database into our canonical form.
 * Unknown values default to 'bachelor' (full form).
 */
export function normalizeLevel(raw?: string | null): ProgramLevel {
  if (!raw) return 'bachelor';
  const lower = raw.toLowerCase().trim();

  if (lower.includes('non-degree') || lower.includes('non_degree') || lower === 'nondegree') {
    return 'non-degree';
  }
  if (lower.includes('phd') || lower.includes('doctorate') || lower.includes('doctoral')) {
    return 'phd';
  }
  if (lower.includes('master')) return 'master';
  if (lower.includes('bachelor')) return 'bachelor';

  // Fallback: show full form for unknown levels
  return 'bachelor';
}

/** Returns only the sections visible for the given level */
export function getVisibleSections(level: ProgramLevel): SectionConfig[] {
  return SECTIONS.filter((s) => s.levels.includes(level)).map((s) => ({
    ...s,
    fields: s.fields.filter((f) => f.levels.includes(level)),
  }));
}

/** Returns true if a specific section is visible for the given level */
export function isSectionVisible(sectionId: SectionId, level: ProgramLevel): boolean {
  const section = SECTIONS.find((s) => s.id === sectionId);
  return !!section && section.levels.includes(level);
}

/** Returns true if a specific field is visible for the given level */
export function isFieldVisible(fieldKey: string, level: ProgramLevel): boolean {
  for (const section of SECTIONS) {
    for (const field of section.fields) {
      if (field.key === fieldKey) {
        return field.levels.includes(level);
      }
    }
  }
  // Field not in any section config → always visible (safety fallback)
  return true;
}

/** Returns the set of required field keys for validation */
export function getRequiredFields(level: ProgramLevel): Set<string> {
  const required = new Set<string>();
  for (const section of getVisibleSections(level)) {
    for (const field of section.fields) {
      if (field.required) {
        required.add(field.key);
      }
    }
  }
  return required;
}

/**
 * Returns an ordered array of sub-step definitions for the given program level.
 * Each sub-step maps to a visible section with its required field keys.
 */
export function getSubStepSections(level: ProgramLevel): SubStepDef[] {
  const visible = getVisibleSections(level);
  return visible.map((section, idx) => ({
    index: idx,
    sectionId: section.id,
    labelKey: section.labelKey,
    iconName: section.iconName,
    requiredKeys: section.fields.filter((f) => f.required).map((f) => f.key),
  }));
}
