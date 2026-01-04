# FX-03: Undo/Redo History

**Feature ID:** FX-03
**Status:** Complete
**Priority:** Medium
**Category:** Functional UX

---

## Overview

Undo/Redo History enables users to navigate backward and forward through their build changes, allowing them to experiment freely and revert mistakes.

### User Story

> As a player, I want to undo my last ability purchase so that I can experiment with different build paths without starting over.

---

## Implementation Details

### Primary File
`src/core/history.ts`

### Class: BuildHistory

An immutable history manager that maintains past and future state stacks.

### Public Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `getCurrent()` | Get current build state | `Build` |
| `push(newBuild)` | Add new state (clears redo) | `BuildHistory` |
| `undo()` | Move to previous state | `BuildHistory` |
| `redo()` | Move to next state | `BuildHistory` |
| `reset(newBuild)` | Clear history with new state | `BuildHistory` |
| `canUndo()` | Check if undo available | `boolean` |
| `canRedo()` | Check if redo available | `boolean` |
| `undoCount()` | Get undo stack size | `number` |
| `redoCount()` | Get redo stack size | `number` |

### Configuration

| Setting | Default | Purpose |
|---------|---------|---------|
| `maxHistory` | 50 | Maximum undo states to keep |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     BuildHistory Class                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Internal State                       │ │
│  │                                                         │ │
│  │  past: Build[]      current: Build      future: Build[] │ │
│  │  ┌─────────────┐    ┌───────────┐      ┌─────────────┐  │ │
│  │  │ [State 1]   │    │ [Current] │      │ [Future 1]  │  │ │
│  │  │ [State 2]   │    │           │      │ [Future 2]  │  │ │
│  │  │ [State 3]   │    └───────────┘      │             │  │ │
│  │  │     ...     │                       └─────────────┘  │ │
│  │  └─────────────┘                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Immutable Design                      ││
│  │                                                          ││
│  │  Every method returns a NEW BuildHistory instance        ││
│  │  Original instance is never modified                     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### State Transitions

```
Initial State:
past: []  current: A  future: []

After push(B):
past: [A]  current: B  future: []

After push(C):
past: [A, B]  current: C  future: []

After undo():
past: [A]  current: B  future: [C]

After undo():
past: []  current: A  future: [B, C]

After redo():
past: [A]  current: B  future: [C]

After push(D):  (clears future!)
past: [A, B]  current: D  future: []
```

---

## Decision Tree

### Push Decision

```
                    ┌─────────────────┐
                    │  push(newBuild) │
                    │  called         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Is newBuild     │
                    │ same as current?│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ Yes (same)                  │ No (different)
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Return this     │           │ Create new      │
    │ (no change)     │           │ BuildHistory    │
    └─────────────────┘           └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │ past = [...past,│
                                  │         current]│
                                  │ current = new   │
                                  │ future = []     │
                                  └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │ past.length >   │
                                  │ maxHistory?     │
                                  └────────┬────────┘
                                           │
                            ┌──────────────┼──────────────┐
                            │ Yes                         │ No
                            ▼                             ▼
                  ┌─────────────────┐           ┌─────────────────┐
                  │ Trim oldest     │           │ Keep all        │
                  │ past.slice(-max)│           └─────────────────┘
                  └─────────────────┘
```

### Undo Decision

```
                    ┌─────────────────┐
                    │    undo()       │
                    │    called       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ past.length > 0 │
                    │ ?               │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ No (empty)                  │ Yes (has past)
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Return this     │           │ Create new      │
    │ (can't undo)    │           │ BuildHistory    │
    └─────────────────┘           └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │ past = past[:-1]│
                                  │ current = past  │
                                  │           .last │
                                  │ future = [curr, │
                                  │          ...fut]│
                                  └─────────────────┘
```

---

## Integration Points

### Inbound Dependencies
- `Build` class from `src/core/build.ts`

### Outbound Integration
- Managed as React state in `App.tsx`
- UI controls in `ActionBar.tsx` (undo/redo buttons)
- Keyboard shortcuts in `useKeyboardShortcuts.ts`

### Related Features
| Feature | Relationship |
|---------|--------------|
| FX-06 Keyboard Shortcuts | Ctrl+Z for undo, Ctrl+Shift+Z for redo |
| FX-01 Build Persistence | History is NOT persisted (current build only) |

---

## Workflow Diagram

### User Undo Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Press Ctrl+Z        →    useKeyboardShortcuts fires
(or click Undo)          │
                         ▼
                    Check canUndo()
                         │
                    ┌────┴────┐
                    │ true    │
                    └────┬────┘
                         ▼
                    history.undo()
                         │
                         ▼
                    New BuildHistory returned
                         │
                         ▼
                    setHistory(newHistory)
                         │
                         ▼
                    React re-renders
                         │
                         ▼
                    UI shows previous state
                         │
                         ▼
                    saveBuild(current)
                    (Persist new current)
