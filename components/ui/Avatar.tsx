"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    if (!n) return "?";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Generate consistent background color based on name string
  const getBgColor = (n: string) => {
    const colors = [
      "bg-indigo-600 text-white",
      "bg-emerald-600 text-white",
      "bg-amber-600 text-white",
      "bg-rose-600 text-white",
      "bg-purple-600 text-white",
      "bg-cyan-600 text-white",
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-medium select-none overflow-hidden shrink-0 ring-2 ring-white/10",
        sizeClasses[size],
        !src || imageError ? getBgColor(name) : "bg-neutral-800",
        className
      )}
      title={name}
      aria-label={name}
    >
      {src && !imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
