import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { validateEmailUniqueness } from '@/lib/email-validation';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName, photoURL, emailVerified, createdAt, isProfileComplete } = await request.json();

    // Validate required fields
    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: uid and email' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if user already exists by UID
    const existingUser = await db.collection('users').findOne({ uid });

    // If this is a new user (no existing UID), check email uniqueness across all collections
    if (!existingUser) {
      const emailValidation = await validateEmailUniqueness(email);
      if (!emailValidation.isUnique) {
        return NextResponse.json(
          { error: emailValidation.message },
          { status: 409 }
        );
      }
    }

    if (existingUser) {
      // Update existing user
      await db.collection('users').updateOne(
        { uid },
        {
          $set: {
            email,
            displayName,
            photoURL,
            emailVerified,
            updatedAt: new Date().toISOString(),
          }
        }
      );
    } else {
      // Create new user
      await db.collection('users').insertOne({
        uid,
        email,
        displayName,
        photoURL,
        emailVerified,
        createdAt,
        isProfileComplete,
        authProvider: 'google',
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { message: 'User data stored successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing Google user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
