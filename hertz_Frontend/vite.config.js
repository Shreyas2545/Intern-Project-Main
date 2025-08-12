import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // This proxies any request starting with /api to your backend server.
      // This is the standard way to solve CORS issues in development.
      "/api": {
        target: "http://localhost:8000", // Your backend server's address
        changeOrigin: true, // This is recommended for virtual hosted sites
        secure: false, // Set to true if your backend server uses HTTPS
      },
    },
  },
  optimizeDeps: {
    // This can help resolve issues with certain libraries during development.
    exclude: ["react-icons"],
  },
});
