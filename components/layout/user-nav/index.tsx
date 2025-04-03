"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { UserInfo } from "./user-info";
import { signOut, useSession } from "next-auth/react";

interface UserNavProps {
  collapsed?: boolean;
}

export function UserNav({ collapsed }: UserNavProps) {
  const { data: session, status } = useSession()

  const user = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    image: session?.user?.image || '',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(
          "w-full p-2 h-auto hover:bg-secondary",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <UserAvatar name={user.name} image={user.image} />
          {!collapsed && <UserInfo name={user.name} email={user.email} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <UserInfo name={user.name} email={user.email} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async() => {
          await signOut({ callbackUrl: '/login' });
          localStorage.clear();
        }}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}