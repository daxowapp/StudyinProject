# University-Specific Scholarships System

## Overview
Each university can now have its own custom scholarship types with unique benefits. This allows you to accurately represent the different scholarship offerings from each institution.

## Key Features
- ✅ **University-Specific:** Each university defines its own scholarship types
- ✅ **Flexible Benefits:** Support for tuition coverage, accommodation, stipend, medical insurance, and one-time allowances
- ✅ **Custom Duration:** Scholarships can be for 1 year, 4 years, or full program duration
- ✅ **Service Fees:** Define service fees in both USD and CNY
- ✅ **Auto-Display:** Scholarships automatically appear on university and program pages

## Database Structure

### Table: `university_scholarships`

**Key Fields:**
- `university_id` - Links to specific university
- `type_name` - Short name (e.g., "Type A", "Type B")
- `display_name` - Full descriptive name
- `description` - What's included
- `tuition_coverage_percentage` - 0-100%
- `duration_years` - How many years (null = full program)
- `includes_accommodation` - Boolean
- `accommodation_type` - Description (e.g., "Free university dormitory")
- `includes_stipend` - Boolean
- `stipend_amount_monthly` - Amount per month
- `stipend_currency` - Usually "CNY" or "RMB"
- `stipend_duration_months` - Usually 12 (per year)
- `includes_medical_insurance` - Boolean
- `one_time_allowance` - One-time cash benefit
- `service_fee_usd` - What student pays (USD)
- `service_fee_cny` - What student pays (CNY)
- `is_active` - Show/hide
- `display_order` - Sort order

## Admin Interface

### 1. Access University Scholarships
**Path:** `/admin/universities` → Click "Scholarships" button for any university

### 2. Manage Scholarships Page
**URL:** `/admin/universities/[id]/scholarships`

**Features:**
- View all scholarships for the university
- See coverage %, duration, benefits, service fees
- Quick stats (total scholarships, active count, avg service fee)
- Add new scholarship button
- Edit existing scholarships

### 3. Create/Edit Scholarship
**URL:** `/admin/universities/[id]/scholarships/[scholarshipId]` or `/new`

**Form Sections:**

#### Basic Information
- Type Name (e.g., "Type A")
- Display Name (e.g., "Type A: Full Scholarship with Stipend")
- Description
- Display Order

#### Tuition Coverage
- Coverage Percentage (0-100%)
- Duration in Years (1, 4, or leave empty for full program)

#### Accommodation
- Toggle: Includes Accommodation
- Accommodation Type (e.g., "Free university dormitory" or "Accommodation allowance")

#### Monthly Stipend
- Toggle: Includes Stipend
- Amount per Month
- Currency (CNY/RMB)
- Months per Year (usually 12)

#### Other Benefits
- Toggle: Medical Insurance
- One-Time Allowance (optional cash benefit)
- Currency

#### Service Fees
- Service Fee in USD
- Service Fee in CNY

#### Status
- Active/Inactive toggle
- Live preview of how it will look to students

## Real-World Examples

### Example 1: University with Many Types (Ningbo University Style)

```
Type A: Free tuition, free accommodation, 2500 RMB/month (4 years)
- Coverage: 100%
- Duration: 4 years
- Accommodation: Yes - "Free university dormitory"
- Stipend: 2500 CNY/month for 12 months
- Service Fee: $3,500 / ¥25,000

Type B: Free tuition, free accommodation (4 years)
- Coverage: 100%
- Duration: 4 years
- Accommodation: Yes - "Free university dormitory"
- Stipend: No
- Service Fee: $2,800 / ¥20,000

Type C: Free tuition (4 years)
- Coverage: 100%
- Duration: 4 years
- Accommodation: No
- Stipend: No
- Service Fee: $2,200 / ¥16,000

Type D: Free tuition, free accommodation (1 year)
- Coverage: 100%
- Duration: 1 year
- Accommodation: Yes
- Service Fee: $2,000 / ¥14,000

Type E: Free tuition (1 year)
- Coverage: 100%
- Duration: 1 year
- Service Fee: $1,800 / ¥13,000

Type F: 50% off tuition (1 year)
- Coverage: 50%
- Duration: 1 year
- Service Fee: $1,500 / ¥11,000

Type G: 25% off tuition (1 year)
- Coverage: 25%
- Duration: 1 year
- Service Fee: $1,200 / ¥8,500

Type H: RMB 10,000 allowance (1 year)
- Coverage: 0%
- Duration: 1 year
- One-time Allowance: 10,000 CNY
- Service Fee: $1,000 / ¥7,000
```

### Example 2: Simple Package University

