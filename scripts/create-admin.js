#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * Creates admin@studyatchina.com with password 123456
 * 
 * Usage:
 *   node scripts/create-admin.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function createAdmin() {
  console.log('\n👤 Creating Admin User...\n');

  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing environment variables');
    console.error('Please ensure you have in .env.local:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const adminEmail = 'admin@studyatchina.com';
  const adminPassword = '123456';
  const adminName = 'Admin User';

  try {
    // Check if user already exists
    console.log('🔍 Checking if admin user already exists...');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const existingUser = users.users.find(u => u.email === adminEmail);

    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log(`   User ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Created: ${new Date(existingUser.created_at).toLocaleString()}`);
      
      // Update password and ensure admin role
      console.log('\n🔄 Updating password and admin role...');
      const { data, error } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            role: 'admin',
            full_name: adminName
          }
        }
      );

      if (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }

      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      console.log('📝 Creating new admin user...');
      const { data, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          full_name: adminName
        }
      });

      if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }

      console.log('✅ Admin user created successfully!');
      console.log(`   User ID: ${data.user.id}`);
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Name:     ${adminName}`);
    console.log(`   Role:     admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Login URLs:');
    console.log(`   Local:      http://localhost:3000/admin/login`);
    console.log(`   Production: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/admin/login`);
    console.log('\n⚠️  SECURITY WARNING:');
    console.log('   This is a weak password (123456)!');
    console.log('   Please change it after first login.');
    console.log('   Use: Settings > Change Password\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdmin();
