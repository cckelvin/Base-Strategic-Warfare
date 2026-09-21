import React, { useState } from 'react';
import {
  X,
  Shield,
  Activity,
  Sliders,
  Send,
  Plane,
  Users,
  Crosshair,
  AlertTriangle,
  Info,
  Radio,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { MilitaryBase, BaseReport } from './militaryBases';

interface BaseModalProps {
  base: MilitaryBase;
  onClose: () => void;
  onShowComingSoon: (message: string) => void;
}

export default function BaseModal({ base, onClose, onShowComingSoon }: BaseModalProps) {
  const [activeTab, setActiveTab] = useState<'updates' | 'control' | 'military'>('updates');
  const [reports, setReports] = useState<BaseReport[]>(base.reports);
  const [newUpdateInput, setNewUpdateInput] = useState('');

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateInput.trim()) return;

    const newReport: BaseReport = {
      id: `rep-${Date.now()}`,
      timeAgo: 'Just now',
      type: 'urgent',
      text: newUpdateInput.trim(),
    };

    setReports([newReport, ...reports]);
    setNewUpdateInput('');
  };

  const totalTroops = base.units.reduce((acc, u) => acc + u.count, 0);

  return (
    <div
      id="base-full-page-overlay"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* Top Bar with Name of Base & Country Flag */}
      <header
        id="base-header-bar"
        className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 shadow-md relative z-10"
      >
        <div className="flex items-center gap-3.5">
          {/* Country of ownership flag in front of base name */}
          <div
            id="base-country-flag"
            className="w-10 h-7 rounded shadow-sm border border-zinc-700/80 overflow-hidden flex items-center justify-center bg-black/40"
            title={`Country of Ownership: ${base.countryName}`}
          >
            <img
              src={base.flagUrl}
              alt={base.countryName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 id="base-title-name" className="text-lg font-bold font-mono tracking-wide text-zinc-100">
                {base.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {base.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="text-zinc-500">{base.codeName}</span>
              <span>•</span>
              <span className="text-zinc-400">{base.dms}</span>
              <span>•</span>
              <span className="text-zinc-500">OWNERSHIP: {base.countryName.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="close-base-modal-btn"
          onClick={onClose}
          aria-label="Close Base Command"
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Fixed Nav Notch Below Top Notch (updates, control, military) */}
      <nav
        id="base-nav-notch"
        className="w-full bg-zinc-900/60 border-b border-zinc-800/80 px-6 py-2 flex items-center justify-center relative z-10"
      >
        <div className="flex items-center p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl shadow-inner gap-1">
          <button
            id="tab-btn-updates"
            onClick={() => setActiveTab('updates')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'updates'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Updates</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'updates' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {reports.length}
            </span>
          </button>

          <button
            id="tab-btn-control"
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'control'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Control</span>
          </button>

          <button
            id="tab-btn-military"
            onClick={() => setActiveTab('military')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'military'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Military</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'military' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {base.units.length}
            </span>
          </button>
        </div>
      </nav>

      {/* Main Tab Content Viewport */}
      <div id="base-tab-content" className="flex-1 overflow-y-auto p-6 relative">
        {/* ================= UPDATES TAB ================= */}
        {activeTab === 'updates' && (
          <div id="updates-section" className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Intel dispatch input form */}
            <form
              onSubmit={handlePostUpdate}
              className="flex items-center gap-2 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-lg"
            >
              <Radio className="w-4 h-4 text-amber-400 ml-2 animate-pulse" />
              <input
                id="base-report-input"
                type="text"
                value={newUpdateInput}
                onChange={(e) => setNewUpdateInput(e.target.value)}
                placeholder="Transmit new tactical intelligence report or request to base..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit</span>
              </button>
            </form>

            {/* Reports List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Live SitRep & Incident Logs
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  AUTO-DECRYPTED REALTIME TELEMETRY
                </span>
              </div>

              {reports.map((report) => {
                let badgeColor = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
                let Icon = Info;
                if (report.type === 'urgent') {
                  badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
                  Icon = AlertTriangle;
                } else if (report.type === 'defense') {
                  badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                  Icon = Shield;
                } else if (report.type === 'intel') {
                  badgeColor = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
                  Icon = Crosshair;
                }

                return (
                  <div
                    key={report.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors shadow-sm"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 ${badgeColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                          {report.type} LOG
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span>{report.timeAgo}</span>
                        </div>
                      </div>
                      <p className="text-sm font-mono text-zinc-200 leading-relaxed">
                        "{report.text}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= CONTROL TAB ================= */}
        {activeTab === 'control' && (
          <div id="control-section" className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Defensive Grid Status
                </span>
                <span className="text-2xl font-mono font-bold text-emerald-400">OPTIMAL 98%</span>
                <p className="text-[11px] font-mono text-zinc-500">
                  Perimeter motion sensors and air-defense radars online.
                </p>
                <button
                  onClick={() => onShowComingSoon('Defensive Grid Diagnostic')}
                  className="mt-2 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 rounded-lg cursor-pointer transition-colors"
                >
                  Run Diagnostic
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Radar Jamming Countermeasures
                </span>
                <span className="text-2xl font-mono font-bold text-cyan-400">ACTIVE</span>
                <p className="text-[11px] font-mono text-zinc-500">
                  Electronic warfare sweep frequency 12.4 GHz.
                </p>
                <button
                  onClick={() => onShowComingSoon('Radar Jammer Calibration')}
                  className="mt-2 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 rounded-lg cursor-pointer transition-colors"
                >
                  Configure Jammer
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Base Alert Level
                </span>
                <span className="text-2xl font-mono font-bold text-amber-400">DEFCON 2</span>
                <p className="text-[11px] font-mono text-zinc-500">
                  All squadrons armed and standing by on immediate alert.
                </p>
                <button
                  onClick={() => onShowComingSoon('DEFCON Alert Protocol')}
                  className="mt-2 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 rounded-lg cursor-pointer transition-colors"
                >
                  Alter DEFCON
                </button>
              </div>
            </div>

            {/* Base command actions */}
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Strategic Base Directives
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onShowComingSoon('Emergency Air Intercept protocol')}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-mono text-zinc-300">Scramble QRA Jet Interceptors</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => onShowComingSoon('Reinforce Base Perimeter')}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-mono text-zinc-300">Reinforce Base Perimeter</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => onShowComingSoon('Fuel & Ammunition Resupply')}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-mono text-zinc-300">Fuel & Ammunition Resupply</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => onShowComingSoon('Fortification Protocol')}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-mono text-zinc-300">Upgrade Bunker Fortification</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MILITARY TAB ================= */}
        {activeTab === 'military' && (
          <div id="military-section" className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
            {/* Header info */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-200">
                  Garrison Deployment & Air Squadrons
                </h2>
                <p className="text-xs font-mono text-zinc-500">
                  Active military assets stationed at {base.name}
                </p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-right">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Deployed Assets</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{totalTroops} Active Units</span>
              </div>
            </div>

            {/* Floating Tabs / Unit Cards for military you have there */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {base.units.map((unit) => {
                let UnitIcon = Users;
                let colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

                if (unit.type === 'aircraft') {
                  UnitIcon = Plane;
                  colorClass = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
                } else if (unit.type === 'armor') {
                  UnitIcon = Shield;
                  colorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
                } else if (unit.type === 'air-defense') {
                  UnitIcon = Crosshair;
                  colorClass = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
                }

                return (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-zinc-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${colorClass}`}>
                        <UnitIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-mono text-zinc-100">{unit.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{unit.code}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                        {unit.count}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">Ready</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional tactical breakdown */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>Stationed Combat Readiness: 100% Operational</span>
              <span className="text-amber-400">All ammunition reserves verified</span>
            </div>
          </div>
        )}

        {/* Floating Button at bottom right of MILITARY section only saying 'Move' (coming soon) */}
        {activeTab === 'military' && (
          <div
            id="military-tab-move-container"
            className="fixed bottom-6 right-6 z-20"
          >
            <button
              id="military-move-btn"
              onClick={() => onShowComingSoon('Move military units')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-black text-sm uppercase tracking-widest shadow-[0_10px_25px_-3px_rgba(16,185,129,0.5)] border border-emerald-400/80 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span>MOVE</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
