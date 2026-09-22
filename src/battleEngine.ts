// ============================================================================
// BATTLE ENGINE: AIR-VS-AIR & THEATER COMBAT SIMULATOR
// ============================================================================
// Implements the exact 10-field Air-vs-Air rule sequence:
// Armor → Speed → Air Attack Power → Air Resistance → Weapon Capacity → 
// Sensors → Stealth → Maneuverability → Attack Range → Fire Rate
// ============================================================================

import { AirForceUnit, MissileUnit, ElectronicSystemUnit } from './militaryAirtableDatabase';

export interface CombatantState {
  unit: AirForceUnit;
  callsign: string;
  side: 'blue' | 'red';
  currentArmor: number;
  maxArmor: number;
  remainingAmmo: number;
  equippedMissile?: MissileUnit;
  equippedSystem?: ElectronicSystemUnit;
}

export interface SimulationStepLog {
  stepName: 'Sensors' | 'Stealth' | 'Attack Range' | 'Speed' | 'Weapon Capacity' | 'Fire Rate' | 'Air Attack Power' | 'Maneuverability' | 'Air Resistance' | 'Armor';
  description: string;
  detail: string;
  metricA: string;
  metricB: string;
  value: number;
}

export interface SimulationRound {
  roundNumber: number;
  distanceKm: number;
  phaseName: 'BVR Long-Range Intercept' | 'Mid-Course Clashing' | 'Merge & Within-Visual-Range Dogfight' | 'Terminal Guns & Quick Draw';
  attackerSalvo: {
    side: 'blue' | 'red';
    unitName: string;
    munitionsFired: number;
    hitsLanded: number;
    evadedCount: number;
    damageMitigated: number;
    hullDamageDealt: number;
  };
  defenderSalvo: {
    side: 'blue' | 'red';
    unitName: string;
    munitionsFired: number;
    hitsLanded: number;
    evadedCount: number;
    damageMitigated: number;
    hullDamageDealt: number;
  };
  blueArmorAfter: number;
  redArmorAfter: number;
  blueAmmoAfter: number;
  redAmmoAfter: number;
  logs: SimulationStepLog[];
  radarSummary: string;
}

export interface BattleSimulationResult {
  blueUnit: AirForceUnit;
  redUnit: AirForceUnit;
  winner: 'blue' | 'red' | 'draw';
  winningReason: string;
  rounds: SimulationRound[];
  totalRounds: number;
  blueInitialArmor: number;
  blueRemainingArmor: number;
  redInitialArmor: number;
  redRemainingArmor: number;
  combatEfficiency: {
    blueHitRate: number;
    redHitRate: number;
    blueDamageDealt: number;
    redDamageDealt: number;
    blueMitigated: number;
    redMitigated: number;
  };
}

