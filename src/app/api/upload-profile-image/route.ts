import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('Profile image upload API called');
    
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const userId = formData.get('userId') as string;
    const userType = formData.get('userType') as string;

    // Validate required fields
    if (!image || !userId || !userType) {
      return NextResponse.json({ 
        error: 'Image, userId, and userType are required' 
      }, { status: 400 });
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: 'File must be an image' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Image size must be less than 5MB' 
      }, { status: 400 });
    }

    // For now, we'll store the image as base64 in the database
    // In production, you'd want to use a cloud storage service like AWS S3 or Firebase Storage
    const arrayBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${image.type};base64,${base64String}`;

    // Update the user's profile picture in the appropriate collection
    let collectionName: string;
    let updateField: string;

    switch (userType) {
      case 'people':
        collectionName = 'peopleRegistrations';
        updateField = 'profilePicture';
        break;
      case 'user':
        collectionName = 'users';
        updateField = 'profilePicture';
        break;
      case 'institute':
        collectionName = 'instituteRegistrations';
        updateField = 'profilePicture';
        break;
      default:
        return NextResponse.json({ 
          error: 'Invalid user type' 
        }, { status: 400 });
    }

    const collection = await getCollection(collectionName);
    
    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ 
        error: 'Invalid user ID format' 
      }, { status: 400 });
    }

    // Update the user's profile picture
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          [updateField]: dataUrl,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    console.log('Profile image updated successfully for user:', userId);

    return NextResponse.json({
      success: true,
      message: 'Profile image updated successfully',
      imageUrl: dataUrl
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Profile image upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload profile image',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    }, { status: 500 });
  }
}
