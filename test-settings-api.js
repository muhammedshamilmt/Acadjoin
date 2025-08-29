// Test script for Settings API
// Run with: node test-settings-api.js

const BASE_URL = 'http://localhost:3000';

async function testSettingsAPI() {
  console.log('🧪 Testing Settings API...\n');

  try {
    // Test 1: GET settings (should return default settings)
    console.log('1️⃣ Testing GET /api/settings...');
    const getResponse = await fetch(`${BASE_URL}/api/settings`);
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
    console.log('');

    // Test 2: POST settings (save new settings)
    console.log('2️⃣ Testing POST /api/settings...');
    const testSettings = {
      paidRegistration: true,
      registrationFee: "75",
      siteName: "AL-HYABA TEST",
      emailNotifications: false,
      institutionTypes: ["University", "College", "School", "Test Institute"]
    };

    const postResponse = await fetch(`${BASE_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: testSettings })
    });
    const postData = await postResponse.json();
    console.log('✅ POST Response:', postData);
    console.log('');

    // Test 3: GET settings again (should return updated settings)
    console.log('3️⃣ Testing GET /api/settings again...');
    const getResponse2 = await fetch(`${BASE_URL}/api/settings`);
    const getData2 = await getResponse2.json();
    console.log('✅ GET Response (after update):', getData2);
    console.log('');

    // Test 4: Add institution type
    console.log('4️⃣ Testing POST /api/settings/institution-types...');
    const addTypeResponse = await fetch(`${BASE_URL}/api/settings/institution-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: "New Test Institute" })
    });
    const addTypeData = await addTypeResponse.json();
    console.log('✅ Add Type Response:', addTypeData);
    console.log('');

    // Test 5: Get institution types
    console.log('5️⃣ Testing GET /api/settings/institution-types...');
    const getTypesResponse = await fetch(`${BASE_URL}/api/settings/institution-types`);
    const getTypesData = await getTypesResponse.json();
    console.log('✅ Get Types Response:', getTypesData);
    console.log('');

    // Test 6: Remove institution type
    console.log('6️⃣ Testing DELETE /api/settings/institution-types...');
    const deleteTypeResponse = await fetch(`${BASE_URL}/api/settings/institution-types?type=New%20Test%20Institute`, {
      method: 'DELETE'
    });
    const deleteTypeData = await deleteTypeResponse.json();
    console.log('✅ Delete Type Response:', deleteTypeData);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testSettingsAPI();
