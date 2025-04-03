import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, contacts, templates } from '@/lib/db/schema';
import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
    try {
        const session = await getSession();

        const campaignsList = await db
        .select()
        .from(campaigns)
        .where(and(eq(campaigns.userId, session?.user?.id), eq(campaigns.status, 'Active'), isNotNull(campaigns.sentAt)))
        .orderBy(desc(campaigns.sentAt))
        .limit(3)
        .offset(0).execute();

        const topTemplates = await db
            .select({
                templateId: campaigns.templateId,
                templateName: templates.name,
                averageOpenRate: sql`ROUND(AVG(${campaigns.openRate}), 1)`.as("average_open_rate"),
            })
            .from(campaigns)
            .innerJoin(templates, eq(templates.id, campaigns.templateId))
            .where(eq(campaigns.status, "Active")) // Filter for active campaigns
            .groupBy(campaigns.templateId, templates.name)
            .orderBy(desc(sql`average_open_rate`))
            .limit(3).execute();

        return NextResponse.json({
            campaigns: campaignsList,
            topEmails: topTemplates,
        });
    } catch (error) {
        console.error("Error fetching campaign data:", error);
        return NextResponse.json(
            { error: "Failed to fetch campaign data" },
            { status: 500 }
        );
    }
}
