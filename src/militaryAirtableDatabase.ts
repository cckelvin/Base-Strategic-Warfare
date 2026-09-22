// ============================================================================
// AIRTABLE MILITARY DATABASE SCHEMA & UNIT REGISTRY
// ============================================================================
// Contains full table IDs, column names, and field IDs as defined in the 
// Military Database Airtable Base.

export interface AirtableFieldMeta {
  name: string;
  fieldId: string;
  type: 'string' | 'number' | 'url';
}

export interface AirtableTableMeta {
  tableId: string;
  name: string;
  description: string;
  fields: Record<string, AirtableFieldMeta>;
}

export const AIRTABLE_TABLES = {
  AIR_FORCE: {
    tableId: 'tbl0huhAtuu59wum6',
    name: 'Air Force',
    description: 'Fixed-wing combat aircraft, air superiority fighters, stealth bombers, and strike platforms.',
    fields: {
      aircraft: { name: 'Aircraft', fieldId: 'fldcsVEFvWhACbUs0', type: 'string' },
      aircraftType: { name: 'Aircraft Type', fieldId: 'fldxag97B6fTVK63w', type: 'string' },
      armor: { name: 'Armor', fieldId: 'fldtcM0DBhJ3a7OGC', type: 'number' },
      speed: { name: 'Speed', fieldId: 'fldsrif5ryejKyIqL', type: 'number' },
      airAttackPower: { name: 'Air Attack Power', fieldId: 'fldnshrmQgw4cKdlb', type: 'number' },
      airResistance: { name: 'Air Resistance', fieldId: 'fldrIVMagnfawZma3', type: 'number' },
      weaponCapacity: { name: 'Weapon Capacity', fieldId: 'fldL1kdTkO28rlUdX', type: 'number' },
      sensors: { name: 'Sensors', fieldId: 'fldYFzZAS9u125Ilv', type: 'number' },
      stealth: { name: 'Stealth', fieldId: 'fldu4gN0mzhm0Ypwc', type: 'number' },
      maneuverability: { name: 'Maneuverability', fieldId: 'fldh4GKEShY9CjLZD', type: 'number' },
      range: { name: 'Range', fieldId: 'fld4hhnApAOWFdDpb', type: 'number' },
      info: { name: 'Info', fieldId: 'fldD8cbxLmY3uCSBx', type: 'string' },
      groundPower: { name: 'Ground Power', fieldId: 'fld3DaIBVRgMM2xai', type: 'number' },
      groundResistance: { name: 'Ground Resistance', fieldId: 'fldqX8vpY3qTenDV8', type: 'number' },
      attackRange: { name: 'Attack Range', fieldId: 'fldRbOU0CLONAHNRT', type: 'number' },
      imageUrl: { name: 'Image URL', fieldId: 'fld1C4FCzgNGPQdDy', type: 'url' },
      fireRate: { name: 'Fire Rate', fieldId: 'fldE6vpp7unM3eucv', type: 'number' },
      price: { name: 'Price', fieldId: 'fldjjux6i0ovX0AAA', type: 'number' },
    },
  },
  NAVY: {
    tableId: 'tblOg991iHrBYKVGn',
    name: 'Navy',
    description: 'Guided-missile destroyers, attack submarines, cruisers, frigates, and aircraft carriers.',
    fields: {
      unit: { name: 'Unit', fieldId: 'fldF5HH51uuAFucvU', type: 'string' },
      unitType: { name: 'Unit Type', fieldId: 'fldIWo8dlKFH8VCb9', type: 'string' },
      armor: { name: 'Armor', fieldId: 'fld9wHpcQGkblhiY5', type: 'number' },
      speed: { name: 'Speed', fieldId: 'fldzjIxH4rZ1uoDpO', type: 'number' },
      groundAttackPower: { name: 'Ground Attack Power', fieldId: 'fldhIrHhu2ugpoBUP', type: 'number' },
      groundResistance: { name: 'Ground Resistance', fieldId: 'fldCYHYXPFrqV3c8C', type: 'number' },
      airAttackPower: { name: 'Air Attack Power', fieldId: 'fldOfDdfzNgkS0PjK', type: 'number' },
      airResistance: { name: 'Air Resistance', fieldId: 'fld5ajgLXSPaFwK3l', type: 'number' },
      weaponCapacity: { name: 'Weapon Capacity', fieldId: 'fldfiIudJCDA35XYZ', type: 'number' },
      sensors: { name: 'Sensors', fieldId: 'fldTXAcxQdBdqIzad', type: 'number' },
      stealth: { name: 'Stealth', fieldId: 'fldhrL1PSjOWo1RyG', type: 'number' },
      maneuverability: { name: 'Maneuverability', fieldId: 'fld4kJuvWXlq8gPVi', type: 'number' },
      range: { name: 'Range', fieldId: 'fldGSju2DoT5m2qcz', type: 'number' },
      info: { name: 'Info', fieldId: 'fldlDjcTs6SAXgV3F', type: 'string' },
      attackRange: { name: 'Attack Range', fieldId: 'fldZVuNtmbQPsMGDC', type: 'number' },
      imageUrl: { name: 'Image URL', fieldId: 'fldHta3vcGo9r10F5', type: 'url' },
      fireRate: { name: 'Fire Rate', fieldId: 'fldQshVzqZk5Zq8Co', type: 'number' },
      price: { name: 'Price', fieldId: 'fldejjbNTOLSJbKCF', type: 'number' },
    },
  },
  GROUND: {
    tableId: 'tblDReb09L4i43csT',
    name: 'Ground',
    description: 'Main battle tanks, mechanized infantry fighting vehicles, self-propelled howitzers, and mobile radar.',
    fields: {
      unit: { name: 'Unit', fieldId: 'fldmMOGLMxO4bieM5', type: 'string' },
      unitType: { name: 'Unit Type', fieldId: 'fldrdghNWr73z6WRq', type: 'string' },
      armor: { name: 'Armor', fieldId: 'fldn2cq2YWaPtqcMS', type: 'number' },
      speed: { name: 'Speed', fieldId: 'fldvy4p9zAGSjUXY7', type: 'number' },
      groundAttackPower: { name: 'Ground Attack Power', fieldId: 'fldESsG5K3WGCYrNT', type: 'number' },
      groundResistance: { name: 'Ground Resistance', fieldId: 'fldsjJT70qwGfdm03', type: 'number' },
      airAttackPower: { name: 'Air Attack Power', fieldId: 'fldeBl2jWcrCfqr9K', type: 'number' },
      airResistance: { name: 'Air Resistance', fieldId: 'fldFGH61zzhUnjf3a', type: 'number' },
      weaponCapacity: { name: 'Weapon Capacity', fieldId: 'fld3YDEsBlgRrpako', type: 'number' },
      sensors: { name: 'Sensors', fieldId: 'fldFQ7uM1dWIZjpLM', type: 'number' },
      stealth: { name: 'Stealth', fieldId: 'fld7t4TKfW23Derrb', type: 'number' },
      maneuverability: { name: 'Maneuverability', fieldId: 'fldwT9vSKpo9MQfgU', type: 'number' },
      range: { name: 'Range', fieldId: 'fldXZaDQYvbPxGbmz', type: 'number' },
      info: { name: 'Info', fieldId: 'fldgX75W6yDgFQpKa', type: 'string' },
      attackRange: { name: 'Attack Range', fieldId: 'fldue0d3cHY3LaJvy', type: 'number' },
      imageUrl: { name: 'Image URL', fieldId: 'fldnMOnKnXVCPQgha', type: 'url' },
      fireRate: { name: 'Fire Rate', fieldId: 'fldORXfPexi9nXYL5', type: 'number' },
      price: { name: 'Price', fieldId: 'fldbjxN33xkh65cpp', type: 'number' },
    },
  },
  MISSILES: {
    tableId: 'tblyOuEdPUIJoyARC',
    name: 'Missiles',
    description: 'Air-to-air, cruise, ballistic, hypersonic glide, and anti-radiation precision munitions.',
    fields: {
      missile: { name: 'Missile', fieldId: 'fldBcRGC58OxTMMJh', type: 'string' },
      missileType: { name: 'Missile Type', fieldId: 'fld7q0r2fdGGhuFOd', type: 'string' },
      speed: { name: 'Speed', fieldId: 'fld45BXy9ZfMmBlu9', type: 'number' },
      range: { name: 'Range', fieldId: 'fldra1xzurw64gflO', type: 'number' },
      warhead: { name: 'Warhead', fieldId: 'fldKHabhMsoxexEsY', type: 'string' },
      targetClass: { name: 'Target Class', fieldId: 'fldh3HaoEDtKzqPnl', type: 'string' },
      price: { name: 'Price', fieldId: 'fldQ6d2wCrh31uWbA', type: 'number' },
      info: { name: 'Info', fieldId: 'fld1e3zM0oDaQfmp1', type: 'string' },
      imageUrl: { name: 'Image URL', fieldId: 'fldzzKHypeWfBjxk3', type: 'url' },
      missileClass: { name: 'Missile Class', fieldId: 'fldRJ16oNGlJDbExZ', type: 'string' },
    },
  },
  EQUIPMENT: {
    tableId: 'tblvZSmzcFl6yS8VJ',
    name: 'Equipment',
    description: 'Tactical infantry gear, reactive armor kits, optical sights, and drone reconnaissance packs.',
    fields: {
      equipment: { name: 'Equipment', fieldId: 'fldF6kUfOUG1FFd7J', type: 'string' },
      equipmentType: { name: 'Equipment Type', fieldId: 'fldGBg4949d1mNhmq', type: 'string' },
      weight: { name: 'Weight', fieldId: 'fld0nqs26SyRdW9pz', type: 'number' },
      protectionPower: { name: 'Protection/Power', fieldId: 'fldcNbAkdideXr14y', type: 'number' },
      effectiveRange: { name: 'Effective Range', fieldId: 'fldDJvwy2MrzML60G', type: 'number' },
      price: { name: 'Price', fieldId: 'fldJUThuVI27lRUeK', type: 'number' },
      info: { name: 'Info', fieldId: 'fldhh5IYPp5f1WtnK', type: 'string' },
      imageUrl: { name: 'Image URL', fieldId: 'fldhifkEwEjb0qsAv', type: 'url' },
    },
  },
  ELECTRONIC_SYSTEMS: {
    tableId: 'tblY5cY4rzD4PQw5j',
    name: 'Electronic Systems',
    description: 'AESA radar suites, electronic countermeasure (ECM) pods, cyber-spoofers, and stealth detectors.',
    fields: {
      system: { name: 'System', fieldId: 'fldLtZBkhevhKIF4d', type: 'string' },
      systemType: { name: 'System Type', fieldId: 'fldY1L2H6m7EI5rZu', type: 'string' },
      detectionRange: { name: 'Detection Range', fieldId: 'fldG5VCvcxsQxdKrI', type: 'number' },
      jammingRange: { name: 'Jamming Range', fieldId: 'fldggHJzFeqkqPwBr', type: 'number' },
      tracking: { name: 'Tracking', fieldId: 'fldpWCZF5kWxgQQhi', type: 'number' },
      stealthDetection: { name: 'Stealth Detection', fieldId: 'fld9kkp1273eYBRjJ', type: 'number' },
      price: { name: 'Price', fieldId: 'fldBYDtNkUIbJWPKA', type: 'number' },
      platform: { name: 'Platform', fieldId: 'fldRVBZST2GGufmDG', type: 'string' },
      info: { name: 'Info', fieldId: 'fldNcZVrIm76UEQG7', type: 'string' },
      imageUrl: { name: 'Image URL', fieldId: 'fldMtc4M0sCAcZdci', type: 'url' },
    },
  },
  LAUNCHERS: {
    tableId: 'tblkuLD1CSuMCjtsg',
    name: 'Launchers',
    description: 'Surface-to-air missile transporter-erector-launchers, VLS cells, and mobile rocket batteries.',
    fields: {
      launcher: { name: 'Launcher', fieldId: 'fldZcmU7y0qu4NEvW', type: 'string' },
      speed: { name: 'Speed', fieldId: 'fld9a4t3J95ASoswA', type: 'number' },
      fireRate: { name: 'Fire Rate', fieldId: 'fld5M8P0gLmVhELmq', type: 'number' },
      missileClass: { name: 'Missile Class', fieldId: 'fldlWQgGgm1PcEjKa', type: 'string' },
      radar: { name: 'Radar', fieldId: 'fldLLzdIsmnlVe5ZD', type: 'number' },
      price: { name: 'Price', fieldId: 'fldYxfopjwwkvGUTR', type: 'number' },
      info: { name: 'Info', fieldId: 'fldTMMP7MHB9T4uJL', type: 'string' },
    },
  },
} as const;

