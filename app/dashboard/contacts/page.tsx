"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserPlus, Trash2, Download, Upload, Users, User, FileUp, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@radix-ui/react-progress";
import { ApiExamplesDialog } from "@/components/contacts/api-examples-dialog";

const contactGroups = [
  {
    id: "prospect",
    name: "Prospects",
    description: "Potential customers in the pipeline",
  },
  {
    id: "customer",
    name: "Customers",
    description: "Active paying customers",
  },
  {
    id: "partner",
    name: "Partner",
    description: "Your partner",
  },
  {
    id: "community",
    name: "Community",
    description: "Your community member",
  },
];

export default function Contacts() {
  const { toast } = useToast();
  const [total, setTotal] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [unsubscriberCount, setUnSubsciberCount] = useState(0);
  const [adding, setAdding] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showApiExamples, setShowApiExamples] = useState(false);

  const [contacts, setContacts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    group: "",
    status: "Subscribed",
  });

  const addContact = async() => {
    if(adding) return;

    if (!newContact.name || !newContact.email || !newContact.group) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });

    setNewContact({ name: "", email: "", group: "", status: "Subscribed" });
    
    setAdding(false);

    toast({
      title: "Success",
      description: "Contact added successfully",
    });

    fetchCounts();
    
    if(page !== 1) setPage(1);
    else fetchContacts(page);
  };

  const deleteContact = async (id: any) => {
    if(adding) return;

    setAdding(true);

    await fetch(`/api/contacts?id=${id}`, {
      method: "DELETE",
    });
    
    setAdding(false);

    fetchCounts();
    
    if(page !== 1) setPage(1);
    else fetchContacts(page);

    toast({
      title: "Success",
      description: "Contact deleted successfully",
    });
  };

  const toggleSubscription = async (id: number) => {
    fetch(`/api/contacts?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: contacts.find(contact => contact.id === id)?.status === "Subscribed" ? "Unsubscribed" : "Subscribed" }),
    })

    setContacts(contacts.map(contact => {
      if (contact.id === id) {
        const newStatus = contact.status === "Subscribed" ? "Unsubscribed" : "Subscribed";
        return { ...contact, status: newStatus };
      }
      return contact;
    }));

    toast({
      title: "Success",
      description: "Subscription status updated",
    });

    fetchCounts();
  };

  const fetchContacts = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contacts?page=${currentPage}&limit=10`);
      const data = await response.json();
      setTotal(data.total);
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await fetch(`/api/contacts/count`);
      const data = await response.json();
      setSubscriberCount(data.subscriberCount);
      setUnSubsciberCount(data.unsubscriberCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch counts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [])

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);

      setShowBulkUpload(true);

      try {
        const response = await fetch("/api/contacts/bulk", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        setShowBulkUpload(false);

        if (!response.ok) {
          if(data.errors) {
            data.errors?.forEach((err: any) => {
              toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
              });
            })
          } else 
            toast({
              title: "Error",
              description: data.message,
              variant: "destructive",
            });
          return;
        }

        toast({
          title: "Success",
          description: "Contacts uploaded successfully",
        });

        if(page !== 1) setPage(1);
        else fetchContacts(page);

        setOpen(false); 
      } catch (error: any) {
        setShowBulkUpload(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowApiExamples(true)}>
            <Code className="mr-2 h-4 w-4" />
            Create with API
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="outline">
                  <FileUp className="mr-2 h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Contacts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file with the following columns:<br />
                      name, email, status, group
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      id="csv-upload"
                      onChange={handleBulkUpload}
                    />
                    <Button variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                      Choose File
                    </Button>
                  </div>
                  {showBulkUpload && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-sm text-center text-muted-foreground">
                        Uploading...
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="group">Group</Label>
                  <Select
                    value={newContact.group}
                    onValueChange={(value) =>
                      setNewContact({ ...newContact, group: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
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
                <div>
                  <Label htmlFor="status">Subscription Status</Label>
                  <Select
                    value={newContact.status}
                    onValueChange={(value) =>
                      setNewContact({ ...newContact, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Subscribed">Subscribed</SelectItem>
                      <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addContact} className="w-full">
                  {adding ? `Adding new contact` : `Add Contact`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Subscribed</p>
              <p className="text-2xl font-bold text-green-600">{subscriberCount}</p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <Download className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unsubscribed</p>
              <p className="text-2xl font-bold text-red-600">{unsubscriberCount}</p>
            </div>
            <div className="rounded-full bg-red-100 p-2">
              <Upload className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-card rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton style={{ width: 150, height: 10 }} />
                  </TableCell>
                  <TableCell>
                  <Skeleton style={{ width: 200, height: 10 }} />
                  </TableCell>
                  <TableCell>
                  <Skeleton style={{ width: 100, height: 10 }} />
                  </TableCell>
                  <TableCell>
                  <Skeleton style={{ width: 100, height: 10 }} />
                  </TableCell>
                  <TableCell>
                  <Skeleton style={{ width: 80, height: 10 }} />
                  </TableCell>
                  <TableCell>
                  <Skeleton style={{ width: 80, height: 30 }} />
                  </TableCell>
                </TableRow>
              ))
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell className="capitalize">{contact.group}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      contact.status === "Subscribed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {contact.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(contact.createdAt).toDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSubscription(contact.id)}
                      className={contact.status === "Subscribed" ? "text-red-600" : "text-green-600"}
                    >
                      {contact.status === "Subscribed" ? (
                        <Upload className="h-4 w-4" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContact(contact.id)}
                    >
                      {!adding ? <Trash2 className="h-4 w-4 text-destructive" /> : 
                        <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      }
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))) : (
                <></>
            )}
          </TableBody>
          
        </Table>
        {!loading && !contacts.length ?
          <div className="h-[200px] mt-4 w-full flex items-center justify-center border-2 border-dashed rounded-lg">
          <div className="text-center">
            <User className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">No contacts found</h3>
            <p className="text-sm text-muted-foreground">
            Upload your contacts or add contact to get started
            </p>
          </div>
       </div> : <></>}
        {contacts.length > 0 ? <div className="flex justify-between items-center mt-4">
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
      </div>

      <ApiExamplesDialog
        open={showApiExamples}
        onOpenChange={setShowApiExamples}
      />
    </div>
  );
}