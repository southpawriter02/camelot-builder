# MR-02: Swipe Gestures

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | MR-02 |
| **Name** | Swipe Gestures |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Mobile/Responsive |
| **Complexity** | High |

## Description

Enable touch-based swipe gestures on ability cards to quickly add or remove ranks. This provides a more natural interaction pattern for mobile users while maintaining the existing button controls as fallbacks.

## User Story

> As a touch screen user building my character,
> I want to swipe on ability cards to add or remove ranks,
> So that I can quickly manage my build without precise tapping.

## Acceptance Criteria

- [ ] Swipe right on ability card adds a rank (purchase)
- [ ] Swipe left on ability card removes a rank
- [ ] Minimum swipe threshold prevents accidental triggers (50px)
- [ ] Swipe does not conflict with vertical scrolling
- [ ] Visual feedback during swipe (card translation)
- [ ] Haptic feedback on swipe completion (if supported)
- [ ] Button controls remain functional as fallbacks
- [ ] Screen readers announce swipe actions
- [ ] Swipe respects ability purchase/removal constraints

## Current State Audit

### What Exists
| Component | Current Behavior | Status |
|-----------|------------------|--------|
| AbilityCard.tsx | Click-based + / - buttons | No touch |
| Ability cards | onClick handlers only | No swipe |
| Mobile layout | Single column at 768px | Basic responsive |

### What's Missing
| Gap | Required Change |
|-----|-----------------|
| No touch handlers | Add onTouchStart/Move/End |
| No swipe detection | Create useSwipeGesture hook |
| No visual feedback | Add transform during swipe |
| No gesture announcements | Integrate with useAnnounce |

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useSwipeGesture.ts` | Touch swipe detection hook |
| `src/hooks/useSwipeGesture.test.ts` | Unit tests for hook |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/AbilityCard.tsx` | Add swipe handlers, transform styles |
| `src/components/AbilityCard.css` | Add swipe animation styles |
| `src/App.tsx` | Pass announce function for swipe feedback |

### Interfaces

```typescript
// src/hooks/useSwipeGesture.ts
interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
}

interface UseSwipeGestureOptions {
  threshold?: number;          // Minimum swipe distance (default: 50px)
  velocityThreshold?: number;  // Minimum velocity for quick swipes
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

interface UseSwipeGestureReturn {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  state: SwipeState;
  style: React.CSSProperties;
}

function useSwipeGesture(options: UseSwipeGestureOptions): UseSwipeGestureReturn;
```

### Hook Implementation

