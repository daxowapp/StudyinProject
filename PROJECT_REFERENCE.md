# StudyAtChina - Project Reference Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Database Schema](#database-schema)
3. [Application Routes](#application-routes)
4. [Key Components](#key-components)
5. [Authentication Flow](#authentication-flow)
6. [Application Submission Flow](#application-submission-flow)
7. [Important Files](#important-files)

---

## 🎯 Project Overview

**StudyAtChina** is a Next.js application that helps international students apply to Chinese universities. It features:
- University and program browsing
- Student application system
- Document upload
- Payment processing
- Application tracking dashboard

**Tech Stack:**
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **UI:** TailwindCSS + shadcn/ui
- **Animations:** Framer Motion

---

## 🗄️ Database Schema

### Core Tables

#### 1. **universities**
```sql
- id (UUID, PK)
- name (VARCHAR 255)
- slug (VARCHAR 255, UNIQUE)
- city, province
- website, description
- logo_url, cover_photo_url
- founded, total_students, international_students
- ranking, features (TEXT[])
- accommodation fields (availability, description, fee_range, features, types)
- created_at, updated_at
```

#### 2. **languages**
```sql
- id (UUID, PK)
- name (VARCHAR 100, UNIQUE)
- code (VARCHAR 10, UNIQUE)
- created_at
```

#### 3. **program_catalog**
```sql
- id (UUID, PK)
- title (VARCHAR 255, UNIQUE)
- category (VARCHAR 100)
- field (VARCHAR 100)
- level (VARCHAR 50) -- Bachelor, Master, PhD, Non-Degree
- description (TEXT)
- typical_duration (VARCHAR 50)
- created_at, updated_at
```

#### 4. **university_programs**
```sql
- id (UUID, PK)
- university_id (UUID, FK → universities)
- program_catalog_id (UUID, FK → program_catalog)
- slug (VARCHAR 255, UNIQUE)
- custom_title (VARCHAR 255)
- tuition_fee (DECIMAL)
- currency (VARCHAR 10, DEFAULT 'RMB')
- duration (VARCHAR 50)
- language_id (UUID, FK → languages)
- intake (VARCHAR 100)
- scholarship_chance (VARCHAR 50)
- application_fee (DECIMAL, DEFAULT 0)
- service_fee (DECIMAL, DEFAULT 0)
- force_payment (BOOLEAN, DEFAULT false)
- is_active (BOOLEAN, DEFAULT true)
- created_at, updated_at
- UNIQUE(university_id, program_catalog_id)
```

### Application System Tables

#### 5. **applications**
```sql
- id (UUID, PK)
- student_id (UUID) -- References auth.users(id)
- university_program_id (UUID, FK → university_programs)
- status (VARCHAR 50) -- draft, pending_documents, pending_payment, submitted, under_review, accepted, rejected, withdrawn
- student_name, student_email, student_phone
- student_country, student_passport
- preferred_intake
- emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
- payment_amount, payment_currency
- payment_status (VARCHAR 50)
- payment_reference
- documents_complete (BOOLEAN)
- documents_verified (BOOLEAN)
- documents_verified_at, documents_verified_by
- admin_notes (TEXT)
- rejection_reason (TEXT)
- submitted_at, reviewed_at, decision_at
- created_at, updated_at
```

#### 6. **application_documents**
```sql
- id (UUID, PK)
- application_id (UUID, FK → applications)
- requirement_id (UUID)
- document_name (VARCHAR 255)
- document_type (VARCHAR 100)
- file_url (TEXT)
- file_size (INTEGER)
- file_type (VARCHAR 50)
- is_verified (BOOLEAN)
- verified_at, verified_by
- verification_notes (TEXT)
- uploaded_at
- created_at, updated_at
```

#### 7. **application_status_history**
```sql
- id (UUID, PK)
- application_id (UUID, FK → applications)
- old_status (VARCHAR 50)
- new_status (VARCHAR 50)
- changed_by (UUID)
- notes (TEXT)
- created_at
```

### Views

#### **v_university_programs_full**
Combines university_programs with related data:
- Program catalog details
- University information
- Language information

---

## 🛣️ Application Routes

### Public Routes (No Auth Required)

#### Homepage & Information
- `/` - Homepage
- `/universities` - Browse universities
- `/universities/[slug]` - University detail page
- `/programs` - Browse programs
- `/programs/[slug]` - Program detail page
- `/scholarships` - Scholarships information
- `/articles` - Articles/blog
- `/how-to-apply` - Application guide
- `/contact` - Contact page

#### Authentication
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Password reset

### Protected Routes (Auth Required)

#### Application Flow
- `/apply/[programSlug]` - Application form for specific program
  - Checks authentication
  - Checks for existing application
  - Fetches program details and requirements
  - Shows multi-step form

#### Student Dashboard
- `/dashboard` - Main dashboard
  - Shows application statistics
  - Lists all user applications
  - Application status tracking
- `/dashboard/documents` - Document management
- `/dashboard/settings` - User settings

### Admin Routes
- `/admin/login` - Admin login
- `/admin/*` - Admin dashboard (separate from student dashboard)

---

## 🧩 Key Components

### Layout Components

#### **Navbar** (`/src/components/layout/Navbar.tsx`)
- Responsive navigation
- Auth state detection
- User dropdown menu when logged in
- Shows "Sign In" / "Get Started" when not logged in

Features:
- Transparent on homepage, solid on other pages
- Scroll-based styling
- Mobile menu with Sheet component
- User profile dropdown with logout

### Application Components

#### **ApplyForm** (`/src/components/applications/ApplyForm.tsx`)
Multi-step application form with:

**Steps:**
1. **Personal Information**
   - Pre-filled from user account
   - Country selector (dropdown)
   - Phone with country code selector
   - Preferred intake (dropdown)
   - Emergency contact

2. **Document Upload**
   - Fetches required documents for program
   - Upload to Supabase Storage
   - File validation

3. **Payment Summary** (if force_payment)
   - Shows fees breakdown
   - Payment confirmation

4. **Review & Submit**
   - Review all information
   - Final submission

**Success Screen:**
- Animated checkmark
- Application ID display
- "What's Next?" section
- Auto-redirect to dashboard (3 seconds)
- Manual "Go to Dashboard" button

### University Components

#### **UniversityContent** (`/src/components/universities/UniversityContent.tsx`)
- Displays university information
- Tabs for different sections
- Programs list
- Scholarships section
- Accommodation section

#### **AccommodationSection** (`/src/components/universities/AccommodationSection.tsx`)
- Shows accommodation availability
- Types and features
- Fee ranges
- Dynamic icons

### UI Components (shadcn/ui)
Located in `/src/components/ui/`:
- `button.tsx` - Button component
- `card.tsx` - Card layouts
- `input.tsx` - Form inputs
- `select.tsx` - Dropdown selects
- `badge.tsx` - Status badges
- `alert.tsx` - Alert messages
- `dropdown-menu.tsx` - Dropdown menus
- `sheet.tsx` - Mobile slide-out menu

---

## 🔐 Authentication Flow

### Registration Flow
1. User fills registration form (`/auth/register`)
2. Form data includes: email, password, firstName, lastName
3. `signup()` action creates user with metadata:
   ```typescript
   {
     first_name: firstName,
     last_name: lastName,
     full_name: `${firstName} ${lastName}`,
     role: "student"
   }
   ```
4. Email confirmation sent
5. Redirects to login with returnUrl preserved

### Login Flow
1. User enters credentials (`/auth/login`)
2. `login()` action authenticates
3. Redirects to `returnUrl` or `/dashboard`
4. Navbar updates to show user profile

### Auth State Management
- **Server-side:** `createClient()` from `@/lib/supabase/server`
- **Client-side:** `createClient()` from `@/lib/supabase/client`
- **Auth listener:** `onAuthStateChange()` in Navbar

---

## 📝 Application Submission Flow

### 1. User Clicks "Apply Now"
- From program page or university page
- Redirects to `/apply/[programSlug]`

### 2. Authentication Check
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  redirect(`/auth/login?returnUrl=/apply/${programSlug}`);
}
```

### 3. Existing Application Check
```typescript
const { data: existingApplication } = await supabase
  .from('applications')
  .select('id, status')
  .eq('student_id', user.id)
  .eq('university_program_id', program.id)
  .single();

if (existingApplication) {
  redirect(`/apply/${programSlug}`); // Show existing application
}
```

### 4. Form Pre-filling
Data from `user.user_metadata`:
- `full_name` → student_name
- `email` → student_email
- `phone` → student_phone
- `country` → student_country
- `phone_country_code` → phoneCountryCode

### 5. Document Upload
```typescript
const fileName = `${user.id}/${requirementId}/${Date.now()}.${fileExt}`;
await supabase.storage
  .from('application-documents')
  .upload(fileName, file);
```

### 6. Application Submission
```typescript
const { data: application } = await supabase
  .from('applications')
  .insert({
    student_id: user.id,
    university_program_id: program.id,
    student_phone: `${phoneCountryCode} ${formData.student_phone}`,
    status: requiresPayment ? 'pending_payment' : 'submitted',
    // ... other fields
  })
  .select()
  .single();
```

### 7. Success & Redirect
- Show animated success screen
- Display application ID
- Auto-redirect to `/dashboard` after 3 seconds

---

## 📁 Important Files

### Configuration
- `/src/lib/supabase/server.ts` - Server-side Supabase client
- `/src/lib/supabase/client.ts` - Client-side Supabase client
- `/src/lib/constants/countries.ts` - Country and phone code data
- `/components.json` - shadcn/ui configuration

### Database Scripts
- `/DATABASE_COMPLETE_SCHEMA.sql` - Core database schema
- `/DATABASE_ADD_APPLICATIONS.sql` - Application system schema
- `/DATABASE_ADD_ACCOMMODATION.sql` - Accommodation fields
- `/INSERT_COMPLETE_UNIVERSITY_DATA_FIXED.sql` - University data
- `/INSERT_EXTRA_PROGRAMS_FIXED.sql` - Additional programs
- `/INSERT_EXTRA_BACHELOR_PROGRAMS_FIXED.sql` - Bachelor programs

### Authentication Actions
- `/src/app/(public)/auth/actions/index.ts`
  - `login()` - User login
  - `signup()` - User registration
  - `signout()` - User logout
  - `resetPassword()` - Password reset

### Key Pages
- `/src/app/(public)/apply/[programSlug]/page.tsx` - Application entry
- `/src/app/dashboard/page.tsx` - Student dashboard
- `/src/app/dashboard/layout.tsx` - Dashboard layout with sidebar
- `/src/app/(public)/programs/[slug]/page.tsx` - Program details
- `/src/app/(public)/universities/[slug]/page.tsx` - University details

---

## 🎨 Styling & UI

### Color Scheme
- **Primary:** Red/Orange gradient (Chinese theme)
- **Status Colors:**
  - 🟡 Yellow - Pending actions
  - 🔵 Blue - Under review
  - 🟢 Green - Accepted
  - 🔴 Red - Rejected
  - ⚪ Gray - Draft/Inactive

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Mobile menu with Sheet component
- Responsive grid layouts

### Animations
- Framer Motion for page transitions
- Scroll-based navbar changes
- Success screen animations
- Hover effects on cards

---

## 🔧 Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📊 Application Status Flow

```
draft
  ↓
pending_documents (if documents required)
  ↓
pending_payment (if force_payment enabled)
  ↓
submitted
  ↓
under_review
  ↓
accepted / rejected / withdrawn
```

---

## 🚀 Key Features

### ✅ Implemented
- University browsing and search
- Program catalog with filters
- User authentication (register/login)
- Application submission system
- Document upload to Supabase Storage
- Multi-step application form
- Student dashboard with statistics
- Application status tracking
- Responsive design
- Email confirmation flow
- Return URL preservation
- Pre-filled forms from user data

### 🔄 Pending
- Payment gateway integration
- Admin dashboard for application review
- Email notifications
- Document verification system
- Application status updates by admin
- Advanced search and filters
- Scholarship application system

---

## 📝 Notes

### Important Conventions
1. **User ID:** Stored in `auth.users`, referenced as `student_id` in applications
2. **Slugs:** Used for SEO-friendly URLs (universities and programs)
3. **Status:** Always lowercase with underscores (e.g., `pending_payment`)
4. **Phone Numbers:** Stored with country code (e.g., `+86 123456789`)
5. **Dates:** ISO format with timezone

### RLS (Row Level Security)
- Students can only view/edit their own applications
- Admins can view/edit all applications
- Public can view universities and programs
- Documents are protected by RLS

### File Storage Structure
```
application-documents/
  └── {user_id}/
      └── {requirement_id}/
          └── {timestamp}.{ext}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Page Not Found" on `/dashboard/applications`
**Solution:** This route doesn't exist. Use `/dashboard` instead.

### Issue: Name not pre-filled in application form
**Solution:** Ensure `full_name` is saved during registration in `signup()` action.

### Issue: Duplicate key errors in country codes
**Solution:** Use unique `id` field for React keys, not `code`.

### Issue: Auth redirect not working
**Solution:** Check `returnUrl` parameter is preserved through registration → login flow.

---

## 📞 Support

For issues or questions:
1. Check this reference document
2. Review database schema
3. Check Supabase logs
4. Verify RLS policies
5. Test authentication flow

---

**Last Updated:** November 29, 2025
**Version:** 1.0
**Maintained by:** Development Team
