// pages/api/verify-email.js

import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import AWS from 'aws-sdk';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
    try {
        const session = await getSession();
        const userSettings = await db
        .select()
        .from(settings)
        .where(eq(settings.userId, session?.user?.id));

        if (!userSettings) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const ses = new AWS.SES({ region: process.env.AWS_REGION });

        await ses.sendCustomVerificationEmail({ EmailAddress: userSettings[0]?.senderEmail, TemplateName: 'EazyEmailer_Template' }).promise();

        return NextResponse.json({
            message: `Verification email sent to ${userSettings[0]?.senderEmail}. Please check your inbox.`,
        });
    } catch (error: any) {
        console.error('Error verifying email:', error);
        return NextResponse.json(
            { error: 'Failed to send verification email.', message: error.message },
            { status: 500 }
        );
    }
}
