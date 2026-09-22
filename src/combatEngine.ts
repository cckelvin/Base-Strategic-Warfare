// ============================================================================
// STAT-DRIVEN STRATEGIC COMBAT ENGINE
// ============================================================================
// Implements the user-specified 14-point universal combat specification:
// 1. Core Attacker -> Defender loop (Detect, Engage, Hit, Damage, Salvo, Losses)
// 2. Detection Probability: P_detect = clamp(0.50 + 0.005*(Sensors - Stealth), 0.10, 0.95)
//    Plus Electronic Systems: P_detect = P_base + ElectronicBonus
// 3. Engagement Range constraint: CanAttack = Detection && Distance <= AttackRange
// 4. Hit Probability: P_hit = clamp(0.50 + 0.002*(Sensors - Stealth) + 0.002*(Maneuver_A - Maneuver_D) + 0.001*(Speed_A - Speed_D), 0.05, 0.95)
// 5. Multi-Domain Damage: A2A, A2G, G2A, G2G, N2A, N2G, A2N, G2N, N2N
//    RawDamage * (100 / (100 + Defense)), DamageReduction = Defense / (100 + Defense)
// 6. Individual Unit HP = Armor. Round-by-round individual losses.
// 7. Fire-Rate: attacks/min timestep execution.
// 8. Weapon Capacity: Ammo tracking and depletion.
// 9. Survivability & Resistance mitigation.
// 10. Monte Carlo Outcome Probability: N simulated battles for true empirical P(Victory).
// ============================================================================

import {
  AirForceUnit,
  NavyUnit,
  GroundUnit,
  MissileUnit,
  ElectronicSystemUnit,
} from './militaryAirtableDatabase';

export type CombatDomain = 'air' | 'navy' | 'ground';

export type BattleType =
  | 'A2A' // Air to Air
  | 'A2G' // Air to Ground
  | 'G2A' // Ground to Air
  | 'G2G' // Ground to Ground
  | 'N2A' // Navy to Air
  | 'N2G' // Navy to Ground
  | 'A2N' // Air to Navy
  | 'G2N' // Ground to Navy
  | 'N2N'; // Navy to Navy

export type UnifiedCombatUnit = AirForceUnit | NavyUnit | GroundUnit;

export interface IndividualUnitState {
  index: number;
  callsign: string;
  maxHp: number; // HP = Armor
  currentHp: number;
  remainingAmmo: number; // WeaponCapacity
  isDestroyed: boolean;
}

export interface SquadState {
  side: 'blue' | 'red';
  unit: UnifiedCombatUnit;
  domain: CombatDomain;
  unitName: string;
  initialCount: number;
  activeCount: number;
  destroyedCount: number;
  units: IndividualUnitState[];
  equippedMissile?: MissileUnit;
  equippedSystem?: ElectronicSystemUnit;
}

export interface AttackStepLog {
  timestampSec: number;
  attackerSide: 'blue' | 'red';
  attackerName: string;
  defenderName: string;
  distanceKm: number;
  inRange: boolean;
  detected: boolean;
  pDetect: number;
  pHit: number;
  hitLanded: boolean;
  rawPower: number;
  targetResistance: number;
  mitigatedPercent: number;
  finalDamageDealt: number;
  ammoRemaining: number;
  destroyedTargetIndex?: number;
  summary: string;
}

export interface CombatRound {
  roundNumber: number;
  distanceKm: number;
  blueActiveCount: number;
  redActiveCount: number;
  blueAvgHp: number;
  redAvgHp: number;
  blueSalvoHits: number;
  redSalvoHits: number;
  blueDamageDealt: number;
  redDamageDealt: number;
  blueUnitsLostThisRound: number;
  redUnitsLostThisRound: number;
  logs: AttackStepLog[];
}

