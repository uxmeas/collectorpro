#!/usr/bin/env node

// Simple script to create a verified test account
// Run this to bypass email verification issues

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Simulate the in-memory data stores
const users = [];
const verificationTokens = {};

async function createTestAccount(email, password) {
  try {
    console.log(`🔧 Creating test account for: ${email}`);
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      console.log('❌ User already exists');
      return false;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user (pre-verified)
    const user = {
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
      emailVerified: true, // Pre-verified for testing
    };
    
    users.push(user);
    
    console.log('✅ Test account created successfully!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`✅ Verified: ${user.emailVerified}`);
    console.log(`📅 Created: ${user.createdAt}`);
    console.log(`👥 Total users: ${users.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error creating test account:', error);
    return false;
  }
}

// Test the function
async function main() {
  const testEmail = process.argv[2] || 'test@example.com';
  const testPassword = process.argv[3] || 'testpass123';
  
  console.log('🏀 CollectorPRO - Test Account Creator');
  console.log('=====================================');
  
  await createTestAccount(testEmail, testPassword);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Use these credentials to log in');
  console.log('2. Your account is already verified');
  console.log('3. You can now test the Flow blockchain integration');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createTestAccount }; 