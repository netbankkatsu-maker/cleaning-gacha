export type Rarity = "C" | "B" | "A" | "S" | "SS" | "SSS";

export interface RarityConfig {
  probability: number;
  pointsCost: number;
  rewards: string;
}

export const rarityConfig: Record<Rarity, RarityConfig> = {
  C: {
    probability: 0.5,
    pointsCost: 30,
    rewards: "スタンプ・バッジ",
  },
  B: {
    probability: 0.3,
    pointsCost: 60,
    rewards: "入浴剤・香りグッズ",
  },
  A: {
    probability: 0.12,
    pointsCost: 100,
    rewards: "推し活応援金（500円）",
  },
  S: {
    probability: 0.06,
    pointsCost: 150,
    rewards: "コーヒーチケット",
  },
  SS: {
    probability: 0.015,
    pointsCost: 200,
    rewards: "スイーツ券（1000円）",
  },
  SSS: {
    probability: 0.005,
    pointsCost: 250,
    rewards: "好きな夜食（3000円相当）",
  },
};

export function pullGacha(): Rarity {
  const rand = Math.random();
  let cumulative = 0;

  for (const [rarity, config] of Object.entries(rarityConfig)) {
    cumulative += config.probability;
    if (rand < cumulative) {
      return rarity as Rarity;
    }
  }

  return "C";
}

export function calculatePoints(cleanliness_improvement: number): {
  points: number;
  message: string;
} {
  if (cleanliness_improvement >= 70) {
    return {
      points: 30,
      message: "大幅改善！素晴らしい頑張りだ！🎉",
    };
  } else if (cleanliness_improvement >= 30) {
    return {
      points: 20,
      message: "良い改善。その調子で頑張って！💪",
    };
  } else if (cleanliness_improvement >= 10) {
    return {
      points: 10,
      message: "少しずつ綺麗になってる。頑張ろう！✨",
    };
  } else {
    return {
      points: 5,
      message: "チャレンジ精神をたたえます！🌟",
    };
  }
}
