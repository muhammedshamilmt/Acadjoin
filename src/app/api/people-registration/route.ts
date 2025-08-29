import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET - Retrieve all people registrations with statistics
export async function GET() {
  try {
    console.log('People Registration API: GET request received');
    
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
      // Get all registrations
      const registrations = await collection.find({}).toArray();
      console.log('People Registration API: Database query successful');
      console.log('People Registration API: Found registrations:', registrations.length);
      
      // Log all status values for debugging
      const allStatuses = registrations.map(reg => reg.status);
      console.log('People Registration API: All statuses found:', [...new Set(allStatuses)]);
      
      // Calculate statistics
      const total = registrations.length;
      const active = registrations.filter(reg => reg.status === 'active').length;
      const inactive = registrations.filter(reg => reg.status === 'inactive').length;
      const pending = registrations.filter(reg => reg.status === 'pending').length;
      const approved = registrations.filter(reg => reg.status === 'approved').length;
      const rejected = registrations.filter(reg => reg.status === 'rejected').length;
      
      const statistics = {
        total,
        active,
        inactive,
        pending,
        approved,
        rejected
      };
      
      console.log('People Registration API: Statistics calculated:', statistics);
      
      return NextResponse.json({ 
        success: true,
        registrations,
        statistics
      });
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
