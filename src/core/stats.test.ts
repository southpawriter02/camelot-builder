import { describe, it, expect } from 'vitest';
import { aggregateStats, getStatLabel, groupStatsByCategory } from './stats';
import type { IAbility } from '../types';

// Mock ability data
const mockAbilities: Record<string, IAbility> = {
  augment_dex: {
    id: 'augment_dex',
    name: 'Augment Dexterity',
    tree: 'enhancements',
    ranks: [
      { rank: 1, cost: 1, description: '', stats: [{ type: 'dexterity', value: 5 }] },
      { rank: 2, cost: 2, description: '', stats: [{ type: 'dexterity', value: 10 }] },
      { rank: 3, cost: 3, description: '', stats: [{ type: 'dexterity', value: 15 }] },
    ],
    prerequisites: [],
  },
  augment_str: {
    id: 'augment_str',
    name: 'Augment Strength',
    tree: 'enhancements',
    ranks: [
      { rank: 1, cost: 1, description: '', stats: [{ type: 'strength', value: 5 }] },
      { rank: 2, cost: 2, description: '', stats: [{ type: 'strength', value: 10 }] },
    ],
    prerequisites: [],
  },
  multi_stat: {
    id: 'multi_stat',
    name: 'Multi Stat Ability',
    tree: 'other',
    ranks: [
      {
        rank: 1,
        cost: 5,
        description: '',
        stats: [
          { type: 'intelligence', value: 5 },
          { type: 'power', value: 10 },
        ],
      },
    ],
    prerequisites: [],
  },
  no_stats: {
    id: 'no_stats',
    name: 'No Stats Ability',
    tree: 'other',
    ranks: [
      { rank: 1, cost: 1, description: '' }, // No stats property
    ],
    prerequisites: [],
  },
};

describe('aggregateStats', () => {
  it('returns empty object for no purchases', () => {
    const result = aggregateStats({}, mockAbilities);
    expect(result).toEqual({});
  });

  it('aggregates single ability stat at rank 1', () => {
    const result = aggregateStats({ augment_dex: 1 }, mockAbilities);
    expect(result).toEqual({ dexterity: 5 });
  });

  it('aggregates single ability stat at higher rank', () => {
    const result = aggregateStats({ augment_dex: 2 }, mockAbilities);
    expect(result).toEqual({ dexterity: 10 });
  });

  it('aggregates single ability stat at max rank', () => {
    const result = aggregateStats({ augment_dex: 3 }, mockAbilities);
    expect(result).toEqual({ dexterity: 15 });
  });

  it('aggregates multiple abilities with different stats', () => {
    const result = aggregateStats(
      { augment_dex: 2, augment_str: 1 },
      mockAbilities
    );
    expect(result).toEqual({ dexterity: 10, strength: 5 });
  });

  it('aggregates multiple stats from single ability', () => {
    const result = aggregateStats({ multi_stat: 1 }, mockAbilities);
    expect(result).toEqual({ intelligence: 5, power: 10 });
  });

  it('sums same stat from multiple abilities', () => {
    // Both abilities give the same stat type
    const abilitiesWithSameStat: Record<string, IAbility> = {
      ability1: {
        id: 'ability1',
        name: 'Ability 1',
        tree: 'test',
        ranks: [{ rank: 1, cost: 1, description: '', stats: [{ type: 'dexterity', value: 5 }] }],
        prerequisites: [],
      },
      ability2: {
        id: 'ability2',
        name: 'Ability 2',
        tree: 'test',
        ranks: [{ rank: 1, cost: 1, description: '', stats: [{ type: 'dexterity', value: 3 }] }],
        prerequisites: [],
      },
    };

    const result = aggregateStats({ ability1: 1, ability2: 1 }, abilitiesWithSameStat);
    expect(result).toEqual({ dexterity: 8 });
  });

  it('handles ability with no stats property', () => {
    const result = aggregateStats({ no_stats: 1 }, mockAbilities);
    expect(result).toEqual({});
  });

  it('ignores unknown abilities', () => {
    const result = aggregateStats({ unknown_ability: 5 }, mockAbilities);
    expect(result).toEqual({});
  });

  it('ignores abilities with invalid rank', () => {
    const result = aggregateStats({ augment_dex: 99 }, mockAbilities);
    expect(result).toEqual({});
  });

  it('handles mixed valid and invalid purchases', () => {
    const result = aggregateStats(
      { augment_dex: 2, unknown: 1, no_stats: 1 },
      mockAbilities
    );
    expect(result).toEqual({ dexterity: 10 });
  });
});

describe('getStatLabel', () => {
  it('returns formatted label for primary stats', () => {
    expect(getStatLabel('strength')).toBe('Strength');
    expect(getStatLabel('constitution')).toBe('Constitution');
    expect(getStatLabel('dexterity')).toBe('Dexterity');
    expect(getStatLabel('quickness')).toBe('Quickness');
  });

  it('returns formatted label for secondary stats', () => {
    expect(getStatLabel('intelligence')).toBe('Intelligence');
    expect(getStatLabel('piety')).toBe('Piety');
    expect(getStatLabel('charisma')).toBe('Charisma');
    expect(getStatLabel('empathy')).toBe('Empathy');
  });

  it('returns formatted label for resource stats', () => {
    expect(getStatLabel('hits')).toBe('Hit Points');
    expect(getStatLabel('power')).toBe('Power');
  });
});

describe('groupStatsByCategory', () => {
  it('groups primary stats correctly', () => {
    const stats = { strength: 10, dexterity: 5 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Primary Stats']).toEqual({ strength: 10, dexterity: 5 });
  });

  it('groups secondary stats correctly', () => {
    const stats = { intelligence: 10, piety: 5 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Secondary Stats']).toEqual({ intelligence: 10, piety: 5 });
  });

  it('groups resource stats correctly', () => {
    const stats = { hits: 100, power: 50 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Resources']).toEqual({ hits: 100, power: 50 });
  });

  it('groups multiple categories correctly', () => {
    const stats = { dexterity: 10, intelligence: 5, hits: 100 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Primary Stats']).toEqual({ dexterity: 10 });
    expect(grouped['Secondary Stats']).toEqual({ intelligence: 5 });
    expect(grouped['Resources']).toEqual({ hits: 100 });
  });

  it('omits empty categories', () => {
    const stats = { dexterity: 10 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Primary Stats']).toBeDefined();
    expect(grouped['Secondary Stats']).toBeUndefined();
    expect(grouped['Resources']).toBeUndefined();
  });

  it('returns empty object for empty stats', () => {
    const grouped = groupStatsByCategory({});
    expect(grouped).toEqual({});
  });

  it('maintains stat values in categories', () => {
    const stats = { strength: 15, constitution: 20, dexterity: 25, quickness: 30 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Primary Stats']).toEqual({
      strength: 15,
      constitution: 20,
      dexterity: 25,
      quickness: 30,
    });
  });
});

describe('stats integration', () => {
  it('aggregates and groups complex build', () => {
    const result = aggregateStats(
      { augment_dex: 3, augment_str: 2, multi_stat: 1 },
      mockAbilities
    );

    expect(result).toEqual({
      dexterity: 15,
      strength: 10,
      intelligence: 5,
      power: 10,
    });

    const grouped = groupStatsByCategory(result);

    expect(grouped['Primary Stats']).toEqual({ dexterity: 15, strength: 10 });
    expect(grouped['Secondary Stats']).toEqual({ intelligence: 5 });
    expect(grouped['Resources']).toEqual({ power: 10 });
  });
});
