# FX-04: Bonus Aggregation

**Feature ID:** FX-04
**Status:** Complete
**Priority:** High
**Category:** Functional UX

---

## Overview

Bonus Aggregation calculates and displays the total stat bonuses accumulated from all purchased abilities, giving users a clear view of their build's effectiveness.

### User Story

> As a player, I want to see the total bonuses my build provides so that I can optimize my character's stats.

---

## Current State Analysis

### What Exists

| Component | Status | Notes |
|-----------|--------|-------|
| Point cost tracking | Complete | `build.spentPoints` |
| Ability count | Complete | `build.abilityCount` |
| Per-ability cost display | Complete | BuildSummary shows costs |

### What's Missing

| Component | Required | Priority |
|-----------|----------|----------|
| Stat type definitions | Yes | Critical |
| Stats in IAbilityRank | Yes | Critical |
| Stats in abilities.json | Yes | Critical |
| aggregateStats() function | Yes | Critical |
| StatsDisplay component | Yes | Critical |
| Stats in BuildSummary | Yes | High |
| Stats in share encoding | No | Low |

---

## Implementation Specification

### Phase 1: Data Model Changes

#### 1.1 Define Stat Types

**File:** `src/types/index.ts`

```typescript
/**
 * Stat categories that abilities can modify
 */
export type StatType =
  | 'strength'
  | 'constitution'
  | 'dexterity'
  | 'quickness'
  | 'intelligence'
  | 'piety'
  | 'charisma'
  | 'empathy'
  | 'hits'           // Health points
  | 'power'          // Mana/power pool
  | 'armor_factor'   // AF bonus
  | 'melee_damage'   // Melee damage bonus
  | 'spell_damage'   // Spell damage bonus
  | 'melee_speed'    // Attack speed
  | 'cast_speed'     // Casting speed
  | 'heal_bonus'     // Healing effectiveness
  | 'range_bonus'    // Archery/spell range
  | 'resist_body'    // Resist types
  | 'resist_cold'
  | 'resist_heat'
  | 'resist_energy'
  | 'resist_matter'
  | 'resist_spirit';

/**
 * A stat bonus with type and value
 */
export interface IStatBonus {
  type: StatType;
  value: number;
  isPercentage?: boolean;  // true = +5%, false = +5
}

/**
 * Aggregated stats from all abilities
 */
export type AggregatedStats = Partial<Record<StatType, number>>;
```

#### 1.2 Extend IAbilityRank

**File:** `src/types/index.ts`

```typescript
export interface IAbilityRank {
  rank: number;
  cost: number;
  description: string;
  stats?: IStatBonus[];  // NEW: Optional stat bonuses for this rank
}
```

### Phase 2: Update Ability Data

**File:** `src/data/abilities.json`

Example update for existing abilities:

```json
{
  "id": "augment_dexterity",
  "name": "Augment Dexterity",
  "tree": "enhancements",
  "ranks": [
    {
      "rank": 1,
      "cost": 1,
      "description": "Increases Dexterity by 4",
      "stats": [{ "type": "dexterity", "value": 4 }]
    },
    {
      "rank": 2,
      "cost": 2,
      "description": "Increases Dexterity by 7",
      "stats": [{ "type": "dexterity", "value": 7 }]
    },
    {
      "rank": 3,
      "cost": 3,
      "description": "Increases Dexterity by 10",
      "stats": [{ "type": "dexterity", "value": 10 }]
    },
    {
      "rank": 4,
      "cost": 6,
      "description": "Increases Dexterity by 13",
      "stats": [{ "type": "dexterity", "value": 13 }]
    },
    {
      "rank": 5,
      "cost": 10,
      "description": "Increases Dexterity by 18",
      "stats": [{ "type": "dexterity", "value": 18 }]
    }
  ],
  "prerequisites": []
}
```

### Phase 3: Aggregation Logic

**File:** `src/core/stats.ts` (NEW)

