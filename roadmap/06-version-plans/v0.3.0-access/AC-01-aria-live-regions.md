# AC-01: ARIA Live Regions

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | AC-01 |
| **Name** | ARIA Live Regions |
| **Status** | Planned |
| **Priority** | High |
| **Category** | Accessibility |
| **Complexity** | Medium |
| **WCAG** | 4.1.3 Status Messages, 1.3.1 Info and Relationships |

## Description

Implement ARIA live regions to announce dynamic content changes to screen reader users. This ensures that users who cannot see the screen are informed when the application state changes.

## User Story

> As a screen reader user,
> I want to hear when my build changes,
> So that I can understand the effects of my actions without seeing the screen.

## Acceptance Criteria

- [ ] Toast notifications are announced to screen readers
- [ ] Ability purchase/removal is announced
- [ ] Class selection is announced
- [ ] Build reset is announced
- [ ] Undo/redo actions are announced
- [ ] Search results count is announced
- [ ] Over-budget warnings are announced
- [ ] Announcements use appropriate politeness levels

## Current State Audit

### What Exists
| Component | ARIA Support | Status |
|-----------|--------------|--------|
| Toast.tsx | Has aria-label on dismiss button | Partial |
| SearchFilter.tsx | Has aria-label on input | Partial |
| BuildSummary.tsx | No live region | Missing |
| ActionBar.tsx | Has aria-label on buttons | Partial |

### What's Missing
| Gap | Impact |
|-----|--------|
| No aria-live on Toast container | Toasts not announced |
| No aria-live on search results | Result count not announced |
| No role="status" on point display | Budget changes not announced |
| No programmatic announcements | Action feedback not announced |

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useAnnounce.ts` | Hook for programmatic announcements |
| `src/hooks/useAnnounce.test.ts` | Unit tests |
| `src/components/LiveRegion.tsx` | Visually hidden live region container |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/Toast.tsx` | Add aria-live, role="alert" |
| `src/components/SearchFilter.tsx` | Add aria-live to result count |
| `src/components/BuildSummary.tsx` | Add role="status" to point display |
| `src/App.tsx` | Add LiveRegion component, integrate useAnnounce |

### Interfaces

```typescript
// src/hooks/useAnnounce.ts
type Politeness = 'polite' | 'assertive';

interface UseAnnounceReturn {
  announce: (message: string, politeness?: Politeness) => void;
  LiveRegion: React.FC;
}

function useAnnounce(): UseAnnounceReturn;
```

```typescript
// src/components/LiveRegion.tsx
interface LiveRegionProps {
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
  children?: React.ReactNode;
}
```

### Hook Implementation

