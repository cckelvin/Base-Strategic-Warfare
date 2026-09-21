import React, { useEffect, useState } from 'react';
import { Shield, TrendingUp, Radio, Globe, Activity, Lock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('ESTABLISHING SECURE MILITARY SAT-UPLINK...');
  const [militaryVal, setMilitaryVal] = useState('$1,240,000,000,000');
  const [economicVal, setEconomicVal] = useState('$42,800,000,000,000');
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds strictly as requested

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Live fluctuating military & economic value animations
      if (pct < 25) {
        setStageText('ACQUIRING ORBITAL RECON TELEMETRY [ESRI WORLD SAT]...');
        setMilitaryVal(`$${(1.2 + (pct / 25) * 1.1).toFixed(2)} TRILLION`);
        setEconomicVal(`$${(42 + (pct / 25) * 20).toFixed(1)} TRILLION`);
      } else if (pct < 55) {
        setStageText('CALIBRATING GLOBAL PENTAGON FORTRESSES & SAM BATTERIES...');
        setMilitaryVal(`$${(2.3 + ((pct - 25) / 30) * 1.4).toFixed(2)} TRILLION`);
        setEconomicVal(`$${(62 + ((pct - 25) / 30) * 26).toFixed(1)} TRILLION`);
      } else if (pct < 85) {
        setStageText('SYNCING SOVEREIGN ALLIANCE INTEL & TREASURY PROTOCOLS...');
        setMilitaryVal(`$${(3.7 + ((pct - 55) / 30) * 0.9).toFixed(2)} TRILLION`);
        setEconomicVal(`$${(88 + ((pct - 55) / 30) * 18).toFixed(1)} TRILLION`);
      } else {
        setStageText('PLANETARY THEATER SYNCHRONIZED. LAUNCHING COMMAND SYSTEM...');
        setMilitaryVal('$4.89 TRILLION');
        setEconomicVal('$108.45 TRILLION');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setFading(true);
        setTimeout(() => {
          onComplete();
        }, 500); // smooth 500ms fade transition
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      id="tactical-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-6 md:p-12 bg-zinc-950 text-zinc-100 select-none transition-opacity duration-500 overflow-hidden ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Tactical Grid & Radar Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radar concentric circular grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px] rounded-full border border-red-500/10 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border border-red-500/15 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-red-500/20 flex items-center justify-center">
              <div className="w-1/4 h-1/4 rounded-full border border-red-500/30" />
            </div>
          </div>
          {/* Rotating radar sweep beam */}
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(239,68,68,0.18)_0deg,transparent_60deg,transparent_360deg)]" />
        </div>

        {/* Scanlines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />

        {/* Tactical Crosshairs & Corner Brackets */}
        <div className="absolute top-8 left-8 text-red-500/40 font-mono text-xs tracking-widest">
          + LAT_REF: 00°00&apos;00&quot;N / LNG_REF: 00°00&apos;00&quot;E
        </div>
        <div className="absolute top-8 right-8 text-red-500/40 font-mono text-xs tracking-widest text-right">
          SYS_SEC: DEFCON-1 ACTIVE +
        </div>
        <div className="absolute bottom-8 left-8 text-red-500/40 font-mono text-xs tracking-widest">
          + GEOSPATIAL MAP SERVER: BUFFERING TACTICAL CACHE
        </div>
        <div className="absolute bottom-8 right-8 text-red-500/40 font-mono text-xs tracking-widest text-right">
          ORBITAL RECON LOCK: PASS-14 +
        </div>
      </div>

      {/* Top Header: System Identity */}
      <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-mono font-black tracking-widest uppercase text-white flex items-center gap-2">
              <span>BASE: STRATEGIC WARFARE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/30 font-normal">
                SYSTEM BOOT
              </span>
            </h1>
            <p className="text-xs font-mono text-zinc-400 tracking-wider">
              PLANETARY DEFENSE NETWORK • VERSION 2.6-TACTICAL
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFading(true);
            setTimeout(onComplete, 300);
          }}
          className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          SKIP [ESC]
        </button>
      </div>

      {/* Centerpiece: Moving Military & Economic Value Telemetry Displays */}
      <div className="relative z-10 my-auto grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
        {/* MILITARY ASSET VALUE CARD */}
        <div className="relative p-6 rounded-2xl bg-zinc-900/80 border border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.15)] overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Shield className="w-4 h-4" />
              <span>GLOBAL MILITARY VALUE</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300">
              <Activity className="w-3 h-3 animate-pulse" />
              TACTICAL ACTIVE
            </span>
          </div>

          <div className="text-3xl md:text-5xl font-mono font-black text-red-100 tracking-tight mb-2 drop-shadow-[0_2px_12px_rgba(239,68,68,0.5)]">
            {militaryVal}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <div>
              <span className="block text-zinc-500 text-[9px] uppercase">Fortress Nodes</span>
              <span className="text-zinc-200 font-bold">21 Citadels</span>
            </div>
            <div>
              <span className="block text-zinc-500 text-[9px] uppercase">Active Wings</span>
              <span className="text-zinc-200 font-bold">1,840 Aircraft</span>
            </div>
            <div>
              <span className="block text-zinc-500 text-[9px] uppercase">Defense Grid</span>
              <span className="text-emerald-400 font-bold">99.8% Online</span>
            </div>
          </div>
        </div>

        {/* ECONOMIC VALUE CARD */}
        <div className="relative p-6 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>GLOBAL ECONOMIC VALUE</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              <Globe className="w-3 h-3" />
              WORLD LIQUIDITY
            </span>
          </div>

          <div className="text-3xl md:text-5xl font-mono font-black text-emerald-100 tracking-tight mb-2 drop-shadow-[0_2px_12px_rgba(16,185,129,0.5)]">
            {economicVal}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <div>
              <span className="block text-zinc-500 text-[9px] uppercase">Annual Output</span>
              <span className="text-zinc-200 font-bold">+$3.8T Growth</span>
            </div>
            <div>
              <span className="block text-zinc-500 text-[9px] uppercase">Treasury Reserves</span>
              <span className="text-zinc-200 font-bold">Gold / FX Index</span>
            </div>
            <div>
              <span className="block text-zinc-500 text-[9px] uppercase">Financial Stability</span>
              <span className="text-cyan-400 font-bold">AAA Sovereign</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Progress Bar, Stages & Animated Telemetry */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Telemetry Stage Line */}
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <Radio className="w-4 h-4 text-red-500 animate-spin [animation-duration:3s]" />
            <span className="text-zinc-400 font-semibold">{stageText}</span>
          </div>
          <span className="font-bold text-red-400 font-mono tracking-wider tabular-nums">
            {progress}%
          </span>
        </div>

        {/* High-Tech Animated Loading Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtext info */}
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2">
          <span>COORDINATE SAT ENGINE: PRELOAD COMPLETE</span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-red-400" />
            SECURE ENCRYPTED CLIENT ENVIRONMENT
          </span>
        </div>
      </div>
    </div>
  );
}
