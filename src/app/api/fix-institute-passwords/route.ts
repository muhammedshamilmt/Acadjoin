import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Checking for institute records with missing passwords...');
    
    const institutesCol = await getCollection('instituteRegistrations');
    
    // Find institutes without passwords
    const institutesWithoutPassword = await institutesCol.find({ 
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: undefined }
      ]
    }, {
      projection: {
        _id: 1,
        name: 1,
        email: 1,
        password: 1
      }
    }).toArray();
    
    // Find institutes with passwords
    const institutesWithPassword = await institutesCol.find({ 
      password: { $exists: true, $ne: null } 
    }, {
      projection: {
        _id: 1,
        name: 1,
        email: 1,
        hasPassword: true
      }
    }).toArray();
    
    return NextResponse.json({
      success: true,
      message: 'Institute password status check completed',
      summary: {
        totalInstitutes: institutesWithoutPassword.length + institutesWithPassword.length,
        withPassword: institutesWithPassword.length,
        withoutPassword: institutesWithoutPassword.length
      },
      institutesWithoutPassword: institutesWithoutPassword.map(inst => ({
        id: inst._id,
        name: inst.name,
        email: inst.email
      })),
      institutesWithPassword: institutesWithPassword.map(inst => ({
        id: inst._id,
        name: inst.name,
        email: inst.email
      }))
    }, { status: 200 });
    
  } catch (error: unknown) {
    console.error('Error checking institute passwords:', error);
    const message = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check institute passwords',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    }, { status: 500 });
  }
}
