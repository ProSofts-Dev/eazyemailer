"use client";

import { Card } from "@/components/ui/card";
import { Users, Clock, FileText } from "lucide-react";
import { SendOptions } from "./send-options";
import { ViewReport } from "./view-report";
import { formatDate } from "@/lib/utils";

interface Campaign {
  id: number;
  name: string;
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold truncate">{campaign.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            campaign.status === "Active"
              ? "bg-green-500/20 text-green-500"
              : campaign.status === "Draft"
              ? "bg-secondary text-foreground"
              : "bg-blue-500/20 text-blue-500"
          }`}
        >
          {campaign.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <span className="truncate">
            {campaign.recipients} ({campaign.recipientCount.toLocaleString()} recipients)
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {campaign.scheduledDate 
            ? `Scheduled: ${formatDate(campaign.scheduledDate)}`
            : campaign.sentDate === "-" 
              ? "Not sent yet" 
              : `Sent: ${campaign.sentDate}`}
        </div>
      </div>
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