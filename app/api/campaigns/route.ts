import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, contacts } from '@/lib/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const offset = (page - 1) * limit;

    const listSchma: any = {
      ...campaigns,
      recipientCount: sql<number>`CASE 
        WHEN campaigns.status != 'Active' THEN (
            CASE 
                WHEN campaigns.recipient_group = 'all' THEN (
                    SELECT COUNT(*) FROM contacts WHERE contacts.user_id = ${session.user?.id}
                )
                ELSE (
                    SELECT COUNT(*) FROM contacts WHERE contacts.group = campaigns.recipient_group AND contacts.user_id = ${session.user?.id}
                )
            END
        )
        ELSE campaigns.recipient_count -- Use the existing value in the database
      END`
    }

    // Fetch campaigns with pagination
    const [campaignsList, totalcampaigns] = await Promise.all([
      db
        .select(listSchma)
        .from(campaigns)
        .leftJoin(contacts, and(eq(campaigns.recipientGroup, contacts.group), eq(contacts.userId, session?.user?.id)))
        .where(eq(campaigns.userId, session?.user?.id))
        .groupBy(campaigns.id)
        .orderBy(desc(campaigns.createdAt))
        .limit(limit)
        .offset(offset)
        .execute(),
      db.$count(campaigns, eq(campaigns.userId, session?.user?.id)),
    ]);
    const totalPages = Math.ceil(totalcampaigns / limit);

    return NextResponse.json({
      campaigns: campaignsList,
      total: totalcampaigns,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, subject, content, recipientGroup, templateId } = body;
    const session = await getSession();

    if (!name || !subject || !content || !recipientGroup) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let counts = 0;

    if(recipientGroup === 'all') counts = await db.$count(contacts, eq(contacts.userId, session?.user?.id));
    else counts = await db.$count(contacts, and(eq(contacts.group, recipientGroup), eq(contacts.userId, session?.user?.id)));

    // Insert new campaign
    const result = await db.insert(campaigns).values({
      name,
      subject,
      content,
      recipientGroup,
      recipientCount: counts,
      templateId,
      status: 'Draft',
      createdAt: new Date(),
      isHtml: templateId !== null,
      userId: session?.user?.id,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error adding campaign:", error);
    return NextResponse.json(
      { error: "Failed to add campaign" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updatedcampaign = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, id))
      .returning();
      
    return NextResponse.json(updatedcampaign[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id: any = searchParams.get('id');

    if(id !== null) await db.delete(campaigns).where(eq(campaigns.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}