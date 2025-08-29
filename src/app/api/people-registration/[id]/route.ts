import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('People registration API called');
    const { id } = await params;
    console.log('Requested ID:', id);
    
    if (!id) {
      console.log('No ID provided');
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.log('Getting collection...');
    const col = await getCollection('peopleRegistrations');
    console.log('Collection obtained, searching for ID:', id);
    
    const registration = await col.findOne({ _id: new ObjectId(id) });
    console.log('Search result:', registration ? 'Found' : 'Not found');

    if (!registration) {
      console.log('Registration not found for ID:', id);
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    console.log('Returning registration data');
    return NextResponse.json(registration);
  } catch (error: unknown) {
    console.error('Error fetching registration:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: 'Failed to fetch registration',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    }, { status: 500 });
  }
}

// Update a single people registration document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const updates = await request.json();

    // Whitelist fields that can be updated from the UI
    const allowedFields = [
      // Personal
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'location', 'bio', 'profilePicture',
      // Academic
      'studiedInstitution', 'currentInstitute', 'course', 'year', 'cgpa', 'board10th', 'percentage10th', 'board12th', 'percentage12th',
      // Preferences
      'careerGoals', 'interestedFields', 'preferredLocations', 'skills', 'achievements', 'specializations',
      // Other
      'expectedSalary', 'averageResponseTime'
    ];

    const $set: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        $set[key] = updates[key];
      }
    }
    $set.updatedAt = new Date();

    const col = await getCollection('peopleRegistrations');
    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, registration: updated });
  } catch (error: unknown) {
    console.error('Error updating registration:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: 'Failed to update registration',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    }, { status: 500 });
  }
}
