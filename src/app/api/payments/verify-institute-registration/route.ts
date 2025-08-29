import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      instituteData,
      amount
    } = body;

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDb();

    // Store payment details
    const paymentData = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amount / 100, // Convert from paise to rupees
      currency: 'INR',
      status: 'success',
      paymentType: 'institute_registration',
      instituteName: instituteData?.name || '',
      instituteEmail: instituteData?.email || '',
      paymentMethod: 'razorpay',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into payments collection
    const paymentResult = await db.collection('payments').insertOne(paymentData);

    // Store institute registration with payment reference
    const registrationData = {
      ...instituteData,
      paymentId: razorpay_payment_id,
      paymentStatus: 'completed',
      registrationId: "REG-INST-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      registrationDate: new Date().toLocaleDateString(),
      submittedAt: new Date().toISOString(),
      status: 'submitted', // Set status to submitted for successful payment
      paymentVerified: true,
      paymentVerifiedAt: new Date()
    };

    // Insert into instituteRegistrations collection
    const registrationResult = await db.collection('instituteRegistrations').insertOne(registrationData);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and institute registration completed',
      paymentId: razorpay_payment_id,
      registrationId: registrationResult.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
