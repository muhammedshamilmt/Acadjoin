import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';
import { validateEmail } from '@/lib/email-validation';

type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'draft' | 'submitted';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET - Retrieve all institute registrations with statistics and pagination
export async function GET(request: NextRequest) {
  try {
    console.log('Institute Registration API: GET request received');
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const suggest = url.searchParams.get('suggest');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    let collection;
    try {
      collection = await getCollection('instituteRegistrations');
      console.log('Institute Registration API: Database connection successful');
    } catch (dbError) {
      console.error('Institute Registration API: Database connection failed:', dbError);
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
      // Build optional search filter
      let filter: any = {};
      if (q) {
        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter = {
          $or: [
            { name: regex },
            { type: regex },
            { city: regex },
            { state: regex },
            { description: regex },
            { accreditations: regex },
            { keywords: regex },
            { 'courses.name': regex }
          ]
        };
      }

      // Suggestions mode: return matching keyword suggestions only
      if (suggest) {
        const registrationsForSuggest = await collection
          .find(q ? filter : {})
          .project({ keywords: 1 })
          .limit(50) // Limit suggestions for performance
          .toArray();
        
        const keywordSet = new Set<string>();
        for (const doc of registrationsForSuggest) {
          const kws = Array.isArray(doc.keywords) ? doc.keywords : [];
          for (const kw of kws) {
            if (typeof kw === 'string') {
              if (!q || kw.toLowerCase().includes(q.toLowerCase())) {
                keywordSet.add(kw);
              }
            }
          }
        }
        const suggestions = Array.from(keywordSet).slice(0, 10);
        return NextResponse.json({ success: true, suggestions });
      }

      // Get total count for pagination
      const totalCount = await collection.countDocuments(filter);
      
      // Get registrations with pagination and optimized projection
      const registrations = await collection
        .find(filter)
        .project({
          _id: 1,
          name: 1,
          type: 1,
          city: 1,
          state: 1,
          description: 1,
          established: 1,
          website: 1,
          phone: 1,
          email: 1,
          address: 1,
          totalStudents: 1,
          accreditations: 1,
          nirfRanking: 1,
          qsRanking: 1,
          timesRanking: 1,
          placementRate: 1,
          averagePackage: 1,
          highestPackage: 1,
          excellenceInEducation: 1,
          viewDetailsLink: 1,
          applyNowLink: 1,
          logoDataUrl: 1,
          imageDataUrls: 1,
          courses: 1,
          faculty: 1,
          facilities: 1,
          recruiters: 1,
          alumni: 1,
          status: 1,
          registrationId: 1,
          createdAt: 1,
          updatedAt: 1,
          keywords: 1
        })
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .toArray();
      
      console.log('Institute Registration API: Database query successful');
      console.log('Institute Registration API: Found registrations:', registrations.length);
      
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
      
      // Log all status values for debugging
      const allStatuses = registrations.map(reg => reg.status);
      console.log('Institute Registration API: All statuses found:', [...new Set(allStatuses)]);
      
      // Calculate statistics (only for first page to improve performance)
      let statistics = null;
      if (page === 1) {
        const total = totalCount;
        const statusPipeline = [
          { $match: filter },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ];
        
        const statusCounts = await collection.aggregate(statusPipeline).toArray();
        const statusMap = statusCounts.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {});
        
        statistics = {
          total,
          pending: statusMap.pending || 0,
          rejected: statusMap.rejected || 0,
          approved: statusMap.approved || 0,
          submitted: statusMap.submitted || 0,
          draft: statusMap.draft || 0
        };
      }
      
      console.log('Institute Registration API: Statistics calculated:', statistics);
      
      const response = { 
        success: true,
        registrations,
        pagination,
        ...(statistics && { statistics })
      };
      
      // Set cache headers for better performance
      const responseObj = NextResponse.json(response);
      responseObj.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      responseObj.headers.set('ETag', `"${Date.now()}-${totalCount}"`);
      
      return responseObj;
    } catch (queryError) {
      console.error('Institute Registration API: Database query failed:', queryError);
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
    console.error('Institute Registration API: Unexpected error:', error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const statusFromQuery = (new URL(request.url).searchParams.get('status') as RegistrationStatus | null) || null;
    const status: RegistrationStatus = statusFromQuery || 'pending';

    // Basic validation only for non-draft submissions
    const required = ['name','type','city','state','description','established','phone','email','password','confirmPassword','address'];
    if (status !== 'draft') {
      for (const f of required) {
        if (!body[f] || (typeof body[f] === 'string' && body[f].trim() === '')) {
          return NextResponse.json({ error: `Missing required field: ${f}` }, { status: 400 });
        }
      }
      if (body.password !== body.confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
      }
      
      // Validate password strength
      if (body.password && body.password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }
      
      // Validate email format and uniqueness across all collections
      const emailValidation = await validateEmail(body.email);
      if (!emailValidation.isUnique) {
        return NextResponse.json({ error: emailValidation.message }, { status: 409 });
      }
    }

    // Always hash password if provided, even for drafts
    const hashedPassword = body.password ? await bcrypt.hash(body.password, 10) : undefined;

    // Validate approximate payload size for base64 images (MongoDB doc limit is 16MB)
    const estimateBytes = (dataUrl: string) => {
      if (!dataUrl || typeof dataUrl !== 'string') return 0;
      // strip header like "data:image/png;base64,"
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      return Math.floor((base64.length * 3) / 4);
    };
    const logoBytes = estimateBytes(body.logoDataUrl || '');
    const imageBytes = Array.isArray(body.imageDataUrls) ? body.imageDataUrls.reduce((sum: number, s: string) => sum + estimateBytes(s), 0) : 0;
    const facultyBytes = Array.isArray(body.faculty) ? body.faculty.reduce((sum: number, m: any) => sum + estimateBytes(m?.avatarDataUrl || ''), 0) : 0;
    const recruiterBytes = Array.isArray(body.recruiters) ? body.recruiters.reduce((sum: number, r: any) => sum + estimateBytes(r?.logoDataUrl || ''), 0) : 0;
    const alumniBytes = Array.isArray(body.alumni) ? body.alumni.reduce((sum: number, a: any) => sum + estimateBytes(a?.image || ''), 0) : 0;
    const totalImageBytes = logoBytes + imageBytes + facultyBytes + recruiterBytes + alumniBytes;
    const maxBytes = 15 * 1024 * 1024; // 15MB safety below Mongo's 16MB
    if (totalImageBytes > maxBytes) {
      return NextResponse.json({ error: 'Total image size too large. Please upload smaller images or fewer files.' }, { status: 413 });
    }

    const doc = {
      // basic info
      name: body.name || '',
      type: body.type || '',
      city: body.city || '',
      state: body.state || '',
      description: body.description || '',
      established: body.established || '',
      website: body.website || '',
      // discovery
      keywords: Array.isArray(body.keywords) ? body.keywords : (typeof body.keywords === 'string' ? body.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : []),
      // contact
      phone: body.phone || '',
      email: body.email || '',
      address: body.address || '',
      // institution details
      totalStudents: body.totalStudents || '',
      accreditations: Array.isArray(body.accreditations) ? body.accreditations : [],
      nirfRanking: body.nirfRanking || '',
      qsRanking: body.qsRanking || '',
      timesRanking: body.timesRanking || '',
      // placement
      placementRate: body.placementRate || '',
      averagePackage: body.averagePackage || '',
      highestPackage: body.highestPackage || '',
      // excellence and alumni
      excellenceInEducation: body.excellenceInEducation || '',
      viewDetailsLink: body.viewDetailsLink || '',
      applyNowLink: body.applyNowLink || '',
      // media (store base64 data URLs when provided)
      logoDataUrl: body.logoDataUrl || body.logoUrl || body.logo || '',
      imageDataUrls: Array.isArray(body.imageDataUrls) ? body.imageDataUrls : (Array.isArray(body.imageUrls) ? body.imageUrls : (Array.isArray(body.images) ? body.images : [])),
      // dynamic arrays
      courses: Array.isArray(body.courses) ? body.courses.map((course: any) => ({
        name: course.name || '',
        duration: course.duration || '',
        fees: course.fees || '',
        seats: course.seats || '',
        cutoff: course.cutoff || '',
        viewDetailsLink: course.viewDetailsLink || '',
        applyNowLink: course.applyNowLink || ''
      })) : [],
      faculty: Array.isArray(body.faculty)
        ? body.faculty.map((m: any) => ({
            name: m.name || '',
            position: m.position || '',
            specialization: m.specialization || '',
            experience: m.experience || '',
            publications: m.publications || '',
            avatarDataUrl: m.avatarDataUrl || m.avatarUrl || m.avatar || '',
          }))
        : [],
      facilities: Array.isArray(body.facilities) ? body.facilities : [],
      recruiters: Array.isArray(body.recruiters)
        ? body.recruiters.map((r: any) => ({ name: r.name || '', logoDataUrl: r.logoDataUrl || r.logoUrl || r.logo || '' }))
        : [],
      alumni: Array.isArray(body.alumni)
        ? body.alumni.map((a: any) => ({
            name: a.name || '',
            company: a.company || '',
            position: a.position || '',
            batch: a.batch || '',
            image: a.image || '',
            package: a.package || ''
          }))
        : [],
      // meta
      status,
      registrationId: body.registrationId || `REG-INST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hashedPassword, // keep hashed; excluded in GET list via projection
      // payment info (optional)
      payment: body.payment ? {
        required: Boolean(body.payment.required),
        amount: Number(body.payment.amount) || 0,
        currency: body.payment.currency || 'INR',
        status: body.payment.status || 'unpaid',
        orderId: body.payment.orderId || '',
        paymentId: body.payment.paymentId || '',
        signature: body.payment.signature || '',
        verified: Boolean(body.payment.verified),
      } : {
        required: false,
        amount: 0,
        currency: 'INR',
        status: 'unpaid',
        orderId: '',
        paymentId: '',
        signature: '',
        verified: false,
      },
    };

    const col = await getCollection('instituteRegistrations');
    const result = await col.insertOne(doc as any);

    // Return user data for automatic login
    const userData = {
      id: String(result.insertedId),
      firstName: body.name, // Institute name as firstName
      lastName: '', // No lastName for institutes
      email: body.email,
      role: 'institute' as const,
      type: 'institute' as const,
      instituteName: body.name,
      phone: body.phone || '',
      address: body.address || '',
      website: body.website || '',
      city: body.city || '',
      state: body.state || ''
    };

    return NextResponse.json({ 
      success: true, 
      id: String(result.insertedId),
      user: userData,
      message: 'Institute registration submitted successfully',
      registrationId: doc.registrationId,
      status: status
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to submit registration', details: process.env.NODE_ENV === 'development' ? message : undefined },
      { status: 500 }
    );
  }
}


