import { defineConfig } from 'vite';

export default defineConfig({
  base: '/playground/',
  build: {
    outDir: '../public/playground',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 8000,
  },
});
