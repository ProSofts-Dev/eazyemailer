"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SendOptionsProps {
  onSend: (scheduledDate?: Date) => void;
}

export function SendOptions({ onSend }: SendOptionsProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const { toast } = useToast();

  const handleScheduleSend = () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes);

    if (scheduledDate < new Date()) {
      toast({
        title: "Error",
        description: "Scheduled time must be in the future",
        variant: "destructive",
      });
      return;
    }

    onSend(scheduledDate);
    setShowScheduleDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Send Campaign
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onSend()}>
            <Mail className="mr-2 h-4 w-4" />
            Send Now
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowScheduleDialog(true)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="mx-auto"
              />
            </div>
            <div>
              <Label>Select Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleSend}>
              Schedule Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}