# FX-07: Cost Calculator

**Feature ID:** FX-07
**Status:** Complete
**Priority:** Medium
**Category:** Functional UX

---

## Overview

Cost Calculator tracks realm point spending against a budget, showing users how many points they've spent, how many remain, and warning when they exceed their budget.

### User Story

> As a player, I want to see how many points I've spent and how many I have left so that I can plan my build within my available realm points.

---

## Implementation Details

### Primary Files
- `src/components/BuildSummary.tsx` - Display component
- `src/core/build.ts` - `spentPoints` tracking

### Key Properties

| Property | Source | Description |
|----------|--------|-------------|
| `spentPoints` | `Build` class | Total points spent |
| `pointBudget` | App.tsx constant | Max available points (100) |
| `remainingPoints` | Calculated | `budget - spent` |
| `isOverBudget` | Calculated | `remaining < 0` |

### Budget Constants

```typescript
// src/App.tsx
const DEFAULT_POINT_BUDGET = 100;
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Build.ts                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                purchaseAbility()                        │ │
│  │                                                         │ │
│  │  const rankData = ability.ranks.find(r => r.rank ===   │ │
│  │                                         nextRank);     │ │
│  │  const newSpentPoints = this.spentPoints + rankData.cost│ │
│  │                                                         │ │
│  │  return this.clone({ spentPoints: newSpentPoints })     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                removeAbilityRank()                      │ │
│  │                                                         │ │
│  │  const newSpentPoints = this.spentPoints - rankData.cost│ │
│  │                                                         │ │
│  │  return this.clone({ spentPoints: newSpentPoints })     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      BuildSummary.tsx                        │
│                                                              │
│  Props: build, pointBudget, remainingPoints                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Point Budget                          │ │
│  │                                                         │ │
│  │  remaining = remainingPoints ?? (pointBudget - spent)   │ │
│  │  isOverBudget = remaining < 0                          │ │
│  │  percentUsed = min((spent / budget) * 100, 100)        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Progress Bar Render                     │ │
│  │                                                         │ │
│  │  ┌────────────────────────────────────────────────┐    │ │
│  │  │ ████████████████████░░░░░░░░░░░ 35 / 100       │    │ │
│  │  │ 65 points remaining                             │    │ │
│  │  └────────────────────────────────────────────────┘    │ │
│  │                                                         │ │
│  │  OR (when over budget):                                 │ │
│  │                                                         │ │
│  │  ┌────────────────────────────────────────────────┐    │ │
│  │  │ ████████████████████████████████ 115 / 100     │    │ │
│  │  │ ⚠️ 15 points over budget                        │    │ │
│  │  └────────────────────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree

### Budget Status Display

```
                    ┌─────────────────┐
                    │ Calculate       │
                    │ remaining points│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ remaining < 0 ? │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ No (within)                 │ Yes (over)
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Display:        │           │ Display:        │
    │ "{X} points     │           │ "⚠️ {X} points  │
    │ remaining"      │           │ over budget"    │
    │                 │           │                 │
    │ Normal style    │           │ Warning style   │
    │ (default color) │           │ (red/orange)    │
    └─────────────────┘           └─────────────────┘
```

### Per-Ability Cost Calculation

```
                    ┌─────────────────┐
                    │ For each        │
                    │ purchased       │
                    │ ability         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Get ability     │
                    │ from allAbilities│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ totalCost = 0   │
                    │                 │
                    │ For rank = 1    │
                    │ to purchasedRank│
                    │                 │
                    │ totalCost +=    │
                    │   rankData.cost │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Display:        │
                    │ "Name    X pts" │
                    └─────────────────┘
```

---

## Integration Points

### Inbound Dependencies
- `Build` class with `spentPoints` property
- `IAbility` data for per-rank costs

### Outbound Integration
- Displayed in `BuildSummary.tsx`
- Budget constant from `App.tsx`

### Related Features
| Feature | Relationship |
|---------|--------------|
| FX-03 Undo/Redo | Spent points recalculated on undo |
| FX-02 Sharing | Shared builds include spent points |
| FX-04 Bonus Aggregation | Stats shown alongside costs |

---

## Workflow Diagram

### Purchase Flow with Cost Tracking

```
User Action              System Response
───────────────────────────────────────────────────────
Click "+" on ability →   build.purchaseAbility(ability)
                         │
                         ▼
                    Get next rank
                    (currentRank + 1)
                         │
                         ▼
                    Find rank cost
                    from ability.ranks
                         │
                    ┌────┴────────────────────────┐
                    │ rank 1 → cost 1             │
                    │ rank 2 → cost 2             │
                    │ rank 3 → cost 3             │
                    │ etc.                        │
                    └────┬────────────────────────┘
                         │
                         ▼
                    spentPoints += rankCost
                         │
                         ▼
                    New Build with updated
                    spentPoints returned
                         │
                         ▼
                    BuildSummary re-renders
                         │
                         ▼
                    Progress bar updates
                    Remaining points updates
