import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    // Produces the Vercel-compatible server output for TanStack Start SSR.
    nitro({
      preset: "vercel",
      handlers: [
        {
          route: "/api/refresh-prices",
          handler: "./server/routes/api/refresh-prices.get.ts",
          method: "get",
        },
      ],
    }),
    react(),
  ],
});
