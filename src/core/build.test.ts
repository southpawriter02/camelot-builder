import { describe, it, expect } from 'vitest';
import { Build } from './build';
import type { IClass, IAbility } from '../types';

// Sample Data for testing
const clericClass: IClass = {
  name: 'Cleric',
  realm: 'Albion',
  ra_trees: ['smiting', 'healing', 'enhancements'],
};

const augmentDexterity: IAbility = {
  id: 'augment_dexterity',
  name: 'Augment Dexterity',
  tree: 'enhancements',
  ranks: [{ rank: 1, cost: 1, description: '...' }],
  prerequisites: [],
};

const serenity: IAbility = {
  id: 'serenity',
  name: 'Serenity',
  tree: 'healing',
  ranks: [{ rank: 1, cost: 3, description: '...' }],
  prerequisites: [{ type: 'ability', ability: 'augment_dexterity', rank: 1 }],
};

const unavailableAbility: IAbility = {
    id: 'unavailable',
    name: 'Unavailable Ability',
    tree: 'archery',
    ranks: [{ rank: 1, cost: 1, description: '...' }],
    prerequisites: [],
}

describe('Build Logic', () => {
  it('should create a new build for a class', () => {
    const build = new Build(clericClass);
    expect(build.characterClass?.name).toBe('Cleric');
    expect(build.spentPoints).toBe(0);
  });

  it('should purchase a valid ability', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(augmentDexterity);

    expect(build.spentPoints).toBe(1);
    expect(build.purchasedAbilities['augment_dexterity']).toBe(1);
  });

  it('should not purchase an ability if prerequisites are not met', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(serenity); // Missing augment_dexterity

    expect(build.spentPoints).toBe(0);
    expect(build.purchasedAbilities['serenity']).toBeUndefined();
  });

  it('should purchase an ability after meeting prerequisites', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(augmentDexterity); // First, purchase the prereq
    build = build.purchaseAbility(serenity);       // Then, purchase serenity

    expect(build.spentPoints).toBe(4); // 1 for dex + 3 for serenity
    expect(build.purchasedAbilities['serenity']).toBe(1);
  });

  it('should not purchase an ability not available to the class', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(unavailableAbility);

    expect(build.spentPoints).toBe(0);
    expect(build.purchasedAbilities['unavailable']).toBeUndefined();
  });
});

// Multi-rank ability for cost calculation tests
const multiRankAbility: IAbility = {
  id: 'multi_rank',
  name: 'Multi Rank Ability',
  tree: 'enhancements',
  ranks: [
    { rank: 1, cost: 1, description: 'Rank 1' },
    { rank: 2, cost: 2, description: 'Rank 2' },
    { rank: 3, cost: 3, description: 'Rank 3' },
  ],
  prerequisites: [],
};

const anotherAbility: IAbility = {
  id: 'another_ability',
  name: 'Another Ability',
  tree: 'enhancements',
  ranks: [
    { rank: 1, cost: 5, description: 'Rank 1' },
    { rank: 2, cost: 7, description: 'Rank 2' },
  ],
  prerequisites: [],
};

describe('cost calculation', () => {
  it('spentPoints starts at 0', () => {
    const build = new Build(clericClass);
    expect(build.spentPoints).toBe(0);
  });

  it('purchaseAbility adds single rank cost', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(multiRankAbility);

    expect(build.spentPoints).toBe(1);
  });

  it('purchaseAbility accumulates costs across multiple ranks', () => {
    let build = new Build(clericClass);

    build = build.purchaseAbility(multiRankAbility);
    expect(build.spentPoints).toBe(1); // rank 1: cost 1

    build = build.purchaseAbility(multiRankAbility);
    expect(build.spentPoints).toBe(3); // rank 1 + rank 2: 1 + 2 = 3

    build = build.purchaseAbility(multiRankAbility);
    expect(build.spentPoints).toBe(6); // rank 1 + 2 + 3: 1 + 2 + 3 = 6
  });

  it('purchaseAbility accumulates costs across multiple abilities', () => {
    let build = new Build(clericClass);

    build = build.purchaseAbility(multiRankAbility); // 1 point
    build = build.purchaseAbility(anotherAbility);   // 5 points

    expect(build.spentPoints).toBe(6);
  });
});

