import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envInfo = {
      nodeEnv: process.env.NODE_ENV || 'not set',
      mongodbUri: process.env.MONGODB_URI ? 'set' : 'not set',
      mongodbUriPreview: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set',
      timestamp: new Date().toISOString()
    };
    
    console.log('Environment check:', envInfo);
    
    return NextResponse.json({ 
      success: true,
      environment: envInfo
    });
  } catch (error) {
    console.error('Environment check failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Environment check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
