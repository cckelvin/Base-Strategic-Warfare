import React, { useState } from 'react';
import {
  X,
  Shield,
  Plane,
  Ship,
  Rocket,
  Package,
  Radio,
  Flame,
  Crosshair,
  Search,
  MapPin,
  Swords,
  ArrowUpRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Database,
  Plus,
  Hammer,
} from 'lucide-react';
import { getAllMilitaryBases, saveConstructedBase, MilitaryBase } from './militaryBases';
import { CountryFlag } from './countries';
import { AiCountryAgent } from './aiLearningSystem';
import { BattleSimulatorView } from './BattleSimulatorView';
import { AirtableArsenalView } from './AirtableArsenalView';
import { AIRTABLE_TABLES } from './militaryAirtableDatabase';
import { STRATEGIC_CITIES } from './citiesData';

export type MilitaryTab =
  | 'base'
  | 'army'
  | 'navy'
  | 'equipment'
  | 'electronic'
  | 'launchers'
  | 'warfare';

interface MilitaryModalProps {
  userCountry: CountryFlag;
  money: number;
  aiAgents: Record<string, AiCountryAgent>;
  occupiedCityIds?: string[];
  occupiedBaseIds?: string[];
  onToggleOccupyBase?: (baseId: string) => void;
  onDeductMoney: (amount: number) => void;
  onAddNotification: (title: string, message: string) => void;
  onClose: () => void;
  onFlyToBase: (lat: number, lng: number, zoom?: number) => void;
  onOpenBase?: (base: MilitaryBase) => void;
}

