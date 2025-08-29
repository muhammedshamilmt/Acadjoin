// Simple test script to verify the API endpoint
const testData = {
  type: 'individual',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+91-1234567890',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  location: 'Test City',
  bio: 'Test bio',
  studiedInstitution: 'Test University',
  profilePicture: '',
  careerGoals: 'Test goals',
  expectedSalary: '₹5-8 LPA',
  averageResponseTime: 'Within 24 hours',
  interestedFields: ['Software Development'],
  preferredLocations: ['Bangalore'],
  skills: ['JavaScript', 'React'],
  specializations: ['Frontend Development'],
  achievements: ['Test Achievement'],
  password: 'testpassword123',
  confirmPassword: 'testpassword123'
};

async function testAPI() {
  try {
    console.log('Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/people-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ API test error:', error);
  }
}

// Run the test
testAPI();