```

### Remove Flow with Refund

```
User Action              System Response
───────────────────────────────────────────────────────
Right-click ability →    build.removeAbilityRank(ability)
                         │
                         ▼
                    Get current rank cost
                    from ability.ranks
                         │
                         ▼
                    spentPoints -= rankCost
                    (Refund the cost)
                         │
                         ▼
                    New Build with updated
                    spentPoints returned
                         │
                         ▼
                    BuildSummary re-renders
                         │
                         ▼
                    Progress bar shrinks
                    Remaining points increases
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('cost calculation', () => {
  const mockAbility: IAbility = {
    id: 'test',
    name: 'Test',
    tree: 'test',
    ranks: [
      { rank: 1, cost: 1, description: '' },
      { rank: 2, cost: 2, description: '' },
      { rank: 3, cost: 3, description: '' },
    ],
    prerequisites: [],
  };

  test('purchaseAbility adds rank cost', () => {
    let build = new Build(mockClass, 0, {});

    build = build.purchaseAbility(mockAbility);
    expect(build.spentPoints).toBe(1);

    build = build.purchaseAbility(mockAbility);
    expect(build.spentPoints).toBe(3); // 1 + 2

    build = build.purchaseAbility(mockAbility);
    expect(build.spentPoints).toBe(6); // 1 + 2 + 3
  });

  test('removeAbilityRank refunds rank cost', () => {
    let build = new Build(mockClass, 6, { test: 3 });

    build = build.removeAbilityRank(mockAbility);
    expect(build.spentPoints).toBe(3); // 6 - 3

    build = build.removeAbilityRank(mockAbility);
    expect(build.spentPoints).toBe(1); // 3 - 2

    build = build.removeAbilityRank(mockAbility);
    expect(build.spentPoints).toBe(0); // 1 - 1
  });
});

