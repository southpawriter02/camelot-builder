import type { IAbility, IClass } from '../types';
import { canPurchaseAbility } from './validator';

/**
 * A map of purchased ability IDs to their rank.
 * e.g., { "augment_dexterity": 2 }
 */
export type PurchasedAbilities = Record<string, number>;

/**
 * Represents the state of a character's build. This class is immutable.
 * Methods that modify the build return a new instance of the class.
 */
export class Build {
  public readonly characterClass: IClass | null;
  public readonly spentPoints: number;
  public readonly purchasedAbilities: PurchasedAbilities;

  constructor(
    characterClass: IClass | null = null,
    spentPoints: number = 0,
    purchasedAbilities: PurchasedAbilities = {}
  ) {
    this.characterClass = characterClass;
    this.spentPoints = spentPoints;
    this.purchasedAbilities = purchasedAbilities;
  }

  /**
   * Creates a new Build with updated state (internal factory method)
   */
  private clone(updates: {
    characterClass?: IClass | null;
    spentPoints?: number;
    purchasedAbilities?: PurchasedAbilities;
  }): Build {
    return new Build(
      updates.characterClass ?? this.characterClass,
      updates.spentPoints ?? this.spentPoints,
      updates.purchasedAbilities ?? this.purchasedAbilities
    );
  }

  /**
   * Attempts to purchase the next rank of an ability.
   * @param ability The ability to purchase.
   * @returns A new Build instance if successful, or the original instance on failure.
   */
  public purchaseAbility(ability: IAbility): Build {
    const currentRank = this.purchasedAbilities[ability.id] || 0;
    const nextRank = currentRank + 1;

    if (!canPurchaseAbility(ability, nextRank, this)) {
      return this; // Return original instance on failure
    }

    const rankData = ability.ranks.find(r => r.rank === nextRank);
    if (!rankData) {
      return this; // Should not happen if canPurchaseAbility is correct
    }

    const newSpentPoints = this.spentPoints + rankData.cost;
    const newPurchasedAbilities = {
      ...this.purchasedAbilities,
      [ability.id]: nextRank,
    };

    return this.clone({
      spentPoints: newSpentPoints,
      purchasedAbilities: newPurchasedAbilities,
    });
  }

  /**
   * Removes one rank from an ability.
   * @param ability The ability to remove a rank from.
   * @returns A new Build instance if successful, or the original instance on failure.
   */
  public removeAbilityRank(ability: IAbility): Build {
    const currentRank = this.purchasedAbilities[ability.id] || 0;

    // Can't remove if no ranks purchased
    if (currentRank <= 0) {
      return this;
    }

    // Get the cost of the current rank to refund
    const currentRankData = ability.ranks.find(r => r.rank === currentRank);
    if (!currentRankData) {
      return this;
    }

    const newRank = currentRank - 1;
    const newSpentPoints = this.spentPoints - currentRankData.cost;

    // If new rank is 0, remove the ability from the map entirely
    const newPurchasedAbilities = { ...this.purchasedAbilities };
    if (newRank === 0) {
      delete newPurchasedAbilities[ability.id];
    } else {
      newPurchasedAbilities[ability.id] = newRank;
    }

    return this.clone({
      spentPoints: newSpentPoints,
      purchasedAbilities: newPurchasedAbilities,
    });
  }

  /**
   * Gets the number of purchased abilities
   */
  public get abilityCount(): number {
    return Object.keys(this.purchasedAbilities).length;
  }

  /**
   * Gets the total number of ranks purchased across all abilities
   */
  public get totalRanks(): number {
    return Object.values(this.purchasedAbilities).reduce((sum, rank) => sum + rank, 0);
  }
}
