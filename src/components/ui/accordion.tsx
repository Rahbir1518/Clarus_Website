"use client";

import { Plus } from "lucide-react";
import { Accordion as A } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Accordion = A.Root;

export function AccordionItem({ className, ...rest }: ComponentProps<typeof A.Item>) {
  return <A.Item className={cn("rounded-card glass-2 shadow-none", className)} {...rest} />;
}

export function AccordionTrigger({
  className,
  children,
  ...rest
}: ComponentProps<typeof A.Trigger>) {
  return (
    <A.Header className="flex">
      <A.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-card px-5 py-4 text-start text-[1.02rem] font-medium sm:px-6 sm:py-5",
          className,
        )}
        {...rest}
      >
        {children}
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/60 ring-1 ring-white/80 transition-transform duration-300 ease-(--ease-glide) group-data-[state=open]:rotate-45">
          <Plus className="size-4" />
        </span>
      </A.Trigger>
    </A.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...rest
}: ComponentProps<typeof A.Content>) {
  return (
    <A.Content
      className="overflow-hidden data-[state=closed]:animate-[collapse_220ms_var(--ease-glide)] data-[state=open]:animate-[expand_260ms_var(--ease-glide)]"
      {...rest}
    >
      <div
        className={cn("px-5 pb-5 text-[0.95rem] leading-relaxed text-ink-muted sm:px-6", className)}
      >
        {children}
      </div>
    </A.Content>
  );
}
