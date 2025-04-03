"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapseButtonProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CollapseButton({ collapsed, onToggle }: CollapseButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-background shadow-2xl"
      onClick={onToggle}
    >
      {collapsed ? (
        <ChevronRight className="h-3 w-3" />
      ) : (
        <ChevronLeft className="h-3 w-3" />
      )}
    </Button>
  );
}