// ============================================================================
// TYPES MATCHING AIRTABLE SCHEMA
// ============================================================================

export interface AirForceUnit {
  id: string;
  aircraft: string; // fldcsVEFvWhACbUs0
  aircraftType: string; // fldxag97B6fTVK63w
  armor: number; // fldtcM0DBhJ3a7OGC
  speed: number; // fldsrif5ryejKyIqL
  airAttackPower: number; // fldnshrmQgw4cKdlb
  airResistance: number; // fldrIVMagnfawZma3
  weaponCapacity: number; // fldL1kdTkO28rlUdX
  sensors: number; // fldYFzZAS9u125Ilv
  stealth: number; // fldu4gN0mzhm0Ypwc
  maneuverability: number; // fldh4GKEShY9CjLZD
  range: number; // fld4hhnApAOWFdDpb
  info: string; // fldD8cbxLmY3uCSBx
  groundPower: number; // fld3DaIBVRgMM2xai
  groundResistance: number; // fldqX8vpY3qTenDV8
  attackRange: number; // fldRbOU0CLONAHNRT
  imageUrl: string; // fld1C4FCzgNGPQdDy
  fireRate: number; // fldE6vpp7unM3eucv
  price: number; // fldjjux6i0ovX0AAA
  countryOrigin?: string;
}

