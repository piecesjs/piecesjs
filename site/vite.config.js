import { defineConfig } from 'vite';

export default defineConfig({
  base: '/piecesjs/',
  build: {
    outDir: '../docs',
    assetsDir: 'assets',
  },
});
