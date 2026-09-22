import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Radio,
  Activity,
  Boxes,
  BarChart3,
  Flame,
  Crosshair,
  Radar,
  ChevronRight,
  MapPin,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Search,
  Database,
} from 'lucide-react';
import { MILITARY_BASES, MilitaryBase } from './militaryBases';
import { CountryFlag } from './countries';
import { AiCountryAgent } from './aiLearningSystem';
import { BattleSimulatorView } from './BattleSimulatorView';
import { AirtableArsenalView } from './AirtableArsenalView';

export type MilitaryTab =
  | 'base'
  | 'warfare'
  | 'arsenal'
  | 'intel'
  | 'activity'
  | 'units'
  | 'stats'
  | 'programs';

interface MilitaryProgram {
  id: string;
  name: string;
  codename: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  progress: number; // 0-100%
  category: 'aerospace' | 'laser' | 'space' | 'drone' | 'cyber' | 'naval';
  benefit: string;
}

const DEFAULT_PROGRAMS: MilitaryProgram[] = [
  {
    id: 'prog-hypersonic',
    name: 'Hypersonic Glide Vehicle (HGV)',
    codename: 'PROJECT SLEDGEHAMMER',
    description: 'Mach 8+ boost-glide atmospheric strike vectors capable of bypassing terminal defense radars.',
    cost: 45000000,
    level: 1,
    maxLevel: 5,
    progress: 40,
    category: 'aerospace',
    benefit: '+25% Strike Readiness, Global Rapid Response',
  },
  {
    id: 'prog-directed-energy',
    name: 'Directed Energy Laser Array',
    codename: 'HELIOS COUNTER-UAS',
    description: 'High-power 150kW fiber-optic laser turrets for instantaneous speed-of-light drone & rocket interception.',
    cost: 35000000,
    level: 2,
    maxLevel: 5,
    progress: 75,
    category: 'laser',
    benefit: '+30% Base Interception Ratio, Zero Munition Cost',
  },
  {
    id: 'prog-leo-recon',
    name: 'Low-Earth Orbit Recon Constellation',
    codename: 'AEGIS ORBITAL EYE',
    description: 'Synthetic Aperture Radar (SAR) and infrared micro-satellite constellation with 5-minute revisit rates.',
    cost: 50000000,
    level: 2,
    maxLevel: 5,
    progress: 60,
    category: 'space',
    benefit: 'Full Radar Transparency over Foreign Nations',
  },
  {
    id: 'prog-drone-swarm',
    name: 'Autonomous Collaborative Drone Swarm',
    codename: 'VALKYRIE SQUADRON',
    description: 'AI-guided loyal wingman uncrewed combat aerial vehicles operating with distributed mesh tactical decision logic.',
    cost: 30000000,
    level: 1,
    maxLevel: 5,
    progress: 25,
    category: 'drone',
    benefit: '+45% Air Superiority in Contested Sectors',
  },
  {
    id: 'prog-quantum-cyber',
    name: 'Quantum-Resistant Comms Mesh',
    codename: 'CIPHER BLACK',
    description: 'Post-quantum cryptographic key distribution network protecting all theater commands from electronic spoofing.',
    cost: 28000000,
    level: 3,
    maxLevel: 5,
    progress: 85,
    category: 'cyber',
    benefit: '100% Jamming Resistance, Instant Telemetry',
  },
  {
    id: 'prog-ocean-acoustic',
    name: 'Deep Ocean Acoustic Barrier',
    codename: 'NEPTUNE SONAR WALL',
    description: 'Sub-surface acoustic hydrophone array on continental shelves detecting nuclear attack submarines.',
    cost: 40000000,
    level: 1,
    maxLevel: 5,
    progress: 15,
    category: 'naval',
    benefit: 'Immunity to Submarine-Launched Cruise Missiles',
  },
];