export interface DetailedBattleResult {
  battleType: BattleType;
  distanceKm: number;
  blueUnit: UnifiedCombatUnit;
  redUnit: UnifiedCombatUnit;
  blueDomain: CombatDomain;
  redDomain: CombatDomain;
  blueInitialCount: number;
  redInitialCount: number;
  blueFinalActive: number;
  redFinalActive: number;
  winner: 'blue' | 'red' | 'draw';
  winningReason: string;
  totalRounds: number;
  rounds: CombatRound[];
  // Theoretical Formula Stats
  formulaAnalysis: {
    blueDetectRate: number;
    redDetectRate: number;
    blueInRange: boolean;
    redInRange: boolean;
    blueHitProb: number;
    redHitProb: number;
    blueRawAttackPower: number;
    redRawAttackPower: number;
    blueResistanceAgainstRed: number;
    redResistanceAgainstBlue: number;
    blueDamagePerHit: number;
    redDamagePerHit: number;
    blueExpectedDamagePerShot: number;
    redExpectedDamagePerShot: number;
  };
}

export interface MonteCarloOutcome {
  iterations: number;
  blueVictories: number;
  redVictories: number;
  draws: number;
  pBlueVictory: number;
  pRedVictory: number;
  pDraw: number;
  avgRoundsToFinish: number;
  avgBlueSurvivors: number;
  avgRedSurvivors: number;
}

export class StrategicCombatEngine {
  /**
   * Determine domain from unit properties
   */
  public static getUnitDomain(unit: UnifiedCombatUnit): CombatDomain {
    if ('aircraft' in unit) return 'air';
    if ('unitType' in unit) {
      const type = (unit.unitType || '').toLowerCase();
      if (type.includes('carrier') || type.includes('destroyer') || type.includes('submarine') || type.includes('frigate') || type.includes('cruiser') || type.includes('amphibious')) {
        return 'navy';
      }
    }
    return 'ground';
  }

  /**
   * Get human readable name for a unit
   */
  public static getUnitName(unit: UnifiedCombatUnit): string {
    if ('aircraft' in unit) return unit.aircraft;
    if ('unit' in unit) return unit.unit;
    return 'Combat Unit';
  }

  /**
   * Determine exact BattleType code (e.g. A2A, A2G, N2N)
   */
  public static getBattleType(blueDomain: CombatDomain, redDomain: CombatDomain): BattleType {
    const bLetter = blueDomain === 'air' ? 'A' : blueDomain === 'navy' ? 'N' : 'G';
    const rLetter = redDomain === 'air' ? 'A' : redDomain === 'navy' ? 'N' : 'G';
    return `${bLetter}2${rLetter}` as BattleType;
  }

  /**
   * Resolve Attack Power for an attacker engaging a specific defender domain
   */
  public static resolveAttackPower(attacker: UnifiedCombatUnit, defenderDomain: CombatDomain): number {
    const aDomain = this.getUnitDomain(attacker);

    if (aDomain === 'air') {
      const air = attacker as AirForceUnit;
      if (defenderDomain === 'air') {
        return air.airAttackPower || 70;
      } else {
        // Air vs Ground or Air vs Navy
        return air.groundPower || air.airAttackPower || 75;
      }
    } else if (aDomain === 'navy') {
      const navy = attacker as NavyUnit;
      if (defenderDomain === 'air') {
        return navy.airAttackPower || 65;
      } else {
        // Navy vs Ground or Navy vs Navy
        return navy.groundAttackPower || 80;
      }
    } else {
      // Ground
      const ground = attacker as GroundUnit;
      if (defenderDomain === 'air') {
        return ground.airAttackPower || 60;
      } else {
        // Ground vs Ground or Ground vs Navy
        return ground.groundAttackPower || 75;
      }
    }
  }

  /**
   * Resolve Resistance of a defender receiving attack from an attacker domain
   */
  public static resolveResistance(defender: UnifiedCombatUnit, attackerDomain: CombatDomain): number {
    const dDomain = this.getUnitDomain(defender);

    if (dDomain === 'air') {
      const air = defender as AirForceUnit;
      return air.airResistance || 60;
    } else if (dDomain === 'navy') {
      const navy = defender as NavyUnit;
      if (attackerDomain === 'air') {
        return navy.airResistance || 65;
      } else {
        return navy.groundResistance || 75;
      }
    } else {
      // Ground
      const ground = defender as GroundUnit;
      if (attackerDomain === 'air') {
        return ground.airResistance || 60;
      } else {
        return ground.groundResistance || 70;
      }
    }
  }