export interface NavyUnit {
  id: string;
  unit: string; // fldF5HH51uuAFucvU
  unitType: string; // fldIWo8dlKFH8VCb9
  armor: number; // fld9wHpcQGkblhiY5
  speed: number; // fldzjIxH4rZ1uoDpO
  groundAttackPower: number; // fldhIrHhu2ugpoBUP
  groundResistance: number; // fldCYHYXPFrqV3c8C
  airAttackPower: number; // fldOfDdfzNgkS0PjK
  airResistance: number; // fld5ajgLXSPaFwK3l
  weaponCapacity: number; // fldfiIudJCDA35XYZ
  sensors: number; // fldTXAcxQdBdqIzad
  stealth: number; // fldhrL1PSjOWo1RyG
  maneuverability: number; // fld4kJuvWXlq8gPVi
  range: number; // fldGSju2DoT5m2qcz
  info: string; // fldlDjcTs6SAXgV3F
  attackRange: number; // fldZVuNtmbQPsMGDC
  imageUrl: string; // fldHta3vcGo9r10F5
  fireRate: number; // fldQshVzqZk5Zq8Co
  price: number; // fldejjbNTOLSJbKCF
  countryOrigin?: string;
}

export interface GroundUnit {
  id: string;
  unit: string; // fldmMOGLMxO4bieM5
  unitType: string; // fldrdghNWr73z6WRq
  armor: number; // fldn2cq2YWaPtqcMS
  speed: number; // fldvy4p9zAGSjUXY7
  groundAttackPower: number; // fldESsG5K3WGCYrNT
  groundResistance: number; // fldsjJT70qwGfdm03
  airAttackPower: number; // fldeBl2jWcrCfqr9K
  airResistance: number; // fldFGH61zzhUnjf3a
  weaponCapacity: number; // fld3YDEsBlgRrpako
  sensors: number; // fldFQ7uM1dWIZjpLM
  stealth: number; // fld7t4TKfW23Derrb
  maneuverability: number; // fldwT9vSKpo9MQfgU
  range: number; // fldXZaDQYvbPxGbmz
  info: string; // fldgX75W6yDgFQpKa
  attackRange: number; // fldue0d3cHY3LaJvy
  imageUrl: string; // fldnMOnKnXVCPQgha
  fireRate: number; // fldORXfPexi9nXYL5
  price: number; // fldbjxN33xkh65cpp
  countryOrigin?: string;
}

