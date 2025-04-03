"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleContactSubmit } from "./contact-utils";
import { useToast } from "@/components/ui/use-toast";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await handleContactSubmit(e.currentTarget);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input 
          name="name"
          placeholder="Name" 
          required 
          aria-label="Name"
        />
        <Input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          aria-label="Email"
        />
      </div>
      <Input 
        name="subject"
        placeholder="Subject" 
        required 
        aria-label="Subject"
      />
      <Textarea
        name="message"
        placeholder="Your message..."
        className="min-h-[100px]"
        required
        aria-label="Message"
      />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Message
          </span>
        )}
      </Button>
    </form>
  );
}