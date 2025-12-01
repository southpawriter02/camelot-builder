import type { IClass } from '../types';
import { Build } from './build';
import type { PurchasedAbilities } from './build';

/**
 * Encode a build to a shareable string (base64 encoded JSON)
 */
export function encodeBuild(build: Build): string {
  const data = {
    c: build.characterClass ? `${build.characterClass.realm[0]}:${build.characterClass.name}` : null,
    a: build.purchasedAbilities,
  };

  const json = JSON.stringify(data);
  return btoa(json);
}

/**
 * Decode a shareable string back to build data
 */
export function decodeBuild(
  encoded: string,
  allClasses: IClass[]
): Build | null {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json);

    let characterClass: IClass | null = null;
    if (data.c) {
      const [realmInitial, className] = data.c.split(':');
      const realmMap: Record<string, string> = {
        'A': 'Albion',
        'M': 'Midgard',
        'H': 'Hibernia',
      };
      const realm = realmMap[realmInitial];
      characterClass = allClasses.find(
        c => c.name === className && c.realm === realm
      ) ?? null;
    }

    const purchasedAbilities: PurchasedAbilities = data.a || {};

    // Calculate spent points from purchased abilities
    // Note: This is a simplified calculation; in real app, we'd need ability data
    let spentPoints = 0;
    // We'll recalculate points properly when the build is created

    return new Build(characterClass, spentPoints, purchasedAbilities);
  } catch (error) {
    console.error('Failed to decode build:', error);
    return null;
  }
}

/**
 * Get the current URL with build data as hash
 */
export function getBuildShareUrl(build: Build): string {
  const encoded = encodeBuild(build);
  const url = new URL(window.location.href);
  url.hash = `build=${encoded}`;
  return url.toString();
}

/**
 * Extract build code from URL hash if present
 */
export function getBuildFromUrl(): string | null {
  const hash = window.location.hash;
  if (!hash) return null;

  const match = hash.match(/build=([A-Za-z0-9+/=]+)/);
  return match ? match[1] : null;
}

/**
 * Clear the build from URL hash
 */
export function clearBuildFromUrl(): void {
  if (window.location.hash.includes('build=')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}
