import React, { useState } from 'react';
import {
  X,
  Menu,
  Shield,
  Award,
  Globe,
  Settings,
  HelpCircle,
  Users,
  FileText,
  Lock,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Radio,
  Sparkles,
} from 'lucide-react';
import { CountryFlag, COUNTRIES } from './countries';
import { COUNTRY_PROFILES } from './countryProfiles';

interface UserInfoModalProps {
  country: CountryFlag;
  userId?: string;
  worldId?: string;
  onSelectCountry: (country: CountryFlag) => void;
  onOpenGameSetup?: () => void;
  onClose: () => void;
  onShowComingSoon: (message: string) => void;
}

export default function UserInfoModal({
  country,
  userId,
  worldId,
  onSelectCountry,
  onOpenGameSetup,
  onClose,
  onShowComingSoon,
}: UserInfoModalProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<
    'user-info' | 'settings' | 'about-game' | 'about-us' | 'credits' | 'privacy-policy'
  >('user-info');

  const defaultProfile = COUNTRY_PROFILES[country.code] || {
    code: country.code,
    name: country.name,
    flagUrl: country.flagUrl,
    worldId: `WID-${country.code}-SEC1`,
    nationId: `${country.code}-CMD-99001`,
    rankTitle: 'Supreme Commander',
    rankBadge: '⭐⭐⭐⭐⭐',
    rankTier: 'Tier 1 Sovereign Power',
    militaryBudget: '$50 Billion',
    activePersonnel: '250,000',
  };

  const profile = {
    ...defaultProfile,
    worldId: worldId || defaultProfile.worldId,
    nationId: userId || defaultProfile.nationId,
  };

  return (
    <div
      id="user-country-full-page"
      className="fixed inset-0 z-[100] flex bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* LEFT SIDEBAR (Hamburger Menu Drawer for User Info & Navigation) */}
      <aside
        id="user-info-sidebar"
        className={`fixed md:relative inset-y-0 left-0 z-30 w-72 md:w-80 bg-zinc-900/95 border-r border-zinc-800/90 flex flex-col transition-transform duration-300 shadow-2xl ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-900/40 border border-red-700/50 text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 block">
                Command Terminal
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Sovereignty Directory
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close Drawer"
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Highlight Card in Sidebar */}
        <div className="p-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded border border-zinc-700 overflow-hidden shadow shrink-0">
              <img
                src={country.flagUrl}
                alt={country.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold font-mono text-zinc-100 block truncate">
                {country.name}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="text-cyan-300 font-semibold truncate">{profile.worldId}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1 text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>{profile.rankBadge}</span>
            </div>
            <span className="text-zinc-400 truncate max-w-[130px]">{profile.nationId}</span>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
          <button
            id="nav-btn-user-info"
            onClick={() => {
              setActiveSection('user-info');
              if (window.innerWidth < 768) setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeSection === 'user-info'
                ? 'bg-red-700/80 text-white shadow-md border border-red-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-red-400" />
              <span>Commander Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            id="nav-btn-settings"
            onClick={() => {
              setActiveSection('settings');
              if (window.innerWidth < 768) setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeSection === 'settings'
                ? 'bg-red-700/80 text-white shadow-md border border-red-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            id="nav-btn-about-game"
            onClick={() => {
              setActiveSection('about-game');
              if (window.innerWidth < 768) setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeSection === 'about-game'
                ? 'bg-red-700/80 text-white shadow-md border border-red-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>About Game</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            id="nav-btn-about-us"
            onClick={() => {
              setActiveSection('about-us');
              if (window.innerWidth < 768) setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeSection === 'about-us'
                ? 'bg-red-700/80 text-white shadow-md border border-red-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>About Us</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            id="nav-btn-credits"
            onClick={() => {
              setActiveSection('credits');
              if (window.innerWidth < 768) setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeSection === 'credits'
                ? 'bg-red-700/80 text-white shadow-md border border-red-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Credits</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            id="nav-btn-privacy"
            onClick={() => {
              setActiveSection('privacy-policy');
              if (window.innerWidth < 768) setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeSection === 'privacy-policy'
                ? 'bg-red-700/80 text-white shadow-md border border-red-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </nav>

        {/* Switch Country Fast Trigger */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/50 space-y-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">
              Switch Player Nation
            </label>
            <select
              value={country.code}
              onChange={(e) => {
                const next = COUNTRIES.find((c) => c.code === e.target.value);
                if (next) onSelectCountry(next);
              }}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {onOpenGameSetup && (
            <button
              onClick={() => {
                onClose();
                onOpenGameSetup();
              }}
              className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer"
            >
              Reconfigure User & World ID
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar with hamburger toggle button and close full page button */}
        <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/80 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              id="hamburger-menu-btn"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              title="Toggle Menu"
              aria-label="Toggle Menu"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-5.5 rounded border border-zinc-700 overflow-hidden shadow">
                <img
                  src={country.flagUrl}
                  alt={country.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-base font-bold font-mono text-zinc-100 uppercase tracking-wide">
                {country.name}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                {profile.worldId}
              </span>
            </div>
          </div>

          <button
            id="close-user-page-btn"
            onClick={onClose}
            aria-label="Return to Map"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono font-semibold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>CLOSE</span>
          </button>
        </header>

        {/* Section Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* ================= USER INFO SECTION ================= */}
          {activeSection === 'user-info' && (
            <div id="section-user-info" className="max-w-4xl mx-auto flex flex-col gap-6">
              {/* PRIMARY ID CARD: Country Flag with World ID Beside It, then Badge Rank and Nation ID Below */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

                {/* Top of card: Country Flag then World ID Beside It */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-11 rounded-lg border-2 border-zinc-700 overflow-hidden shadow-lg shrink-0">
                      <img
                        src={country.flagUrl}
                        alt={country.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                        Designated Sovereign Nation
                      </span>
                      <h2 className="text-xl font-bold font-mono text-zinc-100">{country.name}</h2>
                    </div>
                  </div>

                  {/* World ID beside it */}
                  <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block leading-none">
                        World ID
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                        {profile.worldId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Below: Badge Rank and Beside It Nation ID */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Badge Rank Box */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Commander Rank Badge
                      </span>
                      <div className="text-sm font-bold font-mono text-amber-300">
                        {profile.rankBadge} {profile.rankTitle}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">{profile.rankTier}</span>
                    </div>
                  </div>

                  {/* Beside it: Nation ID Box */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Sovereign Nation ID
                      </span>
                      <span className="text-sm font-bold font-mono text-zinc-100 tracking-wider block truncate">
                        {profile.nationId}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Defense Network Node: ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Military & National Intelligence Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Annual Defense Budget</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">
                    {profile.militaryBudget}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Allocated Treasury Reserve</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Active Forces</span>
                  <span className="text-xl font-mono font-bold text-cyan-400">
                    {profile.activePersonnel}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Regular Military Personnel</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-1">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Operational Bases</span>
                  <span className="text-xl font-mono font-bold text-amber-400">Stationed Ready</span>
                  <span className="text-[10px] font-mono text-zinc-500">Pentagon-Form Fortress Units</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-zinc-200">
                    Sovereign Diplomatic Status
                  </h3>
                  <p className="text-xs font-mono text-zinc-500">
                    Manage alliances, treaties, and international border pacts.
                  </p>
                </div>
                <button
                  onClick={() => onShowComingSoon('Diplomatic Accord Management')}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-200 border border-zinc-700 cursor-pointer"
                >
                  Manage Accords
                </button>
              </div>
            </div>
          )}

          {/* ================= SETTINGS SECTION ================= */}
          {activeSection === 'settings' && (
            <div id="section-settings" className="max-w-3xl mx-auto flex flex-col gap-5">
              <h2 className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-zinc-400" />
                <span>Command Settings & Interface Preferences</span>
              </h2>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-mono font-bold text-zinc-200 block">
                      Audio Radar Alerts & Pings
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Play acoustic sonics when incoming drone strikes or air equipment are requested
                    </span>
                  </div>
                  <button
                    onClick={() => onShowComingSoon('Toggle Audio Settings')}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-emerald-400 border border-zinc-700 cursor-pointer"
                  >
                    ENABLED
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-mono font-bold text-zinc-200 block">
                      Satellite Map Cache
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Pre-fetch Esri world tiles to ensure instantaneous panning
                    </span>
                  </div>
                  <button
                    onClick={() => onShowComingSoon('Clear Local Tile Cache')}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 border border-zinc-700 cursor-pointer"
                  >
                    Flush Cache
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-mono font-bold text-zinc-200 block">
                      Tactical Graphics Fidelity
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Pentagon fortress models and pulsed radar beacon effects
                    </span>
                  </div>
                  <button
                    onClick={() => onShowComingSoon('Graphics Quality Setting')}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-amber-400 border border-zinc-700 cursor-pointer"
                  >
                    ULTRA HIGH
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABOUT GAME SECTION ================= */}
          {activeSection === 'about-game' && (
            <div id="section-about-game" className="max-w-3xl mx-auto flex flex-col gap-5">
              <h2 className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                <span>About Base Warfare Online</span>
              </h2>

              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-sm font-mono text-zinc-300 leading-relaxed flex flex-col gap-4">
                <p>
                  <strong>Base Warfare</strong> is a high-fidelity global military strategy simulator
                  rendered over live Esri satellite terrain. Players take command of sovereign nations,
                  overseeing fortified Pentagon-style strategic military installations stationed across the globe.
                </p>
                <p>
                  Key operational vectors include garrisoning F-22 stealth raptors, F-117 Nighthawks,
                  F-15 Strike Eagles, ground armor divisions, and interceptor missile shields. Real-world UTC
                  timekeeping maintains synchronized theater clocks across all sovereign bases.
                </p>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Version: 2.4.0-TACTICAL (Build ID: 2026.09-GLOBAL)</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABOUT US SECTION ================= */}
          {activeSection === 'about-us' && (
            <div id="section-about-us" className="max-w-3xl mx-auto flex flex-col gap-5">
              <h2 className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>About Us</span>
              </h2>

              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-sm font-mono text-zinc-300 leading-relaxed flex flex-col gap-4">
                <p>
                  We are an international tactical simulations lab committed to engineering real-world,
                  browser-native planetary visualization engines and grand strategy simulators.
                </p>
                <p>
                  Our mission is to combine authentic geospatial cartography with fast, responsive
                  military command gameplay that feels immersive, accurate, and visually stunning.
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                  <span>Contact: command@basewarfare.sim</span>
                  <span>•</span>
                  <span>Headquarters: Sovereign Space Net</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= CREDITS SECTION ================= */}
          {activeSection === 'credits' && (
            <div id="section-credits" className="max-w-3xl mx-auto flex flex-col gap-5">
              <h2 className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Credits & Acknowledgments</span>
              </h2>

              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs font-mono text-zinc-300 flex flex-col gap-3">
                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Satellite Imagery</span>
                  <span className="text-zinc-100">Esri World Imagery & ArcGIS Services</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Map Rendering Core</span>
                  <span className="text-zinc-100">Leaflet Open-Source Library</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Flag Telemetry Data</span>
                  <span className="text-zinc-100">FlagCDN Sovereign Flags API</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Tactical Iconography</span>
                  <span className="text-zinc-100">Lucide Icons</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-400">Architecture & Engineering</span>
                  <span className="text-zinc-100">Base Warfare Core Intelligence Unit</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= PRIVACY POLICY SECTION ================= */}
          {activeSection === 'privacy-policy' && (
            <div id="section-privacy-policy" className="max-w-3xl mx-auto flex flex-col gap-5">
              <h2 className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <span>Privacy Policy</span>
              </h2>

              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed flex flex-col gap-3">
                <p>
                  <strong>1. Zero Data Harvesting:</strong> Base Warfare stores all session state,
                  treasury figures, and active nation designations strictly inside your local browser
                  storage. No personal data is transmitted or sold to third parties.
                </p>
                <p>
                  <strong>2. Satellite Tile Caching:</strong> Map tiles fetched from Esri servers are
                  cached within standard browser HTTP caches to preserve bandwidth and optimize rendering.
                </p>
                <p>
                  <strong>3. Sovereign Coordinates:</strong> Coordinate selections remain local to your
                  client session and can be cleared at any time.
                </p>
                <div className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
                  Last Updated: September 2026 • Security Classification: UNCLASSIFIED / PUBLIC
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
