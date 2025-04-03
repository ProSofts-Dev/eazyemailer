import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { settings, templates, workflows } from "../db/schema";
import AWS from 'aws-sdk';

let variables: Record<string, any> = {
    '{{email}}': 'email',
    '{{name}}': 'name',
    '{{community_link}}': 'link',
}

export async function triggerWorkflow(trigger: string, userId: string, payload: any) {
    const ses = new AWS.SESV2({ region: process.env.AWS_REGION });
    const setting = await db.select().from(settings).where(eq(settings.userId, userId)).execute();

    const data = await ses.getEmailIdentity({ EmailIdentity: setting[0].senderEmail }).promise();

    const attributes = data;
    if (attributes)
        if(attributes.VerificationStatus !== 'SUCCESS') 
            return 'Email not verified';

    const flows = await db
                .select()
                .from(workflows)
                .where(and(eq(workflows.userId, userId), eq(workflows.trigger, trigger)))
                .orderBy(desc(workflows.createdAt))
                .execute();

    for (const flow of flows) {
        if (flow.status !== 'Started')  continue;
        if(flow.filter !== payload.group) continue;
        
        try {
            const Body: any = {};
            const template = await db.select().from(templates).where(eq(templates.id, flow.templateId!)).execute();

            let content = template[0].content;

            Object.keys(variables).forEach(key => {
                if(payload[variables[key]]) content = content.replaceAll(key, payload[variables[key]])
            });

            Body.Html = { Data: content };

            let daily_limit = setting[0].dailyLimit || 0;

            if (daily_limit - setting[0].dailyLimitUsed <= 0) {
                console.error('Daily limit reached');
                return 'Daily limit reached';
            }

            await ses.sendEmail({
                Destination: { ToAddresses: [payload.email] },
                Content: {
                    Simple: {
                        Body: Body,
                        Subject: { Data: flow.subject },
                        Headers: [ 
                            { 
                               "Name": "List-Unsubscribe",
                               "Value": `<mailto: ${setting[0].senderEmail}?subject=TopicUnsubscribe>`
                            },
                            {
                              "Name": "List-Unsubscribe-Post",
                              "Value": "List-Unsubscribe=One-Click"            
                            }
                         ],
                    }
                },
                ReplyToAddresses: [setting[0].senderEmail],
                EmailTags: [
                    { Name: 'workflowId', Value: flow.id + '' },
                    { Name: 'userId', Value: userId }
                ],
                FromEmailAddress: `${setting[0].senderName} <${setting[0].senderEmail}>`,
                ConfigurationSetName: 'my-first-configuration-set',
            }).promise();
            console.log('semd', 'limit');

            await db
                .update(settings)
                .set({ dailyLimitUsed: setting[0].dailyLimitUsed + 1 })
                .where(eq(settings.userId, userId))
                .execute();
        } catch (error) {
            console.error('Error sending workflow email:', error);
        }
    }
    return 'Triggered Successfully';
}