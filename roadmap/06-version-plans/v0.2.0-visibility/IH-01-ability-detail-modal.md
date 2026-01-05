# IH-01: Ability Detail Modal

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | IH-01 |
| **Name** | Ability Detail Modal |
| **Status** | Planned |
| **Priority** | High |
| **Category** | Information Hierarchy |
| **Complexity** | Medium |

## Description

Clicking on an ability in the tree opens a modal displaying complete ability information including all ranks, descriptions, stat bonuses, and prerequisites.

## User Story

> As a player building my character,
> I want to click on an ability to see its full details,
> So that I can make informed decisions about which abilities to purchase.

## Acceptance Criteria

- [ ] Clicking an ability opens a modal with full details
- [ ] Modal displays ability name, tree, and current rank
- [ ] Modal shows all available ranks with costs
- [ ] Modal shows descriptions for each rank
- [ ] Modal shows prerequisites if any
- [ ] Modal shows stat bonuses per rank (when available)
- [ ] ESC key closes the modal
- [ ] Clicking outside modal closes it
- [ ] Modal is accessible (focus trap, screen reader support)

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/AbilityModal.tsx` | Modal component |
| `src/components/AbilityModal.css` | Modal styling |
| `src/components/AbilityModal.test.tsx` | Unit tests |
| `src/hooks/useModal.ts` | Generic modal state hook |
| `src/hooks/useModal.test.ts` | Hook tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/AbilityTree.tsx` | Add click handler to open modal |
| `src/App.tsx` | Add modal state and rendering |

### Interfaces

```typescript
// src/hooks/useModal.ts
interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data: T) => void;
  close: () => void;
}

function useModal<T>(): UseModalReturn<T>;
```

```typescript
// src/components/AbilityModal.tsx
interface AbilityModalProps {
  ability: IAbility;
  currentRank: number;
  onClose: () => void;
}
```

### Component Structure

