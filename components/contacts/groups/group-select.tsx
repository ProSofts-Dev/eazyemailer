"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
}

interface GroupSelectProps {
  groups: Group[];
  value: string;
  onChange: (value: string) => void;
  onCreateNew: () => void;
}

export function GroupSelect({ groups, value, onChange, onCreateNew }: GroupSelectProps) {
  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select a group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              <div>
                <div className="font-medium">{group.name}</div>
                <div className="text-xs text-muted-foreground">
                  {group.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={onCreateNew}>
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}