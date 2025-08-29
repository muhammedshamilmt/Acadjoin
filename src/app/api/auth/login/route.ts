import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN API CALLED ===');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    console.log('🔍 Processing login for email:', emailLower);

    // Check for admin login first
    if (emailLower === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      console.log('🎉 Admin login successful');
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin-001',
          firstName: 'Admin',
          lastName: 'User',
          email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          role: 'admin',
          type: 'admin',
          isAdmin: true
        }
      });
    }

    try {
      // Check in users collection first (regular signup users)
      console.log('📋 Checking users collection...');
      const usersCol = await getCollection('users');
      let user = await usersCol.findOne({ email: emailLower });

      if (user) {
        console.log('✅ User found in users collection');
        // Verify password
        if (!user.password) {
          console.log('❌ User has no password stored - continuing to check other collections');
          // Don't return error, continue checking other collections
        } else {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            console.log('❌ Invalid password for user - continuing to check other collections');
            // Don't return error, continue checking other collections
          } else {
            // Update last login
            await usersCol.updateOne(
              { _id: user._id },
              { $set: { lastLogin: new Date() } }
            );

            console.log('🎉 User login successful');
            console.log('📋 User role assigned: user (regular signup)');
            console.log('📋 User data being returned:', {
              id: String(user._id),
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: 'user',
              type: 'regular',
              isAdmin: false
            });
            return NextResponse.json({
              success: true,
              user: {
                id: String(user._id),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: 'user',
                type: 'regular',
                isAdmin: false
              }
            });
          }
        }
      } else {
        console.log('❌ No user found in users collection');
      }

      // Check in peopleRegistrations collection
      console.log('👥 Checking peopleRegistrations collection...');
      const peopleCol = await getCollection('peopleRegistrations');
      let peopleUser = await peopleCol.findOne({ email: emailLower });

      if (peopleUser) {
        console.log('✅ User found in peopleRegistrations collection');
        // Verify password
        if (!peopleUser.password) {
          console.log('❌ People user has no password stored - continuing to check other collections');
          // Don't return error, continue checking other collections
        } else {
          const isValidPassword = await bcrypt.compare(password, peopleUser.password);
          if (!isValidPassword) {
            console.log('❌ Invalid password for people user - continuing to check other collections');
            // Don't return error, continue checking other collections
          } else {
            console.log('🎉 People user login successful');
            console.log('👥 People role assigned: individual (people registration)');
            console.log('👥 People data being returned:', {
              id: String(peopleUser._id),
              firstName: peopleUser.firstName,
              lastName: peopleUser.lastName,
              email: peopleUser.email,
              role: 'individual',
              type: 'people',
              isAdmin: false,
              currentInstitute: peopleUser.currentInstitute,
              course: peopleUser.course,
              year: peopleUser.year,
              location: peopleUser.location,
              phone: peopleUser.phone
            });
            return NextResponse.json({
              success: true,
              user: {
                id: String(peopleUser._id),
                firstName: peopleUser.firstName,
                lastName: peopleUser.lastName,
                email: peopleUser.email,
                role: 'individual',
                type: 'people',
                isAdmin: false,
                // Include additional people-specific data
                currentInstitute: peopleUser.currentInstitute,
                course: peopleUser.course,
                year: peopleUser.year,
                location: peopleUser.location,
                phone: peopleUser.phone
              }
            });
          }
        }
      } else {
        console.log('❌ No user found in peopleRegistrations collection');
      }

      // Check in instituteRegistrations collection
      console.log('🏫 Checking instituteRegistrations collection...');
      const instituteCol = await getCollection('instituteRegistrations');
      let instituteUser = await instituteCol.findOne({ email: emailLower });

      if (instituteUser) {
        console.log('✅ User found in instituteRegistrations collection');
        console.log('🏫 Institute user data:', { 
          hasPassword: !!instituteUser.password, 
          passwordType: typeof instituteUser.password,
          email: instituteUser.email,
          name: instituteUser.name 
        });
        
        // Verify password
        if (!instituteUser.password) {
          console.log('❌ Institute user has no password stored');
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
        
        const isValidPassword = await bcrypt.compare(password, instituteUser.password);
        if (!isValidPassword) {
          console.log('❌ Invalid password for institute user');
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        console.log('🎉 Institute user login successful');
        console.log('🏫 Institute role assigned: institute (institute registration)');
        console.log('🏫 Institute data being returned:', {
          id: String(instituteUser._id),
          name: instituteUser.name,
          email: instituteUser.email,
          role: 'institute',
          type: 'institute',
          isAdmin: false,
          instituteName: instituteUser.name,
          phone: instituteUser.phone,
          address: instituteUser.address,
          website: instituteUser.website,
          status: instituteUser.status
        });
        return NextResponse.json({
          success: true,
          user: {
            id: String(instituteUser._id),
            name: instituteUser.name,
            email: instituteUser.email,
            role: 'institute',
            type: 'institute',
            isAdmin: false,
            // Include additional institute-specific data
            instituteName: instituteUser.name,
            phone: instituteUser.phone,
            address: instituteUser.address,
            website: instituteUser.website,
            status: instituteUser.status
          }
        });
      } else {
        console.log('❌ No user found in instituteRegistrations collection');
      }

      // If no user found in any collection
      console.log('❌ No user found in ANY collection');
      console.log('📊 Summary: Checked users, peopleRegistrations, and instituteRegistrations collections');
      console.log('🔍 Role mapping summary:');
      console.log('   - users collection → role: "user", type: "regular"');
      console.log('   - peopleRegistrations collection → role: "individual", type: "people"');
      console.log('   - instituteRegistrations collection → role: "institute", type: "institute"');
      console.log('   - admin credentials → role: "admin", type: "admin"');
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    } catch (dbError) {
      console.error('💥 Database error during login:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? String(dbError) : undefined
      }, { status: 500 });
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('💥 Login API error:', error);
    return NextResponse.json({ 
      error: 'Login failed', 
      details: process.env.NODE_ENV === 'development' ? message : undefined 
    }, { status: 500 });
  }
}
