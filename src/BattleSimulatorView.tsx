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
} from 'lucide-react';
import {
  AirForceUnit,
  MissileUnit,
  ElectronicSystemUnit,
  MilitaryAirtableService,
} from './militaryAirtableDatabase';
import {
  AirBattleEngine,
  BattleSimulationResult,
  SimulationRound,
} from './battleEngine';

interface BattleSimulatorViewProps {
  onAddNotification?: (title: string, message: string) => void;
}

export const BattleSimulatorView: React.FC<BattleSimulatorViewProps> = ({
  onAddNotification,
}) => {
  const airForceUnits = MilitaryAirtableService.getAirForceUnits();
  const missiles = MilitaryAirtableService.getMissiles();
  const electronicSystems = MilitaryAirtableService.getElectronicSystems();

  // Selection states
  const [blueUnitId, setBlueUnitId] = useState<string>(airForceUnits[0]?.id || 'af-f22');
  const [redUnitId, setRedUnitId] = useState<string>(airForceUnits[1]?.id || 'af-su57');
  const [blueMissileId, setBlueMissileId] = useState<string>(missiles[0]?.id || '');
  const [redMissileId, setRedMissileId] = useState<string>(missiles[1]?.id || '');
  const [blueSysId, setBlueSysId] = useState<string>(electronicSystems[0]?.id || '');
  const [redSysId, setRedSysId] = useState<string>(electronicSystems[2]?.id || '');

  // Simulation states
  const [simResult, setSimResult] = useState<BattleSimulationResult | null>(null);
  const [activeRoundIndex, setActiveRoundIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playIntervalRef = useRef<any>(null);

  const selectedBlueUnit = airForceUnits.find((u) => u.id === blueUnitId) || airForceUnits[0];
  const selectedRedUnit = airForceUnits.find((u) => u.id === redUnitId) || airForceUnits[1];
  const selectedBlueMissile = missiles.find((m) => m.id === blueMissileId);
  const selectedRedMissile = missiles.find((m) => m.id === redMissileId);
  const selectedBlueSys = electronicSystems.find((s) => s.id === blueSysId);
  const selectedRedSys = electronicSystems.find((s) => s.id === redSysId);

  // Run simulation
  const handleRunSimulation = () => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    setIsPlaying(false);

    const result = AirBattleEngine.simulateEngagement(
      selectedBlueUnit,
      selectedRedUnit,
      selectedBlueMissile,
      selectedRedMissile,
      selectedBlueSys,
      selectedRedSys
    );

    setSimResult(result);
    setActiveRoundIndex(0);

    if (onAddNotification) {
      onAddNotification(
        'Dogfight Simulation Completed',
        `${result.blueUnit.aircraft} vs ${result.redUnit.aircraft} concluded: ${result.winningReason}`
      );
    }
  };

  // Playback loop
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
      }, 1600);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, simResult]);

  const currentRound: SimulationRound | undefined = simResult?.rounds[activeRoundIndex];

  // Parameters sequence requested by user
  const RULE_SEQUENCE = [
    { key: 'armor', label: 'Armor', icon: Shield, unit: 'HP', desc: 'Structural hull durability' },
    { key: 'speed', label: 'Speed', icon: Gauge, unit: 'km/h', desc: 'Kinematic closure & intercept' },
    { key: 'airAttackPower', label: 'Air Attack Power', icon: Flame, unit: 'PWR', desc: 'Missile/gun lethality' },
    { key: 'airResistance', label: 'Air Resistance', icon: Shield, unit: 'DEF', desc: 'ECM, flares & stealth skin' },
    { key: 'weaponCapacity', label: 'Weapon Capacity', icon: Layers, unit: 'Rnds', desc: 'Internal bay & pylon ammo' },
    { key: 'sensors', label: 'Sensors', icon: Radio, unit: 'RAT', desc: 'AESA radar & IRST track' },
    { key: 'stealth', label: 'Stealth', icon: Eye, unit: '%', desc: 'RCS & thermal suppression' },
    { key: 'maneuverability', label: 'Maneuverability', icon: Wind, unit: 'AGI', desc: 'High-G break-turn agility' },
    { key: 'attackRange', label: 'Attack Range', icon: Target, unit: 'km', desc: 'BVR missile launch envelope' },
    { key: 'fireRate', label: 'Fire Rate', icon: Zap, unit: 'vly', desc: 'Simultaneous salvo burst' },
  ] as const;

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Banner explaining the 10-Step Rule Sequence */}
      <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-950 text-red-400 border border-red-500/40">
              <Crosshair className="w-4 h-4" />
            </span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
              TACTICAL AIR-VS-AIR COMBAT BATTLE ENGINE
            </h3>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Simulates beyond-visual-range (BVR) and dogfight dogmas adhering strictly to the 10-parameter pipeline:
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2 font-mono text-[10px]">
            {RULE_SEQUENCE.map((r, i) => (
              <span key={r.key} className="flex items-center gap-1 text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                <span className="text-red-400 font-bold">{i + 1}.</span>
                <span>{r.label}</span>
                {i < RULE_SEQUENCE.length - 1 && <span className="text-zinc-600 font-bold ml-1">→</span>}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleRunSimulation}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>ENGAGE INTERCEPT (SIMULATE)</span>
        </button>
      </div>

      {/* Combatant Selection Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blue Force (Commander Aircraft) */}
        <div className="p-4 bg-zinc-900/80 border border-blue-500/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                SIDE A: BLUE FORCE (INTERCEPTOR)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Origin: {selectedBlueUnit.countryOrigin || 'NATO'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400 block">Select Primary Aircraft</label>
            <select
              value={blueUnitId}
              onChange={(e) => setBlueUnitId(e.target.value)}
              className="w-full bg-zinc-950 text-xs font-mono text-zinc-200 border border-zinc-700 rounded-lg p-2 focus:border-blue-500 outline-none"
            >
              {airForceUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.aircraft} ({u.aircraftType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Equipped Missile</label>
              <select
                value={blueMissileId}
                onChange={(e) => setBlueMissileId(e.target.value)}
                className="w-full bg-zinc-950 text-[11px] text-zinc-200 border border-zinc-800 rounded p-1.5 outline-none"
              >
                <option value="">Standard Internal Payload</option>
                {missiles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.missile} ({m.range}km)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Electronic EW Pod</label>
              <select
                value={blueSysId}
                onChange={(e) => setBlueSysId(e.target.value)}
                className="w-full bg-zinc-950 text-[11px] text-zinc-200 border border-zinc-800 rounded p-1.5 outline-none"
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

          {/* Quick unit specs pill */}
          <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Hull Armor: <strong className="text-white">{selectedBlueUnit.armor} HP</strong></span>
              <span>Speed: <strong className="text-cyan-400">{selectedBlueUnit.speed} km/h</strong></span>
            </div>
            <div className="flex justify-between">
              <span>Attack Range: <strong className="text-amber-400">{selectedBlueUnit.attackRange} km</strong></span>
              <span>Stealth: <strong className="text-purple-400">{selectedBlueUnit.stealth}%</strong></span>
            </div>
          </div>
        </div>

        {/* Red Force (Opposing Aircraft) */}
        <div className="p-4 bg-zinc-900/80 border border-red-500/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
                SIDE B: RED FORCE (ADVERSARY)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Origin: {selectedRedUnit.countryOrigin || 'OPFOR'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400 block">Select Primary Aircraft</label>
            <select
              value={redUnitId}
              onChange={(e) => setRedUnitId(e.target.value)}
              className="w-full bg-zinc-950 text-xs font-mono text-zinc-200 border border-zinc-700 rounded-lg p-2 focus:border-red-500 outline-none"
            >
              {airForceUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.aircraft} ({u.aircraftType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Equipped Missile</label>
              <select
                value={redMissileId}
                onChange={(e) => setRedMissileId(e.target.value)}
                className="w-full bg-zinc-950 text-[11px] text-zinc-200 border border-zinc-800 rounded p-1.5 outline-none"
              >
                <option value="">Standard Internal Payload</option>
                {missiles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.missile} ({m.range}km)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Electronic EW Pod</label>
              <select
                value={redSysId}
                onChange={(e) => setRedSysId(e.target.value)}
                className="w-full bg-zinc-950 text-[11px] text-zinc-200 border border-zinc-800 rounded p-1.5 outline-none"
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

          {/* Quick unit specs pill */}
          <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Hull Armor: <strong className="text-white">{selectedRedUnit.armor} HP</strong></span>
              <span>Speed: <strong className="text-cyan-400">{selectedRedUnit.speed} km/h</strong></span>
            </div>
            <div className="flex justify-between">
              <span>Attack Range: <strong className="text-amber-400">{selectedRedUnit.attackRange} km</strong></span>
              <span>Stealth: <strong className="text-purple-400">{selectedRedUnit.stealth}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Matrix for all 10 Rule Parameters */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>10-FIELD TACTICAL TELEMETRY COMPARISON</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Airtable Field Values Mapped
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs font-mono">
          {RULE_SEQUENCE.map((rule) => {
            const blueVal = selectedBlueUnit[rule.key as keyof AirForceUnit] as number;
            const redVal = selectedRedUnit[rule.key as keyof AirForceUnit] as number;
            const isBlueHigher = blueVal > redVal;
            const isRedHigher = redVal > blueVal;

            return (
              <div key={rule.key} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
                  <span className="flex items-center gap-1 font-bold">
                    <rule.icon className="w-3 h-3 text-zinc-500" />
                    {rule.label}
                  </span>
                  <span className="text-[9px] text-zinc-600">{rule.unit}</span>
                </div>

                <div className="flex items-center justify-between my-1">
                  <span className={`font-bold ${isBlueHigher ? 'text-blue-400' : 'text-zinc-400'}`}>
                    {blueVal}
                  </span>
                  <span className="text-[9px] text-zinc-600">vs</span>
                  <span className={`font-bold ${isRedHigher ? 'text-red-400' : 'text-zinc-400'}`}>
                    {redVal}
                  </span>
                </div>

                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(blueVal / (blueVal + redVal || 1)) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${(redVal / (blueVal + redVal || 1)) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulation Playback Area */}
      {simResult && currentRound && (
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 shadow-xl">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  ENGAGEMENT PHASE {activeRoundIndex + 1} OF {simResult.rounds.length}:
                </span>
                <span className="text-xs font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                  {currentRound.phaseName}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Target Separation: <strong className="text-amber-300">{currentRound.distanceKm.toFixed(0)} km</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveRoundIndex((p) => Math.max(0, p - 1))}
                disabled={activeRoundIndex === 0}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-mono text-zinc-200 rounded cursor-pointer"
              >
                Previous
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                  isPlaying ? 'bg-amber-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                {isPlaying ? 'PAUSE' : 'AUTO-PLAY'}
              </button>

              <button
                onClick={() => setActiveRoundIndex((p) => Math.min(simResult.rounds.length - 1, p + 1))}
                disabled={activeRoundIndex === simResult.rounds.length - 1}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-mono text-zinc-200 rounded cursor-pointer"
              >
                Next
              </button>

              <button
                onClick={() => setActiveRoundIndex(0)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded cursor-pointer"
                title="Reset simulation playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Health & Ammo Meters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blue status */}
            <div className="p-3 bg-zinc-950 rounded-lg border border-blue-900/60 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-400">{simResult.blueUnit.aircraft}</span>
                <span className="text-zinc-400">
                  Hull: <strong className="text-white">{currentRound.blueArmorAfter.toFixed(0)}</strong> / {simResult.blueInitialArmor} HP
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (currentRound.blueArmorAfter / simResult.blueInitialArmor) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Munitions Remaining: {currentRound.blueAmmoAfter} / {simResult.blueUnit.weaponCapacity}</span>
                <span className="text-emerald-400">
                  Damage Taken: {(simResult.blueInitialArmor - currentRound.blueArmorAfter).toFixed(0)} HP
                </span>
              </div>
            </div>

            {/* Red status */}
            <div className="p-3 bg-zinc-950 rounded-lg border border-red-900/60 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-400">{simResult.redUnit.aircraft}</span>
                <span className="text-zinc-400">
                  Hull: <strong className="text-white">{currentRound.redArmorAfter.toFixed(0)}</strong> / {simResult.redInitialArmor} HP
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (currentRound.redArmorAfter / simResult.redInitialArmor) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Munitions Remaining: {currentRound.redAmmoAfter} / {simResult.redUnit.weaponCapacity}</span>
                <span className="text-emerald-400">
                  Damage Taken: {(simResult.redInitialArmor - currentRound.redArmorAfter).toFixed(0)} HP
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Rule Execution Logs for the Active Round */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-red-400" />
              <span>ROUND {activeRoundIndex + 1} STEP-BY-STEP RULE RESOLUTION</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {currentRound.logs.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-zinc-900/90 rounded border border-zinc-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-amber-400 font-bold uppercase text-[10px]">
                      {step.stepName}
                    </span>
                    <span className="text-[10px] text-zinc-500">{step.description}</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] font-sans leading-tight mb-1.5">
                    {step.detail}
                  </p>
                  <div className="flex justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-800">
                    <span className="text-blue-400">{step.metricA}</span>
                    <span className="text-red-400">{step.metricB}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combat Outcome if Completed or Final Round */}
          {activeRoundIndex === simResult.rounds.length - 1 && (
            <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
              simResult.winner === 'blue'
                ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                : simResult.winner === 'red'
                ? 'bg-red-950/40 border-red-500 text-red-200'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  ENGAGEMENT RESOLUTION: {simResult.winner.toUpperCase()} FORCE VICTORIOUS
                </h4>
              </div>
              <p className="font-sans text-sm">{simResult.winningReason}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/80 text-[11px]">
                <div>Blue Hit Ratio: <strong>{simResult.combatEfficiency.blueHitRate}%</strong></div>
                <div>Red Hit Ratio: <strong>{simResult.combatEfficiency.redHitRate}%</strong></div>
                <div>Blue Damage: <strong>{simResult.combatEfficiency.blueDamageDealt} HP</strong></div>
                <div>Red Damage: <strong>{simResult.combatEfficiency.redDamageDealt} HP</strong></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