```

### Ability Purchase Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Click "+" on ability →   build.purchaseAbility()
                         │
                         ▼
                    New Build returned
                         │
                         ▼
                    history.push(newBuild)
                         │
                    ┌────┴────────────────────────┐
                    │ isSameBuild() check         │
                    │ (prevents duplicate states) │
                    └────┬────────────────────────┘
                         │
                    ┌────┴────┐
                    │ Changed │
                    └────┬────┘
                         ▼
                    New BuildHistory
                    (past grows, future clears)
                         │
                         ▼
                    setHistory(newHistory)
                         │
                         ▼
                    UI updates
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('BuildHistory', () => {
  const buildA = new Build(null, 0, {});
  const buildB = new Build(null, 5, { ability1: 1 });
  const buildC = new Build(null, 10, { ability1: 2 });

  test('initial state has no undo/redo', () => {
    const history = new BuildHistory(buildA);

    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
    expect(history.getCurrent()).toBe(buildA);
  });

  test('push adds to history', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);

    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);
    expect(history.getCurrent()).toBe(buildB);
  });

  test('undo restores previous state', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();

    expect(history.getCurrent()).toBe(buildA);
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(true);
  });

  test('redo restores future state', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();
    history = history.redo();

    expect(history.getCurrent()).toBe(buildB);
  });

  test('push after undo clears future', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.undo();
    history = history.push(buildC);

    expect(history.canRedo()).toBe(false);
    expect(history.getCurrent()).toBe(buildC);
  });

  test('push with same build is ignored', () => {
    let history = new BuildHistory(buildA);
    const original = history;
    history = history.push(buildA);

    expect(history).toBe(original);  // Same instance
  });

  test('respects maxHistory limit', () => {
    let history = new BuildHistory(buildA, 3);

    for (let i = 0; i < 10; i++) {
      history = history.push(new Build(null, i, {}));
    }

    expect(history.undoCount()).toBe(3);
  });

  test('reset clears all history', () => {
    let history = new BuildHistory(buildA);
    history = history.push(buildB);
    history = history.push(buildC);
    history = history.reset(buildA);

    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('history integration', () => {
  test('undo/redo cycle maintains build integrity', () => {
    let history = new BuildHistory(emptyBuild);

    // Make changes
    history = history.push(buildWithOneAbility);
    history = history.push(buildWithTwoAbilities);

    // Undo twice
    history = history.undo();
    history = history.undo();

    expect(history.getCurrent().abilityCount).toBe(0);

    // Redo twice
    history = history.redo();
    history = history.redo();

    expect(history.getCurrent().abilityCount).toBe(2);
  });
});
```

---

## Deliverable Checklist

### Implementation
- [x] `BuildHistory` class with immutable design
- [x] `push()` with duplicate detection
- [x] `undo()` and `redo()` operations
- [x] `reset()` for class changes
- [x] `canUndo()` and `canRedo()` predicates
- [x] `undoCount()` and `redoCount()` getters
- [x] `maxHistory` limit enforcement
- [x] `isSameBuild()` deep equality check

### Testing
- [x] Unit tests in `build.test.ts`
- [ ] Additional edge case tests
- [ ] Performance test with max history

### Integration
- [x] React state management in App.tsx
- [x] ActionBar undo/redo buttons
- [x] Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- [x] Badge counts on buttons

---

## Known Issues & Future Improvements

### Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| History lost on refresh | User loses undo stack | Medium |
| No transaction grouping | Each click is one undo step | Low |
| No action labels | User can't see what will be undone | Low |

### Future Enhancements

1. **History Persistence** (v0.3.0+)
   ```typescript
   interface PersistedHistory {
     past: SavedBuild[];
     current: SavedBuild;
     future: SavedBuild[];
   }

   function saveHistory(history: BuildHistory): void {
     sessionStorage.setItem('history', JSON.stringify({
       past: history.past.map(serializeBuild),
       current: serializeBuild(history.current),
       future: history.future.map(serializeBuild),
     }));
   }
   ```

2. **Action Labels** (v0.4.0+)
   ```typescript
   interface HistoryEntry {
     build: Build;
     label: string;  // "Purchased Augment Dexterity Rank 2"
     timestamp: Date;
   }
   ```

3. **Transaction Grouping** (v1.0+)
   ```typescript
   // Group related changes into single undo step
   history.beginTransaction();
   build = build.purchaseAbility(ability1);
   build = build.purchaseAbility(ability2);
   history.commitTransaction('Purchased combo');
   ```

4. **History Panel UI**
   - Visual timeline of changes
   - Click to jump to any point
   - Preview on hover

---

## Code Reference

### Push Implementation

```typescript
// src/core/history.ts - Lines 27-37
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
```

### isSameBuild Implementation

```typescript
// src/core/history.ts - Lines 105-114
private isSameBuild(a: Build, b: Build): boolean {
  if (a.characterClass?.name !== b.characterClass?.name) return false;
  if (a.characterClass?.realm !== b.characterClass?.realm) return false;
  if (a.spentPoints !== b.spentPoints) return false;

  const aKeys = Object.keys(a.purchasedAbilities);
  const bKeys = Object.keys(b.purchasedAbilities);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(key => a.purchasedAbilities[key] === b.purchasedAbilities[key]);
}
```

---

*Document created: January 2025*
