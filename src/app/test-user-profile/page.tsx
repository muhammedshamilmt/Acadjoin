'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TestUserProfile = () => {
  const [email, setEmail] = useState('test@example.com');
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testUserProfile = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test GET user
      console.log('Testing GET user with email:', email);
      const getResponse = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`);
      const getData = await getResponse.json();
      results.getUser = {
        status: getResponse.status,
        data: getData
      };
      console.log('GET user result:', getData);

      // Test PUT user (update profile)
      if (getData.user) {
        console.log('Testing PUT user (update profile)...');
        const updateData = {
          name: 'Test User Updated',
          phone: '+91 9876543210',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          location: 'Test City, India',
          bio: 'This is a test bio for the user profile.'
        };

        const putResponse = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        const putData = await putResponse.json();
        results.putUser = {
          status: putResponse.status,
          data: putData
        };
        console.log('PUT user result:', putData);

        // Test GET user again to see updated data
        console.log('Testing GET user again to see updated data...');
        const getResponse2 = await fetch(`/api/auth/get-user?email=${encodeURIComponent(email)}`);
        const getData2 = await getResponse2.json();
        results.getUserAfterUpdate = {
          status: getResponse2.status,
          data: getData2
        };
        console.log('GET user after update result:', getData2);
      }

    } catch (error) {
      console.error('Test error:', error);
      results.error = error;
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Profile API Test</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email to test:</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to test"
                className="mt-2"
              />
            </div>
            <Button onClick={testUserProfile} disabled={loading}>
              {loading ? 'Testing...' : 'Test User Profile API'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {/* GET User Test */}
          <Card>
            <CardHeader>
              <CardTitle>GET User Test</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(testResults.getUser, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* PUT User Test */}
          {testResults.putUser && (
            <Card>
              <CardHeader>
                <CardTitle>PUT User Test (Update Profile)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(testResults.putUser, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* GET User After Update Test */}
          {testResults.getUserAfterUpdate && (
            <Card>
              <CardHeader>
                <CardTitle>GET User After Update Test</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(testResults.getUserAfterUpdate, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Error Test */}
          {testResults.error && (
            <Card>
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-destructive/10 p-4 rounded-lg overflow-auto text-destructive">
                  {JSON.stringify(testResults.error, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestUserProfile;
