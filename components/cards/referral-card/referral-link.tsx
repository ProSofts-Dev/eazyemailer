"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function ReferralLink() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = "https://example.com/ref/user123";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Your referral link has been copied!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        value={referralLink}
        className="font-mono text-sm"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        className="shrink-0"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}