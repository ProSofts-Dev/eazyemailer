"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { TemplateForm } from "./template-form";
import { HtmlEditor } from "@/components/templates/html-editor";

interface CreateTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adding: boolean;
  onCreateTemplate: (template: any) => void;
}

export function CreateTemplate({ open, onOpenChange, onCreateTemplate, adding}: CreateTemplateProps) {
  const [step, setStep] = useState<"form" | "editor">("form");
  const [templateData, setTemplateData] = useState<any>(null);

  const handleFormSubmit = (data: any) => {
    setTemplateData(data);
    setStep("editor");
  };

  const handleEditorSave = (content: string) => {
    onCreateTemplate({
      ...templateData,
      content,
    });
    setStep("form");
    setTemplateData(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep("form");
      setTemplateData(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className={step === 'form' ? "max-w-3xl" : "max-w-7xl"}>
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        {step === "form" ? (
          <TemplateForm onSubmit={handleFormSubmit} />
        ) : (
          <div className="h-[85vh]">
            <HtmlEditor onSave={handleEditorSave} adding={adding} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}