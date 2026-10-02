import { markets } from "@/content/site";
import { worldMap } from "@/content/world-dots";

const project = ([lon, lat]: [number, number]) => ({
  x: ((lon + 180) / 360) * worldMap.width,
  y: ((worldMap.latTop - lat) / (worldMap.latTop - worldMap.latBottom)) * worldMap.height,
});

// Dubai and Doha are a few hundred km apart; nudge their labels apart.
const labelOffset: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  bd: { dx: 14, dy: 4, anchor: "start" },
  ae: { dx: 14, dy: 18, anchor: "start" },
  qa: { dx: -14, dy: -10, anchor: "end" },
  ca: { dx: 14, dy: 4, anchor: "start" },
};

/** A dot-matrix world with the four launch markets lit. */
export function MarketsMap() {
  return (
    <figure>
      <svg
        viewBox={`0 0 ${worldMap.width} ${worldMap.height}`}
        role="img"
        aria-label={`Map of Clarus launch markets: ${markets.map((m) => m.name).join(", ")}.`}
        className="w-full"
      >
        <path
          d={worldMap.dots}
          stroke="#0E1726"
          strokeOpacity={0.16}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        {markets.map((m) => {
          const p = project(m.lonLat);
          const o = labelOffset[m.id]!;
          return (
            <g key={m.id}>
              <circle cx={p.x} cy={p.y} r={16} fill="#C43B3B" opacity={0.14} />
              <circle cx={p.x} cy={p.y} r={6} fill="#C43B3B" stroke="#fff" strokeWidth={2} />
              <text
                x={p.x + o.dx}
                y={p.y + o.dy}
                textAnchor={o.anchor}
                className="fill-ink text-[15px] font-semibold"
                style={{
                  paintOrder: "stroke",
                  stroke: "#E6EAF2",
                  strokeWidth: 5,
                  strokeLinejoin: "round",
                }}
              >
                {m.name}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
