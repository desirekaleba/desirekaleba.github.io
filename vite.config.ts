import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Base path for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/rust_staff_engineer_personal_site/' : '/',
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          
          // UI component libraries
          'ui-components': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          
          // Utilities and helpers
          'utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns'
          ],
          
          // Markdown and content processing
          'markdown': [
            'react-markdown',
            'remark-gfm',
            'rehype-raw',
            'rehype-sanitize',
            'react-syntax-highlighter',
            'marked'
          ],
          
          // Charts and visualization
          'charts': ['recharts'],
          
          // PDF handling
          'pdf': ['react-pdf', 'pdfjs-dist'],
          
          // Form handling
          'forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // Other vendor libraries
          'vendor-misc': [
            'lucide-react',
            'next-themes',
            'sonner',
            '@tanstack/react-query'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-markdown',
      'remark-gfm'
    ]
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: true
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    host: true
  }
});
