import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, notes } = await request.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount, // amount in paise
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 });
  }
}


