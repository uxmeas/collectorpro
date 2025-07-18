#!/usr/bin/env node

/**
 * Quick Dashboard Testing Script
 * Automated checks for common CollectorPRO dashboard issues
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 COLLECTORPRO DASHBOARD QUICK TEST');
console.log('=====================================\n');

// Test 1: Check if development server is running
console.log('1. Checking development server...');
const { exec } = require('child_process');

exec('curl -s http://localhost:3000 > /dev/null', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Development server not running on port 3000');
    console.log('💡 Start server with: npm run dev');
  } else {
    console.log('✅ Development server is running on port 3000');
  }
});

// Test 2: Check critical files exist
console.log('\n2. Checking critical files...');
const criticalFiles = [
  'src/app/dashboard/page.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/globals.css',
  'next.config.ts',
  'package.json'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 3: Check for common build issues
console.log('\n3. Checking for build issues...');
const buildFiles = [
  '.next',
  'node_modules'
];

buildFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing - run: npm install`);
  }
});

// Test 4: Check for TypeScript errors
console.log('\n4. Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  console.log('✅ TypeScript config exists');
  
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (tsConfig.compilerOptions) {
    console.log('✅ TypeScript compiler options configured');
  } else {
    console.log('⚠️  TypeScript compiler options missing');
  }
} else {
  console.log('❌ TypeScript config missing');
}

// Test 5: Check for common UI component issues
console.log('\n5. Checking UI components...');
const uiComponents = [
  'src/components/ui/Button.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/Input.tsx'
];

uiComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component} exists`);
  } else {
    console.log(`❌ ${component} missing`);
  }
});

// Test 6: Check for API routes
console.log('\n6. Checking API routes...');
const apiRoutes = [
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/multi-platform/portfolio/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route} exists`);
  } else {
    console.log(`❌ ${route} missing`);
  }
});

// Test 7: Check for styling files
console.log('\n7. Checking styling files...');
const styleFiles = [
  'src/app/globals.css',
  'tailwind.config.js',
  'postcss.config.mjs'
];

styleFiles.forEach(style => {
  if (fs.existsSync(style)) {
    console.log(`✅ ${style} exists`);
  } else {
    console.log(`❌ ${style} missing`);
  }
});

console.log('\n=====================================');
console.log('🎯 MANUAL TESTING CHECKLIST:');
console.log('=====================================');
console.log('');
console.log('1. AUTHENTICATION TESTING:');
console.log('   - Navigate to http://localhost:3000/register');
console.log('   - Test registration form');
console.log('   - Navigate to http://localhost:3000/login');
console.log('   - Test login functionality');
console.log('   - Test protected routes');
console.log('');
console.log('2. DASHBOARD TESTING:');
console.log('   - Navigate to http://localhost:3000/dashboard');
console.log('   - Check portfolio metrics display');
console.log('   - Verify NBA player cards render');
console.log('   - Test charts and analytics');
console.log('   - Check navigation functionality');
console.log('');
console.log('3. VISUAL TESTING:');
console.log('   - Verify NBA glassmorphism theme');
console.log('   - Check color scheme (blues, reds, gold)');
console.log('   - Test basketball court background');
console.log('   - Verify animations and transitions');
console.log('   - Check typography and spacing');
console.log('');
console.log('4. RESPONSIVE TESTING:');
console.log('   - Test desktop layout (1920x1080)');
console.log('   - Test tablet view (768px width)');
console.log('   - Test mobile view (375px width)');
console.log('   - Test touch interactions');
console.log('');
console.log('5. BROWSER CONSOLE CHECKS:');
console.log('   - Open browser developer tools');
console.log('   - Check Console tab for errors');
console.log('   - Check Network tab for failed requests');
console.log('   - Check Performance tab for issues');
console.log('');
console.log('🚨 CRITICAL ISSUES TO WATCH FOR:');
console.log('   - Authentication not working');
console.log('   - Dashboard not loading');
console.log('   - Portfolio data not displaying');
console.log('   - NBA player cards broken');
console.log('   - Charts not rendering');
console.log('   - Navigation links broken');
console.log('   - Mobile layout broken');
console.log('   - Console errors');
console.log('');
console.log('✅ SUCCESS CRITERIA:');
console.log('   - All authentication flows work');
console.log('   - Dashboard loads and displays data');
console.log('   - NBA theme is visually appealing');
console.log('   - Responsive design works on all devices');
console.log('   - No console errors');
console.log('   - Performance is acceptable (< 3s load time)');
console.log('');
console.log('📝 DOCUMENTATION:');
console.log('   - Use testing/COLLECTORPRO_DASHBOARD_TESTING_CHECKLIST.md');
console.log('   - Fill out testing/DASHBOARD_TESTING_RESULTS_TEMPLATE.md');
console.log('   - Document any issues found');
console.log('');
console.log('🎯 NEXT STEPS:');
console.log('   1. Run manual tests using checklist above');
console.log('   2. Document results in template');
console.log('   3. Fix any critical issues found');
console.log('   4. Retest after fixes');
console.log('   5. Proceed with Bloomberg upgrades when ready');
console.log('');
console.log('🧪 Quick Dashboard Testing Complete!'); 