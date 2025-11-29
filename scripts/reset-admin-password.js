#!/usr/bin/env node

/**
 * Reset Admin Password Script
 * 
 * This script resets the admin user password using Supabase Admin API
 * 
 * Usage:
 *   node scripts/reset-admin-password.js
 * 
 * Or make it executable:
 *   chmod +x scripts/reset-admin-password.js
 *   ./scripts/reset-admin-password.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetAdminPassword() {
  console.log('\n🔐 Admin Password Reset Tool\n');

  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing environment variables');
    console.error('Please ensure you have:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY (Service Role Key, not anon key!)');
    console.error('\nAdd these to your .env.local file');
    process.exit(1);
  }

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Get admin email
    const adminEmail = await question('Enter admin email (default: admin@studyatchina.com): ') || 'admin@studyatchina.com';

    // Check if user exists
    console.log(`\n🔍 Checking if user ${adminEmail} exists...`);
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const adminUser = users.users.find(u => u.email === adminEmail);

    if (!adminUser) {
      console.error(`❌ User ${adminEmail} not found!`);
      console.log('\n📝 Would you like to create a new admin user? (y/n)');
      const createNew = await question('> ');
      
      if (createNew.toLowerCase() === 'y') {
        await createAdminUser(supabase, adminEmail);
      }
      rl.close();
      return;
    }

    console.log(`✅ User found: ${adminUser.email}`);
    console.log(`   User ID: ${adminUser.id}`);
    console.log(`   Created: ${new Date(adminUser.created_at).toLocaleString()}`);
    console.log(`   Role: ${adminUser.user_metadata?.role || 'Not set'}`);

    // Get new password
    console.log('\n🔑 Enter new password (min 6 characters):');
    const newPassword = await question('> ');

    if (newPassword.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }

    // Confirm password
    console.log('🔑 Confirm new password:');
    const confirmPassword = await question('> ');

    if (newPassword !== confirmPassword) {
      console.error('❌ Passwords do not match!');
      rl.close();
      return;
    }

    // Update password
    console.log('\n🔄 Updating password...');
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { 
        password: newPassword,
        email_confirm: true // Ensure email is confirmed
      }
    );

    if (error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }

    console.log('✅ Password updated successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${newPassword}`);
    console.log('\n⚠️  Please save these credentials securely and delete this output!');
    console.log('\n🔗 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

async function createAdminUser(supabase, email) {
  console.log('\n👤 Creating new admin user...');
  
  const password = await question('Enter password for new admin (min 6 characters): ');
  
  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    return;
  }

  const fullName = await question('Enter full name (default: Admin User): ') || 'Admin User';

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: fullName
      }
    });

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${fullName}`);
    console.log('\n⚠️  Please save these credentials securely!');
    console.log('\n🔗 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
  }
}

// Run the script
resetAdminPassword();