export interface MissileUnit {
  id: string;
  missile: string; // fldBcRGC58OxTMMJh
  missileType: string; // fld7q0r2fdGGhuFOd
  speed: number; // fld45BXy9ZfMmBlu9
  range: number; // fldra1xzurw64gflO
  warhead: string; // fldKHabhMsoxexEsY
  targetClass: string; // fldh3HaoEDtKzqPnl
  price: number; // fldQ6d2wCrh31uWbA
  info: string; // fld1e3zM0oDaQfmp1
  imageUrl: string; // fldzzKHypeWfBjxk3
  missileClass: string; // fldRJ16oNGlJDbExZ
  countryOrigin?: string;
}

export interface EquipmentUnit {
  id: string;
  equipment: string; // fldF6kUfOUG1FFd7J
  equipmentType: string; // fldGBg4949d1mNhmq
  weight: number; // fld0nqs26SyRdW9pz
  protectionPower: number; // fldcNbAkdideXr14y
  effectiveRange: number; // fldDJvwy2MrzML60G
  price: number; // fldJUThuVI27lRUeK
  info: string; // fldhh5IYPp5f1WtnK
  imageUrl: string; // fldhifkEwEjb0qsAv
}

export interface ElectronicSystemUnit {
  id: string;
  system: string; // fldLtZBkhevhKIF4d
  systemType: string; // fldY1L2H6m7EI5rZu
  detectionRange: number; // fldG5VCvcxsQxdKrI
  jammingRange: number; // fldggHJzFeqkqPwBr
  tracking: number; // fldpWCZF5kWxgQQhi
  stealthDetection: number; // fld9kkp1273eYBRjJ
  price: number; // fldBYDtNkUIbJWPKA
  platform: string; // fldRVBZST2GGufmDG
  info: string; // fldNcZVrIm76UEQG7
  imageUrl: string; // fldMtc4M0sCAcZdci
}

export interface LauncherUnit {
  id: string;
  launcher: string; // fldZcmU7y0qu4NEvW
  speed: number; // fld9a4t3J95ASoswA
  fireRate: number; // fld5M8P0gLmVhELmq
  missileClass: string; // fldlWQgGgm1PcEjKa
  radar: number; // fldLLzdIsmnlVe5ZD
  price: number; // fldYxfopjwwkvGUTR
  info: string; // fldTMMP7MHB9T4uJL
}

// ============================================================================
// SEEDED MILITARY DATA (Matched 1:1 with Airtable Schema)
// ============================================================================

