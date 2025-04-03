"use client";

import { useState } from "react";
import { SendDropdown } from "./send-dropdown";
import { ScheduleDialog } from "./schedule-dialog";

interface SendOptionsProps {
  onSend: (scheduledDate?: Date) => void;
}

export function SendOptions({ onSend }: SendOptionsProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  return (
    <>
      <SendDropdown
        onSendNow={() => onSend()}
        onSchedule={() => setShowScheduleDialog(true)}
      />
      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSchedule={(date) => onSend(date)}
      />
    </>
  );
}