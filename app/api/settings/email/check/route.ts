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

        const ses = new AWS.SESV2({ region: process.env.AWS_REGION });

        const data = await ses.getEmailIdentity({ EmailIdentity: userSettings[0].senderEmail }).promise();

        const attributes = data;

        if (attributes) {
            console.log(attributes.VerificationStatus, 'ver');
            if(attributes.VerificationStatus === 'SUCCESS') {
                await db
                .update(settings)
                .set({
                  ...userSettings[0],
                  senderEmailVerified: true,
                  updatedAt: new Date(),
                })
                .where(eq(settings.id, userSettings[0].id)).execute();
            }

            return NextResponse.json({
                status: attributes.VerificationStatus, // "Pending", "Success", etc.
            });
        } else {
            return NextResponse.json(
                { error: `Email is not verified for sending emails.` },
                { status: 404 }
            );
        }
    } catch (error: any) {
        console.error('Error checking email verification:', error);
        return NextResponse.json(
            { error: 'Failed to check email verification status.', details: error?.message },
            { status: 500 }
        );
    }
}
