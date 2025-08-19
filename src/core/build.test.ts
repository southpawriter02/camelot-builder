import { describe, it, expect } from 'vitest';
import { Build } from './build';
import { IClass, IAbility } from '../types';

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
