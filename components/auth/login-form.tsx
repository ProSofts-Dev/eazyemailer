"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: true
      });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full h-12 text-lg transition-all hover:scale-[1.02]"
      disabled={isLoading}
    >
      <FcGoogle className="mr-2 h-6 w-6" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}