"use client";

import Sidebar from '@/components/layout/sidebar';
import { useOnborda } from "onborda";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkCredentials = async () => {
      try {
        const res = await fetch('/api/settings/email/check', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        let response = await res.json();

        if(response.status !== 'SUCCESS')  {
          setShowVerificationModal(true);
        }
      } catch (e: any) {
      }
  };

  useEffect(() => {
    checkCredentials();
  }, []);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const router = useRouter();

  const handleGoToSettings = () => {
    router.push('/dashboard/settings');
    setShowVerificationModal(false);
  };

  const handleDoLater = () => {
    setShowVerificationModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
        <div className="flex gap-6 p-6">
          <Sidebar />
          <main className="flex-1">
            <div className="bg-card rounded-lg border border-border shadow-2xl">
              {children}
            </div>
          </main>
        </div>
        <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto bg-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center">Verify Your Sender Details</DialogTitle>
            <DialogDescription className="text-center">
              Before you can start sending emails, you need to verify your sender email address and set up your sender name in settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center mt-4">
            <Button onClick={handleGoToSettings}>
              Go To Settings
            </Button>
            <Button variant="outline" onClick={handleDoLater}>
              Do Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}