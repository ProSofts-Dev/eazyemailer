// pages/api/send-email.js

import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { campaigns, contacts, settings, templates } from '@/lib/db/schema';
import AWS from 'aws-sdk';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const ses = new AWS.SESV2({ region: process.env.AWS_REGION });

async function sendBatchEmails(batch: any, Body: any, Subject: any, Source: any, campaignId: any, userId: any, name: any, replyTo: any = '', unsubscribe = '<https://eazyemailer.com>, <mailto: hello@eazyemailer.com?subject=TopicUnsubscribe>') {
    try {
        ses.sendEmail({
            Destination: { ToAddresses: batch },
            Content: {
                Simple: {
                    Body: Body,
                    Subject: { Data: Subject },
                    Headers: [ 
                        { 
                           "Name": "List-Unsubscribe",
                           "Value": unsubscribe
                        },
                        {
                          "Name": "List-Unsubscribe-Post",
                          "Value": "List-Unsubscribe=One-Click"            
                        }
                     ],
                }
            },
            ReplyToAddresses: [Source],
            EmailTags: [{ Name: 'campaignId', Value: campaignId + "", }, { Name: 'userId', Value: userId + '' }],
            FromEmailAddress: `${name} <${Source}>`,
            ConfigurationSetName: 'my-first-configuration-set',             // Add your configuration set name here
        }, (err, data) => {
            console.log(err, 'sending');
        });
    } catch(e) {
        console.log(e);
    }
}
  
async function sendEmailsInBatches(emails: any, Body: any, Subject: any, Source: any, campaignId: any, userId: any, name: any) {
    const batchSize = 1; // Number of emails per batch
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      try {
        await sendBatchEmails(batch, Body, Subject, Source, campaignId, userId, name, Source);
      } catch (error) {
        console.error('Error sending batch:', error);
      }
    }
}

export async function POST(req: any) {
    try {
        const { campaignId } = await req.json();
        const session = await getSession();

        if (!campaignId) {
            return NextResponse.json(
                { error: 'Campaign id is required.' },
                { status: 400 }
            );
        }

        // Configure AWS SES
        const campaign = await db.select()
                        .from(campaigns)
                        .where(eq(campaigns.id, campaignId))
                        .execute();

        if(!campaign[0])
            return NextResponse.json(
                { error: 'Campaign not found.' },
                { status: 404 }
            );

        let Body: any = {};

        if(campaign[0].isHtml && campaign[0].templateId) {
            const template = await db.select().from(templates).where(eq(templates.id, campaign[0].templateId)).execute();
            Body.Html = {};
            Body.Html.Data = template[0].content;
        } else {
            Body.Text = {};
            Body.Text.Data = campaign[0].content;
        }   

        let recipients: any[] = [];

    
        const setting = await db.select().from(settings).where(eq(settings.userId, session?.user?.id)).execute();
        if (campaign[0]?.recipientGroup === 'all') {
            // If 'all', fetch all contact emails
            recipients = await db
              .select({ email: contacts.email })
              .from(contacts)
              .where(eq(contacts.userId, session?.user?.id))
              .execute();
        } else {
            // Otherwise, filter by the specific group
            if(campaign[0]?.recipientGroup) recipients = await db.select({ email: contacts.email })
              .from(contacts)
              .where(and(eq(contacts.userId, session?.user?.id), eq(contacts.group, campaign[0]?.recipientGroup)))
              .execute();
        }

        recipients = recipients.map(r => r.email);
        let daily_limit = setting[0].dailyLimit || 0;

        if (recipients.length > daily_limit - setting[0].dailyLimitUsed) {
            return NextResponse.json(
                { error: `Cannot send to ${recipients.length} recipients. Remaining Daily limit is ${daily_limit - setting[0].dailyLimitUsed}` },
                { status: 400 }
            );
        }

        const data = await ses.getEmailIdentity({ EmailIdentity: setting[0].senderEmail }).promise();

        const attributes = data;

        if (attributes)
            if(attributes.VerificationStatus !== 'SUCCESS') 
                return NextResponse.json(
                    { error: 'Failed to send email. Sender email not verified. Verify from settings page.' },
                    { status: 500 }
                );


        await db
            .update(campaigns)
            .set({ status: 'Active', sentAt: new Date() })
            .where(eq(campaigns.id, campaignId))
            .execute();

        await sendEmailsInBatches(recipients, Body, campaign[0].subject, setting[0].senderEmail, campaignId, session?.user?.id, setting[0]?.senderName);
        
        await db
            .update(settings)
            .set({ dailyLimitUsed: setting[0].dailyLimitUsed + recipients.length })
            .where(eq(settings.userId, session?.user?.id))
            .execute();

        return NextResponse.json({
            message: 'Campaign is now active. All emails are being sent. Click View report for details.'
        });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email.', details: error.message },
            { status: 500 }
        );
    }
}
