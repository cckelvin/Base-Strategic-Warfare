import React, { useState } from 'react';
import {
  X,
  Menu,
  Hammer,
  Home,
  Briefcase,
  Factory,
  Sparkles,
  ShieldAlert,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Building,
  Zap,
  Layers,
  ChevronRight,
  HardHat,
} from 'lucide-react';

export type ConstructCategory = 'residential' | 'commercial' | 'industrial' | 'special' | 'military';

export interface StructureItem {
  id: string;
  name: string;
  category: ConstructCategory;
  cost: number;
  costFormatted: string;
  buildTime: string;
  iconName: string;
  benefits: {
    label: string;
    value: string;
    type: 'income' | 'defense' | 'workforce' | 'energy' | 'special';
  }[];
  description: string;
  level: number;
}

export const CONSTRUCT_CATALOG: StructureItem[] = [
  // Residential
  {
    id: 'res-modular-housing',
    name: 'Modular Habitation Pods',
    category: 'residential',
    cost: 25000000,
    costFormatted: '$25,000,000',
    buildTime: '15s',
    iconName: 'Home',
    benefits: [
      { label: 'Workforce', value: '+30,000 Citizens', type: 'workforce' },
      { label: 'Tax Revenue', value: '+$3.2M / min', type: 'income' },
    ],
    description: 'Rapid-assembly high-density residential pods providing instant civic workforce mobilization.',
    level: 1,
  },
  {
    id: 'res-civilian-arcology',
    name: 'Civilian Megastructure Arcology',
    category: 'residential',
    cost: 85000000,
    costFormatted: '$85,000,000',
    buildTime: '30s',
    iconName: 'Building',
    benefits: [
      { label: 'Workforce', value: '+140,000 Citizens', type: 'workforce' },
      { label: 'Tax Revenue', value: '+$9.5M / min', type: 'income' },
      { label: 'Stability', value: '+15% Civil Order', type: 'special' },
    ],
    description: 'Self-contained climate-controlled vertical arcology with integrated hydroponics and subways.',
    level: 2,
  },
  {
    id: 'res-subterranean-bunker',
    name: 'Subterranean Fallout Redoubt',
    category: 'residential',
    cost: 160000000,
    costFormatted: '$160,000,000',
    buildTime: '45s',
    iconName: 'ShieldAlert',
    benefits: [
      { label: 'Protected Pop', value: '60,000 Citizens', type: 'workforce' },
      { label: 'Bomb Shelter', value: '+450 Defense Rating', type: 'defense' },
      { label: 'Survival Buffer', value: '100% Nuclear Hardened', type: 'special' },
    ],
    description: 'Deep granite cavern residential bunker designed to preserve leadership and workforce through global conflict.',
    level: 3,
  },

  // Commercial
  {
    id: 'com-trade-depot',
    name: 'Strategic Commodity Terminal',
    category: 'commercial',
    cost: 45000000,
    costFormatted: '$45,000,000',
    buildTime: '20s',
    iconName: 'Briefcase',
    benefits: [
      { label: 'Trade Flow', value: '+$6.8M / min', type: 'income' },
      { label: 'Logistics', value: '+12% Transport Velocity', type: 'special' },
    ],
    description: 'Intermodal freight transfer terminal connecting rail, sea, and airfield cargo corridors.',
    level: 1,
  },
  {
    id: 'com-financial-citadel',
    name: 'High-Frequency Financial Citadel',
    category: 'commercial',
    cost: 110000000,
    costFormatted: '$110,000,000',
    buildTime: '35s',
    iconName: 'TrendingUp',
    benefits: [
      { label: 'Capital Tax', value: '+$18.5M / min', type: 'income' },
      { label: 'Treasury Yield', value: '+8% Liquid Interest', type: 'income' },
    ],
    description: 'Algorithmic sovereign bond exchange maximizing national capital liquidity and trade tariff returns.',
    level: 2,
  },
  {
    id: 'com-deepwater-port',
    name: 'Free Trade Deepwater Port',
    category: 'commercial',
    cost: 210000000,
    costFormatted: '$210,000,000',
    buildTime: '50s',
    iconName: 'Layers',
    benefits: [
      { label: 'Maritime Revenue', value: '+$32.0M / min', type: 'income' },
      { label: 'Export Buffer', value: '+25% Foreign Market Access', type: 'special' },
    ],
    description: 'Automated container superport facilitating massive raw mineral, energy, and munitions transfers.',
    level: 3,
  },

  // Industrial
  {
    id: 'ind-munitions-foundry',
    name: 'Heavy Munitions Foundry',
    category: 'industrial',
    cost: 65000000,
    costFormatted: '$65,000,000',
    buildTime: '25s',
    iconName: 'Factory',
    benefits: [
      { label: 'Artillery Rounds', value: '+4,500 Shells / hr', type: 'defense' },
      { label: 'Industrial Output', value: '+$8.2M / min', type: 'income' },
    ],
    description: 'Blast furnaces and hydraulic press lines forging heavy ordnance, shells, and rocket propellants.',
    level: 1,
  },
  {
    id: 'ind-armor-assembly',
    name: 'Mechanized Armor Assembly Plant',
    category: 'industrial',
    cost: 145000000,
    costFormatted: '$145,000,000',
    buildTime: '40s',
    iconName: 'Factory',
    benefits: [
      { label: 'Tank Assembly', value: '+18 MBTs / day', type: 'defense' },
      { label: 'Defense Armor', value: '+320 Armor Factor', type: 'defense' },
      { label: 'Revenue', value: '+$14.0M / min', type: 'income' },
    ],
    description: 'Robotic assembly plant manufacturing main battle tanks, armored fighting vehicles, and mobile artillery.',
    level: 2,
  },
  {
    id: 'ind-semiconductor-fab',
    name: 'Strategic Semiconductor Fab',
    category: 'industrial',
    cost: 320000000,
    costFormatted: '$320,000,000',
    buildTime: '60s',
    iconName: 'Zap',
    benefits: [
      { label: 'Microchips', value: '2nm Military Silicon', type: 'special' },
      { label: 'Drone Guidance', value: '+40% UAV Precision', type: 'special' },
      { label: 'High-Tech Yield', value: '+$42.0M / min', type: 'income' },
    ],
    description: 'Ultra-clean manufacturing cleanrooms etching high-performance microchips for guided missiles and satellite arrays.',
    level: 3,
  },

  // Special
  {
    id: 'spe-quantum-node',
    name: 'Quantum Decryption Citadel',
    category: 'special',
    cost: 380000000,
    costFormatted: '$380,000,000',
    buildTime: '45s',
    iconName: 'Sparkles',
    benefits: [
      { label: 'Cryptanalysis', value: '+85% Foreign Intel Interception', type: 'special' },
      { label: 'Cyber Shield', value: 'Impentrable Firewall', type: 'defense' },
    ],
    description: 'Cryogenically cooled quantum computing cluster breaking enemy communications and intercepting tactical telemetry.',
    level: 2,
  },
  {
    id: 'spe-fusion-reactor',
    name: 'Fusion Energy Hyper-Reactor',
    category: 'special',
    cost: 850000000,
    costFormatted: '$850,000,000',
    buildTime: '60s',
    iconName: 'Zap',
    benefits: [
      { label: 'Energy Capacity', value: '+12,000 Megawatts Clean', type: 'energy' },
      { label: 'Grid Surplus', value: '+$75.0M / min Energy Sales', type: 'income' },
      { label: 'EMP Hardening', value: '+100% Grid Resilience', type: 'defense' },
    ],
    description: 'Magnetic confinement fusion tokamak supplying boundless energy to sovereign defenses, factories, and megacities.',
    level: 3,
  },
  {
    id: 'spe-orbital-silo',
    name: 'Orbital Defense & Strike Array',
    category: 'special',
    cost: 1400000000,
    costFormatted: '$1,400,000,000',
    buildTime: '90s',
    iconName: 'Sparkles',
    benefits: [
      { label: 'Kinetic Rods', value: 'Global Space-to-Ground Strike', type: 'defense' },
      { label: 'Planetary Radar', value: '100% Map Fog Clearance', type: 'special' },
    ],
    description: 'Sub-orbital launch silos housing tungsten kinetic bombardment projectiles capable of striking anywhere on Earth in 12 minutes.',
    level: 4,
  },

  // Military
  {
    id: 'mil-sam-battery',
    name: 'Patriot SAM Air-Defense Battery',
    category: 'military',
    cost: 60000000,
    costFormatted: '$60,000,000',
    buildTime: '20s',
    iconName: 'ShieldAlert',
    benefits: [
      { label: 'Air Shield', value: '+420 Interceptor Defense', type: 'defense' },
      { label: 'Radar Coverage', value: '500km Airspace Dome', type: 'defense' },
    ],
    description: 'Phased-array radar and surface-to-air missile launchers intercepting incoming cruise missiles and hostile bombers.',
    level: 1,
  },
  {
    id: 'mil-drone-hive',
    name: 'Autonomous Drone Swarm Hive',
    category: 'military',
    cost: 140000000,
    costFormatted: '$140,000,000',
    buildTime: '35s',
    iconName: 'ShieldAlert',
    benefits: [
      { label: 'Swarm Units', value: '+120 Loitering Munitions', type: 'defense' },
      { label: 'Targeting AI', value: '+35% Border Interdiction', type: 'defense' },
    ],
    description: 'Automated subterranean silos deploying AI-networked suicide drone swarms for persistent reconnaissance and counter-battery fire.',
    level: 2,
  },
  {
    id: 'mil-ballistic-silo',
    name: 'Hardened ICBM Deterrence Silo',
    category: 'military',
    cost: 450000000,
    costFormatted: '$450,000,000',
    buildTime: '55s',
    iconName: 'ShieldAlert',
    benefits: [
      { label: 'Nuclear Triad', value: '+1,200 Strategic Deterrence', type: 'defense' },
      { label: 'Sovereign Threat', value: 'DEFCON 1 Counterstrike Ready', type: 'special' },
    ],
    description: 'Blast-shielded reinforced concrete silos housing intercontinental hypersonic glide vehicles in permanent standby.',
    level: 3,
  },
];

