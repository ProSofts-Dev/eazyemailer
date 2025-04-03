"use client";
import React from "react";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import { XIcon } from "lucide-react";

import confetti from "canvas-confetti";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WalkthroughCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  // Onborda hooks
  const { closeOnborda } = useOnborda();

  function handleConfetti() {
    closeOnborda();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  return (
    <Card className="border-0 rounded-3xl w-[500px] bg-white">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle className="mb-2 text-lg text-black">
              {step.icon} {step.title}
            </CardTitle>
            <CardDescription className="text-black">
              {currentStep + 1} of {totalSteps}
            </CardDescription>
          </div>
          <Button className="text-black" variant="ghost" size="icon" onClick={() => closeOnborda()}>
            <XIcon size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-black">{step.content}</CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          {currentStep !== 0 && (
            <Button className="text-white bg-black hover:bg-zinc-800" onClick={() => prevStep()}>Previous</Button>
          )}
          {currentStep + 1 !== totalSteps && (
            <Button className="text-white bg-black ml-auto hover:bg-zinc-800" onClick={() => nextStep()}>
              Next
            </Button>
          )}
          {currentStep + 1 === totalSteps && (
            <Button className="text-white bg-black ml-auto hover:bg-zinc-800" onClick={() => handleConfetti()}>
              🎉 Finish!
            </Button>
          )}
        </div>
      </CardFooter>
      <span className="text-card">{arrow}</span>
    </Card>
  );
};

export default WalkthroughCard;