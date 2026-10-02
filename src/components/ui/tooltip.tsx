"use client";

import { Tooltip as T } from "radix-ui";
import type { ReactNode } from "react";

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  return (
    <T.Provider delayDuration={150}>
      <T.Root>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content
            sideOffset={8}
            className="z-50 max-w-xs rounded-chip bg-ink px-3 py-2 text-xs leading-relaxed text-white shadow-lift data-[state=delayed-open]:animate-[fade-in_150ms]"
          >
            {content}
            <T.Arrow className="fill-ink" />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}
