export interface MilitaryUnit {
  id: string;
  name: string;
  count: number;
  type: 'infantry' | 'aircraft' | 'armor' | 'air-defense' | 'missile' | 'naval';
  code: string;
}

export type MilitaryCategory = 'all' | 'air' | 'missile' | 'armor' | 'air-defense' | 'infantry';

export function getUnitCategory(unit: MilitaryUnit): 'air' | 'missile' | 'armor' | 'air-defense' | 'infantry' {
  const n = unit.name.toLowerCase();
  const t = unit.type;
  if (
    t === 'missile' ||
    n.includes('missile') ||
    n.includes('rocket') ||
    n.includes('tomahawk') ||
    n.includes('kalibr') ||
    n.includes('atacms') ||
    n.includes('iskander') ||
    n.includes('salvo')
  ) {
    return 'missile';
  }
  if (
    t === 'aircraft' ||
    n.includes('fighter') ||
    n.includes('air') ||
    n.includes('jet') ||
    n.includes('bomber') ||
    n.includes('plane') ||
    n.includes('drone') ||
    n.includes('f-35') ||
    n.includes('su-57') ||
    n.includes('helicopter')
  ) {
    return 'air';
  }
  if (
    t === 'air-defense' ||
    n.includes('defense') ||
    n.includes('sam') ||
    n.includes('patriot') ||
    n.includes('s-400') ||
    n.includes('radar') ||
    n.includes('ciws') ||
    n.includes('shield') ||
    n.includes('launcher')
  ) {
    return 'air-defense';
  }
  if (
    t === 'armor' ||
    n.includes('tank') ||
    n.includes('armor') ||
    n.includes('ifv') ||
    n.includes('apc') ||
    n.includes('abrams') ||
    n.includes('leopard') ||
    n.includes('t-90')
  ) {
    return 'armor';
  }
  return 'infantry';
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
  isCapital?: boolean;
  isConstructed?: boolean;
  region?: string;
}

/**
 * CAPITAL MILITARY BASES
 * Rule: All countries have exactly 1 base located in their capital city only.
 */
