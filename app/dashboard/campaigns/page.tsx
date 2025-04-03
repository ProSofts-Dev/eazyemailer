"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { PlusCircle, Mail, Users, Clock, FileText, FilterIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
    id: "partner",
    name: "Partners",
    description: "Send to all your partners",
  },
  {
    id: "community",
    name: "Community",
    description: "Send to all your community members",
  },
];

export default function Campaigns() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);

  const [adding, setAdding] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showReport, setShowReport] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const [emailTemplates, setEmailTemplates] = useState<any>([]);
  const [sending, setSending] = useState(-1);

  const [newCampaign, setNewCampaign] = useState<any>({
    name: "",
    subject: "",
    content: "",
    recipients: "",
    templateId: null,
  });

  const addCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject || (!newCampaign.content && !newCampaign.templateId) || !newCampaign.recipients) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCampaign.name,
        status: "Draft",
        subject: newCampaign.subject,
        content: newCampaign.content,
        templateId: newCampaign.templateId,
        recipientGroup: newCampaign?.recipients,
        sentAt: "-",
        openRate: "-",
        clickRate: "-",
      }),
    });

    let response = await res.json();

    if(response.error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
      setAdding(false);

      return;
    }
    
    setNewCampaign({
      name: "",
      subject: "",
      content: "",
      recipients: "",
      templateId: null,
    });

    toast({
      title: "Success",
      description: "Campaign created successfully",
    });
   
    if(page !== 1) setPage(1);
    else fetchCampaigns(page);

    setAdding(false);

    setCreateOpen(false);
  };

  const handleSendCampaign = async (campaign: any) => {
    setSending(campaign.id);

    await fetch("/api/campaigns/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId: campaign.id,
      }),
    });

    setCampaigns(campaigns.map(c => 
      c.id === campaign.id 
        ? { ...c, status: "Active", sentAt: new Date().toISOString().split('T')[0] }
        : c
    ));

    toast({
      title: "Campaign Sent",
      description: `Campaign "${campaign.name}" has been sent successfully`,
    });

    setSending(-1);
  };

  const handleViewReport = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowReport(true);
  };

  const fetchCampaigns = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns?page=${currentPage}&limit=9`);
      const data = await response.json();
      setCampaigns(data.campaigns);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTemplats = async () => {
    try {
      const response = await fetch(`/api/templates?page=1&limit=100`);
      const data = await response.json();

      setEmailTemplates(data.templates);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTemplats();
  }, []);

  useEffect(() => {
    fetchCampaigns(page);
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
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-2">
              Manage and send campaigns
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="template">
              <TabsList className="mb-4">
                <TabsTrigger value="template">Use Template</TabsTrigger>
                <TabsTrigger value="custom">Text Email</TabsTrigger>
              </TabsList>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={newCampaign.name}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, subject: e.target.value })
                    }
                  />
                </div>
                <TabsContent value="template">
                  <div>
                    <Label htmlFor="template">Select Template</Label>
                    <Select
                      value={newCampaign.templateId + ""}
                      onValueChange={(value) =>
                        setNewCampaign({ ...newCampaign, templateId: parseInt(value), content: emailTemplates.find((temp: any) => temp.id === parseInt(value)).content })
                      }
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
                </TabsContent>
                <TabsContent value="custom">
                  <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                      id="content"
                      rows={8}
                      value={newCampaign.content}
                      onChange={(e) =>
                        setNewCampaign({ ...newCampaign, content: e.target.value, templateId: null })
                      }
                    />
                  </div>
                </TabsContent>
                <div>
                  <Label htmlFor="recipients">Select Recipients</Label>
                  <Select
                    value={newCampaign.recipients}
                    onValueChange={(value) =>
                      setNewCampaign({ ...newCampaign, recipients: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose recipient group" />
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
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={addCampaign}>{adding ? 'Creating Campaign' : 'Create Campaign'}</Button>
              </DialogFooter>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

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
                <Skeleton className="text-sm text-muted-foreground mt-2" style={{ width: 200, height: 15 }}  />
                <div className="mt-2">
                  <Skeleton className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full" style={{ width: 50, height: 15 }} />
                </div>
              </div>
            </Card>
          ))
         ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{campaign.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    campaign.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "Draft"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <p className="capitalize">{campaign.recipientGroup} ({campaign.recipientCount?.toLocaleString()} recipients)</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {campaign.sentAt === "-" || campaign.sentAt === null ? "Not sent yet" : `Sent: ${new Date(campaign.sentAt).toISOString().split('T')[0]}`}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                {campaign.status === "Draft" ? (
                  sending !== campaign.id ? 
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => handleSendCampaign(campaign)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button> : <Button 
                    variant="secondary" 
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Sending...
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => handleViewReport(campaign)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                )}
              </div>
            </Card>
          ))) : (
              <></>
        )
      }
                            
      </div>
      {campaigns.length > 0 ? 
        <div className="flex justify-between items-center mt-4">
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
      {campaigns.length === 0 && !loading ?
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
          <div className="text-center">
            <FilterIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">No campaigns found</h3>
            <p className="text-sm text-muted-foreground">
              Create a new campign and get started
            </p>
          </div>
       </div> : <></>}

      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaign Report: {selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Open Rate</h4>
                  <p className="text-2xl font-bold">{`${selectedCampaign.openRate?.toFixed(1)} %`}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Click Rate</h4>
                  <p className="text-2xl font-bold">{`${selectedCampaign.clickRate?.toFixed(1)} %`}</p>
                </Card>
              </div>
              <div>
                <h4 className="font-medium mb-2">Campaign Details</h4>
                <div className="space-y-2 text-sm">
                  <p>Recipients: {selectedCampaign.recipientGroup}</p>
                  <p>Sent Date: {selectedCampaign.sentAt}</p>
                  <p>Total Recipients: {selectedCampaign.recipientCount}</p>
                  <p>Successfully sent: {selectedCampaign.totalSent}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}