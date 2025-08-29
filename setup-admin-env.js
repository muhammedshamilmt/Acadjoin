const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

console.log('🔧 Admin Environment Setup');
console.log('==========================\n');

if (envExists) {
  console.log('✅ .env.local file exists');
  
  // Read current content
  const currentContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 Current .env.local content:');
  console.log('----------------------------');
  console.log(currentContent);
  
  // Check for admin variables
  const hasAdminEmails = currentContent.includes('NEXT_PUBLIC_ADMIN_EMAILS');
  const hasAdminPassword = currentContent.includes('NEXT_PUBLIC_ADMIN_PASSWORD');
  
  console.log('\n🔍 Admin Variables Check:');
  console.log(`- NEXT_PUBLIC_ADMIN_EMAILS: ${hasAdminEmails ? '✅ Found' : '❌ Missing'}`);
  console.log(`- NEXT_PUBLIC_ADMIN_PASSWORD: ${hasAdminPassword ? '✅ Found' : '❌ Missing'}`);
  
  if (!hasAdminEmails) {
    console.log('\n⚠️  NEXT_PUBLIC_ADMIN_EMAILS is missing!');
    console.log('Add this line to your .env.local file:');
    console.log('NEXT_PUBLIC_ADMIN_EMAILS=your_email@domain.com');
  }
  
} else {
  console.log('❌ .env.local file does not exist');
  console.log('\n📝 Creating .env.local file...');
  
  const envContent = `# Admin Configuration
# Add your admin email addresses (comma-separated for multiple admins)
NEXT_PUBLIC_ADMIN_EMAILS=your_email@domain.com

# Admin password for additional verification (optional)
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_here

# Example:
# NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,superadmin@yourdomain.com
# NEXT_PUBLIC_ADMIN_PASSWORD=secure_password_123
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created!');
  console.log('\n📝 Please edit .env.local and replace:');
  console.log('- your_email@domain.com with your actual email');
  console.log('- your_admin_password_here with your desired password (optional)');
}

console.log('\n🚀 Next Steps:');
console.log('1. Edit .env.local with your admin email(s)');
console.log('2. Restart your development server');
console.log('3. Visit http://localhost:3002/admin-test to test admin login');
console.log('4. Visit http://localhost:3002/admin to access admin panel');