export const MilitaryModal: React.FC<MilitaryModalProps> = ({
  userCountry,
  money,
  occupiedCityIds = [],
  occupiedBaseIds = [],
  onToggleOccupyBase,
  onDeductMoney,
  onAddNotification,
  onClose,
  onFlyToBase,
  onOpenBase,
}) => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<MilitaryTab>('base');

  // Search & filter in Bases
  const [baseSearch, setBaseSearch] = useState('');
  const [baseFilter, setBaseFilter] = useState<'all' | 'sovereign' | 'occupied'>('all');

  // Seize new base expedition modal
  // Fortified bases state
  const [fortifiedBases, setFortifiedBases] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('base_warfare_fortified_bases');
    return saved ? JSON.parse(saved) : {};
  });

  // Base state with construction support
  const [allBases, setAllBases] = useState<MilitaryBase[]>(() => getAllMilitaryBases());

  // Base construction modal state
  const [isConstructModalOpen, setIsConstructModalOpen] = useState(false);
  const [newBaseName, setNewBaseName] = useState('');
  const [newBaseCodeName, setNewBaseCodeName] = useState('');
  const [newBaseSector, setNewBaseSector] = useState<'north' | 'south' | 'east' | 'west' | 'coastal'>('north');
  const [newBaseType, setNewBaseType] = useState<'air' | 'naval' | 'ground' | 'air-defense'>('air');

  // Calculate occupied country codes from occupied cities
  const occupiedCountryCodes = new Set(
    STRATEGIC_CITIES.filter((c) => occupiedCityIds.includes(c.id)).map((c) =>
      c.countryCode.toUpperCase()
    )
  );

  // BASE RESTRICTION REQUIREMENT:
  // Player should not have control of any other country assets (base, military, anything).
  // Only displays military installations belonging to the player's country (capital + constructed bases).
  const viewableBases = allBases.filter((b) => {
    return (
      b.countryCode.toUpperCase() === userCountry.code.toUpperCase() ||
      b.countryName.toLowerCase() === userCountry.name.toLowerCase()
    );
  });

  // Search filter on sovereign bases
  const filteredBases = viewableBases.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(baseSearch.toLowerCase()) ||
      b.codeName.toLowerCase().includes(baseSearch.toLowerCase()) ||
      b.countryName.toLowerCase().includes(baseSearch.toLowerCase());
    return matchesSearch;
  });

  // Construct Base in Domestic Territory Action

  const handleConstructBase = () => {
    const cost = 25000000;
    if (money < cost) {
      alert('Insufficient funds. Constructing a regional military bastion requires $25,000,000.');
      return;
    }

    const defaultName = newBaseName.trim() || `${userCountry.name} Regional Redoubt`;
    const defaultCode = newBaseCodeName.trim().toUpperCase() || `${newBaseSector.toUpperCase()} AEGIS`;

    // Calculate realistic offset coordinates from homeland
    const sovereignBase = allBases.find(
      (b) => b.countryCode.toUpperCase() === userCountry.code.toUpperCase() && b.isCapital
    );
    const centerLat = sovereignBase ? sovereignBase.lat : 30.0;
    const centerLng = sovereignBase ? sovereignBase.lng : 10.0;

    let offsetLat = 0;
    let offsetLng = 0;
    switch (newBaseSector) {
      case 'north':
        offsetLat = 1.8;
        offsetLng = 0.5;
        break;
      case 'south':
        offsetLat = -1.8;
        offsetLng = -0.5;
        break;
      case 'east':
        offsetLat = 0.4;
        offsetLng = 2.2;
        break;
      case 'west':
        offsetLat = -0.4;
        offsetLng = -2.2;
        break;
      case 'coastal':
        offsetLat = 1.2;
        offsetLng = 1.5;
        break;
    }

    const newLat = Number((centerLat + offsetLat).toFixed(4));
    const newLng = Number((centerLng + offsetLng).toFixed(4));

    const newBase: MilitaryBase = {
      id: `base-${userCountry.code.toLowerCase()}-custom-${Date.now()}`,
      name: defaultName,
      codeName: defaultCode,
      countryName: userCountry.name,
      countryCode: userCountry.code,
      flagUrl: `https://flagcdn.com/w80/${userCountry.code.toLowerCase()}.png`,
      lat: newLat,
      lng: newLng,
      dms: `${Math.abs(newLat).toFixed(2)}°${newLat >= 0 ? 'N' : 'S'} ${Math.abs(newLng).toFixed(2)}°${newLng >= 0 ? 'E' : 'W'}`,
      status: 'Fortified',
      isCapital: false,
      reports: [
        {
          id: `rep-${Date.now()}-1`,
          timeAgo: 'Just now',
          type: 'defense',
          text: `Construction of ${defaultName} completed in homeland territory. Perimeter sensors active.`,
        },
      ],
      units: [
        { id: `u-${Date.now()}-1`, name: 'Tactical Rapid Deployment Corps', count: 1800, type: 'infantry', code: 'DOMESTIC-VANGUARD' },
        { id: `u-${Date.now()}-2`, name: 'Air Defense Interceptors', count: 36, type: 'aircraft', code: 'AIR-CORPS' },
        { id: `u-${Date.now()}-3`, name: 'Armored Patrol Tanks', count: 48, type: 'armor', code: 'ARMOR-LINE' },
        { id: `u-${Date.now()}-4`, name: 'Surface-to-Air Missile Shield', count: 12, type: 'air-defense', code: 'AEGIS-ARRAY' },
      ],
    };

    saveConstructedBase(newBase);
    onDeductMoney(cost);
    setAllBases((prev) => [...prev, newBase]);
    setIsConstructModalOpen(false);
    setNewBaseName('');
    setNewBaseCodeName('');

    onAddNotification(
      'Military Installation Established',
      `${defaultName} established in sovereign territory. Ready for tactical stationing.`
    );
  };

  // Fortify Base Action
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
      'Bastion Reinforced',
      `${base.name} upgraded to MAX FORTIFICATION status. Anti-air and perimeter shielding hardened.`
    );
  };

  // Navigation items: Bases + Army (Air, Ground, Missile) + Navy + Equipment + Electronic + Launchers + Warfare
  const NAV_ITEMS: { id: MilitaryTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'base', label: 'Bases (Homeland Defense)', icon: Shield },
    { id: 'army', label: 'Army', icon: Swords },
    { id: 'navy', label: 'Navy', icon: Ship },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'electronic', label: 'Electronic Systems', icon: Radio },
    { id: 'launchers', label: 'Launchers', icon: Flame },
    { id: 'warfare', label: 'Warfare (Rules & Sim)', icon: Crosshair },
  ];

  return (
    <div
      id="military-full-modal"
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/98 backdrop-blur-2xl text-zinc-100 font-sans select-none overflow-hidden animate-in fade-in duration-200"
    >
      {/* ================= REQUIREMENT 1: ONLY THE NAV BAR REMAINS AT THE TOP BAR ================= */}
      <header
        id="military-top-notch-header"
        className="relative flex items-center justify-between px-3 sm:px-6 py-2.5 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800 shadow-xl shrink-0 gap-3"
      >
        {/* Centered Navigation Bar */}
        <div className="flex-1 flex justify-center overflow-x-auto scrollbar-none py-0.5">
          <nav
            id="military-nav-notch"
            aria-label="Military Command Navigation"
            className="flex items-center gap-1 sm:gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-lg shrink-0 overflow-x-auto"
          >
            {NAV_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`mil-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md border border-red-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clean Dismiss Button */}
        <button
          id="close-military-modal-btn"
          onClick={onClose}
          aria-label="Close Military Command"
          title="Close Military Command (Esc)"
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-500 text-zinc-300 hover:text-white transition-all cursor-pointer shadow shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </header>

      {/* ================= MAIN CONTENT VIEW ================= */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-zinc-950/80">
        {/* TAB 1: BASES (Strictly: Only your country or occupied/seized territory) */}
        {activeTab === 'base' && (
          <div id="mil-tab-base-content" className="max-w-7xl mx-auto space-y-4">
            {/* Header controls & filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={baseSearch}
                    onChange={(e) => setBaseSearch(e.target.value)}
                    placeholder="Filter homeland or seized base..."
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  <span className="text-emerald-400 font-bold">{filteredBases.length}</span> / {viewableBases.length} BASES UNDER COMMAND
                </div>
              </div>

              {/* Action: Build Domestic Regional Base */}
              <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                <button
                  onClick={() => setIsConstructModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>+ Build Homeland Base</span>
                </button>
              </div>
            </div>

            {/* Bases Grid */}
            {filteredBases.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-2">
                <Shield className="w-8 h-8 text-zinc-600 mx-auto" />
                <h4 className="font-mono text-sm font-bold text-zinc-300">No matching bases in sovereign or seized territory</h4>
                <p className="text-xs text-zinc-500 font-sans">
                  Only military installations belonging to your nation ({userCountry.name}) or annexed expeditionary territory are displayed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredBases.map((base) => {
                  const isFortified = fortifiedBases[base.id] || base.status === 'Fortified';
                  const isSovereign =
                    base.countryCode.toUpperCase() === userCountry.code.toUpperCase() ||
                    base.countryName.toLowerCase() === userCountry.name.toLowerCase();

                  return (
                    <div
                      key={base.id}
                      className={`relative flex flex-col p-4 rounded-xl border backdrop-blur-md transition-all duration-150 ${
                        isSovereign
                          ? 'bg-zinc-900/90 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                          : 'bg-red-950/20 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      }`}
                    >
                      {/* Top Row: Name, Flag, Territory Badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={base.flagUrl}
                            alt=""
                            className="w-5 h-3.5 rounded object-cover shadow border border-zinc-700"
                          />
                          <div>
                            <h4 className="font-mono text-xs font-bold text-zinc-100 truncate max-w-[180px]">
                              {base.name}
                            </h4>
                            <div className="text-[10px] font-mono text-zinc-400">
                              {base.countryName} • {base.codeName}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {isSovereign ? (
                            <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 uppercase">
                              <Shield className="w-2.5 h-2.5" />
                              SOVEREIGN
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/50 uppercase">
                              <Swords className="w-2.5 h-2.5" />
                              SEIZED
                            </span>
                          )}

                          {base.isCapital ? (
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase">
                              ★ CAPITAL HQ
                            </span>
                          ) : isSovereign ? (
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase">
                              EXPANSION REDOUBT
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Coordinates */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-3 bg-zinc-950/80 p-2 rounded border border-zinc-800/80">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                          {base.dms}
                        </span>
                        <span
                          className={`font-bold uppercase ${
                            isFortified
                              ? 'text-cyan-400'
                              : base.status === 'Alert'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {isFortified ? 'MAX FORTIFIED' : base.status}
                        </span>
                      </div>

                      {/* Stationed units */}
                      <div className="flex-1 space-y-1.5 mb-3">
                        <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                          Stationed Combat Contingent:
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {base.units.slice(0, 4).map((u) => (
                            <div
                              key={u.id}
                              className="p-1.5 bg-zinc-950/60 rounded border border-zinc-800 text-[10px] font-mono flex items-center justify-between"
                            >
                              <span className="text-zinc-300 truncate">{u.name}</span>
                              <span className="text-white font-bold ml-1">{u.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 mt-auto">
                        <div className="flex items-center gap-1.5">
                          {onOpenBase && (
                            <button
                              onClick={() => {
                                onOpenBase(base);
                                onClose();
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono rounded cursor-pointer transition-colors shadow-sm"
                              title="Enter Base Command (Battle, Update, Control, Military)"
                            >
                              <Swords className="w-3.5 h-3.5" />
                              <span>Command</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onFlyToBase(base.lat, base.lng, 8);
                              onClose();
                            }}
                            className="flex items-center gap-1 px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded cursor-pointer transition-colors"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Map</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!isSovereign && onToggleOccupyBase && (
                            <button
                              onClick={() => onToggleOccupyBase(base.id)}
                              className="px-2 py-1.5 bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-300 border border-zinc-700 text-xs font-mono rounded cursor-pointer"
                              title="Relinquish base occupation"
                            >
                              Withdraw
                            </button>
                          )}

                          <button
                            onClick={() => handleFortifyBase(base)}
                            disabled={isFortified}
                            className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded cursor-pointer ${
                              isFortified
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 cursor-default'
                                : 'bg-red-600 hover:bg-red-500 text-white'
                            }`}
                          >
                            {isFortified ? 'Fortified' : 'Fortify ($15M)'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: ARMY (Consolidated Military Weapons: Air, Ground, Missile) */}
        {activeTab === 'army' && (
          <AirtableArsenalView
            initialTableKey="ARMY"
            money={money}
            userBases={viewableBases}
            onDeductMoney={onDeductMoney}
            onAddNotification={onAddNotification}
            onBasesUpdated={(updated) => setAllBases(updated)}
          />
        )}

        {/* TAB: NAVY */}
        {activeTab === 'navy' && (
          <AirtableArsenalView
            initialTableKey="NAVY"
            money={money}
            userBases={viewableBases}
            onDeductMoney={onDeductMoney}
            onAddNotification={onAddNotification}
            onBasesUpdated={(updated) => setAllBases(updated)}
          />
        )}

        {/* TAB: EQUIPMENT */}
        {activeTab === 'equipment' && (
          <AirtableArsenalView
            initialTableKey="EQUIPMENT"
            money={money}
            userBases={viewableBases}
            onDeductMoney={onDeductMoney}
            onAddNotification={onAddNotification}
            onBasesUpdated={(updated) => setAllBases(updated)}
          />
        )}

        {/* TAB: ELECTRONIC SYSTEMS */}
        {activeTab === 'electronic' && (
          <AirtableArsenalView
            initialTableKey="ELECTRONIC_SYSTEMS"
            money={money}
            userBases={viewableBases}
            onDeductMoney={onDeductMoney}
            onAddNotification={onAddNotification}
            onBasesUpdated={(updated) => setAllBases(updated)}
          />
        )}

        {/* TAB: LAUNCHERS */}
        {activeTab === 'launchers' && (
          <AirtableArsenalView
            initialTableKey="LAUNCHERS"
            money={money}
            userBases={viewableBases}
            onDeductMoney={onDeductMoney}
            onAddNotification={onAddNotification}
            onBasesUpdated={(updated) => setAllBases(updated)}
          />
        )}

        {/* TAB: WARFARE (Air combat simulator applying the 10-field pipeline to Airtable units) */}
        {activeTab === 'warfare' && <BattleSimulatorView />}
      </main>

      {/* Construct Domestic Base Dialog */}
      {isConstructModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Hammer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white uppercase">Construct Regional Military Bastion</h3>
              </div>
              <button
                onClick={() => setIsConstructModalOpen(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
              <div className="text-zinc-400">Homeland Sovereign Territory:</div>
              <div className="font-bold text-emerald-400 flex items-center gap-2">
                <img src={`https://flagcdn.com/w80/${userCountry.code.toLowerCase()}.png`} alt="" className="w-5 h-3.5 rounded object-cover" />
                <span>{userCountry.name}</span>
                <span className="text-zinc-500 text-[10px]">({userCountry.code})</span>
              </div>
              <div className="text-[11px] text-zinc-500">
                Rule: Countries have 1 base in their capital city, and can build additional bases across other regions of their sovereign territory.
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Base Name / Designation</label>
                <input
                  type="text"
                  value={newBaseName}
                  onChange={(e) => setNewBaseName(e.target.value)}
                  placeholder={`e.g. ${userCountry.name} Coastal Redoubt`}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Tactical Codename</label>
                <input
                  type="text"
                  value={newBaseCodeName}
                  onChange={(e) => setNewBaseCodeName(e.target.value)}
                  placeholder="e.g. NORTHERN AEGIS"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs outline-none focus:border-emerald-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Domestic Region / Sector</label>
                  <select
                    value={newBaseSector}
                    onChange={(e: any) => setNewBaseSector(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="north">Northern Sector Corridor</option>
                    <option value="south">Southern Frontier Redoubt</option>
                    <option value="east">Eastern Mountain Bastion</option>
                    <option value="west">Western Defense Zone</option>
                    <option value="coastal">Coastal / Maritime Harbor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Branch Specialization</label>
                  <select
                    value={newBaseType}
                    onChange={(e: any) => setNewBaseType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="air">Aerospace & Interceptor Wing</option>
                    <option value="naval">Naval Task Fleet</option>
                    <option value="ground">Armored Mechanized Division</option>
                    <option value="air-defense">Integrated Missile Shield Net</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-400">Engineering & Deployment Cost:</div>
                  <div className="text-sm font-bold text-emerald-400">$25,000,000</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-zinc-400">Available Treasury:</div>
                  <div className={`text-sm font-bold ${money >= 25000000 ? 'text-zinc-200' : 'text-red-400'}`}>
                    ${money.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setIsConstructModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConstructBase}
                disabled={money < 25000000}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Authorize Construction</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