```typescript
import type { IAbility, AggregatedStats, StatType } from '../types';
import type { PurchasedAbilities } from './build';

/**
 * Aggregate all stat bonuses from purchased abilities
 *
 * @param purchasedAbilities - Map of ability ID to purchased rank
 * @param allAbilities - Map of ability ID to ability data
 * @returns Aggregated stats totals
 */
export function aggregateStats(
  purchasedAbilities: PurchasedAbilities,
  allAbilities: Record<string, IAbility>
): AggregatedStats {
  const stats: AggregatedStats = {};

  for (const [abilityId, purchasedRank] of Object.entries(purchasedAbilities)) {
    const ability = allAbilities[abilityId];
    if (!ability) continue;

    // Get the stats for the purchased rank
    const rankData = ability.ranks.find(r => r.rank === purchasedRank);
    if (!rankData?.stats) continue;

    // Add each stat bonus
    for (const bonus of rankData.stats) {
      const current = stats[bonus.type] || 0;
      stats[bonus.type] = current + bonus.value;
    }
  }

  return stats;
}

/**
 * Get human-readable label for a stat type
 */
export function getStatLabel(stat: StatType): string {
  const labels: Record<StatType, string> = {
    strength: 'Strength',
    constitution: 'Constitution',
    dexterity: 'Dexterity',
    quickness: 'Quickness',
    intelligence: 'Intelligence',
    piety: 'Piety',
    charisma: 'Charisma',
    empathy: 'Empathy',
    hits: 'Hit Points',
    power: 'Power',
    armor_factor: 'Armor Factor',
    melee_damage: 'Melee Damage',
    spell_damage: 'Spell Damage',
    melee_speed: 'Melee Speed',
    cast_speed: 'Cast Speed',
    heal_bonus: 'Heal Bonus',
    range_bonus: 'Range',
    resist_body: 'Body Resist',
    resist_cold: 'Cold Resist',
    resist_heat: 'Heat Resist',
    resist_energy: 'Energy Resist',
    resist_matter: 'Matter Resist',
    resist_spirit: 'Spirit Resist',
  };

  return labels[stat] || stat;
}

/**
 * Get icon for a stat type
 */
export function getStatIcon(stat: StatType): string {
  const icons: Partial<Record<StatType, string>> = {
    strength: '💪',
    dexterity: '🎯',
    constitution: '🛡️',
    quickness: '⚡',
    intelligence: '🧠',
    hits: '❤️',
    power: '🔮',
  };

  return icons[stat] || '📊';
}

/**
 * Group stats by category for display
 */
export function groupStatsByCategory(stats: AggregatedStats): Record<string, AggregatedStats> {
  const categories: Record<string, StatType[]> = {
    'Primary Stats': ['strength', 'constitution', 'dexterity', 'quickness'],
    'Secondary Stats': ['intelligence', 'piety', 'charisma', 'empathy'],
    'Resources': ['hits', 'power'],
    'Combat': ['armor_factor', 'melee_damage', 'spell_damage', 'melee_speed', 'cast_speed'],
    'Utility': ['heal_bonus', 'range_bonus'],
    'Resistances': ['resist_body', 'resist_cold', 'resist_heat', 'resist_energy', 'resist_matter', 'resist_spirit'],
  };

  const grouped: Record<string, AggregatedStats> = {};

  for (const [category, statTypes] of Object.entries(categories)) {
    const categoryStats: AggregatedStats = {};

    for (const statType of statTypes) {
      if (stats[statType] !== undefined) {
        categoryStats[statType] = stats[statType];
      }
    }

    if (Object.keys(categoryStats).length > 0) {
      grouped[category] = categoryStats;
    }
  }

  return grouped;
}
```

### Phase 4: UI Components

#### 4.1 StatsDisplay Component

**File:** `src/components/StatsDisplay.tsx` (NEW)

```typescript
import type { AggregatedStats, StatType } from '../types';
import { getStatLabel, getStatIcon, groupStatsByCategory } from '../core/stats';

interface StatsDisplayProps {
  stats: AggregatedStats;
  compact?: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  compact = false,
}) => {
  const hasStats = Object.keys(stats).length > 0;

  if (!hasStats) {
    return (
      <div className="stats-display stats-display--empty">
        <p className="stats-display-empty-message">
          No stat bonuses yet. Purchase abilities to see your stats.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="stats-display stats-display--compact">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="stat-chip">
            <span className="stat-chip-icon">{getStatIcon(stat as StatType)}</span>
            <span className="stat-chip-label">{getStatLabel(stat as StatType)}</span>
            <span className="stat-chip-value">+{value}</span>
          </div>
        ))}
      </div>
    );
  }

  const grouped = groupStatsByCategory(stats);

  return (
    <div className="stats-display">
      {Object.entries(grouped).map(([category, categoryStats]) => (
        <div key={category} className="stats-category">
          <h4 className="stats-category-title">{category}</h4>
          <div className="stats-category-grid">
            {Object.entries(categoryStats).map(([stat, value]) => (
              <div key={stat} className="stat-item">
                <span className="stat-item-icon">
                  {getStatIcon(stat as StatType)}
                </span>
                <span className="stat-item-label">
                  {getStatLabel(stat as StatType)}
                </span>
                <span className="stat-item-value">+{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### 4.2 Integrate into BuildSummary

**File:** `src/components/BuildSummary.tsx` (MODIFY)

Add after the "build-stats" section:

```typescript
import { aggregateStats } from '../core/stats';
import { StatsDisplay } from './StatsDisplay';

