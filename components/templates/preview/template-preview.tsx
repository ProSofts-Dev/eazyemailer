"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface TemplatePreviewProps {
  template: {
    id: number;
    name: string;
    description: string;
    content: string;
  };
  onSave?: (content: string) => void;
  readOnly?: boolean;
  adding?: boolean;
}

export function TemplatePreview({ template, onSave, readOnly = false, adding }: TemplatePreviewProps) {
  const [content, setContent] = useState(template.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave?.(content);
  };

  const handleContentChange = (value: string | undefined) => {
    setContent(value || "");
    if (!isEditing) setIsEditing(true);
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
        {!readOnly && onSave && isEditing && (
          <Button onClick={handleSave} variant="default">
            <Save className="mr-2 h-4 w-4" />
            {adding ? 'Saving Changes' : 'Save Changes'}
          </Button>
        )}
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40}>
          <div className="h-full">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={content}
              onChange={handleContentChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                readOnly,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <iframe
            title="Template Preview"
            srcDoc={content}
            className="w-full h-full bg-white"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}