```typescript
// src/hooks/useAnnounce.ts
import { useState, useCallback, useEffect } from 'react';

export function useAnnounce() {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((text: string, level: 'polite' | 'assertive' = 'polite') => {
    // Clear first to ensure re-announcement of same message
    setMessage('');
    setPoliteness(level);
    // Use requestAnimationFrame to ensure DOM updates
    requestAnimationFrame(() => {
      setMessage(text);
    });
  }, []);

  // Clear message after announcement
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const LiveRegion = () => (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );

  return { announce, LiveRegion };
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ARIA Live Regions Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   App.tsx                                                           │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                                                              │  │
│   │   const { announce, LiveRegion } = useAnnounce();           │  │
│   │                                                              │  │
│   │   ┌───────────────────────────────────────────────────────┐ │  │
│   │   │ <LiveRegion />  ← Visually hidden, but announced     │ │  │
│   │   │ role="status" aria-live="polite" aria-atomic="true"  │ │  │
│   │   └───────────────────────────────────────────────────────┘ │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│           ┌───────────────┼───────────────┐                        │
│           ▼               ▼               ▼                        │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                 │
│   │   Toast     │ │  Search     │ │   Build     │                 │
│   │  Container  │ │  Filter     │ │  Summary    │                 │
│   │             │ │             │ │             │                 │
│   │ aria-live=  │ │ Result      │ │ role=       │                 │
│   │ "polite"    │ │ count has   │ │ "status"    │                 │
│   │             │ │ aria-live   │ │             │                 │
│   └─────────────┘ └─────────────┘ └─────────────┘                 │
│                                                                     │
│   Events that trigger announce():                                   │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ • Ability purchased: "Purchased Serenity rank 1"            │  │
│   │ • Ability removed: "Removed Serenity"                       │  │
│   │ • Class selected: "Selected Cleric"                         │  │
│   │ • Build reset: "Build reset"                                │  │
│   │ • Undo: "Undo: Removed Serenity"                           │  │
│   │ • Redo: "Redo: Purchased Serenity"                         │  │
│   │ • Over budget: "Warning: Over budget by 5 points"          │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Politeness Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| `polite` | Non-urgent updates, background info | "Purchased Serenity rank 1" |
| `assertive` | Errors, warnings, critical updates | "Warning: Over budget" |

### Mapping Events to Politeness

| Event | Politeness | Message Example |
|-------|------------|-----------------|
| Ability purchased | polite | "Purchased {name} rank {n}" |
| Ability removed | polite | "Removed {name}" |
| Class selected | polite | "Selected {className}" |
| Build reset | polite | "Build reset" |
| Undo action | polite | "Undo: {action description}" |
| Redo action | polite | "Redo: {action description}" |
| Search results | polite | "{n} abilities found" |
| Over budget | assertive | "Warning: Over budget by {n} points" |
| Error | assertive | "Error: {message}" |

## Integration Points

### With Toast System

```tsx
// Toast.tsx enhancement
export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div
      className="toast-container"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          role={toast.type === 'error' ? 'alert' : 'status'}
        />
      ))}
    </div>
  );
}
```

### With SearchFilter

```tsx
// SearchFilter.tsx enhancement
<div className="search-filter-results" aria-live="polite">
  {resultCount !== null && (
    <span className="result-count">
      {resultCount} {resultCount === 1 ? 'ability' : 'abilities'} found
    </span>
  )}
</div>
```

### With BuildSummary

```tsx
// BuildSummary.tsx enhancement
<div className="points-display" role="status" aria-live="polite">
  <span className="sr-only">
    {spentPoints} of {POINT_BUDGET} points spent
  </span>
  <span aria-hidden="true">
    {spentPoints} / {POINT_BUDGET}
  </span>
</div>
```

### With App.tsx

```tsx
// App.tsx integration
function App() {
  const { announce, LiveRegion } = useAnnounce();

  const handlePurchaseAbility = (ability: IAbility) => {
    const newBuild = build.purchaseAbility(ability);
    if (newBuild !== build) {
      setBuild(newBuild);
      const newRank = newBuild.purchasedAbilities[ability.id];
      announce(`Purchased ${ability.name} rank ${newRank}`);
    }
  };

  const handleRemoveAbility = (ability: IAbility) => {
    const newBuild = build.removeAbilityRank(ability);
    if (newBuild !== build) {
      setBuild(newBuild);
      announce(`Removed ${ability.name}`);
    }
  };

  const handleClassSelect = (cls: IClass) => {
    setSelectedClass(cls);
    announce(`Selected ${cls.name}`);
  };

  const handleReset = () => {
    resetBuild();
    announce('Build reset');
  };

  return (
    <>
      <LiveRegion />
      {/* ... rest of app */}
    </>
  );
}
```

## CSS for Screen Reader Only

```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                  Screen Reader Announcement Flow                   │
└────────────────────────────────────────────────────────────────────┘

  User Action        App State          announce()        Screen Reader
       │                 │                   │                  │
       │ click ability   │                   │                  │
       ├────────────────►│                   │                  │
       │                 │                   │                  │
       │                 │ purchaseAbility() │                  │
       │                 ├──────────────────►│                  │
       │                 │                   │                  │
       │                 │                   │ "Purchased       │
       │                 │                   │  Serenity rank 1"│
       │                 │                   ├─────────────────►│
       │                 │                   │                  │
       │                 │                   │                  │ announces
       │◄────────────────┼───────────────────┼──────────────────┤ to user
       │                 │                   │                  │
       │ click reset     │                   │                  │
       ├────────────────►│                   │                  │
       │                 │                   │                  │
       │                 │ resetBuild()      │                  │
       │                 ├──────────────────►│                  │
       │                 │                   │                  │
       │                 │                   │ "Build reset"    │
       │                 │                   ├─────────────────►│
       │                 │                   │                  │
       │◄────────────────┼───────────────────┼──────────────────┤
       │                 │                   │                  │
