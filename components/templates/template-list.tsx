"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import Image from "next/image";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
}

interface TemplateListProps {
  templates: Template[];
  selectedId: number | null;
  onSelect: (template: Template) => void;
  onDuplicate: (template: Template) => void;
}

export function TemplateList({
  templates,
  selectedId,
  onSelect,
  onDuplicate,
}: TemplateListProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group p-4 rounded-lg cursor-pointer transition-colors ${
              selectedId === template.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            onClick={() => onSelect(template)}
          >
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={selectedId === template.id}
                  unoptimized={template.thumbnail.startsWith('data:')}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className={`text-sm ${selectedId === template.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {template.category}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={selectedId === template.id ? 'hover:bg-primary-foreground/20' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(template);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}