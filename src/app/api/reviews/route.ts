import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch reviews (optionally filtered by institute)
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching reviews from database...');
    const { searchParams } = new URL(request.url);
    const institute = searchParams.get('institute');
    const userEmail = searchParams.get('userEmail');
    
    const reviewsCollection = await getCollection('reviews');
    console.log('Collection obtained, finding documents...');

    let query: any = {};
    if (institute) query.institute = institute;
    if (userEmail) query.userEmail = userEmail;
    
    const reviews = await reviewsCollection.find(query).sort({ createdAt: -1 }).toArray();
    console.log(`Found ${reviews.length} reviews${institute ? ` for institute ${institute}` : ''}${userEmail ? ` for user ${userEmail}` : ''}`);

    // Return empty array if no reviews found (no sample data creation)
    if (reviews.length === 0) {
      console.log('No reviews found');
      return NextResponse.json({ success: true, reviews: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, title, content, course, year, institute, userEmail, userId, userRole } = body;

    // Validate required fields
    if (!rating || !title || !content || !institute || !userEmail || !userId || !userRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is allowed to write reviews (only users and people can write reviews)
    if (userRole === 'institute') {
      return NextResponse.json(
        { success: false, error: 'Institutes cannot write reviews' },
        { status: 403 }
      );
    }

    // Check if user has already written a review for this institute
    const reviewsCollection = await getCollection('reviews');
    const existingReview = await reviewsCollection.findOne({
      userId: userId,
      institute: institute
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already written a review for this institute' },
        { status: 400 }
      );
    }

    // Create the review document
    const reviewData = {
      userId,
      userEmail,
      userRole,
      rating: parseInt(rating),
      title,
      content,
      course: course || '',
      year: year || '',
      institute,
      likes: 0,
      helpful: 0,
      verified: true,
      tags: [],
      likedBy: [], // Array to track who liked the review
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await reviewsCollection.insertOne(reviewData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Review submitted successfully',
        reviewId: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing review
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, rating, title, content, course, year, institute, userEmail } = body;

    // Validate required fields
    if (!reviewId || !rating || !title || !content || !institute || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reviewsCollection = await getCollection('reviews');
    
    // Check if review exists and belongs to the user
    const existingReview = await reviewsCollection.findOne({
      _id: new ObjectId(reviewId),
      userEmail: userEmail
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found or you are not authorized to edit it' },
        { status: 404 }
      );
    }

    // Update the review
    const updateData = {
      rating: parseInt(rating),
      title,
      content,
      course: course || '',
      year: year || '',
      institute,
      updatedAt: new Date()
    };

    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(reviewId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Review updated successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
