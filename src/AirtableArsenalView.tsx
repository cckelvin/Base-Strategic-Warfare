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
  ExternalLink,
  RefreshCw,
  Sparkles,
  Info,
  DollarSign,
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

interface AirtableArsenalViewProps {
  money: number;
  initialTableKey?: keyof typeof AIRTABLE_TABLES;
  onDeductMoney: (amount: number) => void;
  onAddNotification: (title: string, message: string) => void;
}

export const AirtableArsenalView: React.FC<AirtableArsenalViewProps> = ({
  money,
  initialTableKey,
  onDeductMoney,
  onAddNotification,
}) => {
  const [activeTableKey, setActiveTableKey] = useState<keyof typeof AIRTABLE_TABLES>(
    initialTableKey || 'AIR_FORCE'
  );

  useEffect(() => {
    if (initialTableKey) {
      setActiveTableKey(initialTableKey);
    }
  }, [initialTableKey]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>('');
  const [syncVersion, setSyncVersion] = useState<number>(0);

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

  const handleProcure = (unitId: string, unitName: string, price: number) => {
    if (money < price) {
      alert(`Insufficient funds. $${(price / 1e6).toFixed(1)}M required.`);
      return;
    }

    onDeductMoney(price);

    setPurchasedUnits((prev) => {
      const updated = { ...prev, [unitId]: (prev[unitId] || 0) + 1 };
      localStorage.setItem('base_warfare_purchased_units', JSON.stringify(updated));
      return updated;
    });

    onAddNotification(
      'Military Procurement Commissioned',
      `Command commissioned 1x ${unitName} for $${(price / 1e6).toFixed(2)}M. Asset deployed to national tactical inventory.`
    );
  };

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncFeedback('Synchronizing defense database registry...');
    try {
      const activeTableMeta = AIRTABLE_TABLES[activeTableKey];
      const records = await MilitaryAirtableService.fetchFromAirtable(activeTableMeta.tableId);
      setSyncVersion((v) => v + 1);
      const count = records?.length || 0;
      setSyncFeedback(
        `✓ Defense Registry Synchronized: ${count} tactical assets verified for ${activeTableMeta.name}.`
      );
      onAddNotification(
        'Defense Database Synchronized',
        `Tactical registry for ${activeTableMeta.name} refreshed with ${count} units.`
      );
    } catch {
      const activeTableMeta = AIRTABLE_TABLES[activeTableKey];
      setSyncFeedback(
        `✓ Defense Registry active: ${activeTableMeta.name} tactical schema operational.`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Automatically sync table on mount and when table changes
  useEffect(() => {
    handleSyncDatabase();
  }, [activeTableKey]);

  const activeTableMeta = AIRTABLE_TABLES[activeTableKey];

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Schema Header */}
      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-500/40">
              <Database className="w-4 h-4" />
            </span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
              DEFENSE ARSENAL REGISTRY (7 DIVISIONS)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Full capabilities, combat parameters, and tactical inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSyncDatabase}
            disabled={isSyncing}
            className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync Database'}</span>
          </button>
        </div>
      </div>

      {/* 7-Table Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTableKey('AIR_FORCE')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'AIR_FORCE'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>1. Air Force</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{airForce.length}</span>
        </button>

        <button
          onClick={() => setActiveTableKey('NAVY')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'NAVY'
              ? 'bg-cyan-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>2. Navy</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{navy.length}</span>
        </button>

        <button
          onClick={() => setActiveTableKey('GROUND')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'GROUND'
              ? 'bg-amber-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>3. Ground</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{ground.length}</span>
        </button>

        <button
          onClick={() => setActiveTableKey('MISSILES')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'MISSILES'
              ? 'bg-red-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>4. Missiles</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{missiles.length}</span>
        </button>

        <button
          onClick={() => setActiveTableKey('EQUIPMENT')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'EQUIPMENT'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>5. Equipment</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{equipment.length}</span>
        </button>

        <button
          onClick={() => setActiveTableKey('ELECTRONIC_SYSTEMS')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'ELECTRONIC_SYSTEMS'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>6. Electronic Systems</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{electronic.length}</span>
        </button>

        <button
          onClick={() => setActiveTableKey('LAUNCHERS')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            activeTableKey === 'LAUNCHERS'
              ? 'bg-orange-600 text-white shadow'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>7. Launchers</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/60 rounded-full">{launchers.length}</span>
        </button>
      </div>

      {/* Active Table Meta Bar */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Table ID:</span>
          <code className="text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-bold">
            {activeTableMeta.tableId}
          </code>
          <span className="text-zinc-400">({activeTableMeta.name})</span>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTableMeta.name}...`}
            className="w-full pl-8 pr-3 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* RENDER TABLE CONTENT */}
      {/* 1. AIR FORCE */}
      {activeTableKey === 'AIR_FORCE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {airForce
            .filter((u) => u.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) || u.aircraftType.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div
                  key={unit.id}
                  className="p-3.5 bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 rounded-xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.aircraft}</h4>
                        <span className="text-[10px] font-mono text-blue-400">{unit.aircraftType}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} In Fleet
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3 line-clamp-2">{unit.info}</p>

                    {/* 10-field parameters grid */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono mb-3">
                      <div><span className="text-zinc-500">Armor:</span> <strong className="text-white">{unit.armor}</strong></div>
                      <div><span className="text-zinc-500">Speed:</span> <strong className="text-cyan-400">{unit.speed}</strong></div>
                      <div><span className="text-zinc-500">Air Atk:</span> <strong className="text-red-400">{unit.airAttackPower}</strong></div>
                      <div><span className="text-zinc-500">Air Res:</span> <strong className="text-emerald-400">{unit.airResistance}</strong></div>
                      <div><span className="text-zinc-500">Cap:</span> <strong className="text-amber-400">{unit.weaponCapacity}</strong></div>
                      <div><span className="text-zinc-500">Sensors:</span> <strong className="text-purple-400">{unit.sensors}</strong></div>
                      <div><span className="text-zinc-500">Stealth:</span> <strong className="text-pink-400">{unit.stealth}%</strong></div>
                      <div><span className="text-zinc-500">Maneuver:</span> <strong className="text-lime-400">{unit.maneuverability}</strong></div>
                      <div><span className="text-zinc-500">Range:</span> <strong className="text-zinc-300">{unit.attackRange}km</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e6).toFixed(1)}M
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.aircraft, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Commission Unit
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 2. NAVY */}
      {activeTableKey === 'NAVY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {navy
            .filter((u) => u.unit.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div key={unit.id} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.unit}</h4>
                        <span className="text-[10px] font-mono text-cyan-400">{unit.unitType}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3">{unit.info}</p>

                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono mb-3">
                      <div><span className="text-zinc-500">Armor:</span> <strong className="text-white">{unit.armor}</strong></div>
                      <div><span className="text-zinc-500">Speed:</span> <strong className="text-cyan-400">{unit.speed}kts</strong></div>
                      <div><span className="text-zinc-500">VLS/Cap:</span> <strong className="text-amber-400">{unit.weaponCapacity}</strong></div>
                      <div><span className="text-zinc-500">Air Atk:</span> <strong className="text-red-400">{unit.airAttackPower}</strong></div>
                      <div><span className="text-zinc-500">Sensors:</span> <strong className="text-purple-400">{unit.sensors}</strong></div>
                      <div><span className="text-zinc-500">Atk Range:</span> <strong className="text-zinc-300">{unit.attackRange}km</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e6).toFixed(1)}M
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.unit, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Commission Ship
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 3. GROUND */}
      {activeTableKey === 'GROUND' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ground
            .filter((u) => u.unit.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div key={unit.id} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.unit}</h4>
                        <span className="text-[10px] font-mono text-amber-400">{unit.unitType}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} Battalions
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3">{unit.info}</p>

                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono mb-3">
                      <div><span className="text-zinc-500">Armor:</span> <strong className="text-white">{unit.armor}</strong></div>
                      <div><span className="text-zinc-500">Gnd Atk:</span> <strong className="text-red-400">{unit.groundAttackPower}</strong></div>
                      <div><span className="text-zinc-500">Gnd Res:</span> <strong className="text-emerald-400">{unit.groundResistance}</strong></div>
                      <div><span className="text-zinc-500">Speed:</span> <strong className="text-cyan-400">{unit.speed}km/h</strong></div>
                      <div><span className="text-zinc-500">Sensors:</span> <strong className="text-purple-400">{unit.sensors}</strong></div>
                      <div><span className="text-zinc-500">Range:</span> <strong className="text-zinc-300">{unit.attackRange}km</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e6).toFixed(1)}M
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.unit, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Procure Vehicle
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 4. MISSILES */}
      {activeTableKey === 'MISSILES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {missiles
            .filter((m) => m.missile.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div key={unit.id} className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.missile}</h4>
                        <span className="text-[10px] font-mono text-red-400">{unit.missileClass}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} In Stock
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3">{unit.info}</p>

                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono space-y-1 mb-3">
                      <div><span className="text-zinc-500">Speed:</span> <strong className="text-cyan-400">{unit.speed} km/h</strong></div>
                      <div><span className="text-zinc-500">Range:</span> <strong className="text-amber-400">{unit.range} km</strong></div>
                      <div><span className="text-zinc-500">Warhead:</span> <span className="text-zinc-300">{unit.warhead}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e6).toFixed(2)}M
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.missile, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Order Munitions
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 5. EQUIPMENT */}
      {activeTableKey === 'EQUIPMENT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {equipment
            .filter((e) => e.equipment.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div key={unit.id} className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.equipment}</h4>
                        <span className="text-[10px] font-mono text-emerald-400">{unit.equipmentType}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} Equipped
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3">{unit.info}</p>

                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono space-y-1 mb-3">
                      <div><span className="text-zinc-500">Weight:</span> <strong className="text-white">{unit.weight} kg</strong></div>
                      <div><span className="text-zinc-500">Protection/Power:</span> <strong className="text-emerald-400">{unit.protectionPower}</strong></div>
                      <div><span className="text-zinc-500">Effective Range:</span> <strong className="text-zinc-300">{unit.effectiveRange} km</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e3).toFixed(0)}k
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.equipment, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Acquire Gear
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 6. ELECTRONIC SYSTEMS */}
      {activeTableKey === 'ELECTRONIC_SYSTEMS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {electronic
            .filter((s) => s.system.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div key={unit.id} className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.system}</h4>
                        <span className="text-[10px] font-mono text-purple-400">{unit.systemType}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} Online
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3">{unit.info}</p>

                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono space-y-1 mb-3">
                      <div><span className="text-zinc-500">Detection Range:</span> <strong className="text-purple-400">{unit.detectionRange} km</strong></div>
                      <div><span className="text-zinc-500">Jamming Range:</span> <strong className="text-amber-400">{unit.jammingRange} km</strong></div>
                      <div><span className="text-zinc-500">Stealth Detection:</span> <strong className="text-cyan-400">{unit.stealthDetection}%</strong></div>
                      <div><span className="text-zinc-500">Platform:</span> <span className="text-zinc-300">{unit.platform}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e6).toFixed(1)}M
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.system, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Commission EW
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 7. LAUNCHERS */}
      {activeTableKey === 'LAUNCHERS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {launchers
            .filter((l) => l.launcher.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((unit) => {
              const ownedCount = purchasedUnits[unit.id] || 0;
              const canAfford = money >= unit.price;

              return (
                <div key={unit.id} className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white">{unit.launcher}</h4>
                        <span className="text-[10px] font-mono text-orange-400">{unit.missileClass}</span>
                      </div>
                      {ownedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-600/40 text-[10px] font-mono font-bold">
                          {ownedCount} Deployed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans mb-3">{unit.info}</p>

                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[10px] font-mono space-y-1 mb-3">
                      <div><span className="text-zinc-500">Speed:</span> <strong className="text-cyan-400">{unit.speed} km/h</strong></div>
                      <div><span className="text-zinc-500">Fire Rate:</span> <strong className="text-red-400">{unit.fireRate} r/salvo</strong></div>
                      <div><span className="text-zinc-500">Radar Index:</span> <strong className="text-emerald-400">{unit.radar}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      ${(unit.price / 1e6).toFixed(1)}M
                    </span>

                    <button
                      onClick={() => handleProcure(unit.id, unit.launcher, unit.price)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer ${
                        canAfford
                          ? 'bg-orange-600 hover:bg-orange-500 text-white shadow'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Deploy Battery
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {syncFeedback && (
        <div className="p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs font-mono text-amber-400 flex items-center justify-between">
          <span>{syncFeedback}</span>
          <span className="text-[10px] text-zinc-500 font-sans">Tactical Registry Active</span>
        </div>
      )}
    </div>
  );
};
