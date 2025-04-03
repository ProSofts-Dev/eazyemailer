"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface ApiExamplesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiExamplesDialog({ open, onOpenChange }: ApiExamplesDialogProps) {
  const { toast } = useToast();
  const apiUrl = `https://app.eazyemailer.com/api/contacts`;

  const examples = {
    javascript: `fetch('${apiUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    group: 'Customers'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    python: `import requests

response = requests.post(
    '${apiUrl}',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
    },
    json={
        'name': 'John Doe',
        'email': 'john@example.com',
        'group': 'Customers'
    }
)

print(response.json())`,

    java: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

String json = """
    {
        "name": "John Doe",
        "email": "john@example.com",
        "group": "Customers"
    }
    """;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${apiUrl}"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer YOUR_API_TOKEN")
    .POST(HttpRequest.BodyPublishers.ofString(json))
    .build();

HttpResponse<String> response = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());

System.out.println(response.body());`
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code example copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>API Implementation Examples</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="javascript" className="mt-4">
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="java">Java</TabsTrigger>
          </TabsList>
          {Object.entries(examples).map(([lang, code]) => (
            <TabsContent key={lang} value={lang} className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(code)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                <code>{code}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}