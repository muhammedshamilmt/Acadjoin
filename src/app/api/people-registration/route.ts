import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';
import { validateEmail } from '@/lib/email-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET - Retrieve all people registrations with pagination and optimization
export async function GET(request: NextRequest) {
  try {
    console.log('People Registration API: GET request received');
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    let collection;
    try {
      collection = await getCollection('peopleRegistrations');
      console.log('People Registration API: Database connection successful');
    } catch (dbError) {
      console.error('People Registration API: Database connection failed:', dbError);
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
      
      // Get registrations with pagination and optimized projection
      const registrations = await collection
        .find({})
        .project({
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          dateOfBirth: 1,
          gender: 1,
          location: 1,
          bio: 1,
          studiedInstitution: 1,
          profilePicture: 1,
          careerGoals: 1,
          expectedSalary: 1,
          averageResponseTime: 1,
          interestedFields: 1,
          preferredLocations: 1,
          skills: 1,
          specializations: 1,
          achievements: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .toArray();
      
      console.log('People Registration API: Database query successful');
      console.log('People Registration API: Found registrations:', registrations.length);
      
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
        registrations,
        pagination
      };
      
      // Set cache headers for better performance
      const responseObj = NextResponse.json(response);
      responseObj.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      responseObj.headers.set('ETag', `"${Date.now()}-${totalCount}"`);
      
      return responseObj;
    } catch (queryError) {
      console.error('People Registration API: Database query failed:', queryError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to query registrations from database',
          details: queryError instanceof Error ? queryError.message : 'Unknown query error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('People Registration API: Unexpected error:', error);
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

// POST - Create new people registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const collection = await getCollection('peopleRegistrations');
    
    const registration = {
      ...body,
      status: body.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(registration);
    
    return NextResponse.json({ 
      success: true,
      id: String(result.insertedId),
      message: 'People registration submitted successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('People Registration API: POST error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit registration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
