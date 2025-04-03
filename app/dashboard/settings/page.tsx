"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw, Rocket, RectangleHorizontal, CheckCircleIcon, RocketIcon, Copy, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emailState, setEmailState] = useState('Checking');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('configuration');

  const [settings, setSettings] = useState({
    id: -1,
    senderName: "",
    senderEmail: "",
    apiToken: "",
    emailTemplate: "default",
    dailyLimit: "1000",
    notifications: true,
    trackOpens: true,
    trackClicks: true,
    // AWS SES Settings
    awsAccessKeyId: "",
    awsSecretAccessKey: "",
    awsRegion: "us-east-1",
    sesFromDomain: "",
    sesSendingQuota: "50000",
    sesEmailVerification: false,
    sesSuppressionList: true,
  });

  const fetchSettings = async () => {
    setLoading(true);
    fetch(`/api/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(val => val.json()).then(res => {
      setLoading(false);
      setSettings(res);        
    });
  }

  useEffect(() => {
    fetchSettings();
    checkCredentials();
  }, []);

  const handleSave = async () => {
    try {
      await updateSettings();
    } catch(e) {
      setSaving(false);
    }
  };

  const verifyCredentials = async () => {
    if(emailState !== 'Verifying' && settings.senderEmail) {
      toast({
        title: "Verification Started",
        description: "Sending Verification email from AWS SES...",
      });

      setEmailState('Verifying');

      try {
        const res = await fetch('/api/settings/email/verify', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        let response = await res.json();
  
        toast({
          title: "Verification Started",
          description: response.message,
        });  
      } catch (e: any) {
          
        toast({
          title: "Error",
          description: e,
          variant: "destructive",
        });
  
        setEmailState('Pending');
      }
    }
  };

  const checkCredentials = async () => {
      setEmailState('Checking');

      try {
        const res = await fetch('/api/settings/email/check', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        let response = await res.json();

        if(response.status !== 404) setEmailState(response.status);
        if(response.status !== 'SUCCESS')  {
          toast({
            title: "Verification Status",
            description: "Verify sender email to start sending emails",
          });
          setEmailState('');
        }
      } catch (e: any) {
        setEmailState('');

        toast({
          title: "Error",
          description: e,
          variant: "destructive",
        });
      }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(settings.apiToken);
    toast({
      title: "Copied",
      description: "API token copied to clipboard",
    });
  };

  const handleGenerateNewToken = async () => {
    setSaving(true);

    try {
      const res = await fetch(`/api/settings/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      let response = await res.json();

      if(res?.status !== 200) {
        toast({
          title: "Error",
          description: response?.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Token generated successfully",
        });
    
        setSettings({ ...response });
      } 
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.error,
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  const updateSettings = async () => {
    setSaving(true);

    try {
      const res = await fetch(`/api/settings?id=${settings.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: settings.id, senderName: settings.senderName, senderEmail: settings.senderEmail, dailyLimit: 1000 }),
      });
  
      let response = await res.json();

      if(res?.status !== 200) {
        toast({
          title: "Error",
          description: response?.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
    
        checkCredentials(); 
      } 
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.error,
        variant: "destructive",
      });
    }

    setSaving(false);
  }

  const handleUpgrade = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/upgrade', {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Upgrade request sent successfully",
        });
      } else {
        throw new Error(data.error || 'Failed to send upgrade request');
      }
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        {tab === 'configuration' ? <div className="flex gap-2">
          {emailState === '' || emailState === 'Verifying' ? 
          <Button className="settings-verify" variant="outline" onClick={verifyCredentials}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {emailState === 'Verifying' ? 'Verifying...' : 'Verify Sender Email'}
          </Button> : 
          emailState === 'SUCCESS' ? <Button variant="outline">
            <CheckCircleIcon color="green" className="mr-2 h-4 w-4" />
            Email Verified
          </Button> : <Button variant='outline'>
            <RectangleHorizontal className="mr-2 h-4 w-4" />
            {emailState === 'PENDING' ? 'Email Pending Verification' : 'Checking...'}
            </Button>}
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div> : tab === 'usage' ? <Button onClick={handleUpgrade}>
          <RocketIcon className="mr-2 h-4 w-4" />
          {saving ? 'Upgrading' : 'Upgrade'}
        </Button> : <></>}
      </div>

      <Tabs onValueChange={(val) => setTab(val)} defaultValue={tab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Config</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <Label htmlFor="dailyLimit">Daily Send Limit</Label>
                {loading ? <Skeleton className="mt-2"  style={{ width: 150, height: 10 }} /> : <p className="mt-2 text-sm text-muted-foreground">{`${settings.dailyLimit} / ${settings.dailyLimit}`}</p>}
              </div>
              <div className="border-b pb-4">
                <Label htmlFor="dailyLimit">Monthly Send Limit</Label>
                {loading ? <Skeleton className="mt-2"  style={{ width: 150, height: 10 }} /> : 
                <p className="mt-2 text-sm text-muted-foreground">{`${settings.dailyLimit} / ${settings.dailyLimit}`}</p>}
              </div>
              <div>
                <Label htmlFor="dailyLimit">Contacts Limit</Label>
                {loading ? <Skeleton className="mt-2"  style={{ width: 150, height: 10 }} /> : 
                <p className="mt-2 text-sm text-muted-foreground">{`${settings.dailyLimit} / ${settings.dailyLimit}`}</p>}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="sendername">
                <Label htmlFor="senderName">Sender Name</Label>
                {loading ? <Skeleton className="mt-4" style={{ width: 150, height: 10 }} /> : <Input
                  id="senderName"
                  className="mt-2"
                  value={settings.senderName}
                  onChange={(e) =>
                    setSettings({ ...settings, senderName: e.target.value })
                  }
                />}
              </div>
              <div className="verify">
                <Label htmlFor="senderEmail">Sender Email</Label>
                {loading ? <Skeleton className="mt-4" style={{ width: 150, height: 10 }} /> : <Input
                  id="senderEmail"
                  type="email"
                  className="mt-2"
                  value={settings.senderEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, senderEmail: e.target.value })
                  }
                />}
                {emailState !== 'SUCCESS' &&  emailState !== 'PENDING' ? <p className="text-sm text-muted-foreground mt-2">(Verify sender email to start sending emails)</p> : <></>}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">API Configuration</h2>
            <div className="space-y-6">
              <div>
                <Label>API Token</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="password"
                    value={settings.apiToken}
                    readOnly
                  />
                  <Button variant="outline" onClick={handleCopyToken}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Use this token to authenticate your API requests
                </p>
              </div>
              <div>
                <Button onClick={() => handleGenerateNewToken()}>
                  <Key className="mr-2 h-4 w-4" />
                  {saving ? 'Generating New Token...' : 'Generate New Token'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Warning: Generating a new token will invalidate the existing one
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}