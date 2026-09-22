import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Activity,
  Sliders,
  Send,
  Plane,
  Users,
  Crosshair,
  AlertTriangle,
  Info,
  Radio,
  Clock,
  ArrowRight,
  Swords,
  Flame,
  Rocket,
  Target,
  Zap,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  Layers,
  MapPin,
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  Navigation,
  Globe2,
} from 'lucide-react';
import {
  MilitaryBase,
  BaseReport,
  MilitaryUnit,
  MilitaryCategory,
  getUnitCategory,
  updateBaseGarrison,
  getAllMilitaryBases,
} from './militaryBases';
import { CountryFlag } from './countries';
import {
  ActiveMission,
  MissionType,
  MissionSquadUnit,
  calculateHaversineDistanceKm,
  getSquadronSpeedKmH,
} from './missionService';

interface BaseModalProps {
  base: MilitaryBase;
  allBases?: MilitaryBase[];
  userCountry?: CountryFlag;
  pinnedCoord?: { lat: number; lng: number } | null;
  activeMissions?: ActiveMission[];
  onLaunchMission?: (missionData: {
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
  }) => void;
  onHaltMission?: (missionId: string) => void;
  onResumeMission?: (missionId: string) => void;
  onAbortMission?: (missionId: string) => void;
  onTargetForeignBase?: (targetBase: MilitaryBase) => void;
  onClose: () => void;
  onShowComingSoon: (message: string) => void;
  onBaseUpdated?: (updatedBase: MilitaryBase) => void;
  onAddNotification?: (title: string, message: string) => void;
  onRewardMoney?: (amount: number) => void;
}

interface StrikeUnitSelection {
  unitId: string;
  count: number;
}

interface BattleOutcome {
  victory: boolean;
  targetName: string;
  targetCountry: string;
  totalDeployed: number;
  totalCasualties: number;
  hostileLosses: number;
  bountyEarned: number;
  summaryText: string;
  unitBreakdown: {
    name: string;
    sent: number;
    survived: number;
    lost: number;
  }[];
}

