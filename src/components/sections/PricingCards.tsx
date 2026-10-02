"use client";

import { Check, Sparkles } from "lucide-react";
import { PilotLink } from "@/components/pilot/PilotDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { plans, pricing, pricingNotes } from "@/content/pricing";
import { site, type MarketId } from "@/content/site";
import { cn } from "@/lib/utils";
import { useMarket } from "./MarketContext";

export function MarketSwitcher({ location }: { location: string }) {
  const { market, setMarket } = useMarket();
  return (
    <ToggleGroup
      type="single"
      value={market}
      onValueChange={(v) => v && setMarket(v as MarketId, location)}
      aria-label="Market"
    >
      {pricing.map((p) => (
        <ToggleGroupItem key={p.market} value={p.market}>
          {p.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function PricingCards({ location }: { location: string }) {
  const { market } = useMarket();
  const prices = pricing.find((p) => p.market === market)!;

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-panel glass-2 p-6 sm:p-7",
              plan.highlight && "glass-highlight lg:-my-3 lg:py-10",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-h3">{plan.name}</h3>
              {plan.highlight && (
                <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-white">
                  Recommended
                </span>
              )}
            </div>
            {plan.badge && (
              <span className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-brand-2/14 px-2.5 py-1 font-mono text-[11px] text-[#3442C9]">
                <Sparkles className="size-3" /> {plan.badge}
              </span>
            )}
            <p className="mt-3 text-sm text-ink-muted">{plan.blurb}</p>

            <div className="mt-6">
              {site.showPricing ? (
                <>
                  <span className="text-[2.75rem] leading-none font-[560] tracking-[-0.04em] tabular-nums">
                    {prices.prices[plan.id]}
                  </span>
                  <span className="ms-1 text-sm text-ink-muted">/ clinic / month</span>
                </>
              ) : (
                <span className="text-xl font-medium">{pricingNotes.hidden}</span>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success-ink" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <PilotLink
              location={`${location}:${plan.id}`}
              variant={plan.highlight ? "primary" : "secondary"}
              className="mt-7 w-full"
            />
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-ink-muted">
        {site.showPricing && <>{prices.setup} · </>}
        {pricingNotes.overage} {pricingNotes.groups}
      </p>
    </div>
  );
}
