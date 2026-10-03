import { defineConfig } from 'vite';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  // 'base: "./"' ensures asset paths in HTML are relative, allowing Electron to load them via file://
  base: './', 
  plugins: [
    // This safely bridges Electron features if you need them later, without breaking browser compatibility
    renderer(), 
  ],
  build: {
    outDir: 'dist/renderer', // Where the compiled web bundle will go
  },
});