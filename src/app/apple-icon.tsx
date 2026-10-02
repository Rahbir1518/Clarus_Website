import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E6EAF2",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 40 40" fill="none">
        <path d="M31.26 26.5A13 13 0 0 1 7.78 15.55" stroke="#C43B3B" strokeWidth="6" />
        <circle cx="9.76" cy="11.99" r="2.6" fill="#C43B3B" />
        <circle cx="11.89" cy="7.98" r="2.2" fill="#C43B3B" opacity=".9" />
        <circle cx="16.69" cy="8.47" r="1.9" fill="#C43B3B" opacity=".8" />
        <circle cx="20.49" cy="6.01" r="1.6" fill="#C43B3B" opacity=".7" />
        <circle cx="24.28" cy="8.25" r="1.35" fill="#C43B3B" opacity=".6" />
        <circle cx="28.62" cy="8.97" r="1.1" fill="#C43B3B" opacity=".5" />
      </svg>
    </div>,
    size,
  );
}
