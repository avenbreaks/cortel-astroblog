// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import vercel from "@astrojs/vercel"
import sanity from "@sanity/astro"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "uzi620nl",
      dataset: process.env.PUBLIC_SANITY_DATASET || "production",
      useCdn: false,
      studioBasePath: "/studio",
    }),
    react(),
  ],
})
