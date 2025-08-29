import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/auth/get-user called');
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    console.log('Email parameter:', email);
    
    if (!email) {
      console.log('No email parameter provided');
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    console.log('Connecting to database...');
    const db = await getDb();
    console.log('Database connected, searching for user...');
    const user = await db.collection('users').findOne({ email: email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found in database, creating new user...');
      
      // Create a new user record
      const newUser = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: email.split('@')[0], // Use email prefix as display name
        phone: '',
        dateOfBirth: '',
        gender: '',
        location: '',
        bio: '',
        isProfileComplete: false,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(newUser);
      console.log('New user created with ID:', result.insertedId);
      
      // Return the newly created user
      return NextResponse.json({ user: newUser }, { status: 200 });
    }

    // Remove sensitive data before sending
    const { password, ...safeUser } = user;
    console.log('Returning safe user data');
    
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch user', details: process.env.NODE_ENV === 'development' ? message : undefined }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      location,
      bio
    } = body;

    const db = await getDb();
    
    // Update user profile data
    const result = await db.collection('users').updateOne(
      { email: email },
      {
        $set: {
          displayName: name,
          phone: phone || '',
          dateOfBirth: dateOfBirth || '',
          gender: gender || '',
          location: location || '',
          bio: bio || '',
          isProfileComplete: true,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update user', details: process.env.NODE_ENV === 'development' ? message : undefined }, { status: 500 });
  }
}
