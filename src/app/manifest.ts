import { MetadataRoute } from "next";
import { getConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  const config = getConfig();

  return {
    name: config.site.title,
    short_name: config.site.title.split(" ")[0] || "HopLog",
    description: config.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3182f6",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
