// pages/api/verify-email.js

import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { generateApiToken } from '@/lib/utils/token';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const session = await getSession();
        
        // Configure AWS SES
        const AWS = require('aws-sdk');
        const ses = new AWS.SES({ region: 'us-east-1' }); // Update region as needed

        const params = {
            Destination: {
                ToAddresses: ['hello@eazyemailer.app']
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Upgrade Request\n\nA user has requested an upgrade.\nUser Email: ${session?.user?.email}`
                    }
                },
                Subject: {
                    Data: 'New Upgrade Request'
                }
            },
            Source: process.env.SES_FROM_EMAIL // Make sure this is verified in SES
        };

        await ses.sendEmail(params).promise();

        return NextResponse.json({ 
            status: 'Success',
            message: 'Upgrade request sent successfully'
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to send upgrade request', message: error.message },
            { status: 500 }
        );
    }
}
