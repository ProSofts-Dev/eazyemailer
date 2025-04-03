"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const TEMPLATE_TYPES = [
  { id: "marketing", name: "Marketing", description: "Promotional and sales templates" },
  { id: "transactional", name: "Transactional", description: "Order confirmations, notifications" },
  { id: "newsletter", name: "Newsletter", description: "Regular updates and content" },
  { id: "onboarding", name: "Onboarding", description: "Welcome and user activation" },
];

interface TemplateFormProps {
  onSubmit: (template: any) => void;
}

export function TemplateForm({ onSubmit }: TemplateFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name*</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Welcome Email Template"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the template"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="type">Template Type*</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select template type" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div>
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit}>Continue</Button>
      </DialogFooter>
    </div>
  );
}