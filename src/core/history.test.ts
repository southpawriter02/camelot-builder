import { describe, it, expect } from 'vitest';
import { BuildHistory } from './history';
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

// Test builds
const buildA = new Build(null, 0, {});
const buildB = new Build(null, 5, { ability1: 1 });
const buildC = new Build(null, 10, { ability1: 2 });
const buildD = new Build(clericClass, 15, { ability1: 3 });

describe('BuildHistory constructor', () => {
  it('creates with initial build', () => {
    const history = new BuildHistory(buildA);

    expect(history.getCurrent()).toBe(buildA);
  });

  it('starts with no undo/redo available', () => {
    const history = new BuildHistory(buildA);

    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
    expect(history.undoCount()).toBe(0);
    expect(history.redoCount()).toBe(0);
  });
});

describe('getCurrent', () => {
  it('returns current build', () => {
    const history = new BuildHistory(buildA);

    expect(history.getCurrent()).toBe(buildA);
  });

  it('returns updated build after push', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);

    expect(history.getCurrent()).toBe(buildB);
  });
});

describe('push', () => {
  it('adds to history and enables undo', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);

    expect(history.getCurrent()).toBe(buildB);
    expect(history.canUndo()).toBe(true);
    expect(history.undoCount()).toBe(1);
  });

  it('clears future when pushing new state', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();
    expect(history.canRedo()).toBe(true);

    history = history.push(buildC);
    expect(history.canRedo()).toBe(false);
    expect(history.redoCount()).toBe(0);
  });

  it('returns same instance if build is unchanged', () => {
    const history = new BuildHistory(buildA);
    const sameHistory = history.push(buildA);

    expect(sameHistory).toBe(history);
  });

  it('returns same instance for equivalent build', () => {
    const build1 = new Build(null, 5, { ability1: 1 });
    const build2 = new Build(null, 5, { ability1: 1 });
    const history = new BuildHistory(build1);
    const sameHistory = history.push(build2);

    expect(sameHistory).toBe(history);
  });

  it('trims past when exceeding maxHistory', () => {
    let history = new BuildHistory(buildA, 3);

    // Push 5 builds (A already there, push B, C, D, E, F)
    for (let i = 1; i <= 5; i++) {
      history = history.push(new Build(null, i, { [`ability${i}`]: i }));
    }

    // Should only keep 3 in past
    expect(history.undoCount()).toBe(3);
  });

  it('respects custom maxHistory value', () => {
    let history = new BuildHistory(buildA, 2);

    history = history.push(buildB);
    history = history.push(buildC);
    history = history.push(buildD);

    // Only 2 should be kept in past
    expect(history.undoCount()).toBe(2);
  });
});

describe('undo', () => {
  it('restores previous state', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();

    expect(history.getCurrent()).toBe(buildA);
  });

  it('moves current to future', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();

    expect(history.canRedo()).toBe(true);
    expect(history.redoCount()).toBe(1);
  });

  it('returns same instance when past is empty', () => {
    const history = new BuildHistory(buildA);
    const sameHistory = history.undo();

    expect(sameHistory).toBe(history);
  });

  it('can undo multiple times', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);

    history = history.undo();
    expect(history.getCurrent()).toBe(buildB);

    history = history.undo();
    expect(history.getCurrent()).toBe(buildA);
  });

  it('decrements undo count and increments redo count', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);

    expect(history.undoCount()).toBe(2);
    expect(history.redoCount()).toBe(0);

    history = history.undo();
    expect(history.undoCount()).toBe(1);
    expect(history.redoCount()).toBe(1);
  });
});

describe('redo', () => {
  it('restores next state', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();
    history = history.redo();

    expect(history.getCurrent()).toBe(buildB);
  });

  it('moves current to past', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();

    expect(history.undoCount()).toBe(0);

    history = history.redo();
    expect(history.undoCount()).toBe(1);
  });

  it('returns same instance when future is empty', () => {
    const history = new BuildHistory(buildA);
    const sameHistory = history.redo();

    expect(sameHistory).toBe(history);
  });

  it('can redo multiple times', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);
    history = history.undo();
    history = history.undo();

    history = history.redo();
    expect(history.getCurrent()).toBe(buildB);

    history = history.redo();
    expect(history.getCurrent()).toBe(buildC);
  });

  it('decrements redo count and increments undo count', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);
    history = history.undo();
    history = history.undo();

    expect(history.undoCount()).toBe(0);
    expect(history.redoCount()).toBe(2);

    history = history.redo();
    expect(history.undoCount()).toBe(1);
    expect(history.redoCount()).toBe(1);
  });
});

describe('reset', () => {
  it('clears all history', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);
    history = history.reset(buildD);

    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });

  it('sets new current build', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.reset(buildD);

    expect(history.getCurrent()).toBe(buildD);
  });

  it('clears redo history', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();
    expect(history.canRedo()).toBe(true);

    history = history.reset(buildC);
    expect(history.canRedo()).toBe(false);
  });
});

describe('canUndo and canRedo', () => {
  it('returns false initially', () => {
    const history = new BuildHistory(buildA);

    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });

  it('canUndo becomes true after push', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);

    expect(history.canUndo()).toBe(true);
  });

  it('canRedo becomes true after undo', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();

    expect(history.canRedo()).toBe(true);
  });

  it('canUndo becomes false after undoing all', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();

    expect(history.canUndo()).toBe(false);
  });

  it('canRedo becomes false after redoing all', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();
    history = history.redo();

    expect(history.canRedo()).toBe(false);
  });
});

