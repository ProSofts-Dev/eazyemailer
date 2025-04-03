"use client";

import { Card } from "@/components/ui/card";

interface ReportMetricsProps {
  openRate: string;
  clickRate: string;
}

export function ReportMetrics({ openRate, clickRate }: ReportMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground">Open Rate</h4>
        <p className="text-2xl font-bold">{openRate}</p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground">Click Rate</h4>
        <p className="text-2xl font-bold">{clickRate}</p>
      </Card>
    </div>
  );
}