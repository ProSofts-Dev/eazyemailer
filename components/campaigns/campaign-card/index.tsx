"use client";

import { Card } from "@/components/ui/card";
import { SendOptions } from "../send-options";
import { ViewReport } from "../view-report";
import { StatusBadge } from "./status-badge";
import { CampaignInfo } from "./campaign-info";

interface Campaign {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  recipients: string;
  sentDate: string;
  scheduledDate: string | null;
  recipientCount: number;
  openRate: string;
  clickRate: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onSend: (id: number, scheduledDate?: Date) => void;
  onViewReport: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onSend, onViewReport }: CampaignCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold truncate">{campaign.name}</h3>
        <StatusBadge status={campaign.status} />
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
      
      <div className="mb-4">
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
          {campaign.type}
        </span>
      </div>

      <CampaignInfo
        recipients={campaign.recipients}
        recipientCount={campaign.recipientCount}
        scheduledDate={campaign.scheduledDate}
        sentDate={campaign.sentDate}
      />

      <div className="mt-4">
        {campaign.status === "Draft" ? (
          <SendOptions onSend={(date) => onSend(campaign.id, date)} />
        ) : (
          <ViewReport campaign={campaign} onView={() => onViewReport(campaign)} />
        )}
      </div>
    </Card>
  );
}