```typescript
// src/hooks/useSwipeGesture.ts
import { useState, useCallback, useRef } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
}

interface UseSwipeGestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

const initialState: SwipeState = {
  startX: 0,
  startY: 0,
  currentX: 0,
  deltaX: 0,
  deltaY: 0,
  isSwiping: false,
  direction: null,
};

export function useSwipeGesture({
  threshold = 50,
  velocityThreshold = 0.5,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}: UseSwipeGestureOptions = {}) {
  const [state, setState] = useState<SwipeState>(initialState);
  const startTimeRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      const touch = e.touches[0];
      startTimeRef.current = Date.now();
      isScrollingRef.current = null;

      setState({
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        deltaX: 0,
        deltaY: 0,
        isSwiping: true,
        direction: null,
      });
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !state.isSwiping) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - state.startX;
      const deltaY = touch.clientY - state.startY;

      // Determine if user is scrolling vertically
      if (isScrollingRef.current === null) {
        isScrollingRef.current = Math.abs(deltaY) > Math.abs(deltaX);
      }

      // If scrolling vertically, don't interfere
      if (isScrollingRef.current) {
        setState(initialState);
        return;
      }

      // Prevent scroll while swiping horizontally
      e.preventDefault();

      const direction = deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : null;

      setState((prev) => ({
        ...prev,
        currentX: touch.clientX,
        deltaX,
        deltaY,
        direction,
      }));
    },
    [disabled, state.isSwiping, state.startX, state.startY]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled || !state.isSwiping) return;

    const elapsed = Date.now() - startTimeRef.current;
    const velocity = Math.abs(state.deltaX) / elapsed;

    // Check if swipe meets threshold (distance or velocity)
    const meetsThreshold =
      Math.abs(state.deltaX) >= threshold || velocity >= velocityThreshold;

    if (meetsThreshold && !isScrollingRef.current) {
      if (state.deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (state.deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setState(initialState);
  }, [
    disabled,
    state.isSwiping,
    state.deltaX,
    threshold,
    velocityThreshold,
    onSwipeLeft,
    onSwipeRight,
  ]);

  // Calculate transform style for visual feedback
  const style: React.CSSProperties = state.isSwiping
    ? {
        transform: `translateX(${state.deltaX * 0.5}px)`,
        transition: 'none',
      }
    : {
        transform: 'translateX(0)',
        transition: 'transform 0.2s ease-out',
      };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    state,
    style,
  };
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Swipe Gesture Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   AbilityCard Component                                             │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                                                              │  │
│   │   const { handlers, style } = useSwipeGesture({             │  │
│   │     onSwipeRight: () => onPurchase(ability),                │  │
│   │     onSwipeLeft: () => onRemove(ability),                   │  │
│   │     disabled: !canPurchase && !canRemove,                   │  │
│   │   });                                                        │  │
│   │                                                              │  │
│   │   ┌──────────────────────────────────────────────────────┐  │  │
│   │   │  <div {...handlers} style={style}>                   │  │  │
│   │   │    ┌────────────────────────────────────────────┐   │  │  │
│   │   │    │         Ability Card Content               │   │  │  │
│   │   │    │  ┌────┐  Holy Strike  ┌─────┐  ┌─────┐   │   │  │  │
│   │   │    │  │Icon│  Rank 1/3     │  +  │  │  -  │   │   │  │  │
│   │   │    │  └────┘               └─────┘  └─────┘   │   │  │  │
│   │   │    └────────────────────────────────────────────┘   │  │  │
│   │   │                                                      │  │  │
│   │   │    ← Swipe Left: Remove    Swipe Right: Add →       │  │  │
│   │   └──────────────────────────────────────────────────────┘  │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Touch Event Flow:                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│   │ Touch    │ -> │ Track    │ -> │ Check    │ -> │ Execute  │   │
│   │ Start    │    │ Movement │    │ Threshold│    │ Callback │   │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│                                                                     │
│   Scroll Prevention:                                                │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ If |deltaY| > |deltaX| → User is scrolling, abort swipe    │  │
│   │ If |deltaX| > |deltaY| → User is swiping, prevent scroll   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Mockup

### Swipe States

```
┌─────────────────────────────────────────────────────────────────────┐
│ Normal State                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 💚 Holy Strike                              Rank 1/3           │ │
│ │ Deal holy damage to target enemy                                │ │
│ │ [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]   [+] [-]   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Swiping Right (Add)                                                 │
├─────────────────────────────────────────────────────────────────────┤
│     ┌─────────────────────────────────────────────────────────────┐ │
│ +▶  │ 💚 Holy Strike                              Rank 1/3       │ │
│     │ Deal holy damage to target enemy                            │ │
│     │ [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░]       [+] [-]   │ │
│     └─────────────────────────────────────────────────────────────┘ │
│     ←───── Card translates right during swipe ─────→               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Swiping Left (Remove)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐     │
│ │ 💚 Holy Strike                              Rank 1/3       │  ◀- │
│ │ Deal holy damage to target enemy                            │     │
│ │ [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░]       [+] [-]   │     │
│ └─────────────────────────────────────────────────────────────┘     │
│               ←───── Card translates left during swipe              │
└─────────────────────────────────────────────────────────────────────┘
```

### Visual Feedback Options

```
Option A: Background Color Change
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓│ 💚 Holy Strike              Rank 1/3      │░░░░░│   │
│ Green │                                          │ Red  │   │
│ reveal│                                          │reveal│   │
└──────────────────────────────────────────────────────────────┘

