import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  encodeBuild,
  decodeBuild,
  getBuildShareUrl,
  getBuildFromUrl,
  clearBuildFromUrl,
} from './sharing';
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

const druidClass: IClass = {
  name: 'Druid',
  realm: 'Hibernia',
  ra_trees: ['nature', 'nurture', 'enhancements'],
};

const allClasses: IClass[] = [clericClass, shamanClass, druidClass];

describe('encodeBuild', () => {
  it('produces valid base64 string', () => {
    const build = new Build(clericClass, 10, { augment_dexterity: 2 });
    const encoded = encodeBuild(build);

    expect(encoded).toBeTruthy();
    expect(() => atob(encoded)).not.toThrow();
  });

  it('compresses Albion realm to "A"', () => {
    const build = new Build(clericClass, 0, {});
    const encoded = encodeBuild(build);
    const decoded = JSON.parse(atob(encoded));

    expect(decoded.c).toBe('A:Cleric');
  });

  it('compresses Midgard realm to "M"', () => {
    const build = new Build(shamanClass, 0, {});
    const encoded = encodeBuild(build);
    const decoded = JSON.parse(atob(encoded));

    expect(decoded.c).toBe('M:Shaman');
  });

  it('compresses Hibernia realm to "H"', () => {
    const build = new Build(druidClass, 0, {});
    const encoded = encodeBuild(build);
    const decoded = JSON.parse(atob(encoded));

    expect(decoded.c).toBe('H:Druid');
  });

  it('handles null characterClass', () => {
    const build = new Build(null, 0, {});
    const encoded = encodeBuild(build);
    const decoded = JSON.parse(atob(encoded));

    expect(decoded.c).toBeNull();
  });

  it('includes purchased abilities', () => {
    const build = new Build(clericClass, 10, {
      augment_dexterity: 3,
      long_wind: 2,
    });
    const encoded = encodeBuild(build);
    const decoded = JSON.parse(atob(encoded));

    expect(decoded.a).toEqual({ augment_dexterity: 3, long_wind: 2 });
  });
});