```

## Testing Strategy

### Unit Tests (useAnnounce.test.ts)

```typescript
describe('useAnnounce', () => {
  describe('announce function', () => {
    it('sets message to provided text');
    it('defaults to polite politeness');
    it('accepts assertive politeness');
    it('clears message after timeout');
    it('handles rapid successive announcements');
  });

  describe('LiveRegion component', () => {
    it('renders with role="status"');
    it('renders with aria-live attribute');
    it('renders with aria-atomic="true"');
    it('has sr-only class for visual hiding');
    it('displays current message');
  });
});
```

### Integration Tests

```typescript
describe('ARIA live integration', () => {
  describe('Toast announcements', () => {
    it('toast container has aria-live="polite"');
    it('error toasts have role="alert"');
    it('success toasts have role="status"');
  });

  describe('Search results announcements', () => {
    it('announces result count on search');
    it('announces "no results" when empty');
  });

  describe('Build state announcements', () => {
    it('announces ability purchase');
    it('announces ability removal');
    it('announces class selection');
    it('announces build reset');
  });
});
```

### Screen Reader Testing

| Test Case | VoiceOver (macOS) | NVDA (Windows) |
|-----------|-------------------|----------------|
| Toast appears | Announces message | Announces message |
| Ability purchased | Announces action | Announces action |
| Over budget | Announces warning | Announces warning |
| Search results | Announces count | Announces count |

## Deliverable Checklist

### Implementation
- [ ] `useAnnounce` hook created
- [ ] `LiveRegion` component created
- [ ] `.sr-only` CSS class added
- [ ] Toast container has aria-live
- [ ] SearchFilter has aria-live for results
- [ ] BuildSummary has role="status"
- [ ] App.tsx integrates useAnnounce
- [ ] All state changes trigger announcements

### Testing
- [ ] `useAnnounce.test.ts` complete
- [ ] Integration tests complete
- [ ] VoiceOver testing complete
- [ ] NVDA testing complete (if available)

### Documentation
- [ ] Hook JSDoc comments
- [ ] Usage examples in code

## Known Issues & Future Improvements

### Current Limitations
- No announcement history/log
- No user preference for verbosity
- Announcements not persisted

### Future Enhancements
- Verbosity settings (verbose, brief, none)
- Announcement log for review
- Custom announcement templates
- Rate limiting for rapid changes

## Code Reference

### Complete useAnnounce Hook

```typescript
// src/hooks/useAnnounce.ts
import { useState, useCallback, useEffect, useRef } from 'react';

type Politeness = 'polite' | 'assertive';

interface UseAnnounceReturn {
  announce: (message: string, politeness?: Politeness) => void;
  LiveRegion: React.FC;
}

export function useAnnounce(): UseAnnounceReturn {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<Politeness>('polite');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const announce = useCallback((text: string, level: Politeness = 'polite') => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear message first to ensure re-announcement
    setMessage('');
    setPoliteness(level);

    // Set new message after a frame
    requestAnimationFrame(() => {
      setMessage(text);
    });
  }, []);

  // Clear message after announcement
  useEffect(() => {
    if (message) {
      timeoutRef.current = setTimeout(() => {
        setMessage('');
      }, 1000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [message]);

  const LiveRegion: React.FC = () => (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );

  return { announce, LiveRegion };
}
```

### Complete LiveRegion Component

```typescript
// src/components/LiveRegion.tsx
import React from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

export function LiveRegion({
  message,
  politeness = 'polite',
  atomic = true,
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {message}
    </div>
  );
}
```
