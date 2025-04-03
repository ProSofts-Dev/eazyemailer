"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/user-nav";
import { SidebarHeader } from "./sidebar-header";
import { NavLinks } from "./nav-links";
import { CollapseButton } from "./collapse-button";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative flex h-[calc(100vh-48px)] flex-col bg-card border border-border rounded-lg transition-all duration-300 shadow-2xl",
      collapsed ? "w-20" : "w-72"
    )}>
      <CollapseButton 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
      />
      <SidebarHeader collapsed={collapsed} />
      <NavLinks collapsed={collapsed} />
      <div className="p-3 border-t border-border">
        <UserNav collapsed={collapsed} />
      </div>
    </div>
  );
}