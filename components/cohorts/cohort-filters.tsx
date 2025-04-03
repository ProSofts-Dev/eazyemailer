"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface CohortFiltersProps {
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
}

const FILTER_TYPES: any = {
  status: {
    label: "Status",
    options: [
      { value: "subscribed", label: "Subscribed" },
      { value: "unsubscribed", label: "Unsubscribed" },
    ],
  },
  group: {
    label: "Group",
    options: [
      { value: "customers", label: "Customers" },
      { value: "prospects", label: "Prospects" },
      { value: "newsletter", label: "Newsletter" },
    ],
  },
  lastActivity: {
    label: "Last Activity",
    options: [
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
      { value: "90d", label: "Last 90 days" },
    ],
  },
  deliveryRate: {
    label: "Delivery Rate",
    options: [
      { value: "high", label: "High (>90%)" },
      { value: "medium", label: "Medium (60-90%)" },
      { value: "low", label: "Low (<60%)" },
    ],
  },
};

export function CohortFilters({ filters, onChange }: CohortFiltersProps) {
  const [selectedType, setSelectedType] = useState<string>("");

  const handleAddFilter = () => {
    if (!selectedType) return;
    onChange({
      ...filters,
      [selectedType]: "",
    });
    setSelectedType("");
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onChange(newFilters);
  };

  const handleFilterValueChange = (key: string, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add filter" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FILTER_TYPES).map(([key, { label }]: any) => (
              <SelectItem key={key} value={key} disabled={key in filters}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddFilter}
          disabled={!selectedType}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {Object.entries(filters).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm font-medium w-24">
                {FILTER_TYPES[key]?.label}:
              </span>
              <Select
                value={value}
                onValueChange={(newValue) => handleFilterValueChange(key, newValue)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_TYPES[key]?.options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveFilter(key)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}