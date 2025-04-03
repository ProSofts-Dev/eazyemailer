import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const offset = (page - 1) * limit;

    // Fetch templates with pagination
    const [templatesList, totaltemplates] = await Promise.all([
      db
        .select()
        .from(templates)
        .where(eq(templates.userId, session?.user?.id))
        .orderBy(desc(templates.createdAt))
        .limit(limit)
        .offset(offset)
        .execute(),
      db.$count(templates, eq(templates.userId, session?.user?.id)),
    ]);
    const totalPages = Math.ceil(totaltemplates / limit);

    return NextResponse.json({
      templates: templatesList,
      total: totaltemplates,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, content, category } = body;
    const session = await getSession();

    if (!name || !description || !category || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert new template
    const result = await db.insert(templates).values({
      name,
      description,
      content,
      category,
      createdAt: new Date(),
      userId: session?.user?.id,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error adding template:", error);
    return NextResponse.json(
      { error: "Failed to add template" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updatedtemplate = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, id))
      .returning();
      
    return NextResponse.json(updatedtemplate[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id: any = searchParams.get('id');

    await db.delete(templates).where(eq(templates.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}