```tsx
// AbilityModal.tsx
export function AbilityModal({ ability, currentRank, onClose }: AbilityModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{ability.name}</h2>
          <span className="ability-tree">{ability.tree}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">
          <section className="rank-progress">
            <span>Rank {currentRank} / {ability.ranks.length}</span>
            <ProgressBar current={currentRank} max={ability.ranks.length} />
          </section>

          <section className="ranks-list">
            {ability.ranks.map((rank) => (
              <RankDetail
                key={rank.rank}
                rank={rank}
                isOwned={rank.rank <= currentRank}
              />
            ))}
          </section>

          {ability.prerequisites.length > 0 && (
            <section className="prerequisites">
              <h3>Prerequisites</h3>
              <ul>
                {ability.prerequisites.map((prereq) => (
                  <li key={prereq.ability}>{prereq.ability} Rank {prereq.rank}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           App.tsx                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   const { isOpen, data, open, close } = useModal<IAbility>();      │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                    AbilityTree                               │  │
│   │                                                              │  │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│   │   │ AbilityCard │  │ AbilityCard │  │ AbilityCard │        │  │
│   │   │ onClick=    │  │ onClick=    │  │ onClick=    │        │  │
│   │   │ {open(ab)}  │  │ {open(ab)}  │  │ {open(ab)}  │        │  │
│   │   └─────────────┘  └─────────────┘  └─────────────┘        │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   {isOpen && (                                                      │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │                   AbilityModal                          │    │
│     │                                                         │    │
│     │   ┌─────────────────────────────────────────────────┐  │    │
│     │   │  Header: Name, Tree, Close Button               │  │    │
│     │   ├─────────────────────────────────────────────────┤  │    │
│     │   │  Rank Progress: 2/3 [████████░░░░]              │  │    │
│     │   ├─────────────────────────────────────────────────┤  │    │
│     │   │  Rank 1 ✓  Cost: 1  "Description..."           │  │    │
│     │   │  Rank 2 ✓  Cost: 2  "Description..."           │  │    │
│     │   │  Rank 3    Cost: 3  "Description..."           │  │    │
│     │   ├─────────────────────────────────────────────────┤  │    │
│     │   │  Prerequisites: Augment Dex 1                   │  │    │
│     │   └─────────────────────────────────────────────────┘  │    │
│     └─────────────────────────────────────────────────────────┘    │
│   )}                                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Mockup

```
┌──────────────────────────────────────────────────────────────┐
│ ╔══════════════════════════════════════════════════════════╗ │
│ ║  Serenity                                           [×]  ║ │
│ ║  ─────────────────────────────────────────────────────── ║ │
│ ║  Tree: Healing                                           ║ │
│ ║                                                          ║ │
│ ║  Progress: Rank 1 / 3                                    ║ │
│ ║  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║ │
│ ║                                                          ║ │
│ ║  ┌──────────────────────────────────────────────────┐   ║ │
│ ║  │ ✓ Rank 1 • Cost: 3 points                        │   ║ │
│ ║  │   Reduces the reuse time of resurrection spells  │   ║ │
│ ║  │   by 5 minutes.                                  │   ║ │
│ ║  └──────────────────────────────────────────────────┘   ║ │
│ ║                                                          ║ │
│ ║  ┌──────────────────────────────────────────────────┐   ║ │
│ ║  │   Rank 2 • Cost: 6 points                        │   ║ │
│ ║  │   Reduces the reuse time of resurrection spells  │   ║ │
│ ║  │   by 10 minutes.                                 │   ║ │
│ ║  └──────────────────────────────────────────────────┘   ║ │
│ ║                                                          ║ │
│ ║  ┌──────────────────────────────────────────────────┐   ║ │
│ ║  │   Rank 3 • Cost: 10 points                       │   ║ │
│ ║  │   Reduces the reuse time of resurrection spells  │   ║ │
│ ║  │   by 15 minutes.                                 │   ║ │
│ ║  └──────────────────────────────────────────────────┘   ║ │
│ ║                                                          ║ │
│ ║  Prerequisites                                           ║ │
│ ║  • Augment Dexterity Rank 1                             ║ │
│ ║                                                          ║ │
│ ╚══════════════════════════════════════════════════════════╝ │
│                                                              │
│  (Click outside or press ESC to close)                       │
└──────────────────────────────────────────────────────────────┘
```

## Decision Tree

```
User clicks ability card
         │
         ▼
┌─────────────────┐
│ Is modal hook   │
│ available?      │
└────────┬────────┘
         │ yes
         ▼
┌─────────────────┐
│ Call open()     │
│ with ability    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Modal renders   │
│ with ability    │
│ data            │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ User interacts with modal           │
├─────────────────────────────────────┤
│ • Click close button → close()      │
│ • Press ESC → close()               │
│ • Click overlay → close()           │
│ • Click content → (no action)       │
└─────────────────────────────────────┘
```

## Integration Points

### With AbilityTree
```tsx
// In AbilityTree.tsx
function AbilityCard({ ability, onClick }) {
  return (
    <div
      className="ability-card"
      onClick={() => onClick(ability)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(ability)}
    >
      {/* existing card content */}
    </div>
  );
}
```

### With App.tsx
```tsx
// In App.tsx
function App() {
  const { isOpen, data: selectedAbility, open, close } = useModal<IAbility>();

  return (
    <>
      {/* existing content */}
      <AbilityTree onAbilityClick={open} />

      {isOpen && selectedAbility && (
        <AbilityModal
          ability={selectedAbility}
          currentRank={build.purchasedAbilities[selectedAbility.id] || 0}
          onClose={close}
        />
      )}
    </>
  );
}
```

## Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    Modal Interaction Flow                          │
└────────────────────────────────────────────────────────────────────┘

  User                    AbilityTree           Modal           useModal
   │                          │                   │                │
   │ click ability            │                   │                │
   ├─────────────────────────►│                   │                │
   │                          │ open(ability)     │                │
   │                          ├───────────────────┼───────────────►│
   │                          │                   │                │
   │                          │                   │◄───────────────┤
   │                          │                   │  isOpen=true   │
   │                          │                   │  data=ability  │
   │                          │                   │                │
   │◄─────────────────────────┼───────────────────┤ Modal renders  │
   │                          │                   │                │
   │ press ESC / click X      │                   │                │
   ├──────────────────────────┼──────────────────►│                │
   │                          │                   │ close()        │
   │                          │                   ├───────────────►│
   │                          │                   │                │
   │                          │                   │◄───────────────┤
   │                          │                   │  isOpen=false  │
   │◄─────────────────────────┼───────────────────┤ Modal unmounts │
   │                          │                   │                │
```

