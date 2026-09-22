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
  Flag,
  Swords,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { STRATEGIC_CITIES, StrategicCity } from './citiesData';
import { CountryFlag } from './countries';

interface CitiesModalProps {
  userCountry: CountryFlag;
  occupiedCityIds: string[];
  onToggleOccupyCity: (cityId: string) => void;
  onClose: () => void;
  onFlyToCity: (lat: number, lng: number, name: string) => void;
  onShowComingSoon: (message: string) => void;
}

export default function CitiesModal({
  userCountry,
  occupiedCityIds,
  onToggleOccupyCity,
  onClose,
  onFlyToCity,
  onShowComingSoon,
}: CitiesModalProps) {
  const [activeTab, setActiveTab] = useState<'my-and-occupied' | 'radar'>('my-and-occupied');
  const [search, setSearch] = useState('');

  // FILTER REQUIREMENT: In the main section, ONLY your country's cities OR occupied cities can be viewed!
  const viewableCities = STRATEGIC_CITIES.filter((c) => {
    const isSovereign = c.countryCode === userCountry.code;
    const isOccupied = occupiedCityIds.includes(c.id);
    return isSovereign || isOccupied;
  });

  const foreignRadarCities = STRATEGIC_CITIES.filter((c) => {
    return c.countryCode !== userCountry.code && !occupiedCityIds.includes(c.id);
  });

  const displayedList = activeTab === 'my-and-occupied'
    ? viewableCities.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase())
      )
    : foreignRadarCities.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase())
      );

  const [selectedCity, setSelectedCity] = useState<StrategicCity>(() => {
    return viewableCities[0] || STRATEGIC_CITIES[0];
  });

  const isSelectedSovereign = selectedCity.countryCode === userCountry.code;
  const isSelectedOccupied = occupiedCityIds.includes(selectedCity.id);

  return (
    <div
      id="strategic-cities-modal"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-4 bg-zinc-900/90 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-950/70 border border-cyan-700/60 text-cyan-400 shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-mono text-zinc-100 uppercase tracking-wide">
                Megacity Hubs
              </h1>
              <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-cyan-900/40 text-cyan-300 border border-cyan-700/40">
                SOVEREIGN & OCCUPIED ONLY
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-mono text-zinc-400 hidden sm:block">
              Restricted tactical municipal telemetry: Only your sovereign nation (<span className="text-cyan-300">{userCountry.name}</span>) and military-occupied cities are accessible in this sector.
            </p>
          </div>
        </div>

        <button
          id="close-cities-modal-btn"
          onClick={onClose}
          aria-label="Close Cities Modal"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-mono font-semibold cursor-pointer transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>CLOSE</span>
        </button>
      </header>

      {/* Mode Navigation Tabs */}
      <div className="px-3 sm:px-6 py-2 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('my-and-occupied');
              if (viewableCities.length > 0) setSelectedCity(viewableCities[0]);
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'my-and-occupied'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Sovereign & Occupied Cities ({viewableCities.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('radar');
              if (foreignRadarCities.length > 0) setSelectedCity(foreignRadarCities[0]);
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-lg'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Occupation Expedition Radar ({foreignRadarCities.length})</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 hidden md:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sovereign Flag: {userCountry.name} ({userCountry.code})</span>
        </div>
      </div>

      {/* Main Content Two-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Column: Cities List & Search */}
        <div className="w-full h-48 sm:h-64 md:h-full md:w-5/12 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col bg-zinc-950/60 shrink-0 md:shrink">
          <div className="p-2 sm:p-3 border-b border-zinc-800 bg-zinc-900/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'my-and-occupied'
                    ? `Search ${userCountry.name} or occupied cities...`
                    : 'Search foreign cities to target for occupation...'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
            {displayedList.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-zinc-500 space-y-2 my-auto">
                <AlertTriangle className="w-6 h-6 text-zinc-600 mx-auto" />
                <p>
                  {activeTab === 'my-and-occupied'
                    ? `No cities in ${userCountry.name} or occupied territories match your search.`
                    : 'No foreign cities match your search.'}
                </p>
                {activeTab === 'my-and-occupied' && occupiedCityIds.length === 0 && (
                  <p className="text-zinc-600 text-[10px]">
                    Tip: Switch to "Occupation Expedition Radar" to deploy troops and occupy foreign megacities!
                  </p>
                )}
              </div>
            ) : (
              displayedList.map((city) => {
                const isSelected = selectedCity.id === city.id;
                const isSovereign = city.countryCode === userCountry.code;
                const isOccupied = occupiedCityIds.includes(city.id);

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
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-zinc-100 block">
                            {city.name}
                          </span>
                          {isSovereign ? (
                            <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                              SOVEREIGN
                            </span>
                          ) : isOccupied ? (
                            <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-red-950 text-red-300 border border-red-700/60 uppercase animate-pulse">
                              OCCUPIED
                            </span>
                          ) : (
                            <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-zinc-800 text-zinc-400 uppercase">
                              FOREIGN
                            </span>
                          )}
                        </div>
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
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected City Detailed Telemetry Card */}
        <div className="w-full md:w-7/12 flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-zinc-900/30 flex flex-col">
          <div className="max-w-xl mx-auto w-full flex flex-col gap-4 sm:gap-6 my-auto">
            {/* City Identity Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-8 rounded-lg border border-zinc-700 overflow-hidden shadow shrink-0">
                    <img
                      src={selectedCity.flagUrl}
                      alt={selectedCity.country}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-xl font-bold font-mono text-zinc-100">
                        {selectedCity.name}
                      </h2>
                      {isSelectedSovereign && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-900/50 text-cyan-300 border border-cyan-700/60 font-bold uppercase">
                          SOVEREIGN CAPITAL/HUB
                        </span>
                      )}
                      {isSelectedOccupied && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-red-900/50 text-red-300 border border-red-700/60 font-bold uppercase animate-pulse">
                          OCCUPIED SECTOR
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{selectedCity.country}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Occupation Toggle Button */}
                  {!isSelectedSovereign && (
                    <button
                      onClick={() => onToggleOccupyCity(selectedCity.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelectedOccupied
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/60'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/60'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>{isSelectedOccupied ? 'WITHDRAW GARRISON' : 'OCCUPY CITY'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onFlyToCity(selectedCity.lat, selectedCity.lng, selectedCity.name);
                      onClose();
                    }}
                    title="Focus Satellite Camera on City"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>LOCATE</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-4 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs font-mono">
                {isSelectedSovereign ? (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Sovereign Metropolitan District: Fully integrated with national treasury and civil defense network.</span>
                  </div>
                ) : isSelectedOccupied ? (
                  <div className="flex items-center gap-2 text-red-400">
                    <Swords className="w-4 h-4 shrink-0 animate-pulse" />
                    <span>Occupied Territory: Tactical forces maintain martial law. Municipal revenues diverted to your war chest.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Foreign Territory: Classified under defense perimeter. Launch an occupation expedition to annex into your viewable cities roster.</span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>METRO GDP</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {selectedCity.economicOutput}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mb-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>POPULATION</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-zinc-200">
                    {selectedCity.population}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mb-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>DEFENSE STATUS</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-amber-300">
                    {selectedCity.defenseStatus}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>READINESS</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-purple-300">
                    {selectedCity.militaryReadiness}
                  </span>
                </div>
              </div>

              {/* Coordinates & Description */}
              <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono text-zinc-300">
                <div className="text-[10px] text-zinc-500 mb-1">
                  PLANETARY COORDINATES: {selectedCity.lat.toFixed(4)}° N, {selectedCity.lng.toFixed(4)}° E
                </div>
                <p className="leading-relaxed">{selectedCity.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