describe('BuildSummary cost display', () => {
  test('shows remaining points', () => {
    render(
      <BuildSummary
        build={new Build(mockClass, 35, {})}
        allAbilities={{}}
        pointBudget={100}
      />
    );

    expect(screen.getByText('35 / 100')).toBeInTheDocument();
    expect(screen.getByText('65 points remaining')).toBeInTheDocument();
  });

  test('shows over budget warning', () => {
    render(
      <BuildSummary
        build={new Build(mockClass, 115, {})}
        allAbilities={{}}
        pointBudget={100}
      />
    );

    expect(screen.getByText(/15 points over budget/)).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  test('progress bar caps at 100%', () => {
    const { container } = render(
      <BuildSummary
        build={new Build(mockClass, 150, {})}
        allAbilities={{}}
        pointBudget={100}
      />
    );

    const progressFill = container.querySelector('.budget-progress-fill');
    expect(progressFill).toHaveStyle({ width: '100%' });
  });

  test('shows per-ability costs', () => {
    const allAbilities = {
      ability1: {
        id: 'ability1',
        name: 'Test Ability',
        ranks: [
          { rank: 1, cost: 5, description: '' },
          { rank: 2, cost: 7, description: '' },
        ],
      },
    };

    render(
      <BuildSummary
        build={new Build(mockClass, 12, { ability1: 2 })}
        allAbilities={allAbilities}
        pointBudget={100}
      />
    );

    expect(screen.getByText('12 pts')).toBeInTheDocument(); // 5 + 7
  });
});
```

### Integration Tests

```typescript
describe('cost calculator integration', () => {
  test('budget updates in real-time on purchase', async () => {
    render(<App />);

    await userEvent.click(screen.getByText('Cleric'));

    // Initially 0 spent
    expect(screen.getByText('0 / 100')).toBeInTheDocument();

    // Purchase ability
    await userEvent.click(screen.getByText('+'));

    // Should update
    expect(screen.queryByText('0 / 100')).not.toBeInTheDocument();
  });
});
```

---

## Deliverable Checklist

### Implementation
- [x] `spentPoints` tracking in Build class
- [x] Point budget constant (100)
- [x] Remaining points calculation
- [x] Over-budget detection
- [x] Progress bar visualization
- [x] Per-ability cost display in summary
- [x] Warning styling for over-budget

### Testing
- [ ] Unit tests for cost calculation
- [ ] Unit tests for display logic
- [ ] Integration tests

### UI
- [x] Progress bar with percentage fill
- [x] Spent/budget numeric display
- [x] Remaining points text
- [x] Over-budget warning with icon
- [x] Per-ability cost in purchased list

---

## Known Issues & Future Improvements

### Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No hard budget enforcement | Users can exceed budget | Medium |
| No approaching-limit warning | No heads-up before hitting cap | Low |
| Fixed budget of 100 | Can't customize total points | Low |
| No point cost preview | Can't see cost before purchase | Low |

### Future Enhancements

1. **Hard Budget Enforcement** (v0.3.0)
   ```typescript
   // In validator.ts
   export function canAffordAbility(
     ability: IAbility,
     rank: number,
     build: Build,
     budget: number
   ): boolean {
     const rankData = ability.ranks.find(r => r.rank === rank);
     if (!rankData) return false;

     const newTotal = build.spentPoints + rankData.cost;
     return newTotal <= budget;
   }
   ```

2. **Approaching Limit Warning** (v0.4.0)
   ```typescript
   const isNearLimit = remaining <= 10 && remaining > 0;

   {isNearLimit && (
     <div className="budget-warning-approaching">
       ⚠️ Only {remaining} points left!
     </div>
   )}
   ```

3. **Customizable Budget** (v0.5.0)
   ```typescript
   const [pointBudget, setPointBudget] = useState(100);

   <input
     type="number"
     value={pointBudget}
     onChange={(e) => setPointBudget(parseInt(e.target.value))}
     min={1}
     max={1000}
   />
   ```

4. **Cost Preview on Hover** (v0.4.0)
   ```typescript
   // In AbilityTree.tsx
   <button
     onMouseEnter={() => setHoverCost(nextRankCost)}
     onMouseLeave={() => setHoverCost(null)}
   >
     +
   </button>

   // Show preview in budget display
   {hoverCost && (
     <span className="budget-preview">
       → {spentPoints + hoverCost} / {budget}
     </span>
   )}
   ```

5. **Multiple Point Pools** (v1.0)
   - Realm Points (RP)
   - Champion Points (CP)
   - Master Levels (ML)
   - Each with own budget

---

## UI Mockup

### Normal State

```
┌─────────────────────────────────────────────────────────────┐
│  Point Budget                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ████████████████████████░░░░░░░░░░░░░░░░░░░░░ 35 / 100 │ │
│  └────────────────────────────────────────────────────────┘ │
│  65 points remaining                                        │
└─────────────────────────────────────────────────────────────┘
```

### Over Budget State

```
┌─────────────────────────────────────────────────────────────┐
│  Point Budget                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ████████████████████████████████████████████ 115 / 100 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ⚠️ 15 points over budget                                   │
└─────────────────────────────────────────────────────────────┘
```

### Per-Ability Costs

```
┌─────────────────────────────────────────────────────────────┐
│  Purchased Abilities                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Augment Dexterity                 12 pts      MAX    │  │
│  │ Augment Strength                  6 pts       3/5    │  │
│  │ Long Wind                         10 pts      2/3    │  │
│  │ Toughness                         7 pts       2/5    │  │
│  │                                   ─────              │  │
│  │ Total                             35 pts             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Reference

### BuildSummary Progress Bar

```typescript
// src/components/BuildSummary.tsx - Lines 69-91
{/* Point Budget Progress */}
{hasClass && (
  <div className="budget-progress">
    <div className="budget-progress-header">
      <span className="budget-progress-label">Point Budget</span>
      <span className={`budget-progress-value ${isOverBudget ? 'over-budget' : ''}`}>
        {build.spentPoints} / {pointBudget}
      </span>
    </div>
    <div className="budget-progress-bar">
      <div
        className={`budget-progress-fill ${isOverBudget ? 'over-budget' : ''}`}
        style={{ width: `${budgetPercentUsed}%` }}
      />
    </div>
    <div className={`budget-remaining ${isOverBudget ? 'over-budget' : ''}`}>
      {isOverBudget ? (
        <>⚠️ {Math.abs(remaining)} points over budget</>
      ) : (
        <>{remaining} points remaining</>
      )}
    </div>
  </div>
)}
```

### Per-Ability Cost Calculation

```typescript
// src/components/BuildSummary.tsx - Lines 120-127
// Calculate total cost for this ability
let totalCost = 0;
if (ability) {
  for (let r = 1; r <= rank; r++) {
    const rankData = ability.ranks.find(rd => rd.rank === r);
    if (rankData) totalCost += rankData.cost;
  }
}
```

---

*Document created: January 2025*
