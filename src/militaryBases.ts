export interface MilitaryUnit {
  id: string;
  name: string;
  count: number;
  type: 'infantry' | 'aircraft' | 'armor' | 'air-defense';
  code: string;
}

export interface BaseReport {
  id: string;
  timeAgo: string;
  type: 'urgent' | 'defense' | 'logistics' | 'intel';
  text: string;
}

export interface MilitaryBase {
  id: string;
  name: string;
  codeName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  lat: number;
  lng: number;
  dms: string;
  status: 'Operational' | 'Alert' | 'Fortified';
  reports: BaseReport[];
  units: MilitaryUnit[];
}

export const MILITARY_BASES: MilitaryBase[] = [
  {
    id: 'base-abk-nigeria',
    name: 'Sector-7 Strategic Outpost',
    codeName: 'FORWARD OPERATING BASE OMEGA',
    countryName: 'Nigeria',
    countryCode: 'NG',
    flagUrl: 'https://flagcdn.com/w80/ng.png',
    lat: 8.792833,
    lng: 7.394787,
    dms: `8°47'34.2"N 7°23'41.2"E`,
    status: 'Alert',
    reports: [
      {
        id: 'rep-1',
        timeAgo: '12m ago',
        type: 'urgent',
        text: 'We need air equipment and additional SAM interceptor batteries.',
      },
      {
        id: 'rep-2',
        timeAgo: '45m ago',
        type: 'defense',
        text: 'We repelled 20 drone strike heading for sector headquarters.',
      },
      {
        id: 'rep-3',
        timeAgo: '2h ago',
        type: 'logistics',
        text: 'Fuel pipeline supply secured along secondary highway perimeter.',
      },
      {
        id: 'rep-4',
        timeAgo: '5h ago',
        type: 'intel',
        text: 'Satellite radar scans identified unknown airborne telemetry 80km north.',
      },
    ],
    units: [
      { id: 'u-1', name: 'Troops', count: 200, type: 'infantry', code: 'INF-DIV-1' },
      { id: 'u-2', name: 'F-22 Raptor', count: 45, type: 'aircraft', code: 'STEALTH-AIR' },
      { id: 'u-3', name: 'F-117 Nighthawk', count: 6, type: 'aircraft', code: 'NIGHTHAWK' },
      { id: 'u-4', name: 'F-15 Strike Eagle', count: 57, type: 'aircraft', code: 'AIR-SUPREMACY' },
      { id: 'u-5', name: 'M1A2 Abrams', count: 32, type: 'armor', code: 'MAIN-BATTLE-TANK' },
      { id: 'u-6', name: 'Patriot PAC-3', count: 12, type: 'air-defense', code: 'SURFACE-AIR' },
    ],
  },
  {
    id: 'base-sahara-algeria',
    name: 'Fortress Citadel Sahara',
    codeName: 'DEEP DESERT COMMAND NEXUS',
    countryName: 'Algeria',
    countryCode: 'DZ',
    flagUrl: 'https://flagcdn.com/w80/dz.png',
    lat: 27.422378,
    lng: 2.752004,
    dms: `27°25'20.6"N 2°45'7.2"E`,
    status: 'Fortified',
    reports: [
      {
        id: 'rep-101',
        timeAgo: '8m ago',
        type: 'defense',
        text: 'Anti-air perimeter radars detected low-altitude radar anomalies.',
      },
      {
        id: 'rep-102',
        timeAgo: '30m ago',
        type: 'urgent',
        text: 'Thermal cooling towers operating at 94% threshold due to severe sandstorm.',
      },
      {
        id: 'rep-103',
        timeAgo: '1h ago',
        type: 'defense',
        text: 'Interception array intercepted 6 hostile reconnaissance quadcopters.',
      },
      {
        id: 'rep-104',
        timeAgo: '4h ago',
        type: 'intel',
        text: 'All ground patrol convoys checked in with zero perimeter breaches.',
      },
    ],
    units: [
      { id: 'u-101', name: 'Troops', count: 350, type: 'infantry', code: 'DESERT-GUARD' },
      { id: 'u-102', name: 'F-22 Raptor', count: 28, type: 'aircraft', code: 'STEALTH-AIR' },
      { id: 'u-103', name: 'F-117 Nighthawk', count: 8, type: 'aircraft', code: 'NIGHTHAWK' },
      { id: 'u-104', name: 'F-15 Strike Eagle', count: 42, type: 'aircraft', code: 'AIR-SUPREMACY' },
      { id: 'u-105', name: 'Leopard 2A7', count: 40, type: 'armor', code: 'HEAVY-ARMOR' },
      { id: 'u-106', name: 'Iron Dome Batteries', count: 8, type: 'air-defense', code: 'C-RAM-SHIELD' },
    ],
  },
];
