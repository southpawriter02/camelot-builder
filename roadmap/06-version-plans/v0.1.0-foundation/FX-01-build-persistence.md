# FX-01: Build Persistence

**Feature ID:** FX-01
**Status:** Complete
**Priority:** High
**Category:** Functional UX

---

## Overview

Build Persistence enables users to save their realm ability builds to the browser's localStorage, allowing builds to survive page refreshes and browser sessions.

### User Story

> As a player, I want my build to be automatically saved so that I don't lose my progress when I close or refresh the browser.

---

## Implementation Details

### Primary File
`src/core/storage.ts`

### Exported Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `saveBuild(build)` | Saves build to localStorage | `void` |
| `loadBuild(allClasses)` | Loads build from localStorage | `Build \| null` |
| `clearSavedBuild()` | Removes saved build | `void` |
| `hasSavedBuild()` | Checks if save exists | `boolean` |

### Data Model

```typescript
interface SavedBuild {
  version: number;           // Schema version for migrations
  className: string | null;  // Selected class name
  realm: string | null;      // Class realm (Albion/Midgard/Hibernia)
  purchasedAbilities: PurchasedAbilities;  // Record<abilityId, rank>
  spentPoints: number;       // Total points spent
  savedAt: string;           // ISO timestamp
}
```

### Storage Key
```
camelot-builder-save
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   useEffect                          │    │
│  │  On mount: loadBuild() → Set initial state          │    │
│  │  On build change: saveBuild() → Persist             │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    storage.ts                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  saveBuild() │  │  loadBuild() │  │ clearSavedBuild()│   │
│  │              │  │              │  │                  │   │
│  │  Build →     │  │  JSON →      │  │  Remove key      │   │
│  │  JSON →      │  │  Build       │  │                  │   │
│  │  localStorage│  │              │  │                  │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
└─────────┼─────────────────┼───────────────────┼─────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     localStorage                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  "camelot-builder-save": {                          │    │
│  │    "version": 1,                                    │    │
│  │    "className": "Cleric",                           │    │
│  │    "realm": "Albion",                               │    │
│  │    "purchasedAbilities": { "augment_dex": 3 },      │    │
│  │    "spentPoints": 12,                               │    │
│  │    "savedAt": "2025-01-04T12:00:00Z"                │    │
│  │  }                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree

```
                    ┌─────────────────┐
                    │  Page Loads     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Check URL for   │
                    │ shared build?   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ Yes                         │ No
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Load from URL   │           │ hasSavedBuild()?│
    │ (FX-02 handles) │           └────────┬────────┘
    └─────────────────┘                    │
                                ┌──────────┼──────────┐
                                │ Yes                 │ No
                                ▼                     ▼
                      ┌─────────────────┐   ┌─────────────────┐
                      │ loadBuild()     │   │ Create fresh    │
                      │ Restore state   │   │ Build instance  │
                      └─────────────────┘   └─────────────────┘
```

---

## Integration Points

### Inbound Dependencies
- `Build` class from `src/core/build.ts`
- `IClass` type from `src/types/index.ts`
- `PurchasedAbilities` type from `src/core/build.ts`

### Outbound Integration
- Called by `App.tsx` on mount and state changes
- Works alongside FX-02 (URL sharing) with priority order:
  1. URL share takes precedence
  2. localStorage fallback

### Related Features
| Feature | Relationship |
|---------|--------------|
| FX-02 Build Sharing | URL loading takes precedence over localStorage |
| FX-03 Undo/Redo | History is NOT persisted (intentional) |

---

## Workflow Diagram

### Save Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Purchase ability    →    Build state changes
                         │
                         ▼
                    App.tsx useEffect
                         │
                         ▼
                    saveBuild(build)
                         │
                         ▼
                    Serialize to JSON
                         │
                         ▼
                    localStorage.setItem()
                         │
                         ▼
                    [Silent success]

                    (Error? → console.error, continue)
```

### Load Flow

