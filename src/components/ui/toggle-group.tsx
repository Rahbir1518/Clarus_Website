"use client";

import { ToggleGroup as T } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Segmented control: the market switcher, language and speed pickers. */
export function ToggleGroup({ className, ...rest }: ComponentProps<typeof T.Root>) {
  return (
    <T.Root
      className={cn("inline-flex flex-wrap items-center gap-1 rounded-full glass-1 p-1", className)}
      {...rest}
    />
  );
}

export function ToggleGroupItem({ className, ...rest }: ComponentProps<typeof T.Item>) {
  return (
    <T.Item
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-ink-muted transition-colors duration-200",
        "hover:text-ink data-[state=on]:bg-ink data-[state=on]:text-white",
        className,
      )}
      {...rest}
    />
  );
}
