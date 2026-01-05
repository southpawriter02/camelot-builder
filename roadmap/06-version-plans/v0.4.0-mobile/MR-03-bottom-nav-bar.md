# MR-03: Bottom Navigation Bar

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | MR-03 |
| **Name** | Bottom Navigation Bar |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Mobile/Responsive |
| **Complexity** | Medium |

## Description

Implement a fixed bottom navigation bar for mobile devices that provides persistent access to key build statistics and quick actions without scrolling. This addresses the issue of the sidebar (with build summary) being pushed below the fold on mobile layouts.

## User Story

> As a mobile user building my character,
> I want to see my build stats without scrolling back to the top,
> So that I can track my point budget and progress while exploring abilities.

## Acceptance Criteria

- [ ] Bottom nav bar appears only on mobile (< 768px)
- [ ] Bottom nav displays current points spent / total budget
- [ ] Bottom nav displays ability count
- [ ] Bottom nav includes quick action buttons (reset, undo)
- [ ] Bottom nav is fixed at the bottom of the viewport
- [ ] Bottom nav respects safe area insets (notched devices)
- [ ] Content above bottom nav has appropriate padding
- [ ] Bottom nav is accessible via keyboard
- [ ] Screen readers can access bottom nav content

## Current State Audit

### What Exists
| Component | Current Behavior | Status |
|-----------|------------------|--------|
| BuildSummary.tsx | Shows stats in sidebar | Desktop only accessible |
| App.tsx layout | Sidebar below content on mobile | Poor mobile UX |
| ActionBar.tsx | Action buttons in header | Not accessible while scrolling |

### What's Missing
| Gap | Required Change |
|-----|-----------------|
| No persistent mobile stats | Create BottomNavBar component |
| No safe area handling | Add CSS env() variables |
| No mobile quick actions | Add reset/undo to bottom bar |

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/BottomNavBar.tsx` | Bottom navigation component |
| `src/components/BottomNavBar.css` | Bottom nav styling |
| `src/components/BottomNavBar.test.tsx` | Unit tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add BottomNavBar, pass props |
| `src/App.css` | Add padding-bottom for mobile |

### Interfaces

```typescript
// src/components/BottomNavBar.tsx
interface BottomNavBarProps {
  pointsSpent: number;
  pointBudget: number;
  abilityCount: number;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
}
```

### Component Implementation

```tsx
// src/components/BottomNavBar.tsx
import React from 'react';
import './BottomNavBar.css';

