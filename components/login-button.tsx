"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full h-12 text-lg transition-all hover:scale-[1.02]"
      variant="outline"
    >
      <FcGoogle className="mr-2 h-6 w-6" />
      Continue with Google
    </Button>
  );
}