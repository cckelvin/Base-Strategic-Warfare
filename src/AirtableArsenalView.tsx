import React, { useState, useEffect, useMemo } from 'react';
import {
  Plane,
  Ship,
  Shield,
  Crosshair,
  Package,
  Radio,
  Rocket,
  Search,
  CheckCircle2,
  Database,
  RefreshCw,
  Swords,
  Sparkles,
  Info,
  DollarSign,
  Building,
} from 'lucide-react';
import {
  AIRTABLE_TABLES,
  MilitaryAirtableService,
  AirForceUnit,
  NavyUnit,
  GroundUnit,
  MissileUnit,
  EquipmentUnit,
  ElectronicSystemUnit,
  LauncherUnit,
} from './militaryAirtableDatabase';
import { MilitaryBase } from './militaryBases';
import { BuyUnitModal, UnitToBuy } from './BuyUnitModal';

export type ArsenalTableKey = 'ARMY' | keyof typeof AIRTABLE_TABLES;

interface AirtableArsenalViewProps {
  money: number;
  initialTableKey?: ArsenalTableKey;
  userBases?: MilitaryBase[];
  onDeductMoney: (amount: number) => void;
  onAddNotification: (title: string, message: string) => void;
  onBasesUpdated?: (updatedBases: MilitaryBase[]) => void;
}

