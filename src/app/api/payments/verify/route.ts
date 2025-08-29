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
      userId,
      connectedPersonId,
      amount,
      connectionType = 'quick_connect'
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

    // Store payment and connection details
    const connectionData = {
      userId,
      userUid: userId, // Store both for compatibility
      connectedPersonId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amount / 100, // Convert from paise to rupees
      currency: 'INR',
      status: 'success',
      connectionType,
      paymentMethod: 'razorpay',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into connections collection
    const result = await db.collection('connections').insertOne(connectionData);

    // Update user's connections count (optional)
    // Try to find user by uid first, then by _id
    const userUpdateResult = await db.collection('users').updateOne(
      { uid: userId },
      { 
        $inc: { connectionsCount: 1 },
        $push: { 
          connections: {
            connectionId: result.insertedId,
            connectedPersonId,
            connectionType,
            createdAt: new Date()
          }
        } as any
      }
    );

    // If user not found by uid, try peopleRegistrations collection
    if (userUpdateResult.matchedCount === 0) {
      await db.collection('peopleRegistrations').updateOne(
        { uid: userId },
        { 
          $inc: { connectionsCount: 1 },
          $push: { 
            connections: {
              connectionId: result.insertedId,
              connectedPersonId,
              connectionType,
              createdAt: new Date()
            }
          } as any
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and connection established',
      connectionId: result.insertedId,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
