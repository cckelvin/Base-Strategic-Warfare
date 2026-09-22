import React, { useEffect, useState } from 'react';
import { ChevronRight, Shield, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fading, setFading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleStart = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  useEffect(() => {
    // Enable interactive start immediately
    setIsReady(true);

    const onKeyDown = () => {
      handleStart();
    };

    const onClick = () => {
      handleStart();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onClick);

    // Auto-advance after 8 seconds if idle
    const autoTimer = setTimeout(() => {
      handleStart();
    }, 8000);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onClick);
      clearTimeout(autoTimer);
    };
  }, [fading]);

  return (
    <div
      id="game-splash-screen"
      onClick={handleStart}
      className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-black text-white select-none overflow-hidden transition-all duration-500 cursor-pointer ${
        fading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* =========================================================================
          EXACT SPLASH SCREEN ARTWORK (1790089900467.png)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/1790089900467.png"
          alt="Base: Strategic Warfare"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-110"
        />

        {/* Ambient atmospheric war vignette & subtle lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />

        {/* Dynamic ember sparks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute bottom-16 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping [animation-duration:2.5s]" />
          <span className="absolute bottom-28 left-1/3 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse [animation-duration:1.8s]" />
          <span className="absolute bottom-36 right-1/3 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c] animate-ping [animation-duration:3s]" />
          <span className="absolute bottom-20 right-1/4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d] animate-pulse [animation-duration:2s]" />
        </div>
      </div>

      {/* TOP BAR / QUICK SKIP */}
      <div className="relative z-30 flex items-center justify-between p-4 sm:p-6 md:p-8 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/60 text-amber-400 font-mono text-xs font-black shadow-lg">
            B
          </span>
          <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-300 font-bold drop-shadow">
            STRATEGIC THEATER MMO
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStart();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-amber-500/50 text-xs font-mono font-bold tracking-wider text-amber-300 hover:text-white transition-all cursor-pointer shadow-xl backdrop-blur-md"
        >
          <span>ENTER THEATER</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CENTER METALLIC TITLE & SUBTITLE OVERLAY */}
      <div className="relative z-30 my-auto flex flex-col items-center justify-center text-center px-4 py-6 max-w-4xl mx-auto pointer-events-none">
        {/* Accent Star Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
          <div className="flex items-center gap-1.5 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-mono font-black tracking-[0.25em] uppercase text-amber-300">
              GLOBAL COMMAND HEADQUARTERS
            </span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
        </div>

        {/* Exact Game Title: BASE: STRATEGIC WARFARE */}
        <div className="relative flex flex-col items-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase font-serif drop-shadow-[0_10px_25px_rgba(0,0,0,1)] leading-none">
            <span className="bg-gradient-to-b from-zinc-100 via-amber-200 to-amber-600 bg-clip-text text-transparent">
              BASE:
            </span>
          </h1>

          <div className="text-xl sm:text-3xl md:text-5xl font-mono font-black tracking-[0.15em] sm:tracking-[0.25em] text-amber-400 uppercase drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)] mt-1 sm:mt-2">
            STRATEGIC WARFARE
          </div>
        </div>

        {/* Subtitle matching the visual: DOMINATE THE FRONTLINE. MANAGE THE ECONOMY. SECURE VICTORY. */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 px-4 py-1.5 rounded-lg bg-black/60 border border-zinc-800/80 backdrop-blur-sm max-w-2xl">
          <p className="text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-wider sm:tracking-widest uppercase text-zinc-300 text-center">
            DOMINATE THE FRONTLINE. MANAGE THE ECONOMY. SECURE VICTORY.
          </p>
        </div>
      </div>

      {/* BOTTOM FOOTER: EXACT "PRESS ANY BUTTON TO START" PROMPT */}
      <div className="relative z-30 w-full max-w-md mx-auto px-4 pb-8 sm:pb-12 flex flex-col items-center gap-3 shrink-0">
        <div className="animate-pulse flex flex-col items-center gap-1.5">
          <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600/30 via-amber-500/40 to-amber-600/30 border border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-md">
            <span className="text-xs sm:text-sm md:text-base font-mono font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              PRESS ANY BUTTON TO START
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase mt-1">
            CLICK ANYWHERE OR PRESS ANY KEY
          </span>
        </div>
      </div>
    </div>
  );
}
