"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { CampaignForm } from "./campaign-form";

interface CreateCampaignProps {
  onCreateCampaign: (campaign: any) => void;
}

export function CreateCampaign({ onCreateCampaign }: CreateCampaignProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <CampaignForm onSubmit={onCreateCampaign} />
      </DialogContent>
    </Dialog>
  );
}