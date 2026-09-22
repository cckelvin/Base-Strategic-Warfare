import React, { useState } from 'react';
import {
  Shield,
  Globe,
  User,
  Cpu,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { COUNTRIES, CountryFlag } from './countries';

interface GameInitModalProps {
  initialCountry?: CountryFlag;
  initialUserId?: string;
  initialWorldId?: string;
  onInitializeGame: (country: CountryFlag, userId: string, worldId: string) => void;
  canCancel?: boolean;
  onCancel?: () => void;
}

const DEFAULT_CALLSIGNS = [
  'CMD-VALKYRIE-01',
  'CMD-GHOST-77',
  'CMD-TITAN-X',
  'CMD-AURORA-9',
  'CMD-SPECTER-4',
  'CMD-IRONCLAD-12',
  'CMD-SENTINEL-88',
  'CMD-PHOENIX-03',
];

const DEFAULT_WORLDS = [
  'WORLD-2026-PRIME',
  'WORLD-ALPHA-SECTOR',
  'WORLD-TERRA-WAR-01',
  'WORLD-CYBER-THEATER',
  'WORLD-GLOBAL-WARFARE-X',
];

export default function GameInitModal({
  initialCountry,
  initialUserId = '',
  initialWorldId = '',
  onInitializeGame,
  canCancel = false,
  onCancel,
}: GameInitModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryFlag>(
    initialCountry || COUNTRIES[0]
  );
  const [countrySearch, setCountrySearch] = useState('');
  const [userId, setUserId] = useState(initialUserId || 'CMD-OVERLORD-01');
  const [worldId, setWorldId] = useState(initialWorldId || 'WORLD-2026-PRIME');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleRandomizeCallsign = () => {
    const pick = DEFAULT_CALLSIGNS[Math.floor(Math.random() * DEFAULT_CALLSIGNS.length)];
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    setUserId(`${pick.split('-')[0]}-${pick.split('-')[1]}-${randomSuffix}`);
  };

  const handleRandomizeWorld = () => {
    const pick = DEFAULT_WORLDS[Math.floor(Math.random() * DEFAULT_WORLDS.length)];
    const randomNum = Math.floor(Math.random() * 90) + 10;
    setWorldId(`${pick.split('-')[0]}-${pick.split('-')[1]}-${randomNum}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !userId.trim() || !worldId.trim()) return;
    onInitializeGame(selectedCountry, userId.trim().toUpperCase(), worldId.trim().toUpperCase());
  };

  return (
    <div
      id="game-init-modal-overlay"
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-zinc-950/90 backdrop-blur-2xl text-zinc-100 select-none overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        id="game-init-card"
        className="w-full max-w-2xl bg-zinc-900/95 border-2 border-zinc-700/90 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto"
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-500/60 flex items-center justify-center text-red-400 shadow-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
                  COMMAND INITIALIZATION
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NEW GAME SETUP
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black font-mono tracking-tight text-white uppercase">
                Base: Strategic Warfare
              </h1>
            </div>
          </div>

          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
          {/* Tactical briefing banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 animate-pulse" />
              <span>Internal Learning AI Matrix Online</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Input your sovereign Nation, Commander Call-Sign, and World Theater ID to boot the live session.
              All other countries on the planetary map will be autonomously controlled by an internal reinforcement learning AI engine that adapts economic policies, defense budgets, and combat postures through experience updates.
            </p>
          </div>

          {/* 1. Country Selection (All countries on map) */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Select Sovereign Country ({COUNTRIES.length} Available)</span>
              </span>
              <span className="text-[10px] text-zinc-500">All countries on planetary map</span>
            </label>

            {/* Selected Country Display / Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-700 hover:border-cyan-500/70 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCountry.flagUrl}
                    alt={selectedCountry.name}
                    className="w-8 h-5 sm:w-10 sm:h-6 object-cover rounded shadow border border-zinc-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-bold font-mono text-zinc-100 group-hover:text-cyan-300 transition-colors">
                      {selectedCountry.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      ISO Code: <span className="text-cyan-400 font-bold">{selectedCountry.code}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-xs font-mono hidden sm:inline">Change Nation</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expandable Country Selector Dropdown */}
              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 p-3 bg-zinc-950 border-2 border-cyan-500/60 rounded-xl shadow-2xl max-h-64 flex flex-col">
                  <div className="relative mb-2 shrink-0">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search country by name or code..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      autoFocus
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="overflow-y-auto space-y-1 flex-1 pr-1 custom-scrollbar">
                    {filteredCountries.length === 0 ? (
                      <div className="p-3 text-center text-xs font-mono text-zinc-500">
                        No nation found matching "{countrySearch}"
                      </div>
                    ) : (
                      filteredCountries.map((c) => {
                        const isCurrent = c.code === selectedCountry.code;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-cyan-950/80 border border-cyan-500 text-cyan-200'
                                : 'hover:bg-zinc-900 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={c.flagUrl}
                                alt={c.name}
                                className="w-6 h-4 object-cover rounded shadow-sm border border-zinc-700"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-xs font-mono font-medium">{c.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 font-bold">{c.code}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. User ID / Commander Call-Sign */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>2. User ID / Commander Call-Sign</span>
              </label>
              <button
                type="button"
                onClick={handleRandomizeCallsign}
                className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Randomize ID</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. CMD-OVERLORD-01"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-sm font-mono text-amber-300 placeholder-zinc-600 focus:outline-none uppercase tracking-wider shadow-inner"
              />
            </div>
          </div>

          {/* 3. World ID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. World ID / Server Sector</span>
              </label>
              <button
                type="button"
                onClick={handleRandomizeWorld}
                className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Randomize World</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={worldId}
                onChange={(e) => setWorldId(e.target.value)}
                placeholder="e.g. WORLD-2026-PRIME"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-emerald-400 text-sm font-mono text-emerald-300 placeholder-zinc-600 focus:outline-none uppercase tracking-wider shadow-inner"
              />
            </div>

            {/* Quick World chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {DEFAULT_WORLDS.slice(0, 3).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWorldId(w)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    worldId === w
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button: Load Game */}
          <div className="pt-2">
            <button
              id="load-game-submit-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-500 text-white font-mono font-black text-sm sm:text-base uppercase tracking-widest shadow-[0_10px_35px_rgba(239,68,68,0.5)] border border-red-300/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>LOAD GAME & COMMENCE THEATER</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