describe('undoCount and redoCount', () => {
  it('returns 0 initially', () => {
    const history = new BuildHistory(buildA);

    expect(history.undoCount()).toBe(0);
    expect(history.redoCount()).toBe(0);
  });

  it('undoCount increases with push', () => {
    let history = new BuildHistory(buildA);

    history = history.push(buildB);
    expect(history.undoCount()).toBe(1);

    history = history.push(buildC);
    expect(history.undoCount()).toBe(2);
  });

  it('redoCount increases with undo', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);

    history = history.undo();
    expect(history.redoCount()).toBe(1);

    history = history.undo();
    expect(history.redoCount()).toBe(2);
  });
});

describe('isSameBuild (via push behavior)', () => {
  it('detects different class name', () => {
    const build1 = new Build(clericClass, 0, {});
    const build2 = new Build(shamanClass, 0, {});
    let history = new BuildHistory(build1);
    history = history.push(build2);

    expect(history.undoCount()).toBe(1); // Different, so pushed
  });

  it('detects different realm', () => {
    const class1: IClass = { name: 'Test', realm: 'Albion', ra_trees: [] };
    const class2: IClass = { name: 'Test', realm: 'Midgard', ra_trees: [] };
    const build1 = new Build(class1, 0, {});
    const build2 = new Build(class2, 0, {});
    let history = new BuildHistory(build1);
    history = history.push(build2);

    expect(history.undoCount()).toBe(1); // Different, so pushed
  });

  it('detects different spentPoints', () => {
    const build1 = new Build(null, 5, {});
    const build2 = new Build(null, 10, {});
    let history = new BuildHistory(build1);
    history = history.push(build2);

    expect(history.undoCount()).toBe(1); // Different, so pushed
  });

  it('detects different purchasedAbilities', () => {
    const build1 = new Build(null, 0, { ability1: 1 });
    const build2 = new Build(null, 0, { ability1: 2 });
    let history = new BuildHistory(build1);
    history = history.push(build2);

    expect(history.undoCount()).toBe(1); // Different, so pushed
  });

  it('detects different ability count', () => {
    const build1 = new Build(null, 0, { ability1: 1 });
    const build2 = new Build(null, 0, { ability1: 1, ability2: 1 });
    let history = new BuildHistory(build1);
    history = history.push(build2);

    expect(history.undoCount()).toBe(1); // Different, so pushed
  });

  it('considers null and defined class as different', () => {
    const build1 = new Build(null, 0, {});
    const build2 = new Build(clericClass, 0, {});
    let history = new BuildHistory(build1);
    history = history.push(build2);

    expect(history.undoCount()).toBe(1); // Different, so pushed
  });
});

describe('history integration', () => {
  it('full undo/redo cycle maintains build integrity', () => {
    let history = new BuildHistory(buildA);

    // Make changes
    history = history.push(buildB);
    history = history.push(buildC);
    expect(history.getCurrent()).toBe(buildC);

    // Undo twice
    history = history.undo();
    history = history.undo();
    expect(history.getCurrent()).toBe(buildA);

    // Redo twice
    history = history.redo();
    history = history.redo();
    expect(history.getCurrent()).toBe(buildC);
  });

  it('push after undo clears entire future', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);

    // Undo once, leaving C in future
    history = history.undo();
    expect(history.redoCount()).toBe(1);

    // Push new state, should clear future
    history = history.push(buildD);
    expect(history.redoCount()).toBe(0);
    expect(history.getCurrent()).toBe(buildD);

    // Can't redo to C anymore
    const afterRedo = history.redo();
    expect(afterRedo).toBe(history);
  });

  it('maxHistory enforcement preserves most recent states', () => {
    let history = new BuildHistory(buildA, 3);

    // Push 5 states
    const builds = [];
    for (let i = 1; i <= 5; i++) {
      const build = new Build(null, i * 10, { [`ability${i}`]: i });
      builds.push(build);
      history = history.push(build);
    }

    // Should have exactly 3 in past
    expect(history.undoCount()).toBe(3);

    // Current should be the last one pushed
    expect(history.getCurrent()).toBe(builds[4]);

    // Undo 3 times should get us to builds[1] (skipping builds[0] which was trimmed)
    history = history.undo();
    expect(history.getCurrent()).toBe(builds[3]);

    history = history.undo();
    expect(history.getCurrent()).toBe(builds[2]);

    history = history.undo();
    expect(history.getCurrent()).toBe(builds[1]);

    // Can't undo further
    const afterUndo = history.undo();
    expect(afterUndo).toBe(history);
  });

  it('immutability: original instance unchanged after operations', () => {
    const original = new BuildHistory(buildA);
    const afterPush = original.push(buildB);

    expect(original.getCurrent()).toBe(buildA);
    expect(original.canUndo()).toBe(false);
    expect(afterPush.getCurrent()).toBe(buildB);
    expect(afterPush.canUndo()).toBe(true);
  });

  it('multiple undo/redo with maxHistory', () => {
    let history = new BuildHistory(buildA, 2);

    // Push B, C, D
    history = history.push(buildB);
    history = history.push(buildC);
    history = history.push(buildD);

    // Past should have [B, C], current is D
    expect(history.undoCount()).toBe(2);

    // Undo to C
    history = history.undo();
    expect(history.getCurrent()).toBe(buildC);

    // Undo to B
    history = history.undo();
    expect(history.getCurrent()).toBe(buildB);

    // Can't undo to A (was trimmed)
    const afterUndo = history.undo();
    expect(afterUndo).toBe(history);

    // Redo back to D
    history = history.redo();
    history = history.redo();
    expect(history.getCurrent()).toBe(buildD);
  });
});
