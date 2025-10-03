import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 30002,
    allowedHosts: ["admin.jobvibes.in"], // ✅ dev mode
  },
  preview: {
    host: "0.0.0.0",
    port: 30002,
    allowedHosts: ["admin.jobvibes.in"], // ✅ preview mode (fixes Blocked request)
  },
});
