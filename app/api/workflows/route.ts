import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workflows } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const offset = (page - 1) * limit;

    // Fetch workflows with pagination
    const [workflowsList, totalworkflows] = await Promise.all([
      db
        .select()
        .from(workflows)
        .where(eq(workflows.userId, session?.user?.id))
        .orderBy(desc(workflows.createdAt))
        .limit(limit)
        .offset(offset)
        .execute(),
      db.$count(workflows, eq(workflows.userId, session?.user?.id)),
    ]);
    const totalPages = Math.ceil(totalworkflows / limit);

    return NextResponse.json({
      workflows: workflowsList,
      total: totalworkflows,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, subject, templateId, status, trigger, filter } = body;
    const session = await getSession();

    if (!name || !subject || !status || !trigger || !templateId || !filter) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert new workflow
    const result = await db.insert(workflows).values({
        name, 
        subject, 
        templateId, 
        status, 
        trigger,
        filter,
        userId: session?.user?.id,
        createdAt: new Date(),
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add workflow" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updatedworkflow = await db
      .update(workflows)
      .set(updateData)
      .where(eq(workflows.id, id))
      .returning();
      
    return NextResponse.json(updatedworkflow[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id: any = searchParams.get('id');

    if(id !== null) await db.delete(workflows).where(eq(workflows.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}