import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET - Retrieve all messages with statistics
export async function GET() {
  try {
    console.log('Messages API: GET request received');
    
    let collection;
    try {
      collection = await getCollection('messages');
      console.log('Messages API: Database connection successful');
    } catch (dbError) {
      console.error('Messages API: Database connection failed:', dbError);
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
      // Get all messages
      const messages = await collection.find({}).toArray();
      console.log('Messages API: Database query successful');
      console.log('Messages API: Found messages:', messages.length);
      
      // Log all status values for debugging
      const allStatuses = messages.map(msg => msg.status);
      const allPriorities = messages.map(msg => msg.priority);
      console.log('Messages API: All statuses found:', [...new Set(allStatuses)]);
      console.log('Messages API: All priorities found:', [...new Set(allPriorities)]);
      
      // Calculate statistics
      const total = messages.length;
      const unread = messages.filter(msg => msg.status === 'unread').length;
      const read = messages.filter(msg => msg.status === 'read').length;
      const replied = messages.filter(msg => msg.status === 'replied').length;
      const highPriority = messages.filter(msg => msg.priority === 'high').length;
      const today = messages.filter(msg => {
        const msgDate = new Date(msg.createdAt);
        const today = new Date();
        return msgDate.toDateString() === today.toDateString();
      }).length;
      
      const statistics = {
        total,
        unread,
        read,
        replied,
        highPriority,
        today
      };
      
      console.log('Messages API: Statistics calculated:', statistics);
      
      return NextResponse.json({ 
        success: true,
        messages,
        statistics
      });
    } catch (queryError) {
      console.error('Messages API: Database query failed:', queryError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to query messages from database',
          details: queryError instanceof Error ? queryError.message : 'Unknown query error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Messages API: Unexpected error:', error);
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

// POST - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const collection = await getCollection('messages');
    
    const message = {
      ...body,
      status: body.status || 'unread',
      priority: body.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(message);
    
    return NextResponse.json({ 
      success: true,
      id: String(result.insertedId),
      message: 'Message created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Messages API: POST error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