describe('decodeBuild', () => {
  it('restores build from encoded string', () => {
    const original = new Build(clericClass, 10, { augment_dexterity: 2 });
    const encoded = encodeBuild(original);
    const restored = decodeBuild(encoded, allClasses);

    expect(restored).not.toBeNull();
    expect(restored?.characterClass?.name).toBe('Cleric');
    expect(restored?.characterClass?.realm).toBe('Albion');
    expect(restored?.purchasedAbilities).toEqual({ augment_dexterity: 2 });
  });

  it('expands realm code "A" to Albion', () => {
    const encoded = btoa(JSON.stringify({ c: 'A:Cleric', a: {} }));
    const result = decodeBuild(encoded, allClasses);

    expect(result?.characterClass?.realm).toBe('Albion');
  });

  it('expands realm code "M" to Midgard', () => {
    const encoded = btoa(JSON.stringify({ c: 'M:Shaman', a: {} }));
    const result = decodeBuild(encoded, allClasses);

    expect(result?.characterClass?.realm).toBe('Midgard');
  });

  it('expands realm code "H" to Hibernia', () => {
    const encoded = btoa(JSON.stringify({ c: 'H:Druid', a: {} }));
    const result = decodeBuild(encoded, allClasses);

    expect(result?.characterClass?.realm).toBe('Hibernia');
  });

  it('returns null for invalid base64', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = decodeBuild('not-valid-base64!!!', allClasses);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to decode build:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('returns null for malformed JSON', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // This is valid base64 but decodes to invalid JSON
    const encoded = btoa('not valid json {{{');

    const result = decodeBuild(encoded, allClasses);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to decode build:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('handles missing class gracefully (returns build with null class)', () => {
    // Unknown realm code
    const encoded = btoa(JSON.stringify({ c: 'X:Unknown', a: {} }));
    const result = decodeBuild(encoded, allClasses);

    expect(result).not.toBeNull();
    expect(result?.characterClass).toBeNull();
  });

  it('handles class not in allClasses list', () => {
    // Valid realm code but class doesn't exist
    const encoded = btoa(JSON.stringify({ c: 'A:Wizard', a: {} }));
    const result = decodeBuild(encoded, allClasses);

    expect(result).not.toBeNull();
    expect(result?.characterClass).toBeNull();
  });

  it('restores abilities correctly', () => {
    const abilities = { ability1: 1, ability2: 3, ability3: 5 };
    const encoded = btoa(JSON.stringify({ c: null, a: abilities }));
    const result = decodeBuild(encoded, allClasses);

    expect(result?.purchasedAbilities).toEqual(abilities);
  });

  it('handles null class in encoded data', () => {
    const encoded = btoa(JSON.stringify({ c: null, a: { test: 1 } }));
    const result = decodeBuild(encoded, allClasses);

    expect(result).not.toBeNull();
    expect(result?.characterClass).toBeNull();
    expect(result?.purchasedAbilities).toEqual({ test: 1 });
  });

  it('handles empty abilities', () => {
    const encoded = btoa(JSON.stringify({ c: 'A:Cleric', a: {} }));
    const result = decodeBuild(encoded, allClasses);

    expect(result?.purchasedAbilities).toEqual({});
  });

  it('handles missing abilities property', () => {
    const encoded = btoa(JSON.stringify({ c: 'A:Cleric' }));
    const result = decodeBuild(encoded, allClasses);

    expect(result?.purchasedAbilities).toEqual({});
  });
});

describe('getBuildShareUrl', () => {
  it('returns URL with build hash', () => {
    const build = new Build(clericClass, 0, {});
    const url = getBuildShareUrl(build);

    expect(url).toContain('#build=');
    expect(url).toContain(window.location.origin);
  });

  it('includes encoded build in hash', () => {
    const build = new Build(clericClass, 0, { test: 1 });
    const url = getBuildShareUrl(build);
    const encoded = encodeBuild(build);

    expect(url).toContain(`#build=${encoded}`);
  });
});

describe('getBuildFromUrl', () => {
  let originalHash: string;

  beforeEach(() => {
    originalHash = window.location.hash;
  });

  afterEach(() => {
    window.location.hash = originalHash;
  });

  it('extracts code from hash', () => {
    const testCode = 'eyJjIjpudWxsLCJhIjp7fX0=';
    window.location.hash = `#build=${testCode}`;

    const code = getBuildFromUrl();
    expect(code).toBe(testCode);
  });

  it('returns null when no build in hash', () => {
    window.location.hash = '#other=value';

    expect(getBuildFromUrl()).toBeNull();
  });

  it('returns null when hash is empty', () => {
    window.location.hash = '';

    expect(getBuildFromUrl()).toBeNull();
  });

  it('handles hash with only #', () => {
    window.location.hash = '#';

    expect(getBuildFromUrl()).toBeNull();
  });

  it('extracts code when other params present', () => {
    const testCode = 'eyJjIjpudWxsLCJhIjp7fX0=';
    window.location.hash = `#other=value&build=${testCode}`;

    const code = getBuildFromUrl();
    expect(code).toBe(testCode);
  });
});

describe('clearBuildFromUrl', () => {
  let originalHash: string;
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalHash = window.location.hash;
    replaceStateSpy = vi.spyOn(history, 'replaceState');
  });

  afterEach(() => {
    window.location.hash = originalHash;
    replaceStateSpy.mockRestore();
  });

  it('removes build hash from URL', () => {
    window.location.hash = '#build=eyJjIjpudWxsLCJhIjp7fX0=';

    clearBuildFromUrl();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining(window.location.pathname)
    );
  });

  it('does nothing when no hash present', () => {
    window.location.hash = '';

    clearBuildFromUrl();

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('does nothing when hash has no build', () => {
    window.location.hash = '#other=value';

    clearBuildFromUrl();

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });
});

describe('sharing integration', () => {
  let originalHash: string;

  beforeEach(() => {
    originalHash = window.location.hash;
  });

  afterEach(() => {
    window.location.hash = originalHash;
  });

  it('full encode → decode cycle preserves build data', () => {
    const original = new Build(clericClass, 22, {
      augment_dexterity: 3,
      long_wind: 2,
    });

    const encoded = encodeBuild(original);
    const restored = decodeBuild(encoded, allClasses);

    expect(restored).not.toBeNull();
    expect(restored?.characterClass?.name).toBe(original.characterClass?.name);
    expect(restored?.characterClass?.realm).toBe(original.characterClass?.realm);
    expect(restored?.purchasedAbilities).toEqual(original.purchasedAbilities);
  });

  it('share URL → extract → decode cycle works', () => {
    const original = new Build(shamanClass, 15, { ability1: 2 });

    // Generate share URL
    const shareUrl = getBuildShareUrl(original);
    expect(shareUrl).toContain('#build=');

    // Extract hash and set it
    const url = new URL(shareUrl);
    window.location.hash = url.hash;

    // Extract and decode
    const code = getBuildFromUrl();
    expect(code).toBeTruthy();

    const restored = decodeBuild(code!, allClasses);
    expect(restored?.characterClass?.name).toBe('Shaman');
    expect(restored?.purchasedAbilities).toEqual({ ability1: 2 });
  });

  it('handles all three realms in full cycle', () => {
    for (const testClass of allClasses) {
      const original = new Build(testClass, 0, {});
      const encoded = encodeBuild(original);
      const restored = decodeBuild(encoded, allClasses);

      expect(restored?.characterClass?.name).toBe(testClass.name);
      expect(restored?.characterClass?.realm).toBe(testClass.realm);
    }
  });

  it('handles empty build in full cycle', () => {
    const original = new Build(null, 0, {});
    const encoded = encodeBuild(original);
    const restored = decodeBuild(encoded, allClasses);

    expect(restored).not.toBeNull();
    expect(restored?.characterClass).toBeNull();
    expect(restored?.purchasedAbilities).toEqual({});
  });
});
