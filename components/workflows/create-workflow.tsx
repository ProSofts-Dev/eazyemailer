"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENTS = [
  { id: "user.created", name: "User Created", description: "Triggered when a new user signs up" },
  { id: "user.subscribed", name: "User Subscribed", description: "Triggered when user subscribes" },
];

interface CreateWorkflowProps {
  open: boolean;
  emailTemplates: any;
  onOpenChange: (open: boolean) => void;
  onSubmit: (workflow: any) => void;
}

const contactGroups = [
  {
    id: "all",
    name: "All Contacts",
    description: "Send to all contacts",
  },
  {
    id: "customer",
    name: "Customers",
    description: "Active paying customers",
  },
  {
    id: "prospect",
    name: "Prospects",
    description: "Potential customers in the pipeline",
  },
  {
    id: "partner",
    name: "Partners",
    description: "Send to all your partners",
  },
  {
    id: "fan",
    name: "Fans",
    description: "Send to all fans",
  },
  {
    id: "artist",
    name: "Artists",
    description: "Send to all artists",
  },
  {
    id: "community",
    name: "Community",
    description: "Send to all your community members",
  },
];

export function CreateWorkflow({ open, onOpenChange, onSubmit, emailTemplates }: CreateWorkflowProps) {
  const [formData, setFormData] = useState({
    name: "", subject: "", templateId: -1, status: '', trigger: '', filter: '',
  });

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      status: 'Started',
      createdAt: new Date().toISOString(),
    });
    setFormData({ name: "", subject: "", trigger: "", templateId: -1, status: "", filter: ''  });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Welcome Email"
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Add a subject line for the email"
            />
          </div>
          <div>
            <Label htmlFor="trigger">Trigger Event</Label>
            <Select
              value={formData.trigger}
              onValueChange={(value) => setFormData({ ...formData, trigger: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger event" />
              </SelectTrigger>
              <SelectContent>
                {EVENTS.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter">User Filter</Label>
            <Select
              value={formData.filter}
              onValueChange={(value) =>
                setFormData({ ...formData, filter: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose user filter by" />
              </SelectTrigger>
              <SelectContent>
                {contactGroups.map((group) => (
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
          </div>
          <div>
            <Label htmlFor="template">Email Template</Label>
            <Select
              value={formData.templateId + ""}
              onValueChange={(value) => setFormData({ ...formData, templateId: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template: any) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}