import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FF4500" }}>
        <svg width="120" height="120" viewBox="6 8 20 16">
          <path d="M8 10.5h5.2l3.3 5.5-3.3 5.5H8l3.3-5.5L8 10.5Z" fill="#fff" fillOpacity=".55" />
          <path d="M14.6 10.5h5.2l3.3 5.5-3.3 5.5h-5.2l3.3-5.5-3.3-5.5Z" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
