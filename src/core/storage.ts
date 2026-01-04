import type { IClass } from '../types';
import { Build } from './build';
import type { PurchasedAbilities } from './build';

/** localStorage key for saved build data */
export const STORAGE_KEY = 'camelot-builder-save';

/** Current schema version for saved builds */
export const CURRENT_VERSION = 1;

/**
 * Structure of a saved build in localStorage
 */
export interface SavedBuild {
  version: number;
  className: string | null;
  realm: string | null;
  purchasedAbilities: PurchasedAbilities;
  spentPoints: number;
  savedAt: string;
}

/**
 * Save the current build to localStorage
 */
export function saveBuild(build: Build): void {
  const savedBuild: SavedBuild = {
    version: CURRENT_VERSION,
    className: build.characterClass?.name ?? null,
    realm: build.characterClass?.realm ?? null,
    purchasedAbilities: build.purchasedAbilities,
    spentPoints: build.spentPoints,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBuild));
  } catch (error) {
    console.error('Failed to save build to localStorage:', error);
  }
}

/**
 * Load a build from localStorage
 */
export function loadBuild(allClasses: IClass[]): Build | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const savedBuild: SavedBuild = JSON.parse(saved);

    // Find the matching class
    let characterClass: IClass | null = null;
    if (savedBuild.className && savedBuild.realm) {
      characterClass = allClasses.find(
        c => c.name === savedBuild.className && c.realm === savedBuild.realm
      ) ?? null;
    }

    // If class was saved but not found, return null (class may have been removed)
    if (savedBuild.className && !characterClass) {
      console.warn('Saved class not found, starting fresh');
      return null;
    }

    return new Build(
      characterClass,
      savedBuild.spentPoints,
      savedBuild.purchasedAbilities
    );
  } catch (error) {
    console.error('Failed to load build from localStorage:', error);
    return null;
  }
}

/**
 * Clear the saved build from localStorage
 */
export function clearSavedBuild(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear saved build:', error);
  }
}

/**
 * Check if a saved build exists
 */
export function hasSavedBuild(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check for saved build:', error);
    return false;
  }
}