export const CAPITAL_MILITARY_BASES: MilitaryBase[] = [
  {
    id: 'base-us-capital',
    name: 'Pentagon National Military Command Bastion',
    codeName: 'APEX AEROSPACE BASTION',
    countryName: 'United States',
    countryCode: 'US',
    flagUrl: 'https://flagcdn.com/w80/us.png',
    lat: 38.8719,
    lng: -77.0563,
    dms: `38°52'18.8"N 77°03'22.7"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-us-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-us-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-us-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-us-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-us-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-us-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ca-capital',
    name: 'Ottawa National Defense Citadel',
    codeName: 'MAPLE GUARDIAN CITADEL',
    countryName: 'Canada',
    countryCode: 'CA',
    flagUrl: 'https://flagcdn.com/w80/ca.png',
    lat: 45.4215,
    lng: -75.6972,
    dms: `45°25'17.4"N 75°41'50.0"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ca-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ca-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ca-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ca-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ca-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ca-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-mx-capital',
    name: 'Mexico City Joint Operations Citadel',
    codeName: 'AZTEC SHIELD COMMAND',
    countryName: 'Mexico',
    countryCode: 'MX',
    flagUrl: 'https://flagcdn.com/w80/mx.png',
    lat: 19.4326,
    lng: -99.1332,
    dms: `19°25'57.4"N 99°07'59.5"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-mx-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-mx-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-mx-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-mx-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-mx-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-mx-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-cu-capital',
    name: 'Havana Strategic Defense Redoubt',
    codeName: 'CARIBBEAN IRON NEXUS',
    countryName: 'Cuba',
    countryCode: 'CU',
    flagUrl: 'https://flagcdn.com/w80/cu.png',
    lat: 23.1136,
    lng: -82.3666,
    dms: `23°06'49.0"N 82°21'59.8"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-cu-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-cu-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-cu-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-cu-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-cu-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-cu-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-pa-capital',
    name: 'Panama Canal Defense Citadel',
    codeName: 'ISTHMUS GLOBAL GUARDIAN',
    countryName: 'Panama',
    countryCode: 'PA',
    flagUrl: 'https://flagcdn.com/w80/pa.png',
    lat: 8.9824,
    lng: -79.5199,
    dms: `08°58'56.6"N 79°31'11.6"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-pa-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-pa-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-pa-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-pa-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-pa-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-pa-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-br-capital',
    name: 'Brasília National Defense Command Base',
    codeName: 'CENTRAL DEFENSE REDOUBT',
    countryName: 'Brazil',
    countryCode: 'BR',
    flagUrl: 'https://flagcdn.com/w80/br.png',
    lat: -15.7975,
    lng: -47.8919,
    dms: `15°47'51.0"S 47°53'30.8"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-br-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-br-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-br-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-br-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-br-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-br-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ar-capital',
    name: 'Buenos Aires Joint Strategic Citadel',
    codeName: 'PAMPAS DEFENSE SHIELD',
    countryName: 'Argentina',
    countryCode: 'AR',
    flagUrl: 'https://flagcdn.com/w80/ar.png',
    lat: -34.6037,
    lng: -58.3816,
    dms: `34°36'13.3"S 58°22'53.8"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ar-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ar-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ar-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ar-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ar-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ar-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-co-capital',
    name: 'Bogotá Strategic Aerospace Redoubt',
    codeName: 'ANDES GUARDIAN CITADEL',
    countryName: 'Colombia',
    countryCode: 'CO',
    flagUrl: 'https://flagcdn.com/w80/co.png',
    lat: 4.711,
    lng: -74.0721,
    dms: `04°42'39.6"N 74°04'19.6"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-co-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-co-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-co-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-co-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-co-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-co-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-cl-capital',
    name: 'Santiago Andean Defense Bastion',
    codeName: 'PACIFIC SOUTHERN SHIELD',
    countryName: 'Chile',
    countryCode: 'CL',
    flagUrl: 'https://flagcdn.com/w80/cl.png',
    lat: -33.4489,
    lng: -70.6693,
    dms: `33°26'56.0"S 70°40'09.5"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-cl-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-cl-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-cl-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-cl-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-cl-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-cl-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-pe-capital',
    name: 'Lima Coastal Defense Citadel',
    codeName: 'SUN CITADEL REDOUBT',
    countryName: 'Peru',
    countryCode: 'PE',
    flagUrl: 'https://flagcdn.com/w80/pe.png',
    lat: -12.0464,
    lng: -77.0428,
    dms: `12°02'47.0"S 77°02'34.1"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-pe-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-pe-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-pe-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-pe-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-pe-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-pe-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ve-capital',
    name: 'Caracas Northern Command Bastion',
    codeName: 'AVILA FORTRESS COMMAND',
    countryName: 'Venezuela',
    countryCode: 'VE',
    flagUrl: 'https://flagcdn.com/w80/ve.png',
    lat: 10.4806,
    lng: -66.9036,
    dms: `10°28'50.2"N 66°54'13.0"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ve-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ve-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ve-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ve-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ve-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ve-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-gb-capital',
    name: 'London Admiralty Joint Command Bastion',
    codeName: 'WHITEHALL DEFENSE CITADEL',
    countryName: 'United Kingdom',
    countryCode: 'GB',
    flagUrl: 'https://flagcdn.com/w80/gb.png',
    lat: 51.5074,
    lng: -0.1278,
    dms: `51°30'26.6"N 00°07'40.1"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-gb-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-gb-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-gb-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-gb-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-gb-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-gb-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-fr-capital',
    name: 'Paris Balard Hexagon Defense Nexus',
    codeName: 'HEXAGONE NATIONAL BASTION',
    countryName: 'France',
    countryCode: 'FR',
    flagUrl: 'https://flagcdn.com/w80/fr.png',
    lat: 48.8566,
    lng: 2.3522,
    dms: `48°51'23.8"N 02°21'07.9"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-fr-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-fr-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-fr-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-fr-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-fr-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-fr-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-de-capital',
    name: 'Berlin Bendlerblock National Redoubt',
    codeName: 'BRANDENBURG DEFENSE NEXUS',
    countryName: 'Germany',
    countryCode: 'DE',
    flagUrl: 'https://flagcdn.com/w80/de.png',
    lat: 52.52,
    lng: 13.405,
    dms: `52°31'12.0"N 13°24'18.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-de-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-de-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-de-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-de-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-de-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-de-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-it-capital',
    name: 'Rome Joint Operations Citadel',
    codeName: 'CAPITOLINE CENTURION BASTION',
    countryName: 'Italy',
    countryCode: 'IT',
    flagUrl: 'https://flagcdn.com/w80/it.png',
    lat: 41.9028,
    lng: 12.4964,
    dms: `41°54'10.1"N 12°29'47.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-it-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-it-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-it-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-it-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-it-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-it-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-es-capital',
    name: 'Madrid National Defense Bastion',
    codeName: 'IBERIAN CITADEL SHIELD',
    countryName: 'Spain',
    countryCode: 'ES',
    flagUrl: 'https://flagcdn.com/w80/es.png',
    lat: 40.4168,
    lng: -3.7038,
    dms: `40°25'00.5"N 03°42'13.7"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-es-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-es-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-es-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-es-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-es-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-es-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ua-capital',
    name: 'Kyiv Dnieper Shield Bastion',
    codeName: 'TRIDENT STEEL BASTION',
    countryName: 'Ukraine',
    countryCode: 'UA',
    flagUrl: 'https://flagcdn.com/w80/ua.png',
    lat: 50.4501,
    lng: 30.5234,
    dms: `50°27'00.4"N 30°31'24.2"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ua-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ua-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ua-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ua-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ua-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ua-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-pl-capital',
    name: 'Warsaw Citadel Central Redoubt',
    codeName: 'WHITE EAGLE CITADEL',
    countryName: 'Poland',
    countryCode: 'PL',
    flagUrl: 'https://flagcdn.com/w80/pl.png',
    lat: 52.2297,
    lng: 21.0122,
    dms: `52°13'46.9"N 21°00'43.9"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-pl-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-pl-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-pl-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-pl-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-pl-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-pl-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-nl-capital',
    name: 'Amsterdam Maritime Shield Citadel',
    codeName: 'NORTH SEA FORTRESS COMMAND',
    countryName: 'Netherlands',
    countryCode: 'NL',
    flagUrl: 'https://flagcdn.com/w80/nl.png',
    lat: 52.3676,
    lng: 4.9041,
    dms: `52°22'03.4"N 04°54'14.8"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-nl-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-nl-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-nl-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-nl-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-nl-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-nl-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-se-capital',
    name: 'Stockholm Baltic Defense Bastion',
    codeName: 'TRE KRONOR CITADEL',
    countryName: 'Sweden',
    countryCode: 'SE',
    flagUrl: 'https://flagcdn.com/w80/se.png',
    lat: 59.3293,
    lng: 18.0686,
    dms: `59°19'45.5"N 18°04'07.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-se-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-se-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-se-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-se-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-se-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-se-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-no-capital',
    name: 'Oslo Fjord Joint Operations Redoubt',
    codeName: 'VIKING SHIELD CITADEL',
    countryName: 'Norway',
    countryCode: 'NO',
    flagUrl: 'https://flagcdn.com/w80/no.png',
    lat: 59.9139,
    lng: 10.7522,
    dms: `59°54'50.0"N 10°45'07.9"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-no-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-no-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-no-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-no-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-no-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-no-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-fi-capital',
    name: 'Helsinki Arctic Defense Bastion',
    codeName: 'KARELIAN FORTRESS NEXUS',
    countryName: 'Finland',
    countryCode: 'FI',
    flagUrl: 'https://flagcdn.com/w80/fi.png',
    lat: 60.1699,
    lng: 24.9384,
    dms: `60°10'11.6"N 24°56'18.2"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-fi-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-fi-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-fi-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-fi-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-fi-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-fi-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ch-capital',
    name: 'Bern Alpine Defense Redoubt',
    codeName: 'GOTTHARD NATIONAL CITADEL',
    countryName: 'Switzerland',
    countryCode: 'CH',
    flagUrl: 'https://flagcdn.com/w80/ch.png',
    lat: 46.948,
    lng: 7.4474,
    dms: `46°56'52.8"N 07°26'50.6"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ch-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ch-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ch-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ch-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ch-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ch-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-gr-capital',
    name: 'Athens Aegean Joint Command Citadel',
    codeName: 'HELLENIC OLYMPUS SHIELD',
    countryName: 'Greece',
    countryCode: 'GR',
    flagUrl: 'https://flagcdn.com/w80/gr.png',
    lat: 37.9838,
    lng: 23.7275,
    dms: `37°59'01.7"N 23°43'39.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-gr-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-gr-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-gr-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-gr-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-gr-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-gr-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-pt-capital',
    name: 'Lisbon Atlantic Maritime Bastion',
    codeName: 'TAGUS GUARDIAN REDOUBT',
    countryName: 'Portugal',
    countryCode: 'PT',
    flagUrl: 'https://flagcdn.com/w80/pt.png',
    lat: 38.7223,
    lng: -9.1393,
    dms: `38°43'20.3"N 09°08'21.5"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-pt-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-pt-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-pt-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-pt-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-pt-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-pt-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ro-capital',
    name: 'Bucharest Eastern Shield Citadel',
    codeName: 'CARPATHIAN SENTINEL NEXUS',
    countryName: 'Romania',
    countryCode: 'RO',
    flagUrl: 'https://flagcdn.com/w80/ro.png',
    lat: 44.4268,
    lng: 26.1025,
    dms: `44°25'36.5"N 26°06'09.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ro-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ro-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ro-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ro-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ro-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ro-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-be-capital',
    name: 'Brussels Allied Defense Nexus',
    codeName: 'EUROPEAN NEXUS CITADEL',
    countryName: 'Belgium',
    countryCode: 'BE',
    flagUrl: 'https://flagcdn.com/w80/be.png',
    lat: 50.8503,
    lng: 4.3517,
    dms: `50°51'01.1"N 04°21'06.1"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-be-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-be-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-be-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-be-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-be-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-be-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-at-capital',
    name: 'Vienna Danube Strategic Redoubt',
    codeName: 'DANUBE CITADEL SHIELD',
    countryName: 'Austria',
    countryCode: 'AT',
    flagUrl: 'https://flagcdn.com/w80/at.png',
    lat: 48.2082,
    lng: 16.3738,
    dms: `48°12'29.5"N 16°22'25.7"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-at-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-at-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-at-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-at-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-at-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-at-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-cz-capital',
    name: 'Prague Central Defense Bastion',
    codeName: 'BOHEMIAN IRON SENTINEL',
    countryName: 'Czech Republic',
    countryCode: 'CZ',
    flagUrl: 'https://flagcdn.com/w80/cz.png',
    lat: 50.0755,
    lng: 14.4378,
    dms: `50°04'31.8"N 14°26'16.1"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-cz-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-cz-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-cz-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-cz-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-cz-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-cz-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ru-capital',
    name: 'Moscow National Defense Control Center',
    codeName: 'KREMLIN IRON NEXUS',
    countryName: 'Russia',
    countryCode: 'RU',
    flagUrl: 'https://flagcdn.com/w80/ru.png',
    lat: 55.7558,
    lng: 37.6173,
    dms: `55°45'20.9"N 37°37'02.3"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ru-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ru-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ru-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ru-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ru-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ru-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-tr-capital',
    name: 'Ankara Anatolian Citadel',
    codeName: 'ANATOLIAN CRESCENT SHIELD',
    countryName: 'Turkey',
    countryCode: 'TR',
    flagUrl: 'https://flagcdn.com/w80/tr.png',
    lat: 39.9334,
    lng: 32.8597,
    dms: `39°56'00.2"N 32°51'34.9"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-tr-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-tr-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-tr-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-tr-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-tr-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-tr-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-il-capital',
    name: 'Jerusalem HaKirya Defense Bastion',
    codeName: 'IRON DOME STRATEGIC NEXUS',
    countryName: 'Israel',
    countryCode: 'IL',
    flagUrl: 'https://flagcdn.com/w80/il.png',
    lat: 31.7683,
    lng: 35.2137,
    dms: `31°46'05.9"N 35°12'49.3"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-il-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-il-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-il-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-il-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-il-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-il-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-sa-capital',
    name: 'Riyadh Royal Military Command Bastion',
    codeName: 'DESERT FALCON CITADEL',
    countryName: 'Saudi Arabia',
    countryCode: 'SA',
    flagUrl: 'https://flagcdn.com/w80/sa.png',
    lat: 24.7136,
    lng: 46.6753,
    dms: `24°42'49.0"N 46°40'31.1"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-sa-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-sa-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-sa-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-sa-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-sa-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-sa-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ir-capital',
    name: 'Tehran Central Defense Redoubt',
    codeName: 'ZAGROS LION CITADEL',
    countryName: 'Iran',
    countryCode: 'IR',
    flagUrl: 'https://flagcdn.com/w80/ir.png',
    lat: 35.6892,
    lng: 51.389,
    dms: `35°41'21.1"N 51°23'20.4"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ir-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ir-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ir-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ir-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ir-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ir-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ae-capital',
    name: 'Abu Dhabi Gulf Defense Citadel',
    codeName: 'ARABIAN FALCON BASTION',
    countryName: 'United Arab Emirates',
    countryCode: 'AE',
    flagUrl: 'https://flagcdn.com/w80/ae.png',
    lat: 24.4539,
    lng: 54.3773,
    dms: `24°27'14.0"N 54°22'38.3"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ae-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ae-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ae-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ae-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ae-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ae-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-qa-capital',
    name: 'Doha Al Udeid Strategic Nexus',
    codeName: 'PERSIAN GULF SENTINEL',
    countryName: 'Qatar',
    countryCode: 'QA',
    flagUrl: 'https://flagcdn.com/w80/qa.png',
    lat: 25.2854,
    lng: 51.531,
    dms: `25°17'07.4"N 51°31'51.6"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-qa-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-qa-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-qa-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-qa-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-qa-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-qa-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-iq-capital',
    name: 'Baghdad Central Joint Redoubt',
    codeName: 'MESOPOTAMIAN CITADEL',
    countryName: 'Iraq',
    countryCode: 'IQ',
    flagUrl: 'https://flagcdn.com/w80/iq.png',
    lat: 33.3152,
    lng: 44.3661,
    dms: `33°18'54.7"N 44°21'58.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-iq-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-iq-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-iq-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-iq-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-iq-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-iq-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-kz-capital',
    name: 'Astana Central Military Command Bastion',
    codeName: 'STEPPE GOLDEN EAGLE',
    countryName: 'Kazakhstan',
    countryCode: 'KZ',
    flagUrl: 'https://flagcdn.com/w80/kz.png',
    lat: 51.1694,
    lng: 71.4491,
    dms: `51°10'09.8"N 71°26'56.8"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-kz-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-kz-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-kz-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-kz-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-kz-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-kz-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-cn-capital',
    name: 'Beijing Central Military Commission Citadel',
    codeName: 'DRAGON SOVEREIGN SHIELD',
    countryName: 'China',
    countryCode: 'CN',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
    lat: 39.9042,
    lng: 116.4074,
    dms: `39°54'15.1"N 116°24'26.6"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-cn-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-cn-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-cn-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-cn-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-cn-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-cn-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-jp-capital',
    name: 'Tokyo Ichigaya Joint Defense Complex',
    codeName: 'RISING SUN CITADEL',
    countryName: 'Japan',
    countryCode: 'JP',
    flagUrl: 'https://flagcdn.com/w80/jp.png',
    lat: 35.6762,
    lng: 139.6503,
    dms: `35°40'34.3"N 139°39'01.1"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-jp-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-jp-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-jp-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-jp-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-jp-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-jp-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-in-capital',
    name: 'New Delhi Integrated Defense Headquarters',
    codeName: 'GOLDEN CHAKRA BASTION',
    countryName: 'India',
    countryCode: 'IN',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    lat: 28.6139,
    lng: 77.209,
    dms: `28°36'50.0"N 77°12'32.4"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-in-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-in-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-in-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-in-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-in-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-in-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-kr-capital',
    name: 'Seoul Capital Defense Command',
    codeName: 'TIGER SHIELD CITADEL',
    countryName: 'South Korea',
    countryCode: 'KR',
    flagUrl: 'https://flagcdn.com/w80/kr.png',
    lat: 37.5665,
    lng: 126.978,
    dms: `37°33'59.4"N 126°58'40.8"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-kr-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-kr-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-kr-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-kr-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-kr-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-kr-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-kp-capital',
    name: 'Pyongyang Central Military Bastion',
    codeName: 'CHONGLUNG IRON FORTRESS',
    countryName: 'North Korea',
    countryCode: 'KP',
    flagUrl: 'https://flagcdn.com/w80/kp.png',
    lat: 39.0392,
    lng: 125.7625,
    dms: `39°02'21.1"N 125°45'45.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-kp-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-kp-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-kp-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-kp-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-kp-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-kp-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-pk-capital',
    name: 'Islamabad Joint Staff Citadel',
    codeName: 'HIMALAYAN FALCON BASTION',
    countryName: 'Pakistan',
    countryCode: 'PK',
    flagUrl: 'https://flagcdn.com/w80/pk.png',
    lat: 33.6844,
    lng: 73.0479,
    dms: `33°41'03.8"N 73°02'52.4"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-pk-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-pk-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-pk-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-pk-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-pk-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-pk-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-id-capital',
    name: 'Jakarta Strategic Command Bastion',
    codeName: 'GARUDA ARCHIPELAGO SHIELD',
    countryName: 'Indonesia',
    countryCode: 'ID',
    flagUrl: 'https://flagcdn.com/w80/id.png',
    lat: -6.2088,
    lng: 106.8456,
    dms: `06°12'31.7"S 106°50'44.2"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-id-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-id-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-id-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-id-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-id-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-id-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-vn-capital',
    name: 'Hanoi Ba Dinh Defense Nexus',
    codeName: 'RED RIVER DRAGON BASTION',
    countryName: 'Vietnam',
    countryCode: 'VN',
    flagUrl: 'https://flagcdn.com/w80/vn.png',
    lat: 21.0285,
    lng: 105.8542,
    dms: `21°01'42.6"N 105°51'15.1"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-vn-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-vn-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-vn-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-vn-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-vn-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-vn-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ph-capital',
    name: 'Manila Camp Aguinaldo Citadel',
    codeName: 'PACIFIC PEARL REDOUBT',
    countryName: 'Philippines',
    countryCode: 'PH',
    flagUrl: 'https://flagcdn.com/w80/ph.png',
    lat: 14.5995,
    lng: 120.9842,
    dms: `14°35'58.2"N 120°59'03.1"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ph-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ph-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ph-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ph-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ph-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ph-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-th-capital',
    name: 'Bangkok Royal Defense Citadel',
    codeName: 'SIAM EMERALD BASTION',
    countryName: 'Thailand',
    countryCode: 'TH',
    flagUrl: 'https://flagcdn.com/w80/th.png',
    lat: 13.7563,
    lng: 100.5018,
    dms: `13°45'22.7"N 100°30'06.5"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-th-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-th-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-th-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-th-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-th-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-th-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-sg-capital',
    name: 'Singapore MINDEF Integrated Redoubt',
    codeName: 'MALACCA LION BASTION',
    countryName: 'Singapore',
    countryCode: 'SG',
    flagUrl: 'https://flagcdn.com/w80/sg.png',
    lat: 1.3521,
    lng: 103.8198,
    dms: `01°21'07.6"N 103°49'11.3"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-sg-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-sg-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-sg-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-sg-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-sg-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-sg-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-my-capital',
    name: 'Kuala Lumpur Wisma Pertahanan Bastion',
    codeName: 'MALAYAN TIGER CITADEL',
    countryName: 'Malaysia',
    countryCode: 'MY',
    flagUrl: 'https://flagcdn.com/w80/my.png',
    lat: 3.139,
    lng: 101.6869,
    dms: `03°08'20.4"N 101°41'12.8"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-my-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-my-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-my-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-my-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-my-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-my-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-tw-capital',
    name: 'Taipei Dazhi Command Complex',
    codeName: 'FORMOSA SENTINEL SHIELD',
    countryName: 'Taiwan',
    countryCode: 'TW',
    flagUrl: 'https://flagcdn.com/w80/tw.png',
    lat: 25.033,
    lng: 121.5654,
    dms: `25°01'58.8"N 121°33'55.4"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-tw-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-tw-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-tw-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-tw-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-tw-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-tw-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-au-capital',
    name: 'Canberra Joint Operations Command',
    codeName: 'SOUTHERN CROSS CITADEL',
    countryName: 'Australia',
    countryCode: 'AU',
    flagUrl: 'https://flagcdn.com/w80/au.png',
    lat: -35.2809,
    lng: 149.13,
    dms: `35°16'51.2"S 149°07'48.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-au-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-au-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-au-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-au-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-au-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-au-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-nz-capital',
    name: 'Wellington Trentham Defense Bastion',
    codeName: 'PACIFIC SILVER FERN REDOUBT',
    countryName: 'New Zealand',
    countryCode: 'NZ',
    flagUrl: 'https://flagcdn.com/w80/nz.png',
    lat: -41.2865,
    lng: 174.7762,
    dms: `41°17'11.4"S 174°46'34.3"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-nz-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-nz-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-nz-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-nz-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-nz-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-nz-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ng-capital',
    name: 'Abuja National Defense Headquarters',
    codeName: 'SECTOR-7 EAGLE BASTION',
    countryName: 'Nigeria',
    countryCode: 'NG',
    flagUrl: 'https://flagcdn.com/w80/ng.png',
    lat: 9.0765,
    lng: 7.3986,
    dms: `09°04'35.4"N 07°23'55.0"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ng-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ng-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ng-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ng-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ng-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ng-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-za-capital',
    name: 'Pretoria Thaba Tshwane Defense Bastion',
    codeName: 'PROTEA SOUTHERN SHIELD',
    countryName: 'South Africa',
    countryCode: 'ZA',
    flagUrl: 'https://flagcdn.com/w80/za.png',
    lat: -25.7479,
    lng: 28.2293,
    dms: `25°44'52.4"S 28°13'45.5"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-za-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-za-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-za-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-za-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-za-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-za-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-eg-capital',
    name: 'Cairo Octagon Defense Nexus',
    codeName: 'OCTAGON PHARAOH NEXUS',
    countryName: 'Egypt',
    countryCode: 'EG',
    flagUrl: 'https://flagcdn.com/w80/eg.png',
    lat: 30.0444,
    lng: 31.2357,
    dms: `30°02'39.8"N 31°14'08.5"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-eg-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-eg-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-eg-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-eg-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-eg-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-eg-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-dz-capital',
    name: 'Algiers Tagarins Defense Citadel',
    codeName: 'MEDITERRANEAN ATLAS CITADEL',
    countryName: 'Algeria',
    countryCode: 'DZ',
    flagUrl: 'https://flagcdn.com/w80/dz.png',
    lat: 36.7538,
    lng: 3.0588,
    dms: `36°45'13.7"N 03°03'31.7"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-dz-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-dz-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-dz-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-dz-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-dz-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-dz-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ma-capital',
    name: 'Rabat Royal Armed Forces Citadel',
    codeName: 'ATLAS LION CITADEL',
    countryName: 'Morocco',
    countryCode: 'MA',
    flagUrl: 'https://flagcdn.com/w80/ma.png',
    lat: 34.0209,
    lng: -6.8416,
    dms: `34°01'15.2"N 06°50'29.8"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ma-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ma-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ma-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ma-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ma-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ma-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-ke-capital',
    name: 'Nairobi Defense Forces Redoubt',
    codeName: 'GREAT RIFT GUARDIAN',
    countryName: 'Kenya',
    countryCode: 'KE',
    flagUrl: 'https://flagcdn.com/w80/ke.png',
    lat: -1.2921,
    lng: 36.8219,
    dms: `01°17'31.6"S 36°49'18.8"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-ke-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-ke-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-ke-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-ke-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-ke-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-ke-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-et-capital',
    name: 'Addis Ababa Defense Citadel',
    codeName: 'HORN OF AFRICA BASTION',
    countryName: 'Ethiopia',
    countryCode: 'ET',
    flagUrl: 'https://flagcdn.com/w80/et.png',
    lat: 9.032,
    lng: 38.7469,
    dms: `09°01'55.2"N 38°44'48.8"E`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-et-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-et-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-et-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-et-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-et-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-et-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
  {
    id: 'base-gh-capital',
    name: 'Accra Burma Camp Defense Bastion',
    codeName: 'GOLD COAST SENTINEL',
    countryName: 'Ghana',
    countryCode: 'GH',
    flagUrl: 'https://flagcdn.com/w80/gh.png',
    lat: 5.6037,
    lng: -0.187,
    dms: `05°36'13.3"N 00°11'13.2"W`,
    status: 'Fortified',
    isCapital: true,
    reports: [
      { id: 'rep-gh-1', timeAgo: '5m ago', type: 'defense', text: 'National capital defense early-warning array active at DEFCON-1.' },
      { id: 'rep-gh-2', timeAgo: '28m ago', type: 'intel', text: 'Integrated aerospace and territorial defense perimeter confirmed secure.' }
    ],
    units: [
      { id: 'u-gh-1', name: 'Elite Guard Troops', count: 2500, type: 'infantry', code: 'CAPITAL-GARRISON' },
      { id: 'u-gh-2', name: 'Air Superiority Fighters', count: 54, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-gh-3', name: 'Main Battle Tanks', count: 68, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-gh-4', name: 'Air Defense Battery', count: 14, type: 'air-defense', code: 'SHIELD-NET' }
    ]
  },
];

const STORAGE_KEY_CONSTRUCTED = 'base_warfare_constructed_bases';

/**
 * Retrieve sovereign bases constructed by the nation in other parts of their land.
 */
export function getConstructedBases(): MilitaryBase[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONSTRUCTED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a newly commissioned base constructed in sovereign territory.
 */
export function saveConstructedBase(base: MilitaryBase): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const current = getConstructedBases();
  const filtered = current.filter((b) => b.id !== base.id);
  filtered.push({ ...base, isConstructed: true });
  localStorage.setItem(STORAGE_KEY_CONSTRUCTED, JSON.stringify(filtered));
  MILITARY_BASES = getAllMilitaryBases();
}

/**
 * Remove or decommission a constructed base.
 */
export function deleteConstructedBase(id: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const current = getConstructedBases();
  const filtered = current.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY_CONSTRUCTED, JSON.stringify(filtered));
  MILITARY_BASES = getAllMilitaryBases();
}

