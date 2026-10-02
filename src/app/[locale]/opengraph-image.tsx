import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const alt = "Clarus: every follow-up made, every free slot filled.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const mark = (
  <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
    <path d="M31.26 26.5A13 13 0 0 1 7.78 15.55" stroke="#C43B3B" strokeWidth="6" />
    <circle cx="9.76" cy="11.99" r="2.6" fill="#C43B3B" />
    <circle cx="11.89" cy="7.98" r="2.2" fill="#C43B3B" opacity=".9" />
    <circle cx="16.69" cy="8.47" r="1.9" fill="#C43B3B" opacity=".8" />
    <circle cx="20.49" cy="6.01" r="1.6" fill="#C43B3B" opacity=".7" />
    <circle cx="24.28" cy="8.25" r="1.35" fill="#C43B3B" opacity=".6" />
    <circle cx="28.62" cy="8.97" r="1.1" fill="#C43B3B" opacity=".5" />
  </svg>
);

// One English card for every locale: the OG renderer's default font has no
// Bangla or Arabic glyphs, and a broken preview is worse than an English one.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 64,
        background:
          "radial-gradient(circle at 12% 18%, #9FE3D6 0, transparent 45%), radial-gradient(circle at 88% 22%, #A9B8FF 0, transparent 48%), radial-gradient(circle at 60% 110%, #F6C6E0 0, transparent 50%), #E6EAF2",
        color: "#0E1726",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 640,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {mark}
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.5 }}>Clarus</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2.5 }}>
            Every follow-up made. Every free slot filled.
          </div>
          <div style={{ marginTop: 24, fontSize: 26, color: "#3E4A5C" }}>
            AI patient follow-up for clinics · WhatsApp · SMS · AI voice
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: 48,
          flex: 1,
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 28,
            padding: 28,
            background: "rgba(14,23,38,0.82)",
            color: "white",
            boxShadow: "0 30px 60px -20px rgba(14,23,38,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              R.A.
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>Rafiq Ahmed</div>
              <div style={{ fontSize: 17, color: "rgba(255,255,255,0.72)" }}>On call · 00:21</div>
            </div>
          </div>
          <div style={{ marginTop: 22, fontSize: 21, lineHeight: 1.35 }}>
            The clinic is closed on Fridays. I can offer Thursday at 10:30, or Saturday at 11:00.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            alignSelf: "flex-end",
            borderRadius: 16,
            padding: "14px 20px",
            background: "rgba(255,255,255,0.75)",
            fontSize: 21,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              background: "#18A957",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          Thu 10:30 booked
        </div>
      </div>
    </div>,
    size,
  );
}
