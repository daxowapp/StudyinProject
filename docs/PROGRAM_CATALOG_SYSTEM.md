# Program Catalog System - Complete Guide

## 🎯 Problem Statement

### The Issue:
When universities add programs independently, they use different names for the same program:
- University A: "Business Administration"
- University B: "Business Management"  
- University C: "BA in Business"

**Result:** These are the SAME program but appear as 3 different programs in filters and searches! ❌

## ✅ Solution: Centralized Program Catalog

### Two-Table Architecture:

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   program_catalog       │         │  university_programs     │
│  (Master List)          │◄────────│  (University Offerings)  │
├─────────────────────────┤         ├──────────────────────────┤
│ • id                    │         │ • id                     │
│ • title                 │         │ • university_id          │
│ • category              │         │ • program_catalog_id ────┤
│ • field                 │         │ • custom_title           │
│ • level                 │         │ • tuition_fee            │
│ • description           │         │ • duration               │
│ • typical_duration      │         │ • language_id            │
└─────────────────────────┘         │ • scholarship_chance     │
                                    │ • is_active              │
                                    └──────────────────────────┘
```

## 📊 Database Tables

### 1. `program_catalog` (Master List)
**Purpose:** Standardized, centralized list of all academic programs

**Fields:**
- `id` - Unique identifier
- `title` - **Standardized program name** (e.g., "Business Administration")
- `category` - Main category (e.g., "Business & Management")
- `field` - Sub-category (e.g., "General Business")
- `level` - Bachelor, Master, PhD
- `description` - Program description
- `typical_duration` - Standard duration (e.g., "4 years")

**Example Entry:**
```sql
{
  id: "uuid-123",
  title: "Business Administration",
  category: "Business & Management",
  field: "General Business",
  level: "Bachelor",
  description: "Comprehensive business education...",
  typical_duration: "4 years"
}
```

### 2. `university_programs` (University Offerings)
**Purpose:** Links universities to programs with their specific details

**Fields:**
- `id` - Unique identifier
- `university_id` - Which university offers this
- `program_catalog_id` - Which standard program (FK to program_catalog)
- `custom_title` - University's own name (optional)
- `tuition_fee` - University-specific fee
- `currency` - RMB, USD, etc.
- `duration` - Can override typical duration
- `language_id` - Language of instruction
- `intake` - Enrollment periods
- `scholarship_chance` - Scholarship availability
- `application_fee` - Application cost
- `service_fee` - Service charge
- `is_active` - Active/Inactive status

**Example Entry:**
```sql
{
  id: "uuid-456",
  university_id: "tsinghua-uuid",
  program_catalog_id: "uuid-123", // Links to "Business Administration"
  custom_title: "Business Management", // Tsinghua calls it this
  tuition_fee: 30000,
  currency: "RMB",
  duration: "4 years",
  language_id: "english-uuid",
  is_active: true
}
```

## 🔄 How It Works

### Admin Workflow:

#### Step 1: Create Program Catalog (One Time)
Admin goes to **Program Catalog** page and adds standardized programs:
- Business Administration
- Computer Science
- MBBS
- etc.

#### Step 2: Universities Add Programs
When adding a program for a university:
1. Select university
2. **Choose from Program Catalog** (dropdown)
3. Add university-specific details:
   - Tuition fee
   - Duration (if different)
   - Language
   - Custom title (if they call it something else)
4. Save

### Example Scenario:

**Tsinghua University adds "Business Administration":**
```
Program Catalog: Business Administration
Custom Title: "Business Management" (optional)
Tuition: 30,000 RMB
Duration: 4 years
Language: English
```

**Peking University adds the SAME program:**
```
Program Catalog: Business Administration
Custom Title: "BA in Business" (optional)
Tuition: 28,000 RMB
Duration: 4 years
Language: Chinese
```

**Result:** Both appear under "Business Administration" in filters! ✅

## 🎨 Categories Included

1. **Business & Management**
   - Business Administration
   - MBA
   - International Business
   - Marketing
   - Finance
   - Accounting
   - Economics

2. **Engineering & Technology**
   - Computer Science
   - Software Engineering
   - Artificial Intelligence
   - Civil Engineering
   - Mechanical Engineering
   - Electrical Engineering
   - Architecture

3. **Medicine & Health Sciences**
   - MBBS
   - Nursing
   - Pharmacy
   - Public Health
   - Traditional Chinese Medicine

4. **Arts & Humanities**
   - Chinese Language & Literature
   - English Language & Literature
   - International Relations
   - Journalism & Communication
   - Law

5. **Natural Sciences**
   - Mathematics
   - Physics
   - Chemistry
   - Biology
   - Environmental Science

6. **Education**
   - Education
   - TESOL

## 🔍 Benefits

### 1. **Consistent Filtering**
```
Filter: "Business & Management"
Results: ALL business programs from ALL universities
- Even if they call it different names!
```

### 2. **Better Search**
```
Search: "Business"
Finds: All variations (Business Admin, Business Management, etc.)
```

### 3. **Easy Comparison**
```
Compare "Business Administration" across:
- Tsinghua: 30,000 RMB
- Peking: 28,000 RMB
- Fudan: 32,000 RMB
```

### 4. **Analytics**
```
Most Popular Program: Business Administration (45 universities)
Most Expensive: MBBS (avg 50,000 RMB)
```

### 5. **Scalability**
- Add new program once → All universities can use it
- Update description once → Updates everywhere
- Consistent data across platform

## 📱 Admin Pages

### 1. Program Catalog Page
**Route:** `/admin/program-catalog`

**Features:**
- ✅ View all standardized programs
- ✅ Add new programs to catalog
- ✅ Edit program details
- ✅ Filter by category/level
- ✅ Search programs
- ✅ See how many universities offer each

### 2. University Programs Page (Updated)
**Route:** `/admin/programs`

**Features:**
- ✅ Select from Program Catalog (dropdown)
- ✅ Add university-specific details
- ✅ Optional custom title
- ✅ Set tuition, fees, duration
- ✅ Link to university

## 🚀 Implementation Steps

### 1. Run Database Migration
```bash
# Execute the SQL migration file
psql -d your_database < DATABASE_MIGRATION_PROGRAMS.sql
```

### 2. Migrate Existing Data
```sql
-- Map existing programs to catalog
-- This needs to be done carefully based on your data
```

### 3. Update Admin UI
- ✅ Program Catalog page (created)
- ✅ Update Programs page to use catalog selection
- ✅ Update university detail page

### 4. Update Public Pages
- Update filters to use categories
- Update search to use catalog
- Display program from catalog + university details

## 📊 Database View

A helpful view is created for easy querying:

```sql
v_university_programs_full
```

This view combines:
- University info
- Program catalog info
- University-specific details

**Usage:**
```sql
SELECT * FROM v_university_programs_full
WHERE category = 'Business & Management'
AND level = 'Bachelor'
AND is_active = true;
```

## 🎯 Example Queries

### Get all Business programs:
```sql
SELECT * FROM v_university_programs_full
WHERE category = 'Business & Management';
```

### Compare same program across universities:
```sql
SELECT 
  university_name,
  tuition_fee,
  duration,
  language_name
FROM v_university_programs_full
WHERE program_title = 'Business Administration'
AND level = 'Bachelor'
ORDER BY tuition_fee;
```

### Most popular programs:
```sql
SELECT 
  program_title,
  COUNT(*) as universities_offering
FROM v_university_programs_full
GROUP BY program_title
ORDER BY universities_offering DESC;
```

## ✅ Advantages Summary

| Before | After |
|--------|-------|
| Each university creates own program names | Select from standardized catalog |
| "Business Admin" vs "Business Management" | Both are "Business Administration" |
| Inconsistent filtering | Perfect category filtering |
| Hard to compare | Easy comparison |
| Duplicate data | Normalized data |
| Manual categorization | Automatic categorization |

## 🎉 Result

A **professional, scalable, and maintainable** program management system that:
- ✅ Solves the duplicate program name problem
- ✅ Enables accurate filtering and searching
- ✅ Makes program comparison easy
- ✅ Provides consistent user experience
- ✅ Scales to thousands of programs
- ✅ Follows database best practices

This is the **industry-standard approach** used by major education platforms! 🚀
