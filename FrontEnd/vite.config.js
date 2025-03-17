import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  build: {
    outDir: 'build',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  server: {
    port: 3000,  // Change the port to 3000
  },
  plugins: [
    react(),
    envCompatible(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
});