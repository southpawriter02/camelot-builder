import { IAbility, IClass } from '../types';
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

  constructor(characterClass: IClass | null = null) {
    this.characterClass = characterClass;
    this.spentPoints = 0;
    this.purchasedAbilities = {};
  }

  // Private constructor for cloning
  private constructor(
    characterClass: IClass | null,
    spentPoints: number,
    purchasedAbilities: PurchasedAbilities
  ) {
    this.characterClass = characterClass;
    this.spentPoints = spentPoints;
    this.purchasedAbilities = purchasedAbilities;
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

    return new Build(this.characterClass, newSpentPoints, newPurchasedAbilities);
  }
}
