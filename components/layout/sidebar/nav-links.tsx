"use client";

import { usePathname } from "next/navigation";
import { BarChart, Mail, Users, Settings, FileText, Workflow } from "lucide-react";
import { NavItem } from "./nav-item";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart, tag: false, id: 'dashboard' },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tag: false, id: 'campaigns' },
  { name: "Templates", href: "/dashboard/templates", icon: FileText, tag: false, id: 'templates' },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users, tag: false, id: "contacts" },
  { name: "Workflows", href: "/dashboard/workflows", icon: Workflow, tag: false, id: "workflows" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, tag: false, id: 'settings' },
];

interface NavLinksProps {
  collapsed: boolean;
}

export function NavLinks({ collapsed }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {navigation.map((item) => (
          <NavItem
            href={item.href}
            icon={item.icon}
            label={item.name}
            isActive={pathname === item.href}
            collapsed={collapsed}
            key={item.name}
            id={item.id}
            tag={item.tag}
          />
          ))}
    </nav>
  );
}