export class AirBattleEngine {
  /**
   * Run full air-vs-air dogfight / BVR engagement simulation adhering to the exact 10 rule parameters:
   * Armor → Speed → Air Attack Power → Air Resistance → Weapon Capacity → 
   * Sensors → Stealth → Maneuverability → Attack Range → Fire Rate
   */
  public static simulateEngagement(
    blueUnit: AirForceUnit,
    redUnit: AirForceUnit,
    blueMissile?: MissileUnit,
    redMissile?: MissileUnit,
    blueSys?: ElectronicSystemUnit,
    redSys?: ElectronicSystemUnit
  ): BattleSimulationResult {
    // 1. Initialize combatants with full Armor and Weapon Capacity
    const blue: CombatantState = {
      unit: blueUnit,
      callsign: `BLUE-1 (${blueUnit.aircraft})`,
      side: 'blue',
      currentArmor: blueUnit.armor,
      maxArmor: blueUnit.armor,
      remainingAmmo: blueUnit.weaponCapacity,
      equippedMissile: blueMissile,
      equippedSystem: blueSys,
    };

    const red: CombatantState = {
      unit: redUnit,
      callsign: `RED-1 (${redUnit.aircraft})`,
      side: 'red',
      currentArmor: redUnit.armor,
      maxArmor: redUnit.armor,
      remainingAmmo: redUnit.weaponCapacity,
      equippedMissile: redMissile,
      equippedSystem: redSys,
    };

    const rounds: SimulationRound[] = [];
    let currentDistance = Math.max(blueUnit.attackRange, redUnit.attackRange);
    let roundIndex = 1;
    const maxRounds = 8;

    let totalBlueHits = 0;
    let totalBlueFired = 0;
    let totalBlueDamage = 0;
    let totalBlueMitigated = 0;

    let totalRedHits = 0;
    let totalRedFired = 0;
    let totalRedDamage = 0;
    let totalRedMitigated = 0;

    // Simulation loop while both combatants are flight-worthy
    while (blue.currentArmor > 0 && red.currentArmor > 0 && roundIndex <= maxRounds) {
      const stepLogs: SimulationStepLog[] = [];

      // Determine flight phase from distance
      let phaseName: SimulationRound['phaseName'] = 'BVR Long-Range Intercept';
      if (currentDistance > 100) {
        phaseName = 'BVR Long-Range Intercept';
      } else if (currentDistance > 45) {
        phaseName = 'Mid-Course Clashing';
      } else if (currentDistance > 15) {
        phaseName = 'Merge & Within-Visual-Range Dogfight';
      } else {
        phaseName = 'Terminal Guns & Quick Draw';
      }

      // ======================================================================
      // RULE STEP: SENSORS vs STEALTH (Radar lock & acquisition)
      // ======================================================================
      const blueSensorsBonus = blue.equippedSystem ? blue.equippedSystem.tracking * 0.1 : 0;
      const redSensorsBonus = red.equippedSystem ? red.equippedSystem.tracking * 0.1 : 0;

      const effectiveBlueSensors = blue.unit.sensors + blueSensorsBonus;
      const effectiveRedSensors = red.unit.sensors + redSensorsBonus;

      // Lock score: Sensors burn through enemy Stealth
      const blueLockScore = Math.max(10, effectiveBlueSensors * (120 - red.unit.stealth) / 100);
      const redLockScore = Math.max(10, effectiveRedSensors * (120 - blue.unit.stealth) / 100);

      stepLogs.push({
        stepName: 'Sensors',
        description: 'AESA Radar & Electro-Optical Sweep',
        detail: `${blue.callsign} radar output ${effectiveBlueSensors.toFixed(0)} vs ${red.callsign} radar ${effectiveRedSensors.toFixed(0)}.`,
        metricA: `Sensors: ${effectiveBlueSensors.toFixed(0)}`,
        metricB: `Sensors: ${effectiveRedSensors.toFixed(0)}`,
        value: Math.round(blueLockScore),
      });

      stepLogs.push({
        stepName: 'Stealth',
        description: 'Radar Cross Section & Thermal Suppression',
        detail: `${blue.unit.aircraft} RCS Stealth (${blue.unit.stealth}%) vs ${red.unit.aircraft} RCS Stealth (${red.unit.stealth}%).`,
        metricA: `Stealth: ${blue.unit.stealth}%`,
        metricB: `Stealth: ${red.unit.stealth}%`,
        value: blue.unit.stealth - red.unit.stealth,
      });

      // ======================================================================
      // RULE STEP: ATTACK RANGE
      // ======================================================================
      const blueEffectiveRange = blue.equippedMissile ? Math.max(blue.unit.attackRange, blue.equippedMissile.range) : blue.unit.attackRange;
      const redEffectiveRange = red.equippedMissile ? Math.max(red.unit.attackRange, red.equippedMissile.range) : red.unit.attackRange;

      const blueCanFire = currentDistance <= blueEffectiveRange && blue.remainingAmmo > 0;
      const redCanFire = currentDistance <= redEffectiveRange && red.remainingAmmo > 0;

      stepLogs.push({
        stepName: 'Attack Range',
        description: 'Engagement Distance Verification',
        detail: `Separation: ${currentDistance.toFixed(1)} km. Blue envelope: ${blueEffectiveRange} km. Red envelope: ${redEffectiveRange} km.`,
        metricA: `Range: ${blueEffectiveRange} km`,
        metricB: `Range: ${redEffectiveRange} km`,
        value: currentDistance,
      });

      // ======================================================================
      // RULE STEP: SPEED (Closure rate & tactical positioning)
      // ======================================================================
      // High speed allows dictate of distance & positioning angle
      const speedDiff = blue.unit.speed - red.unit.speed;
      const avgMach = ((blue.unit.speed + red.unit.speed) / 2) / 1225;
      const closureKmPerRound = Math.max(25, (avgMach * 35));

      stepLogs.push({
        stepName: 'Speed',
        description: 'Kinematic Closure & Energy Advantage',
        detail: `${blue.unit.aircraft} (${blue.unit.speed} km/h) closing on ${red.unit.aircraft} (${red.unit.speed} km/h). Closure velocity: Mach ${avgMach.toFixed(2)}.`,
        metricA: `${blue.unit.speed} km/h`,
        metricB: `${red.unit.speed} km/h`,
        value: speedDiff,
      });

      // ======================================================================
      // RULE STEP: WEAPON CAPACITY & FIRE RATE
      // ======================================================================
      // Blue fires:
      const blueSalvoSize = blueCanFire ? Math.min(blue.unit.fireRate, blue.remainingAmmo) : 0;
      blue.remainingAmmo -= blueSalvoSize;
      totalBlueFired += blueSalvoSize;

      // Red fires:
      const redSalvoSize = redCanFire ? Math.min(red.unit.fireRate, red.remainingAmmo) : 0;
      red.remainingAmmo -= redSalvoSize;
      totalRedFired += redSalvoSize;

      stepLogs.push({
        stepName: 'Weapon Capacity',
        description: 'Munition Bay Status',
        detail: `${blue.callsign} holds ${blue.remainingAmmo}/${blue.unit.weaponCapacity} rounds. ${red.callsign} holds ${red.remainingAmmo}/${red.unit.weaponCapacity} rounds.`,
        metricA: `${blue.remainingAmmo} left`,
        metricB: `${red.remainingAmmo} left`,
        value: blue.remainingAmmo,
      });

      stepLogs.push({
        stepName: 'Fire Rate',
        description: 'Salvo Discharge Volume',
        detail: `Blue unleashed ${blueSalvoSize} projectiles/missiles. Red unleashed ${redSalvoSize} projectiles/missiles.`,
        metricA: `${blueSalvoSize} fired`,
        metricB: `${redSalvoSize} fired`,
        value: blueSalvoSize - redSalvoSize,
      });

      // ======================================================================
      // RULE STEP: AIR ATTACK POWER & MANEUVERABILITY (Evasion)
      // ======================================================================
      // Blue's attack on Red:
      const blueAttackPower = blue.unit.airAttackPower + (blue.equippedMissile ? 10 : 0);
      const redManeuver = red.unit.maneuverability;
      // Probability of evading incoming shot based on target Maneuverability vs Attacker Sensor Lock
      const redEvadeRate = Math.min(0.75, (redManeuver * 0.6) / (redManeuver * 0.6 + blueLockScore * 0.4));
      let blueHits = 0;
      for (let i = 0; i < blueSalvoSize; i++) {
        if (Math.random() > redEvadeRate) {
          blueHits++;
        }
      }
      const redEvaded = blueSalvoSize - blueHits;

      // Red's attack on Blue:
      const redAttackPower = red.unit.airAttackPower + (red.equippedMissile ? 10 : 0);
      const blueManeuver = blue.unit.maneuverability;
      const blueEvadeRate = Math.min(0.75, (blueManeuver * 0.6) / (blueManeuver * 0.6 + redLockScore * 0.4));
      let redHits = 0;
      for (let i = 0; i < redSalvoSize; i++) {
        if (Math.random() > blueEvadeRate) {
          redHits++;
        }
      }
      const blueEvaded = redSalvoSize - redHits;

      totalBlueHits += blueHits;
      totalRedHits += redHits;

      stepLogs.push({
        stepName: 'Maneuverability',
        description: 'High-G Defensive Break-Turn & Chaff Dispensation',
        detail: `${red.unit.aircraft} agility (${redManeuver}) evaded ${redEvaded}/${blueSalvoSize} incoming rounds. ${blue.unit.aircraft} agility (${blueManeuver}) evaded ${blueEvaded}/${redSalvoSize} incoming rounds.`,
        metricA: `Agility ${blueManeuver}`,
        metricB: `Agility ${redManeuver}`,
        value: blueHits - redHits,
      });

      stepLogs.push({
        stepName: 'Air Attack Power',
        description: 'Kinetic & Warhead Damage Delivery',
        detail: `Blue warhead rating ${blueAttackPower} resulted in ${blueHits} direct impact(s). Red warhead rating ${redAttackPower} resulted in ${redHits} direct impact(s).`,
        metricA: `Power: ${blueAttackPower}`,
        metricB: `Power: ${redAttackPower}`,
        value: blueAttackPower,
      });

      // ======================================================================
      // RULE STEP: AIR RESISTANCE & ARMOR (Damage mitigation & structural integrity)
      // ======================================================================
      // Red mitigates incoming damage via Air Resistance:
      const redMitigationPerHit = Math.round(red.unit.airResistance * 0.55);
      const rawDamageToRed = blueHits * blueAttackPower * 1.8;
      const totalRedMitigatedAmount = Math.min(rawDamageToRed * 0.5, blueHits * redMitigationPerHit);
      const netDamageToRed = Math.max(blueHits > 0 ? 15 : 0, Math.round(rawDamageToRed - totalRedMitigatedAmount));

      // Blue mitigates incoming damage via Air Resistance:
      const blueMitigationPerHit = Math.round(blue.unit.airResistance * 0.55);
      const rawDamageToBlue = redHits * redAttackPower * 1.8;
      const totalBlueMitigatedAmount = Math.min(rawDamageToBlue * 0.5, redHits * blueMitigationPerHit);
      const netDamageToBlue = Math.max(redHits > 0 ? 15 : 0, Math.round(rawDamageToBlue - totalBlueMitigatedAmount));

      totalBlueDamage += netDamageToRed;
      totalBlueMitigated += totalBlueMitigatedAmount;
      totalRedDamage += netDamageToBlue;
      totalRedMitigated += totalRedMitigatedAmount;

      red.currentArmor = Math.max(0, red.currentArmor - netDamageToRed);
      blue.currentArmor = Math.max(0, blue.currentArmor - netDamageToBlue);

      stepLogs.push({
        stepName: 'Air Resistance',
        description: 'Countermeasure & Skin Heat Dissipation',
        detail: `${red.unit.aircraft} Air Resistance (${red.unit.airResistance}) absorbed ${totalRedMitigatedAmount.toFixed(0)} kinetic damage. ${blue.unit.aircraft} Air Resistance (${blue.unit.airResistance}) absorbed ${totalBlueMitigatedAmount.toFixed(0)} kinetic damage.`,
        metricA: `Resist: ${blue.unit.airResistance}`,
        metricB: `Resist: ${red.unit.airResistance}`,
        value: red.unit.airResistance - blue.unit.airResistance,
      });

      stepLogs.push({
        stepName: 'Armor',
        description: 'Hull Integrity Assessment',
        detail: `Blue Hull: ${blue.currentArmor.toFixed(0)} / ${blue.maxArmor} (${((blue.currentArmor / blue.maxArmor) * 100).toFixed(0)}%). Red Hull: ${red.currentArmor.toFixed(0)} / ${red.maxArmor} (${((red.currentArmor / red.maxArmor) * 100).toFixed(0)}%).`,
        metricA: `${blue.currentArmor.toFixed(0)} HP`,
        metricB: `${red.currentArmor.toFixed(0)} HP`,
        value: blue.currentArmor - red.currentArmor,
      });

      rounds.push({
        roundNumber: roundIndex,
        distanceKm: currentDistance,
        phaseName,
        attackerSalvo: {
          side: 'blue',
          unitName: blue.unit.aircraft,
          munitionsFired: blueSalvoSize,
          hitsLanded: blueHits,
          evadedCount: redEvaded,
          damageMitigated: totalRedMitigatedAmount,
          hullDamageDealt: netDamageToRed,
        },
        defenderSalvo: {
          side: 'red',
          unitName: red.unit.aircraft,
          munitionsFired: redSalvoSize,
          hitsLanded: redHits,
          evadedCount: blueEvaded,
          damageMitigated: totalBlueMitigatedAmount,
          hullDamageDealt: netDamageToBlue,
        },
        blueArmorAfter: blue.currentArmor,
        redArmorAfter: red.currentArmor,
        blueAmmoAfter: blue.remainingAmmo,
        redAmmoAfter: red.remainingAmmo,
        logs: stepLogs,
        radarSummary: `Phase ${roundIndex} at ${currentDistance.toFixed(0)}km. Blue dealt ${netDamageToRed} HP (Red Armor: ${red.currentArmor}). Red dealt ${netDamageToBlue} HP (Blue Armor: ${blue.currentArmor}).`,
      });

      // Update distance for next round (closing in)
      currentDistance = Math.max(2, currentDistance - closureKmPerRound);
      roundIndex++;

      // If out of ammo on both sides and within merge, disengage
      if (blue.remainingAmmo === 0 && red.remainingAmmo === 0 && currentDistance < 5) {
        break;
      }
    }

    // Determine Victor
    let winner: 'blue' | 'red' | 'draw' = 'draw';
    let winningReason = 'Engagement ended in tactical separation with mutual attrition.';

    if (blue.currentArmor > 0 && red.currentArmor === 0) {
      winner = 'blue';
      winningReason = `${blue.callsign} completely overwhelmed and splashed ${red.callsign} after ${rounds.length} tactical passes.`;
    } else if (red.currentArmor > 0 && blue.currentArmor === 0) {
      winner = 'red';
      winningReason = `${red.callsign} breached ${blue.callsign} defenses and destroyed the aircraft hull.`;
    } else if (blue.currentArmor > red.currentArmor) {
      winner = 'blue';
      winningReason = `${blue.callsign} retained superior structural integrity (${blue.currentArmor} HP vs ${red.currentArmor} HP).`;
    } else if (red.currentArmor > blue.currentArmor) {
      winner = 'red';
      winningReason = `${red.callsign} inflicted greater cumulative damage (${red.currentArmor} HP vs ${blue.currentArmor} HP).`;
    }

    return {
      blueUnit,
      redUnit,
      winner,
      winningReason,
      rounds,
      totalRounds: rounds.length,
      blueInitialArmor: blue.maxArmor,
      blueRemainingArmor: blue.currentArmor,
      redInitialArmor: red.maxArmor,
      redRemainingArmor: red.currentArmor,
      combatEfficiency: {
        blueHitRate: totalBlueFired > 0 ? Math.round((totalBlueHits / totalBlueFired) * 100) : 0,
        redHitRate: totalRedFired > 0 ? Math.round((totalRedHits / totalRedFired) * 100) : 0,
        blueDamageDealt: totalBlueDamage,
        redDamageDealt: totalRedDamage,
        blueMitigated: totalBlueMitigated,
        redMitigated: totalRedMitigated,
      },
    };
  }
}