export const SEEDED_AIR_FORCE: AirForceUnit[] = [
  {
    id: 'af-f22',
    aircraft: 'F-22 Raptor',
    aircraftType: '5th Gen Air Superiority Stealth Fighter',
    armor: 850,
    speed: 2410, // km/h (Mach 2.25)
    airAttackPower: 96,
    airResistance: 88,
    weaponCapacity: 8, // internal bays (6 AMRAAM + 2 Sidewinder)
    sensors: 98, // AN/APG-77v1 AESA
    stealth: 99, // 0.0001 m² RCS
    maneuverability: 96, // 2D thrust vectoring
    range: 2960,
    info: 'Dominant air dominance fighter with all-aspect stealth, supercruise, and high off-boresight missile cueing.',
    groundPower: 45,
    groundResistance: 82,
    attackRange: 160, // km (AIM-120D envelope)
    imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6a1?w=800&auto=format&fit=crop&q=80',
    fireRate: 8,
    price: 143000000,
    countryOrigin: 'US',
  },
  {
    id: 'af-su57',
    aircraft: 'Su-57 Felon',
    aircraftType: '5th Gen Multi-Role Stealth Fighter',
    armor: 890,
    speed: 2600, // km/h (Mach 2.45)
    airAttackPower: 94,
    airResistance: 85,
    weaponCapacity: 8, // internal bays (K-77M + R-74M2)
    sensors: 92, // N036 Byelka AESA
    stealth: 84, // 0.1 m² RCS
    maneuverability: 98, // 3D thrust vectoring extreme post-stall
    range: 3500,
    info: 'Super-maneuverable twin-engine stealth aircraft equipped with directed infrared countermeasures and cheek radars.',
    groundPower: 75,
    groundResistance: 86,
    attackRange: 190, // km (R-37M / K-77M)
    imageUrl: 'https://images.unsplash.com/photo-1559628233-eb1b1a45564b?w=800&auto=format&fit=crop&q=80',
    fireRate: 7,
    price: 110000000,
    countryOrigin: 'RU',
  },
  {
    id: 'af-f35a',
    aircraft: 'F-35A Lightning II',
    aircraftType: '5th Gen Multi-Role Stealth Strike Fighter',
    armor: 820,
    speed: 1960, // km/h (Mach 1.6)
    airAttackPower: 92,
    airResistance: 84,
    weaponCapacity: 6, // internal stealth bay
    sensors: 100, // AN/APG-81 AESA + EOTS + DAS 360 sensor fusion
    stealth: 97,
    maneuverability: 82,
    range: 2220,
    info: 'Premier flying tactical supercomputer with unmatched sensor fusion, electronic attack, and battlefield networking.',
    groundPower: 95,
    groundResistance: 85,
    attackRange: 160,
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    fireRate: 6,
    price: 82500000,
    countryOrigin: 'US',
  },
  {
    id: 'af-j20',
    aircraft: 'Chengdu J-20 Mighty Dragon',
    aircraftType: '5th Gen Heavy Stealth Interceptor',
    armor: 910,
    speed: 2470, // km/h (Mach 2.0)
    airAttackPower: 95,
    airResistance: 87,
    weaponCapacity: 8, // PL-15 + PL-10
    sensors: 95, // Type 1475 AESA
    stealth: 94,
    maneuverability: 90, // Canards + delta wing
    range: 4000,
    info: 'Long-range air superiority interceptor designed for BVR engagement of enemy tankers, AWACS, and strike escorts.',
    groundPower: 60,
    groundResistance: 84,
    attackRange: 200, // km (PL-15 dual-pulse motor)
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    fireRate: 8,
    price: 120000000,
    countryOrigin: 'CN',
  },
  {
    id: 'af-typhoon',
    aircraft: 'Eurofighter Typhoon Tranche 4',
    aircraftType: '4.5+ Gen Swing-Role Air Superiority Fighter',
    armor: 800,
    speed: 2495, // km/h (Mach 2.0)
    airAttackPower: 93,
    airResistance: 82,
    weaponCapacity: 10,
    sensors: 91, // Captor-E AESA
    stealth: 65, // Low-observable frontal profile
    maneuverability: 95, // Canard delta delta-agility
    range: 2900,
    info: 'Extremely agile delta-canard fighter armed with ramjet-powered Meteor BVR missiles with unrivaled no-escape zones.',
    groundPower: 80,
    groundResistance: 79,
    attackRange: 200, // Meteor Ramjet
    imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3b4a450710?w=800&auto=format&fit=crop&q=80',
    fireRate: 9,
    price: 105000000,
    countryOrigin: 'GB',
  },
  {
    id: 'af-rafale',
    aircraft: 'Dassault Rafale F4',
    aircraftType: '4.5+ Gen Omnirole Combat Fighter',
    armor: 790,
    speed: 2220, // Mach 1.8
    airAttackPower: 91,
    airResistance: 86, // SPECTRA EW system
    weaponCapacity: 14, // 14 hardpoints
    sensors: 93, // RBE2 AESA + FSO
    stealth: 68,
    maneuverability: 94,
    range: 3700,
    info: 'Combat-proven omnirole aircraft featuring SPECTRA integrated self-defense EW suit, Meteor, and ASMP-A deterrence.',
    groundPower: 92,
    groundResistance: 83,
    attackRange: 180,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    fireRate: 8,
    price: 115000000,
    countryOrigin: 'FR',
  },
  {
    id: 'af-b21',
    aircraft: 'B-21 Raider',
    aircraftType: '6th Gen Deep-Penetrating Stealth Bomber',
    armor: 1400,
    speed: 1050, // High subsonic stealth
    airAttackPower: 50,
    airResistance: 96,
    weaponCapacity: 24, // Internal rotary launchers
    sensors: 99,
    stealth: 100, // Near-zero radar cross-section
    maneuverability: 55,
    range: 9500,
    info: 'Next-generation stealth strategic bomber capable of penetrating the densest anti-access area-denial (A2/AD) networks.',
    groundPower: 100,
    groundResistance: 95,
    attackRange: 900, // Stand-off JASSM-ER / LRASM
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    fireRate: 4,
    price: 692000000,
    countryOrigin: 'US',
  },
];

