"use client";

import { useLocale } from "next-intl";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { markets, type MarketId } from "@/content/site";
import { track } from "@/lib/analytics";

type Ctx = { market: MarketId; setMarket: (m: MarketId, location: string) => void };
const MarketContext = createContext<Ctx | null>(null);

const byLocale: Record<string, MarketId> = { bn: "bd", ar: "ae", en: "ae" };

/** One market choice shared by the ROI calculator and the pricing cards on a page. */
export function MarketProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [market, set] = useState<MarketId>(byLocale[locale] ?? "ae");

  // /pricing?market=ca (from the footer's market links)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("market");
    // Reading the URL once on mount is syncing from an external source; the
    // page is static, so it can't be known at render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q && markets.some((m) => m.id === q)) set(q as MarketId);
  }, []);

  return (
    <MarketContext.Provider
      value={{
        market,
        setMarket: (m, location) => {
          set(m);
          track("pricing_market_changed", { market: m, location });
        },
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket(): Ctx {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket() must be used inside <MarketProvider>");
  return ctx;
}
