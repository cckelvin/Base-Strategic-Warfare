import React, { useState } from 'react';
import {
  X,
  Shield,
  Flag,
  Globe,
  Users,
  AlertOctagon,
  Search,
  CheckCheck,
  Filter,
  ChevronRight,
  Clock,
  Radio,
  ExternalLink,
} from 'lucide-react';
import {
  NotificationItem,
  NotificationCategory,
  INITIAL_NOTIFICATIONS,
} from './notificationsData';

interface NotificationsModalProps {
  initialCategory?: NotificationCategory;
  onClose: () => void;
  onShowComingSoon: (message: string) => void;
}

export default function NotificationsModal({
  initialCategory,
  onClose,
  onShowComingSoon,
}: NotificationsModalProps) {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(
    INITIAL_NOTIFICATIONS[0]?.id || null
  );

  // Filter notifications
  const filteredNotifications = notifications.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedItem =
    notifications.find((n) => n.id === selectedNotifId) || filteredNotifications[0];

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getCategoryTheme = (cat: NotificationCategory) => {
    switch (cat) {
      case 'military':
        return {
          label: 'MILITARY',
          color: 'text-red-400 bg-red-950/70 border-red-800/60',
          icon: Shield,
        };
      case 'nation':
        return {
          label: 'NATION',
          color: 'text-blue-400 bg-blue-950/70 border-blue-800/60',
          icon: Flag,
        };
      case 'alliance':
        return {
          label: 'ALLIANCE',
          color: 'text-emerald-400 bg-emerald-950/70 border-emerald-800/60',
          icon: Users,
        };
      case 'external':
        return {
          label: 'EXTERNAL',
          color: 'text-purple-400 bg-purple-950/70 border-purple-800/60',
          icon: AlertOctagon,
        };
      case 'general':
      default:
        return {
          label: 'GENERAL',
          color: 'text-amber-400 bg-amber-950/70 border-amber-800/60',
          icon: Globe,
        };
    }
  };

  return (
    <div
      id="full-notifications-page"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in duration-200"
    >
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950/70 border border-red-700/60 text-red-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold font-mono text-zinc-100 uppercase tracking-wide">
                Planetary Intelligence & Notifications Hub
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-900/40 text-red-300 border border-red-700/40">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Synchronized theater alerts across General, Nation, Military, Alliance & External vectors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllAsRead}
            title="Mark All as Read"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All Read</span>
          </button>

          <button
            id="close-notifications-modal-btn"
            onClick={onClose}
            aria-label="Close Notifications Page"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-mono font-semibold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>CLOSE</span>
          </button>
        </div>
      </header>

      {/* Categories Navigation Bar (Divided by General, Nation, Military, Alliance, External) */}
      <nav
        id="notification-categories-nav"
        className="flex items-center justify-between px-6 py-2 bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto gap-2"
      >
        <div className="flex items-center gap-2">
          {/* ALL */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-zinc-100 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <span>ALL</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
              {notifications.length}
            </span>
          </button>

          {/* GENERAL */}
          <button
            id="tab-notif-general"
            onClick={() => setActiveCategory('general')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'general'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/40'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GENERAL</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-amber-300">
              {notifications.filter((n) => n.category === 'general').length}
            </span>
          </button>

          {/* NATION */}
          <button
            id="tab-notif-nation"
            onClick={() => setActiveCategory('nation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'nation'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-400/80 hover:text-blue-300 hover:bg-blue-950/40'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>NATION</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-blue-300">
              {notifications.filter((n) => n.category === 'nation').length}
            </span>
          </button>

          {/* MILITARY */}
          <button
            id="tab-notif-military"
            onClick={() => setActiveCategory('military')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'military'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-red-400/80 hover:text-red-300 hover:bg-red-950/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>MILITARY</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-red-300">
              {notifications.filter((n) => n.category === 'military').length}
            </span>
          </button>

          {/* ALLIANCE */}
          <button
            id="tab-notif-alliance"
            onClick={() => setActiveCategory('alliance')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'alliance'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ALLIANCE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-emerald-300">
              {notifications.filter((n) => n.category === 'alliance').length}
            </span>
          </button>

          {/* EXTERNAL */}
          <button
            id="tab-notif-external"
            onClick={() => setActiveCategory('external')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'external'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-400/80 hover:text-purple-300 hover:bg-purple-950/40'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>EXTERNAL</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-purple-300">
              {notifications.filter((n) => n.category === 'external').length}
            </span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search intel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </nav>

      {/* Main Content Two-Column Layout (List on Left, Detailed Intel Briefing on Right) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Column: Notifications List */}
        <section
          aria-label="Notification List"
          className="w-full md:w-5/12 border-r border-zinc-800 flex flex-col overflow-y-auto p-4 gap-2.5 bg-zinc-950/60"
        >
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 font-mono text-xs">
              <Filter className="w-8 h-8 mb-2 opacity-40" />
              <span>No notifications found in this category</span>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const theme = getCategoryTheme(item.category);
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNotifId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-zinc-900 border-red-500/80 shadow-lg ring-1 ring-red-500/40'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${theme.color}`}
                      >
                        {theme.label}
                      </span>
                      {item.flagUrl && (
                        <img
                          src={item.flagUrl}
                          alt=""
                          className="w-4 h-3 object-cover rounded-xs border border-zinc-700"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] font-mono text-zinc-400">{item.timeAgo}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.severity === 'critical'
                            ? 'bg-red-500 animate-ping'
                            : item.severity === 'alert'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                  </div>

                  <h3
                    className={`text-xs font-mono font-bold leading-snug ${
                      isSelected ? 'text-amber-300' : 'text-zinc-200'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-[11px] font-mono text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1.5 border-t border-zinc-800/50">
                    <span className="uppercase truncate">{item.source}</span>
                    <span className="text-zinc-400 flex items-center">
                      VIEW INTEL <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Right Column: Detailed Strategic Briefing Card */}
        <section
          aria-label="Detailed Intelligence Briefing"
          className="w-full md:w-7/12 flex-1 p-6 md:p-8 overflow-y-auto bg-zinc-900/30 flex flex-col"
        >
          {selectedItem ? (
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
              {/* Strategic Header */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                        getCategoryTheme(selectedItem.category).color
                      }`}
                    >
                      {getCategoryTheme(selectedItem.category).label} INTEL
                    </span>
                    {selectedItem.countryCode && (
                      <span className="text-xs font-mono text-zinc-400">
                        SECTOR: {selectedItem.countryCode}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{selectedItem.timestamp}</span>
                </div>

                <h2 className="text-lg md:text-xl font-mono font-bold text-zinc-100 leading-snug">
                  {selectedItem.title}
                </h2>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    EXECUTIVE SUMMARY
                  </span>
                  {selectedItem.summary}
                </div>
              </div>

              {/* In-depth Telemetry Report */}
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Strategic Telemetry & Tactical Context</span>
                </span>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-line">
                  {selectedItem.detail}
                </p>

                <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Source Authority</span>
                    <span className="text-zinc-200 font-bold">{selectedItem.source}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Classification</span>
                    <span className="text-amber-400 font-bold">SOVEREIGN THEATER EYE ONLY</span>
                  </div>
                </div>
              </div>

              {/* Actionable Directives */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-200 block">
                    Strategic Protocol Response
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Acknowledge receipt or alert garrisoned regional wings
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onShowComingSoon('Acknowledged Intel Receipt')}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-200 border border-zinc-700 cursor-pointer"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => onShowComingSoon('Dispatch Defense Reconnaissance')}
                    className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-xs font-mono font-semibold text-white shadow-md cursor-pointer"
                  >
                    Dispatch Orders
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center font-mono text-zinc-500 text-xs">
              Select a notification from the left list to view detailed telemetry.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