export const SEEDED_NAVY: NavyUnit[] = [
  {
    id: 'nv-ddg51',
    unit: 'Arleigh Burke Flight III (DDG-125)',
    unitType: 'Aegis Guided-Missile Destroyer',
    armor: 4200,
    speed: 56, // knots (30+ knots)
    groundAttackPower: 92,
    groundResistance: 88,
    airAttackPower: 98,
    airResistance: 94,
    weaponCapacity: 96, // 96-cell Mk 41 VLS
    sensors: 99, // AN/SPY-6(V)1 AMDR
    stealth: 72,
    maneuverability: 60,
    range: 8100,
    info: 'Premier multi-mission surface combatant with SPY-6 radar and baseline 10 Aegis combat system.',
    attackRange: 370, // SM-6 / Tomahawk range
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    fireRate: 16,
    price: 2200000000,
    countryOrigin: 'US',
  },
  {
    id: 'nv-type055',
    unit: 'Type 055 Renhai-Class',
    unitType: 'Guided-Missile Heavy Cruiser',
    armor: 4800,
    speed: 55,
    groundAttackPower: 96,
    groundResistance: 90,
    airAttackPower: 97,
    airResistance: 93,
    weaponCapacity: 112, // 112 universal VLS cells
    sensors: 97, // Dual-band S/X AESA
    stealth: 78,
    maneuverability: 58,
    range: 9200,
    info: 'World-class surface combatant armed with YJ-21 hypersonic anti-ship ballistic missiles and HQ-9B long-range SAMs.',
    attackRange: 400,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    fireRate: 18,
    price: 1800000000,
    countryOrigin: 'CN',
  },
  {
    id: 'nv-virginia',
    unit: 'Virginia-Class Block V (SSN-802)',
    unitType: 'Nuclear Fast-Attack Submarine',
    armor: 3600,
    speed: 65, // submerged knots
    groundAttackPower: 95,
    groundResistance: 96,
    airAttackPower: 40,
    airResistance: 80,
    weaponCapacity: 65, // VPM modules (28 extra Tomahawks) + torpedoes
    sensors: 98, // Large Aperture Bow sonar
    stealth: 98, // Anechoic acoustic tiles
    maneuverability: 75,
    range: 25000, // Unlimited nuclear core
    info: 'Silent predator fitted with the Virginia Payload Module (VPM) capable of delivering 65 heavy munitions covertly.',
    attackRange: 1600, // TLAM Block V
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    fireRate: 6,
    price: 3450000000,
    countryOrigin: 'US',
  },
  {
    id: 'nv-gerald-ford',
    unit: 'USS Gerald R. Ford (CVN-78)',
    unitType: 'Nuclear Aircraft Carrier',
    armor: 9800,
    speed: 56,
    groundAttackPower: 100,
    groundResistance: 94,
    airAttackPower: 99,
    airResistance: 96,
    weaponCapacity: 85, // 85+ strike aircraft & drones
    sensors: 99, // Dual Band Radar (DBR)
    stealth: 35,
    maneuverability: 45,
    range: 40000,
    info: 'Flagship supercarrier featuring EMALS electromagnetic catapults, AAG arresting gear, and 160 sorties per day.',
    attackRange: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    fireRate: 24,
    price: 13300000000,
    countryOrigin: 'US',
  },
];

export const SEEDED_GROUND: GroundUnit[] = [
  {
    id: 'gd-m1a2sep3',
    unit: 'M1A2 SEPv3 Abrams',
    unitType: 'Main Battle Tank',
    armor: 1850,
    speed: 68, // km/h
    groundAttackPower: 96,
    groundResistance: 95,
    airAttackPower: 25,
    airResistance: 60,
    weaponCapacity: 42, // 120mm depleted uranium rounds
    sensors: 92, // 3rd Gen FLIR
    stealth: 40,
    maneuverability: 76,
    range: 426,
    info: 'Modernized heavy battle tank equipped with Trophy Active Protection System (APS) and programmable airburst munitions.',
    attackRange: 4.5, // km
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    fireRate: 10,
    price: 12500000,
    countryOrigin: 'US',
  },
  {
    id: 'gd-leopard2a8',
    unit: 'Leopard 2A8',
    unitType: 'Main Battle Tank',
    armor: 1900,
    speed: 72,
    groundAttackPower: 97,
    groundResistance: 96,
    airAttackPower: 28,
    airResistance: 62,
    weaponCapacity: 42,
    sensors: 94,
    stealth: 42,
    maneuverability: 80,
    range: 450,
    info: 'German engineering benchmark with advanced multilayer composite armor, EuroTrophy APS, and Rheinmetall L55A1 gun.',
    attackRange: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    fireRate: 11,
    price: 14000000,
    countryOrigin: 'DE',
  },
  {
    id: 'gd-t90m',
    unit: 'T-90M Proryv-3',
    unitType: 'Main Battle Tank',
    armor: 1720,
    speed: 60,
    groundAttackPower: 93,
    groundResistance: 91,
    airAttackPower: 22,
    airResistance: 58,
    weaponCapacity: 40,
    sensors: 88, // Kalina fire control
    stealth: 45,
    maneuverability: 74,
    range: 550,
    info: 'Heavily upgraded Russian battle tank with Relikt explosive reactive armor and 2A46M-5 cannon firing Refleks ATGMs.',
    attackRange: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    fireRate: 9,
    price: 4500000,
    countryOrigin: 'RU',
  },
  {
    id: 'gd-m270mlrs',
    unit: 'M270A2 MLRS',
    unitType: 'Armored Multiple Launch Rocket System',
    armor: 950,
    speed: 64,
    groundAttackPower: 100,
    groundResistance: 78,
    airAttackPower: 10,
    airResistance: 50,
    weaponCapacity: 12, // 12 GMLRS rockets or 2 PrSM missiles
    sensors: 90,
    stealth: 30,
    maneuverability: 60,
    range: 480,
    info: 'Full-tracked, self-propelled launcher firing GPS-guided precision rockets and Precision Strike Missiles up to 500 km.',
    attackRange: 150, // km (GMLRS-ER)
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    fireRate: 12,
    price: 8000000,
    countryOrigin: 'US',
  },
];

