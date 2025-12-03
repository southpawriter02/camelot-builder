import { Build } from './build';

/**
 * Manages undo/redo history for the build
 */
export class BuildHistory {
  private past: Build[] = [];
  private future: Build[] = [];
  private current: Build;
  private maxHistory: number;

  constructor(initialBuild: Build, maxHistory: number = 50) {
    this.current = initialBuild;
    this.maxHistory = maxHistory;
  }

  /**
   * Get the current build
   */
  getCurrent(): Build {
    return this.current;
  }

  /**
   * Push a new state (clears redo history)
   */
  push(newBuild: Build): BuildHistory {
    // Don't push if the build is the same (no actual change)
    if (this.isSameBuild(this.current, newBuild)) {
      return this;
    }

    const newHistory = new BuildHistory(newBuild, this.maxHistory);
    newHistory.past = [...this.past, this.current].slice(-this.maxHistory);
    newHistory.future = [];
    return newHistory;
  }

  /**
   * Undo to previous state
   */
  undo(): BuildHistory {
    if (this.past.length === 0) {
      return this;
    }

    const newHistory = new BuildHistory(this.past[this.past.length - 1], this.maxHistory);
    newHistory.past = this.past.slice(0, -1);
    newHistory.future = [this.current, ...this.future];
    return newHistory;
  }

  /**
   * Redo to next state
   */
  redo(): BuildHistory {
    if (this.future.length === 0) {
      return this;
    }

    const newHistory = new BuildHistory(this.future[0], this.maxHistory);
    newHistory.past = [...this.past, this.current];
    newHistory.future = this.future.slice(1);
    return newHistory;
  }

  /**
   * Reset history with a new build (e.g., when class changes)
   */
  reset(newBuild: Build): BuildHistory {
    return new BuildHistory(newBuild, this.maxHistory);
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.past.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.future.length > 0;
  }

  /**
   * Get the number of undo steps available
   */
  undoCount(): number {
    return this.past.length;
  }

  /**
   * Get the number of redo steps available
   */
  redoCount(): number {
    return this.future.length;
  }

  /**
   * Check if two builds are the same
   */
  private isSameBuild(a: Build, b: Build): boolean {
    if (a.characterClass?.name !== b.characterClass?.name) return false;
    if (a.characterClass?.realm !== b.characterClass?.realm) return false;
    if (a.spentPoints !== b.spentPoints) return false;

    const aKeys = Object.keys(a.purchasedAbilities);
    const bKeys = Object.keys(b.purchasedAbilities);
    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(key => a.purchasedAbilities[key] === b.purchasedAbilities[key]);
  }
}
