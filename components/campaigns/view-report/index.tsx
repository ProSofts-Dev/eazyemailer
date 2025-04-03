"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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

interface ViewReportProps {
  campaign: Campaign;
  onView: () => void;
}

export function ViewReport({ campaign, onView }: ViewReportProps) {
  return (
    <Button 
      variant="secondary" 
      className="w-full"
      onClick={onView}
    >
      <FileText className="h-4 w-4 mr-2" />
      View Report
    </Button>
  );
}