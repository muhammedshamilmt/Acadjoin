import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET - Retrieve all reviews with pagination and optimization
export async function GET(request: NextRequest) {
  try {
    console.log('Reviews API: GET request received');
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    let collection;
    try {
      collection = await getCollection('reviews');
      console.log('Reviews API: Database connection successful');
    } catch (dbError) {
      console.error('Reviews API: Database connection failed:', dbError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
    
    try {
      // Get total count for pagination
      const totalCount = await collection.countDocuments({});
      
      // Get reviews with pagination and optimized projection
      const reviews = await collection
        .find({})
        .project({
          _id: 1,
          userId: 1,
          userEmail: 1,
          userRole: 1,
          rating: 1,
          title: 1,
          content: 1,
          course: 1,
          year: 1,
          institute: 1,
          likes: 1,
          helpful: 1,
          verified: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .toArray();
      
      console.log('Reviews API: Database query successful');
      console.log('Reviews API: Found reviews:', reviews.length);
      
      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      const pagination = {
        page,
        limit,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage
      };
      
      const response = { 
        success: true,
        reviews,
        pagination
      };
      
      // Set cache headers for better performance
      const responseObj = NextResponse.json(response);
      responseObj.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      responseObj.headers.set('ETag', `"${Date.now()}-${totalCount}"`);
      
      return responseObj;
    } catch (queryError) {
      console.error('Reviews API: Database query failed:', queryError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to query reviews from database',
          details: queryError instanceof Error ? queryError.message : 'Unknown query error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Reviews API: Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