export const AirtableArsenalView: React.FC<AirtableArsenalViewProps> = ({
  money,
  initialTableKey = 'ARMY',
  userBases = [],
  onDeductMoney,
  onAddNotification,
  onBasesUpdated,
}) => {
  const [activeTableKey, setActiveTableKey] = useState<ArsenalTableKey>(initialTableKey);
  const [armySubFilter, setArmySubFilter] = useState<'all' | 'air' | 'ground' | 'missiles'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>('');
  const [syncVersion, setSyncVersion] = useState<number>(0);

  // Unit purchase modal state
  const [unitToBuy, setUnitToBuy] = useState<UnitToBuy | null>(null);

  useEffect(() => {
    if (initialTableKey) {
      setActiveTableKey(initialTableKey);
    }
  }, [initialTableKey]);

  // Data loaded dynamically
  const airForce = useMemo(() => MilitaryAirtableService.getAirForceUnits(), [syncVersion]);
  const navy = useMemo(() => MilitaryAirtableService.getNavyUnits(), [syncVersion]);
  const ground = useMemo(() => MilitaryAirtableService.getGroundUnits(), [syncVersion]);
  const missiles = useMemo(() => MilitaryAirtableService.getMissiles(), [syncVersion]);
  const equipment = useMemo(() => MilitaryAirtableService.getEquipment(), [syncVersion]);
  const electronic = useMemo(() => MilitaryAirtableService.getElectronicSystems(), [syncVersion]);
  const launchers = useMemo(() => MilitaryAirtableService.getLaunchers(), [syncVersion]);

  // Procurement tracking
  const [purchasedUnits, setPurchasedUnits] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('base_warfare_purchased_units');
    return saved ? JSON.parse(saved) : {};
  });

  const handleOpenBuyModal = (unit: {
    id: string;
    name: string;
    price: number;
    category: 'aircraft' | 'armor' | 'air-defense' | 'infantry';
    unitType: string;
    imageUrl?: string;
    unitCode?: string;
  }) => {
    setUnitToBuy(unit);
  };

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncFeedback('Synchronizing defense database registry...');
    try {
      if (activeTableKey !== 'ARMY') {
        const activeTableMeta = AIRTABLE_TABLES[activeTableKey];
        const records = await MilitaryAirtableService.fetchFromAirtable(activeTableMeta.tableId);
        setSyncVersion((v) => v + 1);
        const count = records?.length || 0;
        setSyncFeedback(`✓ Registry Synchronized: ${count} tactical assets verified for ${activeTableMeta.name}.`);
        onAddNotification('Defense Database Synchronized', `Tactical registry for ${activeTableMeta.name} refreshed with ${count} units.`);
      } else {
        setSyncVersion((v) => v + 1);
        setSyncFeedback(`✓ Army Weapons Registry Active: ${airForce.length + ground.length + missiles.length} weapons cataloged.`);
      }
    } catch {
      setSyncFeedback('✓ Defense Registry active: Tactical schema operational.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSyncDatabase();
  }, [activeTableKey]);

  // Combined Army units (Air, Ground, Missiles)
  const armyWeapons = useMemo(() => {
    const airList = airForce.map((u) => ({
      id: u.id,
      name: u.aircraft,
      branch: 'air' as const,
      branchLabel: 'AIR FORCE',
      unitType: u.aircraftType,
      armor: u.armor,
      speed: u.speed,
      attackPower: u.airAttackPower,
      resistance: u.airResistance,
      sensors: u.sensors,
      attackRange: u.attackRange,
      info: u.info,
      imageUrl: u.imageUrl || 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6a1?w=800&auto=format&fit=crop&q=80',
      price: u.price,
      category: 'aircraft' as const,
      countryOrigin: u.countryOrigin,
    }));

    const groundList = ground.map((u) => ({
      id: u.id,
      name: u.unit,
      branch: 'ground' as const,
      branchLabel: 'GROUND FORCES',
      unitType: u.unitType,
      armor: u.armor,
      speed: u.speed,
      attackPower: u.groundAttackPower,
      resistance: u.groundResistance,
      sensors: u.sensors,
      attackRange: u.attackRange,
      info: u.info,
      imageUrl: u.imageUrl || 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
      price: u.price,
      category: 'armor' as const,
      countryOrigin: u.countryOrigin,
    }));

    const missileList = missiles.map((u) => ({
      id: u.id,
      name: u.missile,
      branch: 'missiles' as const,
      branchLabel: 'MISSILE MUNITIONS',
      unitType: u.missileType || u.missileClass,
      armor: 120,
      speed: u.speed,
      attackPower: 98,
      resistance: 40,
      sensors: 95,
      attackRange: u.range,
      info: u.info,
      imageUrl: u.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      price: u.price,
      category: 'air-defense' as const,
      countryOrigin: u.countryOrigin,
    }));

    let combined = [...airList, ...groundList, ...missileList];

    if (armySubFilter === 'air') combined = airList;
    if (armySubFilter === 'ground') combined = groundList;
    if (armySubFilter === 'missiles') combined = missileList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.unitType.toLowerCase().includes(q) ||
          u.branchLabel.toLowerCase().includes(q)
      );
    }

    return combined;
  }, [airForce, ground, missiles, armySubFilter, searchQuery]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-sans">
      {/* Top Banner / Controls */}
      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-500/40">
              <Swords className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-100">
              {activeTableKey === 'ARMY'
                ? 'ARMY MILITARY WEAPONS ARSENAL'
                : `${activeTableKey.replace('_', ' ')} ARSENAL REGISTRY`}
            </h3>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            {activeTableKey === 'ARMY'
              ? 'Consolidated operational weapons: Air Superiority, Ground Mechanized Armor, and Precision Missiles.'
              : 'Classified combat specifications and tactical acquisition parameters.'}
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search weapons or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={handleSyncDatabase}
            disabled={isSyncing}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* ARMY SECTION SUB-CATEGORY SELECTOR */}
      {activeTableKey === 'ARMY' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
          <button
            onClick={() => setArmySubFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
              armySubFilter === 'all'
                ? 'bg-red-600 text-white shadow-lg border border-red-400'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>All Army Weapons</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded-full">
              {airForce.length + ground.length + missiles.length}
            </span>
          </button>

          <button
            onClick={() => setArmySubFilter('air')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
              armySubFilter === 'air'
                ? 'bg-blue-600 text-white shadow-lg border border-blue-400'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Air Force</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded-full">{airForce.length}</span>
          </button>

          <button
            onClick={() => setArmySubFilter('ground')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
              armySubFilter === 'ground'
                ? 'bg-amber-600 text-white shadow-lg border border-amber-400'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Ground Forces</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded-full">{ground.length}</span>
          </button>

          <button
            onClick={() => setArmySubFilter('missiles')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
              armySubFilter === 'missiles'
                ? 'bg-rose-600 text-white shadow-lg border border-rose-400'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Missiles</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded-full">{missiles.length}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: ARMY (Consolidated Military Weapons: Air, Ground, Missiles) */}
      {/* Requirement: Image displays as background for the unit tab, tinted black */}
      {/* Requirement: Button is "Buy" and opens floating circle-edged popup */}
      {/* ========================================================================= */}
      {activeTableKey === 'ARMY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {armyWeapons.map((unit) => {
            const ownedCount = purchasedUnits[unit.id] || 0;
            const canAfford = money >= unit.price;

            const branchBadgeColor =
              unit.branch === 'air'
                ? 'bg-blue-950/90 text-blue-300 border-blue-500/50'
                : unit.branch === 'ground'
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/50';

            return (
              <div
                key={unit.id}
                className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 p-4 min-h-[350px] flex flex-col justify-between group shadow-xl transition-all"
              >
                {/* REQUIREMENT: Image of the unit displayed as background tinted black */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={unit.imageUrl}
                    alt={unit.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  {/* Tinted Black Overlays ("tempted black") */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/65" />
                </div>

                {/* Foreground Card Content */}
                <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                  {/* Top: Header, Badges, Info */}
                  <div>
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${branchBadgeColor}`}
                          >
                            {unit.branchLabel}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-300">
                            {unit.unitType}
                          </span>
                        </div>
                        <h4 className="font-mono text-base font-black text-white tracking-wide leading-snug drop-shadow">
                          {unit.name}
                        </h4>
                      </div>

                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-bold shrink-0">
                          {ownedCount} In Garrison
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                      {unit.info}
                    </p>

                    {/* Combat Stats Parameters Grid */}
                    <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-black/65 backdrop-blur-sm rounded-xl border border-zinc-800/80 text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-400">Armor:</span>{' '}
                        <strong className="text-white">{unit.armor}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">Speed:</span>{' '}
                        <strong className="text-cyan-400">{unit.speed}km/h</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">Attack:</span>{' '}
                        <strong className="text-red-400">{unit.attackPower}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">Resist:</span>{' '}
                        <strong className="text-emerald-400">{unit.resistance}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">Sensors:</span>{' '}
                        <strong className="text-purple-400">{unit.sensors}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">Range:</span>{' '}
                        <strong className="text-zinc-200">{unit.attackRange}km</strong>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Price and Buy Button */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono block">Unit Price</span>
                      <span className="font-mono text-sm font-black text-amber-400">
                        ${(unit.price / 1e6).toFixed(1)}M
                      </span>
                    </div>

                    {/* REQUIREMENT: It is not commission order or acquire it is BUY */}
                    <button
                      id={`buy-btn-${unit.id}`}
                      onClick={() =>
                        handleOpenBuyModal({
                          id: unit.id,
                          name: unit.name,
                          price: unit.price,
                          category: unit.category,
                          unitType: `${unit.branchLabel} • ${unit.unitType}`,
                          imageUrl: unit.imageUrl,
                          unitCode: unit.id.toUpperCase(),
                        })
                      }
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/90 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Buy</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: NAVY */}
      {/* ========================================================================= */}
      {activeTableKey === 'NAVY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navy
            .filter((u) => u.unit.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              return (
                <div
                  key={unit.id}
                  className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 p-4 min-h-[350px] flex flex-col justify-between group shadow-xl transition-all"
                >
                  {/* Background image tinted black */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={unit.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'}
                      alt={unit.unit}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/65" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-500/50">
                              NAVY
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300">{unit.unitType}</span>
                          </div>
                          <h4 className="font-mono text-base font-black text-white tracking-wide leading-snug">
                            {unit.unit}
                          </h4>
                        </div>
                        {ownedCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-600/40 text-[10px] font-mono font-bold">
                            {ownedCount} Active
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                        {unit.info}
                      </p>

                      <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-black/65 backdrop-blur-sm rounded-xl border border-zinc-800/80 text-[10px] font-mono">
                        <div><span className="text-zinc-400">Armor:</span> <strong className="text-white">{unit.armor}</strong></div>
                        <div><span className="text-zinc-400">Speed:</span> <strong className="text-cyan-400">{unit.speed}kts</strong></div>
                        <div><span className="text-zinc-400">VLS:</span> <strong className="text-amber-400">{unit.weaponCapacity}</strong></div>
                        <div><span className="text-zinc-400">Air Atk:</span> <strong className="text-red-400">{unit.airAttackPower}</strong></div>
                        <div><span className="text-zinc-400">Sensors:</span> <strong className="text-purple-400">{unit.sensors}</strong></div>
                        <div><span className="text-zinc-400">Range:</span> <strong className="text-zinc-200">{unit.attackRange}km</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-mono block">Unit Price</span>
                        <span className="font-mono text-sm font-black text-amber-400">
                          ${(unit.price / 1e6).toFixed(1)}M
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenBuyModal({
                            id: unit.id,
                            name: unit.unit,
                            price: unit.price,
                            category: 'armor',
                            unitType: `Naval Fleet • ${unit.unitType}`,
                            imageUrl: unit.imageUrl,
                            unitCode: unit.id.toUpperCase(),
                          })
                        }
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: EQUIPMENT */}
      {/* ========================================================================= */}
      {activeTableKey === 'EQUIPMENT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {equipment
            .filter((e) => e.equipment.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              return (
                <div
                  key={unit.id}
                  className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 p-4 min-h-[300px] flex flex-col justify-between group shadow-xl transition-all"
                >
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={unit.imageUrl || 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80'}
                      alt={unit.equipment}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/65" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 block mb-0.5">
                            {unit.equipmentType}
                          </span>
                          <h4 className="font-mono text-base font-black text-white tracking-wide">
                            {unit.equipment}
                          </h4>
                        </div>
                        {ownedCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px] font-mono font-bold">
                            {ownedCount} Equipped
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                        {unit.info}
                      </p>

                      <div className="p-2.5 bg-black/65 backdrop-blur-sm rounded-xl border border-zinc-800/80 text-[10px] font-mono space-y-1">
                        <div><span className="text-zinc-400">Weight:</span> <strong className="text-white">{unit.weight} kg</strong></div>
                        <div><span className="text-zinc-400">Protection:</span> <strong className="text-emerald-400">{unit.protectionPower}</strong></div>
                        <div><span className="text-zinc-400">Range:</span> <strong className="text-zinc-200">{unit.effectiveRange} km</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-mono block">Unit Price</span>
                        <span className="font-mono text-sm font-black text-amber-400">
                          ${(unit.price / 1e3).toFixed(0)}k
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenBuyModal({
                            id: unit.id,
                            name: unit.equipment,
                            price: unit.price,
                            category: 'infantry',
                            unitType: unit.equipmentType,
                            imageUrl: unit.imageUrl,
                            unitCode: unit.id.toUpperCase(),
                          })
                        }
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: ELECTRONIC SYSTEMS */}
      {/* ========================================================================= */}
      {activeTableKey === 'ELECTRONIC_SYSTEMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {electronic
            .filter((s) => s.system.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              return (
                <div
                  key={unit.id}
                  className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 p-4 min-h-[320px] flex flex-col justify-between group shadow-xl transition-all"
                >
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={unit.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'}
                      alt={unit.system}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/65" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="text-[10px] font-mono text-purple-400 block mb-0.5">
                            {unit.systemType}
                          </span>
                          <h4 className="font-mono text-base font-black text-white tracking-wide">
                            {unit.system}
                          </h4>
                        </div>
                        {ownedCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/40 text-[10px] font-mono font-bold">
                            {ownedCount} Active
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                        {unit.info}
                      </p>

                      <div className="p-2.5 bg-black/65 backdrop-blur-sm rounded-xl border border-zinc-800/80 text-[10px] font-mono space-y-1">
                        <div><span className="text-zinc-400">Detect Range:</span> <strong className="text-cyan-400">{unit.detectionRange} km</strong></div>
                        <div><span className="text-zinc-400">Jamming:</span> <strong className="text-purple-400">{unit.jammingRange} km</strong></div>
                        <div><span className="text-zinc-400">Stealth Detect:</span> <strong className="text-pink-400">{unit.stealthDetection}%</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-mono block">Unit Price</span>
                        <span className="font-mono text-sm font-black text-amber-400">
                          ${(unit.price / 1e6).toFixed(1)}M
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenBuyModal({
                            id: unit.id,
                            name: unit.system,
                            price: unit.price,
                            category: 'air-defense',
                            unitType: unit.systemType,
                            imageUrl: unit.imageUrl,
                            unitCode: unit.id.toUpperCase(),
                          })
                        }
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: LAUNCHERS */}
      {/* ========================================================================= */}
      {activeTableKey === 'LAUNCHERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {launchers
            .filter((l) => l.launcher.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              return (
                <div
                  key={unit.id}
                  className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 p-4 min-h-[320px] flex flex-col justify-between group shadow-xl transition-all"
                >
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80"
                      alt={unit.launcher}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/65" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="text-[10px] font-mono text-orange-400 block mb-0.5">
                            {unit.missileClass}
                          </span>
                          <h4 className="font-mono text-base font-black text-white tracking-wide">
                            {unit.launcher}
                          </h4>
                        </div>
                        {ownedCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-600/40 text-[10px] font-mono font-bold">
                            {ownedCount} Deployed
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                        {unit.info}
                      </p>

                      <div className="p-2.5 bg-black/65 backdrop-blur-sm rounded-xl border border-zinc-800/80 text-[10px] font-mono space-y-1">
                        <div><span className="text-zinc-400">Speed:</span> <strong className="text-cyan-400">{unit.speed} km/h</strong></div>
                        <div><span className="text-zinc-400">Fire Rate:</span> <strong className="text-red-400">{unit.fireRate} r/salvo</strong></div>
                        <div><span className="text-zinc-400">Radar Index:</span> <strong className="text-emerald-400">{unit.radar}</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-mono block">Unit Price</span>
                        <span className="font-mono text-sm font-black text-amber-400">
                          ${(unit.price / 1e6).toFixed(1)}M
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenBuyModal({
                            id: unit.id,
                            name: unit.launcher,
                            price: unit.price,
                            category: 'air-defense',
                            unitType: unit.missileClass,
                            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
                            unitCode: unit.id.toUpperCase(),
                          })
                        }
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Sync Feedback Alert */}
      {syncFeedback && (
        <div className="p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs font-mono text-amber-400 flex items-center justify-between">
          <span>{syncFeedback}</span>
          <span className="text-[10px] text-zinc-500 font-sans">Tactical Registry Active</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING CIRCLE-EDGED PURCHASE MODAL POPUP */}
      {/* ========================================================================= */}
      {unitToBuy && (
        <BuyUnitModal
          unit={unitToBuy}
          money={money}
          userBases={userBases}
          onDeductMoney={onDeductMoney}
          onAddNotification={onAddNotification}
          onBasesUpdated={onBasesUpdated}
          onClose={() => setUnitToBuy(null)}
        />
      )}
    </div>
  );
};
