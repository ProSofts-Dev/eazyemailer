import { Mail } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-secondary p-3 rounded-lg">
          <Mail className="h-12 w-12" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">
        Welcome to EazyEmailer
      </h1>
      <p className="text-muted-foreground">
        Sign in to access your email campaign dashboard
      </p>
    </div>
  );
}