export default function BaseModal({
  base,
  allBases,
  userCountry,
  pinnedCoord,
  activeMissions = [],
  onLaunchMission,
  onHaltMission,
  onResumeMission,
  onAbortMission,
  onTargetForeignBase,
  onClose,
  onShowComingSoon,
  onBaseUpdated,
  onAddNotification,
  onRewardMoney,
}: BaseModalProps) {
  // SOVEREIGN OWNERSHIP RESTRICTION REQUIREMENT:
  // "Now the player should not have control of any other country assets(base, military, anything)."
  const isPlayerBase =
    !userCountry ||
    base.countryCode.toUpperCase() === userCountry.code.toUpperCase() ||
    base.countryName.toLowerCase() === userCountry.name.toLowerCase();

  // Main Navigation Tabs: battle, update, control, military
  const [activeTab, setActiveTab] = useState<'battle' | 'update' | 'control' | 'military'>('battle');

  // Garrison & State
  const [currentUnits, setCurrentUnits] = useState<MilitaryUnit[]>(base.units);
  const [reports, setReports] = useState<BaseReport[]>(base.reports);
  const [newUpdateInput, setNewUpdateInput] = useState('');
  const [updateFilter, setUpdateFilter] = useState<string>('all');

  // Subnav for Military Tab
  const [militarySubCategory, setMilitarySubCategory] = useState<MilitaryCategory>('all');

  // Defensive Situations (Control Tab) State
  const [defconLevel, setDefconLevel] = useState<number>(2);
  const [airDefenseActive, setAirDefenseActive] = useState<boolean>(true);
  const [radarJammingActive, setRadarJammingActive] = useState<boolean>(true);
  const [blastShieldsActive, setBlastShieldsActive] = useState<boolean>(false);
  const [droneSentriesActive, setDroneSentriesActive] = useState<boolean>(true);
  const [activeDefenseNotice, setActiveDefenseNotice] = useState<string | null>(null);

  // =========================================================================
  // BATTLE & OPERATIONS: Strike vs Deploy, Planet Coordinates, Air Unit Rule
  // =========================================================================
  const [operationMode, setOperationMode] = useState<MissionType>('strike');

  const basePool = allBases || getAllMilitaryBases();
  const availableTargetBases = basePool.filter((b) => b.id !== base.id);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    availableTargetBases[0]?.id || 'hostile-stronghold-alpha'
  );

  const selectedTargetBase =
    availableTargetBases.find((b) => b.id === selectedTargetId) || {
      id: 'hostile-stronghold-alpha',
      name: 'Hostile Insurgent Stronghold Alpha',
      countryName: 'Hostile Sector',
      countryCode: 'XX',
      flagUrl: 'https://flagcdn.com/w80/un.png',
      lat: base.lat + 4.5,
      lng: base.lng + 5.2,
      status: 'Fortified' as const,
      dms: `32°18'44.1"N 44°22'19.0"E`,
    };

  // Planet Coordinates Input State
  const [targetLatInput, setTargetLatInput] = useState<string>(() =>
    selectedTargetBase ? String(selectedTargetBase.lat) : '34.5000'
  );
  const [targetLngInput, setTargetLngInput] = useState<string>(() =>
    selectedTargetBase ? String(selectedTargetBase.lng) : '44.2000'
  );
  const [targetNameInput, setTargetNameInput] = useState<string>(() =>
    selectedTargetBase ? selectedTargetBase.name : 'Target Sector'
  );

  // Selected Squad
  const [strikeSquad, setStrikeSquad] = useState<StrikeUnitSelection[]>([]);
  const [battleState, setBattleState] = useState<'prep' | 'simulating' | 'outcome'>('prep');
  const [battlePhaseIndex, setBattlePhaseIndex] = useState<number>(0);
  const [battleOutcome, setBattleOutcome] = useState<BattleOutcome | null>(null);

  // Parse numerical coords
  const parsedTargetLat = parseFloat(targetLatInput) || base.lat + 1.0;
  const parsedTargetLng = parseFloat(targetLngInput) || base.lng + 1.0;

  // Real-world Haversine distance in km
  const realDistanceKm = useMemo(() => {
    return calculateHaversineDistanceKm(base.lat, base.lng, parsedTargetLat, parsedTargetLng);
  }, [base.lat, base.lng, parsedTargetLat, parsedTargetLng]);

  // Determine primary category of current squad
  const squadPrimaryCategory = useMemo(() => {
    const cats = strikeSquad.map((s) => {
      const u = currentUnits.find((unit) => unit.id === s.unitId);
      return u ? getUnitCategory(u) : 'infantry';
    });
    if (cats.includes('missile')) return 'missile';
    if (cats.includes('air')) return 'air';
    if (cats.includes('armor')) return 'armor';
    if (cats.includes('air-defense')) return 'air-defense';
    return 'infantry';
  }, [strikeSquad, currentUnits]);

  // Real-world cruising speed in km/h
  const squadCruisingSpeedKmH = useMemo(() => {
    return getSquadronSpeedKmH([], squadPrimaryCategory);
  }, [squadPrimaryCategory]);

  // Real-world transit time formatted
  const realTransitTimeFormatted = useMemo(() => {
    if (realDistanceKm <= 0 || squadCruisingSpeedKmH <= 0) return 'Immediate';
    const hours = realDistanceKm / squadCruisingSpeedKmH;
    if (hours < 1) {
      const mins = Math.max(1, Math.round(hours * 60));
      return `${mins} min${mins > 1 ? 's' : ''}`;
    }
    const fullHours = Math.floor(hours);
    const remainingMins = Math.round((hours - fullHours) * 60);
    return `${fullHours}h ${remainingMins}m`;
  }, [realDistanceKm, squadCruisingSpeedKmH]);

  // Active missions originating from this base or nationally
  const baseActiveMissions = activeMissions.filter(
    (m) => m.baseId === base.id || (m.status !== 'completed' && isPlayerBase)
  );

  // Helper to persist updates
  const syncBaseState = (newUnits: MilitaryUnit[], newReport?: BaseReport) => {
    setCurrentUnits(newUnits);
    if (newReport) {
      setReports((prev) => [newReport, ...prev]);
    }
    updateBaseGarrison(base.id, newUnits, newReport);
    if (onBaseUpdated) {
      onBaseUpdated({
        ...base,
        units: newUnits,
        reports: newReport ? [newReport, ...reports] : reports,
      });
    }
  };

  // Switch Operation Mode: STRIKE vs DEPLOY
  // CRITICAL REQUIREMENT: "air units can't be deployed"
  const handleSelectOperationMode = (mode: MissionType) => {
    setOperationMode(mode);
    if (mode === 'deploy') {
      // If switching to deploy, automatically purge air units from squad
      setStrikeSquad((prev) =>
        prev.filter((item) => {
          const u = currentUnits.find((unit) => unit.id === item.unitId);
          return u ? getUnitCategory(u) !== 'air' && getUnitCategory(u) !== 'missile' : true;
        })
      );
    }
  };

  // Target preset fill handlers
  const handleApplyForeignBaseTarget = (targetId: string) => {
    setSelectedTargetId(targetId);
    const target = availableTargetBases.find((b) => b.id === targetId);
    if (target) {
      setTargetLatInput(String(target.lat));
      setTargetLngInput(String(target.lng));
      setTargetNameInput(target.name);
    }
  };

  const handleApplyPinnedCoords = () => {
    if (pinnedCoord) {
      setTargetLatInput(String(pinnedCoord.lat));
      setTargetLngInput(String(pinnedCoord.lng));
      setTargetNameInput(`Pinned Coordinate (${pinnedCoord.lat.toFixed(4)}, ${pinnedCoord.lng.toFixed(4)})`);
    }
  };

  // Category counts for the subnav bar in Military tab
  const categoryCounts = {
    all: currentUnits.length,
    air: currentUnits.filter((u) => getUnitCategory(u) === 'air').length,
    missile: currentUnits.filter((u) => getUnitCategory(u) === 'missile').length,
    armor: currentUnits.filter((u) => getUnitCategory(u) === 'armor').length,
    'air-defense': currentUnits.filter((u) => getUnitCategory(u) === 'air-defense').length,
    infantry: currentUnits.filter((u) => getUnitCategory(u) === 'infantry').length,
  };

  // Filtered military units based on subnav
  const filteredMilitaryUnits = currentUnits.filter((u) => {
    if (militarySubCategory === 'all') return true;
    return getUnitCategory(u) === militarySubCategory;
  });

  // Post update handler
  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateInput.trim() || !isPlayerBase) return;

    const newReport: BaseReport = {
      id: `rep-${Date.now()}`,
      timeAgo: 'Just now',
      type: 'urgent',
      text: newUpdateInput.trim(),
    };

    syncBaseState(currentUnits, newReport);
    setNewUpdateInput('');
  };

  // Battle: Add unit type to squad
  const handleAddUnitTypeToStrike = (unitId: string) => {
    const garrisonUnit = currentUnits.find((u) => u.id === unitId);
    if (!garrisonUnit || garrisonUnit.count <= 0) return;

    const cat = getUnitCategory(garrisonUnit);
    // RESTRICTION: "air units can't be deployed"
    if (operationMode === 'deploy' && (cat === 'air' || cat === 'missile')) {
      alert('Air units and standoff missiles cannot be deployed. Air units are for strike & combat operations only.');
      return;
    }

    const existing = strikeSquad.find((s) => s.unitId === unitId);
    if (existing) return;

    // Default amount: 25% or minimum 1
    const defaultCount = Math.max(1, Math.min(garrisonUnit.count, Math.ceil(garrisonUnit.count * 0.25)));
    setStrikeSquad([...strikeSquad, { unitId, count: defaultCount }]);
  };

  // Battle: Update count of a unit type
  const handleSetStrikeCount = (unitId: string, count: number) => {
    const garrisonUnit = currentUnits.find((u) => u.id === unitId);
    if (!garrisonUnit) return;

    const clamped = Math.max(1, Math.min(garrisonUnit.count, Math.round(count)));
    setStrikeSquad((prev) =>
      prev.map((s) => (s.unitId === unitId ? { ...s, count: clamped } : s))
    );
  };

  // Battle: Quick preset percentage (25%, 50%, 100%)
  const handleApplyPreset = (unitId: string, pct: number) => {
    const garrisonUnit = currentUnits.find((u) => u.id === unitId);
    if (!garrisonUnit) return;
    const computed = Math.max(1, Math.min(garrisonUnit.count, Math.round(garrisonUnit.count * pct)));
    handleSetStrikeCount(unitId, computed);
  };

  // Battle: Remove unit from squad
  const handleRemoveFromStrike = (unitId: string) => {
    setStrikeSquad((prev) => prev.filter((s) => s.unitId !== unitId));
  };

  // Calculate battle power
  const totalStrikeUnitsCount = strikeSquad.reduce((sum, item) => sum + item.count, 0);

  const strikePowerRating = strikeSquad.reduce((sum, item) => {
    const u = currentUnits.find((unit) => unit.id === item.unitId);
    if (!u) return sum;
    const cat = getUnitCategory(u);
    let multiplier = 5;
    if (cat === 'missile') multiplier = 25;
    if (cat === 'air') multiplier = 20;
    if (cat === 'armor') multiplier = 12;
    if (cat === 'air-defense') multiplier = 8;
    return sum + item.count * multiplier;
  }, 0);

  // Total garrison troops count
  const totalTroops = currentUnits.reduce((acc, u) => acc + u.count, 0);

  // =========================================================================
  // LAUNCH REAL-WORLD MAP OPERATION (STRIKE / DEPLOY)
  // =========================================================================
  const handleLaunchOperation = () => {
    if (!isPlayerBase) {
      alert('Cannot launch military operations from foreign bases. You only command sovereign national assets.');
      return;
    }

    if (strikeSquad.length === 0 || totalStrikeUnitsCount === 0) {
      alert('Attach at least 1 unit type and specify quantity to deploy/strike.');
      return;
    }

    // Verify planet coordinates
    if (isNaN(parsedTargetLat) || isNaN(parsedTargetLng)) {
      alert('Please input valid planetary coordinates (Latitude & Longitude).');
      return;
    }

    // STRICT RULE: "air units can't be deployed"
    if (operationMode === 'deploy') {
      const hasAir = strikeSquad.some((item) => {
        const u = currentUnits.find((unit) => unit.id === item.unitId);
        return u && (getUnitCategory(u) === 'air' || getUnitCategory(u) === 'missile');
      });
      if (hasAir) {
        alert('Air units cannot be deployed! Only armor, ground, and mechanized forces can be deployed to coordinates.');
        return;
      }
    }

    // Build unit payload for mission
    const squadPayload: MissionSquadUnit[] = strikeSquad
      .map((item) => {
        const u = currentUnits.find((unit) => unit.id === item.unitId);
        if (!u) return null;
        return {
          unitId: u.id,
          name: u.name,
          count: item.count,
          category: getUnitCategory(u) as any,
        };
      })
      .filter(Boolean) as MissionSquadUnit[];

    // Decrement garrison units
    const updatedUnits = currentUnits.map((u) => {
      const committed = strikeSquad.find((item) => item.unitId === u.id);
      if (committed) {
        return {
          ...u,
          count: Math.max(0, u.count - committed.count),
        };
      }
      return u;
    });

    const isStrike = operationMode === 'strike';
    const actionLabel = isStrike ? 'STRIKE OPERATION' : 'FORWARD DEPLOYMENT';
    const lineLabel = isStrike ? 'RED ATTACK VECTOR' : 'WHITE TRANSIT VECTOR';

    // Create log report
    const operationReport: BaseReport = {
      id: `rep-op-${Date.now()}`,
      timeAgo: 'Just now',
      type: isStrike ? 'urgent' : 'logistics',
      text: `[${actionLabel} LAUNCHED] Destination: [${parsedTargetLat.toFixed(4)}, ${parsedTargetLng.toFixed(4)}] (${targetNameInput}). Real distance: ${realDistanceKm.toLocaleString()} km at ${squadCruisingSpeedKmH} km/h. Forces: ${totalStrikeUnitsCount} units (${squadPayload.length} types). Visualized via ${lineLabel}.`,
    };

    syncBaseState(updatedUnits, operationReport);

    // Call global launcher
    if (onLaunchMission) {
      onLaunchMission({
        type: operationMode,
        baseId: base.id,
        baseName: base.name,
        countryCode: base.countryCode,
        units: squadPayload,
        primaryCategory: squadPrimaryCategory as any,
        startLat: base.lat,
        startLng: base.lng,
        targetLat: parsedTargetLat,
        targetLng: parsedTargetLng,
        targetName: targetNameInput,
      });
    }

    if (onAddNotification) {
      onAddNotification(
        `${actionLabel} Executed`,
        `${totalStrikeUnitsCount} units deployed toward [${parsedTargetLat.toFixed(2)}, ${parsedTargetLng.toFixed(2)}]. Real distance: ${realDistanceKm.toLocaleString()} km.`
      );
    }

    // Reset squad setup
    setStrikeSquad([]);
  };

  // Defensive Situational Quick Actions (Control Tab)
  const triggerDefensiveAction = (actionTitle: string, actionDesc: string) => {
    if (!isPlayerBase) {
      alert('You cannot override defensive controls of foreign bases.');
      return;
    }

    setActiveDefenseNotice(`Activated: ${actionTitle}`);
    setTimeout(() => setActiveDefenseNotice(null), 4000);

    const defenseReport: BaseReport = {
      id: `rep-def-${Date.now()}`,
      timeAgo: 'Just now',
      type: 'defense',
      text: `[DEFENSIVE SITUATION PROTOCOL] ${actionTitle}: ${actionDesc}`,
    };

    syncBaseState(currentUnits, defenseReport);

    if (onAddNotification) {
      onAddNotification(`Defensive Protocol: ${actionTitle}`, actionDesc);
    }
  };

  return (
    <div
      id="base-full-page-overlay"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <header
        id="base-header-bar"
        className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 shadow-md relative z-10"
      >
        <div className="flex items-center gap-3.5">
          <div
            id="base-country-flag"
            className="w-10 h-7 rounded shadow-sm border border-zinc-700/80 overflow-hidden flex items-center justify-center bg-black/40 shrink-0"
            title={`Country of Ownership: ${base.countryName}`}
          >
            <img
              src={base.flagUrl}
              alt={base.countryName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 id="base-title-name" className="text-lg font-bold font-mono tracking-wide text-zinc-100">
                {base.name}
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                  !isPlayerBase
                    ? 'bg-red-950/80 text-red-300 border-red-500/60'
                    : defconLevel === 1
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                    : defconLevel === 2
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                }`}
              >
                {!isPlayerBase ? 'FOREIGN ASSET • RECON ONLY' : `DEFCON-${defconLevel} • ${base.status}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="text-zinc-500">{base.codeName}</span>
              <span>•</span>
              <span className="text-zinc-400">{base.dms}</span>
              <span>•</span>
              <span className={isPlayerBase ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                OWNER: {base.countryName.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="close-base-modal-btn"
          onClick={onClose}
          aria-label="Close Base Command"
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* ========================================================================= */}
      {/* RESTRICTION NOTICE FOR FOREIGN BASES */}
      {/* "Now the player should not have control of any other country assets(base, military, anything)." */}
      {/* ========================================================================= */}
      {!isPlayerBase && (
        <div className="w-full bg-red-950/80 border-b border-red-500/50 px-6 py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong>FOREIGN ASSET COMMAND RESTRICTION:</strong> Under international sovereignty rules, the player has NO control of other countries' assets (bases, military units, or defensive grids).
            </span>
          </div>
          {onTargetForeignBase && (
            <button
              onClick={() => {
                onTargetForeignBase(base);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase tracking-wider text-[11px] shrink-0 cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Target With Homeland Base</span>
            </button>
          )}
        </div>
      )}

      {/* Sub-bar: Garrison category pill counters */}
      <div
        id="base-summary-subbar"
        className="w-full bg-zinc-950/90 border-b border-zinc-800/80 px-6 py-2 flex items-center justify-between text-xs font-mono"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-zinc-500 uppercase tracking-wider text-[11px]">
            {isPlayerBase ? 'Homeland Forces:' : 'Reconnaissance Telemetry:'}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">{totalTroops.toLocaleString()}</span> Total Assets
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{categoryCounts.air}</span> Air Wings
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Rocket className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold">{categoryCounts.missile}</span> Launchers
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{categoryCounts.armor}</span> Armor
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            RADAR: {airDefenseActive ? 'ONLINE' : 'OFFLINE'}
          </span>
          <span>•</span>
          <span>COORDS: {base.lat.toFixed(4)}, {base.lng.toFixed(4)}</span>
        </div>
      </div>

      {/* Main Top Nav Bar: Battle, Update, Control, Military */}
      <nav
        id="base-nav-notch"
        className="w-full bg-zinc-900/60 border-b border-zinc-800/80 px-6 py-2.5 flex items-center justify-center relative z-10"
      >
        <div className="flex items-center p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl shadow-inner gap-1">
          {/* TAB 1: BATTLE & OPERATIONS */}
          <button
            id="tab-btn-battle"
            onClick={() => setActiveTab('battle')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'battle'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Battle & Operations</span>
            {strikeSquad.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-950 text-red-300 border border-red-500/40">
                {strikeSquad.length} Types
              </span>
            )}
          </button>

          {/* TAB 2: UPDATE */}
          <button
            id="tab-btn-update"
            onClick={() => setActiveTab('update')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'update'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Update</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'update' ? 'bg-zinc-950/20 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {reports.length}
            </span>
          </button>

          {/* TAB 3: CONTROL (Defensive Situations) */}
          <button
            id="tab-btn-control"
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'control'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Control</span>
            <span className="hidden sm:inline text-[9px] lowercase opacity-75 font-normal">
              (defense)
            </span>
          </button>

          {/* TAB 4: MILITARY (Subnav bar for categories) */}
          <button
            id="tab-btn-military"
            onClick={() => setActiveTab('military')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'military'
                ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] font-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Military</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'military' ? 'bg-zinc-950/20 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {currentUnits.length}
            </span>
          </button>
        </div>
      </nav>

      {/* Main Tab Content Viewport */}
      <div id="base-tab-content" className="flex-1 overflow-y-auto p-6 relative">
        {/* ========================================================= */}
        {/* TAB 1: BATTLE & OPERATIONS */}
        {/* ========================================================= */}
        {activeTab === 'battle' && (
          <div id="base-battle-section" className="max-w-5xl mx-auto space-y-6">
            {!isPlayerBase ? (
              /* Foreign Base Read-Only Reconnaissance Panel */
              <div className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-4">
                <Shield className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold font-mono text-zinc-200 uppercase">
                  Foreign Installation Intelligence File
                </h3>
                <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                  You cannot command or launch operations from foreign sovereign bases. However, you can launch a strike from your sovereign homeland bases toward this installation's planetary coordinates.
                </p>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 max-w-md mx-auto text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Planetary Lat/Lng:</span>
                    <span className="text-emerald-400 font-bold">{base.lat.toFixed(4)}, {base.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estimated Fortification:</span>
                    <span className="text-amber-400">{base.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Reported Garrison:</span>
                    <span className="text-zinc-200">{totalTroops.toLocaleString()} troops / vehicles</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Sovereign Base Command: Strike vs Deploy, Coordinates, Squad, Halt */
              <div className="space-y-6">
                {/* 1. Operation Mode & Planet Coordinates */}
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                        1. Select Operation & Planetary Destination
                      </span>
                    </div>

                    {/* Mode Selector: Strike (Red line) vs Deploy (White line) */}
                    <div className="flex items-center p-1 bg-zinc-950 rounded-lg border border-zinc-800 gap-1">
                      <button
                        onClick={() => handleSelectOperationMode('strike')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase cursor-pointer transition-all ${
                          operationMode === 'strike'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Strike Operation (Red Line)</span>
                      </button>

                      <button
                        onClick={() => handleSelectOperationMode('deploy')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase cursor-pointer transition-all ${
                          operationMode === 'deploy'
                            ? 'bg-zinc-100 text-zinc-950 shadow-md font-black'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Deploy Convoy (White Line)</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode explanation banner */}
                  <div
                    className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      operationMode === 'strike'
                        ? 'bg-red-950/30 border-red-500/30 text-red-300'
                        : 'bg-zinc-800/40 border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>
                        {operationMode === 'strike'
                          ? 'STRIKE: High-speed kinetic salvo (Missiles, Jets, Tanks). Moves across real-world map with red assault trajectory and detonates on target.'
                          : 'DEPLOY: Forward mechanized troop movement. Moves across real-world map with white transit vector. [CRITICAL RULE: Air units cannot be deployed].'}
                      </span>
                    </div>
                    {operationMode === 'deploy' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] shrink-0 font-bold">
                        AIR UNITS EXCLUDED
                      </span>
                    )}
                  </div>

                  {/* Planetary Coordinates Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Target Latitude (°N/S)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={targetLatInput}
                        onChange={(e) => setTargetLatInput(e.target.value)}
                        placeholder="e.g. 34.0522"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Target Longitude (°E/W)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={targetLngInput}
                        onChange={(e) => setTargetLngInput(e.target.value)}
                        placeholder="e.g. -118.2437"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Sector / Target Codename
                      </label>
                      <input
                        type="text"
                        value={targetNameInput}
                        onChange={(e) => setTargetNameInput(e.target.value)}
                        placeholder="Target designation"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Preset Buttons for Quick Target Filling */}
                  <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                    <span className="text-zinc-500 text-[11px]">Quick Target Presets:</span>
                    {pinnedCoord && (
                      <button
                        onClick={handleApplyPinnedCoords}
                        className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Use Map Pinned Coord ({pinnedCoord.lat.toFixed(2)}, {pinnedCoord.lng.toFixed(2)})</span>
                      </button>
                    )}

                    <select
                      value={selectedTargetId}
                      onChange={(e) => handleApplyForeignBaseTarget(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs font-mono text-zinc-300 outline-none cursor-pointer"
                    >
                      <option value="">Select Foreign Military Base Target...</option>
                      {availableTargetBases.map((tb) => (
                        <option key={tb.id} value={tb.id}>
                          {tb.name} ({tb.countryName}) - {tb.lat.toFixed(2)}°, {tb.lng.toFixed(2)}°
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Real-World Distance & Speed Telemetry Box */}
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">REAL DISTANCE</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {realDistanceKm.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">CRUISING SPEED</span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {squadCruisingSpeedKmH} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">REAL-WORLD TIME</span>
                      <span className="text-zinc-200 font-bold text-sm">
                        {realTransitTimeFormatted}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">MAP TRAJECTORY</span>
                      <span className={operationMode === 'strike' ? 'text-red-400 font-bold text-sm' : 'text-zinc-100 font-bold text-sm'}>
                        {operationMode === 'strike' ? 'Red Line (Strike)' : 'White Line (Deploy)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Compose Squad (Add Units and Amounts, Multiple Types) */}
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                        2. Attach Units & Amounts ({operationMode === 'strike' ? 'Strike Force' : 'Convoy Garrison'})
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">
                      Garrison Assets: {totalTroops} Ready
                    </span>
                  </div>

                  {/* Pick Units to Add */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-zinc-400 block">
                      Click below to assign multiple unit types to this mission:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {currentUnits.map((u) => {
                        const isAdded = strikeSquad.some((s) => s.unitId === u.id);
                        const cat = getUnitCategory(u);
                        const isAirUnit = cat === 'air' || cat === 'missile';
                        const isDisallowedForDeploy = operationMode === 'deploy' && isAirUnit;

                        let badgeCol = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
                        if (cat === 'missile') badgeCol = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                        if (cat === 'air') badgeCol = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                        if (cat === 'armor') badgeCol = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                        return (
                          <button
                            key={u.id}
                            disabled={isAdded || u.count <= 0 || isDisallowedForDeploy}
                            onClick={() => handleAddUnitTypeToStrike(u.id)}
                            className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isDisallowedForDeploy
                                ? 'bg-zinc-950/60 border-zinc-900 opacity-40 cursor-not-allowed'
                                : isAdded
                                ? 'bg-red-950/30 border-red-500/60 opacity-60 cursor-not-allowed'
                                : u.count <= 0
                                ? 'bg-zinc-950 border-zinc-900 opacity-40 cursor-not-allowed'
                                : 'bg-zinc-950 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${badgeCol}`}>
                                {cat}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {u.count} avail
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold text-zinc-200 truncate">
                              {u.name}
                            </span>
                            <span className="text-[9px] font-mono mt-1">
                              {isDisallowedForDeploy ? (
                                <span className="text-rose-400 font-bold">Cannot Deploy Air Unit</span>
                              ) : isAdded ? (
                                <span className="text-zinc-400">✓ Added to Squad</span>
                              ) : (
                                <span className="text-emerald-400">+ Click to Add</span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Squad List with Quantity Controls */}
                  <div className="space-y-3 pt-3 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                        Configured Squad ({strikeSquad.length} Types Attached)
                      </span>
                      {strikeSquad.length > 0 && (
                        <button
                          onClick={() => setStrikeSquad([])}
                          className="text-[11px] font-mono text-zinc-500 hover:text-rose-400 cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {strikeSquad.length === 0 ? (
                      <div className="p-6 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center space-y-1">
                        <Swords className="w-6 h-6 text-zinc-600 mx-auto" />
                        <p className="text-xs font-mono text-zinc-400">No units attached yet.</p>
                        <p className="text-[10px] font-mono text-zinc-600">
                          Select unit types above to assign multiple squadrons and specify quantities.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {strikeSquad.map((item) => {
                          const unit = currentUnits.find((u) => u.id === item.unitId);
                          if (!unit) return null;
                          const cat = getUnitCategory(unit);

                          return (
                            <div
                              key={item.unitId}
                              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                                  {cat === 'air' && <Plane className="w-4 h-4 text-cyan-400" />}
                                  {cat === 'missile' && <Rocket className="w-4 h-4 text-purple-400" />}
                                  {cat === 'armor' && <Shield className="w-4 h-4 text-amber-400" />}
                                  {cat === 'air-defense' && <Crosshair className="w-4 h-4 text-rose-400" />}
                                  {cat === 'infantry' && <Users className="w-4 h-4 text-emerald-400" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-zinc-100">{unit.name}</span>
                                    <span className="text-[9px] font-mono px-1.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                                      {cat}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-zinc-500">
                                    Base inventory: {unit.count} available
                                  </span>
                                </div>
                              </div>

                              {/* Amount controls */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                                  <button
                                    onClick={() => handleSetStrikeCount(item.unitId, item.count - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    max={unit.count}
                                    value={item.count}
                                    onChange={(e) => handleSetStrikeCount(item.unitId, parseInt(e.target.value) || 1)}
                                    className="w-16 bg-zinc-950 text-center font-mono font-bold text-sm text-emerald-400 py-1 rounded border border-zinc-800 focus:outline-none focus:border-red-500"
                                  />
                                  <button
                                    onClick={() => handleSetStrikeCount(item.unitId, item.count + 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Preset percentage pills */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleApplyPreset(item.unitId, 0.25)}
                                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 rounded border border-zinc-800 cursor-pointer"
                                  >
                                    25%
                                  </button>
                                  <button
                                    onClick={() => handleApplyPreset(item.unitId, 0.5)}
                                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 rounded border border-zinc-800 cursor-pointer"
                                  >
                                    50%
                                  </button>
                                  <button
                                    onClick={() => handleApplyPreset(item.unitId, 1.0)}
                                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-amber-400 hover:text-amber-300 rounded border border-zinc-800 cursor-pointer"
                                  >
                                    MAX
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleRemoveFromStrike(item.unitId)}
                                  className="w-8 h-8 flex items-center justify-center rounded bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-800 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Combined Action Bar: Execute Strike / Deploy */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                      <span className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
                        {operationMode === 'strike' ? 'Authorize Strike Salvo' : 'Authorize Forward Deployment'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                      <span>Total Units: <strong className="text-white">{totalStrikeUnitsCount}</strong></span>
                      <span>•</span>
                      <span>Distance: <strong className="text-emerald-400">{realDistanceKm.toLocaleString()} km</strong></span>
                      <span>•</span>
                      <span>Speed: <strong className="text-cyan-400">{squadCruisingSpeedKmH} km/h</strong></span>
                    </div>
                  </div>

                  <button
                    disabled={strikeSquad.length === 0 || totalStrikeUnitsCount === 0}
                    onClick={handleLaunchOperation}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono font-black text-sm uppercase tracking-widest transition-all cursor-pointer ${
                      strikeSquad.length === 0 || totalStrikeUnitsCount === 0
                        ? 'bg-zinc-800 text-zinc-600 border border-zinc-700/50 cursor-not-allowed opacity-50'
                        : operationMode === 'strike'
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-400 hover:scale-105 active:scale-95'
                        : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-[0_0_25px_rgba(255,255,255,0.4)] border border-zinc-300 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {operationMode === 'strike' ? (
                      <>
                        <Crosshair className="w-4 h-4 stroke-[3]" />
                        <span>LAUNCH STRIKE SALVO [RED LINE]</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 stroke-[3]" />
                        <span>DISPATCH DEPLOYMENT [WHITE LINE]</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 4. ACTIVE MISSIONS & HALT CONTROLS */}
                {/* REQUIREMENT: "determine exactly strike or deploy and halt." */}
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                        Active En-Route Missions & Live Fleet Control ({baseActiveMissions.length} Active)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">LIVE REAL-WORLD KM TELEMETRY</span>
                  </div>

                  {baseActiveMissions.length === 0 ? (
                    <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center text-xs font-mono text-zinc-500">
                      No active missions currently en route from this base. Launch a Strike or Deployment above to see live map movement.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {baseActiveMissions.map((m) => {
                        const isStrike = m.type === 'strike';
                        const isHalted = m.status === 'halted';
                        const remainingKm = Math.round(m.totalDistanceKm * (1 - m.progress));

                        return (
                          <div
                            key={m.id}
                            className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${
                              isHalted
                                ? 'bg-amber-950/20 border-amber-500/40'
                                : isStrike
                                ? 'bg-red-950/20 border-red-500/40'
                                : 'bg-zinc-950 border-zinc-700'
                            }`}
                          >
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                    isStrike
                                      ? 'bg-red-950 text-red-300 border-red-500/50'
                                      : 'bg-zinc-800 text-zinc-200 border-zinc-600'
                                  }`}
                                >
                                  {isStrike ? 'STRIKE OPERATION' : 'CONVOY DEPLOYMENT'}
                                </span>

                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    isHalted
                                      ? 'bg-amber-500 text-zinc-950 animate-pulse'
                                      : 'bg-emerald-500/20 text-emerald-300'
                                  }`}
                                >
                                  {isHalted ? 'HALTED IN TRANSIT' : 'EN ROUTE'}
                                </span>

                                <span className="text-zinc-400 truncate font-bold">
                                  {m.targetName || 'Target Sector'}
                                </span>
                              </div>

                              <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                                <span>Speed: <strong className="text-cyan-400">{m.cruisingSpeedKmH} km/h</strong></span>
                                <span>•</span>
                                <span>Remaining: <strong className="text-emerald-400">{remainingKm.toLocaleString()} km</strong></span>
                                <span>•</span>
                                <span>Coords: [{m.currentLat.toFixed(2)}, {m.currentLng.toFixed(2)}]</span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    isHalted
                                      ? 'bg-amber-400'
                                      : isStrike
                                      ? 'bg-red-500'
                                      : 'bg-zinc-200'
                                  }`}
                                  style={{ width: `${Math.round(m.progress * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* HALT / RESUME / ABORT ACTIONS */}
                            <div className="flex items-center gap-2 shrink-0">
                              {isHalted ? (
                                <button
                                  onClick={() => onResumeMission && onResumeMission(m.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  <span>RESUME</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onHaltMission && onHaltMission(m.id)}
                                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                                >
                                  <Pause className="w-3.5 h-3.5" />
                                  <span>HALT UNIT</span>
                                </button>
                              )}

                              <button
                                onClick={() => onAbortMission && onAbortMission(m.id)}
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg flex items-center gap-1 cursor-pointer"
                                title="Abort mission and recall troops to base"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>RECALL</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: UPDATE (SitReps & Incident Reports) */}
        {/* ========================================================= */}
        {activeTab === 'update' && (
          <div id="base-update-section" className="max-w-4xl mx-auto flex flex-col gap-6">
            {isPlayerBase && (
              <form
                onSubmit={handlePostUpdate}
                className="flex items-center gap-2 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-lg"
              >
                <Radio className="w-4 h-4 text-amber-400 ml-2 animate-pulse shrink-0" />
                <input
                  id="base-report-input"
                  type="text"
                  value={newUpdateInput}
                  onChange={(e) => setNewUpdateInput(e.target.value)}
                  placeholder="Transmit new tactical intelligence report or request to base..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit</span>
                </button>
              </form>
            )}

            {/* SitRep Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="font-bold uppercase tracking-wider">Tactical SITREP Feed</span>
                <span>{reports.length} Logs Logged</span>
              </div>

              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl flex items-start gap-3 text-xs font-mono"
                >
                  <Activity className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">{r.type}</span>
                      <span className="text-[10px] text-zinc-500">{r.timeAgo}</span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONTROL (Defensive Situations) */}
        {/* ========================================================= */}
        {activeTab === 'control' && (
          <div id="base-control-section" className="max-w-4xl mx-auto space-y-6">
            {activeDefenseNotice && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{activeDefenseNotice}</span>
              </div>
            )}

            <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-mono font-bold uppercase text-zinc-100">
                    Base Defensive Readiness (DEFCON Alert System)
                  </h3>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  LEVEL {defconLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    disabled={!isPlayerBase}
                    onClick={() => {
                      setDefconLevel(lvl);
                      triggerDefensiveAction(`DEFCON Level Set to ${lvl}`, `Readiness adjusted to level ${lvl}.`);
                    }}
                    className={`p-3 rounded-lg border text-left font-mono text-xs transition-all cursor-pointer ${
                      defconLevel === lvl
                        ? lvl === 1
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md'
                          : lvl === 2
                          ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md'
                          : 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold mb-1">DEFCON-{lvl}</div>
                    <div className="text-[10px] opacity-75">
                      {lvl === 1 ? 'Maximum Combat Alert (Hostile Incursion)' : lvl === 2 ? 'Heightened Tactical Readiness' : 'Standard Peacetime Patrol'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Defensive Sub-systems */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-200">Anti-Air Missile Dome</span>
                  <button
                    disabled={!isPlayerBase}
                    onClick={() => {
                      setAirDefenseActive(!airDefenseActive);
                      triggerDefensiveAction('Anti-Air Net Toggled', `Status: ${!airDefenseActive ? 'ONLINE' : 'STANDBY'}`);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                      airDefenseActive ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {airDefenseActive ? 'ACTIVE' : 'STANDBY'}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">
                  Interceptors automatically engage incoming hostile cruise missiles and hostile fighter aircraft.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-200">Electronic Radar Jamming</span>
                  <button
                    disabled={!isPlayerBase}
                    onClick={() => {
                      setRadarJammingActive(!radarJammingActive);
                      triggerDefensiveAction('Jamming Array Toggled', `Status: ${!radarJammingActive ? 'ONLINE' : 'STANDBY'}`);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                      radarJammingActive ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {radarJammingActive ? 'ACTIVE' : 'STANDBY'}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">
                  Scrambles hostile GPS guidance telemetry within 350km perimeter.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MILITARY (Divided into Categories with Subnav Bar) */}
        {/* ========================================================= */}
        {activeTab === 'military' && (
          <div id="base-military-section" className="max-w-5xl mx-auto space-y-6">
            {/* Subnav bar for categories */}
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800 flex-wrap">
                <button
                  onClick={() => setMilitarySubCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                    militarySubCategory === 'all'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({categoryCounts.all})
                </button>
                <button
                  onClick={() => setMilitarySubCategory('air')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                    militarySubCategory === 'air'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Air ({categoryCounts.air})
                </button>
                <button
                  onClick={() => setMilitarySubCategory('missile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                    militarySubCategory === 'missile'
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/50'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Missile ({categoryCounts.missile})
                </button>
                <button
                  onClick={() => setMilitarySubCategory('armor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                    militarySubCategory === 'armor'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Armor ({categoryCounts.armor})
                </button>
                <button
                  onClick={() => setMilitarySubCategory('air-defense')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                    militarySubCategory === 'air-defense'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Air Defense ({categoryCounts['air-defense']})
                </button>
                <button
                  onClick={() => setMilitarySubCategory('infantry')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                    militarySubCategory === 'infantry'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Infantry ({categoryCounts.infantry})
                </button>
              </div>

              <div className="text-xs font-mono text-zinc-400">
                <span className="text-emerald-400 font-bold">{totalTroops.toLocaleString()}</span> Total Assets Stationed
              </div>
            </div>

            {/* Units Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMilitaryUnits.map((u) => {
                const cat = getUnitCategory(u);
                return (
                  <div
                    key={u.id}
                    className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 uppercase font-bold text-zinc-400">
                        {cat}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {u.count.toLocaleString()} Active
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-mono font-bold text-zinc-100">{u.name}</h4>
                      <p className="text-[10px] font-mono text-zinc-500">ID: {u.code}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Status: Ready</span>
                      {isPlayerBase && (
                        <button
                          onClick={() => {
                            setActiveTab('battle');
                            handleAddUnitTypeToStrike(u.id);
                          }}
                          className="text-red-400 hover:text-red-300 font-bold cursor-pointer"
                        >
                          + Stage to Ops
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
