"use client";

interface ReportDetailsProps {
  recipients: string;
  sentDate: string;
  recipientCount: number;
}

export function ReportDetails({ recipients, sentDate, recipientCount }: ReportDetailsProps) {
  return (
    <div>
      <h4 className="font-medium mb-2">Campaign Details</h4>
      <div className="space-y-2 text-sm">
        <p>Recipients: {recipients}</p>
        <p>Sent Date: {sentDate}</p>
        <p>Total Recipients: {recipientCount.toLocaleString()}</p>
      </div>
    </div>
  );
}