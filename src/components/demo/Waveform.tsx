import { cn } from "@/lib/utils";

// Fixed heights so server and client render the same bars.
const heights = [45, 70, 55, 90, 60, 100, 75, 50, 85, 65, 95, 55, 70, 40, 80, 60, 90, 50, 75, 45];

/** Live voice waveform. Only `transform` animates. */
export function Waveform({
  active,
  bars = 20,
  className,
}: {
  active: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex h-6 items-center gap-[3px]", className)}>
      {heights.slice(0, bars).map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] origin-center rounded-full bg-current transition-transform duration-300",
            active ? "animate-wave" : "scale-y-[0.25]",
          )}
          style={{ height: `${h}%`, animationDelay: `${(i * 137) % 900}ms` }}
        />
      ))}
    </div>
  );
}
