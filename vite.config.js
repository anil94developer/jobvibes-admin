import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // ✅ Properly load .env files based on current mode
  const env = loadEnv(mode, process.cwd(), "");

  const host = env.VITE_HOST || "0.0.0.0"; // 0.0.0.0 allows LAN/server access
  const port = Number(env.VITE_PORT) || 30002;

  console.log(`Vite running on host: ${host}, port: ${port}`);

  return {
    plugins: [react()],
    server: {
      host,
      port,
      strictPort: true,
      allowedHosts: "all",
      hmr: {
        host: env.VITE_HMR_HOST || host,
      },
    },
    preview: {
      host,
      port,
      strictPort: true,
      allowedHosts: "all",
    },
  };
});
