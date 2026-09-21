import React, { useState } from 'react';
import {
  X,
  Building2,
  TrendingUp,
  Shield,
  Search,
  Navigation,
  ExternalLink,
  DollarSign,
  Users,
} from 'lucide-react';
import { STRATEGIC_CITIES, StrategicCity } from './citiesData';

interface CitiesModalProps {
  onClose: () => void;
  onFlyToCity: (lat: number, lng: number, name: string) => void;
  onShowComingSoon: (message: string) => void;
}

export default function CitiesModal({
  onClose,
  onFlyToCity,
  onShowComingSoon,
}: CitiesModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<StrategicCity>(STRATEGIC_CITIES[0]);

  const filteredCities = STRATEGIC_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      id="strategic-cities-modal"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-700/60 text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold font-mono text-zinc-100 uppercase tracking-wide">
                Strategic World Megacity Hubs
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-900/40 text-cyan-300 border border-cyan-700/40">
                ECONOMIC & DEFENSE MATRIX
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Planetary urban centers, gross metropolitan product, population density & garrison grids
            </p>
          </div>
        </div>

        <button
          id="close-cities-modal-btn"
          onClick={onClose}
          aria-label="Close Cities Modal"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-mono font-semibold cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
          <span>CLOSE</span>
        </button>
      </header>

      {/* Main Content Two-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Column: Cities List & Search */}
        <div className="w-full md:w-5/12 border-r border-zinc-800 flex flex-col bg-zinc-950/60">
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search global megacity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {filteredCities.map((city) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <div
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={city.flagUrl}
                      alt={city.country}
                      className="w-7 h-5 object-cover rounded border border-zinc-700 shrink-0"
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-100 block">
                        {city.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">{city.country}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {city.economicOutput}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {city.defenseStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected City Detailed Telemetry Card */}
        <div className="w-full md:w-7/12 flex-1 p-6 md:p-8 overflow-y-auto bg-zinc-900/30 flex flex-col">
          <div className="max-w-xl mx-auto w-full flex flex-col gap-6 my-auto">
            {/* City Identity Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-8 rounded-lg border border-zinc-700 overflow-hidden shadow shrink-0">
                    <img
                      src={selectedCity.flagUrl}
                      alt={selectedCity.country}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-mono text-zinc-100 leading-none">
                      {selectedCity.name}
                    </h2>
                    <span className="text-xs font-mono text-zinc-400">{selectedCity.country}</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-cyan-400 font-semibold">
                  {selectedCity.lat.toFixed(2)}°, {selectedCity.lng.toFixed(2)}°
                </div>
              </div>

              {/* Economic & Defense Highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>ECONOMIC VALUE</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-100">
                    {selectedCity.economicOutput}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Gross Metro Product</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-bold mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>POPULATION</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-100">
                    {selectedCity.population}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Urban Density Census</span>
                </div>
              </div>

              <div className="mt-3 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono font-bold mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>DEFENSE & READINESS</span>
                </div>
                <div className="text-sm font-mono font-bold text-amber-300">
                  {selectedCity.militaryReadiness} • {selectedCity.defenseStatus}
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                  {selectedCity.description}
                </p>
              </div>

              {/* Fly To Action Button */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => onShowComingSoon(`Urban Garrison: ${selectedCity.name}`)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-300 border border-zinc-700 cursor-pointer"
                >
                  Garrison Forces
                </button>
                <button
                  id="fly-to-city-btn"
                  onClick={() => {
                    onFlyToCity(selectedCity.lat, selectedCity.lng, selectedCity.name);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>FLY CAMERA TO {selectedCity.name.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
