"use client";

import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import type { ReactNode } from "react";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** "✓ Thu 10:30 booked · added to calendar" */
export function Toast({
  show,
  children,
  className,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <m.div
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.45, ease: glide }}
          className={cn(
            "flex items-center gap-2.5 rounded-chip glass-1 px-3.5 py-2.5 text-sm font-medium shadow-float",
            className,
          )}
        >
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}
