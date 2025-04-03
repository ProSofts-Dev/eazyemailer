"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Calendar as CalendarIcon } from "lucide-react";

interface SendDropdownProps {
  onSendNow: () => void;
  onSchedule: () => void;
}

export function SendDropdown({ onSendNow, onSchedule }: SendDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Send Campaign
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onSendNow}>
          <Mail className="mr-2 h-4 w-4" />
          Send Now
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSchedule}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Schedule
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}