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

const CAMPAIGN_TYPES = [
  { id: "promotional", name: "Promotional", description: "Marketing and sales campaigns" },
  { id: "transactional", name: "Transactional", description: "Order confirmations, receipts" },
  { id: "newsletter", name: "Newsletter", description: "Regular updates and content" },
  { id: "onboarding", name: "Onboarding", description: "Welcome and user activation" },
];

interface CampaignFormProps {
  onSubmit: (campaign: any) => void;
}

export function CampaignForm({ onSubmit }: CampaignFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    subject: "",
    content: "",
    recipients: "",
    templateId: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.type || !formData.subject) {
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
        <Label htmlFor="name">Campaign Name*</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Spring Sale Announcement"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the campaign"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="type">Campaign Type*</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select campaign type" />
          </SelectTrigger>
          <SelectContent>
            {CAMPAIGN_TYPES.map((type) => (
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

      <div>
        <Label htmlFor="subject">Email Subject*</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Enter email subject line"
        />
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit}>Create Campaign</Button>
      </DialogFooter>
    </div>
  );
}