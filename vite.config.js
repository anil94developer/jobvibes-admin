import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// eslint-disable-next-line no-undef
const host = process.env.VITE_HOST || "localhost";

export default defineConfig({
  plugins: [react()],
  server: {
    host,
    port: 30002,
    strictPort: false,
    hmr: {
      host,
    },
    allowedHosts: "all",
  },
  preview: {
    host,
    port: 30002,
    strictPort: false,
    allowedHosts: "all", // ✅ allow all hosts explicitly
  },
});
