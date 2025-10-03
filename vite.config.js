import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Development server
  server: {
    host: "admin.jobvibes.in", // your public host
    port: 30002,
    strictPort: false, // allows fallback if port is busy
    hmr: {
      host: "admin.jobvibes.in", // ensures HMR works externally
    },
    allowedHosts: ["admin.jobvibes.in"], // explicitly allow your host
  },

  // Preview server (vite preview)
  preview: {
    host: "admin.jobvibes.in",
    port: 30002,
    strictPort: false,
    allowedHosts: ["admin.jobvibes.in"], // explicitly allow your host
  },
});
