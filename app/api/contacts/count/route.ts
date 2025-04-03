import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        const subscriberCount = await db.$count(contacts, and(eq(contacts.status, 'Subscribed'), eq(contacts.userId, session?.user?.id)));
        const unsubscriberCount = await db.$count(contacts, and(eq(contacts.status, 'Unsubscribed'), eq(contacts.userId, session?.user?.id)));

        return NextResponse.json({
            subscriberCount,
            unsubscriberCount,
        });
    } catch (error) {
        console.error("Error fetching counts:", error);
        return NextResponse.json(
            { error: "Failed to fetch contact counts" },
            { status: 500 }
        );
    }
}
