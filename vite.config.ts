import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          markdown: ['react-markdown', 'gray-matter', 'marked', 'rehype-raw', 'rehype-sanitize', 'remark-gfm'],
          charts: ['recharts'],
          pdf: ['react-pdf', 'pdfjs-dist'],
        },
      },
    },
    // Optimize assets
    assetsInlineLimit: 4096,
    // Enable sourcemaps in production for debugging
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Use esbuild for minification (faster and no extra dependency)
    minify: 'esbuild',
    // Target modern browsers for better optimization with Node 20 LTS
    target: 'es2022',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Security headers and optimization for production
  preview: {
    port: 3000,
    strictPort: true,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
}));