  /**
   * FORMULA 2: Detection probability
   * P_detect = clamp(0.50 + 0.005 * (Sensors - Stealth), 0.10, 0.95)
   * Plus Electronic bonus
   */
  public static calculateDetectionProbability(
    attackerSensors: number,
    defenderStealth: number,
    electronicBonus: number = 0
  ): { pBase: number; pTotal: number } {
    const pBase = Math.min(0.95, Math.max(0.10, 0.50 + 0.005 * (attackerSensors - defenderStealth)));
    const pTotal = Math.min(0.98, Math.max(0.10, pBase + electronicBonus));
    return { pBase, pTotal };
  }

  /**
   * FORMULA 3: Engagement-range probability
   * If attacker has enough range: P_engage = 1.0
   * If target outside Attack Range: P_engage = 0.0
   */
  public static canEngageTarget(distanceKm: number, attackRangeKm: number): boolean {
    return distanceKm <= (attackRangeKm || 50);
  }

  /**
   * FORMULA 4: Hit probability
   * P_hit = clamp(0.50 + 0.002*(Sensors_A - Stealth_D) + 0.002*(Maneuver_A - Maneuver_D) + 0.001*(Speed_A - Speed_D), 0.05, 0.95)
   */
  public static calculateHitProbability(
    attacker: { sensors: number; maneuverability: number; speed: number },
    defender: { stealth: number; maneuverability: number; speed: number }
  ): number {
    const sDiff = (attacker.sensors || 50) - (defender.stealth || 40);
    const mDiff = (attacker.maneuverability || 50) - (defender.maneuverability || 50);
    const spdDiff = (attacker.speed || 50) - (defender.speed || 50);

    const pHit = 0.50 + 0.002 * sDiff + 0.002 * mDiff + 0.001 * spdDiff;
    return Math.min(0.95, Math.max(0.05, pHit));
  }

  /**
   * FORMULA 5 & 10: Damage & Resistance calculation
   * Damage = RawDamage * (100 / (100 + Defense))
   * DamageReduction = Defense / (100 + Defense)
   */
  public static calculateDamage(rawAttackPower: number, targetResistance: number): {
    damageReduction: number;
    finalDamage: number;
  } {
    const defense = Math.max(0, targetResistance || 0);
    const damageReduction = defense / (100 + defense);
    const finalDamage = rawAttackPower * (100 / (100 + defense));
    return {
      damageReduction,
      finalDamage: Math.max(1, Math.round(finalDamage * 10) / 10),
    };
  }

  /**
   * Initialize a Squad with individual units (HP = Armor, Ammo = WeaponCapacity)
   */
  public static createSquad(
    side: 'blue' | 'red',
    unit: UnifiedCombatUnit,
    count: number,
    missile?: MissileUnit,
    system?: ElectronicSystemUnit
  ): SquadState {
    const domain = this.getUnitDomain(unit);
    const unitName = this.getUnitName(unit);
    const baseArmor = Math.max(20, unit.armor || 60);
    const baseCapacity = Math.max(4, unit.weaponCapacity || 12);

    const individualUnits: IndividualUnitState[] = [];
    for (let i = 0; i < count; i++) {
      individualUnits.push({
        index: i + 1,
        callsign: `${side.toUpperCase()}-${i + 1}`,
        maxHp: baseArmor,
        currentHp: baseArmor,
        remainingAmmo: baseCapacity,
        isDestroyed: false,
      });
    }

    return {
      side,
      unit,
      domain,
      unitName,
      initialCount: count,
      activeCount: count,
      destroyedCount: 0,
      units: individualUnits,
      equippedMissile: missile,
      equippedSystem: system,
    };
  }

