import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET - Retrieve institution types
export async function GET() {
  try {
    const collection = await getCollection('settings');
    const settings = await collection.findOne({});
    
    const institutionTypes = settings?.institutionTypes || [
      "University",
      "College",
      "School",
      "Training Center",
      "Online Platform",
      "Research Institute",
      "Vocational Center",
      "Language School"
    ];
    
    return NextResponse.json({ 
      success: true,
      institutionTypes 
    });
  } catch (error) {
    console.error('Error fetching institution types:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch institution types',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Add new institution type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    
    if (!type || !type.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Institution type is required' 
        },
        { status: 400 }
      );
    }
    
    const collection = await getCollection('settings');
    
    // Check if type already exists
    const existingSettings = await collection.findOne({});
    const existingTypes = existingSettings?.institutionTypes || [];
    
    if (existingTypes.includes(type.trim())) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Institution type already exists' 
        },
        { status: 400 }
      );
    }
    
    // Add new type
    const result = await collection.updateOne(
      {},
      { 
        $push: { institutionTypes: type.trim() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
    
    // Fetch the updated institution types
    const updatedSettings = await collection.findOne({});
    const institutionTypes = updatedSettings?.institutionTypes || [];
    
    return NextResponse.json({ 
      success: true,
      message: 'Institution type added successfully',
      result,
      institutionTypes
    });
  } catch (error) {
    console.error('Error adding institution type:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add institution type',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove institution type
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (!type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Institution type is required' 
        },
        { status: 400 }
      );
    }
    
    const collection = await getCollection('settings');
    
    // Remove the type
    const result = await collection.updateOne(
      {},
      { 
        $pull: { institutionTypes: type } as any,
        $set: { updatedAt: new Date() }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Settings not found' 
        },
        { status: 404 }
      );
    }
    
    // Fetch the updated institution types
    const updatedSettings = await collection.findOne({});
    const institutionTypes = updatedSettings?.institutionTypes || [];
    
    return NextResponse.json({ 
      success: true,
      message: 'Institution type removed successfully',
      result,
      institutionTypes
    });
  } catch (error) {
    console.error('Error removing institution type:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to remove institution type',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
