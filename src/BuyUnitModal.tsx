import React, { useState } from 'react';
import { MilitaryBase, deployUnitsToBase } from './militaryBases';
import { X, Shield, Plus, Minus, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

export interface UnitToBuy {
  id: string;
  name: string;
  price: number;
  category: 'aircraft' | 'armor' | 'air-defense' | 'infantry';
  unitType: string;
  imageUrl?: string;
  unitCode?: string;
}

interface BuyUnitModalProps {
  unit: UnitToBuy;
  money: number;
  userBases: MilitaryBase[];
  onDeductMoney: (amount: number) => void;
  onAddNotification: (title: string, message: string) => void;
  onBasesUpdated?: (updatedBases: MilitaryBase[]) => void;
  onClose: () => void;
}

export const BuyUnitModal: React.FC<BuyUnitModalProps> = ({
  unit,
  money,
  userBases,
  onDeductMoney,
  onAddNotification,
  onBasesUpdated,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(1);
  const [selectedBaseId, setSelectedBaseId] = useState<string>(() => {
    // Default to sovereign capital base, or first available user base
    const capital = userBases.find((b) => b.isCapital);
    return capital ? capital.id : userBases[0]?.id || '';
  });

  const totalCost = unit.price * Math.max(1, amount);
  const canAfford = money >= totalCost;
  const selectedBase = userBases.find((b) => b.id === selectedBaseId) || userBases[0];

  const handleAmountChange = (val: number) => {
    const safeVal = Math.max(1, Math.min(9999, isNaN(val) ? 1 : val));
    setAmount(safeVal);
  };

  const handleConfirmPurchase = () => {
    if (!canAfford) {
      alert(`Insufficient funds. Total cost is $${totalCost.toLocaleString()}, but treasury has $${money.toLocaleString()}.`);
      return;
    }
    if (!selectedBase) {
      alert('Please select a military base to send units to.');
      return;
    }

    // Deduct funds
    onDeductMoney(totalCost);

    // Deploy units to selected base
    const updated = deployUnitsToBase(
      selectedBase.id,
      unit.name,
      amount,
      unit.category,
      unit.unitCode
    );

    if (onBasesUpdated) {
      onBasesUpdated(updated);
    }

    // Notification
    onAddNotification(
      'Weapons Purchased & Deployed',
      `Successfully purchased ${amount}x ${unit.name} for $${totalCost.toLocaleString()}. Deployed to ${selectedBase.name}.`
    );

    onClose();
  };

  return (
    <div
      id="buy-unit-floating-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      {/* Floating circle-edged box tab popup */}
      <div
        id="buy-unit-popup-card"
        className="relative w-full max-w-lg bg-zinc-950 border-2 border-zinc-700/80 rounded-[32px] p-6 sm:p-7 shadow-2xl overflow-hidden font-mono text-zinc-100 space-y-5"
      >
        {/* Subtle unit image in popup background tinted black */}
        {unit.imageUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
            <img
              src={unit.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-zinc-950/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 space-y-5">
          {/* Top Row: Name at Left Top, Price per one at Right Top */}
          <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
            {/* Left Top: Unit Name & Type */}
            <div className="text-left pr-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
                {unit.unitType}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-wide leading-tight">
                {unit.name}
              </h3>
            </div>

            {/* Right Top: Price Per One in Amount & Close button */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                  Price Per One
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-400 font-mono block">
                  ${unit.price.toLocaleString()}
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Cancel purchase"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Input Box for Amount to Purchase */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>Amount to Purchase</span>
                <span className="text-zinc-500 text-[10px]">(Units)</span>
              </label>
              <span className="text-[11px] text-zinc-400">
                Unit Cost: ${(unit.price / 1e6).toFixed(2)}M
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAmountChange(amount - 1)}
                className="w-12 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold flex items-center justify-center text-lg cursor-pointer transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                id="buy-amount-input"
                type="number"
                min="1"
                max="9999"
                value={amount}
                onChange={(e) => handleAmountChange(parseInt(e.target.value, 10))}
                className="flex-1 h-12 bg-zinc-900/90 border border-zinc-700 focus:border-emerald-500 rounded-2xl text-center text-xl font-black text-white font-mono outline-none shadow-inner"
              />

              <button
                type="button"
                onClick={() => handleAmountChange(amount + 1)}
                className="w-12 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold flex items-center justify-center text-lg cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 5, 10, 20, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`flex-1 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    amount === preset
                      ? 'bg-zinc-700 text-white border border-zinc-500'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Below Amount: Select Base to Send Units */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Base to Send Units</span>
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">
                {userBases.length} Bases Available
              </span>
            </div>

            <div className="relative">
              <select
                id="select-base-dropdown"
                value={selectedBaseId}
                onChange={(e) => setSelectedBaseId(e.target.value)}
                className="w-full py-3 px-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-xs font-mono text-zinc-100 outline-none focus:border-emerald-500 cursor-pointer shadow-inner appearance-none"
              >
                {userBases.map((base) => {
                  const designation = base.isCapital
                    ? '★ Capital HQ'
                    : base.isConstructed
                    ? 'Expansion Redoubt'
                    : 'Seized Base';
                  return (
                    <option key={base.id} value={base.id} className="bg-zinc-950 text-white py-1">
                      {base.countryName} - {base.name} [{designation}]
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                ▼
              </div>
            </div>

            {/* Selected Base Destination Details */}
            {selectedBase && (
              <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedBase.flagUrl}
                    alt=""
                    className="w-5 h-3.5 rounded object-cover shadow"
                  />
                  <div>
                    <div className="text-zinc-200 font-bold">{selectedBase.name}</div>
                    <div className="text-zinc-400 text-[10px]">
                      Sector: {selectedBase.dms} • {selectedBase.status}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 text-[10px]">
                    Current Units: {selectedBase.units.reduce((acc, u) => acc + u.count, 0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Treasury Status & Cost Preview */}
          <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div className="text-zinc-400 text-[11px]">Total Requisition Cost:</div>
              <div className="text-base font-black text-amber-400 font-mono">
                ${totalCost.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-zinc-400 text-[11px]">Homeland Treasury:</div>
              <div className={`text-base font-black font-mono ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                ${money.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Purchase Button: A green red button with the total amount written */}
          <div className="pt-2">
            <button
              id="confirm-purchase-btn"
              onClick={handleConfirmPurchase}
              disabled={!canAfford}
              className={`w-full py-4 px-6 rounded-2xl font-mono font-black text-sm tracking-wider uppercase cursor-pointer transition-all duration-200 shadow-2xl flex items-center justify-between text-white ${
                canAfford
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-red-600 hover:from-emerald-500 hover:to-red-500 border-2 border-emerald-400/60 hover:border-red-400 active:scale-[0.99] shadow-red-950/40'
                  : 'bg-zinc-800 border-2 border-zinc-700 text-zinc-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 border border-white animate-pulse" />
                <span className="font-bold">PURCHASE WEAPONS</span>
              </div>

              {/* Total amount written directly on the button */}
              <div className="flex items-center gap-2 bg-black/40 py-1.5 px-3.5 rounded-xl border border-white/20">
                <span className="text-[11px] text-zinc-300 font-normal">TOTAL:</span>
                <span className="text-base font-mono font-black text-white">
                  ${totalCost.toLocaleString()}
                </span>
              </div>
            </button>

            {!canAfford && (
              <p className="text-center text-[11px] text-red-400 pt-2 font-mono">
                Insufficient national reserves. Need ${(totalCost - money).toLocaleString()} more.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
