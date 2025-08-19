export type RealmType = "Albion" | "Midgard" | "Hibernia";

export interface IPrerequisite {
  type: "ability";
  ability: string; // The key/id of the required ability
  rank: number;
}

export interface IAbilityRank {
  rank: number;
  cost: number;
  description: string;
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
