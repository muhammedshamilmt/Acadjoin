import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 500 });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing verification fields' }, { status: 400 });
    }

    const hmacBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(hmacBody)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return NextResponse.json({ success: isValid });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Verification failed' }, { status: 500 });
  }
}


