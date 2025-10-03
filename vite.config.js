import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: 30002,
    allowedHosts: ["*"], // 👈 allow ANY host
  },
  server: {
    host: "0.0.0.0",
    port: 30002,
    allowedHosts: ["*"], // 👈 also for dev mode
  },
});
