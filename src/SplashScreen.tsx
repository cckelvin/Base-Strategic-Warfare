import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const DROPBOX_SPLASH_URL =
  'https://www.dropbox.com/scl/fi/insbwhb4jrfbupauk50zt/1790089900467.png?rlkey=vdol8rxjxep1vwzjjnnbqhz0g&st=4gq71pfn&dl=1';

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fading, setFading] = useState(false);
  const [imgUrl, setImgUrl] = useState(DROPBOX_SPLASH_URL);

  const handleStart = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  useEffect(() => {
    const handleKeyDown = () => {
      handleStart();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fading]);

  return (
    <div
      id="game-splash-screen"
      onClick={handleStart}
      role="button"
      tabIndex={0}
      aria-label="Tap to enter game"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none overflow-hidden transition-opacity duration-300 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Exact user requested Dropbox splash image with no text */}
      <img
        src={imgUrl}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => {
          // If Dropbox direct link redirects or blocks, fallback to direct raw URL or cached asset
          if (imgUrl.includes('&dl=1')) {
            setImgUrl(
              'https://www.dropbox.com/scl/fi/insbwhb4jrfbupauk50zt/1790089900467.png?rlkey=vdol8rxjxep1vwzjjnnbqhz0g&st=4gq71pfn&raw=1'
            );
          } else if (!imgUrl.startsWith('/')) {
            setImgUrl('/1790089900467.png');
          }
        }}
        className="w-full h-full object-cover object-center pointer-events-none"
      />
    </div>
  );
}