interface ConstructModalProps {
  money: number;
  onDeductMoney: (amount: number) => void;
  onAddNotification: (title: string, message: string) => void;
  onClose: () => void;
}

export default function ConstructModal({
  money,
  onDeductMoney,
  onAddNotification,
  onClose,
}: ConstructModalProps) {
  const [activeCategory, setActiveCategory] = useState<ConstructCategory>('residential');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [constructedIds, setConstructedIds] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('base_warfare_constructed_buildings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      'res-modular-housing': 1,
      'ind-munitions-foundry': 1,
    };
  });
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const categories: { key: ConstructCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'residential', label: 'Residential', icon: <Home className="w-4 h-4" />, color: 'text-emerald-400' },
    { key: 'commercial', label: 'Commercial', icon: <Briefcase className="w-4 h-4" />, color: 'text-cyan-400' },
    { key: 'industrial', label: 'Industrial', icon: <Factory className="w-4 h-4" />, color: 'text-amber-400' },
    { key: 'special', label: 'Special', icon: <Sparkles className="w-4 h-4" />, color: 'text-purple-400' },
    { key: 'military', label: 'Military', icon: <ShieldAlert className="w-4 h-4" />, color: 'text-red-400' },
  ];

  const currentItems = CONSTRUCT_CATALOG.filter((i) => i.category === activeCategory);

  const handleBuild = (item: StructureItem) => {
    if (money < item.cost) {
      alert(`Insufficient Treasury! Requires ${item.costFormatted}, you have $${money.toLocaleString()}`);
      return;
    }

    onDeductMoney(item.cost);
    const newCount = (constructedIds[item.id] || 0) + 1;
    const updated = {
      ...constructedIds,
      [item.id]: newCount,
    };
    setConstructedIds(updated);
    localStorage.setItem('base_warfare_constructed_buildings', JSON.stringify(updated));

    onAddNotification(
      'Construction Order Dispatched',
      `Commenced construction of ${item.name} for ${item.costFormatted}. Project active in national grid.`
    );

    setSuccessToast(`Construction Initiated: ${item.name}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div
      id="construct-full-page"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* TOP NOTCH SAYING "CONSTRUCT" (Exactly as requested) */}
      <div
        id="construct-top-notch"
        className="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-6 sm:px-10 py-2 sm:py-2.5 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b-2 border-x-2 border-amber-500/80 rounded-b-2xl shadow-[0_10px_35px_rgba(245,158,11,0.35)]"
      >
        <Hammer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-bounce" />
        <span className="font-mono font-black text-xs sm:text-base tracking-[0.28em] text-amber-300 uppercase">
          CONSTRUCT
        </span>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      </div>

      {/* Main Top Header Controls */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 bg-zinc-900/90 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle Button on the left */}
          <button
            id="construct-hamburger-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Categories Menu"
            aria-label="Toggle Construct Categories"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase hidden sm:inline">MENU</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-300 hidden md:inline">
              STRATEGIC INFRASTRUCTURE & MUNITIONS YARDS
            </span>
          </div>
        </div>

        {/* Right side: Treasury Display & Close Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950 border border-emerald-500/50 shadow-inner">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
              ${money.toLocaleString()}
            </span>
          </div>

          <button
            id="close-construct-modal-btn"
            onClick={onClose}
            aria-label="Close Construct Modal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-mono font-semibold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">EXIT</span>
          </button>
        </div>
      </header>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-1.5 bg-amber-500/90 text-zinc-950 font-mono font-bold text-xs rounded-full shadow-2xl backdrop-blur-md border border-amber-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* HAMBURGER MENU AT THE LEFT (residential, commercial, industrial, special, military) */}
        <aside
          id="construct-categories-sidebar"
          className={`${
            isSidebarOpen ? 'w-64 sm:w-72' : 'w-0'
          } border-r border-zinc-800 bg-zinc-950/90 backdrop-blur-xl flex flex-col transition-all duration-200 overflow-hidden shrink-0`}
        >
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              <HardHat className="w-4 h-4" />
              <span>SECTOR DIVISIONS</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 mt-1">
              Select category to expand building specifications
            </p>
          </div>

          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              const countInCategory = CONSTRUCT_CATALOG.filter((i) => i.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  id={`cat-btn-${cat.key}`}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/80 shadow-lg translate-x-1'
                      : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={cat.color}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-500 border border-zinc-800">
                    {countInCategory}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Construction Queue / Summary */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/40 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center justify-between text-zinc-300 mb-1">
              <span>ACTIVE FACILITIES</span>
              <span className="text-amber-400 font-bold">
                {Object.values(constructedIds).reduce((a, b) => a + b, 0)} Units
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">
              Facilities continuously boost national revenue, production, and defense ratings.
            </p>
          </div>
        </aside>

        {/* MAIN BODY: Grid of Constructible Structures */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-zinc-900/30">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Category Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300">
                  <Hammer className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-mono text-zinc-100 uppercase tracking-wide">
                    {activeCategory} Construction Sector
                  </h2>
                  <p className="text-xs font-mono text-zinc-400">
                    Deploy heavy infrastructure directly into sovereign territory. Costs are deducted from national treasury.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-950 border border-zinc-800 text-zinc-300">
                  {currentItems.length} Blueprints Ready
                </span>
              </div>
            </div>

            {/* Structure Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentItems.map((item) => {
                const builtCount = constructedIds[item.id] || 0;
                const canAfford = money >= item.cost;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 shadow-xl flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Top Row: Category Tag & Built Count */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {item.category} • TIER {item.level}
                        </span>

                        {builtCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                            {builtCount} ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Structure Name */}
                      <h3 className="text-base font-bold font-mono text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Benefits Matrix */}
                      <div className="mt-4 space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        {item.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-mono">
                            <span className="text-zinc-400">{b.label}</span>
                            <span
                              className={`font-bold ${
                                b.type === 'income'
                                  ? 'text-emerald-400'
                                  : b.type === 'defense'
                                  ? 'text-red-400'
                                  : b.type === 'energy'
                                  ? 'text-amber-400'
                                  : 'text-cyan-400'
                              }`}
                            >
                              {b.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Cost & Action Button */}
                    <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">TREASURY COST</div>
                        <div className="text-sm sm:text-base font-mono font-bold text-emerald-400">
                          {item.costFormatted}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuild(item)}
                        disabled={!canAfford}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg hover:shadow-amber-500/25 active:scale-95'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                        }`}
                      >
                        <Hammer className="w-3.5 h-3.5" />
                        <span>{canAfford ? 'BUILD' : 'LOCKED'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