```
Page Load                System Response
───────────────────────────────────────────────────────
Browser navigates   →    App.tsx mounts
                         │
                         ▼
                    Check URL for build
                         │
                    ┌────┴────┐
                    │ None    │
                    └────┬────┘
                         ▼
                    loadBuild(classes)
                         │
                         ▼
                    Parse JSON from storage
                         │
                         ▼
                    Find matching class
                         │
                    ┌────┴────┐
                    │ Found   │
                    └────┬────┘
                         ▼
                    Return Build instance
                         │
                         ▼
                    Initialize history
                         │
                         ▼
                    [Build restored]
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveBuild stores build in localStorage', () => {
    const build = new Build(mockClass, 10, { ability1: 2 });
    saveBuild(build);

    const saved = localStorage.getItem('camelot-builder-save');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!).className).toBe(mockClass.name);
  });

  test('loadBuild returns null when no save exists', () => {
    const result = loadBuild(mockClasses);
    expect(result).toBeNull();
  });

  test('loadBuild restores saved build', () => {
    const build = new Build(mockClass, 10, { ability1: 2 });
    saveBuild(build);

    const loaded = loadBuild(mockClasses);
    expect(loaded?.characterClass?.name).toBe(mockClass.name);
    expect(loaded?.purchasedAbilities).toEqual({ ability1: 2 });
  });

  test('loadBuild returns null if class no longer exists', () => {
    saveBuild(new Build({ name: 'Deleted', realm: 'Albion' }, 0, {}));

    const result = loadBuild([]);  // Empty class list
    expect(result).toBeNull();
  });

  test('clearSavedBuild removes saved data', () => {
    saveBuild(new Build(mockClass, 0, {}));
    clearSavedBuild();

    expect(hasSavedBuild()).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('persistence integration', () => {
  test('build survives page refresh', async () => {
    // Setup: Create and save a build
    const build = new Build(cleric, 15, { augment_dex: 3 });
    saveBuild(build);

    // Simulate refresh: Clear React state, reload from storage
    const restored = loadBuild(allClasses);

    expect(restored?.spentPoints).toBe(15);
    expect(restored?.purchasedAbilities.augment_dex).toBe(3);
  });
});
```

---

## Deliverable Checklist

### Implementation
- [x] `saveBuild()` function implemented
- [x] `loadBuild()` function implemented
- [x] `clearSavedBuild()` function implemented
- [x] `hasSavedBuild()` function implemented
- [x] Version field for future migrations
- [x] Error handling with try/catch
- [x] Integration with App.tsx

### Testing
- [ ] Unit tests for all functions
- [ ] Integration test for save/load cycle
- [ ] Error scenario tests (corrupted data, missing class)

### Edge Cases Handled
- [x] No saved build exists → Returns null
- [x] Saved class no longer exists → Returns null with warning
- [x] localStorage unavailable → Fails silently with console.error
- [x] Corrupted JSON → Fails silently with console.error

---

## Known Issues & Future Improvements

### Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No migration logic | Future schema changes may break old saves | Medium |
| Silent failures | User unaware if save fails | Low |
| No multiple builds | Only one build can be saved | Low |

### Future Enhancements

1. **Version Migration** (v0.2.0+)
   ```typescript
   function migrate(saved: SavedBuild): SavedBuild {
     if (saved.version < 2) {
       // Add new fields with defaults
       saved.stats = {};
       saved.version = 2;
     }
     return saved;
   }
   ```

2. **User Notification** (with SM-02 Toast)
   ```typescript
   export function saveBuild(build: Build, onError?: () => void): void {
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBuild));
     } catch (error) {
       console.error('Failed to save build:', error);
       onError?.();
     }
   }
   ```

3. **Multiple Build Slots** (v1.0+)
   - Save builds with custom names
   - Build management UI
   - Export/import builds

---

## Code Reference

### Current Implementation

```typescript
// src/core/storage.ts - Lines 19-34
export function saveBuild(build: Build): void {
  const savedBuild: SavedBuild = {
    version: 1,
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
```

---

*Document created: January 2025*
