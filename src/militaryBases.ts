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
  // User's specific requested base 1
  {
    id: 'base-abk-nigeria',
    name: 'Sector-7 Strategic Outpost',
    codeName: 'FORWARD OPERATING BASE OMEGA',
    countryName: 'Nigeria',
    countryCode: 'NG',
    flagUrl: 'https://flagcdn.com/w80/ng.png',
    lat: 8.792833,
    lng: 7.394787,
    dms: `8°47'34.2"N  7°23'41.2"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-1', timeAgo: '12m ago', type: 'urgent', text: 'We need air equipment and additional SAM interceptor batteries.' },
      { id: 'rep-2', timeAgo: '45m ago', type: 'defense', text: 'We repelled 20 drone strike heading for sector headquarters.' },
      { id: 'rep-3', timeAgo: '2h ago', type: 'logistics', text: 'Fuel pipeline supply secured along secondary highway perimeter.' },
      { id: 'rep-4', timeAgo: '5h ago', type: 'intel', text: 'Satellite radar scans identified unknown airborne telemetry 80km north.' },
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
  // User's specific requested base 2
  {
    id: 'base-sahara-algeria',
    name: 'Fortress Citadel Sahara',
    codeName: 'DEEP DESERT COMMAND NEXUS',
    countryName: 'Algeria',
    countryCode: 'DZ',
    flagUrl: 'https://flagcdn.com/w80/dz.png',
    lat: 27.422378,
    lng: 2.752004,
    dms: `27°25'20.6"N  2°45'7.2"E`,
    status: 'Fortified',
    reports: [
      { id: 'rep-101', timeAgo: '8m ago', type: 'defense', text: 'Anti-air perimeter radars detected low-altitude radar anomalies.' },
      { id: 'rep-102', timeAgo: '30m ago', type: 'urgent', text: 'Thermal cooling towers operating at 94% threshold due to severe sandstorm.' },
      { id: 'rep-103', timeAgo: '1h ago', type: 'defense', text: 'Interception array intercepted 6 hostile reconnaissance quadcopters.' },
      { id: 'rep-104', timeAgo: '4h ago', type: 'intel', text: 'All ground patrol convoys checked in with zero perimeter breaches.' },
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
  // United States Base
  {
    id: 'base-us-nellis',
    name: 'Sector-1 Pentagon Air Nexus',
    codeName: 'APEX AEROSPACE BASTION',
    countryName: 'United States',
    countryCode: 'US',
    flagUrl: 'https://flagcdn.com/w80/us.png',
    lat: 36.236,
    lng: -115.034,
    dms: `36°14'09.6"N  115°02'02.4"W`,
    status: 'Fortified',
    reports: [
      { id: 'rep-us-1', timeAgo: '5m ago', type: 'defense', text: 'NORAD early warning arrays confirm all continental airspace sectors clear.' },
      { id: 'rep-us-2', timeAgo: '40m ago', type: 'urgent', text: 'Requesting emergency propellant delivery for 3 strategic bomber squadrons.' },
      { id: 'rep-us-3', timeAgo: '3h ago', type: 'intel', text: 'Hypersonic telemetry test over Pacific proving grounds concluded successfully.' },
    ],
    units: [
      { id: 'u-us-1', name: 'Troops', count: 1200, type: 'infantry', code: 'AIR-FORCE-SEC' },
      { id: 'u-us-2', name: 'F-22 Raptor', count: 64, type: 'aircraft', code: 'RAPTOR-WING' },
      { id: 'u-us-3', name: 'F-35 Lightning II', count: 48, type: 'aircraft', code: 'STEALTH-STRIKE' },
      { id: 'u-us-4', name: 'B-2 Spirit', count: 10, type: 'aircraft', code: 'GLOBAL-STRIKE' },
      { id: 'u-us-5', name: 'M1A2 SEPv3', count: 85, type: 'armor', code: 'ARMORED-DIV' },
      { id: 'u-us-6', name: 'THAAD System', count: 6, type: 'air-defense', code: 'BALLISTIC-SHIELD' },
    ],
  },
  // United Kingdom Base
  {
    id: 'base-gb-waddington',
    name: 'RAF Sovereign Citadel',
    codeName: 'ALBION COMMAND REDOUBT',
    countryName: 'United Kingdom',
    countryCode: 'GB',
    flagUrl: 'https://flagcdn.com/w80/gb.png',
    lat: 53.166,
    lng: -0.524,
    dms: `53°09'57.6"N  0°31'26.4"W`,
    status: 'Operational',
    reports: [
      { id: 'rep-gb-1', timeAgo: '15m ago', type: 'defense', text: 'North Sea airborne radar picket detected zero unidentified targets.' },
      { id: 'rep-gb-2', timeAgo: '1h ago', type: 'urgent', text: 'Eurofighter Typhoon scrambles conducted in support of eastern perimeter.' },
    ],
    units: [
      { id: 'u-gb-1', name: 'Troops', count: 450, type: 'infantry', code: 'ROYAL-REG' },
      { id: 'u-gb-2', name: 'Eurofighter Typhoon', count: 36, type: 'aircraft', code: 'QRA-SQUADRON' },
      { id: 'u-gb-3', name: 'F-35B', count: 18, type: 'aircraft', code: 'CARRIER-WING' },
      { id: 'u-gb-4', name: 'Challenger 3', count: 28, type: 'armor', code: 'ROYAL-ARMOR' },
      { id: 'u-gb-5', name: 'Sky Sabre', count: 8, type: 'air-defense', code: 'SHORAD' },
    ],
  },
  // France Base
  {
    id: 'base-fr-istres',
    name: 'Base Aérienne 125 Hexagone',
    codeName: 'CITADELLE DU RHÔNE',
    countryName: 'France',
    countryCode: 'FR',
    flagUrl: 'https://flagcdn.com/w80/fr.png',
    lat: 43.522,
    lng: 4.924,
    dms: `43°31'19.2"N  4°55'26.4"E`,
    status: 'Fortified',
    reports: [
      { id: 'rep-fr-1', timeAgo: '20m ago', type: 'intel', text: 'Mediterranean satellite link locked onto southern naval fleet coordinates.' },
      { id: 'rep-fr-2', timeAgo: '2h ago', type: 'urgent', text: 'Strategic deterrence wing completed nuclear-capable readiness verification.' },
    ],
    units: [
      { id: 'u-fr-1', name: 'Troops', count: 600, type: 'infantry', code: 'LEGION-DET' },
      { id: 'u-fr-2', name: 'Rafale C/B', count: 48, type: 'aircraft', code: 'AIR-FORCE-RAFALE' },
      { id: 'u-fr-3', name: 'Mirage 2000-5', count: 24, type: 'aircraft', code: 'INTERCEPT-WING' },
      { id: 'u-fr-4', name: 'Leclerc XLR', count: 36, type: 'armor', code: 'CHAR-COMBAT' },
      { id: 'u-fr-5', name: 'SAMP/T Mamba', count: 10, type: 'air-defense', code: 'ASTER-30' },
    ],
  },
  // Germany Base
  {
    id: 'base-de-ramstein',
    name: 'Kaiserslautern Military Fortress',
    codeName: 'TEUTONIC GATEWAY HQ',
    countryName: 'Germany',
    countryCode: 'DE',
    flagUrl: 'https://flagcdn.com/w80/de.png',
    lat: 49.437,
    lng: 7.601,
    dms: `49°26'13.2"N  7°36'03.6"E`,
    status: 'Operational',
    reports: [
      { id: 'rep-de-1', timeAgo: '10m ago', type: 'logistics', text: 'Central European airlift hub operating at max dispatch tempo.' },
      { id: 'rep-de-2', timeAgo: '1h ago', type: 'defense', text: 'Cyber command repelled 84 distributed network intrusion probes.' },
    ],
    units: [
      { id: 'u-de-1', name: 'Troops', count: 800, type: 'infantry', code: 'PANZERGRENADIER' },
      { id: 'u-de-2', name: 'Eurofighter EF-2000', count: 40, type: 'aircraft', code: 'LUFTWAFFE-WING' },
      { id: 'u-de-3', name: 'Tornado IDS', count: 20, type: 'aircraft', code: 'STRIKE-FORCE' },
      { id: 'u-de-4', name: 'Leopard 2A8', count: 54, type: 'armor', code: 'PANZER-DIVISION' },
      { id: 'u-de-5', name: 'IRIS-T SLM', count: 14, type: 'air-defense', code: 'AIR-DEFENSE-NET' },
    ],
  },
  // Russia Base
  {
    id: 'base-ru-kubinka',
    name: 'Kubinka Aerospace Fortress',
    codeName: 'KREMLIN IRON REDOUBT',
    countryName: 'Russia',
    countryCode: 'RU',
    flagUrl: 'https://flagcdn.com/w80/ru.png',
    lat: 55.611,
    lng: 36.65,
    dms: `55°36'39.6"N  36°39'00.0"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-ru-1', timeAgo: '7m ago', type: 'defense', text: 'We repelled 20 drone strike heading for moscow.' },
      { id: 'rep-ru-2', timeAgo: '25m ago', type: 'urgent', text: 'We need air equipment and supplementary electronic jamming pods.' },
      { id: 'rep-ru-3', timeAgo: '2h ago', type: 'intel', text: 'Western perimeter long-range radar arrays scanning Baltic sector.' },
    ],
    units: [
      { id: 'u-ru-1', name: 'Troops', count: 1400, type: 'infantry', code: 'GUARDS-DIVISION' },
      { id: 'u-ru-2', name: 'Su-57 Felon', count: 24, type: 'aircraft', code: 'STEALTH-SQUADRON' },
      { id: 'u-ru-3', name: 'Su-35S Flanker', count: 52, type: 'aircraft', code: 'AIR-SUPREMACY' },
      { id: 'u-ru-4', name: 'MiG-31BM', count: 30, type: 'aircraft', code: 'FOXHOUND-INTERCEPT' },
      { id: 'u-ru-5', name: 'T-90M Proryv', count: 70, type: 'armor', code: 'HEAVY-TANK' },
      { id: 'u-ru-6', name: 'S-400 Triumf', count: 16, type: 'air-defense', code: 'AIR-SHIELD-400' },
    ],
  },
  // China Base
  {
    id: 'base-cn-dingxin',
    name: 'Dingxin Tactical Combat Center',
    codeName: 'DRAGON CLAW TEST NEXUS',
    countryName: 'China',
    countryCode: 'CN',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
    lat: 40.4,
    lng: 99.8,
    dms: `40°24'00.0"N  99°48'00.0"E`,
    status: 'Fortified',
    reports: [
      { id: 'rep-cn-1', timeAgo: '18m ago', type: 'intel', text: 'Desert tactical simulation center finalized automated drone swarm exercises.' },
      { id: 'rep-cn-2', timeAgo: '3h ago', type: 'defense', text: 'BVR radar tracking grid calibrated for high-altitude intercept missions.' },
    ],
    units: [
      { id: 'u-cn-1', name: 'Troops', count: 1800, type: 'infantry', code: 'PLA-AIR-CORPS' },
      { id: 'u-cn-2', name: 'J-20 Mighty Dragon', count: 50, type: 'aircraft', code: '5TH-GEN-STEALTH' },
      { id: 'u-cn-3', name: 'J-16 Flanker-D', count: 60, type: 'aircraft', code: 'MULTIROLE-HEAVY' },
      { id: 'u-cn-4', name: 'Type 99A', count: 90, type: 'armor', code: 'MAIN-BATTLE-TANK' },
      { id: 'u-cn-5', name: 'HQ-9B', count: 18, type: 'air-defense', code: 'LONG-RANGE-SAM' },
    ],
  },
  // Japan Base
  {
    id: 'base-jp-chitose',
    name: 'Northern Fortress Citadel',
    codeName: 'SAMURAI NORTH GATEWAY',
    countryName: 'Japan',
    countryCode: 'JP',
    flagUrl: 'https://flagcdn.com/w80/jp.png',
    lat: 42.794,
    lng: 141.666,
    dms: `42°47'38.4"N  141°39'57.6"E`,
    status: 'Operational',
    reports: [
      { id: 'rep-jp-1', timeAgo: '11m ago', type: 'defense', text: 'Northern airspace scrambled 2 F-15J fighters upon incoming radar ping.' },
      { id: 'rep-jp-2', timeAgo: '2h ago', type: 'logistics', text: 'Submarine acoustic listening station reports Pacific approaches secure.' },
    ],
    units: [
      { id: 'u-jp-1', name: 'Troops', count: 500, type: 'infantry', code: 'JGSDF-BRIGADE' },
      { id: 'u-jp-2', name: 'F-35A Lightning', count: 32, type: 'aircraft', code: 'JASDF-STEALTH' },
      { id: 'u-jp-3', name: 'F-15J Eagle', count: 44, type: 'aircraft', code: 'AIR-DEFENSE' },
      { id: 'u-jp-4', name: 'Type 10 Tank', count: 38, type: 'armor', code: 'COMPACT-ARMOR' },
      { id: 'u-jp-5', name: 'Type 03 Chu-SAM', count: 10, type: 'air-defense', code: 'AIR-DEFENSE-CORPS' },
    ],
  },
  // India Base
  {
    id: 'base-in-ambala',
    name: 'Sector-9 Golden Arrows Fort',
    codeName: 'HIMALAYAN FRONTIER COMMAND',
    countryName: 'India',
    countryCode: 'IN',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    lat: 30.369,
    lng: 76.817,
    dms: `30°22'08.4"N  76°49'01.2"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-in-1', timeAgo: '9m ago', type: 'defense', text: 'Border surveillance radar confirmed zero unauthorized incursions.' },
      { id: 'rep-in-2', timeAgo: '42m ago', type: 'urgent', text: 'All mountain strike divisions ordered to heightened combat readiness.' },
    ],
    units: [
      { id: 'u-in-1', name: 'Troops', count: 1100, type: 'infantry', code: 'MOUNTAIN-CORPS' },
      { id: 'u-in-2', name: 'Rafale EH', count: 36, type: 'aircraft', code: 'GOLDEN-ARROWS' },
      { id: 'u-in-3', name: 'Su-30MKI', count: 54, type: 'aircraft', code: 'AIR-DOMINANCE' },
      { id: 'u-in-4', name: 'T-90 Bhishma', count: 80, type: 'armor', code: 'HEAVY-CAVALRY' },
      { id: 'u-in-5', name: 'Akash-NG / S-400', count: 12, type: 'air-defense', code: 'AIR-SHIELD' },
    ],
  },
  // Brazil Base
  {
    id: 'base-br-anapolis',
    name: 'Planalto Sovereign Outpost',
    codeName: 'AMAZON GUARDIAN NEXUS',
    countryName: 'Brazil',
    countryCode: 'BR',
    flagUrl: 'https://flagcdn.com/w80/br.png',
    lat: -16.326,
    lng: -48.953,
    dms: `16°19'33.6"S  48°57'10.8"W`,
    status: 'Operational',
    reports: [
      { id: 'rep-br-1', timeAgo: '35m ago', type: 'intel', text: 'Airborne surveillance radar completed Amazon basin radar patrol.' },
      { id: 'rep-br-2', timeAgo: '2h ago', type: 'logistics', text: 'Supply routes connected with southern military regional commands.' },
    ],
    units: [
      { id: 'u-br-1', name: 'Troops', count: 400, type: 'infantry', code: 'INFANTARIA' },
      { id: 'u-br-2', name: 'F-39 Gripen E', count: 36, type: 'aircraft', code: 'JAGUAR-SQUADRON' },
      { id: 'u-br-3', name: 'A-29 Super Tucano', count: 28, type: 'aircraft', code: 'LIGHT-ATTACK' },
      { id: 'u-br-4', name: 'Leopard 1A5', count: 32, type: 'armor', code: 'REGIMENTO-BLINDADO' },
      { id: 'u-br-5', name: 'RBS 70 NG', count: 8, type: 'air-defense', code: 'DEFESA-AEREA' },
    ],
  },
  // Canada Base
  {
    id: 'base-ca-coldlake',
    name: '4 Wing Arctic Bastion',
    codeName: 'NORTHERN SHIELD REDOUBT',
    countryName: 'Canada',
    countryCode: 'CA',
    flagUrl: 'https://flagcdn.com/w80/ca.png',
    lat: 54.405,
    lng: -110.279,
    dms: `54°24'18.0"N  110°16'44.4"W`,
    status: 'Operational',
    reports: [
      { id: 'rep-ca-1', timeAgo: '22m ago', type: 'intel', text: 'Arctic radar chain completed routine trans-polar telemetry sweep.' },
    ],
    units: [
      { id: 'u-ca-1', name: 'Troops', count: 300, type: 'infantry', code: 'CANADIAN-ARMY' },
      { id: 'u-ca-2', name: 'CF-188 Hornet', count: 38, type: 'aircraft', code: 'TACTICAL-FIGHTER' },
      { id: 'u-ca-3', name: 'F-35A (Allocated)', count: 16, type: 'aircraft', code: 'ARCTIC-AIR' },
      { id: 'u-ca-4', name: 'LAV 6.0', count: 45, type: 'armor', code: 'MOTORIZED-INF' },
      { id: 'u-ca-5', name: 'ADATS/Air Defense', count: 6, type: 'air-defense', code: 'SURFACE-AIR' },
    ],
  },
  // Australia Base
  {
    id: 'base-au-tindal',
    name: 'Top End Strike Bastion',
    codeName: 'SOUTHERN SOVEREIGN CORPS',
    countryName: 'Australia',
    countryCode: 'AU',
    flagUrl: 'https://flagcdn.com/w80/au.png',
    lat: -14.521,
    lng: 132.378,
    dms: `14°31'15.6"S  132°22'40.8"E`,
    status: 'Fortified',
    reports: [
      { id: 'rep-au-1', timeAgo: '14m ago', type: 'intel', text: 'Jindalee Operational Radar Network confirms all northern maritime corridors clear.' },
    ],
    units: [
      { id: 'u-au-1', name: 'Troops', count: 380, type: 'infantry', code: 'DIGGER-BRIGADE' },
      { id: 'u-au-2', name: 'F-35A Lightning II', count: 32, type: 'aircraft', code: 'RAAF-SQUADRON-75' },
      { id: 'u-au-3', name: 'F/A-18F Super Hornet', count: 24, type: 'aircraft', code: 'STRIKE-FIGHTER' },
      { id: 'u-au-4', name: 'M1A2 SEPv3', count: 30, type: 'armor', code: '1ST-ARMOR' },
      { id: 'u-au-5', name: 'NASAMS 3', count: 8, type: 'air-defense', code: 'SHORT-MED-AIR' },
    ],
  },
  // South Korea Base
  {
    id: 'base-kr-osan',
    name: 'Peninsular Vanguard Outpost',
    codeName: 'TIGER BULWARK COMMAND',
    countryName: 'South Korea',
    countryCode: 'KR',
    flagUrl: 'https://flagcdn.com/w80/kr.png',
    lat: 37.09,
    lng: 127.03,
    dms: `37°05'24.0"N  127°01'48.0"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-kr-1', timeAgo: '4m ago', type: 'defense', text: 'Demilitarized Zone thermal listening posts report continuous baseline activity.' },
      { id: 'rep-kr-2', timeAgo: '28m ago', type: 'urgent', text: 'Scramble alert for F-15K Slam Eagle squadron on standby runway.' },
    ],
    units: [
      { id: 'u-kr-1', name: 'Troops', count: 950, type: 'infantry', code: 'ROK-ARMY-DIV' },
      { id: 'u-kr-2', name: 'KF-21 Boramae', count: 24, type: 'aircraft', code: 'NEXT-GEN-AIR' },
      { id: 'u-kr-3', name: 'F-15K Slam Eagle', count: 48, type: 'aircraft', code: 'STRIKE-COMMAND' },
      { id: 'u-kr-4', name: 'K2 Black Panther', count: 65, type: 'armor', code: 'MAIN-BATTLE-TANK' },
      { id: 'u-kr-5', name: 'Cheongung II (M-SAM)', count: 14, type: 'air-defense', code: 'MISSILE-SHIELD' },
    ],
  },
  // Italy Base
  {
    id: 'base-it-amendola',
    name: 'Amendola Mediterranean Hub',
    codeName: 'CENTURION AIR REDOUBT',
    countryName: 'Italy',
    countryCode: 'IT',
    flagUrl: 'https://flagcdn.com/w80/it.png',
    lat: 41.54,
    lng: 15.71,
    dms: `41°32'24.0"N  15°42'36.0"E`,
    status: 'Operational',
    reports: [
      { id: 'rep-it-1', timeAgo: '40m ago', type: 'intel', text: 'Adriatic and central Mediterranean maritime corridors operating under green status.' },
    ],
    units: [
      { id: 'u-it-1', name: 'Troops', count: 320, type: 'infantry', code: 'BERSAGLIERI' },
      { id: 'u-it-2', name: 'F-35A / F-35B', count: 28, type: 'aircraft', code: '32-STORMO' },
      { id: 'u-it-3', name: 'Eurofighter Typhoon', count: 34, type: 'aircraft', code: 'CACCIA-INTERCEPT' },
      { id: 'u-it-4', name: 'Ariete C2', count: 26, type: 'armor', code: 'CARRI-ARMATI' },
      { id: 'u-it-5', name: 'SAMP/T', count: 6, type: 'air-defense', code: 'SCUDO-AEREO' },
    ],
  },
  // South Africa Base
  {
    id: 'base-za-makhado',
    name: 'Sector-10 Bushveld Bastion',
    codeName: 'SOUTHERN SOVEREIGN CORPS',
    countryName: 'South Africa',
    countryCode: 'ZA',
    flagUrl: 'https://flagcdn.com/w80/za.png',
    lat: -23.16,
    lng: 29.7,
    dms: `23°09'36.0"S  29°42'00.0"E`,
    status: 'Operational',
    reports: [
      { id: 'rep-za-1', timeAgo: '50m ago', type: 'logistics', text: 'Regional tactical defense communications tested at full spectrum.' },
    ],
    units: [
      { id: 'u-za-1', name: 'Troops', count: 280, type: 'infantry', code: 'SANDF-BATTALION' },
      { id: 'u-za-2', name: 'JAS 39 Gripen C', count: 22, type: 'aircraft', code: 'FIGHTER-WING-2' },
      { id: 'u-za-3', name: 'Rooivalk Combat Heli', count: 12, type: 'aircraft', code: 'ATTACK-HELICOPTER' },
      { id: 'u-za-4', name: 'Olifant Mk2', count: 24, type: 'armor', code: 'ARMORED-REG' },
      { id: 'u-za-5', name: 'Umkhonto SAM', count: 6, type: 'air-defense', code: 'AIR-DEFENSE' },
    ],
  },
  // Egypt Base
  {
    id: 'base-eg-bernice',
    name: 'Berenice Strategic Naval & Air Citadel',
    codeName: 'SUEZ BULWARK FORTRESS',
    countryName: 'Egypt',
    countryCode: 'EG',
    flagUrl: 'https://flagcdn.com/w80/eg.png',
    lat: 23.97,
    lng: 35.48,
    dms: `23°58'12.0"N  35°28'48.0"E`,
    status: 'Fortified',
    reports: [
      { id: 'rep-eg-1', timeAgo: '16m ago', type: 'defense', text: 'Red Sea maritime corridor monitored by early warning radar arrays.' },
      { id: 'rep-eg-2', timeAgo: '1h ago', type: 'urgent', text: 'Coastal air defense batteries initiated readiness drills.' },
    ],
    units: [
      { id: 'u-eg-1', name: 'Troops', count: 750, type: 'infantry', code: 'EGYPTIAN-INF' },
      { id: 'u-eg-2', name: 'Rafale DM/EM', count: 30, type: 'aircraft', code: 'TACTICAL-WING' },
      { id: 'u-eg-3', name: 'MiG-29M2', count: 36, type: 'aircraft', code: 'AIR-FORCE-BRIGADE' },
      { id: 'u-eg-4', name: 'M1A1 Abrams', count: 60, type: 'armor', code: 'ARMORED-CORPS' },
      { id: 'u-eg-5', name: 'Tor-M2E / S-300VM', count: 12, type: 'air-defense', code: 'AIR-DEFENSE-COMMAND' },
    ],
  },
  // Saudi Arabia Base
  {
    id: 'base-sa-princesultan',
    name: 'Prince Sultan Fortress Redoubt',
    codeName: 'GULF DEFENSE NEXUS',
    countryName: 'Saudi Arabia',
    countryCode: 'SA',
    flagUrl: 'https://flagcdn.com/w80/sa.png',
    lat: 24.06,
    lng: 47.58,
    dms: `24°03'36.0"N  47°34'48.0"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-sa-1', timeAgo: '10m ago', type: 'defense', text: 'Patriot interceptor missile battery on continuous standby radar lock.' },
      { id: 'rep-sa-2', timeAgo: '55m ago', type: 'urgent', text: 'We need air equipment and spare engine turbines for F-15SA fighters.' },
    ],
    units: [
      { id: 'u-sa-1', name: 'Troops', count: 650, type: 'infantry', code: 'ROYAL-LAND-FORCES' },
      { id: 'u-sa-2', name: 'F-15SA Strike Eagle', count: 52, type: 'aircraft', code: 'RSAF-SQUADRON' },
      { id: 'u-sa-3', name: 'Eurofighter Typhoon', count: 32, type: 'aircraft', code: 'INTERCEPT-SQUADRON' },
      { id: 'u-sa-4', name: 'M1A2S Abrams', count: 55, type: 'armor', code: 'ARMORED-BRIGADE' },
      { id: 'u-sa-5', name: 'Patriot PAC-3 MSE', count: 16, type: 'air-defense', code: 'BALLISTIC-SHIELD' },
    ],
  },
  // Israel Base
  {
    id: 'base-il-nevatim',
    name: 'Nevatim Strategic Citadel',
    codeName: 'LION SHIELD COMPLEX',
    countryName: 'Israel',
    countryCode: 'IL',
    flagUrl: 'https://flagcdn.com/w80/il.png',
    lat: 31.21,
    lng: 35.01,
    dms: `31°12'36.0"N  35°00'36.0"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-il-1', timeAgo: '2m ago', type: 'defense', text: 'Multi-layer Iron Dome and Arrow-3 telemetry arrays on 100% alert.' },
      { id: 'rep-il-2', timeAgo: '15m ago', type: 'urgent', text: 'F-35I Adir stealth fighters returned from perimeter surveillance sorties.' },
    ],
    units: [
      { id: 'u-il-1', name: 'Troops', count: 550, type: 'infantry', code: 'IDF-ELITE-INF' },
      { id: 'u-il-2', name: 'F-35I Adir', count: 39, type: 'aircraft', code: 'STEALTH-SQUADRON' },
      { id: 'u-il-3', name: 'F-15I Ra’am', count: 25, type: 'aircraft', code: 'HAMMER-SQUADRON' },
      { id: 'u-il-4', name: 'Merkava Mk 4M Barak', count: 48, type: 'armor', code: 'TROPHY-TANK' },
      { id: 'u-il-5', name: 'Iron Dome & Arrow 3', count: 18, type: 'air-defense', code: 'HERMETIC-SHIELD' },
    ],
  },
  // Turkey Base
  {
    id: 'base-tr-incirlik',
    name: 'Incirlik Strategic Hub',
    codeName: 'ANATOLIAN CRESCENT BASTION',
    countryName: 'Turkey',
    countryCode: 'TR',
    flagUrl: 'https://flagcdn.com/w80/tr.png',
    lat: 37.0,
    lng: 35.42,
    dms: `37°00'00.0"N  35°25'12.0"E`,
    status: 'Operational',
    reports: [
      { id: 'rep-tr-1', timeAgo: '25m ago', type: 'defense', text: 'Bayraktar TB2 and Akinci UCAV surveillance orbits operating along coast.' },
      { id: 'rep-tr-2', timeAgo: '1h ago', type: 'intel', text: 'Eastern Mediterranean electronic listening posts intercept signal traffic.' },
    ],
    units: [
      { id: 'u-tr-1', name: 'Troops', count: 680, type: 'infantry', code: 'COMMANDO-BRIGADE' },
      { id: 'u-tr-2', name: 'F-16C Block 50+', count: 48, type: 'aircraft', code: 'FALCON-SQUADRON' },
      { id: 'u-tr-3', name: 'Bayraktar Kızılelma', count: 18, type: 'aircraft', code: 'UNMANNED-STEALTH' },
      { id: 'u-tr-4', name: 'Altay Main Battle Tank', count: 42, type: 'armor', code: 'ARMORED-DIV' },
      { id: 'u-tr-5', name: 'Hisar-O+ / Siper', count: 10, type: 'air-defense', code: 'AIR-DEFENSE-SYS' },
    ],
  },
  // Ukraine Base
  {
    id: 'base-ua-vasylkiv',
    name: 'Vasylkiv Air Guard Fortress',
    codeName: 'GHOST GUARDIAN REDOUBT',
    countryName: 'Ukraine',
    countryCode: 'UA',
    flagUrl: 'https://flagcdn.com/w80/ua.png',
    lat: 50.23,
    lng: 30.3,
    dms: `50°13'48.0"N  30°18'00.0"E`,
    status: 'Alert',
    reports: [
      { id: 'rep-ua-1', timeAgo: '3m ago', type: 'defense', text: 'Mobile air defense teams neutralized incoming Shahed drone flightpath.' },
      { id: 'rep-ua-2', timeAgo: '20m ago', type: 'urgent', text: 'We need air equipment, F-16 ordnance, and 155mm artillery shells immediately.' },
      { id: 'rep-ua-3', timeAgo: '2h ago', type: 'intel', text: 'Frontline radar scans tracked low-altitude missile trajectories.' },
    ],
    units: [
      { id: 'u-ua-1', name: 'Troops', count: 900, type: 'infantry', code: 'TACTICAL-AIR-BRIGADE' },
      { id: 'u-ua-2', name: 'F-16 Fighting Falcon', count: 32, type: 'aircraft', code: 'DEFENSE-SQUADRON' },
      { id: 'u-ua-3', name: 'MiG-29 Ghost Wing', count: 20, type: 'aircraft', code: 'INTERCEPT-FIGHTERS' },
      { id: 'u-ua-4', name: 'Leopard 2A6 & Abrams', count: 45, type: 'armor', code: 'STRIKE-BRIGADE' },
      { id: 'u-ua-5', name: 'Patriot & NASAMS', count: 12, type: 'air-defense', code: 'SKY-SHIELD' },
    ],
  },
];
