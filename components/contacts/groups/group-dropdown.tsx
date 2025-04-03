"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  description: string;
}

interface GroupDropdownProps {
  groups: Group[];
  selectedGroup: string;
  onSelect: (groupId: string) => void;
  onCreateNew: () => void;
}

export function GroupDropdown({ groups, selectedGroup, onSelect, onCreateNew }: GroupDropdownProps) {
  const selected = groups.find(g => g.id === selectedGroup);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {selected?.name || "Select group"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {groups.map((group) => (
          <DropdownMenuItem
            key={group.id}
            onClick={() => onSelect(group.id)}
            className="justify-between"
          >
            <div>
              <span>{group.name}</span>
              <p className="text-xs text-muted-foreground">{group.description}</p>
            </div>
            {group.id === selectedGroup && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateNew}>
          <span className="text-primary">Create new group</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}