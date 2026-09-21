export type NotificationCategory = 'general' | 'nation' | 'military' | 'alliance' | 'external';
export type NotificationSeverity = 'critical' | 'alert' | 'info' | 'success';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  summary: string;
  detail: string;
  timestamp: string;
  timeAgo: string;
  severity: NotificationSeverity;
  source: string;
  countryCode?: string;
  flagUrl?: string;
  isRead?: boolean;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // MILITARY
  {
    id: 'notif-mil-1',
    category: 'military',
    title: 'Sector-7 FOB Repels Hostile Drone Wave',
    summary: 'Air defense interceptors neutralized 20 unmanned strike vectors heading for headquarters.',
    detail: 'Forward Operating Base Omega automated radar arrays detected multiple low-altitude quadcopters and fixed-wing strike drones at 02:40 UTC. All targets were engaged and destroyed by Patriot and Iron Shield interceptor batteries with zero perimeter breaches.',
    timestamp: '2026-09-21 02:45 UTC',
    timeAgo: '4m ago',
    severity: 'critical',
    source: 'THEATER DEFENSE COMMAND',
    countryCode: 'NG',
    flagUrl: 'https://flagcdn.com/w80/ng.png',
  },
  {
    id: 'notif-mil-2',
    category: 'military',
    title: 'F-22 & F-35 Stealth Wings Scrambled',
    summary: 'Strategic aerospace defense units initiated high-readiness alert patrols along trans-oceanic sectors.',
    detail: 'Apex Aerospace command deployed 2 squadrons of stealth interceptors following an unidentified airborne telemetry blip 80km off designated airspace. Target identified as uncrewed reconnaissance craft and turned away.',
    timestamp: '2026-09-21 02:22 UTC',
    timeAgo: '27m ago',
    severity: 'alert',
    source: 'AEROSPACE DEFENSE CORPS',
    countryCode: 'US',
    flagUrl: 'https://flagcdn.com/w80/us.png',
  },
  {
    id: 'notif-mil-3',
    category: 'military',
    title: 'Hypersonic Telemetry Proving Ground Test',
    summary: 'Mach 7.2 strategic test vehicle achieved precise trajectory telemetry over designated proving range.',
    detail: 'Naval and aerospace research divisions confirmed telemetry lock for 840 consecutive seconds. All ground telemetry and telemetry buoys returned 100% data integrity.',
    timestamp: '2026-09-21 01:15 UTC',
    timeAgo: '1h ago',
    severity: 'info',
    source: 'STRATEGIC ADVANCED WEAPONS WING',
    countryCode: 'CN',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
  },

  // NATION
  {
    id: 'notif-nat-1',
    category: 'nation',
    title: 'Domestic Defense Treasury Expands Liquidity',
    summary: 'National treasury reports +$18.4B allocation surge toward strategic fortification infrastructure.',
    detail: 'The Sovereign Defense Appropriations Board finalized the supplemental defense package. Capital reserves will reinforce frontline Pentagon-class fortress nodes and high-frequency radar links.',
    timestamp: '2026-09-21 02:30 UTC',
    timeAgo: '19m ago',
    severity: 'success',
    source: 'MINISTRY OF SOVEREIGN FINANCE',
    countryCode: 'US',
    flagUrl: 'https://flagcdn.com/w80/us.png',
  },
  {
    id: 'notif-nat-2',
    category: 'nation',
    title: 'Critical Infrastructure Cyber Shield Activated',
    summary: 'National power grid and communications backbone transitioned to EMP-hardened protocols.',
    detail: 'Department of Sovereign Cyber Security confirmed that all national civilian infrastructure nodes and military relays have synced encryption keys, preventing hostile electronic intrusion.',
    timestamp: '2026-09-21 01:40 UTC',
    timeAgo: '1h ago',
    severity: 'info',
    source: 'CYBER DEFENSE BUREAU',
    countryCode: 'GB',
    flagUrl: 'https://flagcdn.com/w80/gb.png',
  },
  {
    id: 'notif-nat-3',
    category: 'nation',
    title: 'Strategic Petroleum Reserves Stockpiled at 98%',
    summary: 'National subterranean fuel reservoirs have reached maximum threshold for extended operations.',
    detail: 'Pipeline logistics authorities report continuous supply flows across heavy armor logistics corridors, guaranteeing 180 days of sustained mechanized operations.',
    timestamp: '2026-09-20 23:50 UTC',
    timeAgo: '3h ago',
    severity: 'success',
    source: 'ENERGY & LOGISTICS ADMINISTRATION',
    countryCode: 'DZ',
    flagUrl: 'https://flagcdn.com/w80/dz.png',
  },

  // GENERAL
  {
    id: 'notif-gen-1',
    category: 'general',
    title: 'Global Geospatial Satellite Recon Synchronized',
    summary: 'Esri high-definition orbital telemetry completed planetary pass #14,802.',
    detail: 'All 64 global orbital reconnaissance satellites report continuous optical and synthetic aperture radar coverage. Surface terrain maps updated with sub-meter elevation grids.',
    timestamp: '2026-09-21 02:50 UTC',
    timeAgo: '2m ago',
    severity: 'info',
    source: 'ORBITAL SATELLITE COMMAND',
  },
  {
    id: 'notif-gen-2',
    category: 'general',
    title: 'World Maritime Shipping Corridors Re-Routed',
    summary: 'Civilian logistics vessels instructed to maintain 50nm clearance from active naval exercise zones.',
    detail: 'International Maritime Organization issued advisory notice regarding heightened readiness in Mediterranean, Red Sea, and Strait of Malacca transit zones.',
    timestamp: '2026-09-21 01:05 UTC',
    timeAgo: '2h ago',
    severity: 'alert',
    source: 'GLOBAL MARITIME COUNCIL',
  },
  {
    id: 'notif-gen-3',
    category: 'general',
    title: 'Coordinated UTC Theater Time Calibration',
    summary: 'Atomic clock network synced across all sovereign regional military headquarters.',
    detail: 'Master atomic oscillators in Geneva, Colorado Springs, and Tokyo verified synchronization within 0.000002ms, ensuring coordinated strike timing across global coordinates.',
    timestamp: '2026-09-20 22:00 UTC',
    timeAgo: '5h ago',
    severity: 'info',
    source: 'GLOBAL STANDARDS RECON',
  },

  // ALLIANCE
  {
    id: 'notif-all-1',
    category: 'alliance',
    title: 'Multinational Iron Shield Pact Ratified',
    summary: 'Tripartite air defense agreement guarantees instant reciprocal missile intercept assistance.',
    detail: 'Commanders from allied sectors signed the unified response protocol. In the event of ballistic or drone saturation, automated C-RAM and Patriot batteries will engage threats across mutual borders.',
    timestamp: '2026-09-21 02:10 UTC',
    timeAgo: '39m ago',
    severity: 'success',
    source: 'ALLIED HIGH COMMAND',
    countryCode: 'FR',
    flagUrl: 'https://flagcdn.com/w80/fr.png',
  },
  {
    id: 'notif-all-2',
    category: 'alliance',
    title: 'Joint Airfield Overflight Clearances Extended',
    summary: 'Allied bomber and logistics wings granted 24/7 unrestricted emergency staging privileges.',
    detail: '14 sovereign nations finalized reciprocal air corridors, slashing reaction times for strategic reinforcements from 6 hours to under 45 minutes.',
    timestamp: '2026-09-21 00:30 UTC',
    timeAgo: '2h ago',
    severity: 'info',
    source: 'COALITION AIR TRAFFIC HEADQUARTERS',
    countryCode: 'DE',
    flagUrl: 'https://flagcdn.com/w80/de.png',
  },
  {
    id: 'notif-all-3',
    category: 'alliance',
    title: 'Combined Frontier War Games Commencing',
    summary: 'Over 12,000 allied mechanized troops and 180 combat aircraft assemble for live-fire maneuvers.',
    detail: 'Exercise Northern Vanguard will test joint electronic warfare jamming, rapid pontoon river crossings, and distributed command continuity in cold-weather terrain.',
    timestamp: '2026-09-20 20:15 UTC',
    timeAgo: '7h ago',
    severity: 'alert',
    source: 'ALLIED JOINT READINESS TASKFORCE',
    countryCode: 'UA',
    flagUrl: 'https://flagcdn.com/w80/ua.png',
  },

  // EXTERNAL
  {
    id: 'notif-ext-1',
    category: 'external',
    title: 'Foreign Electronic Jamming Detected Near Bab-el-Mandeb',
    summary: 'Unattributed high-power RF disruption affecting commercial and military GPS telemetry.',
    detail: 'Ground listening posts in Djibouti and Yemen registered broadband microwave noise jamming. Allied signals intelligence units have triangulated the transmission to an unflagged coastal vessel.',
    timestamp: '2026-09-21 02:15 UTC',
    timeAgo: '34m ago',
    severity: 'critical',
    source: 'EXTERNAL SIGNALS INTEL UNIT',
    countryCode: 'EG',
    flagUrl: 'https://flagcdn.com/w80/eg.png',
  },
  {
    id: 'notif-ext-2',
    category: 'external',
    title: 'Unannounced Heavy Armor Movement Along Eastern Border',
    summary: 'Reconnaissance satellites identified 3 armored brigades redeploying closer to frontier lines.',
    detail: 'Thermal infrared orbital passes confirmed 240 main battle tanks and mobile artillery platforms positioned inside camouflaged forest assembly zones.',
    timestamp: '2026-09-21 01:25 UTC',
    timeAgo: '1h ago',
    severity: 'critical',
    source: 'SATELLITE RECON NETWORK',
    countryCode: 'RU',
    flagUrl: 'https://flagcdn.com/w80/ru.png',
  },
  {
    id: 'notif-ext-3',
    category: 'external',
    title: 'Global Cyber Strike Probes Neutralized',
    summary: 'Over 400,000 coordinated botnet queries deflected from sovereign defense command servers.',
    detail: 'Automated counter-intrusion honeypots traced the packet origin to distributed proxy clusters spanning three separate external jurisdictions.',
    timestamp: '2026-09-20 21:40 UTC',
    timeAgo: '5h ago',
    severity: 'alert',
    source: 'EXTERNAL THREAT TELEMETRY',
  },
];