  /**
   * Run a single multi-round battle simulation according to the 14-point rulebook
   */
  public static simulateBattle(
    blueUnit: UnifiedCombatUnit,
    redUnit: UnifiedCombatUnit,
    blueCount: number = 12,
    redCount: number = 12,
    distanceKm: number = 80,
    blueMissile?: MissileUnit,
    redMissile?: MissileUnit,
    blueSys?: ElectronicSystemUnit,
    redSys?: ElectronicSystemUnit,
    maxRounds: number = 10
  ): DetailedBattleResult {
    const blueDomain = this.getUnitDomain(blueUnit);
    const redDomain = this.getUnitDomain(redUnit);
    const battleType = this.getBattleType(blueDomain, redDomain);

    const blueSquad = this.createSquad('blue', blueUnit, blueCount, blueMissile, blueSys);
    const redSquad = this.createSquad('red', redUnit, redCount, redMissile, redSys);

    // Electronic system detection bonus
    const blueElecBonus = blueSys ? (blueSys.stealthDetection || 15) * 0.003 : 0;
    const redElecBonus = redSys ? (redSys.stealthDetection || 15) * 0.003 : 0;

    // Detection rates
    const blueDetect = this.calculateDetectionProbability(blueUnit.sensors, redUnit.stealth, blueElecBonus);
    const redDetect = this.calculateDetectionProbability(redUnit.sensors, blueUnit.stealth, redElecBonus);

    // Engagement ranges
    const blueEffectiveRange = (blueMissile?.range || blueUnit.attackRange || 80);
    const redEffectiveRange = (redMissile?.range || redUnit.attackRange || 80);
    const blueInRange = this.canEngageTarget(distanceKm, blueEffectiveRange);
    const redInRange = this.canEngageTarget(distanceKm, redEffectiveRange);

    // Hit probabilities
    const blueHitProb = this.calculateHitProbability(
      { sensors: blueUnit.sensors, maneuverability: blueUnit.maneuverability, speed: blueUnit.speed },
      { stealth: redUnit.stealth, maneuverability: redUnit.maneuverability, speed: redUnit.speed }
    );
    const redHitProb = this.calculateHitProbability(
      { sensors: redUnit.sensors, maneuverability: redUnit.maneuverability, speed: redUnit.speed },
      { stealth: blueUnit.stealth, maneuverability: blueUnit.maneuverability, speed: blueUnit.speed }
    );

    // Damage resolution
    const blueRawPower = this.resolveAttackPower(blueUnit, redDomain);
    const redRawPower = this.resolveAttackPower(redUnit, blueDomain);
    const blueResistance = this.resolveResistance(blueUnit, redDomain);
    const redResistance = this.resolveResistance(redUnit, blueDomain);

    const blueDmgCalc = this.calculateDamage(blueRawPower, redResistance);
    const redDmgCalc = this.calculateDamage(redRawPower, blueResistance);

    const rounds: CombatRound[] = [];
    let currentDist = distanceKm;

    // Simulation loop
    for (let r = 1; r <= maxRounds; r++) {
      if (blueSquad.activeCount <= 0 || redSquad.activeCount <= 0) break;

      const roundLogs: AttackStepLog[] = [];
      let blueHits = 0;
      let redHits = 0;
      let blueTotalDamage = 0;
      let redTotalDamage = 0;
      let blueUnitsLost = 0;
      let redUnitsLost = 0;

      // 1. Blue fires at Red
      const blueAliveUnits = blueSquad.units.filter((u) => !u.isDestroyed && u.remainingAmmo > 0);
      const blueAttacksPerUnit = Math.max(1, Math.round((blueUnit.fireRate || 4) * (15 / 60))); // 15-sec timestep

      for (const bUnit of blueAliveUnits) {
        if (redSquad.activeCount <= 0) break;
        const targetInRange = currentDist <= blueEffectiveRange;

        for (let a = 0; a < blueAttacksPerUnit; a++) {
          if (bUnit.remainingAmmo <= 0 || redSquad.activeCount <= 0) break;
          bUnit.remainingAmmo -= 1;

          // Check detection
          const detected = Math.random() <= blueDetect.pTotal;
          if (!detected || !targetInRange) {
            roundLogs.push({
              timestampSec: (r - 1) * 15 + a * 3,
              attackerSide: 'blue',
              attackerName: bUnit.callsign,
              defenderName: redSquad.unitName,
              distanceKm: Math.round(currentDist),
              inRange: targetInRange,
              detected,
              pDetect: blueDetect.pTotal,
              pHit: blueHitProb,
              hitLanded: false,
              rawPower: blueRawPower,
              targetResistance: redResistance,
              mitigatedPercent: Math.round(redDmgCalc.damageReduction * 100),
              finalDamageDealt: 0,
              ammoRemaining: bUnit.remainingAmmo,
              summary: !detected ? 'Target stealth evaded radar lock' : 'Target outside effective engagement envelope',
            });
            continue;
          }

          // Roll hit
          const hitLanded = Math.random() <= blueHitProb;
          if (hitLanded) {
            blueHits++;
            // Tactical dispersion ±10%
            const dispersion = 0.9 + Math.random() * 0.2;
            const dmg = Math.round(blueDmgCalc.finalDamage * dispersion * 10) / 10;
            blueTotalDamage += dmg;

            // Pick living target unit (individual unit HP model)
            const targetUnit = redSquad.units.find((u) => !u.isDestroyed);
            if (targetUnit) {
              targetUnit.currentHp -= dmg;
              let destroyedTarget: number | undefined;

              if (targetUnit.currentHp <= 0) {
                targetUnit.isDestroyed = true;
                targetUnit.currentHp = 0;
                redSquad.activeCount -= 1;
                redSquad.destroyedCount += 1;
                redUnitsLost += 1;
                destroyedTarget = targetUnit.index;
              }

              roundLogs.push({
                timestampSec: (r - 1) * 15 + a * 3,
                attackerSide: 'blue',
                attackerName: bUnit.callsign,
                defenderName: targetUnit.callsign,
                distanceKm: Math.round(currentDist),
                inRange: true,
                detected: true,
                pDetect: blueDetect.pTotal,
                pHit: blueHitProb,
                hitLanded: true,
                rawPower: blueRawPower,
                targetResistance: redResistance,
                mitigatedPercent: Math.round(redDmgCalc.damageReduction * 100),
                finalDamageDealt: dmg,
                ammoRemaining: bUnit.remainingAmmo,
                destroyedTargetIndex: destroyedTarget,
                summary: destroyedTarget
                  ? `Direct penetration! ${targetUnit.callsign} destroyed (-${dmg} HP)`
                  : `Impact confirmed on ${targetUnit.callsign} (-${dmg} HP, ${Math.round(targetUnit.currentHp)} HP left)`,
              });
            }
          } else {
            roundLogs.push({
              timestampSec: (r - 1) * 15 + a * 3,
              attackerSide: 'blue',
              attackerName: bUnit.callsign,
              defenderName: redSquad.unitName,
              distanceKm: Math.round(currentDist),
              inRange: true,
              detected: true,
              pDetect: blueDetect.pTotal,
              pHit: blueHitProb,
              hitLanded: false,
              rawPower: blueRawPower,
              targetResistance: redResistance,
              mitigatedPercent: Math.round(redDmgCalc.damageReduction * 100),
              finalDamageDealt: 0,
              ammoRemaining: bUnit.remainingAmmo,
              summary: 'Salvo evaded via countermeasures / high-G turn',
            });
          }
        }
      }

      // 2. Red fires at Blue
      const redAliveUnits = redSquad.units.filter((u) => !u.isDestroyed && u.remainingAmmo > 0);
      const redAttacksPerUnit = Math.max(1, Math.round((redUnit.fireRate || 4) * (15 / 60)));

      for (const rUnit of redAliveUnits) {
        if (blueSquad.activeCount <= 0) break;
        const targetInRange = currentDist <= redEffectiveRange;

        for (let a = 0; a < redAttacksPerUnit; a++) {
          if (rUnit.remainingAmmo <= 0 || blueSquad.activeCount <= 0) break;
          rUnit.remainingAmmo -= 1;

          const detected = Math.random() <= redDetect.pTotal;
          if (!detected || !targetInRange) {
            roundLogs.push({
              timestampSec: (r - 1) * 15 + a * 3,
              attackerSide: 'red',
              attackerName: rUnit.callsign,
              defenderName: blueSquad.unitName,
              distanceKm: Math.round(currentDist),
              inRange: targetInRange,
              detected,
              pDetect: redDetect.pTotal,
              pHit: redHitProb,
              hitLanded: false,
              rawPower: redRawPower,
              targetResistance: blueResistance,
              mitigatedPercent: Math.round(blueDmgCalc.damageReduction * 100),
              finalDamageDealt: 0,
              ammoRemaining: rUnit.remainingAmmo,
              summary: !detected ? 'Target stealth evaded radar lock' : 'Target outside effective engagement envelope',
            });
            continue;
          }

          const hitLanded = Math.random() <= redHitProb;
          if (hitLanded) {
            redHits++;
            const dispersion = 0.9 + Math.random() * 0.2;
            const dmg = Math.round(redDmgCalc.finalDamage * dispersion * 10) / 10;
            redTotalDamage += dmg;

            const targetUnit = blueSquad.units.find((u) => !u.isDestroyed);
            if (targetUnit) {
              targetUnit.currentHp -= dmg;
              let destroyedTarget: number | undefined;

              if (targetUnit.currentHp <= 0) {
                targetUnit.isDestroyed = true;
                targetUnit.currentHp = 0;
                blueSquad.activeCount -= 1;
                blueSquad.destroyedCount += 1;
                blueUnitsLost += 1;
                destroyedTarget = targetUnit.index;
              }

              roundLogs.push({
                timestampSec: (r - 1) * 15 + a * 3,
                attackerSide: 'red',
                attackerName: rUnit.callsign,
                defenderName: targetUnit.callsign,
                distanceKm: Math.round(currentDist),
                inRange: true,
                detected: true,
                pDetect: redDetect.pTotal,
                pHit: redHitProb,
                hitLanded: true,
                rawPower: redRawPower,
                targetResistance: blueResistance,
                mitigatedPercent: Math.round(blueDmgCalc.damageReduction * 100),
                finalDamageDealt: dmg,
                ammoRemaining: rUnit.remainingAmmo,
                destroyedTargetIndex: destroyedTarget,
                summary: destroyedTarget
                  ? `Penetration! ${targetUnit.callsign} destroyed (-${dmg} HP)`
                  : `Impact confirmed on ${targetUnit.callsign} (-${dmg} HP, ${Math.round(targetUnit.currentHp)} HP left)`,
              });
            }
          } else {
            roundLogs.push({
              timestampSec: (r - 1) * 15 + a * 3,
              attackerSide: 'red',
              attackerName: rUnit.callsign,
              defenderName: blueSquad.unitName,
              distanceKm: Math.round(currentDist),
              inRange: true,
              detected: true,
              pDetect: redDetect.pTotal,
              pHit: redHitProb,
              hitLanded: false,
              rawPower: redRawPower,
              targetResistance: blueResistance,
              mitigatedPercent: Math.round(blueDmgCalc.damageReduction * 100),
              finalDamageDealt: 0,
              ammoRemaining: rUnit.remainingAmmo,
              summary: 'Salvo evaded via defensive maneuvers',
            });
          }
        }
      }

      // Compute average HP of survivors
      const livingBlue = blueSquad.units.filter((u) => !u.isDestroyed);
      const livingRed = redSquad.units.filter((u) => !u.isDestroyed);
      const blueAvgHp = livingBlue.length > 0 ? livingBlue.reduce((s, u) => s + u.currentHp, 0) / livingBlue.length : 0;
      const redAvgHp = livingRed.length > 0 ? livingRed.reduce((s, u) => s + u.currentHp, 0) / livingRed.length : 0;

      rounds.push({
        roundNumber: r,
        distanceKm: Math.round(currentDist),
        blueActiveCount: blueSquad.activeCount,
        redActiveCount: redSquad.activeCount,
        blueAvgHp: Math.round(blueAvgHp * 10) / 10,
        redAvgHp: Math.round(redAvgHp * 10) / 10,
        blueSalvoHits: blueHits,
        redSalvoHits: redHits,
        blueDamageDealt: Math.round(blueTotalDamage),
        redDamageDealt: Math.round(redTotalDamage),
        blueUnitsLostThisRound: blueUnitsLost,
        redUnitsLostThisRound: redUnitsLost,
        logs: roundLogs,
      });

      // Closing distance over rounds
      currentDist = Math.max(10, currentDist * 0.75);
    }

    // Determine winner
    let winner: 'blue' | 'red' | 'draw' = 'draw';
    let winningReason = 'Engagement resulted in mutual tactical stalemate';

    if (blueSquad.activeCount > 0 && redSquad.activeCount === 0) {
      winner = 'blue';
      winningReason = `Friendly force wiped out all hostile units with ${blueSquad.activeCount} units remaining.`;
    } else if (redSquad.activeCount > 0 && blueSquad.activeCount === 0) {
      winner = 'red';
      winningReason = `Hostile formation eliminated all friendly units with ${redSquad.activeCount} units remaining.`;
    } else if (blueSquad.activeCount > redSquad.activeCount) {
      winner = 'blue';
      winningReason = `Friendly force established superiority (${blueSquad.activeCount} vs ${redSquad.activeCount} active).`;
    } else if (redSquad.activeCount > blueSquad.activeCount) {
      winner = 'red';
      winningReason = `Hostile force established superiority (${redSquad.activeCount} vs ${blueSquad.activeCount} active).`;
    }

    return {
      battleType,
      distanceKm,
      blueUnit,
      redUnit,
      blueDomain,
      redDomain,
      blueInitialCount: blueCount,
      redInitialCount: redCount,
      blueFinalActive: blueSquad.activeCount,
      redFinalActive: redSquad.activeCount,
      winner,
      winningReason,
      totalRounds: rounds.length,
      rounds,
      formulaAnalysis: {
        blueDetectRate: Math.round(blueDetect.pTotal * 1000) / 10,
        redDetectRate: Math.round(redDetect.pTotal * 1000) / 10,
        blueInRange,
        redInRange,
        blueHitProb: Math.round(blueHitProb * 1000) / 10,
        redHitProb: Math.round(redHitProb * 1000) / 10,
        blueRawAttackPower: blueRawPower,
        redRawAttackPower: redRawPower,
        blueResistanceAgainstRed: blueResistance,
        redResistanceAgainstBlue: redResistance,
        blueDamagePerHit: blueDmgCalc.finalDamage,
        redDamagePerHit: redDmgCalc.finalDamage,
        blueExpectedDamagePerShot: Math.round(blueDmgCalc.finalDamage * blueHitProb * 10) / 10,
        redExpectedDamagePerShot: Math.round(redDmgCalc.finalDamage * redHitProb * 10) / 10,
      },
    };
  }

