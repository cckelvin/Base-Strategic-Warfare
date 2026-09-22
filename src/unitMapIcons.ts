// Tactical unit icon generators for Leaflet map:
// Renders realistic satellite or side-tilted top-down views of units:
// Missiles (with rocket trail & illuminating fire exhaust effect), Jets, Tanks, Infantry.

import L from 'leaflet';
import { ActiveMission } from './missionService';

/**
 * Creates custom HTML / SVG DivIcon for an en-route military unit on the Leaflet map.
 */
export function createTacticalUnitMapIcon(mission: ActiveMission): L.DivIcon {
  const { primaryCategory, headingDeg, type, status, cruisingSpeedKmH } = mission;
  const isAttack = type === 'strike';
  const isHalted = status === 'halted';

  // SVG graphic depending on unit type
  let unitSvg = '';
  let iconWidth = 54;
  let iconHeight = 54;

  if (primaryCategory === 'missile') {
    iconWidth = 60;
    iconHeight = 60;
    // MISSILE: Long streamlined rocket body with guidance fins, illuminating rocket fire flame effect at tail
    unitSvg = `
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Illuminating rocket exhaust flame & glow -->
        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <!-- Outer radiant blast halo -->
          <div class="w-7 h-7 rounded-full bg-amber-500/40 blur-[4px] animate-pulse"></div>
          <!-- Piercing fire exhaust core -->
          <div class="w-3 h-8 -mt-6 bg-gradient-to-b from-white via-yellow-300 to-transparent rounded-full shadow-[0_0_14px_#f97316] animate-ping [animation-duration:0.6s]"></div>
        </div>

        <!-- Trailing smoke vapor particles -->
        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-80 pointer-events-none">
          <span class="w-2 h-2 rounded-full bg-zinc-300/40 blur-[1px]"></span>
          <span class="w-3.5 h-3.5 -mt-1 rounded-full bg-zinc-400/30 blur-[2px]"></span>
        </div>

        <!-- Aerodynamic missile fuselage -->
        <svg viewBox="0 0 40 80" class="w-7 h-14 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
          <!-- Rocket Body -->
          <path d="M 20 2 C 22 10, 24 22, 24 55 L 16 55 C 16 22, 18 10, 20 2 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5" />
          <!-- Nose cone warhead (Crimson for Strike) -->
          <path d="M 20 2 C 21 8, 23 15, 23 20 L 17 20 C 17 15, 19 8, 20 2 Z" fill="#ef4444" />
          <!-- Guidance canard wings -->
          <polygon points="17,20 12,25 17,27" fill="#475569" />
          <polygon points="23,20 28,25 23,27" fill="#475569" />
          <!-- Main tail stability delta fins -->
          <polygon points="16,45 6,60 16,56" fill="#334155" stroke="#0f172a" stroke-width="1" />
          <polygon points="24,45 34,60 24,56" fill="#334155" stroke="#0f172a" stroke-width="1" />
          <polygon points="18,52 20,58 22,52" fill="#1e293b" />
          <!-- Rocket exhaust nozzle -->
          <rect x="18" y="55" width="4" height="3" fill="#f97316" />
        </svg>
      </div>
    `;
  } else if (primaryCategory === 'air') {
    iconWidth = 56;
    iconHeight = 56;
    // JET: Satellite / side-tilted top-down supersonic fighter jet with delta wings & afterburner flame
    unitSvg = `
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Twin supersonic engine jet exhaust -->
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 pointer-events-none">
          <div class="w-1.5 h-4 bg-gradient-to-b from-cyan-300 via-sky-400 to-transparent rounded-full shadow-[0_0_8px_#38bdf8] animate-pulse"></div>
          <div class="w-1.5 h-4 bg-gradient-to-b from-cyan-300 via-sky-400 to-transparent rounded-full shadow-[0_0_8px_#38bdf8] animate-pulse"></div>
        </div>

        <!-- Fighter Jet Satellite Silhouette -->
        <svg viewBox="0 0 60 70" class="w-11 h-13 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
          <!-- Stealth fuselage & delta wings -->
          <path d="M 30 3 L 34 16 L 56 46 L 50 49 L 36 42 L 36 58 L 44 64 L 40 66 L 30 62 L 20 66 L 16 64 L 24 58 L 24 42 L 10 49 L 4 46 L 26 16 Z"
                fill="#334155" stroke="#0f172a" stroke-width="1.5" />
          <!-- Cockpit glass canopy -->
          <ellipse cx="30" cy="20" rx="2.5" ry="7" fill="#38bdf8" opacity="0.9" />
          <!-- Wing leading edge stripes / insignia -->
          <line x1="30" y1="28" x2="30" y2="44" stroke="#64748b" stroke-width="2" />
          <path d="M 24 38 L 16 46" stroke="#e2e8f0" stroke-width="1.5" />
          <path d="M 36 38 L 44 46" stroke="#e2e8f0" stroke-width="1.5" />
        </svg>
      </div>
    `;
  } else if (primaryCategory === 'armor') {
    iconWidth = 52;
    iconHeight = 52;
    // TANK: Top-down satellite view of Main Battle Tank (tracks, hull, rotating turret & long cannon)
    unitSvg = `
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- MBT Tank SVG -->
        <svg viewBox="0 0 50 64" class="w-10 h-13 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]">
          <!-- Left Track -->
          <rect x="5" y="8" width="8" height="48" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1" />
          <line x1="5" y1="18" x2="13" y2="18" stroke="#475569" stroke-width="1" />
          <line x1="5" y1="28" x2="13" y2="28" stroke="#475569" stroke-width="1" />
          <line x1="5" y1="38" x2="13" y2="38" stroke="#475569" stroke-width="1" />
          <line x1="5" y1="48" x2="13" y2="48" stroke="#475569" stroke-width="1" />

          <!-- Right Track -->
          <rect x="37" y="8" width="8" height="48" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1" />
          <line x1="37" y1="18" x2="45" y2="18" stroke="#475569" stroke-width="1" />
          <line x1="37" y1="28" x2="45" y2="28" stroke="#475569" stroke-width="1" />
          <line x1="37" y1="38" x2="45" y2="38" stroke="#475569" stroke-width="1" />
          <line x1="37" y1="48" x2="45" y2="48" stroke="#475569" stroke-width="1" />

          <!-- Armored Chassis Hull -->
          <polygon points="12,12 38,12 36,54 14,54" fill="#475569" stroke="#0f172a" stroke-width="1.5" />
          <!-- Engine grilles at rear -->
          <rect x="18" y="47" width="14" height="5" fill="#334155" />

          <!-- Tank Cannon Barrel projecting forward -->
          <rect x="23.5" y="0" width="3" height="24" fill="#0f172a" />
          <rect x="22.5" y="0" width="5" height="3" fill="#1e293b" /> <!-- Muzzle brake -->

          <!-- Armored Turret -->
          <polygon points="16,22 34,22 32,38 18,38" fill="#334155" stroke="#0f172a" stroke-width="1.5" />
          <!-- Commander Cupola / Hatch -->
          <circle cx="28" cy="30" r="3" fill="#1e293b" stroke="#64748b" stroke-width="1" />
        </svg>
      </div>
    `;
  } else {
    // INFANTRY / SQUAD TRANSPORT
    iconWidth = 48;
    iconHeight = 48;
    unitSvg = `
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- APC / Squad Armored Transport -->
        <svg viewBox="0 0 44 56" class="w-9 h-11 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]">
          <!-- Wheels -->
          <rect x="3" y="10" width="6" height="10" rx="2" fill="#0f172a" />
          <rect x="35" y="10" width="6" height="10" rx="2" fill="#0f172a" />
          <rect x="3" y="24" width="6" height="10" rx="2" fill="#0f172a" />
          <rect x="35" y="24" width="6" height="10" rx="2" fill="#0f172a" />
          <rect x="3" y="38" width="6" height="10" rx="2" fill="#0f172a" />
          <rect x="35" y="38" width="6" height="10" rx="2" fill="#0f172a" />

          <!-- Armored Hull -->
          <polygon points="10,6 34,6 32,48 12,48" fill="#3f4a3c" stroke="#1c231a" stroke-width="1.5" />
          <!-- Roof Hatch & Weapon Station -->
          <circle cx="22" cy="24" r="5" fill="#252e23" stroke="#5d6f58" stroke-width="1" />
          <line x1="22" y1="24" x2="22" y2="12" stroke="#000" stroke-width="2" />
        </svg>
      </div>
    `;
  }

  // Tactical badge ring showing action & status
  const badgeColor = isHalted
    ? 'border-amber-400 bg-amber-950/80 text-amber-300'
    : isAttack
    ? 'border-red-500 bg-red-950/80 text-red-200'
    : 'border-white bg-zinc-900/90 text-white';

  const totalUnitsCount = mission.units.reduce((acc, u) => acc + u.count, 0);

  const html = `
    <div class="relative group cursor-pointer" style="width: ${iconWidth}px; height: ${iconHeight}px;">
      <!-- Rotated Vehicle / Unit Container facing direction of travel (headingDeg) -->
      <div class="w-full h-full flex items-center justify-center transition-transform duration-300" style="transform: rotate(${headingDeg}deg);">
        ${unitSvg}
      </div>

      <!-- Tactical Status Tag (Always upright) -->
      <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold whitespace-nowrap shadow-lg flex items-center gap-1 ${badgeColor}">
        ${isHalted ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>HALTED' : isAttack ? '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>ATK' : '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>DEP'}
        <span>${totalUnitsCount}x</span>
      </div>

      <!-- Subtitle speed tag -->
      <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-black/80 border border-zinc-700 text-[8px] font-mono text-zinc-300 whitespace-nowrap pointer-events-none">
        ${cruisingSpeedKmH} km/h
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'military-tactical-unit-icon',
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight / 2],
  });
}

/**
 * Creates an explosion / strike impact visual marker for Leaflet map when a strike lands.
 */
export function createStrikeImpactIcon(): L.DivIcon {
  const html = `
    <div class="relative w-16 h-16 flex items-center justify-center pointer-events-none">
      <!-- Expanding shockwave ring -->
      <div class="absolute inset-0 rounded-full border-2 border-red-500 bg-red-500/30 animate-ping [animation-duration:1.2s]"></div>
      <!-- Secondary fiery flash ring -->
      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 animate-pulse shadow-[0_0_20px_#ef4444]"></div>
      <!-- Core detonation spark -->
      <div class="w-3 h-3 rounded-full bg-white animate-ping [animation-duration:0.6s]"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'strike-impact-marker',
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  });
}

/**
 * Creates an expeditionary outpost / garrison icon when ground units are deployed to coordinates.
 */
export function createDeployedOutpostIcon(squadName: string): L.DivIcon {
  const html = `
    <div class="relative flex flex-col items-center pointer-events-none">
      <div class="px-2 py-0.5 rounded bg-zinc-950 border border-emerald-400 text-[9px] font-mono font-bold text-emerald-300 shadow-xl whitespace-nowrap">
        📍 OUTPOST DEPLOYED
      </div>
      <div class="w-3 h-3 rotate-45 bg-emerald-400 shadow-[0_0_8px_#34d399] -mt-1.5"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'deployed-outpost-marker',
    iconSize: [100, 30],
    iconAnchor: [50, 20],
  });
}
