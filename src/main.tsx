import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update & caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('App update available');
  },
  onOfflineReady() {
    console.log('App is ready for offline strategic warfare');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
