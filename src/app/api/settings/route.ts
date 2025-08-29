import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const settingsCollection = db.collection('settings');
    
    // Get the first settings document
    const settings = await settingsCollection.findOne({});
    
    if (!settings) {
      // Return complete default settings if none exist
      return NextResponse.json({
        success: true,
        settings: {
          // Registration Settings
          paidRegistration: false,
          registrationFee: "50",
          freeRegistrationLimit: "100",
          
          // Email Settings
          emailNotifications: true,
          welcomeEmail: true,
          adminNotifications: true,
          smtpHost: "smtp.gmail.com",
          smtpPort: "587",
          
          // Security Settings
          twoFactorAuth: false,
          sessionTimeout: "30",
          maxLoginAttempts: "5",
          passwordMinLength: "8",
          
          // General Settings
          siteName: "FuturePath",
          siteDescription: "Educational platform connecting students and institutes",
          maintenanceMode: false,
          debugMode: false,
          
          // Content Settings
          maxFileSize: "10",
          allowedFileTypes: "jpg,jpeg,png,pdf,doc,docx",
          autoApproveInstitutes: false,
          autoApproveUsers: true,
          
          // Institution Types
          institutionTypes: [
            "University",
            "College",
            "School",
            "Training Center",
            "Online Platform",
            "Research Institute",
            "Vocational Center",
            "Language School"
          ]
        }
      });
    }
    
    // Ensure all expected fields exist with defaults if missing
    const completeSettings = {
      // Registration Settings
      paidRegistration: settings.paidRegistration ?? false,
      registrationFee: settings.registrationFee?.toString() ?? "50",
      freeRegistrationLimit: settings.freeRegistrationLimit?.toString() ?? "100",
      
      // Email Settings
      emailNotifications: settings.emailNotifications ?? true,
      welcomeEmail: settings.welcomeEmail ?? true,
      adminNotifications: settings.adminNotifications ?? true,
      smtpHost: settings.smtpHost ?? "smtp.gmail.com",
      smtpPort: settings.smtpPort?.toString() ?? "587",
      
      // Security Settings
      twoFactorAuth: settings.twoFactorAuth ?? false,
      sessionTimeout: settings.sessionTimeout?.toString() ?? "30",
      maxLoginAttempts: settings.maxLoginAttempts?.toString() ?? "5",
      passwordMinLength: settings.passwordMinLength?.toString() ?? "8",
      
      // General Settings
      siteName: settings.siteName ?? "FuturePath",
      siteDescription: settings.siteDescription ?? "Educational platform connecting students and institutes",
      maintenanceMode: settings.maintenanceMode ?? false,
      debugMode: settings.debugMode ?? false,
      
      // Content Settings
      maxFileSize: settings.maxFileSize?.toString() ?? "10",
      allowedFileTypes: settings.allowedFileTypes ?? "jpg,jpeg,png,pdf,doc,docx",
      autoApproveInstitutes: settings.autoApproveInstitutes ?? false,
      autoApproveUsers: settings.autoApproveUsers ?? true,
      
      // Institution Types
      institutionTypes: settings.institutionTypes ?? [
        "University",
        "College",
        "School",
        "Training Center",
        "Online Platform",
        "Research Institute",
        "Vocational Center",
        "Language School"
      ]
    };
    
    return NextResponse.json({
      success: true,
      settings: completeSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Update settings
export async function POST(request: NextRequest) {
  try {
    console.log('Settings API: POST request received');
    
    let body;
    try {
      body = await request.json();
      console.log('Settings API: Request body parsed successfully');
    } catch (parseError) {
      console.error('Settings API: Failed to parse request body:', parseError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }
    
    const { settings } = body;
    
    if (!settings) {
      console.log('Settings API: No settings data provided');
      return NextResponse.json(
        { 
          success: false,
          error: 'Settings data is required' 
        },
        { status: 400 }
      );
    }
    
    console.log('Settings API: Attempting database connection...');
    let db;
    try {
      db = await getDb();
      console.log('Settings API: Database connection successful');
    } catch (dbError) {
      console.error('Settings API: Database connection failed:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error',
          success: false
        },
        { status: 500 }
      );
    }
    
    const collection = db.collection('settings');
    
    // Add metadata and exclude _id field to prevent immutable field error
    const { _id, ...settingsWithoutId } = settings;
    const settingsWithMetadata = {
      ...settingsWithoutId,
      updatedAt: new Date()
    };
    
    console.log('Settings API: Preparing to update settings...');
    console.log('Settings API: Settings data (without _id):', JSON.stringify(settingsWithMetadata, null, 2));
    
    try {
      // First, check if a settings document exists
      const existingSettings = await collection.findOne({});
      console.log('Settings API: Existing settings found:', existingSettings ? 'Yes' : 'No');
      
      let result;
      if (existingSettings) {
        // Update existing document using its _id
        console.log('Settings API: Updating existing settings document...');
        result = await collection.updateOne(
          { _id: existingSettings._id },
          { $set: settingsWithMetadata }
        );
      } else {
        // Create new document
        console.log('Settings API: Creating new settings document...');
        result = await collection.insertOne({
          ...settingsWithMetadata,
          createdAt: new Date()
        });
      }
      
      console.log('Settings API: Database operation successful', result);
      
      // Fetch the updated settings to return to client
      const updatedSettings = await collection.findOne({});
      
      if (!updatedSettings) {
        console.error('Settings API: Failed to fetch updated settings after save');
        return NextResponse.json(
          { 
            error: 'Settings saved but failed to retrieve updated settings',
            success: false
          },
          { status: 500 }
        );
      }
      
      console.log('Settings API: Successfully retrieved updated settings');
      
      return NextResponse.json({ 
        message: 'Settings updated successfully',
        result,
        success: true,
        settings: updatedSettings
      });
    } catch (updateError) {
      console.error('Settings API: Database update failed:', updateError);
      console.error('Settings API: Error details:', {
        name: updateError instanceof Error ? updateError.name : 'Unknown',
        message: updateError instanceof Error ? updateError.message : 'Unknown error',
        stack: updateError instanceof Error ? updateError.stack : 'No stack trace'
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to update settings in database',
          details: updateError instanceof Error ? updateError.message : 'Unknown update error',
          success: false
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Settings API: Unexpected error:', error);
    console.error('Settings API: Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}