export const SEEDED_MISSILES: MissileUnit[] = [
  {
    id: 'ms-aim120d',
    missile: 'AIM-120D AMRAAM',
    missileType: 'Beyond-Visual-Range Air-to-Air Missile (BVRAAM)',
    speed: 4900, // Mach 4+
    range: 160, // km
    warhead: '20 kg High-Explosive Blast-Fragmentation',
    targetClass: 'Air Superiority Fighters, Bombers, Drones',
    price: 1300000,
    info: 'Two-way datalink, GPS-aided IMU, high off-boresight HOBS capability, and tight active radar terminal seeker.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    missileClass: 'Air-to-Air',
    countryOrigin: 'US',
  },
  {
    id: 'ms-meteor',
    missile: 'Meteor BVRAAM',
    missileType: 'Ramjet-Powered Beyond-Visual-Range Air-to-Air Missile',
    speed: 5100, // Mach 4.2+
    range: 200, // km
    warhead: 'Blast-Fragmentation with Proximity Fuze',
    targetClass: 'Air Supremacy, Fast Stealth Jets, Cruise Missiles',
    price: 2200000,
    info: 'Throttleable ducted ramjet engine delivers unmatched sustained kinetic energy in the terminal endgame no-escape zone.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    missileClass: 'Air-to-Air',
    countryOrigin: 'EU',
  },
  {
    id: 'ms-pl15',
    missile: 'PL-15 Long-Range AAM',
    missileType: 'Dual-Pulse Motor Air-to-Air Missile',
    speed: 4900, // Mach 4
    range: 200, // km
    warhead: 'HE Fragmentation',
    targetClass: 'High-Value Aerial Assets, Fighters',
    price: 1800000,
    info: 'AESA radar seeker paired with two-stage dual-pulse solid rocket motor designed to deny airspace to AWACS and tankers.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    missileClass: 'Air-to-Air',
    countryOrigin: 'CN',
  },
  {
    id: 'ms-kinzhal',
    missile: 'Kh-47M2 Kinzhal',
    missileType: 'Hypersonic Aero-Ballistic Strike Missile',
    speed: 12250, // Mach 10
    range: 2000, // km
    warhead: '500 kg High-Explosive Penetrating / Nuclear',
    targetClass: 'Command Bunkers, Aircraft Carriers, Airbases',
    price: 4500000,
    info: 'Air-launched hypersonic missile capable of erratic terminal maneuvers to bypass all ground-based anti-ballistic shields.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    missileClass: 'Hypersonic',
    countryOrigin: 'RU',
  },
  {
    id: 'ms-tomahawk',
    missile: 'Tomahawk Block V',
    missileType: 'Subsonic Land-Attack / Maritime Strike Cruise Missile',
    speed: 880, // Mach 0.72
    range: 1650, // km
    warhead: '1000 lb WDU-36/B High-Explosive Penetrator',
    targetClass: 'Hardened Command Posts, Infrastructure, Warships',
    price: 2000000,
    info: 'Precision long-range strike weapon featuring two-way satellite comms, real-time in-flight retargeting, and multi-mode seeker.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    missileClass: 'Cruise',
    countryOrigin: 'US',
  },
];

export const SEEDED_EQUIPMENT: EquipmentUnit[] = [
  {
    id: 'eq-trophy-aps',
    equipment: 'Trophy Active Protection System (APS)',
    equipmentType: 'Vehicle Countermeasure System',
    weight: 850, // kg
    protectionPower: 98,
    effectiveRange: 0.05, // km (intercepts at close perimeter)
    price: 350000,
    info: 'Hard-kill APS that detects incoming RPGs and ATGMs with 360-degree radar and fires explosive MEFP pellets to destroy them.',
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'eq-envg-b',
    equipment: 'ENVG-B Enhanced Night Vision Goggle',
    equipmentType: 'Infantry Optronics & Augmented Reality',
    weight: 1.1, // kg
    protectionPower: 85,
    effectiveRange: 0.3, // km
    price: 40000,
    info: 'Dual-waveband thermal fusion goggle with Rapid Target Acquisition (RTA) linked to wireless weapon sights.',
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'eq-black-hornet',
    equipment: 'Black Hornet 4 Nano-UAV',
    equipmentType: 'Micro-Reconnaissance Drone',
    weight: 0.07, // kg (70g)
    protectionPower: 70,
    effectiveRange: 2.0, // km
    price: 65000,
    info: 'Pocket-sized micro reconnaissance drone delivering live full-motion thermal & electro-optical video over encrypted data-link.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'eq-modular-exoskeleton',
    equipment: 'Titan Load-Bearing Combat Exoskeleton',
    equipmentType: 'Powered Infantry Augmentation',
    weight: 12.5, // kg
    protectionPower: 90,
    effectiveRange: 0,
    price: 120000,
    info: 'Carbon-fiber motorized lower-body exoskeleton transferring 90% of heavy pack & ballistic shield weight off soldiers.',
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
  },
];

