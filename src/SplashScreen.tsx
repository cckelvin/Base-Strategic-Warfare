import React, { useEffect, useState } from 'react';
import {
  Flame,
  Shield,
  Crosshair,
  Zap,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const GAME_TIPS = [
    'TIP: Securing offshore oil rigs provides continuous fuel logistics to sustain heavy mechanized tank offensives.',
    'TIP: Launching intercontinental ballistic missiles requires radar targeting lock from regional Pentagon citadels.',
    'TIP: Fortify frontline infantry troop garrisons to repel hostile airborne paratrooper drops.',
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 seconds strictly as requested

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setTipIndex(0);
      } else if (pct < 70) {
        setTipIndex(1);
      } else {
        setTipIndex(2);
      }

      if (elapsed >= duration) {
        setProgress(100);
        clearInterval(interval);
        setFading(true);
        setTimeout(() => {
          onComplete();
        }, 300); // smooth transition when reaching 100%
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      id="game-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-zinc-950 text-white select-none overflow-hidden transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* =========================================================================
          DOMINATIONS-STYLE MULTI-IMAGE COMPOSITE (Troops, Oil Rig, Ballistic Missile)
          Mixed together with cinematic blend modes, fiery embers, and lighting
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* BACKGROUND BASE: Deep atmospheric smoke and war skies */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/70 to-zinc-900/90 z-10" />

        {/* 1. LEFT SECTION: OFFSHORE OIL RIG IN DRAMATIC SEAS */}
        <div className="absolute top-0 left-0 w-full md:w-3/5 h-full opacity-65 mix-blend-screen scale-105 animate-pulse [animation-duration:8s]">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85"
            alt="Strategic Offshore Oil Rig"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-125 saturate-120"
          />
          {/* Subtle orange flame flare overlay for oil rig burner flare */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
        </div>

        {/* 2. CENTER SECTION: COLOSSAL BALLISTIC MISSILE LAUNCHING WITH FIRE EXHAUST */}
        <div className="absolute top-0 left-1/4 right-1/4 w-full md:w-1/2 h-full mx-auto opacity-75 mix-blend-lighten pointer-events-none z-10 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1517976487504-59a1a051288c?auto=format&fit=crop&w=1600&q=85"
            alt="Hypersonic Ballistic Missile Launch"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-bottom filter contrast-135 brightness-110 saturate-140"
          />
          {/* Fire exhaust glow effect */}
          <div className="absolute bottom-12 w-96 h-96 bg-red-600/35 rounded-full blur-3xl" />
        </div>

        {/* 3. RIGHT / FOREGROUND: COMBAT TROOPS IN ACTION GEAR */}
        <div className="absolute bottom-0 right-0 w-full md:w-3/5 h-full opacity-70 mix-blend-screen pointer-events-none z-10">
          <img
            src="https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1600&q=85"
            alt="Tactical Assault Troops"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top filter contrast-125 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/80" />
        </div>

        {/* 4. OVERHEAD: FIGHTER JET STRIKE WINGS IN THE SKY */}
        <div className="absolute top-4 right-8 w-80 h-48 opacity-40 mix-blend-screen pointer-events-none z-10 hidden sm:block">
          <img
            src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
            alt="Combat Aircraft"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* War vignette, dramatic edge burn, and sparks */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-20 pointer-events-none" />

        {/* Floating golden/fiery particle embers */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <span className="absolute bottom-10 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping [animation-duration:2.5s]" />
          <span className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse [animation-duration:1.8s]" />
          <span className="absolute bottom-32 right-1/3 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c] animate-ping [animation-duration:3s]" />
          <span className="absolute bottom-16 right-1/4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d] animate-pulse [animation-duration:2s]" />
        </div>
      </div>

      {/* =========================================================================
          TOP HEADER: STUDIO & SKIP ACTION
         ========================================================================= */}
      <div className="relative z-30 flex items-center justify-between p-4 sm:p-6 md:p-8 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-600/30 border border-red-500/60 text-red-400 font-mono text-xs font-black">
            B
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-300 font-bold drop-shadow">
            DOMINATIONS WAR ENGINE
          </span>
        </div>

        <button
          onClick={() => {
            setFading(true);
            setTimeout(onComplete, 250);
          }}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-amber-500/40 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-amber-300 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
        >
          <span>SKIP</span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* =========================================================================
          CENTER HERO: DOMINATIONS-STYLE METALLIC GAME TITLE PLATE & EMBLEM
         ========================================================================= */}
      <div className="relative z-30 my-auto flex flex-col items-center justify-center text-center px-4 py-2">
        {/* Golden Military Crest Stars & Crossed Accents */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <span className="h-px w-6 sm:w-16 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
          <div className="flex items-center gap-1 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[9px] sm:text-xs font-mono font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              WORLD CONQUEST MMO
            </span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="h-px w-6 sm:w-16 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
        </div>

        {/* Big Game Title - Bold 3D Metallic / Gold Emboss styling */}
        <div className="relative">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase font-serif drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] leading-tight">
            <span className="bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent">
              BASE
            </span>
          </h1>

          <div className="text-xs sm:text-lg md:text-2xl font-mono font-black tracking-[0.2em] sm:tracking-[0.35em] text-red-500 uppercase drop-shadow-[0_2px_10px_rgba(239,68,68,0.9)] -mt-1 sm:-mt-2">
            STRATEGIC WARFARE
          </div>
        </div>

        {/* Visual asset indicators pill (Troops • Oil Rigs • Missiles) */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[9px] sm:text-xs font-mono font-bold">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 shadow-md flex items-center gap-1 sm:gap-1.5">
            <Crosshair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
            GROUND TROOPS
          </span>
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 shadow-md flex items-center gap-1 sm:gap-1.5">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            OFFSHORE OIL RIGS
          </span>
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-950/80 border border-blue-500/60 text-blue-300 shadow-md flex items-center gap-1 sm:gap-1.5">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
            BALLISTIC MISSILES
          </span>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM FOOTER: GAME TIPS & HEAVY GAME LOADING PROGRESS BAR
         ========================================================================= */}
      <div className="relative z-30 w-full max-w-2xl mx-auto px-4 pb-4 sm:px-6 sm:pb-8 flex flex-col gap-2 sm:gap-3 shrink-0">
        {/* Mobile Strategy Game Gameplay Tip */}
        <div className="p-2 sm:p-3 rounded-xl bg-black/75 border border-zinc-700/80 backdrop-blur-md shadow-2xl flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          </div>
          <p className="text-[10px] sm:text-xs font-mono text-zinc-300 line-clamp-2 leading-relaxed tracking-wide">
            {GAME_TIPS[tipIndex]}
          </p>
        </div>

        {/* Loading Progress Info & Percentage */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-amber-300">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate mr-2">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="tracking-wider uppercase truncate">
              {progress < 35
                ? 'MARSHALING ARMORED DIVISIONS & COMBAT TROOPS...'
                : progress < 70
                ? 'CALIBRATING OFFSHORE OIL RIG REFINERIES...'
                : 'SYNCHRONIZING BALLISTIC MISSILE SILOS...'}
            </span>
          </div>
          <span className="tabular-nums tracking-widest text-xs sm:text-sm text-amber-400 shrink-0">
            {progress}%
          </span>
        </div>

        {/* Ornate DomiNations-style Heavy Game Loading Bar with Gold/Crimson Glow */}
        <div className="relative w-full h-3 sm:h-4 sm:h-5 rounded-full p-0.5 bg-black/90 border-2 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.4)] overflow-hidden">
          {/* Inner animated gradient bar */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(234,179,8,0.9)] relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Gloss shine stripe */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent h-1/2" />
            {/* Animated glint traveling along bar */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-[move-glint_1.5s_infinite]" />
          </div>
        </div>

        {/* Tiny footer label */}
        <div className="text-center text-[9px] sm:text-[10px] font-mono text-zinc-400 tracking-wider">
          PLANETARY THEATER PRELOAD • READY FOR COMMAND IN 5 SECONDS
        </div>
      </div>
    </div>
  );
}
