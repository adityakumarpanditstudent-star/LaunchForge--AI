"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <div className={cn(
      "p-8 rounded-[32px] glass-card transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};
