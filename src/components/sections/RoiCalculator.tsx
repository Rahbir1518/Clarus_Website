"use client";

import { Info } from "lucide-react";
import { useId, useState } from "react";
import { GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { Tooltip } from "@/components/ui/tooltip";
import { home } from "@/content/copy";
import { growthMonthly } from "@/content/pricing";
import { site } from "@/content/site";
import { useMarket } from "./MarketContext";
import { Section, SectionHeader } from "./SectionHeader";

const valueRange = {
  USD: { min: 20, max: 600, step: 5, def: 196 },
  BDT: { min: 300, max: 15000, step: 100, def: 2000 },
};

export function RoiCalculator() {
  const c = home.roi;
  const { market } = useMarket();
  const currency = market === "bd" ? "BDT" : "USD";
  const range = valueRange[currency];

  const [missed, setMissed] = useState(8);
  const [rate, setRate] = useState(30);
  const [values, setValues] = useState({ USD: valueRange.USD.def, BDT: valueRange.BDT.def });
  const value = values[currency];

  const fmt = (n: number) =>
    new Intl.NumberFormat(currency === "BDT" ? "en-BD" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  const visitsYear = Math.round(missed * 52 * (rate / 100));
  const recovered = visitsYear * value;
  const payback = Math.max(1, Math.ceil(growthMonthly[market] / value));

  return (
    <Section>
      <SectionHeader eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <GradientScene scene="teal" className="mt-12 rounded-panel p-3 sm:p-6">
        <GlassPanel className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="space-y-7">
            <Slider
              label={c.missed}
              value={missed}
              min={1}
              max={60}
              step={1}
              onChange={setMissed}
              display={String(missed)}
            />
            <Slider
              label={c.value}
              value={value}
              min={range.min}
              max={range.max}
              step={range.step}
              onChange={(v) => setValues((s) => ({ ...s, [currency]: v }))}
              display={fmt(value)}
            />
            <Slider
              label={c.rate}
              value={rate}
              min={5}
              max={80}
              step={5}
              onChange={setRate}
              display={`${rate}%`}
            />
          </div>

          <div className="flex flex-col justify-center rounded-card bg-white/60 p-6 ring-1 ring-white/80 sm:p-8">
            <div aria-live="polite">
              <div className="text-[clamp(2.5rem,1.8rem+2.6vw,3.75rem)] leading-none font-[560] tracking-[-0.04em] tabular-nums">
                ≈ {fmt(recovered)}
              </div>
              <div className="mt-2 text-ink-muted">
                {c.result} · {visitsYear.toLocaleString("en-US")} visits
              </div>
            </div>
            {site.showPricing && (
              <p className="mt-6 border-t border-line pt-5 text-[0.95rem]">
                {c.payback.replace("{n}", String(payback))}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
              <span>{c.estimate}</span>
              <Tooltip content={<>Formula: {c.formula}</>}>
                <button className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 underline decoration-dotted underline-offset-2 hover:text-ink">
                  <Info className="size-3.5" /> How is this worked out?
                </button>
              </Tooltip>
            </div>
          </div>
        </GlassPanel>
      </GradientScene>
    </Section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-lg tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range"
        style={{ ["--fill" as string]: `${fill}%` }}
      />
    </div>
  );
}
