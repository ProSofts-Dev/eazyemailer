"use client";

import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className={cn(
      "flex h-16 items-center px-6 border-b border-border",
      collapsed ? "justify-center" : "justify-between"
    )}>
      {!collapsed && (
        <h1 className="text-xl font-semibold">EazyEmailer</h1>
      )}
      {collapsed && (
        <Mail className="h-5 w-5" />
      )}
    </div>
  );
}