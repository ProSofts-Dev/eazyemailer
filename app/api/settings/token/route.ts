// pages/api/verify-email.js

import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { generateApiToken } from '@/lib/utils/token';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
    try {
        const session = await getSession();

        let token = await generateApiToken(session?.user?.id);
        console.log('token', token);
        const updatedSettings = await db
            .update(settings)
            .set({
                apiToken: token,
                updatedAt: new Date(),
            })
            .where(eq(settings.userId, session?.user?.id))
            .returning();

        return NextResponse.json(updatedSettings[0]);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to generate token.', message: error.message },
            { status: 500 }
        );
    }
}
