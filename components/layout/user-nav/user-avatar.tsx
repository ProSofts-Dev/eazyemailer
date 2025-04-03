"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  image?: string | null;
}

export function UserAvatar({ name, image }: UserAvatarProps) {
  return (
    <Avatar className="h-8 w-8 border border-border">
      <AvatarImage src={image || `https://api.dicebear.com/7.x/avatars/svg?seed=${name}`} />
      <AvatarFallback className="bg-secondary">{name[0]}</AvatarFallback>
    </Avatar>
  );
}