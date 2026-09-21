/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import * as L from 'leaflet';
import {
  CircleDollarSign,
  Clock,
  Pencil,
  Check,
  Compass,
  Crosshair,
  MapPin,
  Copy,
} from 'lucide-react';
import { COUNTRIES, CountryFlag } from './countries';
import { MILITARY_BASES, MilitaryBase } from './militaryBases';
import BaseModal from './BaseModal';

// Formats coordinates to DMS and Decimal string
function formatCoordinates(lat: number, lng: number) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const absLat = Math.abs(lat);
  const absLng = Math.abs(lng);

  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = ((absLat - latDeg - latMin / 60) * 3600).toFixed(1);

  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);
  const lngSec = ((absLng - lngDeg - lngMin / 60) * 3600).toFixed(1);

  const dms = `${latDeg}°${latMin}'${latSec}"${latDir}  ${lngDeg}°${lngMin}'${lngSec}"${lngDir}`;
  const dec = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  return { dms, dec };
}

export default function App() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  // Selected Base for full-page popup modal
  const [selectedBase, setSelectedBase] = useState<MilitaryBase | null>(null);

  // Global Coming Soon toast notification for unconfigured actions
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  const showComingSoon = (featureName: string) => {
    setComingSoonToast(`${featureName}: Coming Soon`);
    setTimeout(() => {
      setComingSoonToast(null);
    }, 2800);
  };

  // Selected Country for the circular flag button
  const [selectedCountry, setSelectedCountry] = useState<CountryFlag>(() => {
    const saved = localStorage.getItem('base_warfare_selected_country');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return COUNTRIES[0];
  });

  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  // Money state with customizable starting treasury (persisted to prevent resets)
  const [money, setMoney] = useState<number>(() => {
    const saved = localStorage.getItem('base_warfare_treasury');
    return saved ? Number(saved) : 100000000;
  });
  const [isEditingMoney, setIsEditingMoney] = useState<boolean>(false);
  const [tempMoneyInput, setTempMoneyInput] = useState<string>('100000000');

  // Real-world UTC Game Time
  const [currentUtc, setCurrentUtc] = useState<Date>(new Date());

  // Compass Pinpoint Mode & Universal Planetary Coordinates (Permanent, persistent and copyable)
  const [isPinpointActive, setIsPinpointActive] = useState<boolean>(false);
  const [pinnedCoord, setPinnedCoord] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('base_warfare_pinned_coord');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Copy feedback state
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Ref to track pinpoint active mode in map event listener without re-binding
  const isPinpointActiveRef = useRef(isPinpointActive);
  useEffect(() => {
    isPinpointActiveRef.current = isPinpointActive;
    if (mapContainerRef.current) {
      if (isPinpointActive) {
        mapContainerRef.current.classList.add('crosshair-cursor');
      } else {
        mapContainerRef.current.classList.remove('crosshair-cursor');
      }
    }
  }, [isPinpointActive]);

  // Update real-world UTC time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUtc(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save selected country to local storage
  const handleSelectCountry = (country: CountryFlag) => {
    setSelectedCountry(country);
    localStorage.setItem('base_warfare_selected_country', JSON.stringify(country));
    setIsCountryPickerOpen(false);
  };

  // Save money changes
  const handleSaveMoney = () => {
    const parsed = Number(tempMoneyInput.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(parsed) && parsed >= 0) {
      setMoney(parsed);
      localStorage.setItem('base_warfare_treasury', String(parsed));
    }
    setIsEditingMoney(false);
  };

  // Helper to copy coordinates with fallback support for all browser/iframe environments
  const handleCopyCoordinate = (textToCopy?: string) => {
    if (!pinnedCoord && !textToCopy) return;
    const targetText =
      textToCopy ||
      (pinnedCoord
        ? `${formatCoordinates(pinnedCoord.lat, pinnedCoord.lng).dms} (${pinnedCoord.lat.toFixed(6)}, ${pinnedCoord.lng.toFixed(6)})`
        : '');

    if (!targetText) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(targetText)
        .then(() => {
          showCopySuccess();
        })
        .catch(() => {
          fallbackCopyText(targetText);
        });
    } else {
      fallbackCopyText(targetText);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showCopySuccess();
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const showCopySuccess = () => {
    setCopiedNotification('COORDINATES COPIED');
    setTimeout(() => {
      setCopiedNotification(null);
    }, 2500);
  };

  // Helper to render high-contrast tactical pinpoint marker with permanent coordinates
  const renderMarkerOnMap = (map: L.Map, lat: number, lng: number) => {
    if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
    }

    const { dms, dec } = formatCoordinates(lat, lng);

    // Custom tactical pulsed crosshair icon
    const customIcon = L.divIcon({
      className: 'custom-pinpoint-icon',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div class="absolute w-8 h-8 rounded-full border border-amber-400 bg-amber-400/20 animate-pinpoint-pulse"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-zinc-950 shadow-lg flex items-center justify-center">
            <div class="w-1 h-1 rounded-full bg-zinc-950"></div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    // Coordinate popup with direct copy action
    const popupContent = document.createElement('div');
    popupContent.style.fontFamily = 'monospace';
    popupContent.style.fontSize = '11px';
    popupContent.style.lineHeight = '1.4';
    popupContent.style.color = '#18181b';
    popupContent.style.padding = '4px';

    popupContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 8px;">
        <span style="font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em;">
          UNIVERSAL PLANET COORDINATE
        </span>
      </div>
      <div style="font-size: 12px; font-weight: 700; color: #09090b; background: #f4f4f5; padding: 4px 6px; border-radius: 4px; border: 1px solid #e4e4e7; margin-bottom: 4px; user-select: all;">
        ${dms}
      </div>
      <div style="color: #52525b; font-size: 11px; margin-bottom: 6px; user-select: all;">
        DEC: <strong>${dec}</strong>
      </div>
      <button id="popup-copy-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 4px; background: #27272a; color: #f4f4f5; border: none; padding: 5px 8px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;">
        📋 Copy Coordinate
      </button>
      <div style="color: #71717a; font-size: 9px; margin-top: 4px; text-align: center; border-top: 1px dashed #d4d4d8; padding-top: 3px;">
        PERMANENT PLANETARY RECORD
      </div>
    `;

    const copyBtn = popupContent.querySelector('#popup-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        handleCopyCoordinate(`${dms} (${dec})`);
      });
    }

    marker
      .bindPopup(popupContent, {
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
        maxWidth: 280,
      })
      .openPopup();

    pinMarkerRef.current = marker;
  };

  // Helper to create a realistic, refined military base icon (tiny on map but clear, tactical, not too tiny)
  const createMilitaryBaseIcon = (base: MilitaryBase) => {
    return L.divIcon({
      className: 'military-base-marker-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `
        <div class="relative w-7 h-7 flex items-center justify-center cursor-pointer military-base-pin" title="${base.name} (${base.countryName})">
          <!-- Subtle radar beacon ring -->
          <div class="absolute inset-0 rounded-full border border-amber-400/80 animate-base-beacon pointer-events-none"></div>

          <!-- Outer tactical ring -->
          <div class="w-6 h-6 rounded-full bg-zinc-950/90 border-2 border-amber-500 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <!-- Realistic military radar/fortress silhouette SVG -->
            <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Strategic Fortress / Radar Outpost emblem -->
              <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" fill="rgba(245, 158, 11, 0.25)"/>
              <circle cx="12" cy="11" r="2.5" fill="#f59e0b" stroke="none" />
              <path d="M12 6v2M12 14v2M7 11h2M15 11h2"/>
            </svg>
          </div>

          <!-- Micro country ownership pip -->
          <div class="absolute -top-0.5 -right-0.5 w-3 h-2 rounded-[1px] border border-black overflow-hidden shadow">
            <img src="${base.flagUrl}" class="w-full h-full object-cover" alt="" />
          </div>
        </div>
      `,
    });
  };

  // Initialize live satellite world map once with reliable standard caching and persistent position
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Load saved map viewport if available to avoid reloading position
    const savedCenter = localStorage.getItem('base_warfare_map_center');
    const savedZoom = localStorage.getItem('base_warfare_map_zoom');

    const initialCenter: [number, number] = savedCenter ? JSON.parse(savedCenter) : [25, 10];
    const initialZoom = savedZoom ? Number(savedZoom) : 3;

    // Initialize Leaflet map instance centered globally (maxZoom restricted to 10 so users cannot zoom into actual live buildings)
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 10, // Restricts zoom so high-res ground buildings are not visible
      worldCopyJump: true,
      zoomControl: false,
    });

    // Save map position on move to cache user's current strategic view
    map.on('moveend', () => {
      const center = map.getCenter();
      localStorage.setItem(
        'base_warfare_map_center',
        JSON.stringify([Number(center.lat.toFixed(5)), Number(center.lng.toFixed(5))])
      );
      localStorage.setItem('base_warfare_map_zoom', String(map.getZoom()));
    });

    // High-resolution Esri World Imagery (satellite view)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          '&copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> World Imagery',
        maxZoom: 10,
        noWrap: false,
        keepBuffer: 6,
        updateWhenIdle: true,
        updateWhenZooming: false,
      }
    ).addTo(map);

    // Country borders and place names overlay
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '',
        maxZoom: 10,
        opacity: 0.9,
        keepBuffer: 6,
        updateWhenIdle: true,
      }
    ).addTo(map);

    // Add zoom control at bottom right (above military button)
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    // Place realistic military base icons in requested locations
    MILITARY_BASES.forEach((base) => {
      const baseIcon = createMilitaryBaseIcon(base);
      const baseMarker = L.marker([base.lat, base.lng], {
        icon: baseIcon,
        zIndexOffset: 500,
      }).addTo(map);

      // On click: Open full page emerges modal with base details
      baseMarker.on('click', () => {
        setSelectedBase(base);
      });
    });

    // If there is an existing pinned universal coordinate, render the permanent marker
    if (pinnedCoord) {
      renderMarkerOnMap(map, pinnedCoord.lat, pinnedCoord.lng);
    }

    // Single stable click handler for map
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!isPinpointActiveRef.current) return;

      const normalizedLat = Number(e.latlng.lat.toFixed(6));
      const normalizedLng = Number(e.latlng.lng.toFixed(6));

      const newCoord = { lat: normalizedLat, lng: normalizedLng };
      setPinnedCoord(newCoord);
      localStorage.setItem('base_warfare_pinned_coord', JSON.stringify(newCoord));

      renderMarkerOnMap(map, normalizedLat, normalizedLng);
    });

    mapInstanceRef.current = map;

    // Handle container resize
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    const resizeTimeout = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Formatter for UTC time and date
  const hours = String(currentUtc.getUTCHours()).padStart(2, '0');
  const minutes = String(currentUtc.getUTCMinutes()).padStart(2, '0');
  const seconds = String(currentUtc.getUTCSeconds()).padStart(2, '0');
  const day = String(currentUtc.getUTCDate()).padStart(2, '0');

  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const month = monthNames[currentUtc.getUTCMonth()];
  const year = currentUtc.getUTCFullYear();

  const formattedMoney = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(money);

  return (
    <main
      id="game-viewport"
      className="relative w-screen h-screen overflow-hidden bg-zinc-950 font-sans select-none"
    >
      {/* World Map Live Satellite View of Each Country (Main Background) - Stable fixed className */}
      <div
        id="satellite-world-map"
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* TOP LEFT CLUSTER: Circular Flag Button + Compact Money Tab */}
      <div
        id="top-left-status-cluster"
        className="fixed top-3.5 left-3.5 z-50 flex items-center gap-2"
      >
        {/* Circular Button with Country Flag on it */}
        <div className="relative">
          <button
            id="country-flag-btn"
            onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
            title={`Selected Nation: ${selectedCountry.name} (Click to change)`}
            aria-label={`Nation Flag: ${selectedCountry.name}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border-2 border-zinc-700/80 hover:border-amber-400/80 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-200 cursor-pointer active:scale-95 group"
          >
            <img
              src={selectedCountry.flagUrl}
              alt={selectedCountry.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Quick country selection dropdown */}
          {isCountryPickerOpen && (
            <div
              id="country-picker-dropdown"
              className="absolute top-12 left-0 w-52 max-h-64 overflow-y-auto bg-zinc-950/95 border border-zinc-700/80 rounded-xl p-1.5 shadow-2xl backdrop-blur-md z-50 flex flex-col gap-1"
            >
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                Select Base Country
              </div>
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelectCountry(country)}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    selectedCountry.code === country.code
                      ? 'bg-amber-500/20 text-amber-300 font-medium'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <img
                    src={country.flagUrl}
                    alt={country.name}
                    className="w-5 h-3.5 object-cover rounded-xs"
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate">{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shorter Floating Tab: Money */}
        <aside
          id="money-floating-tab"
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 rounded-lg shadow-xl hover:border-emerald-500/50 transition-all"
        >
          <div
            id="money-icon-container"
            className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-400"
          >
            <CircleDollarSign className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5">
            {isEditingMoney ? (
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-mono text-xs font-semibold">$</span>
                <input
                  id="money-input-field"
                  type="text"
                  value={tempMoneyInput}
                  onChange={(e) => setTempMoneyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveMoney();
                    if (e.key === 'Escape') setIsEditingMoney(false);
                  }}
                  autoFocus
                  className="w-24 bg-zinc-900 border border-emerald-500/50 rounded px-1 py-0.5 text-xs font-mono text-emerald-300 focus:outline-none"
                />
                <button
                  id="save-money-btn"
                  onClick={handleSaveMoney}
                  className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span
                  id="money-tab-value"
                  className="text-sm font-bold font-mono tracking-tight text-emerald-400 tabular-nums"
                >
                  {formattedMoney}
                </span>
                <button
                  id="edit-money-btn"
                  onClick={() => {
                    setTempMoneyInput(String(money));
                    setIsEditingMoney(true);
                  }}
                  title="Edit Treasury"
                  aria-label="Edit Treasury"
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded cursor-pointer"
                >
                  <Pencil className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* TOP MIDDLE: Shorter Floating Tab for UTC Game Time */}
      <header
        id="game-time-floating-tab"
        className="fixed top-3.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-3.5 py-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 rounded-lg shadow-xl hover:border-cyan-500/40 transition-all"
      >
        <div
          id="time-icon-container"
          className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/15 text-cyan-400"
        >
          <Clock className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-2">
          {/* Pulsing indicator */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>

          {/* Time & UTC Date in compact inline layout */}
          <span
            id="utc-clock-time"
            className="text-sm font-bold font-mono tracking-wider text-zinc-100 tabular-nums"
          >
            {hours}:{minutes}:{seconds}
          </span>
          <span className="text-zinc-600 text-xs font-mono">|</span>
          <span
            id="utc-clock-date"
            className="text-[11px] font-mono text-cyan-300/80 tracking-wide tabular-nums uppercase"
          >
            {day} {month} {year} UTC
          </span>
        </div>
      </header>

      {/* Active Pinpoint status banner when compass coordinate pinning is engaged */}
      {isPinpointActive && (
        <div
          id="pinpoint-active-banner"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/60 rounded-full text-amber-300 text-xs font-mono backdrop-blur-md shadow-lg pointer-events-none"
        >
          <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Click anywhere on the world map to pinpoint planetary coordinate</span>
        </div>
      )}

      {/* Copied to clipboard toast notification */}
      {copiedNotification && (
        <div
          id="copy-notification-toast"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-1.5 bg-emerald-500/90 text-zinc-950 font-mono font-bold text-xs rounded-full shadow-2xl backdrop-blur-md border border-emerald-300 animate-bounce"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Coming Soon Toast Notification */}
      {comingSoonToast && (
        <div
          id="coming-soon-toast"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 px-5 py-2.5 bg-zinc-900/95 text-amber-300 border border-amber-500/80 font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{comingSoonToast}</span>
        </div>
      )}

      {/* Permanent Planet Coordinate Display Badge if pinned (with quick copy button) */}
      {pinnedCoord && !isPinpointActive && (
        <div
          id="pinned-coord-badge"
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 bg-zinc-950/90 border border-amber-500/40 hover:border-amber-400 rounded-lg text-xs font-mono backdrop-blur-md shadow-xl text-zinc-300 transition-colors"
        >
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([pinnedCoord.lat, pinnedCoord.lng], 7, {
                  duration: 1.5,
                });
                pinMarkerRef.current?.openPopup();
              }
            }}
            title="Focus map on coordinate"
            className="flex items-center gap-1.5 hover:text-amber-300 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
              Planet Coord:
            </span>
            <span className="text-amber-400 font-bold tabular-nums">
              {pinnedCoord.lat.toFixed(4)}°, {pinnedCoord.lng.toFixed(4)}°
            </span>
          </button>

          <span className="text-zinc-700">|</span>

          <button
            id="copy-pinned-coord-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyCoordinate();
            }}
            title="Copy coordinates to clipboard"
            aria-label="Copy coordinates"
            className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 transition-colors cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span className="font-semibold">COPY</span>
          </button>
        </div>
      )}

      {/* RIGHT EDGE CONTROLS: Tiny compass icon button above military */}
      <div
        id="right-edge-controls"
        className="fixed right-4 bottom-24 z-50 flex flex-col items-center gap-2"
      >
        {/* Tiny compass icon button */}
        <button
          id="compass-pinpoint-btn"
          onClick={() => setIsPinpointActive(!isPinpointActive)}
          title={
            isPinpointActive
              ? 'Compass active: Click any area on map to pinpoint coordinate'
              : 'Activate Compass: Pinpoints universal planetary coordinate on map'
          }
          aria-label="Universal Planetary Compass"
          className={`flex items-center justify-center w-8 h-8 rounded-full border shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isPinpointActive
              ? 'bg-amber-500 text-zinc-950 border-amber-300 ring-2 ring-amber-400/50 scale-110'
              : 'bg-zinc-950/85 hover:bg-zinc-900 text-amber-400 border-zinc-700/80 hover:border-amber-400/70 hover:scale-105'
          }`}
        >
          <Compass
            className={`w-4 h-4 transition-transform duration-300 ${
              isPinpointActive ? 'rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* BOTTOM RIGHT CORNER: Military Button (circular floating camo color button with military text, triggers Coming Soon if clicked) */}
      <div id="bottom-right-military-container" className="fixed right-4 bottom-4 z-50">
        <button
          id="military-btn"
          type="button"
          onClick={() => showComingSoon('Global Military Command')}
          aria-label="Military"
          title="Military Command"
          className="relative flex items-center justify-center w-16 h-16 rounded-full camo-bg border-2 border-emerald-900/90 shadow-[0_10px_25px_-3px_rgba(0,0,0,0.8),0_0_15px_rgba(46,58,36,0.5)] transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden group"
        >
          {/* Subtle camo tactical ring texture */}
          <div className="absolute inset-0 rounded-full bg-black/25 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-1 rounded-full border border-emerald-300/20" />

          {/* Stenciled Military Text */}
          <span
            id="military-btn-text"
            className="relative text-[10px] font-black tracking-widest text-emerald-100 uppercase font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          >
            MILITARY
          </span>
        </button>
      </div>

      {/* FULL PAGE BASE MODAL: Emerges when a military base on map is clicked */}
      {selectedBase && (
        <BaseModal
          base={selectedBase}
          onClose={() => setSelectedBase(null)}
          onShowComingSoon={showComingSoon}
        />
      )}
    </main>
  );
}
