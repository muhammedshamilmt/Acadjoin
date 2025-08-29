import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';
import { validateEmail } from '@/lib/email-validation';

export async function POST(request: NextRequest) {
  try {
    console.log('Signup request received');
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword, agreeToTerms } = body;
    console.log('Signup data:', { firstName, lastName, email, agreeToTerms, password: password ? '[HIDDEN]' : 'undefined' });

    // Validate required fields
    const required = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      return NextResponse.json({ error: 'You must agree to the terms of service' }, { status: 400 });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Validate email format and uniqueness across all collections
    console.log('Starting email validation...');
    const emailValidation = await validateEmail(email);
    console.log('Email validation result:', emailValidation);
    if (!emailValidation.isUnique) {
      return NextResponse.json({ error: emailValidation.message }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const userDoc = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      agreeToTerms,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      lastLogin: null
    };

    // Insert user into database
    console.log('Inserting user into database...');
    const col = await getCollection('users');
    const result = await col.insertOne(userDoc);
    console.log('User inserted successfully:', String(result.insertedId));

    // Return user data for automatic login
    const userData = {
      id: String(result.insertedId),
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: 'user' as const,
      type: 'regular' as const,
      isActive: true
    };

    return NextResponse.json({ 
      success: true, 
      userId: String(result.insertedId),
      user: userData,
      message: 'Account created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Signup error:', message);
    console.error('Full error object:', error);
    
    // Check if it's a MongoDB duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ 
        error: 'User with this email already exists',
        details: process.env.NODE_ENV === 'development' ? message : undefined 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create account', 
      details: process.env.NODE_ENV === 'development' ? message : undefined 
    }, { status: 500 });
  }
}
