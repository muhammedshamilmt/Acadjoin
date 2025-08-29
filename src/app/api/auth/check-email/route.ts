import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/email-validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Validate email format and uniqueness
    const emailValidation = await validateEmail(email);

    if (!emailValidation.isUnique) {
      return NextResponse.json({ 
        error: emailValidation.message,
        isAvailable: false,
        existingIn: emailValidation.existingIn
      }, { status: 409 });
    }

    return NextResponse.json({ 
      isAvailable: true,
      message: 'Email is available'
    }, { status: 200 });

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check email availability',
      isAvailable: false
    }, { status: 500 });
  }
}
