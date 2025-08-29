import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const col = await getCollection('instituteRegistrations');
    const doc = await col.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch', details: process.env.NODE_ENV === 'development' ? message : undefined }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const col = await getCollection('instituteRegistrations');
    // Normalize keywords to array of trimmed strings if provided
    let normalizedKeywords: string[] | undefined = undefined;
    if (typeof body.keywords !== 'undefined') {
      normalizedKeywords = Array.isArray(body.keywords)
        ? body.keywords.map((k: unknown) => String(k).trim()).filter(Boolean)
        : String(body.keywords).split(',').map((k: string) => k.trim()).filter(Boolean);
    }

    const update: any = { ...body, ...(typeof normalizedKeywords !== 'undefined' ? { keywords: normalizedKeywords } : {}), updatedAt: new Date() };
    delete update._id;
    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (!result.matchedCount) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update', details: process.env.NODE_ENV === 'development' ? message : undefined }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const col = await getCollection('instituteRegistrations');
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to delete', details: process.env.NODE_ENV === 'development' ? message : undefined }, { status: 500 });
  }
}


