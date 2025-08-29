import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Institute ID is required' }, { status: 400 });
    }

    const col = await getCollection('instituteRegistrations');
    
    let institute;
    
    // Try to find by ObjectId first
    if (ObjectId.isValid(id)) {
      institute = await col.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    }
    
    // If not found by ObjectId, try to find by registrationId
    if (!institute) {
      institute = await col.findOne({ registrationId: id }, { projection: { password: 0 } });
    }
    
    // If still not found, try to find by name (case-insensitive)
    if (!institute) {
      institute = await col.findOne(
        { name: { $regex: new RegExp(id, 'i') } }, 
        { projection: { password: 0 } }
      );
    }

    if (!institute) {
      return NextResponse.json({ error: 'Institute not found' }, { status: 404 });
    }

    return NextResponse.json(institute, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching institute:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institute', details: process.env.NODE_ENV === 'development' ? message : undefined },
      { status: 500 }
    );
  }
}
