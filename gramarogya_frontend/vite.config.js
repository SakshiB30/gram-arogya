import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
  registerType: "autoUpdate",
  injectRegister: "script",

  manifest: {
    name: "GramArogya",
    short_name: "GramArogya",
    description:
      "Offline-first rural healthcare management system",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    scope: "/",
  },

  workbox: {
    globPatterns: [
      "**/*.{js,css,html,ico,png,svg,woff2}",
    ],
  },
}),
  ],
});