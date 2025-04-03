import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { getSession } from '@/lib/auth/session';
import { contacts, settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  group: z.string().min(1, "Group is required"),
  status: z.enum(["Subscribed", "Unsubscribed"]),
});

export async function POST(req: Request) {
  try {
    // Parse multipart/form-data
    // Parse the file using multer
    const formData = await req.formData();
    const file: any = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse CSV content
    const records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
    });

    // Validate each record
    const validatedContacts = [];
    for (const record of records) {
      try {
        if(record.email !== '') {
          const validated = contactSchema.parse(record);
          validatedContacts.push(validated);  
        }
      } catch (error: any) {
        return NextResponse.json(
          { message: "Validation error", errors: error?.errors, record: record },
          { status: 400 }
        );
      }
    }

    // Get user ID from cookies (if applicable)
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const setting = await db.select().from(settings).where(eq(settings.userId, session?.user?.id)).execute();
    if(validatedContacts.length > setting[0].contactLimit - setting[0].contactLimitUsed) {
      return NextResponse.json(
        { message: `Failed to upload as you have ${setting[0].contactLimit - setting[0].contactLimitUsed} contact limit remaining. Please upgrade to increase limit.` },
        { status: 400 }
      );
    }

    // Insert validated data into the database
    let inserted = await db
      .insert(contacts)
      .values(validatedContacts.map((c) => ({ ...c, userId })))
      .returning();

    await db.update(settings)
      .set({
        contactLimitUsed: setting[0].contactLimitUsed + inserted.length, 
        updatedAt: new Date(),
      })
      .where(eq(settings.userId, userId))
      .execute();
    
    return NextResponse.json({
      message: "Contacts uploaded successfully",
      count: validatedContacts.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
