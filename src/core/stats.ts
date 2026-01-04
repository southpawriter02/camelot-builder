import type { IAbility, AggregatedStats, StatType } from '../types';
import type { PurchasedAbilities } from './build';

/**
 * Aggregate all stat bonuses from purchased abilities
 *
 * @param purchasedAbilities - Map of ability ID to purchased rank
 * @param allAbilities - Map of ability ID to ability data
 * @returns Aggregated stats totals
 */
export function aggregateStats(
  purchasedAbilities: PurchasedAbilities,
  allAbilities: Record<string, IAbility>
): AggregatedStats {
  const stats: AggregatedStats = {};

  for (const [abilityId, purchasedRank] of Object.entries(purchasedAbilities)) {
    const ability = allAbilities[abilityId];
    if (!ability) continue;

    // Get the stats for the purchased rank
    const rankData = ability.ranks.find(r => r.rank === purchasedRank);
    if (!rankData?.stats) continue;

    // Add each stat bonus
    for (const bonus of rankData.stats) {
      const current = stats[bonus.type] || 0;
      stats[bonus.type] = current + bonus.value;
    }
  }

  return stats;
}

/**
 * Get human-readable label for a stat type
 */
export function getStatLabel(stat: StatType): string {
  const labels: Record<StatType, string> = {
    strength: 'Strength',
    constitution: 'Constitution',
    dexterity: 'Dexterity',
    quickness: 'Quickness',
    intelligence: 'Intelligence',
    piety: 'Piety',
    charisma: 'Charisma',
    empathy: 'Empathy',
    hits: 'Hit Points',
    power: 'Power',
  };

  return labels[stat] || stat;
}

/**
 * Group stats by category for display
 */
export function groupStatsByCategory(stats: AggregatedStats): Record<string, AggregatedStats> {
  const categories: Record<string, StatType[]> = {
    'Primary Stats': ['strength', 'constitution', 'dexterity', 'quickness'],
    'Secondary Stats': ['intelligence', 'piety', 'charisma', 'empathy'],
    'Resources': ['hits', 'power'],
  };

  const grouped: Record<string, AggregatedStats> = {};

  for (const [category, statTypes] of Object.entries(categories)) {
    const categoryStats: AggregatedStats = {};

    for (const statType of statTypes) {
      if (stats[statType] !== undefined) {
        categoryStats[statType] = stats[statType];
      }
    }

    if (Object.keys(categoryStats).length > 0) {
      grouped[category] = categoryStats;
    }
  }

  return grouped;
}
