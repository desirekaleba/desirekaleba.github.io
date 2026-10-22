import { defineConfig } from 'astro/config';

// GitHub Pages user site, served from the root path.
export default defineConfig({
  site: 'https://desirekaleba.github.io',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  vite: {
    // three.js is a deliberate, lazily loaded chunk of about 150 KB gzipped.
    build: { chunkSizeWarningLimit: 650 },
  },
});
