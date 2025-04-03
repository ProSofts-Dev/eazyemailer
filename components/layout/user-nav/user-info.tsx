"use client";

interface UserInfoProps {
  name: string;
  email: string;
}

export function UserInfo({ name, email }: UserInfoProps) {
  return (
    <div className="ml-3 text-left">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-xs text-muted-foreground">{email}</p>
    </div>
  );
}