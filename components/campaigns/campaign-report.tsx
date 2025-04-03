"use client";

import { Card } from "@/components/ui/card";

interface Campaign {
  id: number;
  name: string;
  status: string;
  recipients: string;
  sentDate: string;
  recipientCount: number;
  openRate: string;
  clickRate: string;
}

interface CampaignReportProps {
  campaign: Campaign;
}

export function CampaignReport({ campaign }: CampaignReportProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Open Rate</h4>
          <p className="text-2xl font-bold">{campaign.openRate}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Click Rate</h4>
          <p className="text-2xl font-bold">{campaign.clickRate}</p>
        </Card>
      </div>
      <div>
        <h4 className="font-medium mb-2">Campaign Details</h4>
        <div className="space-y-2 text-sm">
          <p>Recipients: {campaign.recipients}</p>
          <p>Sent Date: {campaign.sentDate}</p>
          <p>Total Recipients: {campaign.recipientCount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}