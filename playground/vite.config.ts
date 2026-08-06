import { defineConfig } from 'vite';

export default defineConfig({
  base: '/playground/',
  worker: {
    format: 'es',
  },
  server: {
    // fixed port so the Next dev server can proxy /playground here
    port: 2199,
    strictPort: true,
    // page is served through the Next proxy (localhost:3000) in dev; point
    // the HMR websocket straight at Vite so hot reload works through it
    hmr: { clientPort: 2199 },
  },
  build: {
    outDir: '../public/playground',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 8000,
  },
});