interface MilitaryModalProps {
  userCountry: CountryFlag;
  money: number;
  aiAgents: Record<string, AiCountryAgent>;
  onDeductMoney: (amount: number) => void;
  onAddNotification: (title: string, message: string) => void;
  onFlyToBase: (lat: number, lng: number, zoom?: number) => void;
  onClose: () => void;
}

export const MilitaryModal: React.FC<MilitaryModalProps> = ({
  userCountry,
  money,
  aiAgents,
  onDeductMoney,
  onAddNotification,
  onFlyToBase,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<MilitaryTab>('base');
  const [baseSearch, setBaseSearch] = useState<string>('');
  const [selectedBaseFilter, setSelectedBaseFilter] = useState<'all' | 'mine' | 'alert'>('all');
  const [selectedBaseDetail, setSelectedBaseDetail] = useState<MilitaryBase | null>(null);

  // Military Programs State with Persistence
  const [programs, setPrograms] = useState<MilitaryProgram[]>(() => {
    const saved = localStorage.getItem('base_warfare_military_programs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROGRAMS;
  });

  // Base Fortifications State (allows user to fortify any base with money)
  const [fortifiedBases, setFortifiedBases] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('base_warfare_fortified_bases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // Save programs whenever modified
  useEffect(() => {
    localStorage.setItem('base_warfare_military_programs', JSON.stringify(programs));
  }, [programs]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Filter bases
  const filteredBases = MILITARY_BASES.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(baseSearch.toLowerCase()) ||
      b.countryName.toLowerCase().includes(baseSearch.toLowerCase()) ||
      b.codeName.toLowerCase().includes(baseSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedBaseFilter === 'mine') {
      return b.countryCode === userCountry.code;
    }
    if (selectedBaseFilter === 'alert') {
      return b.status === 'Alert';
    }
    return true;
  });

  // Upgrade / Fund Program
  const handleFundProgram = (prog: MilitaryProgram) => {
    if (money < prog.cost) {
      alert(`Insufficient funds. $${(prog.cost / 1e6).toFixed(1)}M required.`);
      return;
    }
    onDeductMoney(prog.cost);

    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === prog.id) {
          const nextProgress = Math.min(100, p.progress + 25);
          const nextLevel = nextProgress >= 100 && p.level < p.maxLevel ? p.level + 1 : p.level;
          const resetProgress = nextProgress >= 100 && p.level < p.maxLevel ? 0 : nextProgress;
          return {
            ...p,
            level: nextLevel,
            progress: resetProgress,
          };
        }
        return p;
      })
    );

    onAddNotification(
      'Military R&D Allocated',
      `Commander allocated $${(prog.cost / 1e6).toFixed(1)}M to ${prog.name} (${prog.codename}). Readiness advanced.`
    );
  };

  // Fortify Base
  const handleFortifyBase = (base: MilitaryBase) => {
    const cost = 15000000;
    if (money < cost) {
      alert('Insufficient funds. Fortification requires $15,000,000.');
      return;
    }
    onDeductMoney(cost);

    setFortifiedBases((prev) => {
      const updated = { ...prev, [base.id]: true };
      localStorage.setItem('base_warfare_fortified_bases', JSON.stringify(updated));
      return updated;
    });

    onAddNotification(
      'Fortress Reinforced',
      `${base.name} upgraded to MAX FORTIFICATION status. Anti-air and perimeter shielding hardened.`
    );
  };

  // Calculate aggregated stats across bases
  const totalTroops = MILITARY_BASES.reduce((acc, b) => {
    const infantry = b.units.filter((u) => u.type === 'infantry').reduce((s, u) => s + u.count, 0);
    return acc + infantry;
  }, 0);

  const totalAircraft = MILITARY_BASES.reduce((acc, b) => {
    const air = b.units.filter((u) => u.type === 'aircraft').reduce((s, u) => s + u.count, 0);
    return acc + air;
  }, 0);

  const totalArmor = MILITARY_BASES.reduce((acc, b) => {
    const arm = b.units.filter((u) => u.type === 'armor').reduce((s, u) => s + u.count, 0);
    return acc + arm;
  }, 0);

  const totalAirDefense = MILITARY_BASES.reduce((acc, b) => {
    const ad = b.units.filter((u) => u.type === 'air-defense').reduce((s, u) => s + u.count, 0);
    return acc + ad;
  }, 0);

  // All activities aggregated
  const allReports = MILITARY_BASES.flatMap((b) =>
    b.reports.map((r) => ({
      ...r,
      baseName: b.name,
      baseCodeName: b.codeName,
      countryName: b.countryName,
      countryCode: b.countryCode,
      flagUrl: b.flagUrl,
      lat: b.lat,
      lng: b.lng,
    }))
  ).sort((a, b) => {
    const rank = { urgent: 0, defense: 1, intel: 2, logistics: 3 };
    return rank[a.type] - rank[b.type];
  });

  return (
    <div
      id="military-full-modal"
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 font-sans select-none overflow-hidden animate-in fade-in duration-200"
    >
      {/* ================= TOP NOTCH NAVIGATION ================= */}
      <header
        id="military-top-notch-header"
        className="relative flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border-b border-red-500/40 shadow-2xl shrink-0"
      >
        {/* Left: Commander & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-950/80 border border-red-500/80 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase font-mono text-red-400">
                GLOBAL MILITARY COMMAND
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950 border border-red-500/50 text-red-300">
                DEFCON 2
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-mono flex items-center gap-2">
              <span>{userCountry.name}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-bold">${(money / 1e6).toFixed(1)}M TREASURY</span>
            </div>
          </div>
        </div>

        {/* Center: Top NAV Notch */}
        <nav
          id="military-nav-notch"
          aria-label="Military Navigation Notch"
          className="flex items-center gap-1 sm:gap-1.5 p-1 bg-zinc-900/90 border border-red-500/50 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.25)] overflow-x-auto max-w-[50vw] sm:max-w-none"
        >
          {(
            [
              { id: 'base', label: 'Base', icon: Shield },
              { id: 'warfare', label: 'Warfare (Rules & Sim)', icon: Crosshair },
              { id: 'arsenal', label: 'Airtable Arsenal (7)', icon: Database },
              { id: 'intel', label: 'Intel', icon: Radar },
              { id: 'activity', label: 'Activity', icon: Activity },
              { id: 'units', label: 'Units', icon: Boxes },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
              { id: 'programs', label: 'Programs', icon: Flame },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mil-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg border border-red-300/80 scale-102'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Close button */}
        <div className="flex items-center gap-2">
          <button
            id="close-military-modal-btn"
            onClick={onClose}
            aria-label="Close Military Command"
            title="Close Military Command (Esc)"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 hover:bg-red-950 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white transition-all duration-150 cursor-pointer shadow-md"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT VIEW ================= */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-zinc-950/80">
        {/* TAB 1: BASE (Bases across countries) */}
        {activeTab === 'base' && (
          <div id="mil-tab-base-content" className="max-w-7xl mx-auto space-y-4">
            {/* Header controls & filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={baseSearch}
                    onChange={(e) => setBaseSearch(e.target.value)}
                    placeholder="Search base, fortress, nation..."
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  <span className="text-red-400 font-bold">{filteredBases.length}</span> / {MILITARY_BASES.length} BASES
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {(
                  [
                    { id: 'all', label: 'All Bases' },
                    { id: 'mine', label: `${userCountry.code} Sovereign` },
                    { id: 'alert', label: 'High Alert' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedBaseFilter(f.id)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      selectedBaseFilter === f.id
                        ? 'bg-red-700 text-white font-bold border border-red-400'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredBases.map((base) => {
                const isFortified = fortifiedBases[base.id] || base.status === 'Fortified';
                const isSovereign = base.countryCode === userCountry.code;

                return (
                  <div
                    key={base.id}
                    className={`relative flex flex-col p-4 rounded-xl border backdrop-blur-md transition-all duration-150 ${
                      isSovereign
                        ? 'bg-red-950/20 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Top Row: Name, Flag, Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={base.flagUrl}
                          alt={base.countryName}
                          className="w-5 h-3.5 rounded object-cover border border-zinc-700 shadow"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-zinc-100 font-mono tracking-tight leading-tight">
                            {base.name}
                          </h3>
                          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            {base.countryName} • {base.codeName}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 border ${
                          isFortified
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                            : base.status === 'Alert'
                            ? 'bg-red-950 text-red-300 border-red-500/80 animate-pulse'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                        }`}
                      >
                        {isFortified ? 'Fortified' : base.status}
                      </span>
                    </div>

                    {/* Coordinates & DMS */}
                    <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 p-2 rounded-lg border border-zinc-800/80 mb-3 flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{base.dms}</span>
                      <span className="text-zinc-500">{base.lat.toFixed(3)}°, {base.lng.toFixed(3)}°</span>
                    </div>

                    {/* Units Mini-Summary */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px] font-mono">
                      {base.units.slice(0, 4).map((u) => (
                        <div key={u.id} className="flex items-center justify-between px-2 py-1 bg-zinc-950/60 rounded border border-zinc-800/50">
                          <span className="text-zinc-400 truncate max-w-[90px]">{u.name}</span>
                          <span className="text-emerald-400 font-bold">{u.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons: Deploy / Focus on Map & Fortify */}
                    <div className="mt-auto pt-2 flex items-center gap-2 border-t border-zinc-800/60">
                      <button
                        onClick={() => {
                          onFlyToBase(base.lat, base.lng, 8);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-red-900/80 hover:bg-red-800 border border-red-500/70 rounded-lg text-xs font-mono font-bold text-white transition-all cursor-pointer shadow-md"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Deploy Camera</span>
                      </button>

                      {!isFortified && (
                        <button
                          onClick={() => handleFortifyBase(base)}
                          title="Fortify Perimeter ($15M)"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/70 rounded-lg text-xs font-mono font-bold text-amber-200 transition-all cursor-pointer"
                        >
                          <Shield className="w-3 h-3 text-amber-400" />
                          <span>+$15M Fortify</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: WARFARE & RULES SIMULATOR (10-field priority air combat engine) */}
        {activeTab === 'warfare' && (
          <div id="mil-tab-warfare-content">
            <BattleSimulatorView onAddNotification={onAddNotification} />
          </div>
        )}

        {/* TAB: AIRTABLE ARSENAL (7 Military Tables) */}
        {activeTab === 'arsenal' && (
          <div id="mil-tab-arsenal-content">
            <AirtableArsenalView
              money={money}
              onDeductMoney={onDeductMoney}
              onAddNotification={onAddNotification}
            />
          </div>
        )}

        {/* TAB 2: INTEL (Satellite scans, neural AI surveillance, threat levels) */}
        {activeTab === 'intel' && (
          <div id="mil-tab-intel-content" className="max-w-6xl mx-auto space-y-4">
            {/* Top Threat Banner */}
            <div className="p-4 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-900 border border-red-500/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-900/80 border border-red-400 flex items-center justify-center text-red-300">
                  <Radar className="w-6 h-6 animate-spin text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-mono text-white uppercase tracking-wider">
                    GLOBAL SATELLITE RECONNAISSANCE GRID
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    High-altitude SAR telemetry feeds synchronized across {MILITARY_BASES.length} military installations.
                    Autonomous Neural AI matrix actively monitoring all foreign doctrines.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <div className="px-3 py-1.5 bg-zinc-950 rounded-lg border border-red-500/40 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase">Threat Level</div>
                  <div className="text-sm font-black text-red-400">ELEVATED</div>
                </div>
                <div className="px-3 py-1.5 bg-zinc-950 rounded-lg border border-cyan-500/40 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase">AI Agents</div>
                  <div className="text-sm font-black text-cyan-400">{Object.keys(aiAgents).length} ACTIVE</div>
                </div>
              </div>
            </div>

            {/* Foreign AI Surveillance Matrix */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>FOREIGN AI NEURAL WARFARE SURVEILLANCE MATRIX</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(aiAgents).slice(0, 12).map((agent) => (
                  <div
                    key={agent.countryCode}
                    className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-zinc-200">
                          {agent.countryName}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                            agent.threatAssessment === 'Critical'
                              ? 'bg-red-950 text-red-300 border border-red-500/60'
                              : agent.threatAssessment === 'Elevated'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                              : agent.threatAssessment === 'Moderate'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/60'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                          }`}
                        >
                          {agent.threatAssessment}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[10px] font-mono text-zinc-400">
                        <div className="flex justify-between">
                          <span>Warfare Readiness:</span>
                          <span className="text-red-400 font-bold">{agent.warfareReadiness}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${agent.warfareReadiness}%` }} />
                        </div>

                        <div className="flex justify-between">
                          <span>Economic Score:</span>
                          <span className="text-emerald-400 font-bold">{agent.economicScore}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${agent.economicScore}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-800/60 text-[9px] font-mono text-zinc-500 truncate">
                      Epoch: <span className="text-zinc-300">{agent.epoch}</span> • XP: <span className="text-zinc-300">{agent.experiencePoints}</span> • <span className="text-amber-400 uppercase truncate">{agent.warfareDoctrine}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY (Live theater activity & reports) */}
        {activeTab === 'activity' && (
          <div id="mil-tab-activity-content" className="max-w-5xl mx-auto space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                <span>LIVE THEATER ACTIVITY & DISPATCH LOGS</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {allReports.length} Dispatches Recorded
              </span>
            </div>

            <div className="space-y-2.5">
              {allReports.map((rep, idx) => (
                <div
                  key={`${rep.id}-${idx}`}
                  className="p-3.5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-start gap-3 transition-colors"
                >
                  <img
                    src={rep.flagUrl}
                    alt={rep.countryName}
                    className="w-6 h-4 rounded object-cover border border-zinc-700 shrink-0 mt-0.5 shadow"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-200">
                          {rep.baseName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          ({rep.countryName})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                            rep.type === 'urgent'
                              ? 'bg-red-950 text-red-300 border border-red-500'
                              : rep.type === 'defense'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500'
                              : rep.type === 'intel'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          }`}
                        >
                          {rep.type}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">{rep.timeAgo}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{rep.text}</p>
                  </div>

                  <button
                    onClick={() => {
                      onFlyToBase(rep.lat, rep.lng, 8);
                      onClose();
                    }}
                    title="Jump camera to base location"
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg shrink-0 cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UNITS (Inspection of all military units & categories) */}
        {activeTab === 'units' && (
          <div id="mil-tab-units-content" className="max-w-6xl mx-auto space-y-4">
            {/* Aggregate unit category cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Active Infantry</span>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
                  {totalTroops.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Special Ops & Combat Divisions</div>
              </div>

              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Air Fleet</span>
                <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400 mt-1">
                  {totalAircraft.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">F-22, F-35, Su-57, J-20, Rafale</div>
              </div>

              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Main Battle Tanks</span>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1">
                  {totalArmor.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Abrams, Leopard 2A8, T-90M</div>
              </div>

              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">SAM & Air Defense</span>
                <div className="text-xl sm:text-2xl font-black font-mono text-red-400 mt-1">
                  {totalAirDefense.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Patriot, S-400, Iron Dome, THAAD</div>
              </div>
            </div>

            {/* Unit Breakdown Across Theaters */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">
                THEATER HARDWARE & GARRISON DISPATCHES
              </h4>

              <div className="space-y-3">
                {MILITARY_BASES.filter((b) => b.countryCode === userCountry.code || b.status === 'Alert').map((b) => (
                  <div key={b.id} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={b.flagUrl} alt="" className="w-4 h-3 rounded object-cover" />
                        <span className="font-mono text-xs font-bold text-zinc-200">{b.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">({b.countryName})</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{b.status}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {b.units.map((u) => (
                        <div key={u.id} className="p-2 bg-zinc-900/60 rounded border border-zinc-800/80 text-[10px] font-mono">
                          <div className="text-zinc-400 truncate">{u.name}</div>
                          <div className="text-sm font-bold text-white mt-0.5">{u.count}</div>
                          <div className="text-[9px] text-zinc-500 uppercase">{u.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STATS (Strategic statistics, combat readiness, defense indexes) */}
        {activeTab === 'stats' && (
          <div id="mil-tab-stats-content" className="max-w-6xl mx-auto space-y-4 font-mono">
            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 uppercase">Interception Success Ratio</span>
                <div className="text-3xl font-black text-emerald-400 mt-2">98.4%</div>
                <p className="text-xs text-zinc-500 mt-1 font-sans">
                  Patriot PAC-3, Iron Dome, and S-400 interception network verified during recent drone & missile surges.
                </p>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 uppercase">Global Base Fortification</span>
                <div className="text-3xl font-black text-amber-400 mt-2">
                  {MILITARY_BASES.filter((b) => fortifiedBases[b.id] || b.status === 'Fortified').length} / {MILITARY_BASES.length}
                </div>
                <p className="text-xs text-zinc-500 mt-1 font-sans">
                  Outposts upgraded with hardened subterranean bunkers and automated radar domes.
                </p>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 uppercase">Military Spending Power</span>
                <div className="text-3xl font-black text-cyan-400 mt-2">
                  ${(money / 1e6).toFixed(1)}M
                </div>
                <p className="text-xs text-zinc-500 mt-1 font-sans">
                  Liquid national treasury balance ready for instantaneous military equipment procurement and megaprojects.
                </p>
              </div>
            </div>

            {/* Strategic Readiness Bars */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                THEATER STRATEGIC READINESS PARAMETERS
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Nuclear Deterrence Readiness</span>
                    <span className="text-red-400 font-bold">100% (READY)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Air Supremacy & Quick Reaction Alert (QRA)</span>
                    <span className="text-cyan-400 font-bold">94%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[94%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Logistics & Propellant Supply Pipeline</span>
                    <span className="text-emerald-400 font-bold">88%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Cyber Warfare & Space Link Integrity</span>
                    <span className="text-amber-400 font-bold">91%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[91%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROGRAMS (Strategic military R&D programs) */}
        {activeTab === 'programs' && (
          <div id="mil-tab-programs-content" className="max-w-6xl mx-auto space-y-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>STRATEGIC MILITARY R&D SPECIAL PROGRAMS</span>
                </span>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Allocate national funds to accelerate hypersonic, laser, space, and autonomous swarm capabilities.
                </p>
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold">
                Treasury: ${(money / 1e6).toFixed(1)}M
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {programs.map((prog) => {
                const canAfford = money >= prog.cost;
                const isMax = prog.level >= prog.maxLevel && prog.progress >= 100;

                return (
                  <div
                    key={prog.id}
                    className="p-4 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <h4 className="font-mono font-bold text-sm text-zinc-100">{prog.name}</h4>
                          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                            {prog.codename}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-bold text-amber-300 border border-zinc-700">
                          Tier {prog.level} / {prog.maxLevel}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 font-sans mb-3 leading-relaxed">
                        {prog.description}
                      </p>

                      <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[11px] font-mono text-emerald-400 mb-3">
                        <span className="text-zinc-500">Capability:</span> {prog.benefit}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 mb-3 font-mono text-[10px]">
                        <div className="flex justify-between text-zinc-400">
                          <span>Research Completion</span>
                          <span className="text-white font-bold">{prog.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-red-500 h-full transition-all duration-300"
                            style={{ width: `${prog.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFundProgram(prog)}
                      disabled={!canAfford || isMax}
                      className={`w-full py-2 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isMax
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : canAfford
                          ? 'bg-red-700 hover:bg-red-600 text-white shadow-lg border border-red-400 active:scale-98'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isMax ? (
                        <span>MAX TIER REACHED</span>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Fund Advance: ${(prog.cost / 1e6).toFixed(1)}M</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
