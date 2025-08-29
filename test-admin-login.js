// Test script to verify admin login functionality
const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing Admin Login...');
    
    const adminCredentials = {
      email: 'admin@domain.com',
      password: 'admin@123'
    };

    console.log('📧 Testing with email:', adminCredentials.email);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminCredentials)
    });
    
    const data = await response.json();
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Admin login test successful!');
      console.log('👤 Admin user data:', data.user);
      
      if (data.user.role === 'admin' && data.user.isAdmin === true) {
        console.log('✅ Admin role and isAdmin flag are correctly set');
      } else {
        console.log('❌ Admin role or isAdmin flag not set correctly');
      }
    } else {
      console.log('❌ Admin login test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Admin login test error:', error);
  }
};

// Test regular user login (should fail for admin credentials)
const testRegularUserLogin = async () => {
  try {
    console.log('\n🧪 Testing Regular User Login (should fail)...');
    
    const regularCredentials = {
      email: 'admin@domain.com',
      password: 'wrongpassword'
    };

    console.log('📧 Testing with wrong password...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regularCredentials)
    });
    
    const data = await response.json();
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.log('✅ Regular user login correctly rejected with wrong password');
    } else {
      console.log('❌ Regular user login should have failed but succeeded');
    }
  } catch (error) {
    console.error('❌ Regular user login test error:', error);
  }
};

// Run the tests
const runTests = async () => {
  console.log('🚀 Starting Admin Login Tests...\n');
  
  await testAdminLogin();
  await testRegularUserLogin();
  
  console.log('\n🏁 Admin login tests completed!');
};

// Run the tests
runTests();
