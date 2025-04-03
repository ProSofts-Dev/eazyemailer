import { Code, FileText } from "lucide-react";

interface EmptyStateProps {
  mode: "html" | "content";
}

export function EmptyState({ mode }: EmptyStateProps) {
  return (
    <div className="h-[800px] flex items-center justify-center border-2 border-dashed rounded-lg">
      <div className="text-center">
        {mode === "html" ? (
          <Code className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        ) : (
          <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        )}
        <h3 className="text-lg font-medium">Select a template to edit</h3>
        <p className="text-sm text-muted-foreground">
          Choose a {mode === "html" ? "HTML" : "content"} template from the list to start editing
        </p>
      </div>
    </div>
  );
}