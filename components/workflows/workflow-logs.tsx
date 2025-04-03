"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface WorkflowLogsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: any;
}

const SAMPLE_LOGS = [
  {
    id: 1,
    status: "success",
    eventData: { userId: "123", email: "user@example.com" },
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: 2,
    status: "error",
    eventData: { userId: "124", email: "user2@example.com" },
    error: "Email delivery failed",
    createdAt: "2024-03-20T10:05:00Z",
  },
];

export function WorkflowLogs({ open, onOpenChange, workflow }: WorkflowLogsProps) {
  if (!workflow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Workflow Logs: {workflow.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Event Data</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SAMPLE_LOGS.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={log.status === "success" ? "default" : "destructive"}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                      {JSON.stringify(log.eventData, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell className="text-destructive">
                    {log.error || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}