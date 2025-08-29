import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not set',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set'
    };
    
    console.log('Environment check:', envCheck);
    
    // Test database connection
    const col = await getCollection('peopleRegistrations');
    
    // Try to count documents
    const count = await col.countDocuments({});
    
    // Test other collections
    const usersCol = await getCollection('users');
    const usersCount = await usersCol.countDocuments({});
    
    const institutesCol = await getCollection('instituteRegistrations');
    const institutesCount = await institutesCol.countDocuments({});
    
    // Check for institute records with password issues
    const institutesWithPassword = await institutesCol.find({ password: { $exists: true, $ne: null } }).toArray();
    const institutesWithoutPassword = await institutesCol.find({ 
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: undefined }
      ]
    }).toArray();
    
    console.log('Database connection successful');
    console.log('Collection counts:', {
      peopleRegistrations: count,
      users: usersCount,
      instituteRegistrations: institutesCount
    });
    
    console.log('Institute password status:', {
      withPassword: institutesWithPassword.length,
      withoutPassword: institutesWithoutPassword.length,
      totalInstitutes: institutesCount
    });
    
    // Show sample institute data (without sensitive info)
    const sampleInstitutes = await institutesCol.find({}, { 
      projection: { 
        name: 1, 
        email: 1, 
        hasPassword: { $cond: { if: { $ne: ["$password", null] }, then: true, else: false } },
        passwordType: { $type: "$password" }
      } 
    }).limit(3).toArray();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      environment: envCheck,
      collections: {
        peopleRegistrations: count,
        users: usersCount,
        instituteRegistrations: institutesCount
      },
      institutePasswordStatus: {
        withPassword: institutesWithPassword.length,
        withoutPassword: institutesWithoutPassword.length,
        totalInstitutes: institutesCount
      },
      sampleInstitutes,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Database test error:', error);
    const message = error instanceof Error ? error.message : String(error);
    
    // Check environment variables even if DB fails
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not set',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set'
    };
    
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      environment: envCheck,
      details: process.env.NODE_ENV === 'development' ? message : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
