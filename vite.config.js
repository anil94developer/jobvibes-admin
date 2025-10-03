import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // allow all IPs
    port: 30002, // 👈 frontend runs on port 30002
    allowedHosts: ["admin.jobvibes.in"], // allow your domain
    proxy: {
      "/api": {
        target: "http://admin-api.jobvibes.in", // 👈 backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 30002,
    allowedHosts: ["admin.jobvibes.in"],
  },
});
