import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Vite replaces Create React App (react-scripts) as the client build tool and
// dev server. Two CRA output conventions are kept deliberately:
//   - outDir 'build'  - root package.json copies ./build to ../../dist
//   - assetsDir 'static' - src/server/main.go sets the one-year Cache-Control
//     header only on paths containing "/static"
// Port 3000 is what start-server-and-test, the Cypress specs and the README use.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      // The app registers the worker itself (src/serviceWorkerRegistration.ts).
      injectRegister: false,
      // public/manifest.json is kept as it is.
      manifest: false,
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
    emptyOutDir: true,
  },
});
