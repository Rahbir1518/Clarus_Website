"use client";

import { X } from "lucide-react";
import { Dialog as D } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogTitle = D.Title;
export const DialogDescription = D.Description;

function Overlay() {
  return (
    <D.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[3px] data-[state=closed]:animate-[fade-out_160ms] data-[state=open]:animate-[fade-in_200ms]" />
  );
}

/** Centered glass dialog. Its own gradient sits behind it, so the glass has colour to blur. */
export function DialogContent({ className, children, ...rest }: ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <Overlay />
      <D.Content
        className={cn(
          "fixed start-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-panel rtl:translate-x-1/2",
          "bg-[radial-gradient(at_10%_0%,#C9F0E6_0,transparent_50%),radial-gradient(at_100%_20%,#D4DBFF_0,transparent_55%),radial-gradient(at_50%_100%,#FBE0EC_0,transparent_50%),#EEF2F8]",
          "shadow-lift ring-1 ring-white/80 data-[state=open]:animate-[pop-in_260ms_var(--ease-glide)]",
          className,
        )}
        {...rest}
      >
        {children}
        <D.Close
          className="absolute end-4 top-4 grid size-9 place-items-center rounded-full bg-white/70 text-ink ring-1 ring-white hover:bg-white"
          aria-label="Close"
        >
          <X className="size-4" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}

/** Side sheet, for the mobile menu. */
export function SheetContent({ className, children, ...rest }: ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <Overlay />
      <D.Content
        className={cn(
          "fixed inset-y-2 end-2 z-50 flex w-[min(22rem,calc(100vw-1rem))] flex-col rounded-panel p-6",
          "bg-[radial-gradient(at_0%_0%,#C9F0E6_0,transparent_55%),radial-gradient(at_100%_100%,#D4DBFF_0,transparent_55%),#EEF2F8]",
          "shadow-lift ring-1 ring-white/80 data-[state=open]:animate-[sheet-in_300ms_var(--ease-glide)]",
          className,
        )}
        {...rest}
      >
        {children}
        <D.Close
          className="absolute end-4 top-4 grid size-9 place-items-center rounded-full bg-white/70 text-ink ring-1 ring-white hover:bg-white"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