describe('removeAbilityRank', () => {
  it('refunds single rank cost', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(multiRankAbility);
    expect(build.spentPoints).toBe(1);

    build = build.removeAbilityRank(multiRankAbility);
    expect(build.spentPoints).toBe(0);
  });

  it('refunds correct cost for each rank level', () => {
    let build = new Build(clericClass);

    // Purchase all 3 ranks: 1 + 2 + 3 = 6 points
    build = build.purchaseAbility(multiRankAbility);
    build = build.purchaseAbility(multiRankAbility);
    build = build.purchaseAbility(multiRankAbility);
    expect(build.spentPoints).toBe(6);

    // Remove rank 3 (cost 3)
    build = build.removeAbilityRank(multiRankAbility);
    expect(build.spentPoints).toBe(3); // 6 - 3 = 3

    // Remove rank 2 (cost 2)
    build = build.removeAbilityRank(multiRankAbility);
    expect(build.spentPoints).toBe(1); // 3 - 2 = 1

    // Remove rank 1 (cost 1)
    build = build.removeAbilityRank(multiRankAbility);
    expect(build.spentPoints).toBe(0); // 1 - 1 = 0
  });

  it('removes ability from map when rank reaches 0', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(multiRankAbility);
    expect(build.purchasedAbilities['multi_rank']).toBe(1);

    build = build.removeAbilityRank(multiRankAbility);
    expect(build.purchasedAbilities['multi_rank']).toBeUndefined();
  });

  it('returns same build if no ranks purchased', () => {
    const build = new Build(clericClass);
    const result = build.removeAbilityRank(multiRankAbility);

    expect(result).toBe(build);
  });

  it('returns same build for unknown ability', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(multiRankAbility);

    const unknownAbility: IAbility = {
      id: 'unknown',
      name: 'Unknown',
      tree: 'enhancements',
      ranks: [{ rank: 1, cost: 1, description: '' }],
      prerequisites: [],
    };

    const result = build.removeAbilityRank(unknownAbility);
    expect(result).toBe(build);
  });
});

describe('abilityCount getter', () => {
  it('returns 0 for empty build', () => {
    const build = new Build(clericClass);
    expect(build.abilityCount).toBe(0);
  });

  it('returns count of unique abilities', () => {
    let build = new Build(clericClass);

    build = build.purchaseAbility(multiRankAbility);
    expect(build.abilityCount).toBe(1);

    build = build.purchaseAbility(anotherAbility);
    expect(build.abilityCount).toBe(2);

    // Purchasing more ranks of same ability doesn't increase count
    build = build.purchaseAbility(multiRankAbility);
    expect(build.abilityCount).toBe(2);
  });

  it('count decreases when ability fully removed', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(multiRankAbility);
    build = build.purchaseAbility(anotherAbility);
    expect(build.abilityCount).toBe(2);

    build = build.removeAbilityRank(multiRankAbility);
    expect(build.abilityCount).toBe(1);
  });
});

describe('totalRanks getter', () => {
  it('returns 0 for empty build', () => {
    const build = new Build(clericClass);
    expect(build.totalRanks).toBe(0);
  });

  it('returns sum of all ranks across abilities', () => {
    let build = new Build(clericClass);

    build = build.purchaseAbility(multiRankAbility); // rank 1
    expect(build.totalRanks).toBe(1);

    build = build.purchaseAbility(multiRankAbility); // rank 2
    expect(build.totalRanks).toBe(2);

    build = build.purchaseAbility(anotherAbility); // rank 1 of another
    expect(build.totalRanks).toBe(3);

    build = build.purchaseAbility(anotherAbility); // rank 2 of another
    expect(build.totalRanks).toBe(4);
  });

  it('decreases when ranks are removed', () => {
    let build = new Build(clericClass);
    build = build.purchaseAbility(multiRankAbility);
    build = build.purchaseAbility(multiRankAbility);
    build = build.purchaseAbility(anotherAbility);
    expect(build.totalRanks).toBe(3);

    build = build.removeAbilityRank(multiRankAbility);
    expect(build.totalRanks).toBe(2);
  });
});