const STORAGE_KEY_BASE_GARRISON_OVERRIDES = 'base_warfare_garrison_overrides';

/**
 * Retrieve custom garrison reinforcements deployed to bases.
 */
export function getBaseGarrisonOverrides(): Record<string, { units: MilitaryUnit[]; reports?: BaseReport[] }> {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BASE_GARRISON_OVERRIDES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Deploy newly purchased military weapons/units directly into a selected base's garrison.
 */
export function deployUnitsToBase(
  baseId: string,
  unitName: string,
  count: number,
  category: 'infantry' | 'aircraft' | 'armor' | 'air-defense',
  unitCode?: string
): MilitaryBase[] {
  if (typeof window === 'undefined' || !window.localStorage) return getAllMilitaryBases();

  const overrides = getBaseGarrisonOverrides();
  const allCurrent = getAllMilitaryBases();
  const targetBase = allCurrent.find((b) => b.id === baseId);
  if (!targetBase) return allCurrent;

  const currentUnits: MilitaryUnit[] = overrides[baseId]?.units
    ? [...overrides[baseId].units]
    : [...targetBase.units];

  const code = unitCode || `${unitName.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase()}-CORPS`;
  const existingIndex = currentUnits.findIndex(
    (u) => u.name.toLowerCase() === unitName.toLowerCase() || (unitCode && u.code === unitCode)
  );

  if (existingIndex >= 0) {
    currentUnits[existingIndex] = {
      ...currentUnits[existingIndex],
      count: currentUnits[existingIndex].count + count,
    };
  } else {
    currentUnits.push({
      id: `unit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: unitName,
      count: count,
      type: category,
      code,
    });
  }

  const currentReports: BaseReport[] = overrides[baseId]?.reports
    ? [...overrides[baseId].reports]
    : [...targetBase.reports];

  currentReports.unshift({
    id: `rep-${Date.now()}`,
    timeAgo: 'Just now',
    type: 'logistics',
    text: `Reinforcements deployed: +${count}x ${unitName} stationed to defense perimeter.`,
  });

  overrides[baseId] = {
    units: currentUnits,
    reports: currentReports.slice(0, 10),
  };

  localStorage.setItem(STORAGE_KEY_BASE_GARRISON_OVERRIDES, JSON.stringify(overrides));

  // If it's a constructed base, sync to constructed bases as well
  const constructed = getConstructedBases();
  const cIndex = constructed.findIndex((b) => b.id === baseId);
  if (cIndex >= 0) {
    constructed[cIndex] = {
      ...constructed[cIndex],
      units: currentUnits,
      reports: currentReports.slice(0, 10),
    };
    localStorage.setItem(STORAGE_KEY_CONSTRUCTED, JSON.stringify(constructed));
  }

  MILITARY_BASES = getAllMilitaryBases();
  return MILITARY_BASES;
}

/**
 * Updates base garrison units and adds optional report to persistence.
 */
export function updateBaseGarrison(
  baseId: string,
  updatedUnits: MilitaryUnit[],
  newReport?: BaseReport
): MilitaryBase[] {
  if (typeof window === 'undefined' || !window.localStorage) return getAllMilitaryBases();

  const overrides = getBaseGarrisonOverrides();
  const allCurrent = getAllMilitaryBases();
  const targetBase = allCurrent.find((b) => b.id === baseId);
  if (!targetBase) return allCurrent;

  const currentReports: BaseReport[] = overrides[baseId]?.reports
    ? [...overrides[baseId].reports]
    : [...targetBase.reports];

  if (newReport) {
    currentReports.unshift(newReport);
  }

  overrides[baseId] = {
    units: updatedUnits,
    reports: currentReports.slice(0, 30),
  };

  localStorage.setItem(STORAGE_KEY_BASE_GARRISON_OVERRIDES, JSON.stringify(overrides));

  const constructed = getConstructedBases();
  const cIndex = constructed.findIndex((b) => b.id === baseId);
  if (cIndex >= 0) {
    constructed[cIndex] = {
      ...constructed[cIndex],
      units: updatedUnits,
      reports: currentReports.slice(0, 30),
    };
    localStorage.setItem(STORAGE_KEY_CONSTRUCTED, JSON.stringify(constructed));
  }

  MILITARY_BASES = getAllMilitaryBases();
  return MILITARY_BASES;
}

/**
 * Returns all active bases in the world: the 61 capital bases plus any constructed bases.
 */
export function getAllMilitaryBases(): MilitaryBase[] {
  const constructed = getConstructedBases();
  const overrides = getBaseGarrisonOverrides();
  const bases = [...CAPITAL_MILITARY_BASES, ...constructed];

  return bases.map((base) => {
    let units = overrides[base.id]?.units || base.units;
    // Ensure the base has at least one missile unit for the missile category
    const hasMissile = units.some(
      (u) =>
        u.type === 'missile' ||
        u.name.toLowerCase().includes('missile') ||
        u.name.toLowerCase().includes('rocket')
    );
    if (!hasMissile) {
      units = [
        ...units,
        {
          id: `${base.id}-cruise-missiles`,
          name: 'Tactical Cruise Missiles',
          count: 36,
          type: 'missile',
          code: 'CRUISE-SALVO',
        },
      ];
    }

    return {
      ...base,
      units,
      reports: overrides[base.id]?.reports || base.reports,
    };
  });
}

export let MILITARY_BASES: MilitaryBase[] = getAllMilitaryBases();
