# Admin Password Reset Guide

## 🔐 How to Reset Admin Password

There are **4 methods** to reset the admin password. Choose the one that works best for you:

---

## Method 1: Using Supabase Dashboard (Easiest) ⭐

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Find the admin user (usually `admin@studyatchina.com`)
5. Click the **three dots (...)** menu next to the user
6. Select **"Send password reset email"**
7. Check the admin email inbox
8. Click the reset link and set a new password

**Pros:** Simple, secure, no coding required
**Cons:** Requires email access

---

## Method 2: Using Node.js Script (Recommended) ⭐

I've created a script for you at `/scripts/reset-admin-password.js`

### Steps:

1. **Ensure you have the Service Role Key:**
   ```bash
   # Add to .env.local
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   Get this from: Supabase Dashboard → Settings → API → service_role key

2. **Install dependencies (if not already installed):**
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

3. **Run the script:**
   ```bash
   node scripts/reset-admin-password.js
   ```

4. **Follow the prompts:**
   - Enter admin email (or press Enter for default)
   - Enter new password (min 6 characters)
   - Confirm password

5. **Save the credentials shown!**

**Pros:** Quick, automated, can create new admin if needed
**Cons:** Requires Service Role Key

---

## Method 3: Using Supabase SQL Editor

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query to find the admin user:
   ```sql
   SELECT id, email, raw_user_meta_data 
   FROM auth.users 
   WHERE email = 'admin@studyatchina.com';
   ```

3. Copy the user ID

4. Use Supabase Auth API to reset password:
   - You cannot directly update passwords via SQL for security
   - Use Method 1 or Method 2 instead

**Note:** SQL method is limited due to security restrictions

---

## Method 4: Create New Admin User

If you can't access the existing admin account, create a new one:

### Via Supabase Dashboard:

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter email: `newadmin@studyatchina.com`
4. Enter password
5. Check **"Auto Confirm User"**
6. Click **"Create user"**

7. Then update user metadata via SQL Editor:
   ```sql
   UPDATE auth.users
   SET 
       raw_user_meta_data = jsonb_set(
           COALESCE(raw_user_meta_data, '{}'::jsonb),
           '{role}',
           '"admin"'
       )
   WHERE email = 'newadmin@studyatchina.com';
   ```

### Via Node.js Script:

Run the script and choose to create a new admin when prompted:
```bash
node scripts/reset-admin-password.js
```

---

## 🔍 Verify Admin Access

After resetting the password, verify it works:

1. Go to: `http://localhost:3000/admin/login`
2. Enter admin email and new password
3. You should be redirected to admin dashboard

---

## 🚨 Troubleshooting

### "User not found"
- Check the email is correct
- Verify user exists in Supabase Dashboard → Authentication → Users
- Create a new admin user using Method 4

### "Invalid credentials"
- Password was not updated correctly
- Try Method 1 (password reset email)
- Ensure email is confirmed (check `email_confirmed_at` in database)

### "Missing Service Role Key"
- Get it from Supabase Dashboard → Settings → API
- Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
- **Important:** This is different from the `anon` key!

### "Password too weak"
- Supabase requires minimum 6 characters
- Use a strong password with letters, numbers, and symbols

---

## 📋 Default Admin Credentials

If you just set up the project, the default admin might be:

**Email:** `admin@studyatchina.com`
**Password:** (whatever you set during initial setup)

If you don't remember, use one of the reset methods above.

---

## 🔐 Security Best Practices

1. **Use a strong password:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

2. **Keep Service Role Key secure:**
   - Never commit to Git
   - Only in `.env.local` (which is gitignored)
   - Has full database access!

3. **Enable 2FA (if available):**
   - Check Supabase settings for 2FA options

4. **Regular password rotation:**
   - Change admin password every 90 days
   - Use a password manager

---

## 🎯 Quick Reset (TL;DR)

**Fastest method:**
```bash
# 1. Add Service Role Key to .env.local
# 2. Run script
node scripts/reset-admin-password.js

# 3. Follow prompts
# 4. Done! ✅
```

**Alternative (no coding):**
1. Supabase Dashboard → Authentication → Users
2. Find admin → Send password reset email
3. Check email → Reset password
4. Done! ✅

---

## 📞 Need Help?

If you're still having issues:
1. Check Supabase logs for errors
2. Verify environment variables are set
3. Ensure Supabase project is active
4. Check email spam folder for reset emails

---

**Last Updated:** November 29, 2025
