import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AfterAdmit",
    short_name: "AfterAdmit",
    description: "Your personalized path from admit to arrival.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF4500",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
