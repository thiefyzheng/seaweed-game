interface GrowthStage {
  name: string;
  multiplier: number;
}

const getGrowthStage = (age: number): GrowthStage | undefined => {
  if (age < 7) {
    return { name: 'Immature', multiplier: 0.5 };
  } else {
    return { name: 'Mature', multiplier: 0.75 };
  }
};

export { getGrowthStage };
export type { GrowthStage };
