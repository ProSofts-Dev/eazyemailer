"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";
import { Save, Code, Eye } from "lucide-react";
import { useState } from "react";

interface TemplateEditorProps {
  template: {
    name: string;
    description: string;
    content: string;
  };
  mode: "html" | "content";
  onSave: (content: string) => void;
  adding: boolean;
}

export function TemplateEditor({ template, mode, onSave, adding }: TemplateEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [content, setContent] = useState(template.content);

  return (
    <Card className="h-[800px]">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>
        <div className="flex space-x-2">
          {mode === "html" && (
            <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          )}
          <Button onClick={() => onSave(content)}>
            <Save className="mr-2 h-4 w-4" />
            {adding ? 'Saving changes' :'Save Changes'}
          </Button>
        </div>
      </div>
      <div className="h-[calc(800px-73px)]">
        {mode === "html" && previewMode ? (
          <iframe
            title="Template Preview"
            srcDoc={content}
            className="w-full h-full bg-white"
          />
        ) : mode === "html" ? (
          <Editor
            height="100%"
            defaultLanguage="html"
            value={content}
            onChange={(value) => setContent(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
            }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 resize-none font-mono bg-background border-0 focus:outline-none"
            placeholder="Enter your template content here..."
          />
        )}
      </div>
    </Card>
  );
}