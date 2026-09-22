import { COUNTRIES, CountryFlag } from './countries';

export interface AiCountryAgent {
  countryCode: string;
  countryName: string;
  flagUrl: string;
  epoch: number;
  experiencePoints: number;
  loss: number;
  economicScore: number; // 0 - 100
  warfareReadiness: number; // 0 - 100
  defenseBudgetPercent: number; // % of GDP allocated to defense
  economicDoctrine: string;
  warfareDoctrine: string;
  threatAssessment: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  recentAdaptation: string;
  learningHistory: {
    epoch: number;
    experienceGain: number;
    action: string;
    timestamp: string;
  }[];
}

const ECONOMIC_DOCTRINES = [
  'Algorithmic Supply Chain Optimization',
  'Strategic Resource Stockpiling & Export Tariffs',
  'Subterranean Rare-Earth Mineral Extraction',
  'Autonomous Heavy Industrial Automation',
  'Sovereign Reserve Liquidity & Trade Fortification',
  'Energy Grid Decentralization & Fusion R&D',
];

const WARFARE_DOCTRINES = [
  'Deep Autonomous Air-Defense & Electronic Shielding',
  'Asymmetric Hypersonic Missile Deterrence Triad',
  'Mechanized Armor Rapid Strike & Border Bastions',
  'Integrated Satellite Reconnaissance & Drone Swarms',
  'Subsurface Coastal Denial & Maritime Interdiction',
  'Cyber-Electromagnetic Warfare & Communications Hardening',
];

const ADAPTATION_SCENARIOS = [
  'Trained on simulated border skirmish: Reallocated +4.2% budget to autonomous drone hives.',
  'Analyzed foreign economic tariffs: Shifted +6.5% manufacturing capacity to domestic munitions.',
  'Experience update from naval surveillance: Upgraded coastal radar resolution by +12%.',
  'Neural policy iteration: Optimized supply line throughput by +8.1% under war-strain conditions.',
  'Threat model counter-measure: Deployed hardened subterranean air defense batteries.',
  'Reinforcement learning reward spike: Reinforced sovereign energy reserves by 30 days of buffer.',
  'Deep neural evaluation: Adjusted tactical doctrine toward preemptive electronic countermeasures.',
  'Defense matrix experience gained: Integrated automated point-defense interceptors across key hubs.',
];

export function createInitialAiAgents(userCountryCode: string): Record<string, AiCountryAgent> {
  const agents: Record<string, AiCountryAgent> = {};

  COUNTRIES.forEach((c) => {
    if (c.code === userCountryCode) return; // Player's country is human-controlled

    const initialEpoch = Math.floor(Math.random() * 80) + 120;
    const initialExp = initialEpoch * 1450 + Math.floor(Math.random() * 500);
    const initialLoss = Number((0.08 - Math.min(initialEpoch * 0.0003, 0.055) + Math.random() * 0.008).toFixed(4));
    const econScore = Math.floor(Math.random() * 25) + 68;
    const warScore = Math.floor(Math.random() * 28) + 65;

    agents[c.code] = {
      countryCode: c.code,
      countryName: c.name,
      flagUrl: c.flagUrl,
      epoch: initialEpoch,
      experiencePoints: initialExp,
      loss: initialLoss,
      economicScore: econScore,
      warfareReadiness: warScore,
      defenseBudgetPercent: Math.floor(Math.random() * 12) + 18,
      economicDoctrine: ECONOMIC_DOCTRINES[Math.floor(Math.random() * ECONOMIC_DOCTRINES.length)],
      warfareDoctrine: WARFARE_DOCTRINES[Math.floor(Math.random() * WARFARE_DOCTRINES.length)],
      threatAssessment: warScore > 85 ? 'Critical' : warScore > 75 ? 'Elevated' : 'Moderate',
      recentAdaptation: ADAPTATION_SCENARIOS[Math.floor(Math.random() * ADAPTATION_SCENARIOS.length)],
      learningHistory: [
        {
          epoch: initialEpoch,
          experienceGain: +240,
          action: 'Reinforcement policy converged on regional defensive deterrence doctrine.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };
  });

  return agents;
}

export function trainAiStep(
  currentAgents: Record<string, AiCountryAgent>,
  userCountryCode: string
): { updatedAgents: Record<string, AiCountryAgent>; trainingLog?: { country: string; message: string } } {
  const agentCodes = Object.keys(currentAgents).filter((code) => code !== userCountryCode);
  if (agentCodes.length === 0) return { updatedAgents: currentAgents };

  // Pick 1 to 2 nations to learn in this step
  const targetCode = agentCodes[Math.floor(Math.random() * agentCodes.length)];
  const agent = currentAgents[targetCode];
  if (!agent) return { updatedAgents: currentAgents };

  const newEpoch = agent.epoch + 1;
  const expGain = Math.floor(Math.random() * 350) + 180;
  const newExp = agent.experiencePoints + expGain;
  const newLoss = Math.max(0.015, Number((agent.loss * 0.994 + (Math.random() * 0.002 - 0.001)).toFixed(4)));
  const econDelta = Math.floor(Math.random() * 3) - 1;
  const warDelta = Math.floor(Math.random() * 3) - 1;

  const newEcon = Math.min(99, Math.max(50, agent.economicScore + econDelta));
  const newWar = Math.min(99, Math.max(50, agent.warfareReadiness + warDelta));

  const adaptationText = ADAPTATION_SCENARIOS[Math.floor(Math.random() * ADAPTATION_SCENARIOS.length)];

  const updatedAgent: AiCountryAgent = {
    ...agent,
    epoch: newEpoch,
    experiencePoints: newExp,
    loss: newLoss,
    economicScore: newEcon,
    warfareReadiness: newWar,
    threatAssessment: newWar > 85 ? 'Critical' : newWar > 75 ? 'Elevated' : 'Moderate',
    recentAdaptation: `Epoch #${newEpoch}: ${adaptationText}`,
    learningHistory: [
      {
        epoch: newEpoch,
        experienceGain: expGain,
        action: adaptationText,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...agent.learningHistory.slice(0, 4),
    ],
  };

  return {
    updatedAgents: {
      ...currentAgents,
      [targetCode]: updatedAgent,
    },
    trainingLog: {
      country: agent.countryName,
      message: `AI Neural Adaptation [Epoch #${newEpoch}]: ${agent.countryName} gained +${expGain} EXP. ${adaptationText}`,
    },
  };
}
