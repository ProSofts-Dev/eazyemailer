"use client";

import { Users, Link as LinkIcon, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MOCK_STATS = {
  totalReferrals: 245,
  monthlyGoal: 300,
  activeLinks: 12,
};

export function ReferralStats() {
  const progressPercentage = (MOCK_STATS.totalReferrals / MOCK_STATS.monthlyGoal) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Referrals</span>
          </div>
          <p className="text-2xl font-bold">{MOCK_STATS.totalReferrals}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active Links</span>
          </div>
          <p className="text-2xl font-bold">{MOCK_STATS.activeLinks}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monthly Goal Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
}