// Inside component, after existing stats calculation:
const aggregatedStats = aggregateStats(build.purchasedAbilities, allAbilities);

// In render, add new section:
{/* Stat Bonuses */}
{hasPurchases && (
  <div className="build-stats-bonuses">
    <div className="build-stats-bonuses-header">
      Stat Bonuses
    </div>
    <StatsDisplay stats={aggregatedStats} />
  </div>
)}
```

### Phase 5: Styling

**File:** `src/App.css` (ADD)

```css
/* Stats Display */
.stats-display {
  margin-top: 1rem;
}

.stats-display--empty {
  text-align: center;
  padding: 1rem;
  opacity: 0.7;
}

.stats-display-empty-message {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Compact mode (chips) */
.stats-display--compact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-surface-elevated);
  border-radius: 4px;
  font-size: 0.8rem;
}

.stat-chip-icon {
  font-size: 0.9em;
}

.stat-chip-value {
  font-weight: 600;
  color: var(--color-success);
}

/* Full display (categorized) */
.stats-category {
  margin-bottom: 1rem;
}

.stats-category:last-child {
  margin-bottom: 0;
}

.stats-category-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
}

.stats-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border-radius: 4px;
}

.stat-item-icon {
  font-size: 1rem;
}

.stat-item-label {
  flex: 1;
  font-size: 0.85rem;
}

.stat-item-value {
  font-weight: 600;
  color: var(--color-success);
}

