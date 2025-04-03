"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  id: string;
  collapsed: boolean;
  tag?: boolean;
}

export function NavItem({ href, icon: Icon, label, isActive, collapsed, id, tag }: NavItemProps) {
  return (
    <Link
      href={href}
      id={id}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        collapsed && "justify-center"
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
      {!collapsed && (
        <span className="flex items-center justify-between w-full">
          <span>{label}</span>
          {tag && (
            <span className="ml-2 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded px-2 py-0.5">
              Coming Soon
            </span>
          )}
        </span>
      )}
    </Link>
  );
}