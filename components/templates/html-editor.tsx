"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { Save, Code, Eye, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface HtmlEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  adding: boolean;
}

const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{title}}</h1>
    </div>
    <div class="content">
      {{content}}
    </div>
    <div class="footer">
      <p>© 2024 EazyEmailer. All rights reserved.</p>
      <p>{{unsubscribe_link}}</p>
    </div>
  </div>
</body>
</html>`;

export function HtmlEditor({ initialContent = defaultTemplate, onSave, adding }: HtmlEditorProps) {
  const [content, setContent] = useState(initialContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/html") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContent(content);
        toast({
          title: "Success",
          description: "HTML file uploaded successfully",
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Error",
        description: "Please upload an HTML file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">HTML Editor</h2>
          <p className="text-sm text-muted-foreground">
            Edit your HTML template or upload a file
          </p>
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".html"
            onChange={handleFileUpload}
          />
          {/* <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button> */}
          <Button onClick={() => onSave(content)}>
            <Save className="mr-2 h-4 w-4" />
            {adding ? 'Saving changes' :'Save Changes'}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40}>
          <div className="h-full">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={content}
              onChange={(value) => setContent(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div className="h-full bg-white">
            <iframe
              title="Template Preview"
              srcDoc={content}
              className="w-full h-full"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}