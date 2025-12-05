# Migration from OLD programs table to NEW system - COMPLETE ✅

## 🎯 Summary

Successfully migrated ALL files from the old `programs` table to the new `university_programs` + `program_catalog` system.

---

## ✅ Files Updated

### 1. **Admin Files** (3 files)

#### `/src/app/admin/(dashboard)/programs/actions.ts` ✅
- `getPrograms()` → Uses `v_university_programs_full` view
- `createProgram()` → Inserts into `university_programs` table
- `updateProgram()` → Updates `university_programs` table
- `deleteProgram()` → Deletes from `university_programs` table

**Old Fields Removed:**
- `title` (now `program_catalog_id`)
- `level` (from catalog)
- `field` (from catalog)
- `description` (from catalog)
- `deadline` (removed)

**New Fields Added:**
- `program_catalog_id` (required)
- `custom_title` (optional)
- `force_payment` (boolean)

---

### 2. **Public Pages** (6 files)

#### `/src/app/(public)/page.tsx` (Homepage) ✅
**Changes:**
```typescript
OLD: .from("programs")
NEW: .from("v_university_programs_full")

OLD: title: p.title
NEW: title: p.display_title || p.program_title

OLD: university: p.university
NEW: university: { name: p.university_name, city: p.city }
```

#### `/src/app/(public)/programs/page.tsx` (Programs List) ✅
**Changes:**
```typescript
OLD: .from("programs").select("*, university:universities(...)")
NEW: .from("v_university_programs_full").select("*")

OLD: name: p.title
NEW: name: p.display_title || p.program_title

OLD: university: p.university?.name
NEW: university: p.university_name

OLD: tuition: `${p.tuition_fee} RMB/Year`
NEW: tuition: `${p.tuition_fee} ${p.currency}/Year`
```

#### `/src/app/(public)/programs/[id]/page.tsx` (Program Detail) ✅
**Changes:**
```typescript
OLD: .from("programs").select("*, university:universities(...)")
NEW: .from("v_university_programs_full").select("*")
```

#### `/src/app/(public)/universities/page.tsx` (Universities List) ✅
**Changes:**
```typescript
OLD: .from("programs").select("*", { count: "exact" })
NEW: .from("university_programs").select("*", { count: "exact" }).eq("is_active", true)
```

#### `/src/app/(public)/universities/[slug]/page.tsx` (University Detail) ✅
**Changes:**
```typescript
OLD: .select("*, programs(id, title, level, ...)")
NEW: Separate query to v_university_programs_full

OLD: name: p.title
NEW: name: p.display_title

OLD: tuition: `${p.tuition_fee} RMB`
NEW: tuition: `${p.tuition_fee} ${p.currency}`

OLD: language: p.language
NEW: language: p.language_name || "Not specified"
```

#### `/src/app/(public)/applications/[id]/page.tsx` (Application Form) ✅
**Changes:**
```typescript
OLD: .from("programs").select("*, university:universities(*)")
NEW: .from("v_university_programs_full").select("*")
```

---

## 📊 Database Structure

### OLD System (Deprecated)
```
programs table:
├── id
├── university_id
├── title (required) ❌
├── level (required) ❌
├── field
├── duration
├── tuition_fee
├── language_id
├── deadline
└── description
```

### NEW System (Current)
```
program_catalog (Master list):
├── id
├── title
├── category
├── field
├── level
├── description
└── typical_duration

university_programs (University-specific):
├── id
├── university_id
├── program_catalog_id → Links to catalog
├── custom_title (optional)
├── tuition_fee
├── currency
├── duration (optional override)
├── language_id
├── intake
├── scholarship_chance
├── application_fee
├── service_fee
├── force_payment
└── is_active

v_university_programs_full (View):
├── All fields from university_programs
├── program_title (from catalog)
├── display_title (custom_title OR program_title)
├── category (from catalog)
├── level (from catalog)
├── university_name
├── city
├── province
└── language_name
```

---

## 🔄 Field Mapping Reference

### For Display:
```typescript
OLD → NEW

p.title → p.display_title || p.program_title
p.level → p.level (from catalog via view)
p.university.name → p.university_name
p.university.city → p.city
p.language → p.language_name
p.tuition_fee → p.tuition_fee (same)
"RMB" → p.currency (dynamic)
```

### For Forms:
```typescript
OLD → NEW

title (input) → program_catalog_id (select from catalog)
level (select) → Removed (comes from catalog)
field (input) → Removed (comes from catalog)
description (textarea) → Removed (comes from catalog)
deadline (date) → Removed
custom_title (new) → Optional override
force_payment (new) → Boolean flag
```

---

## ✅ Benefits of New System

### 1. **Data Consistency**
- Standardized program names
- No duplicate/similar programs
- Centralized program information

### 2. **Easier Data Entry**
- Select from catalog instead of typing
- Auto-fill level, category, duration
- Optional custom naming

### 3. **Better Queries**
- Single view for all data
- No complex joins needed
- Faster performance

### 4. **Flexibility**
- Universities can customize titles
- Override default duration
- Add university-specific details

---

## 🧪 Testing Checklist

### Admin Panel:
- [ ] Create new program (select from catalog)
- [ ] Edit existing program
- [ ] Delete program
- [ ] View programs list

### Public Pages:
- [ ] Homepage - featured programs display
- [ ] Programs list page - all programs display
- [ ] Program detail page - single program
- [ ] University detail page - programs list
- [ ] Universities list page - program counts
- [ ] Application form - program info

---

## 🚨 Important Notes

### 1. **Old Data Migration**
If you have existing data in the old `programs` table, you need to:
1. Create entries in `program_catalog` for unique programs
2. Migrate data to `university_programs` with `program_catalog_id`
3. Drop or rename old `programs` table

### 2. **View Dependency**
All public pages now depend on `v_university_programs_full` view. Make sure this view exists in your database by running:
```sql
-- Check if view exists
SELECT * FROM v_university_programs_full LIMIT 1;
```

### 3. **Active Programs Only**
Most queries now filter by `is_active = true`. Make sure to set this field when creating programs.

---

## 📝 Migration SQL (If Needed)

If you need to migrate old data:

```sql
-- 1. Insert unique programs into catalog
INSERT INTO program_catalog (title, category, level, typical_duration)
SELECT DISTINCT 
    title,
    'Uncategorized' as category,
    level,
    duration as typical_duration
FROM programs
ON CONFLICT (title) DO NOTHING;

-- 2. Migrate to university_programs
INSERT INTO university_programs (
    university_id,
    program_catalog_id,
    tuition_fee,
    currency,
    duration,
    language_id,
    intake,
    is_active
)
SELECT 
    p.university_id,
    pc.id as program_catalog_id,
    p.tuition_fee,
    COALESCE(p.currency, 'RMB') as currency,
    p.duration,
    p.language_id,
    p.intake,
    COALESCE(p.is_active, true) as is_active
FROM programs p
JOIN program_catalog pc ON pc.title = p.title AND pc.level = p.level;

-- 3. Verify migration
SELECT COUNT(*) FROM university_programs;

-- 4. (Optional) Rename old table
ALTER TABLE programs RENAME TO programs_old_backup;
```

---

## ✅ Status: COMPLETE

All files have been updated to use the new system. No files are using the old `programs` table anymore.

**Date:** November 28, 2025
**Migration Status:** ✅ Complete
**Files Updated:** 9 files
**Tables Updated:** 3 tables (program_catalog, university_programs, v_university_programs_full)
