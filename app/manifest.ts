import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fidely — Digital Loyalty Cards",
    short_name: "Fidely",
    description:
      "Digital loyalty cards for Apple Wallet & Google Wallet. Bring your customers back automatically.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b051d",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
