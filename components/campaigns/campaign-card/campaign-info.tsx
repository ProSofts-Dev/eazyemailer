"use client";

import { Users, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CampaignInfoProps {
  recipients: string;
  recipientCount: number;
  scheduledDate: string | null;
  sentDate: string;
}

export function CampaignInfo({ recipients, recipientCount, scheduledDate, sentDate }: CampaignInfoProps) {
  return (
    <div className="space-y-2 text-sm text-muted-foreground mb-4">
      <div className="flex items-center">
        <Users className="h-4 w-4 mr-2" />
        <span className="truncate">
          {recipients} ({recipientCount.toLocaleString()} recipients)
        </span>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        {scheduledDate 
          ? `Scheduled: ${formatDate(scheduledDate)}`
          : sentDate === "-" 
            ? "Not sent yet" 
            : `Sent: ${sentDate}`}
      </div>
    </div>
  );
}