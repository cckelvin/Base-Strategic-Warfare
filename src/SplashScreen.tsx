import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  const handleStart = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  useEffect(() => {
    const onKeyDown = () => {
      handleStart();
    };

    const onClick = () => {
      handleStart();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onClick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onClick);
    };
  }, [fading]);

  return (
    <div
      id="game-splash-screen"
      onClick={handleStart}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none overflow-hidden transition-opacity duration-300 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Pure image display with no text whatsoever */}
      <img
        src="/1790089900467.png"
        alt=""
        onError={(e) => {
          // Fallback to Dropbox link if local fails
          (e.currentTarget as HTMLImageElement).src =
            'https://www.dropbox.com/scl/fi/insbwhb4jrfbupauk50zt/1790089900467.png?rlkey=vdol8rxjxep1vwzjjnnbqhz0g&st=4gq71pfn&dl=1';
        }}
        className="w-full h-full object-cover object-center pointer-events-none"
      />
    </div>
  );
}

