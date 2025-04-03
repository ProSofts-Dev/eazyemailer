import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, contacts } from '@/lib/db/schema';
import { and, avgDistinct, eq, lt } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        const totalContacts = await db.$count(contacts, and(eq(contacts.userId, session?.user?.id)));
        const totalCampaigns = await db.$count(campaigns, and(eq(campaigns.status, 'Active'), eq(campaigns.userId, session?.user?.id)));
        let avgOpenRate: any = await db.select({ value: avgDistinct(campaigns.openRate) }).from(campaigns).where(eq(campaigns.userId, session?.user?.id));

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const oldTotalContacts = await db.$count(contacts, and(lt(contacts.createdAt, lastWeek), eq(contacts.userId, session?.user?.id)));
        const oldCampaigns =  await db.$count(campaigns, and(lt(campaigns.sentAt, lastWeek), eq(campaigns.userId, session?.user?.id)));
        let oldAvgOpenRate: any = await db.select({ value: avgDistinct(campaigns.openRate) }).from(campaigns).where(and(lt(campaigns.sentAt, lastWeek), eq(campaigns.userId, session?.user?.id)));

        avgOpenRate = parseFloat(avgOpenRate[0]?.value) || 0;
        oldAvgOpenRate = parseFloat(avgOpenRate[0]?.value) || 0;

        return NextResponse.json({
            stats: [
                {
                    name: "Total Contacts",
                    value: totalContacts.toLocaleString(),
                    change: totalContacts > 0 ? `${((Math.abs(totalContacts - oldTotalContacts) / totalContacts) * 100).toFixed(1)} %` : '0 %',
                    trend: oldTotalContacts > totalContacts ? "down" : "up",
                    icon: 'Users',
                },
                {
                    name: "Campaigns Sent",
                    value: totalCampaigns.toLocaleString(),
                    change: totalCampaigns > 0 ? `${(((Math.abs(totalCampaigns - oldCampaigns)) / totalCampaigns) * 100).toFixed(1)} %` : '0 %',
                    trend: oldCampaigns > totalCampaigns ? "down" : "up",
                    icon: 'Mail',
                },
                {
                    name: "Open Rate",
                    value: `${avgOpenRate?.toFixed(1)} %`,
                    change: avgOpenRate > 0 ? `${(((Math.abs(avgOpenRate - oldAvgOpenRate)) / avgOpenRate) * 100).toFixed(1)} %` : "0 %",
                    trend: avgOpenRate > oldAvgOpenRate ? "up" : "down",
                    icon: "BarChart",
                },
            ],
        });
    } catch (error) {
        console.error("Error fetching counts:", error);
        return NextResponse.json(
            { error: "Failed to fetch counts" },
            { status: 500 }
        );
    }
}
