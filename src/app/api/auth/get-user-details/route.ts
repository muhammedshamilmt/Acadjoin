import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({ error: 'UID parameter is required' }, { status: 400 });
    }

    const db = await getDb();
    
    // First try to find user in users collection
    let user = await db.collection('users').findOne({ uid });
    
    if (!user) {
      // If not found in users, try peopleRegistrations collection
      user = await db.collection('peopleRegistrations').findOne({ uid });
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return safe user data
    const safeUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.firstName || user.name,
      phone: user.phone || '',
      mobile: user.mobile || user.phone || '',
      location: user.location || '',
    };

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
