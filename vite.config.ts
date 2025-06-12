import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Use absolute paths for proper module loading
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Ensure assets use absolute paths
    assetsDir: 'assets',
  },
  server: {
    host: "::",
    port: 8080,
    cors: true, // Enable CORS for all origins
    hmr: { overlay: true }, // Improve HMR error reporting
    watch: {
      usePolling: true, // Use polling for file changes (helps in some environments)
    },
    headers: {
      'Cache-Control': 'no-store', // Prevent browser caching
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // Explicitly define extensions
  },
}));
