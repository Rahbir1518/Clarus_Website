"use client";

import { useInView } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/*
 * The form brings react-hook-form and Zod with it (~100 KB). Nobody needs it at
 * first paint: it sits at the bottom of the page or inside a dialog. So it's
 * fetched when it comes within 800px of the viewport, or immediately when the
 * dialog opens. The skeleton holds its space so nothing shifts.
 */
const PilotForm = dynamic(() => import("./PilotForm").then((m) => m.PilotForm), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

export function PilotFormLazy({
  location,
  eager = false,
  className,
}: {
  location: string;
  eager?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "800px 0px" });
  return (
    <div ref={ref} className={cn("min-h-[62rem] sm:min-h-[37rem]", className)}>
      {eager || near ? <PilotForm location={location} /> : <FormSkeleton />}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div aria-hidden className="grid animate-pulse gap-4 sm:grid-cols-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="mb-2 h-4 w-28 rounded bg-ink/8" />
          <div className="h-11 rounded-chip bg-white/60" />
        </div>
      ))}
    </div>
  );
}