/* Build Summary integration */
.build-stats-bonuses {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.build-stats-bonuses-header {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  abilities.json                         │ │
│  │  {                                                      │ │
│  │    "id": "augment_dex",                                 │ │
│  │    "ranks": [                                           │ │
│  │      { "rank": 1, "stats": [{ "type": "dex", "value": 4 }] } │
│  │    ]                                                    │ │
│  │  }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Core Layer                            │
│                                                              │
│  ┌──────────────────┐       ┌──────────────────┐           │
│  │     build.ts     │       │     stats.ts     │           │
│  │                  │       │                  │           │
│  │  purchasedAbil.  │──────►│ aggregateStats() │           │
│  │  { id: rank }    │       │                  │           │
│  └──────────────────┘       │ Returns:         │           │
│                             │ { dex: 10,       │           │
│                             │   str: 5, ... }  │           │
│                             └────────┬─────────┘           │
└──────────────────────────────────────┼──────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       Component Layer                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   BuildSummary.tsx                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │               StatsDisplay.tsx                  │  │   │
│  │  │                                                 │  │   │
│  │  │  ┌─────────────┐  ┌─────────────┐              │  │   │
│  │  │  │ Primary     │  │ Secondary   │              │  │   │
│  │  │  │ STR +5      │  │ INT +10     │              │  │   │
│  │  │  │ DEX +10     │  │ PIE +5      │              │  │   │
│  │  │  └─────────────┘  └─────────────┘              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree

### Stat Aggregation Logic

```
                    ┌─────────────────────┐
                    │ For each purchased  │
                    │ ability             │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Look up ability in  │
                    │ allAbilities        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │ Not found                       │ Found
              ▼                                 ▼
    ┌─────────────────┐               ┌─────────────────┐
    │ Skip ability    │               │ Find rank data  │
    │ (data missing)  │               │ for purchased   │
    └─────────────────┘               │ rank level      │
                                      └────────┬────────┘
                                               │
                                    ┌──────────┼──────────┐
                                    │ No stats           │ Has stats
                                    ▼                    ▼
                          ┌─────────────────┐  ┌─────────────────┐
                          │ Skip rank       │  │ For each stat   │
                          │ (no bonuses)    │  │ bonus in rank   │
                          └─────────────────┘  └────────┬────────┘
                                                        │
                                              ┌─────────▼─────────┐
                                              │ Add to running    │
                                              │ total for that    │
                                              │ stat type         │
                                              └───────────────────┘
```

---

## Workflow Diagram

### User Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Purchase ability    →    build.purchaseAbility()
                         │
                         ▼
                    New Build with updated
                    purchasedAbilities
                         │
                         ▼
                    React re-renders BuildSummary
                         │
                         ▼
                    aggregateStats(purchased, all)
                         │
                    ┌────┴────────────────────────┐
                    │ Iterate purchased abilities │
                    │ Sum up all stat bonuses     │
                    └────┬────────────────────────┘
                         │
                         ▼
                    StatsDisplay receives new stats
                         │
                         ▼
                    groupStatsByCategory()
                         │
                         ▼
                    Render categorized stat grid
                         │
                         ▼
                    User sees: "Dexterity +10"
```

---

## Testing Strategy

### Unit Tests

**File:** `src/core/stats.test.ts` (NEW)

```typescript
import { aggregateStats, getStatLabel, groupStatsByCategory } from './stats';
import type { IAbility } from '../types';

describe('aggregateStats', () => {
  const mockAbilities: Record<string, IAbility> = {
    augment_dex: {
      id: 'augment_dex',
      name: 'Augment Dexterity',
      tree: 'enhancements',
      ranks: [
        { rank: 1, cost: 1, description: '', stats: [{ type: 'dexterity', value: 4 }] },
        { rank: 2, cost: 2, description: '', stats: [{ type: 'dexterity', value: 7 }] },
        { rank: 3, cost: 3, description: '', stats: [{ type: 'dexterity', value: 10 }] },
      ],
      prerequisites: [],
    },
    augment_str: {
      id: 'augment_str',
      name: 'Augment Strength',
      tree: 'enhancements',
      ranks: [
        { rank: 1, cost: 1, description: '', stats: [{ type: 'strength', value: 4 }] },
      ],
      prerequisites: [],
    },
    no_stats: {
      id: 'no_stats',
      name: 'No Stats Ability',
      tree: 'other',
      ranks: [
        { rank: 1, cost: 1, description: '' },  // No stats property
      ],
      prerequisites: [],
    },
  };

  test('returns empty object for no purchases', () => {
    const result = aggregateStats({}, mockAbilities);
    expect(result).toEqual({});
  });

  test('aggregates single ability stat', () => {
    const result = aggregateStats({ augment_dex: 2 }, mockAbilities);
    expect(result).toEqual({ dexterity: 7 });
  });

  test('aggregates multiple abilities', () => {
    const result = aggregateStats(
      { augment_dex: 3, augment_str: 1 },
      mockAbilities
    );
    expect(result).toEqual({ dexterity: 10, strength: 4 });
  });

  test('handles ability with no stats', () => {
    const result = aggregateStats({ no_stats: 1 }, mockAbilities);
    expect(result).toEqual({});
  });

  test('ignores unknown abilities', () => {
    const result = aggregateStats({ unknown: 5 }, mockAbilities);
    expect(result).toEqual({});
  });
});

describe('getStatLabel', () => {
  test('returns formatted label for known stats', () => {
    expect(getStatLabel('dexterity')).toBe('Dexterity');
    expect(getStatLabel('hits')).toBe('Hit Points');
    expect(getStatLabel('resist_cold')).toBe('Cold Resist');
  });
});

describe('groupStatsByCategory', () => {
  test('groups stats correctly', () => {
    const stats = { dexterity: 10, intelligence: 5, hits: 100 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Primary Stats']).toEqual({ dexterity: 10 });
    expect(grouped['Secondary Stats']).toEqual({ intelligence: 5 });
    expect(grouped['Resources']).toEqual({ hits: 100 });
  });

  test('omits empty categories', () => {
    const stats = { dexterity: 10 };
    const grouped = groupStatsByCategory(stats);

    expect(grouped['Primary Stats']).toBeDefined();
    expect(grouped['Resources']).toBeUndefined();
  });
});
```

### Integration Tests

```typescript
describe('stats integration', () => {
  test('BuildSummary shows aggregated stats', () => {
    render(
      <BuildSummary
        build={buildWithAbilities}
        allAbilities={allAbilities}
        pointBudget={100}
      />
    );

    expect(screen.getByText('Stat Bonuses')).toBeInTheDocument();
    expect(screen.getByText('Dexterity')).toBeInTheDocument();
    expect(screen.getByText('+10')).toBeInTheDocument();
  });
});
```

---

## Deliverable Checklist

### Data Model
- [x] Define `StatType` type with all stat names
- [x] Define `IStatBonus` interface
- [x] Define `AggregatedStats` type
- [x] Add `stats` property to `IAbilityRank`

### Ability Data
- [x] Update all abilities in `abilities.json` with stat values
- [x] Verify stat values match game data

### Core Logic
- [x] Create `src/core/stats.ts`
- [x] Implement `aggregateStats()` function
- [x] Implement `getStatLabel()` helper
- [x] Implement `getStatIcon()` helper (skipped - no emojis)
- [x] Implement `groupStatsByCategory()` helper

### Components
- [x] Create `StatsDisplay.tsx` component
- [x] Integrate into `BuildSummary.tsx`
- [x] Add CSS styling for stats display

### Testing
- [x] Unit tests for `aggregateStats()`
- [x] Unit tests for helper functions
- [x] Integration tests for BuildSummary

### Documentation
- [x] Update type documentation
- [x] Add JSDoc comments to new functions

---

## Known Issues & Future Improvements

### Potential Challenges

| Challenge | Mitigation |
|-----------|------------|
| Stat data entry | Create script to validate ability JSON |
| Performance | Memoize aggregation with useMemo |
| Complex stat formulas | Start with simple additive, extend later |

### Future Enhancements

1. **Percentage-based Stats**
   ```typescript
   if (bonus.isPercentage) {
     // Handle multiplicative bonuses
     percentageStats[bonus.type] = (percentageStats[bonus.type] || 1) * (1 + bonus.value / 100);
   }
   ```

2. **Stat Caps**
   ```typescript
   const STAT_CAPS: Record<StatType, number> = {
     strength: 75,
     dexterity: 75,
     // ...
   };

   function applyStatCaps(stats: AggregatedStats): AggregatedStats {
     return Object.fromEntries(
       Object.entries(stats).map(([stat, value]) => [
         stat,
         Math.min(value, STAT_CAPS[stat as StatType] || Infinity),
       ])
     );
   }
   ```

3. **Compare to Previous** (with FX-03 History)
   ```typescript
   const previousStats = aggregateStats(history.past.slice(-1)[0]?.purchasedAbilities || {}, allAbilities);
   const currentStats = aggregateStats(build.purchasedAbilities, allAbilities);

   // Show +/- change indicators
   ```

4. **Build Comparison** (AF-01)
   - Side-by-side stat comparison between builds

---

## UI Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Build Summary                                          📋   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🏰  Cleric                                           │  │
│  │     Albion                                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Point Budget                                               │
│  ████████████░░░░░░░░ 35 / 100                             │
│  65 points remaining                                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │     35      │  │      5      │                          │
│  │ Points Spent│  │  Abilities  │                          │
│  └─────────────┘  └─────────────┘                          │
│                                                             │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  📊 Stat Bonuses                                           │
│                                                             │
│  PRIMARY STATS                                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ 🎯 Dexterity    │  │ 💪 Strength     │                  │
│  │        +18     │  │        +10     │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  RESOURCES                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ ❤️ Hit Points   │  │ 🔮 Power        │                  │
│  │       +150     │  │        +50     │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  Purchased Abilities                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Augment Dexterity           12 pts      MAX         │  │
│  │ Augment Strength            6 pts       3/5         │  │
│  │ Long Wind                   10 pts      2/3         │  │
│  │ Toughness                   7 pts       2/5         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Order

1. **Types** - Add StatType, IStatBonus, AggregatedStats (15 min)
2. **IAbilityRank** - Add optional stats field (5 min)
3. **abilities.json** - Add stat data to existing abilities (30 min)
4. **stats.ts** - Create aggregation functions (30 min)
5. **StatsDisplay.tsx** - Create component (45 min)
6. **BuildSummary.tsx** - Integrate stats (15 min)
7. **App.css** - Add styling (20 min)
8. **Tests** - Unit and integration tests (45 min)

**Total estimated effort:** ~3.5 hours

---

*Document created: January 2025*
