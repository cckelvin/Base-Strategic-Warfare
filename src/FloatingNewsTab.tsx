import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Bell,
  Radio,
  ExternalLink,
  Shield,
  Flag,
  Users,
  Globe2,
  AlertTriangle,
} from 'lucide-react';
import { NotificationItem, NotificationCategory } from './notificationsData';

interface FloatingNewsTabProps {
  notifications: NotificationItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenFullNotifications: (category?: NotificationCategory) => void;
  extraCollapsedActions?: React.ReactNode;
}

export default function FloatingNewsTab({
  notifications,
  isCollapsed,
  onToggleCollapse,
  onOpenFullNotifications,
  extraCollapsedActions,
}: FloatingNewsTabProps) {
  // Category visual badge helper
  const getCategoryBadge = (cat: NotificationCategory) => {
    switch (cat) {
      case 'military':
        return { label: 'MILITARY', color: 'bg-red-950/80 text-red-400 border-red-700/60' };
      case 'nation':
        return { label: 'NATION', color: 'bg-blue-950/80 text-blue-400 border-blue-700/60' };
      case 'alliance':
        return { label: 'ALLIANCE', color: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60' };
      case 'external':
        return { label: 'EXTERNAL', color: 'bg-purple-950/80 text-purple-400 border-purple-700/60' };
      case 'general':
      default:
        return { label: 'GENERAL', color: 'bg-amber-950/80 text-amber-400 border-amber-700/60' };
    }
  };

  if (isCollapsed) {
    return (
      <div
        id="floating-news-tab-collapsed"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2"
      >
        <button
          id="expand-news-tab-btn"
          onClick={onToggleCollapse}
          title="Expand News & Updates"
          aria-label="Expand News & Updates"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-950/95 hover:bg-zinc-900 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer active:scale-95 group"
        >
          {/* Prominent White > icon as specified by user */}
          <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-600 flex items-center justify-center text-white group-hover:bg-red-700 transition-colors">
            <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-4 h-4 text-red-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
              News & Updates
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-600/30 text-red-400 text-[10px] font-mono border border-red-500/30 font-semibold">
              {notifications.length}
            </span>
          </div>
        </button>

        {/* Action button rendered only when collapsed, such as the CITIES button */}
        {extraCollapsedActions}
      </div>
    );
  }

  return (
    <aside
      id="floating-news-tab-expanded"
      aria-label="News and Updates Notifications"
      className="fixed bottom-4 left-4 z-40 w-72 sm:w-80 h-[430px] flex flex-col rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden animate-in slide-in-from-left-4 duration-250 select-none text-zinc-100"
    >
      {/* Header with White > / Collapse Toggle and Fullscreen Icon */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-zinc-800/90 bg-zinc-900/90">
        <div className="flex items-center gap-2">
          {/* White > Icon Collapse Button */}
          <button
            id="collapse-news-tab-btn"
            onClick={onToggleCollapse}
            title="Collapse News & Updates"
            aria-label="Collapse News"
            className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-red-700 border border-zinc-600 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-100">
              News & Updates
            </span>
          </div>
        </div>

        {/* Action to open Full Page Notifications */}
        <button
          id="open-full-notifications-btn"
          onClick={() => onOpenFullNotifications()}
          title="Open Full Notifications Screen"
          className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 cursor-pointer transition-colors"
        >
          <span>FULL VIEW</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Subheader category quick filters bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-zinc-800/60 bg-zinc-950/50 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onOpenFullNotifications('military')}
          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/60 shrink-0 cursor-pointer"
        >
          MILITARY
        </button>
        <button
          onClick={() => onOpenFullNotifications('nation')}
          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-950/70 hover:bg-blue-900 text-blue-300 border border-blue-800/60 shrink-0 cursor-pointer"
        >
          NATION
        </button>
        <button
          onClick={() => onOpenFullNotifications('alliance')}
          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 shrink-0 cursor-pointer"
        >
          ALLIANCE
        </button>
        <button
          onClick={() => onOpenFullNotifications('external')}
          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-800/60 shrink-0 cursor-pointer"
        >
          EXTERNAL
        </button>
        <button
          onClick={() => onOpenFullNotifications('general')}
          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/60 shrink-0 cursor-pointer"
        >
          GENERAL
        </button>
      </div>

      {/* Scrollable Notification Items List */}
      <div
        id="news-tab-notification-list"
        className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {notifications.slice(0, 8).map((item) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div
              key={item.id}
              onClick={() => onOpenFullNotifications(item.category)}
              className="p-2.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex flex-col gap-1.5 group shadow-sm"
            >
              {/* Notification Header: Category Pill, Time Ago, Severity Dot */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  {item.flagUrl && (
                    <img
                      src={item.flagUrl}
                      alt=""
                      className="w-3.5 h-2.5 object-cover rounded-xs border border-zinc-700"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-zinc-400">{item.timeAgo}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.severity === 'critical'
                        ? 'bg-red-500 animate-ping'
                        : item.severity === 'alert'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-mono font-bold text-zinc-100 group-hover:text-amber-300 leading-snug line-clamp-2 transition-colors">
                {item.title}
              </h4>

              {/* Summary */}
              <p className="text-[11px] font-mono text-zinc-400 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>

              {/* Source Footer */}
              <div className="text-[9px] font-mono text-zinc-500 uppercase flex items-center justify-between pt-1 border-t border-zinc-800/50">
                <span className="truncate max-w-[170px]">{item.source}</span>
                <span className="text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                  READ <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer banner */}
      <div className="p-2.5 bg-zinc-950 border-t border-zinc-800/90 text-center">
        <button
          onClick={() => onOpenFullNotifications()}
          className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-bold text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>OPEN NOTIFICATIONS HUB</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
