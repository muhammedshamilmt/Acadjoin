import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Like a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userId, userEmail } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'User authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const reviewsCollection = await getCollection('reviews');
    const reviewId = new ObjectId(id);

    // Check if review exists
    const review = await reviewsCollection.findOne({ _id: reviewId });
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user has already liked this review
    const existingLike = await reviewsCollection.findOne({
      _id: reviewId,
      'likedBy': { $elemMatch: { userId: userId } }
    });

    if (existingLike) {
      // Unlike the review
      const result = await reviewsCollection.updateOne(
        { _id: reviewId },
        { 
          $inc: { likes: -1 },
          $pull: { likedBy: { userId: userId } }
        } as any
      );

      if (result.modifiedCount > 0) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Review unliked successfully',
            liked: false
          },
          { status: 200 }
        );
      }
    } else {
      // Like the review
      const result = await reviewsCollection.updateOne(
        { _id: reviewId },
        { 
          $inc: { likes: 1 },
          $push: { 
            likedBy: { 
              userId: userId, 
              userEmail: userEmail,
              likedAt: new Date()
            } 
          }
        } as any
      );

      if (result.modifiedCount > 0) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Review liked successfully',
            liked: true
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update like status' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error handling review like:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process like' },
      { status: 500 }
    );
  }
}

// GET - Check if user has liked a review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const reviewsCollection = await getCollection('reviews');
    const reviewId = new ObjectId(id);

    const review = await reviewsCollection.findOne({
      _id: reviewId,
      'likedBy': { $elemMatch: { userId: userId } }
    });

    return NextResponse.json(
      { 
        success: true, 
        liked: !!review 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking review like status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}
