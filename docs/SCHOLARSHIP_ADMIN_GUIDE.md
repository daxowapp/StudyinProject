# Scholarship Types Admin Guide

## Overview
You can now manage scholarship types from the admin panel. These scholarship types will automatically appear on all university and program pages.

## Admin Pages Created

### 1. Scholarship Types List
**URL:** `/admin/scholarship-types`

**Features:**
- View all scholarship types in a table
- See coverage percentage, service fees (USD & CNY)
- Check active/inactive status
- Quick stats dashboard showing:
  - Total types
  - Active types
  - Average service fee
- Click "Edit" button to modify any type
- Click "Add Scholarship Type" to create new

### 2. Edit/Create Scholarship Type
**URL:** `/admin/scholarship-types/[id]` or `/admin/scholarship-types/new`

**Features:**
- **Basic Information:**
  - Name (e.g., "Type A")
  - Display Name (e.g., "Full Scholarship (Type A)")
  - Description
  - Display Order (controls which appears first)

- **Financial Details:**
  - Tuition Coverage Percentage (0-100%)
  - Service Fee in USD
  - Service Fee in CNY
  - Includes Accommodation (toggle)
  - Includes Stipend (toggle)
  - Monthly Stipend Amount (if applicable)

- **Benefits:**
  - Add/remove benefits (e.g., "100% tuition coverage", "Visa assistance")
  - Each benefit appears as a bullet point on the frontend

- **Requirements:**
  - Add/remove requirements
  - Define eligibility criteria

- **Status:**
  - Active/Inactive toggle
  - Only active types show on frontend

- **Live Preview:**
  - See how the scholarship type will look to students

## How to Use

### Creating a New Scholarship Type

1. Go to `/admin/scholarship-types`
2. Click "Add Scholarship Type"
3. Fill in the form:
   ```
   Name: Type A
   Display Name: Full Scholarship (Type A)
   Description: Best option for complete tuition coverage
   Coverage: 100%
   Service Fee USD: 3500
   Service Fee CNY: 25000
   ```
4. Add benefits:
   - "100% tuition fee coverage"
   - "Application support & guidance"
   - "Visa assistance"
   - "Pre-departure orientation"
5. Set as Active
6. Click "Save Changes"

### Editing an Existing Type

1. Go to `/admin/scholarship-types`
2. Click "Edit" on any scholarship type
3. Modify the fields you want to change
4. Click "Save Changes"

### Managing Display Order

- Lower numbers appear first
- Example:
  - Type A: Display Order = 1 (appears first)
  - Type B: Display Order = 2
  - Type C: Display Order = 3
  - Self-Funded: Display Order = 4 (appears last)

## Where Scholarship Types Appear

Once you create or edit scholarship types in the admin, they automatically appear on:

1. **University Detail Pages** (`/universities/[slug]`)
   - Shows after the programs list
   - Section title: "Available Scholarship Options"

2. **Program Detail Pages** (`/programs/[slug]`)
   - Shows after admission requirements
   - Section title: "Scholarship Options for This Program"

3. **Scholarships Page** (`/scholarships`)
   - Full page dedicated to explaining all types
   - Includes FAQs and required documents

## Database Structure

The scholarship types are stored in the `scholarship_types` table with these fields:

- `id` - Unique identifier
- `name` - Short name (e.g., "Type A")
- `display_name` - Full name shown to users
- `description` - Brief description
- `tuition_coverage_percentage` - 0-100%
- `service_fee_usd` - Fee in USD
- `service_fee_cny` - Fee in CNY
- `includes_accommodation` - Boolean
- `includes_stipend` - Boolean
- `stipend_amount_monthly` - Decimal
- `benefits` - JSONB array of strings
- `requirements` - JSONB array of strings
- `is_active` - Boolean (show/hide)
- `display_order` - Integer (sort order)

## Pre-populated Types

The database migration includes 4 default scholarship types:

1. **Type A (100%)** - $3,500 / ¥25,000
2. **Type B (75%)** - $2,800 / ¥20,000
3. **Type C (50%)** - $2,200 / ¥16,000
4. **Self-Funded (0%)** - $1,500 / ¥11,000

You can edit these or create new ones as needed.

## Tips

1. **Keep names short** - "Type A" is better than "Type A Full Scholarship"
2. **Use display names for clarity** - "Full Scholarship (Type A)" tells students exactly what it is
3. **Be specific in benefits** - List exactly what's included
4. **Update service fees regularly** - Keep pricing current
5. **Use display order** - Put most popular options first
6. **Test before activating** - Create as inactive, preview, then activate

## Support

If you need to:
- Add new fields to scholarship types
- Create custom scholarship applications
- Generate reports on scholarship usage

Contact your developer for database schema updates.