```
Full Scholarship:
- Coverage: 100%
- Duration: 4 years
- Accommodation: Yes - "Free university dormitory or accommodation allowance"
- Stipend: 1500 CNY/month for 12 months
- Medical Insurance: Yes
- Service Fee: $3,000 / ¥21,000
```

### Example 3: Percentage-Based University

```
Type A: Free tuition (4 years)
- Coverage: 100%
- Duration: 4 years
- Service Fee: $3,500 / ¥25,000

Type B: 50% off tuition (4 years)
- Coverage: 50%
- Duration: 4 years
- Service Fee: $2,500 / ¥18,000

Type C: 30% off tuition (4 years)
- Coverage: 30%
- Duration: 4 years
- Service Fee: $2,000 / ¥14,000

Type D: 20% off tuition (4 years)
- Coverage: 20%
- Duration: 4 years
- Service Fee: $1,800 / ¥13,000
```

## How to Add Scholarships

### Step 1: Go to Universities Admin
Navigate to `/admin/universities`

### Step 2: Click "Scholarships" Button
Click the "Scholarships" button next to the university you want to manage

### Step 3: Click "Add Scholarship"
On the scholarships page, click "Add Scholarship"

### Step 4: Fill in the Form

**Example for "Type A: Full Scholarship with Stipend":**

```
Basic Information:
- Type Name: Type A
- Display Name: Type A: Full Scholarship with Stipend
- Description: Free tuition, free accommodation on campus and 2500RMB/month stipend for 12 months
- Display Order: 1

Tuition Coverage:
- Coverage: 100%
- Duration: 4 years

Accommodation:
- Includes Accommodation: ✓ Yes
- Type: Free university dormitory

Monthly Stipend:
- Includes Stipend: ✓ Yes
- Amount: 2500
- Currency: CNY
- Months/Year: 12

Other Benefits:
- Medical Insurance: (optional)
- One-Time Allowance: (optional)

Service Fees:
- USD: 3500
- CNY: 25000

Status:
- Active: ✓ Yes
```

### Step 5: Save
Click "Save Changes"

### Step 6: Repeat
Add as many scholarship types as the university offers

## Where Scholarships Appear

Once you add scholarships for a university, they automatically appear on:

1. **University Detail Page** (`/universities/[slug]`)
   - Section: "Available Scholarship Options"
   - Shows after programs list

2. **All Program Pages for That University** (`/programs/[slug]`)
   - Section: "Scholarship Options for This Program"
   - Shows after admission requirements

3. **Dynamic Display**
   - Only active scholarships are shown
   - Sorted by display_order
   - Shows all benefits clearly

## Migration Instructions

### 1. Run the Database Migration

Execute the SQL file:
```sql
-- File: DATABASE_MIGRATION_UNIVERSITY_SCHOLARSHIPS.sql
```

This will:
- Drop old `scholarship_types` table
- Create new `university_scholarships` table
- Set up proper relationships and indexes

### 2. Add Scholarships via Admin

For each university:
1. Go to `/admin/universities`
2. Click "Scholarships"
3. Add each scholarship type
4. Fill in all details
5. Save

### 3. Verify Frontend

Visit:
- Any university page
- Any program page for that university
- Check that scholarships display correctly

## Tips & Best Practices

1. **Be Specific in Descriptions**
   - Good: "Free tuition, free accommodation on campus and 2500RMB/month stipend"
   - Bad: "Good scholarship"

2. **Use Consistent Naming**
   - If one university uses "Type A, B, C", stick with that pattern
   - If another uses descriptive names, that's fine too

3. **Set Display Order**
   - Put most attractive scholarships first (usually highest coverage)
   - Example: Type A (100%) = 1, Type B (75%) = 2, etc.

4. **Include Duration**
   - Always specify if it's 1 year or 4 years
   - This is crucial information for students

5. **Service Fees**
   - Keep USD and CNY in sync (approximately)
   - Update regularly if exchange rates change significantly

6. **Test Before Activating**
   - Create scholarship as inactive
   - Check the preview
   - Then activate

## Troubleshooting

**Q: Scholarships not showing on university page?**
- Check if scholarships are marked as "Active"
- Verify university_id is correct
- Check browser console for errors

**Q: How to delete a scholarship?**
- Currently, set it to "Inactive" to hide it
- Or delete directly from database if needed

**Q: Can I copy scholarships from one university to another?**
- Not via UI currently
- Can duplicate in database and change university_id

**Q: What if a university has no scholarships?**
- That's fine! The section will show "No scholarships available"
- Or you can add a generic "Contact us" scholarship type

## Support

For additional features or customizations:
- Adding bulk import for scholarships
- Copying scholarships between universities
- Custom scholarship application forms
- Integration with payment systems

Contact your developer for database schema updates.
