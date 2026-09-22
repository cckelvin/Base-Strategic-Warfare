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
  Building2,
  Bell,
  Hammer,
  Cpu,
  Layers,
} from 'lucide-react';
import { COUNTRIES, CountryFlag } from './countries';
import { MILITARY_BASES, MilitaryBase } from './militaryBases';
import BaseModal from './BaseModal';
import UserInfoModal from './UserInfoModal';
import SplashScreen from './SplashScreen';
import NotificationsModal from './NotificationsModal';
import CitiesModal from './CitiesModal';
import ConstructModal from './ConstructModal';
import { MilitaryModal } from './MilitaryModal';
import GameInitModal from './GameInitModal';
import { INITIAL_NOTIFICATIONS, NotificationCategory, NotificationItem } from './notificationsData';
import { AiCountryAgent, createInitialAiAgents, trainAiStep } from './aiLearningSystem';
import { STRATEGIC_CITIES } from './citiesData';


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

  // Full-page user info modal when country flag is clicked
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  // 5-second heavy graphics splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Intelligence & notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsPageOpen, setIsNotificationsPageOpen] = useState(false);
  const [selectedNotificationCategory, setSelectedNotificationCategory] = useState<NotificationCategory | undefined>(undefined);

  // Strategic Cities modal state
  const [isCitiesModalOpen, setIsCitiesModalOpen] = useState(false);

  // User ID and World ID game setup state
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('base_warfare_user_id') || 'CMD-OVERLORD-01';
  });
  const [worldId, setWorldId] = useState<string>(() => {
    return localStorage.getItem('base_warfare_world_id') || 'WORLD-2026-PRIME';
  });
  const [isGameInitialized, setIsGameInitialized] = useState<boolean>(() => {
    return !!localStorage.getItem('base_warfare_initialized');
  });
  const [isGameInitModalOpen, setIsGameInitModalOpen] = useState<boolean>(false);

  // Full-page Construct (Build) modal state
  const [isConstructOpen, setIsConstructOpen] = useState<boolean>(false);

  // Full-page Military command modal state
  const [isMilitaryOpen, setIsMilitaryOpen] = useState<boolean>(false);

  // Occupied city IDs state (for cities section restriction)
  const [occupiedCityIds, setOccupiedCityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('base_warfare_occupied_cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return ['city-cairo'];
  });

  const handleToggleOccupyCity = (cityId: string) => {
    setOccupiedCityIds((prev) => {
      const isAlreadyOccupied = prev.includes(cityId);
      const updated = isAlreadyOccupied ? prev.filter((id) => id !== cityId) : [...prev, cityId];
      localStorage.setItem('base_warfare_occupied_cities', JSON.stringify(updated));

      const targetCity = STRATEGIC_CITIES.find((c) => c.id === cityId);
      const cityName = targetCity ? targetCity.name : cityId;

      if (isAlreadyOccupied) {
        setNotifications((n) => [
          {
            id: `withdraw-${Date.now()}`,
            category: 'military',
            title: 'Garrison Withdrawn',
            summary: `Forces evacuated ${cityName}.`,
            detail: `Strategic forces evacuated ${cityName}. Metropolitan district reverted to sovereign status.`,
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now',
            severity: 'info',
            source: 'JOINT COMMAND',
            isRead: false,
          },
          ...n,
        ]);
      } else {
        setNotifications((n) => [
          {
            id: `occupy-${Date.now()}`,
            category: 'military',
            title: 'Metropolis Annexed & Occupied',
            summary: `Expedition forces seized control of ${cityName}.`,
            detail: `Expedition forces seized control of ${cityName}! Civil administration secured; municipal GDP diverted to national war chest.`,
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now',
            severity: 'critical',
            source: 'EXPEDITION COMMAND',
            isRead: false,
          },
          ...n,
        ]);
      }

      return updated;
    });
  };

  // Internal Learning AI System State (Controls all foreign nations)
  const [aiAgents, setAiAgents] = useState<Record<string, AiCountryAgent>>(() => {
    return createInitialAiAgents(selectedCountry.code);
  });
  const [lastAiTrainingLog, setLastAiTrainingLog] = useState<string | null>(null);

  // AI Training Loop: Foreign nations adapt economy and warfare from training experiences
  useEffect(() => {
    const interval = setInterval(() => {
      setAiAgents((prevAgents) => {
        const { updatedAgents, trainingLog } = trainAiStep(prevAgents, selectedCountry.code);
        if (trainingLog) {
          setLastAiTrainingLog(trainingLog.message);
          // Occasionally trigger an Intelligence alert in the news feed
          if (Math.random() < 0.25) {
            setNotifications((n) => [
              {
                id: `ai-train-${Date.now()}`,
                category: 'external',
                title: `${trainingLog.country} AI Neural Adaptation`,
                summary: trainingLog.message,
                detail: `${trainingLog.country} neural military engine adapted parameters based on live simulation experience. Target nation has strengthened strategic posture.`,
                timestamp: new Date().toISOString(),
                timeAgo: 'Just now',
                severity: 'alert',
                source: 'AI MATRIX SURVEILLANCE',
                isRead: false,
              },
              ...n,
            ]);
          }
        }
        return updatedAgents;
      });
    }, 6500);

    return () => clearInterval(interval);
  }, [selectedCountry.code]);

  const handleInitializeGame = (country: CountryFlag, newUserId: string, newWorldId: string) => {
    setSelectedCountry(country);
    setUserId(newUserId);
    setWorldId(newWorldId);
    setIsGameInitialized(true);
    setIsGameInitModalOpen(false);

    localStorage.setItem('base_warfare_initialized', 'true');
    localStorage.setItem('base_warfare_user_id', newUserId);
    localStorage.setItem('base_warfare_world_id', newWorldId);
    localStorage.setItem('base_warfare_selected_country', JSON.stringify(country));

    // Re-initialize foreign AI learning models based on player country
    const agents = createInitialAiAgents(country.code);
    setAiAgents(agents);

    setNotifications((prev) => [
      {
        id: `init-${Date.now()}`,
        category: 'nation',
        title: 'Theater Boot Initialized',
        summary: `Commander ${newUserId} deployed in command of ${country.name}.`,
        detail: `Commander ${newUserId} deployed in command of ${country.name} across ${newWorldId}. Internal Neural AI matrix synchronized for ${Object.keys(agents).length} foreign nation states.`,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        severity: 'info',
        source: 'STRATEGIC HEADQUARTERS',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const handleDeductMoney = (amount: number) => {
    setMoney((prev) => {
      const next = Math.max(0, prev - amount);
      localStorage.setItem('base_warfare_treasury', String(next));
      return next;
    });
  };

  const handleAddNotification = (title: string, message: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        category: 'nation',
        title,
        summary: message,
        detail: message,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        severity: 'success',
        source: 'MINISTRY OF WORKS',
        isRead: false,
      },
      ...prev,
    ]);
  };

  // Fly map camera to a city coordinate
  const handleFlyToCity = (lat: number, lng: number, _name: string) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 6, {
        duration: 1.8,
      });
    }
  };

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

  // Helper to create a realistic pentagon building military base icon (tiny on map but clear, pentagon building architecture)
  const createMilitaryBaseIcon = (base: MilitaryBase) => {
    return L.divIcon({
      className: 'military-base-marker-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `
        <div class="relative w-7 h-7 flex items-center justify-center cursor-pointer military-base-pin" title="${base.name} (${base.countryName})">
          <!-- Subtle radar beacon ring radiating from fortress -->
          <div class="absolute inset-0 rounded-full border border-amber-400/80 animate-base-beacon pointer-events-none"></div>

          <!-- Pentagon Building Architecture SVG Marker -->
          <svg class="w-6 h-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Pentagon Outer Wall Ring -->
            <polygon points="50,4 96,37 79,90 21,90 4,37" fill="#09090b" stroke="#f59e0b" stroke-width="4.5" stroke-linejoin="round"/>
            
            <!-- Concentric Pentagon Corridors (Pentagon building rings) -->
            <polygon points="50,15 85,41 72,81 28,81 15,41" fill="#18181b" stroke="#d97706" stroke-width="2.5" stroke-linejoin="round"/>
            <polygon points="50,26 74,44 65,72 35,72 26,44" fill="#27272a" stroke="#b45309" stroke-width="2" stroke-linejoin="round"/>
            
            <!-- Pentagon Central Courtyard / Command Hub -->
            <polygon points="50,38 63,48 58,63 42,63 37,48" fill="#f59e0b" stroke="#78350f" stroke-width="1.5" stroke-linejoin="round"/>
            
            <!-- Center Tactical Beacon Core -->
            <circle cx="50" cy="53" r="3.5" fill="#fef08a" />
          </svg>

          <!-- Micro country ownership flag pip -->
          <div class="absolute -top-1 -right-1 w-3.5 h-2.5 rounded-[2px] border border-black overflow-hidden shadow-md">
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

      {/* TOP LEFT CLUSTER: Flag + Money on top row; Floating Notification Bell Button directly below Flag */}
      <div
        id="top-left-status-cluster"
        className="fixed top-2 left-2 sm:top-3.5 sm:left-3.5 z-50 flex flex-col items-start gap-2 sm:gap-2.5"
      >
        {/* Row 1: Circular Flag Button + Compact Money Tab */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Circular Button with Country Flag on it (Clicking opens Full-Page User Info Modal) */}
          <div className="relative">
            <button
              id="country-flag-btn"
              onClick={() => setIsUserInfoOpen(true)}
              title={`Commander Profile: ${selectedCountry.name} (Click to open Commander Terminal)`}
              aria-label={`Nation Flag: ${selectedCountry.name}`}
              className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border-2 border-zinc-700/80 hover:border-red-500 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <img
                src={selectedCountry.flagUrl}
                alt={selectedCountry.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Shorter Floating Tab: Money (Reduces cleanly on smaller screens) */}
          <aside
            id="money-floating-tab"
            className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 rounded-md sm:rounded-lg shadow-xl hover:border-emerald-500/50 transition-all"
          >
            <div
              id="money-icon-container"
              className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded sm:rounded-md bg-emerald-500/15 text-emerald-400 shrink-0"
            >
              <CircleDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
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
                    className="w-20 sm:w-24 bg-zinc-900 border border-emerald-500/50 rounded px-1 py-0.5 text-xs font-mono text-emerald-300 focus:outline-none"
                  />
                  <button
                    id="save-money-btn"
                    onClick={handleSaveMoney}
                    className="p-0.5 sm:p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span
                    id="money-tab-value"
                    className="text-xs sm:text-sm font-bold font-mono tracking-tight text-emerald-400 tabular-nums"
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

        {/* Row 2: Floating Notification Icon Button placed directly below the Flag Icon */}
        <div className="relative">
          <button
            id="floating-notification-bell-btn"
            onClick={() => {
              setSelectedNotificationCategory(undefined);
              setIsNotificationsPageOpen(true);
            }}
            title="Planetary Intelligence & Notifications (Click to open full page)"
            aria-label="Intelligence Notifications Hub"
            className="relative flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border-2 border-zinc-700/80 hover:border-red-500 text-zinc-200 hover:text-white shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 group"
          >
            <Bell className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300 transition-transform duration-200 group-hover:scale-110" />

            {/* Live unread indicator dot & ping animation */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500 border border-zinc-950"></span>
            </span>
          </button>
        </div>
      </div>

      {/* TOP MIDDLE / RIGHT ON MOBILE: Shorter Floating Tab for UTC Game Time */}
      <header
        id="game-time-floating-tab"
        className="fixed top-2 right-2 sm:top-3.5 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-50 flex items-center gap-1.5 sm:gap-2.5 px-2 py-1 sm:px-3.5 sm:py-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 rounded-md sm:rounded-lg shadow-xl hover:border-cyan-500/40 transition-all"
      >
        <div
          id="time-icon-container"
          className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded sm:rounded-md bg-cyan-500/15 text-cyan-400 shrink-0"
        >
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pulsing indicator */}
          <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-emerald-500"></span>
          </span>

          {/* Time & UTC Date in compact inline layout */}
          <span
            id="utc-clock-time"
            className="text-xs sm:text-sm font-bold font-mono tracking-wider text-zinc-100 tabular-nums"
          >
            {hours}:{minutes}:{seconds}
          </span>
          <span className="hidden sm:inline text-zinc-600 text-xs font-mono">|</span>
          <span
            id="utc-clock-date"
            className="hidden sm:inline text-[11px] font-mono text-cyan-300/80 tracking-wide tabular-nums uppercase"
          >
            {day} {month} {year} UTC
          </span>
          <span className="sm:hidden text-[9px] font-mono text-cyan-400/80 font-bold uppercase">
            UTC
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

      {/* TOP RIGHT: Commander Call-sign & World ID chip with AI Learning Matrix indicator */}
      <div
        id="commander-world-chip"
        className="fixed top-2 right-2 sm:top-3.5 sm:right-3.5 z-40 hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 rounded-lg shadow-xl"
      >
        <button
          onClick={() => setIsGameInitModalOpen(true)}
          title="Click to Switch World or Reconfigure Commander"
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="font-mono text-[10px]">
            <span className="text-amber-400 font-bold group-hover:text-amber-300 block">{userId}</span>
            <span className="text-zinc-500 font-bold block">{worldId}</span>
          </div>
        </button>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
          <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>AI MATRIX ACTIVE ({Object.keys(aiAgents).length} NATIONS)</span>
        </div>
      </div>

      {/* BOTTOM LEFT: Cities Button (Restricted: only player nation or occupied cities viewable) */}
      <div
        id="bottom-left-cities-container"
        className="fixed bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-40"
      >
        <button
          id="cities-bottom-left-btn"
          onClick={() => setIsCitiesModalOpen(true)}
          title={`Strategic Megacities (${selectedCountry.name} & Occupied Territories)`}
          aria-label="Strategic Megacities"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-cyan-950/95 hover:bg-cyan-900 border border-cyan-500/80 hover:border-cyan-400 text-cyan-200 hover:text-white shadow-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer active:scale-95 group font-mono shrink-0"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded sm:rounded-md bg-cyan-900/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 group-hover:text-white shrink-0">
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">CITIES</span>
          <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.2 rounded-full bg-cyan-800/80 text-[9px] sm:text-[10px] text-cyan-300 border border-cyan-600/50 font-bold">
            {STRATEGIC_CITIES.filter((c) => c.countryCode === selectedCountry.code || occupiedCityIds.includes(c.id)).length}
          </span>
        </button>
      </div>

      {/* BOTTOM RIGHT CORNER: Military Button + Hammer Icon Button (Build) with Pinpoint above it */}
      <div
        id="bottom-right-cluster-container"
        className="fixed right-2.5 bottom-2.5 sm:right-4 sm:bottom-4 z-50 flex items-end gap-2.5 sm:gap-3"
      >
        {/* Military Button (stenciled military crimson) */}
        <button
          id="military-btn"
          type="button"
          onClick={() => setIsMilitaryOpen(true)}
          aria-label="Military Command"
          title="Military Command"
          className="relative flex items-center justify-center px-4 py-2 sm:px-8 sm:py-3.5 md:px-10 md:py-4 min-w-[95px] sm:min-w-[155px] md:min-w-[195px] h-10 sm:h-12 md:h-13 rounded-full camo-crimson-bg border-2 border-red-400/90 shadow-[0_10px_35px_-3px_rgba(220,38,38,0.7),0_0_25px_rgba(239,68,68,0.45)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden group tracking-wider shrink-0"
        >
          <div className="absolute inset-0 rounded-full bg-black/15 group-hover:bg-black/5 transition-colors" />
          <div className="absolute inset-1 rounded-full border border-red-200/40" />
          <span
            id="military-btn-text"
            className="relative text-xs sm:text-sm md:text-base font-black tracking-widest text-white uppercase font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
          >
            MILITARY
          </span>
        </button>

        {/* Pinpoint Button & Hammer Button Column:
            - Pinpoint button is directly above the Hammer button
            - Hammer button is placed after the military button
            - Hammer button is an exact circle (rounded-full aspect-square)
            - Hammer button is taller than the military button height (military is h-10/12/13, hammer is w-13 h-13 / w-16 h-16 / w-18 h-18)
        */}
        <div id="pinpoint-hammer-stack" className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Universal Compass Pinpoint button directly above hammer */}
          <button
            id="compass-pinpoint-btn"
            onClick={() => setIsPinpointActive(!isPinpointActive)}
            title={
              isPinpointActive
                ? 'Compass active: Click any area on map to pinpoint coordinate'
                : 'Activate Compass: Pinpoints universal planetary coordinate on map'
            }
            aria-label="Universal Planetary Compass"
            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isPinpointActive
                ? 'bg-amber-500 text-zinc-950 border-amber-300 ring-2 ring-amber-400/50 scale-110'
                : 'bg-zinc-950/85 hover:bg-zinc-900 text-amber-400 border-zinc-700/80 hover:border-amber-400/70 hover:scale-105'
            }`}
          >
            <Compass
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                isPinpointActive ? 'rotate-45' : ''
              }`}
            />
          </button>

          {/* Hammer Icon Button (Build) */}
          <button
            id="construct-hammer-btn"
            type="button"
            onClick={() => setIsConstructOpen(true)}
            aria-label="Construct (Build)"
            title="Construct (Build): Heavy Infrastructure, Megaprojects & Munitions"
            className="relative flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full aspect-square bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-2 border-amber-200/90 shadow-[0_10px_35px_rgba(245,158,11,0.7),0_0_20px_rgba(251,191,36,0.5)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 group"
          >
            <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
            <Hammer className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-zinc-950 group-hover:rotate-12 transition-transform duration-200 drop-shadow" />
          </button>
        </div>
      </div>

      {/* FULL PAGE NOTIFICATIONS PAGE: Emerges when clicking news bell button */}
      {isNotificationsPageOpen && (
        <NotificationsModal
          initialCategory={selectedNotificationCategory}
          onClose={() => setIsNotificationsPageOpen(false)}
          onShowComingSoon={showComingSoon}
        />
      )}

      {/* STRATEGIC CITIES MODAL: Emerges when clicking CITIES button (Only your country or occupied cities viewable) */}
      {isCitiesModalOpen && (
        <CitiesModal
          userCountry={selectedCountry}
          occupiedCityIds={occupiedCityIds}
          onToggleOccupyCity={handleToggleOccupyCity}
          onClose={() => setIsCitiesModalOpen(false)}
          onFlyToCity={handleFlyToCity}
          onShowComingSoon={showComingSoon}
        />
      )}

      {/* FULL PAGE CONSTRUCT MODAL: Emerges when clicking Hammer button (Top notch "Construct" + left hamburger menu) */}
      {isConstructOpen && (
        <ConstructModal
          money={money}
          onDeductMoney={handleDeductMoney}
          onAddNotification={handleAddNotification}
          onClose={() => setIsConstructOpen(false)}
        />
      )}

      {/* FULL PAGE MILITARY COMMAND MODAL: Top nav notch for base, intel, activity, units, stats, programs */}
      {isMilitaryOpen && (
        <MilitaryModal
          userCountry={selectedCountry}
          money={money}
          aiAgents={aiAgents}
          onDeductMoney={handleDeductMoney}
          onAddNotification={handleAddNotification}
          onFlyToBase={(lat, lng, zoom) => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([lat, lng], zoom || 8, { duration: 1.5 });
            }
          }}
          onClose={() => setIsMilitaryOpen(false)}
        />
      )}

      {/* INITIAL GAME SETUP MODAL: Input country, User ID, World ID on first load */}
      {isGameInitModalOpen && (
        <GameInitModal
          initialCountry={selectedCountry}
          initialUserId={userId}
          initialWorldId={worldId}
          canCancel={isGameInitialized}
          onCancel={() => setIsGameInitModalOpen(false)}
          onInitializeGame={handleInitializeGame}
        />
      )}

      {/* FULL PAGE USER INFO MODAL: Emerges when user taps the country flag button */}
      {isUserInfoOpen && (
        <UserInfoModal
          country={selectedCountry}
          userId={userId}
          worldId={worldId}
          onOpenGameSetup={() => setIsGameInitModalOpen(true)}
          onSelectCountry={handleSelectCountry}
          onClose={() => setIsUserInfoOpen(false)}
          onShowComingSoon={showComingSoon}
        />
      )}

      {/* FULL PAGE BASE MODAL: Emerges when a military base on map is clicked */}
      {selectedBase && (
        <BaseModal
          base={selectedBase}
          onClose={() => setSelectedBase(null)}
          onShowComingSoon={showComingSoon}
        />
      )}

      {/* 5-SECOND HEAVY GRAPHICS SPLASH SCREEN WITH MOVING MILITARY & ECONOMIC VALUE ANIMATIONS */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            if (!isGameInitialized) {
              setIsGameInitModalOpen(true);
            }
          }}
        />
      )}
    </main>
  );
}
