import { defineConfig } from 'vite';

export default defineConfig({
  base: '/playground/',
  server: {
    // fixed port so the Next dev server can proxy /playground here
    port: 5199,
    strictPort: true,
    // page is served through the Next proxy (localhost:3000) in dev; point
    // the HMR websocket straight at Vite so hot reload works through it
    hmr: { clientPort: 5199 },
  },
  build: {
    outDir: '../public/playground',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 8000,
  },
});
