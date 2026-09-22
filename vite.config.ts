import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'Base: Strategic Warfare',
          short_name: 'BaseWarfare',
          description: 'Live satellite world map tactical military overview with real-time bases, intelligence, and theater command.',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/server\.arcgisonline\.com\/ArcGIS\/rest\/services\/World_Imagery\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'esri-satellite-tiles',
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/services\.arcgisonline\.com\/ArcGIS\/rest\/services\/Reference\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'esri-reference-tiles',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'flagcdn-flags',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/military-database': {
          target: 'https://api.airtable.com/v0',
          changeOrigin: true,
          secure: true,
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY || ''}`,
          },
          rewrite: (pathStr: string) => {
            const baseId = process.env.AIRTABLE_BASE_ID || 'app6PrZu6VsFDWpWS';
            const tablePart = pathStr.replace(/^\/api\/military-database/, '');
            return `/${baseId}${tablePart}`;
          },
        },
        '/api/airtable': {
          target: 'https://api.airtable.com/v0',
          changeOrigin: true,
          secure: true,
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY || ''}`,
          },
          rewrite: (pathStr: string) => pathStr.replace(/^\/api\/airtable/, ''),
        },
      },
    },
  };
});
