"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CreateTemplate } from "@/components/templates/create-template";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Code, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TemplatePreview } from "@/components/templates/preview/template-preview";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: string;
}

export default function Templates() {
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const [adding, setAdding] = useState(false);

  const handleSaveTemplate = async (content: string) => {
    if (!previewTemplate || adding) return;
    
    if (!content) {
      toast({
        title: "Error",
        description: "Please fill the content",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    fetch(`/api/templates?id=${previewTemplate?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: previewTemplate?.id, content }),
    });

    toast({
      title: "Success",
      description: "Template updated successfully",
    });
   
    if(page !== 1) setPage(1);
    else fetchTemplats(page);

    setAdding(false);

    setPreviewTemplate(null);
    setIsCreateOpen(false);
  };

  const [templates, setTemplates] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleCreateTemplate = async (template: any) => {
    if (!template || adding) return;
    
    if (!template.name || !template.description || !template.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...template }),
    });
    
    toast({
      title: "Success",
      description: "Template created successfully",
    });
   
    if(page !== 1) setPage(1);
    else fetchTemplats(page);

    setAdding(false);

    setPreviewTemplate(null);
    setIsCreateOpen(false);
  };

  const fetchTemplats = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/templates?page=${currentPage}&limit=9`);
      const data = await response.json();

      setTemplates(data.templates);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplats(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-2">
            Manage and create email templates
          </p>
        </div>        
          <CreateTemplate 
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            adding={adding}
            onCreateTemplate={handleCreateTemplate} 
          />
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
              [...Array(3 )].map((_, index) => (
                <Card key={index} className="overflow-hidden group">
                  <div className="relative aspect-video bg-muted">
                    <Skeleton
                      className="object-cover transition-transform h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                  </div>
                  <div className="p-4">
                    <Skeleton className="font-semibold" style={{ width: 150, height: 15 }} />
                    <Skeleton className="text-sm text-muted-foreground mt-2" style={{ width: 200, height: 15 }} />
                    <div className="mt-2">
                      <Skeleton className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full" style={{ width: 50, height: 15 }} />
                    </div>
                  </div>
                </Card>
              ))
            ) : templates.length > 0 ? (
              templates.map((template) => (
                <Card key={template.id} className="overflow-hidden group">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={'template_ph.png'}
                      alt={template.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        {/* <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(template)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button> */}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full capitalize">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </Card>
              ))) : (
                  <></>
          )}
        </div>
        {templates.length > 0 ? <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <p>
              Page {page} of {totalPages}
            </p>
            <Button
              onClick={handleNextPage}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div> : <></>}

        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-7xl">
            <DialogHeader>
              <DialogTitle>Template Preview</DialogTitle>
            </DialogHeader>
            {previewTemplate && (
              <TemplatePreview 
                template={previewTemplate}
                readOnly={false}
                adding={adding}
                onSave={handleSaveTemplate}
              />
            )}
          </DialogContent>
        </Dialog>
        {templates.length === 0 && !loading ?
            <div className="h-[200px] flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Code className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No templates found</h3>
                <p className="text-sm text-muted-foreground">
                Create an HTML template to get started.
                </p>
              </div>
           </div>
           : <></>}
      </Card>
      
    </div>
  );
}