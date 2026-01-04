export type RealmType = "Albion" | "Midgard" | "Hibernia";

/**
 * Stat types that abilities can modify
 */
export type StatType =
  | 'strength'
  | 'constitution'
  | 'dexterity'
  | 'quickness'
  | 'intelligence'
  | 'piety'
  | 'charisma'
  | 'empathy'
  | 'hits'
  | 'power';

/**
 * A stat bonus with type and value
 */
export interface IStatBonus {
  type: StatType;
  value: number;
}

/**
 * Aggregated stats from all abilities
 */
export type AggregatedStats = Partial<Record<StatType, number>>;

export interface IPrerequisite {
  type: "ability";
  ability: string; // The key/id of the required ability
  rank: number;
}

export interface IAbilityRank {
  rank: number;
  cost: number;
  description: string;
  stats?: IStatBonus[];
}

export interface IAbility {
  id: string; // e.g., "augment_dexterity"
  name: string;
  tree: string;
  ranks: IAbilityRank[];
  prerequisites: IPrerequisite[];
}

export interface IClass {
  name: string;
  realm: RealmType;
  ra_trees: string[]; // List of RA tree names available to the class
}
