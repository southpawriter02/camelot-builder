import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveBuild,
  loadBuild,
  clearSavedBuild,
  hasSavedBuild,
  STORAGE_KEY,
  CURRENT_VERSION,
} from './storage';
import { Build } from './build';
import type { IClass } from '../types';

// Mock class data
const clericClass: IClass = {
  name: 'Cleric',
  realm: 'Albion',
  ra_trees: ['smiting', 'healing', 'enhancements'],
};

const shamanClass: IClass = {
  name: 'Shaman',
  realm: 'Midgard',
  ra_trees: ['subterranean', 'spirit', 'enhancements'],
};

const allClasses: IClass[] = [clericClass, shamanClass];

describe('saveBuild', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores build in localStorage with correct structure', () => {
    const build = new Build(clericClass, 10, { augment_dexterity: 2 });
    saveBuild(build);

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBeTruthy();

    const parsed = JSON.parse(saved!);
    expect(parsed.version).toBe(CURRENT_VERSION);
    expect(parsed.className).toBe('Cleric');
    expect(parsed.realm).toBe('Albion');
    expect(parsed.purchasedAbilities).toEqual({ augment_dexterity: 2 });
    expect(parsed.spentPoints).toBe(10);
    expect(parsed.savedAt).toBeTruthy();
  });

  it('handles null characterClass', () => {
    const build = new Build(null, 0, {});
    saveBuild(build);

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBeTruthy();

    const parsed = JSON.parse(saved!);
    expect(parsed.className).toBeNull();
    expect(parsed.realm).toBeNull();
  });

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    const build = new Build(clericClass, 10, {});

    // Should not throw
    expect(() => saveBuild(build)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save build to localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
    localStorage.setItem = originalSetItem;
  });
});

describe('loadBuild', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no save exists', () => {
    const result = loadBuild(allClasses);
    expect(result).toBeNull();
  });

  it('restores saved build with class correctly', () => {
    const build = new Build(clericClass, 15, { augment_dexterity: 3 });
    saveBuild(build);

    const loaded = loadBuild(allClasses);
    expect(loaded).not.toBeNull();
    expect(loaded?.characterClass?.name).toBe('Cleric');
    expect(loaded?.characterClass?.realm).toBe('Albion');
    expect(loaded?.spentPoints).toBe(15);
    expect(loaded?.purchasedAbilities).toEqual({ augment_dexterity: 3 });
  });

  it('restores saved build without class (null class)', () => {
    const build = new Build(null, 0, {});
    saveBuild(build);

    const loaded = loadBuild(allClasses);
    expect(loaded).not.toBeNull();
    expect(loaded?.characterClass).toBeNull();
    expect(loaded?.spentPoints).toBe(0);
  });

  it('returns null if saved class not found in allClasses', () => {
    // Save a build with a class
    const build = new Build(clericClass, 10, {});
    saveBuild(build);

    // Load with an empty class list (simulating class removed)
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const loaded = loadBuild([]);

    expect(loaded).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Saved class not found, starting fresh');

    consoleSpy.mockRestore();
  });

  it('handles corrupted JSON gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(STORAGE_KEY, 'not valid json{{{');

    const result = loadBuild(allClasses);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load build from localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalGetItem = localStorage.getItem.bind(localStorage);
    localStorage.getItem = () => {
      throw new Error('SecurityError');
    };

    const result = loadBuild(allClasses);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load build from localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
    localStorage.getItem = originalGetItem;
  });
});

describe('clearSavedBuild', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes saved data from localStorage', () => {
    const build = new Build(clericClass, 10, {});
    saveBuild(build);
    expect(hasSavedBuild()).toBe(true);

    clearSavedBuild();
    expect(hasSavedBuild()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('handles errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);
    localStorage.removeItem = () => {
      throw new Error('SecurityError');
    };

    // Should not throw
    expect(() => clearSavedBuild()).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to clear saved build:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
    localStorage.removeItem = originalRemoveItem;
  });
});

describe('hasSavedBuild', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns true when save exists', () => {
    const build = new Build(clericClass, 10, {});
    saveBuild(build);

    expect(hasSavedBuild()).toBe(true);
  });

  it('returns false when no save exists', () => {
    expect(hasSavedBuild()).toBe(false);
  });

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalGetItem = localStorage.getItem.bind(localStorage);
    localStorage.getItem = () => {
      throw new Error('SecurityError');
    };

    const result = hasSavedBuild();

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to check for saved build:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
    localStorage.getItem = originalGetItem;
  });
});

describe('persistence integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('build survives save/load cycle', () => {
    // Create a build with abilities
    const original = new Build(clericClass, 22, {
      augment_dexterity: 3,
      long_wind: 2,
    });

    // Save it
    saveBuild(original);

    // Load it back
    const restored = loadBuild(allClasses);

    // Verify all data matches
    expect(restored).not.toBeNull();
    expect(restored?.characterClass?.name).toBe(original.characterClass?.name);
    expect(restored?.characterClass?.realm).toBe(original.characterClass?.realm);
    expect(restored?.spentPoints).toBe(original.spentPoints);
    expect(restored?.purchasedAbilities).toEqual(original.purchasedAbilities);
  });

  it('multiple saves overwrite previous data', () => {
    const build1 = new Build(clericClass, 10, { ability1: 1 });
    saveBuild(build1);

    const build2 = new Build(shamanClass, 20, { ability2: 2 });
    saveBuild(build2);

    const loaded = loadBuild(allClasses);
    expect(loaded?.characterClass?.name).toBe('Shaman');
    expect(loaded?.spentPoints).toBe(20);
    expect(loaded?.purchasedAbilities).toEqual({ ability2: 2 });
  });
});