  /**
   * FORMULA 11: Monte Carlo Outcome Probability
   * Runs the battle N times (e.g. 200 - 500 times) with stochastic rolls to determine true P(Victory)
   */
  public static runMonteCarloSimulation(
    blueUnit: UnifiedCombatUnit,
    redUnit: UnifiedCombatUnit,
    blueCount: number = 12,
    redCount: number = 12,
    distanceKm: number = 80,
    blueMissile?: MissileUnit,
    redMissile?: MissileUnit,
    blueSys?: ElectronicSystemUnit,
    redSys?: ElectronicSystemUnit,
    iterations: number = 300
  ): MonteCarloOutcome {
    let blueVictories = 0;
    let redVictories = 0;
    let draws = 0;
    let totalRoundsSum = 0;
    let blueSurvivorsSum = 0;
    let redSurvivorsSum = 0;

    for (let i = 0; i < iterations; i++) {
      const res = this.simulateBattle(
        blueUnit,
        redUnit,
        blueCount,
        redCount,
        distanceKm,
        blueMissile,
        redMissile,
        blueSys,
        redSys,
        8
      );

      if (res.winner === 'blue') blueVictories++;
      else if (res.winner === 'red') redVictories++;
      else draws++;

      totalRoundsSum += res.totalRounds;
      blueSurvivorsSum += res.blueFinalActive;
      redSurvivorsSum += res.redFinalActive;
    }

    return {
      iterations,
      blueVictories,
      redVictories,
      draws,
      pBlueVictory: Math.round((blueVictories / iterations) * 1000) / 10,
      pRedVictory: Math.round((redVictories / iterations) * 1000) / 10,
      pDraw: Math.round((draws / iterations) * 1000) / 10,
      avgRoundsToFinish: Math.round((totalRoundsSum / iterations) * 10) / 10,
      avgBlueSurvivors: Math.round((blueSurvivorsSum / iterations) * 10) / 10,
      avgRedSurvivors: Math.round((redSurvivorsSum / iterations) * 10) / 10,
    };
  }
}
