import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET - Retrieve all users with statistics
export async function GET() {
  try {
    console.log('Users API: GET request received');
    
    let collection;
    try {
      collection = await getCollection('users');
      console.log('Users API: Database connection successful');
    } catch (dbError) {
      console.error('Users API: Database connection failed:', dbError);
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
      // Get all users
      const users = await collection.find({}).toArray();
      console.log('Users API: Database query successful');
      console.log('Users API: Found users:', users.length);
      
      // Log all status values for debugging
      const allStatuses = users.map(user => user.status);
      const allRoles = users.map(user => user.role);
      console.log('Users API: All statuses found:', [...new Set(allStatuses)]);
      console.log('Users API: All roles found:', [...new Set(allRoles)]);
      
      // Calculate statistics
      const total = users.length;
      const active = users.filter(user => user.status === 'active').length;
      const inactive = users.filter(user => user.status === 'inactive').length;
      const suspended = users.filter(user => user.status === 'suspended').length;
      const admins = users.filter(user => user.role === 'admin').length;
      const institutes = users.filter(user => user.role === 'institute').length;
      const individuals = users.filter(user => user.role === 'individual').length;
      
      const statistics = {
        total,
        active,
        inactive,
        suspended,
        admins,
        institutes,
        individuals
      };
      
      console.log('Users API: Statistics calculated:', statistics);
      
      return NextResponse.json({ 
        success: true,
        users,
        statistics
      });
    } catch (queryError) {
      console.error('Users API: Database query failed:', queryError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to query users from database',
          details: queryError instanceof Error ? queryError.message : 'Unknown query error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Users API: Unexpected error:', error);
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

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const collection = await getCollection('users');
    
    const user = {
      ...body,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(user);
    
    return NextResponse.json({ 
      success: true,
      id: String(result.insertedId),
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Users API: POST error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
