import React, { useState, useEffect, useRef } from 'react';
import {
  Crosshair,
  Play,
  RotateCcw,
  Shield,
  Zap,
  Radio,
  Gauge,
  Eye,
  Wind,
  Flame,
  ChevronRight,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  Target,
  Cpu,
  Layers,
  BarChart3,
  Plane,
  Ship,
  Sparkles,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  AirForceUnit,
  NavyUnit,
  GroundUnit,
  MissileUnit,
  ElectronicSystemUnit,
  MilitaryAirtableService,
} from './militaryAirtableDatabase';
import {
  StrategicCombatEngine,
  DetailedBattleResult,
  MonteCarloOutcome,
  CombatDomain,
  BattleType,
  UnifiedCombatUnit,
} from './combatEngine';

interface BattleSimulatorViewProps {
  onAddNotification?: (title: string, message: string) => void;
}

export const BattleSimulatorView: React.FC<BattleSimulatorViewProps> = ({
  onAddNotification,
}) => {
  // Database data
  const airForceUnits = MilitaryAirtableService.getAirForceUnits();
  const navyUnits = MilitaryAirtableService.getNavyUnits();
  const groundUnits = MilitaryAirtableService.getGroundUnits();
  const missiles = MilitaryAirtableService.getMissiles();
  const electronicSystems = MilitaryAirtableService.getElectronicSystems();

  // Domain selection
  const [blueDomain, setBlueDomain] = useState<CombatDomain>('air');
  const [redDomain, setRedDomain] = useState<CombatDomain>('air');

  // Unit selections
  const [blueUnitId, setBlueUnitId] = useState<string>(airForceUnits[0]?.id || 'af-f22');
  const [redUnitId, setRedUnitId] = useState<string>(airForceUnits[1]?.id || 'af-su57');

  // Squad sizes
  const [blueCount, setBlueCount] = useState<number>(12);
  const [redCount, setRedCount] = useState<number>(20);

  // Engagement distance
  const [distanceKm, setDistanceKm] = useState<number>(85);

  // Optional attachments
  const [blueMissileId, setBlueMissileId] = useState<string>(missiles[0]?.id || '');
  const [redMissileId, setRedMissileId] = useState<string>(missiles[1]?.id || '');
  const [blueSysId, setBlueSysId] = useState<string>(electronicSystems[0]?.id || '');
  const [redSysId, setRedSysId] = useState<string>(electronicSystems[1]?.id || '');

  // Simulation execution results
  const [simResult, setSimResult] = useState<DetailedBattleResult | null>(null);
  const [activeRoundIndex, setActiveRoundIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playIntervalRef = useRef<any>(null);

  // Monte Carlo results
  const [monteCarlo, setMonteCarlo] = useState<MonteCarloOutcome | null>(null);
  const [isCalculatingMonteCarlo, setIsCalculatingMonteCarlo] = useState<boolean>(false);

  // Helper to get unit pool by domain
  const getUnitsByDomain = (domain: CombatDomain): UnifiedCombatUnit[] => {
    if (domain === 'air') return airForceUnits;
    if (domain === 'navy') return navyUnits;
    return groundUnits;
  };

  const blueUnitList = getUnitsByDomain(blueDomain);
  const redUnitList = getUnitsByDomain(redDomain);

  const selectedBlueUnit =
    blueUnitList.find((u) => u.id === blueUnitId) || blueUnitList[0] || airForceUnits[0];
  const selectedRedUnit =
    redUnitList.find((u) => u.id === redUnitId) || redUnitList[0] || airForceUnits[1];

  const selectedBlueMissile = missiles.find((m) => m.id === blueMissileId);
  const selectedRedMissile = missiles.find((m) => m.id === redMissileId);
  const selectedBlueSys = electronicSystems.find((s) => s.id === blueSysId);
  const selectedRedSys = electronicSystems.find((s) => s.id === redSysId);

  const battleType = StrategicCombatEngine.getBattleType(blueDomain, redDomain);

  // Update selected unit when domain switches if current unit is invalid
  const handleBlueDomainChange = (domain: CombatDomain) => {
    setBlueDomain(domain);
    const pool = getUnitsByDomain(domain);
    if (pool.length > 0) {
      setBlueUnitId(pool[0].id);
    }
    setSimResult(null);
    setMonteCarlo(null);
  };

  const handleRedDomainChange = (domain: CombatDomain) => {
    setRedDomain(domain);
    const pool = getUnitsByDomain(domain);
    if (pool.length > 0) {
      setRedUnitId(pool[0].id);
    }
    setSimResult(null);
    setMonteCarlo(null);
  };

  // Run detailed single simulation
  const handleRunSimulation = () => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    setIsPlaying(false);

    const result = StrategicCombatEngine.simulateBattle(
      selectedBlueUnit,
      selectedRedUnit,
      blueCount,
      redCount,
      distanceKm,
      selectedBlueMissile,
      selectedRedMissile,
      selectedBlueSys,
      selectedRedSys
    );

    setSimResult(result);
    setActiveRoundIndex(0);

    if (onAddNotification) {
      onAddNotification(
        'Combat Simulation Complete',
        `${battleType} Engagement: ${StrategicCombatEngine.getUnitName(selectedBlueUnit)} (${blueCount}) vs ${StrategicCombatEngine.getUnitName(selectedRedUnit)} (${redCount})`
      );
    }
  };

  // Run Monte Carlo empirical probability analysis
  const handleRunMonteCarlo = () => {
    setIsCalculatingMonteCarlo(true);
    setTimeout(() => {
      const outcome = StrategicCombatEngine.runMonteCarloSimulation(
        selectedBlueUnit,
        selectedRedUnit,
        blueCount,
        redCount,
        distanceKm,
        selectedBlueMissile,
        selectedRedMissile,
        selectedBlueSys,
        selectedRedSys,
        300
      );
      setMonteCarlo(outcome);
      setIsCalculatingMonteCarlo(false);

      if (onAddNotification) {
        onAddNotification(
          'Monte Carlo Analysis (300 Runs)',
          `Empirical Probability: Blue Victory: ${outcome.pBlueVictory}%, Red Victory: ${outcome.pRedVictory}%, Draw: ${outcome.pDraw}%`
        );
      }
    }, 50);
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying && simResult) {
      playIntervalRef.current = setInterval(() => {
        setActiveRoundIndex((prev) => {
          if (prev >= simResult.rounds.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, simResult]);

  // Theoretical analytical numbers
  const blueName = StrategicCombatEngine.getUnitName(selectedBlueUnit);
  const redName = StrategicCombatEngine.getUnitName(selectedRedUnit);

  const blueAttackRange = selectedBlueMissile?.range || selectedBlueUnit.attackRange || 80;
  const redAttackRange = selectedRedMissile?.range || selectedRedUnit.attackRange || 80;

  const blueInRange = StrategicCombatEngine.canEngageTarget(distanceKm, blueAttackRange);
  const redInRange = StrategicCombatEngine.canEngageTarget(distanceKm, redAttackRange);

  const blueElecBonus = selectedBlueSys ? (selectedBlueSys.stealthDetection || 15) * 0.003 : 0;
  const redElecBonus = selectedRedSys ? (selectedRedSys.stealthDetection || 15) * 0.003 : 0;

  const blueDetectProb = StrategicCombatEngine.calculateDetectionProbability(
    selectedBlueUnit.sensors,
    selectedRedUnit.stealth,
    blueElecBonus
  );
  const redDetectProb = StrategicCombatEngine.calculateDetectionProbability(
    selectedRedUnit.sensors,
    selectedBlueUnit.stealth,
    redElecBonus
  );

  const blueHitProb = StrategicCombatEngine.calculateHitProbability(
    { sensors: selectedBlueUnit.sensors, maneuverability: selectedBlueUnit.maneuverability, speed: selectedBlueUnit.speed },
    { stealth: selectedRedUnit.stealth, maneuverability: selectedRedUnit.maneuverability, speed: selectedRedUnit.speed }
  );
  const redHitProb = StrategicCombatEngine.calculateHitProbability(
    { sensors: selectedRedUnit.sensors, maneuverability: selectedRedUnit.maneuverability, speed: selectedRedUnit.speed },
    { stealth: selectedBlueUnit.stealth, maneuverability: selectedBlueUnit.maneuverability, speed: selectedBlueUnit.speed }
  );

  const blueRawPower = StrategicCombatEngine.resolveAttackPower(selectedBlueUnit, redDomain);
  const redRawPower = StrategicCombatEngine.resolveAttackPower(selectedRedUnit, blueDomain);
  const blueResistance = StrategicCombatEngine.resolveResistance(selectedBlueUnit, redDomain);
  const redResistance = StrategicCombatEngine.resolveResistance(selectedRedUnit, blueDomain);

  const blueDmgCalc = StrategicCombatEngine.calculateDamage(blueRawPower, redResistance);
  const redDmgCalc = StrategicCombatEngine.calculateDamage(redRawPower, blueResistance);

  const activeRound = simResult?.rounds[activeRoundIndex] || null;

  return (
    <div className="space-y-6 text-zinc-100 font-sans pb-12">
      {/* Top Banner: Stat-Driven Universal Combat Engine */}
      <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/40">
              BATTLE ENGINE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
              {battleType} THEATER ENGAGEMENT
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400">
              Stat-Driven Simulation Engine
            </span>
          </div>
          <h2 className="text-lg font-bold font-mono tracking-tight text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-red-500" />
            Universal Multi-Domain Combat Simulator
          </h2>
          <p className="text-xs text-zinc-400">
            Formulas: Detection (Sensors vs Stealth) • Engagement (Attack Range) • Hit Probability • Damage & Armor Resistance • Individual HP Tracking • Monte Carlo Probability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSimulation}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Simulate Engagement</span>
          </button>
          <button
            onClick={handleRunMonteCarlo}
            disabled={isCalculatingMonteCarlo}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <BarChart3 className={`w-4 h-4 ${isCalculatingMonteCarlo ? 'animate-spin' : ''}`} />
            <span>Monte Carlo (300 Runs)</span>
          </button>
        </div>
      </div>

      {/* Force Composition & Domain Selector Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BLUE FORCE (Friendly Sovereign Task Force) */}
        <div className="p-4 bg-zinc-900/80 border border-cyan-500/40 rounded-xl space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <h3 className="font-mono text-sm font-bold text-cyan-400">BLUE FORCE (Friendly Contingent)</h3>
            </div>
            {/* Domain Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => handleBlueDomainChange('air')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  blueDomain === 'air' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Plane className="w-3 h-3" /> Air
              </button>
              <button
                onClick={() => handleBlueDomainChange('navy')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  blueDomain === 'navy' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Ship className="w-3 h-3" /> Navy
              </button>
              <button
                onClick={() => handleBlueDomainChange('ground')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  blueDomain === 'ground' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Crosshair className="w-3 h-3" /> Ground
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Select Platform ({blueDomain.toUpperCase()})
              </label>
              <select
                value={blueUnitId}
                onChange={(e) => setBlueUnitId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                {blueUnitList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {StrategicCombatEngine.getUnitName(u)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Formation Count
                </label>
                <span className="text-xs font-mono font-bold text-cyan-300">{blueCount} Units</span>
              </div>
              <input
                type="range"
                min={1}
                max={48}
                value={blueCount}
                onChange={(e) => setBlueCount(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Unit Key Stats Preview */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg font-mono text-[10px]">
            <div className="text-center">
              <div className="text-zinc-500">HP (Armor)</div>
              <div className="font-bold text-white">{selectedBlueUnit.armor}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Speed</div>
              <div className="font-bold text-cyan-300">{selectedBlueUnit.speed}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Sensors</div>
              <div className="font-bold text-emerald-400">{selectedBlueUnit.sensors}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Stealth</div>
              <div className="font-bold text-purple-400">{selectedBlueUnit.stealth}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Atk Range</div>
              <div className="font-bold text-amber-400">{blueAttackRange} km</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Fire Rate</div>
              <div className="font-bold text-red-400">{selectedBlueUnit.fireRate}/min</div>
            </div>
          </div>

          {/* Optional Attachments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[9px] text-zinc-400 block mb-0.5">Equipped Munition</label>
              <select
                value={blueMissileId}
                onChange={(e) => setBlueMissileId(e.target.value)}
                className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-300"
              >
                <option value="">Standard Onboard Loadout</option>
                {missiles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.missile} ({m.range}km)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] text-zinc-400 block mb-0.5">EW / Radar System</label>
              <select
                value={blueSysId}
                onChange={(e) => setBlueSysId(e.target.value)}
                className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-300"
              >
                <option value="">Integrated Avionics</option>
                {electronicSystems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.system}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RED FORCE (Hostile Opposing Formation) */}
        <div className="p-4 bg-zinc-900/80 border border-red-500/40 rounded-xl space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <h3 className="font-mono text-sm font-bold text-red-400">RED FORCE (Opposing Formation)</h3>
            </div>
            {/* Domain Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => handleRedDomainChange('air')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  redDomain === 'air' ? 'bg-red-950 text-red-300 font-bold border border-red-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Plane className="w-3 h-3" /> Air
              </button>
              <button
                onClick={() => handleRedDomainChange('navy')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  redDomain === 'navy' ? 'bg-red-950 text-red-300 font-bold border border-red-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Ship className="w-3 h-3" /> Navy
              </button>
              <button
                onClick={() => handleRedDomainChange('ground')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  redDomain === 'ground' ? 'bg-red-950 text-red-300 font-bold border border-red-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Crosshair className="w-3 h-3" /> Ground
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Select Platform ({redDomain.toUpperCase()})
              </label>
              <select
                value={redUnitId}
                onChange={(e) => setRedUnitId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
              >
                {redUnitList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {StrategicCombatEngine.getUnitName(u)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Formation Count
                </label>
                <span className="text-xs font-mono font-bold text-red-400">{redCount} Units</span>
              </div>
              <input
                type="range"
                min={1}
                max={48}
                value={redCount}
                onChange={(e) => setRedCount(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Unit Key Stats Preview */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg font-mono text-[10px]">
            <div className="text-center">
              <div className="text-zinc-500">HP (Armor)</div>
              <div className="font-bold text-white">{selectedRedUnit.armor}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Speed</div>
              <div className="font-bold text-cyan-300">{selectedRedUnit.speed}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Sensors</div>
              <div className="font-bold text-emerald-400">{selectedRedUnit.sensors}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Stealth</div>
              <div className="font-bold text-purple-400">{selectedRedUnit.stealth}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Atk Range</div>
              <div className="font-bold text-amber-400">{redAttackRange} km</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-500">Fire Rate</div>
              <div className="font-bold text-red-400">{selectedRedUnit.fireRate}/min</div>
            </div>
          </div>

          {/* Optional Attachments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[9px] text-zinc-400 block mb-0.5">Equipped Munition</label>
              <select
                value={redMissileId}
                onChange={(e) => setRedMissileId(e.target.value)}
                className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-300"
              >
                <option value="">Standard Onboard Loadout</option>
                {missiles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.missile} ({m.range}km)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] text-zinc-400 block mb-0.5">EW / Radar System</label>
              <select
                value={redSysId}
                onChange={(e) => setRedSysId(e.target.value)}
                className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-300"
              >
                <option value="">Integrated Avionics</option>
                {electronicSystems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.system}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Range & Distance Slider */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-zinc-200">TACTICAL ENGAGEMENT DISTANCE</span>
            <span className="text-[11px] text-zinc-400">(Attack Range constraint rule)</span>
          </div>
          <span className="text-base font-bold text-amber-400">{distanceKm} KM</span>
        </div>

        <input
          type="range"
          min={5}
          max={240}
          step={5}
          value={distanceKm}
          onChange={(e) => {
            setDistanceKm(Number(e.target.value));
            setSimResult(null);
          }}
          className="w-full accent-amber-500 cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className={`flex items-center gap-1 ${blueInRange ? 'text-emerald-400 font-bold' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${blueInRange ? 'bg-emerald-400' : 'bg-red-400'}`} />
            BLUE: {blueInRange ? 'TARGET IN ENGAGEMENT ENVELOPE' : `OUT OF RANGE (${blueAttackRange}km max)`}
          </span>
          <span className={`flex items-center gap-1 ${redInRange ? 'text-emerald-400 font-bold' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${redInRange ? 'bg-emerald-400' : 'bg-red-400'}`} />
            RED: {redInRange ? 'TARGET IN ENGAGEMENT ENVELOPE' : `OUT OF RANGE (${redAttackRange}km max)`}
          </span>
        </div>
      </div>

      {/* Theoretical Stat Formula Breakdown Matrix */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-zinc-300 font-bold">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>STAT-DRIVEN FORMULA RESOLUTION MATRIX (PRE-ENGAGEMENT PROJECTION)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* 1. Detection Probability */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">1. Detection P(detect)</div>
            <div className="text-[11px] text-zinc-400">Sensors vs Stealth formula</div>
            <div className="pt-1 flex justify-between">
              <span className="text-cyan-400">Blue: {(blueDetectProb.pTotal * 100).toFixed(1)}%</span>
              <span className="text-red-400">Red: {(redDetectProb.pTotal * 100).toFixed(1)}%</span>
            </div>
            <div className="text-[9px] text-zinc-500">
              P = clamp(0.50 + 0.005*(S - St), 0.10, 0.95)
            </div>
          </div>

          {/* 2. Hit Probability */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">2. Hit P(hit)</div>
            <div className="text-[11px] text-zinc-400">Sensors, Maneuver & Speed</div>
            <div className="pt-1 flex justify-between">
              <span className="text-cyan-400">Blue: {(blueHitProb * 100).toFixed(1)}%</span>
              <span className="text-red-400">Red: {(redHitProb * 100).toFixed(1)}%</span>
            </div>
            <div className="text-[9px] text-zinc-500">
              0.50 + 0.002ΔS + 0.002ΔM + 0.001ΔSpd
            </div>
          </div>

          {/* 3. Damage & Mitigation */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">3. Damage / Hit</div>
            <div className="text-[11px] text-zinc-400">Attack Power vs Resistance</div>
            <div className="pt-1 flex justify-between">
              <span className="text-cyan-400">Blue: {blueDmgCalc.finalDamage} HP</span>
              <span className="text-red-400">Red: {redDmgCalc.finalDamage} HP</span>
            </div>
            <div className="text-[9px] text-zinc-500">
              Damage = Raw * (100 / (100 + Res))
            </div>
          </div>

          {/* 4. Expected DPS per Salvo */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">4. Expected Damage/Shot</div>
            <div className="text-[11px] text-zinc-400">Damage * P(hit)</div>
            <div className="pt-1 flex justify-between font-bold">
              <span className="text-cyan-400">{(blueDmgCalc.finalDamage * blueHitProb).toFixed(1)} HP</span>
              <span className="text-red-400">{(redDmgCalc.finalDamage * redHitProb).toFixed(1)} HP</span>
            </div>
            <div className="text-[9px] text-zinc-500">
              Fire Rate: B:{selectedBlueUnit.fireRate}/min • R:{selectedRedUnit.fireRate}/min
            </div>
          </div>
        </div>
      </div>

      {/* Monte Carlo Results Card (if calculated) */}
      {monteCarlo && (
        <div className="p-5 bg-cyan-950/20 border border-cyan-500/50 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-mono text-sm font-bold text-white">
                MONTE CARLO OUTCOME PROBABILITY (300 STOCHASTIC SIMULATIONS)
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-300">
              {monteCarlo.iterations} Independent Engagements Executed
            </span>
          </div>

          {/* Probability Distribution Bar */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400 font-bold">Blue Victory: {monteCarlo.pBlueVictory}%</span>
              <span className="text-zinc-400">Stalemate: {monteCarlo.pDraw}%</span>
              <span className="text-red-400 font-bold">Red Victory: {monteCarlo.pRedVictory}%</span>
            </div>
            <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-800">
              <div
                style={{ width: `${monteCarlo.pBlueVictory}%` }}
                className="bg-cyan-500 h-full transition-all duration-500"
              />
              <div
                style={{ width: `${monteCarlo.pDraw}%` }}
                className="bg-zinc-600 h-full transition-all duration-500"
              />
              <div
                style={{ width: `${monteCarlo.pRedVictory}%` }}
                className="bg-red-500 h-full transition-all duration-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-zinc-950/80 rounded border border-zinc-800">
              <div className="text-zinc-500">Blue Wins</div>
              <div className="text-lg font-bold text-cyan-400">{monteCarlo.blueVictories} / 300</div>
            </div>
            <div className="p-2.5 bg-zinc-950/80 rounded border border-zinc-800">
              <div className="text-zinc-500">Red Wins</div>
              <div className="text-lg font-bold text-red-400">{monteCarlo.redVictories} / 300</div>
            </div>
            <div className="p-2.5 bg-zinc-950/80 rounded border border-zinc-800">
              <div className="text-zinc-500">Avg Rounds to Finish</div>
              <div className="text-lg font-bold text-amber-400">{monteCarlo.avgRoundsToFinish} Rounds</div>
            </div>
            <div className="p-2.5 bg-zinc-950/80 rounded border border-zinc-800">
              <div className="text-zinc-500">Avg Blue Survivors</div>
              <div className="text-lg font-bold text-emerald-400">{monteCarlo.avgBlueSurvivors} / {blueCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Single Battle Interactive Timeline & Individual HP View */}
      {simResult && (
        <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-5">
          {/* Winner Header */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              simResult.winner === 'blue'
                ? 'bg-cyan-950/40 border-cyan-500/60'
                : simResult.winner === 'red'
                ? 'bg-red-950/40 border-red-500/60'
                : 'bg-zinc-900 border-zinc-700'
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Engagement Outcome
              </div>
              <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                {simResult.winner === 'blue' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                {simResult.winner === 'red' && <AlertOctagon className="w-5 h-5 text-red-400" />}
                {simResult.winner === 'blue'
                  ? 'BLUE FORCES VICTORIOUS'
                  : simResult.winner === 'red'
                  ? 'RED FORCES VICTORIOUS'
                  : 'TACTICAL DRAW'}
              </h3>
              <p className="text-xs text-zinc-300 font-sans mt-0.5">{simResult.winningReason}</p>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-zinc-400">Final Active Units</div>
              <div className="text-sm font-bold">
                <span className="text-cyan-400">{simResult.blueFinalActive}</span> vs{' '}
                <span className="text-red-400">{simResult.redFinalActive}</span>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
              </button>

              <button
                onClick={() => setActiveRoundIndex(0)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs rounded cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Round Pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {simResult.rounds.map((r, idx) => (
                <button
                  key={r.roundNumber}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveRoundIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    activeRoundIndex === idx
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  R{r.roundNumber} ({r.distanceKm}km)
                </button>
              ))}
            </div>
          </div>

          {/* Round Snapshot */}
          {activeRound && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Round Distance</div>
                  <div className="text-base font-bold text-amber-400">{activeRound.distanceKm} km</div>
                </div>
                <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Active Units</div>
                  <div className="text-base font-bold">
                    <span className="text-cyan-400">{activeRound.blueActiveCount} Blue</span> vs{' '}
                    <span className="text-red-400">{activeRound.redActiveCount} Red</span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Damage Exchanged</div>
                  <div className="text-base font-bold">
                    <span className="text-cyan-400">{activeRound.blueDamageDealt}</span> /{' '}
                    <span className="text-red-400">{activeRound.redDamageDealt}</span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Units Destroyed This Round</div>
                  <div className="text-base font-bold text-red-400">
                    -{activeRound.blueUnitsLostThisRound} Blue / -{activeRound.redUnitsLostThisRound} Red
                  </div>
                </div>
              </div>

              {/* Combat Log for Current Round */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Tactical Engagement Feed — Round {activeRound.roundNumber}
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 max-h-56 overflow-y-auto space-y-1.5 font-mono text-xs">
                  {activeRound.logs.map((log, lIdx) => (
                    <div
                      key={lIdx}
                      className={`flex items-start justify-between py-1 px-2 rounded border ${
                        log.attackerSide === 'blue'
                          ? 'bg-cyan-950/20 border-cyan-500/20 text-cyan-200'
                          : 'bg-red-950/20 border-red-500/20 text-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">+{log.timestampSec}s</span>
                        <span className="font-bold">[{log.attackerName}]</span>
                        <span>→ {log.defenderName}:</span>
                        <span>{log.summary}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 shrink-0">
                        {log.hitLanded ? (
                          <span className="text-emerald-400 font-bold">-{log.finalDamageDealt} HP</span>
                        ) : (
                          <span className="text-zinc-500">MISSED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
