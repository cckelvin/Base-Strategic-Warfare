// Mission service: Handles real-world km movement, speed, trajectory paths, and unit positions on the world map.

export type MissionType = 'strike' | 'deploy';

export interface MissionSquadUnit {
  unitId: string;
  name: string;
  count: number;
  category: 'air' | 'missile' | 'armor' | 'infantry' | 'air-defense' | 'naval';
}

export interface ActiveMission {
  id: string;
  type: MissionType; // 'strike' | 'deploy'
  baseId: string;
  baseName: string;
  countryCode: string;
  units: MissionSquadUnit[];
  primaryCategory: 'missile' | 'air' | 'armor' | 'infantry' | 'air-defense' | 'naval';
  startLat: number;
  startLng: number;
  targetLat: number;
  targetLng: number;
  targetName?: string;
  totalDistanceKm: number;
  cruisingSpeedKmH: number;
  durationMs: number;
  startTime: number;
  elapsedMs: number;
  status: 'active' | 'halted' | 'completed';
  progress: number; // 0.0 to 1.0
  currentLat: number;
  currentLng: number;
  headingDeg: number;
  isHostileEngaged?: boolean;
}

const STORAGE_KEY_MISSIONS = 'base_warfare_active_missions';

/**
 * Calculates Haversine real-world distance between two geographic coordinates in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates initial compass bearing / heading in degrees from point 1 to point 2 (0 - 360 deg).
 */
export function calculateBearingDegrees(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;
  return Math.round(brng);
}

/**
 * Interpolates coordinates between start and target along linear or great-circle path.
 */
export function interpolateCoordinates(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  progress: number
): { lat: number; lng: number } {
  const clampedP = Math.max(0, Math.min(1, progress));
  const lat = lat1 + (lat2 - lat1) * clampedP;
  const lng = lng1 + (lat2 - lat1 !== 0 || lng2 - lng1 !== 0 ? (lng2 - lng1) * clampedP : 0);
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
}

/**
 * Determines realistic real-world cruising speed in km/h for a squadron.
 */
export function getSquadronSpeedKmH(
  units: MissionSquadUnit[],
  primaryCategory: 'missile' | 'air' | 'armor' | 'infantry' | 'air-defense' | 'naval'
): number {
  if (primaryCategory === 'missile') return 4800; // Hypersonic/supersonic standoff cruise missile (~Mach 4)
  if (primaryCategory === 'air') return 2200; // Supersonic jet fighter / bomber (~Mach 1.8)
  if (primaryCategory === 'armor') return 75; // Armored tracked vehicles & MBTs
  if (primaryCategory === 'naval') return 55; // Naval carrier strike & frigate fleet (approx 30 knots)
  if (primaryCategory === 'air-defense') return 60; // Mobile SAM air defense battery convoy
  return 40; // Motorized mechanized infantry transport
}

/**
 * Calculates a balanced game-time duration in milliseconds for the unit to visibly travel on the map.
 * Keeps it gradual and live so the player can watch the unit traverse the map in real-time.
 */
export function calculateGameTravelDurationMs(
  distanceKm: number,
  primaryCategory: string
): number {
  if (primaryCategory === 'missile') {
    // 10s to 25s
    return Math.round(Math.min(25000, Math.max(10000, (distanceKm / 4000) * 18000)));
  }
  if (primaryCategory === 'air') {
    // 14s to 35s
    return Math.round(Math.min(35000, Math.max(14000, (distanceKm / 3000) * 24000)));
  }
  // Ground (armor, infantry)
  // 18s to 45s
  return Math.round(Math.min(45000, Math.max(18000, (distanceKm / 2000) * 32000)));
}

/**
 * Retrieves all stored active missions from local storage.
 */
export function getSavedMissions(): ActiveMission[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persists active missions to local storage.
 */
export function saveMissions(missions: ActiveMission[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
  } catch {}
}

/**
 * Creates and launches a new mission.
 */
export function launchMission({
  type,
  baseId,
  baseName,
  countryCode,
  units,
  primaryCategory,
  startLat,
  startLng,
  targetLat,
  targetLng,
  targetName,
}: {
  type: MissionType;
  baseId: string;
  baseName: string;
  countryCode: string;
  units: MissionSquadUnit[];
  primaryCategory: 'missile' | 'air' | 'armor' | 'infantry' | 'air-defense' | 'naval';
  startLat: number;
  startLng: number;
  targetLat: number;
  targetLng: number;
  targetName?: string;
}): ActiveMission {
  const distanceKm = calculateHaversineDistanceKm(startLat, startLng, targetLat, targetLng);
  const cruisingSpeedKmH = getSquadronSpeedKmH(units, primaryCategory);
  const durationMs = calculateGameTravelDurationMs(distanceKm, primaryCategory);
  const headingDeg = calculateBearingDegrees(startLat, startLng, targetLat, targetLng);

  const newMission: ActiveMission = {
    id: `mission-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type,
    baseId,
    baseName,
    countryCode,
    units,
    primaryCategory,
    startLat,
    startLng,
    targetLat,
    targetLng,
    targetName: targetName || `Coords ${targetLat.toFixed(2)}°, ${targetLng.toFixed(2)}°`,
    totalDistanceKm: distanceKm,
    cruisingSpeedKmH,
    durationMs,
    startTime: Date.now(),
    elapsedMs: 0,
    status: 'active',
    progress: 0,
    currentLat: startLat,
    currentLng: startLng,
    headingDeg,
  };

  const current = getSavedMissions();
  current.push(newMission);
  saveMissions(current);

  return newMission;
}

export const createMission = launchMission;
export const saveActiveMissions = saveMissions;

/**
 * Halts an en-route mission in its tracks.
 */
export function haltMission(missionId: string): ActiveMission[] {
  const current = getSavedMissions();
  const updated = current.map((m) => {
    if (m.id === missionId && m.status === 'active') {
      const elapsed = Date.now() - m.startTime;
      const progress = Math.min(1, Math.max(0, elapsed / m.durationMs));
      const pos = interpolateCoordinates(m.startLat, m.startLng, m.targetLat, m.targetLng, progress);
      return {
        ...m,
        status: 'halted' as const,
        elapsedMs: elapsed,
        progress,
        currentLat: pos.lat,
        currentLng: pos.lng,
      };
    }
    return m;
  });
  saveMissions(updated);
  return updated;
}

/**
 * Resumes a halted mission.
 */
export function resumeMission(missionId: string): ActiveMission[] {
  const current = getSavedMissions();
  const updated = current.map((m) => {
    if (m.id === missionId && m.status === 'halted') {
      const remainingProgress = 1 - m.progress;
      const remainingDuration = m.durationMs * remainingProgress;
      return {
        ...m,
        status: 'active' as const,
        startTime: Date.now() - m.durationMs * m.progress,
        durationMs: m.durationMs,
      };
    }
    return m;
  });
  saveMissions(updated);
  return updated;
}

/**
 * Aborts and cancels an en-route mission.
 */
export function abortMission(missionId: string): ActiveMission[] {
  const current = getSavedMissions();
  const updated = current.filter((m) => m.id !== missionId);
  saveMissions(updated);
  return updated;
}
