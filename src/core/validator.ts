import type { IAbility, IPrerequisite } from '../types';
import { Build } from './build';

/**
 * Checks if the prerequisites for an ability are met by the current build.
 * @param prerequisites The list of prerequisites for the ability.
 * @param build The current character build.
 * @returns True if all prerequisites are met, false otherwise.
 */
function checkPrerequisites(prerequisites: IPrerequisite[], build: Build): boolean {
  for (const prereq of prerequisites) {
    if (prereq.type === 'ability') {
      const purchasedRank = build.purchasedAbilities[prereq.ability] || 0;
      if (purchasedRank < prereq.rank) {
        return false; // Prerequisite not met
      }
    }
    // Future prerequisite types could be handled here (e.g., level, other stats).
  }
  return true; // All prerequisites are met
}

/**
 * Validates if a specific rank of an ability can be purchased for a given build.
 * @param ability The ability to validate.
 * @param rankToPurchase The rank of the ability to be purchased (e.g., 1, 2, 3).
 * @param build The current character build.
 * @returns True if the ability rank can be purchased, false otherwise.
 */
export function canPurchaseAbility(
  ability: IAbility,
  rankToPurchase: number,
  build: Build
): boolean {
  if (!build.characterClass) {
    return false; // Cannot purchase without a class
  }

  // 1. Check if the ability tree is available to the class
  if (!build.characterClass.ra_trees.includes(ability.tree)) {
    return false;
  }

  // 2. Check prerequisites
  if (!checkPrerequisites(ability.prerequisites, build)) {
    return false;
  }

  // 3. Check rank progression (cannot skip ranks)
  const currentRank = build.purchasedAbilities[ability.id] || 0;
  if (rankToPurchase !== currentRank + 1) {
    return false;
  }

  // 4. Check if the rank exists for the ability
  const rankData = ability.ranks.find(r => r.rank === rankToPurchase);
  if (!rankData) {
    return false; // This rank does not exist
  }

  // More checks can be added later (e.g., point costs)

  return true;
}
