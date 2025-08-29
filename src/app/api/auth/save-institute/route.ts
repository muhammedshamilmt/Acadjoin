import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, instituteData } = body;

    if (!userId || !instituteData) {
      return NextResponse.json(
        { error: 'User ID and institute data are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    
    // Check if institute is already saved
    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
      'savedInstitutes.instituteId': instituteData.instituteId
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Institute is already saved' },
        { status: 409 }
      );
    }

    // Add institute to user's savedInstitutes array
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: { 
          savedInstitutes: {
            ...instituteData,
            savedAt: new Date().toISOString()
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Institute saved successfully'
    });

  } catch (error) {
    console.error('Error saving institute:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, instituteId } = body;

    if (!userId || !instituteId) {
      return NextResponse.json(
        { error: 'User ID and institute ID are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    
    // Remove institute from user's savedInstitutes array
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $pull: { 
          savedInstitutes: { instituteId: instituteId }
        } as any
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Institute removed successfully'
    });

  } catch (error) {
    console.error('Error removing institute:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
