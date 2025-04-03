import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contacts, settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { triggerWorkflow } from '@/lib/utils/workflows';
import { decode, getToken } from 'next-auth/jwt';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const offset = (page - 1) * limit;

    // Fetch contacts with pagination
    const [contactsList, totalContacts] = await Promise.all([
      db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, session?.user?.id))
        .limit(limit)
        .offset(offset)
        .execute(),
      db.$count(contacts, eq(contacts.userId, session?.user?.id)),
    ]);
    const totalPages = Math.ceil(totalContacts / limit);

    return NextResponse.json({
      contacts: contactsList,
      total: totalContacts,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, group, status, link = '' } = body;
    let session = await getSession();

    let userId = '';

    if(!session || !session?.user) {
      const authHeader = req.headers.get("authorization");

      const token = authHeader?.split(" ")[1]; // Get token from "Bearer <token>"
      const secret = process.env.NEXTAUTH_SECRET || '';
  
      // Decode JWT and extract user data
      session = await decode({ token, secret });
      userId = session.id;
    } else userId = session?.user?.id

    const setting = await db.select().from(settings).where(eq(settings.userId, userId)).execute();
    if(setting[0].contactLimit - setting[0].contactLimitUsed < 1) {
      return NextResponse.json(
        { message: `Failed to upload as you have ${setting[0].contactLimit - setting[0].contactLimitUsed} contact limit remaining. Please upgrade to increase limit.` },
        { status: 400 }
      );
    }

    if (!name || !email || !group || !status) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert new contact
    const result = await db.insert(contacts).values({
      name,
      email,
      group,
      status,
      link,
      createdAt: new Date(),
      userId: userId,
    }).returning();


    await db.update(settings)
      .set({
        contactLimitUsed: setting[0].contactLimitUsed + 1, 
        updatedAt: new Date(),
      })
      .where(eq(settings.userId, userId))
      .execute();

    triggerWorkflow('user.created', userId, { email, name, group, status, link });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error adding contact:", error);
    return NextResponse.json(
      { error: "Failed to add contact" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updatedContact = await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id))
      .returning();
      
    return NextResponse.json(updatedContact[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id: any = searchParams.get('id');

    await db.delete(contacts).where(eq(contacts.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}