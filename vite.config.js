import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// eslint-disable-next-line no-undef
const host = process.env.VITE_HOST || "localhost";
console.log("host", host);

export default defineConfig({
  plugins: [react()],
  server: {
    host,
    port: 30002,
    strictPort: true, // stop auto-incrementing
    hmr: {
      host,
    },
    allowedHosts: "all",
  },
  preview: {
    host,
    port: 30002,
    strictPort: true,
    allowedHosts: "all", // ✅ allow all hosts explicitly
  },
});