interface BottomNavBarProps {
  pointsSpent: number;
  pointBudget: number;
  abilityCount: number;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function BottomNavBar({
  pointsSpent,
  pointBudget,
  abilityCount,
  onReset,
  onUndo,
  canUndo,
}: BottomNavBarProps) {
  const isOverBudget = pointsSpent > pointBudget;
  const remainingPoints = pointBudget - pointsSpent;

  return (
    <nav className="bottom-nav" aria-label="Build summary">
      {/* Points Display */}
      <div className="bottom-nav-section points-section">
        <span className="bottom-nav-label">Points</span>
        <span
          className={`bottom-nav-value ${isOverBudget ? 'over-budget' : ''}`}
          role="status"
          aria-live="polite"
        >
          {pointsSpent}/{pointBudget}
        </span>
        <span className="bottom-nav-sublabel">
          {isOverBudget ? (
            <span className="warning">Over by {Math.abs(remainingPoints)}</span>
          ) : (
            `${remainingPoints} left`
          )}
        </span>
      </div>

      {/* Abilities Count */}
      <div className="bottom-nav-section abilities-section">
        <span className="bottom-nav-label">Abilities</span>
        <span className="bottom-nav-value">{abilityCount}</span>
        <span className="bottom-nav-sublabel">selected</span>
      </div>

      {/* Quick Actions */}
      <div className="bottom-nav-section actions-section">
        <button
          className="bottom-nav-action"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last action"
        >
          <span className="action-icon" aria-hidden="true">↩</span>
          <span className="action-label">Undo</span>
        </button>
        <button
          className="bottom-nav-action reset"
          onClick={onReset}
          aria-label="Reset build"
        >
          <span className="action-icon" aria-hidden="true">↺</span>
          <span className="action-label">Reset</span>
        </button>
      </div>
    </nav>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Bottom Navigation Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Mobile Layout (< 768px)                                           │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                         Header                               │  │
│   ├─────────────────────────────────────────────────────────────┤  │
│   │                                                              │  │
│   │                     Main Content                             │  │
│   │                   (Ability Trees)                            │  │
│   │                                                              │  │
│   │                         ...                                  │  │
│   │                                                              │  │
│   │                                                              │  │
│   │              padding-bottom: 80px                            │  │
│   ├─────────────────────────────────────────────────────────────┤  │
│   │                                                              │  │
│   │                   BottomNavBar (fixed)                       │  │
│   │   ┌─────────────┬─────────────┬─────────────────────────┐   │  │
│   │   │   Points    │  Abilities  │       Actions           │   │  │
│   │   │   15/40     │     5       │   [Undo] [Reset]        │   │  │
│   │   │  25 left    │  selected   │                         │   │  │
│   │   └─────────────┴─────────────┴─────────────────────────┘   │  │
│   │                                                              │  │
│   │                safe-area-inset-bottom                        │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Desktop Layout (>= 768px)                                        │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │   BottomNavBar is hidden (display: none)                    │  │
│   │   BuildSummary sidebar is visible                           │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Mockup

### Normal State

```
┌─────────────────────────────────────────────────────────────────────┐
│                          (Screen Content)                           │
│                                                                     │
│                              ...                                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Points        Abilities           Actions                          │
│  15/40         5                   [↩ Undo] [↺ Reset]              │
│  25 left       selected                                             │
├─────────────────────────────────────────────────────────────────────┤
│                     (Safe Area - iPhone)                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Over Budget State

```
┌─────────────────────────────────────────────────────────────────────┐
│                          (Screen Content)                           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Points        Abilities           Actions                          │
│  ⚠️ 45/40      8                   [↩ Undo] [↺ Reset]              │
│  Over by 5     selected                                             │
├─────────────────────────────────────────────────────────────────────┤
│                     (Safe Area - iPhone)                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Compact Alternative

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎯 15/40 pts  │  ⚔️ 5 abilities  │  [↩]  [↺]                      │
└─────────────────────────────────────────────────────────────────────┘
```

## CSS Styling

```css
/* src/components/BottomNavBar.css */

/* Container - fixed at bottom */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none; /* Hidden by default */
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: var(--bg-primary, #1a1a2e);
  border-top: 1px solid var(--border-color, #3a3a5e);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

/* Show only on mobile */
@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
  }
}

/* Sections */
.bottom-nav-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.bottom-nav-section.points-section {
  flex: 1;
  align-items: flex-start;
}

.bottom-nav-section.abilities-section {
  flex: 1;
  align-items: center;
}

.bottom-nav-section.actions-section {
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
}

/* Labels */
.bottom-nav-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted, #888);
}

/* Values */
.bottom-nav-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary, #fff);
}

.bottom-nav-value.over-budget {
  color: var(--color-error, #ff4444);
}

/* Sub-labels */
.bottom-nav-sublabel {
  font-size: 11px;
  color: var(--text-muted, #888);
}

.bottom-nav-sublabel .warning {
  color: var(--color-error, #ff4444);
}

/* Action buttons */
.bottom-nav-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  min-width: 48px;
  min-height: 48px; /* Touch target */
  background: var(--bg-secondary, #2a2a4e);
  border: 1px solid var(--border-color, #3a3a5e);
  border-radius: 8px;
  color: var(--text-primary, #fff);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.bottom-nav-action:hover:not(:disabled) {
  background: var(--bg-hover, #3a3a5e);
}

.bottom-nav-action:active:not(:disabled) {
  transform: scale(0.95);
}

.bottom-nav-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bottom-nav-action:focus-visible {
  outline: 3px solid var(--color-gold, #ffd700);
  outline-offset: 2px;
}

.bottom-nav-action.reset {
  color: var(--color-error, #ff4444);
  border-color: var(--color-error, #ff4444);
}

.bottom-nav-action .action-icon {
  font-size: 18px;
}

.bottom-nav-action .action-label {
  font-size: 10px;
  text-transform: uppercase;
}

/* Content padding to avoid overlap */
@media (max-width: 767px) {
  .main-content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  }
}
```

## Safe Area Handling

For devices with notches (iPhone X+) or gesture bars:

```css
/* Ensure bottom nav accounts for safe areas */
.bottom-nav {
  /* Bottom padding includes safe area */
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}

/* Also set viewport meta for proper safe area behavior */
/* In index.html: <meta name="viewport" content="..., viewport-fit=cover"> */
```

```html
<!-- index.html update -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

## Decision Tree

```
Page loads
    │
    ▼
┌───────────────────┐
│ Check viewport    │
│ width             │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    │           │
  < 768px    >= 768px
    │           │
    ▼           ▼
┌─────────┐  ┌─────────┐
│ Show    │  │ Hide    │
│Bottom   │  │ Bottom  │
│ NavBar  │  │ NavBar  │
└────┬────┘  │ Show    │
     │       │ Sidebar │
     │       └─────────┘
     │
     ▼
┌───────────────────────────────────────┐
│ BottomNavBar displays:                │
│ - Points: spent/budget               │
│ - Abilities: count                   │
│ - Actions: Undo, Reset               │
└───────────────────────────────────────┘
     │
     ▼
User interaction
     │
     ├─── Tap Undo ───► Call onUndo, update history
     │
     └─── Tap Reset ──► Call onReset (with confirmation)
```

## Integration Points

### With App.tsx

```tsx
// App.tsx integration
import { BottomNavBar } from './components/BottomNavBar';

function App() {
  const { build, history, resetBuild, undo } = useBuild();
  const pointsSpent = build.totalPointsSpent;
  const abilityCount = Object.keys(build.purchasedAbilities).length;

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <AbilityTree {...props} />
      </main>
      <aside className="sidebar">
        <BuildSummary {...props} />
      </aside>

      {/* Mobile bottom navigation */}
      <BottomNavBar
        pointsSpent={pointsSpent}
        pointBudget={POINT_BUDGET}
        abilityCount={abilityCount}
        onReset={resetBuild}
        onUndo={undo}
        canUndo={history.canUndo}
      />
    </div>
  );
}
```

### With BuildSummary Data

The BottomNavBar extracts the same data displayed in BuildSummary:

```typescript
// Data shared between BuildSummary and BottomNavBar
const sharedStats = {
  pointsSpent: build.totalPointsSpent,
  pointBudget: POINT_BUDGET,
  remainingPoints: POINT_BUDGET - build.totalPointsSpent,
  abilityCount: Object.keys(build.purchasedAbilities).length,
};
```

### With useMediaQuery Hook

```tsx
// Optional: Use hook instead of CSS for conditional rendering
import { useMediaQuery } from '../hooks/useMediaQuery';

function App() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <>
      {/* ... */}
      {isMobile && (
        <BottomNavBar {...props} />
      )}
    </>
  );
}
```

## Accessibility

### ARIA Attributes

```tsx
<nav className="bottom-nav" aria-label="Build summary">
  <div role="status" aria-live="polite">
    <span className="sr-only">
      {pointsSpent} of {pointBudget} points spent.
      {isOverBudget
        ? `Warning: Over budget by ${Math.abs(remainingPoints)} points.`
        : `${remainingPoints} points remaining.`}
    </span>
  </div>

  <button
    onClick={onUndo}
    disabled={!canUndo}
    aria-label="Undo last action"
    aria-disabled={!canUndo}
  >
    Undo
  </button>

  <button onClick={onReset} aria-label="Reset build">
    Reset
  </button>
</nav>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between action buttons |
| Enter/Space | Activate focused button |
| Shift+Tab | Move to previous button |

### Focus Management

```css
.bottom-nav-action:focus-visible {
  outline: 3px solid var(--color-gold, #ffd700);
  outline-offset: 2px;
}
```

## Testing Strategy

### Unit Tests (BottomNavBar.test.tsx)

```typescript
describe('BottomNavBar', () => {
  describe('rendering', () => {
    it('renders points spent and budget');
    it('renders ability count');
    it('renders undo button');
    it('renders reset button');
    it('has aria-label on nav element');
  });

  describe('points display', () => {
    it('shows normal state when under budget');
    it('shows warning state when over budget');
    it('shows remaining points when under budget');
    it('shows over amount when over budget');
  });

  describe('undo button', () => {
    it('calls onUndo when clicked');
    it('is disabled when canUndo is false');
    it('is enabled when canUndo is true');
    it('has accessible label');
  });

  describe('reset button', () => {
    it('calls onReset when clicked');
    it('has accessible label');
  });

  describe('accessibility', () => {
    it('has role="status" for live updates');
    it('is keyboard navigable');
    it('has focus-visible styles');
  });
});
```

### Integration Tests

```typescript
describe('BottomNavBar integration', () => {
  it('updates when points change');
  it('updates when abilities change');
  it('undo button reflects history state');
  it('reset clears build');
});
```

### Responsive Tests

```typescript
describe('BottomNavBar responsive', () => {
  it('is hidden on desktop (>= 768px)');
  it('is visible on mobile (< 768px)');
  it('respects safe area insets');
  it('content has proper padding to avoid overlap');
});
```

### Device Testing

| Device | Test Case | Expected |
|--------|-----------|----------|
| iPhone SE | Display | Fits within narrow width |
| iPhone 14 | Safe area | Respects notch |
| iPad | Display | Hidden in portrait/landscape |
| Android | Display | Shows correctly |
| Desktop | Display | Hidden |

## Deliverable Checklist

### Implementation
- [ ] BottomNavBar component created
- [ ] CSS styling complete
- [ ] Safe area insets handled
- [ ] Content padding added
- [ ] Hidden on desktop
- [ ] Points display working
- [ ] Ability count display working
- [ ] Undo button functional
- [ ] Reset button functional

### Testing
- [ ] Unit tests complete
- [ ] Integration tests complete
- [ ] Responsive behavior tested
- [ ] Safe area tested on notched devices
- [ ] Keyboard navigation tested

### Accessibility
- [ ] aria-label on nav
- [ ] role="status" for live updates
- [ ] Button labels accessible
- [ ] Focus-visible styles

### Documentation
- [ ] Component JSDoc comments
- [ ] CSS variable documentation

## Known Issues & Future Improvements

### Current Limitations
- No swipe-to-dismiss
- Fixed height (no expand/collapse)
- No additional actions beyond undo/reset

### Future Enhancements
- Expandable tray with more stats
- Swipe up to see full build summary
- Share button in bottom nav
- Class icon display
- Progress bar for points

## Code Reference

### Complete BottomNavBar Component

```tsx
// src/components/BottomNavBar.tsx
import React from 'react';
import './BottomNavBar.css';

interface BottomNavBarProps {
  pointsSpent: number;
  pointBudget: number;
  abilityCount: number;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function BottomNavBar({
  pointsSpent,
  pointBudget,
  abilityCount,
  onReset,
  onUndo,
  canUndo,
}: BottomNavBarProps) {
  const isOverBudget = pointsSpent > pointBudget;
  const remainingPoints = pointBudget - pointsSpent;

  return (
    <nav className="bottom-nav" aria-label="Build summary">
      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {pointsSpent} of {pointBudget} points spent.
        {isOverBudget
          ? ` Warning: Over budget by ${Math.abs(remainingPoints)} points.`
          : ` ${remainingPoints} points remaining.`}
        {abilityCount} abilities selected.
      </div>

      {/* Points Display */}
      <div className="bottom-nav-section points-section">
        <span className="bottom-nav-label">Points</span>
        <span
          className={`bottom-nav-value ${isOverBudget ? 'over-budget' : ''}`}
          aria-hidden="true"
        >
          {pointsSpent}/{pointBudget}
        </span>
        <span className="bottom-nav-sublabel" aria-hidden="true">
          {isOverBudget ? (
            <span className="warning">Over by {Math.abs(remainingPoints)}</span>
          ) : (
            `${remainingPoints} left`
          )}
        </span>
      </div>

      {/* Abilities Count */}
      <div className="bottom-nav-section abilities-section">
        <span className="bottom-nav-label">Abilities</span>
        <span className="bottom-nav-value" aria-hidden="true">
          {abilityCount}
        </span>
        <span className="bottom-nav-sublabel" aria-hidden="true">
          selected
        </span>
      </div>

      {/* Quick Actions */}
      <div className="bottom-nav-section actions-section">
        <button
          className="bottom-nav-action"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last action"
        >
          <span className="action-icon" aria-hidden="true">
            ↩
          </span>
          <span className="action-label">Undo</span>
        </button>
        <button
          className="bottom-nav-action reset"
          onClick={onReset}
          aria-label="Reset build"
        >
          <span className="action-icon" aria-hidden="true">
            ↺
          </span>
          <span className="action-label">Reset</span>
        </button>
      </div>
    </nav>
  );
}
```

### Complete CSS

```css
/* src/components/BottomNavBar.css */

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: var(--bg-primary, #1a1a2e);
  border-top: 1px solid var(--border-color, #3a3a5e);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
  }
}

.bottom-nav-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.bottom-nav-section.points-section {
  flex: 1;
  align-items: flex-start;
}

.bottom-nav-section.abilities-section {
  flex: 1;
  align-items: center;
}

.bottom-nav-section.actions-section {
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
}

.bottom-nav-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted, #888);
}

.bottom-nav-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary, #fff);
}

.bottom-nav-value.over-budget {
  color: var(--color-error, #ff4444);
}

.bottom-nav-sublabel {
  font-size: 11px;
  color: var(--text-muted, #888);
}

.bottom-nav-sublabel .warning {
  color: var(--color-error, #ff4444);
}

.bottom-nav-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  min-width: 48px;
  min-height: 48px;
  background: var(--bg-secondary, #2a2a4e);
  border: 1px solid var(--border-color, #3a3a5e);
  border-radius: 8px;
  color: var(--text-primary, #fff);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.bottom-nav-action:hover:not(:disabled) {
  background: var(--bg-hover, #3a3a5e);
}

.bottom-nav-action:active:not(:disabled) {
  transform: scale(0.95);
}

.bottom-nav-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bottom-nav-action:focus-visible {
  outline: 3px solid var(--color-gold, #ffd700);
  outline-offset: 2px;
}

.bottom-nav-action.reset {
  color: var(--color-error, #ff4444);
  border-color: var(--color-error, #ff4444);
}

.bottom-nav-action .action-icon {
  font-size: 18px;
}

.bottom-nav-action .action-label {
  font-size: 10px;
  text-transform: uppercase;
}

/* Screen reader only */
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
