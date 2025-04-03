/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Play, Pause, History, FilterIcon } from "lucide-react";
import { CreateWorkflow } from "@/components/workflows/create-workflow";
import { WorkflowLogs } from "@/components/workflows/workflow-logs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsPage() {
  const { toast } = useToast();

  const [workflows, setWorkflows] = useState<any>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [emailTemplates, setEmailTemplates] = useState<any>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
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

  const fetchWorkflows = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows?page=${currentPage}&limit=9`);
      const data = await response.json();
      setWorkflows(data.workflows);
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
  
  const handleAdd = async (newWorkflow: any) => {
    if (!newWorkflow.name || !newWorkflow.trigger || !newWorkflow.templateId || !newWorkflow.filter) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const res = await fetch("/api/workflows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWorkflow),
    });

    const response = await res.json();

    if (response.error) {
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "Success",
      description: "Workflow created successfully",
    });

    if (page !== 1) setPage(1);
    else fetchWorkflows(page);

    setShowCreateDialog(false);
  };

  useEffect(() => {
    fetchWorkflows(page);
  }, [page]);

  const handleToggleWorkflow = (id: number) => {
    fetch(`/api/workflows?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: workflows.find((workflow: any) => workflow.id === id)?.status === "Started" ? "Paused" : "Started" }),
    });

    setWorkflows(workflows.map((w: { id: number; active: any; }) => 
      w.id === id ? { ...w, active: !w.active } : w
    ));


    toast({
      title: "Success",
      description: "Subscription status updated",
    });
  };

  const handleViewLogs = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowLogs(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-2">
            Automate your email workflows based on events
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
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
         ) : workflows.length > 0 ? (
        workflows.map((workflow: any) => (
          <Card key={workflow.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{workflow.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleWorkflow(workflow?.id)}
              >
                {workflow?.status === 'Started' ? (
                  <Pause className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Play className="h-4 w-4 text-green-500" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {workflow.subject}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="px-2 py-1 bg-secondary rounded-full">
                {workflow.trigger}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewLogs(workflow)}
              >
                <History className="h-4 w-4 mr-2" />
                View Logs
              </Button>
            </div>
          </Card>
        ))) : <></>}
      </div>
      {workflows.length > 0 ? 
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

        {workflows.length === 0 && !loading ?
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
          <div className="text-center">
            <FilterIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">No workflows found</h3>
            <p className="text-sm text-muted-foreground">
              Create a new workflow and get started
            </p>
          </div>
       </div> : <></>}

      <CreateWorkflow
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        emailTemplates={emailTemplates}
        onSubmit={handleAdd}
      />

      <WorkflowLogs
        open={showLogs}
        onOpenChange={setShowLogs}
        workflow={selectedWorkflow}
      />
    </div>
  );
}