export const SEEDED_ELECTRONIC_SYSTEMS: ElectronicSystemUnit[] = [
  {
    id: 'es-an-apg81',
    system: 'AN/APG-81 Active Electronically Scanned Array',
    systemType: 'Airborne Fire Control & Electronic Attack Radar',
    detectionRange: 220, // km
    jammingRange: 150, // km
    tracking: 98,
    stealthDetection: 88,
    price: 18000000,
    platform: 'F-35 Lightning II',
    info: 'Next-gen solid-state AESA capable of simultaneous high-resolution SAR ground mapping, air intercept, and directional cyber jamming.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'es-krasukha4',
    system: 'Krasukha-4 Ground Jamming Complex',
    systemType: 'Mobile Strategic Electronic Warfare Complex',
    detectionRange: 300, // km
    jammingRange: 250, // km
    tracking: 92,
    stealthDetection: 85,
    price: 24000000,
    platform: 'KAMAZ 8x8 Heavy Truck',
    info: 'Suppresses AWACS, airborne radars, and spy satellites, creating large radar blackouts shielding ground forces.',
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'es-alq249',
    system: 'AN/ALQ-249 Next Generation Jammer (NGJ-MB)',
    systemType: 'Airborne Tactical High-Power Escort Jammer',
    detectionRange: 260, // km
    jammingRange: 200, // km
    tracking: 96,
    stealthDetection: 92,
    price: 32000000,
    platform: 'EA-18G Growler',
    info: 'Gallium Nitride (GaN) active electronic attack pods that dismantle integrated air defense command frequencies.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },
];

export const SEEDED_LAUNCHERS: LauncherUnit[] = [
  {
    id: 'ln-patriot-pac3',
    launcher: 'M903 Patriot PAC-3 MSE Launcher',
    speed: 5500, // Mach 4.5+ intercept speed
    fireRate: 16, // 16 PAC-3 MSE missiles per station
    missileClass: 'Hit-to-Kill Kinetic SAM / ABM',
    radar: 99, // AN/MPQ-65A Radar
    price: 45000000,
    info: 'Combat-proven surface-to-air missile battery capable of intercepting tactical ballistic, hypersonic, and cruise missiles.',
  },
  {
    id: 'ln-s400',
    launcher: '5P85TE2 S-400 Triumf TEL',
    speed: 5800, // Mach 4.8
    fireRate: 8, // 4-8 dual canisters
    missileClass: 'Very-Long-Range SAM / Anti-Aircraft / Ballistic',
    radar: 98, // 91N6E Big Bird + 92N6E Grave Stone
    price: 52000000,
    info: 'Multi-layered air defense system employing 40N6 (400 km) and 48N6DM missiles to blanket broad airspace corridors.',
  },
  {
    id: 'ln-iron-dome',
    launcher: 'Tamir Iron Dome Battery',
    speed: 2800, // Mach 2.2
    fireRate: 20, // 20 Tamir interceptors per launcher
    missileClass: 'C-RAM / Drone / Short-Range Defense',
    radar: 96, // EL/M-2084 MMR
    price: 25000000,
    info: 'World benchmark for high-volume rocket, artillery, mortar, and loitering munition interception with over 90% success.',
  },
];

// ============================================================================
// AIRTABLE LIVE SYNC & RECORD MAPPER SERVICE
// ============================================================================

export interface AirtableSyncConfig {
  apiKey?: string;
  baseId?: string;
  autoSync?: boolean;
}

export class MilitaryAirtableService {
  private static STORAGE_KEY = 'base_warfare_airtable_config';
  private static AIR_FORCE_KEY = 'base_warfare_airtable_af';
  private static NAVY_KEY = 'base_warfare_airtable_navy';
  private static GROUND_KEY = 'base_warfare_airtable_ground';
  private static MISSILES_KEY = 'base_warfare_airtable_missiles';
  private static EQUIPMENT_KEY = 'base_warfare_airtable_equipment';
  private static ELECTRONIC_KEY = 'base_warfare_airtable_electronic';
  private static LAUNCHERS_KEY = 'base_warfare_airtable_launchers';

  public static getConfig(): AirtableSyncConfig {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      apiKey: '',
      baseId: 'appMilitaryBase2026',
      autoSync: false,
    };
  }

  public static saveConfig(cfg: AirtableSyncConfig) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cfg));
  }

  // Load air force data from local storage or seeded
  public static getAirForceUnits(): AirForceUnit[] {
    const saved = localStorage.getItem(this.AIR_FORCE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_AIR_FORCE;
  }

  public static getNavyUnits(): NavyUnit[] {
    const saved = localStorage.getItem(this.NAVY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_NAVY;
  }

  public static getGroundUnits(): GroundUnit[] {
    const saved = localStorage.getItem(this.GROUND_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_GROUND;
  }

  public static getMissiles(): MissileUnit[] {
    const saved = localStorage.getItem(this.MISSILES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_MISSILES;
  }

  public static getEquipment(): EquipmentUnit[] {
    const saved = localStorage.getItem(this.EQUIPMENT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_EQUIPMENT;
  }

  public static getElectronicSystems(): ElectronicSystemUnit[] {
    const saved = localStorage.getItem(this.ELECTRONIC_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_ELECTRONIC_SYSTEMS;
  }

  public static getLaunchers(): LauncherUnit[] {
    const saved = localStorage.getItem(this.LAUNCHERS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SEEDED_LAUNCHERS;
  }

  // Save changes
  public static saveAirForceUnits(units: AirForceUnit[]) {
    localStorage.setItem(this.AIR_FORCE_KEY, JSON.stringify(units));
  }

  // Fetch from live Airtable REST API if user configured PAT and Base ID
  public static async fetchFromAirtable(tableId: string): Promise<any[] | null> {
    const config = this.getConfig();
    if (!config.apiKey || !config.baseId) return null;

    try {
      const url = `https://api.airtable.com/v0/${config.baseId}/${tableId}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Airtable API error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data.records || [];
    } catch (err) {
      console.warn('Failed to fetch from Airtable:', err);
      return null;
    }
  }
}