## CSS Styling

```css
/* AbilityModal.css */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  flex: 1;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 16px;
}

.rank-item {
  background: var(--bg-secondary);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
}

.rank-item.owned {
  border-left: 3px solid var(--color-success);
}

.rank-item.next {
  border-left: 3px solid var(--color-primary);
}
```

## Accessibility

### Focus Management
```tsx
function AbilityModal({ onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;

    return () => {
      // Restore focus when modal closes
      previouslyFocused?.focus();
    };
  }, []);

  // Trap focus within modal
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      // Focus trap logic
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      onKeyDown={handleKeyDown}
    >
      {/* content */}
    </div>
  );
}
```

### Screen Reader Support
- `role="dialog"` and `aria-modal="true"` for modal semantics
- `aria-labelledby` pointing to modal title
- Descriptive button labels

## Testing Strategy

### Unit Tests (AbilityModal.test.tsx)

```typescript
describe('AbilityModal', () => {
  describe('rendering', () => {
    it('renders ability name in header');
    it('renders ability tree');
    it('renders all ranks');
    it('marks owned ranks with checkmark');
    it('renders prerequisites when present');
    it('does not render prerequisites section when empty');
  });

  describe('interactions', () => {
    it('calls onClose when close button clicked');
    it('calls onClose when overlay clicked');
    it('does not close when content clicked');
    it('calls onClose when ESC pressed');
  });

  describe('accessibility', () => {
    it('has dialog role');
    it('has aria-modal attribute');
    it('focuses close button on mount');
    it('restores focus on unmount');
    it('traps focus within modal');
  });
});
```

### Unit Tests (useModal.test.ts)

```typescript
describe('useModal', () => {
  it('starts with isOpen false and data null');
  it('open() sets isOpen true and stores data');
  it('close() sets isOpen false and clears data');
  it('close() does nothing if already closed');
});
```

### Integration Tests

```typescript
describe('AbilityTree + Modal integration', () => {
  it('clicking ability card opens modal with correct data');
  it('modal shows current rank from build state');
  it('closing modal returns focus to ability card');
});
```

## Deliverable Checklist

### Implementation
- [ ] `useModal` hook created
- [ ] `AbilityModal` component created
- [ ] Modal CSS styling complete
- [ ] AbilityTree click handler integrated
- [ ] App.tsx modal state integrated
- [ ] Focus management implemented
- [ ] Keyboard navigation (ESC) working

### Testing
- [ ] `useModal.test.ts` complete
- [ ] `AbilityModal.test.tsx` complete
- [ ] Integration tests complete
- [ ] Accessibility tests pass

### Documentation
- [ ] Component JSDoc comments
- [ ] Usage examples in code

## Known Issues & Future Improvements

### Current Limitations
- No animation on open/close
- No stats display (depends on stat system from FX-04)

### Future Enhancements
- Slide/fade animations
- Purchase ability directly from modal
- Show related abilities
- Deep link to specific ability modal

## Code Reference

### useModal Hook Implementation

```typescript
// src/hooks/useModal.ts
import { useState, useCallback } from 'react';

export interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data: T) => void;
  close: () => void;
}

export function useModal<T>(): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((newData: T) => {
    setData(newData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, open, close };
}
```
