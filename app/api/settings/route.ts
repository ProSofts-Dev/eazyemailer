import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { z } from "zod";

const settingsSchema = z.object({
  id: z.number(),
  senderName: z.string().min(1, "Name is required"),
  senderEmail: z.string().email("Invalid email address"),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();

    const userSettings = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session?.user?.id));
    
    return NextResponse.json(userSettings[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const validatedData = settingsSchema.parse(body);
    const { id,  ...updateData } = validatedData;

    const updatedSettings = await db
      .update(settings)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(settings.id, id))
      .returning();
      
    return NextResponse.json(updatedSettings[0]);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}