// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  base: "/",
  // Use absolute paths for proper module loading
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"]
        }
      }
    },
    // Ensure assets use absolute paths
    assetsDir: "assets"
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    cors: true,
    // Enable CORS for all origins
    hmr: { overlay: true },
    // Improve HMR error reporting
    watch: {
      usePolling: true
      // Use polling for file changes (helps in some environments)
    },
    headers: {
      "Cache-Control": "no-store"
      // Prevent browser caching
    }
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
    // Explicitly define extensions
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgYmFzZTogJy8nLCAvLyBVc2UgYWJzb2x1dGUgcGF0aHMgZm9yIHByb3BlciBtb2R1bGUgbG9hZGluZ1xuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgcm91dGVyOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBFbnN1cmUgYXNzZXRzIHVzZSBhYnNvbHV0ZSBwYXRoc1xuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgY29yczogdHJ1ZSwgLy8gRW5hYmxlIENPUlMgZm9yIGFsbCBvcmlnaW5zXG4gICAgaG1yOiB7IG92ZXJsYXk6IHRydWUgfSwgLy8gSW1wcm92ZSBITVIgZXJyb3IgcmVwb3J0aW5nXG4gICAgd2F0Y2g6IHtcbiAgICAgIHVzZVBvbGxpbmc6IHRydWUsIC8vIFVzZSBwb2xsaW5nIGZvciBmaWxlIGNoYW5nZXMgKGhlbHBzIGluIHNvbWUgZW52aXJvbm1lbnRzKVxuICAgIH0sXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tc3RvcmUnLCAvLyBQcmV2ZW50IGJyb3dzZXIgY2FjaGluZ1xuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZXh0ZW5zaW9uczogWycuanMnLCAnLmpzeCcsICcudHMnLCAnLnRzeCcsICcuanNvbiddLCAvLyBFeHBsaWNpdGx5IGRlZmluZSBleHRlbnNpb25zXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxNQUFNO0FBQUE7QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixRQUFRLENBQUMsa0JBQWtCO0FBQUEsUUFDN0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixLQUFLLEVBQUUsU0FBUyxLQUFLO0FBQUE7QUFBQSxJQUNyQixPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUE7QUFBQSxJQUNkO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQTtBQUFBLElBQ25CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsWUFBWSxDQUFDLE9BQU8sUUFBUSxPQUFPLFFBQVEsT0FBTztBQUFBO0FBQUEsRUFDcEQ7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
