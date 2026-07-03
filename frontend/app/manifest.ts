import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Foxtrot Fitness",
    short_name: "Foxtrot",
    description: "AI workout programs built for your equipment.",
    start_url: "/",
    display: "standalone",
    theme_color: "#F26B1F",
    background_color: "#0a0e1a",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
