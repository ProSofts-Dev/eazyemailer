"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs",
        status === "Active" && "bg-green-500/20 text-green-500",
        status === "Draft" && "bg-secondary text-foreground",
        status === "Scheduled" && "bg-blue-500/20 text-blue-500"
      )}
    >
      {status}
    </span>
  );
}