Option B: Icon Indicator (Recommended)
┌──────────────────────────────────────────────────────────────┐
│  ➕  │ 💚 Holy Strike                    Rank 1/3│  ➖  │   │
│ shows│                                           │shows │   │
│ on   │                                           │on    │   │
│ swipe│                                           │swipe │   │
└──────────────────────────────────────────────────────────────┘
```

## CSS Styling

```css
/* Ability card swipe container */
.ability-card-swipe-container {
  position: relative;
  overflow: hidden;
  touch-action: pan-y; /* Allow vertical scroll, capture horizontal */
}

/* Card during swipe */
.ability-card.swiping {
  cursor: grabbing;
  user-select: none;
}

/* Swipe indicators */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 24px;
  pointer-events: none;
}

.swipe-indicator.left {
  left: 8px;
  color: var(--color-error, #dc3545);
}

.swipe-indicator.right {
  right: 8px;
  color: var(--color-success, #28a745);
}

/* Show indicator based on swipe direction */
.ability-card-swipe-container.swiping-right .swipe-indicator.right,
.ability-card-swipe-container.swiping-left .swipe-indicator.left {
  opacity: 1;
}

/* Background reveal on swipe */
.swipe-background {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.swipe-background.add {
  right: 0;
  background: linear-gradient(to left, var(--color-success) 0%, transparent 100%);
}

.swipe-background.remove {
  left: 0;
  background: linear-gradient(to right, var(--color-error) 0%, transparent 100%);
}

/* Disable swipe on desktop */
@media (min-width: 768px) {
  .ability-card-swipe-container {
    touch-action: auto;
  }
}
```

## Decision Tree

```
Touch Start
    │
    ▼
┌───────────────────┐
│ Record start      │
│ position & time   │
└─────────┬─────────┘
          │
          ▼
Touch Move
          │
    ┌─────┴─────┐
    │           │
|ΔY| > |ΔX|  |ΔX| > |ΔY|
    │           │
    ▼           ▼
┌─────────┐  ┌─────────┐
│ User is │  │ User is │
│scrolling│  │ swiping │
│ → Abort │  │→Continue│
└─────────┘  └────┬────┘
                  │
                  ▼
          ┌───────────────┐
          │ Prevent scroll│
          │ Update deltaX │
          │ Apply transform│
          └───────┬───────┘
                  │
                  ▼
Touch End
          │
    ┌─────┴─────────────────┐
    │                       │
|ΔX| >= 50px           |ΔX| < 50px
or velocity > 0.5      and velocity < 0.5
    │                       │
    ▼                       ▼
┌─────────────┐      ┌──────────┐
│ Execute     │      │ Cancel   │
│ swipe action│      │ swipe    │
└─────────────┘      │ animate  │
                     │ back     │
                     └──────────┘
```

## Integration Points

### With AbilityCard.tsx

```tsx
// AbilityCard.tsx enhancement
import { useSwipeGesture } from '../hooks/useSwipeGesture';

export function AbilityCard({
  ability,
  currentRank,
  onPurchase,
  onRemove,
  canPurchase,
  canRemove,
  announce,
}: AbilityCardProps) {
  const { handlers, style, state } = useSwipeGesture({
    onSwipeRight: () => {
      if (canPurchase) {
        onPurchase(ability);
        announce?.(`Added ${ability.name} rank ${currentRank + 1}`);
      }
    },
    onSwipeLeft: () => {
      if (canRemove) {
        onRemove(ability);
        announce?.(`Removed ${ability.name}`);
      }
    },
    disabled: !canPurchase && !canRemove,
    threshold: 50,
  });

  const swipeDirection = state.isSwiping
    ? state.deltaX > 0
      ? 'right'
      : 'left'
    : null;

  return (
    <div
      className={`ability-card-swipe-container ${
        swipeDirection ? `swiping-${swipeDirection}` : ''
      }`}
    >
      {/* Swipe background indicators */}
      <div className="swipe-background add" aria-hidden="true">
        +
      </div>
      <div className="swipe-background remove" aria-hidden="true">
        −
      </div>

      {/* Main card with swipe handlers */}
      <div
        className={`ability-card ${state.isSwiping ? 'swiping' : ''}`}
        {...handlers}
        style={style}
      >
        {/* Card content */}
        <div className="ability-info">
          <span className="ability-name">{ability.name}</span>
          <span className="ability-rank">
            Rank {currentRank}/{ability.maxRank}
          </span>
        </div>

        {/* Fallback buttons */}
        <div className="ability-actions">
          <button
            onClick={() => onPurchase(ability)}
            disabled={!canPurchase}
            aria-label={`Add rank to ${ability.name}`}
          >
            +
          </button>
          <button
            onClick={() => onRemove(ability)}
            disabled={!canRemove}
            aria-label={`Remove rank from ${ability.name}`}
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
}
```

### With useAnnounce (from v0.3.0)

```tsx
// App.tsx integration
const { announce } = useAnnounce();

// Pass announce to AbilityTree/AbilityCard
<AbilityTree
  abilities={abilities}
  onPurchase={handlePurchase}
  onRemove={handleRemove}
  announce={announce}
/>
```

## Accessibility

### WCAG 2.5.4 Motion Actuation

Swipe gestures must have non-motion alternatives:

```tsx
// All swipe actions have button equivalents
<button onClick={() => onPurchase(ability)} disabled={!canPurchase}>
  Add Rank
</button>
<button onClick={() => onRemove(ability)} disabled={!canRemove}>
  Remove Rank
</button>
```

### Screen Reader Announcements

```tsx
// Announce swipe actions
onSwipeRight: () => {
  onPurchase(ability);
  announce(`Purchased ${ability.name} rank ${newRank}`, 'polite');
}

onSwipeLeft: () => {
  onRemove(ability);
  announce(`Removed ${ability.name}`, 'polite');
}
```

### Touch Target Size

```css
/* Ensure card meets 44x44px minimum */
.ability-card {
  min-height: 48px;
  padding: 12px 16px;
}
```

## Testing Strategy

### Unit Tests (useSwipeGesture.test.ts)

```typescript
describe('useSwipeGesture', () => {
  describe('initialization', () => {
    it('returns initial state with no swiping');
    it('returns touch handlers');
    it('returns neutral style');
  });

  describe('touch start', () => {
    it('sets isSwiping to true');
    it('records start position');
    it('does nothing when disabled');
  });

  describe('touch move', () => {
    it('tracks deltaX during horizontal swipe');
    it('aborts swipe if vertical movement detected');
    it('prevents scroll during horizontal swipe');
    it('updates direction based on deltaX');
    it('applies transform style');
  });

  describe('touch end', () => {
    it('calls onSwipeRight when threshold met');
    it('calls onSwipeLeft when threshold met');
    it('does not call callback when threshold not met');
    it('considers velocity for quick swipes');
    it('resets state after touch end');
  });

  describe('scroll conflict prevention', () => {
    it('allows vertical scroll when scrolling');
    it('prevents horizontal scroll when swiping');
    it('determines scroll vs swipe on first significant movement');
  });
});
```

### Integration Tests

```typescript
describe('AbilityCard swipe integration', () => {
  it('adds rank on swipe right');
  it('removes rank on swipe left');
  it('shows visual feedback during swipe');
  it('announces action to screen readers');
  it('respects canPurchase/canRemove constraints');
  it('button fallbacks still work');
});
```

### Device Testing

| Device | Test Case | Expected |
|--------|-----------|----------|
| iPhone | Swipe right | Add rank |
| iPhone | Swipe left | Remove rank |
| iPhone | Vertical scroll | No swipe trigger |
| Android | Swipe right | Add rank |
| Android | Swipe left | Remove rank |
| Android | Quick flick | Detect via velocity |
| iPad | Swipe | Works on tablet |

## Deliverable Checklist

### Implementation
- [ ] useSwipeGesture hook created
- [ ] Touch handlers integrated into AbilityCard
- [ ] Visual feedback during swipe
- [ ] Swipe indicators (+ / −) visible
- [ ] Scroll conflict prevention working
- [ ] Screen reader announcements
- [ ] Button fallbacks preserved

### Testing
- [ ] Unit tests for useSwipeGesture
- [ ] Integration tests with AbilityCard
- [ ] iOS Safari tested
- [ ] Android Chrome tested
- [ ] Scroll vs swipe conflict tested

### Accessibility
- [ ] Buttons remain as alternatives
- [ ] Actions announced to screen readers
- [ ] Touch targets meet 44x44px minimum

### Documentation
- [ ] Hook JSDoc comments
- [ ] Usage examples

## Known Issues & Future Improvements

### Current Limitations
- No haptic feedback (requires native API)
- Single finger only (no pinch/multi-touch)
- Fixed threshold (not user configurable)

### Future Enhancements
- Haptic feedback via Vibration API
- Configurable swipe sensitivity
- Long press to preview action
- Swipe to reveal additional actions
- Undo swipe with reverse gesture

## Code Reference

### Complete useSwipeGesture Hook

```typescript
// src/hooks/useSwipeGesture.ts
import { useState, useCallback, useRef } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
}

interface UseSwipeGestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

interface UseSwipeGestureReturn {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  state: SwipeState;
  style: React.CSSProperties;
}

const initialState: SwipeState = {
  startX: 0,
  startY: 0,
  currentX: 0,
  deltaX: 0,
  deltaY: 0,
  isSwiping: false,
  direction: null,
};

export function useSwipeGesture({
  threshold = 50,
  velocityThreshold = 0.5,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}: UseSwipeGestureOptions = {}): UseSwipeGestureReturn {
  const [state, setState] = useState<SwipeState>(initialState);
  const startTimeRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      const touch = e.touches[0];
      startTimeRef.current = Date.now();
      isScrollingRef.current = null;

      setState({
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        deltaX: 0,
        deltaY: 0,
        isSwiping: true,
        direction: null,
      });
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      setState((prev) => {
        if (!prev.isSwiping) return prev;

        const touch = e.touches[0];
        const deltaX = touch.clientX - prev.startX;
        const deltaY = touch.clientY - prev.startY;

        // Determine scroll vs swipe on first significant movement
        if (isScrollingRef.current === null) {
          const absX = Math.abs(deltaX);
          const absY = Math.abs(deltaY);
          if (absX > 10 || absY > 10) {
            isScrollingRef.current = absY > absX;
          }
        }

        // If scrolling, abort swipe
        if (isScrollingRef.current) {
          return initialState;
        }

        // Prevent scroll while swiping
        if (Math.abs(deltaX) > 10) {
          e.preventDefault();
        }

        return {
          ...prev,
          currentX: touch.clientX,
          deltaX,
          deltaY,
          direction: deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : null,
        };
      });
    },
    [disabled]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;

    setState((prev) => {
      if (!prev.isSwiping) return initialState;

      const elapsed = Date.now() - startTimeRef.current;
      const velocity = Math.abs(prev.deltaX) / elapsed;

      // Check threshold
      const meetsThreshold =
        Math.abs(prev.deltaX) >= threshold || velocity >= velocityThreshold;

      if (meetsThreshold && !isScrollingRef.current) {
        if (prev.deltaX > 0 && onSwipeRight) {
          // Delay to allow animation
          requestAnimationFrame(() => onSwipeRight());
        } else if (prev.deltaX < 0 && onSwipeLeft) {
          requestAnimationFrame(() => onSwipeLeft());
        }
      }

      return initialState;
    });
  }, [disabled, threshold, velocityThreshold, onSwipeLeft, onSwipeRight]);

  // Calculate transform for visual feedback
  const style: React.CSSProperties = state.isSwiping
    ? {
        transform: `translateX(${state.deltaX * 0.5}px)`,
        transition: 'none',
      }
    : {
        transform: 'translateX(0)',
        transition: 'transform 0.2s ease-out',
      };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    state,
    style,
  };
}
```
