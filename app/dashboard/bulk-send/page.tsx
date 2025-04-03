"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, Upload, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const emailTemplates = [
  { id: 1, name: "Welcome Email", content: "Welcome to our service..." },
  { id: 2, name: "Newsletter", content: "Here's your monthly update..." },
  { id: 3, name: "Product Launch", content: "Exciting new features..." },
];

export default function BulkSend() {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSend = () => {
    if (!emails || !subject || (!content && !selectedTemplate)) {
      return;
    }

    setSending(true);
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setSending(false);
      }
    }, 500);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id.toString() === templateId);
    if (template) {
      setContent(template.content);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Bulk Send</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses (one per line)"
                  rows={6}
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {emails.split("\n").filter(Boolean).length} email addresses
                </p>
              </div>

              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <Tabs defaultValue="template">
                <TabsList className="mb-4">
                  <TabsTrigger value="template">Use Template</TabsTrigger>
                  <TabsTrigger value="custom">Custom Email</TabsTrigger>
                </TabsList>

                <TabsContent value="template">
                  <div>
                    <Label htmlFor="template">Select Template</Label>
                    <Select
                      value={selectedTemplate}
                      onValueChange={handleTemplateChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="custom">
                  <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                      id="content"
                      rows={8}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setSelectedTemplate("");
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSend}
                disabled={sending}
                className="w-full"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Bulk Email
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Import Contacts</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Button variant="outline" className="mt-4">
                Choose File
              </Button>
            </div>
          </Card>

          {sending && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Sending Progress</h2>
              <Progress value={progress} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{progress}% Complete</span>
                <span>
                  {Math.floor((emails.split("\n").filter(Boolean).length * progress) / 100)}/{" "}
                  {emails.split("\n").filter(Boolean).length} Sent
                </span>
              </div>
              {progress === 100 && (
                <div className="flex items-center justify-center mt-4 text-green-500">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>All emails sent successfully!</span>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}