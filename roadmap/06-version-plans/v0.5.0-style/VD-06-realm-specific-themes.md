# VD-06: Realm-specific Themes

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | VD-06 |
| **Name** | Realm-specific Themes |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Visual Design |
| **Complexity** | Medium |

## Description

Apply realm colors (Albion blue, Midgard red, Hibernia green) pervasively throughout the UI when a class is selected. This creates a cohesive, immersive experience where the entire interface subtly reflects the chosen realm.

## User Story

> As a user building a character,
> I want the interface to reflect my chosen realm's colors,
> So that the application feels personalized and thematically consistent.

## Acceptance Criteria

- [ ] Header accent changes to realm color when class selected
- [ ] Progress bars use realm color
- [ ] Button hover states use realm color
- [ ] Card borders/accents use realm color
- [ ] Icons tint to realm color where appropriate
- [ ] Subtle background gradient tint reflects realm
- [ ] Smooth color transition when switching classes
- [ ] No class selected shows neutral/gold theme
- [ ] All realm-themed elements remain accessible (contrast)

## Current State Audit

### What Exists
| Element | Current Theming | Status |
|---------|-----------------|--------|
| Class card borders | Realm color on hover/select | Partial |
| Build summary icon | Realm-colored circle | Partial |
| Realm badges | Realm background color | Complete |
| Ability progress bars | Gold → green on max | No realm color |

### Current Realm Color Definitions

```css
/* src/index.css */
:root {
  /* Albion - Blue */
  --color-albion: #3b82f6;
  --color-albion-dark: #1e40af;
  --color-albion-light: #60a5fa;

  /* Midgard - Red */
  --color-midgard: #ef4444;
  --color-midgard-dark: #991b1b;
  --color-midgard-light: #f87171;

  /* Hibernia - Green */
  --color-hibernia: #22c55e;
  --color-hibernia-dark: #166534;
  --color-hibernia-light: #4ade80;
}
```

### Current Realm Class Usage

```tsx
// ClassSelector.tsx
const getRealmClass = (realm: RealmType): string => {
  return `realm-${realm.toLowerCase()}`;
};
// Applied to: .class-card.realm-albion, etc.
```

### What's Missing
| Gap | Impact |
|-----|--------|
| Header not themed | Inconsistent branding |
| Buttons not themed | Generic appearance |
| Progress bars not themed | Missed theming opportunity |
| No background tint | Less immersive |
| No transition animation | Jarring theme changes |

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Apply realm class to root container |
| `src/App.css` | Realm-specific CSS rules |
| `src/index.css` | Dynamic realm CSS variables |

### Implementation Approach

The implementation uses CSS custom properties that are dynamically set based on the selected realm, allowing all themed elements to respond automatically.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Realm Theming Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   App State                                                         │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  selectedClass: { name: "Cleric", realm: "Albion", ... }    │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   App Container                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  <div className={`app ${getRealmClass(selectedClass)}`}>    │  │
│   │                                                              │  │
│   │  Results in: <div class="app realm-albion">                 │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   CSS Variables (set by realm class)                                │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  .realm-albion {                                             │  │
│   │    --realm-color: var(--color-albion);                      │  │
│   │    --realm-color-dark: var(--color-albion-dark);           │  │
│   │    --realm-color-light: var(--color-albion-light);         │  │
│   │    --realm-color-glow: rgba(59, 130, 246, 0.3);            │  │
│   │  }                                                           │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│           ┌───────────────┼───────────────┬───────────────┐        │
│           ▼               ▼               ▼               ▼        │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│   │   Header    │ │   Buttons   │ │  Progress   │ │    Cards    │ │
│   │   Accent    │ │   Hover     │ │    Bars     │ │   Borders   │ │
│   │             │ │             │ │             │ │             │ │
│   │ border uses │ │ background  │ │ fill uses   │ │ glow uses   │ │
│   │ --realm-    │ │ uses        │ │ --realm-    │ │ --realm-    │ │
│   │ color       │ │ --realm-    │ │ color       │ │ color-glow  │ │
│   │             │ │ color       │ │             │ │             │ │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## CSS Implementation

### Realm Variable Definitions

```css
/* src/index.css - Add after existing realm colors */

/* Default theme (no class selected) - Gold accent */
:root {
  --realm-color: var(--color-gold);
  --realm-color-dark: var(--color-gold-dark);
  --realm-color-light: var(--color-gold-light);
  --realm-color-glow: rgba(251, 191, 36, 0.3);
  --realm-color-subtle: rgba(251, 191, 36, 0.1);
}

/* Albion Theme - Blue */
.realm-albion {
  --realm-color: var(--color-albion);
  --realm-color-dark: var(--color-albion-dark);
  --realm-color-light: var(--color-albion-light);
  --realm-color-glow: rgba(59, 130, 246, 0.3);
  --realm-color-subtle: rgba(59, 130, 246, 0.1);
}

/* Midgard Theme - Red */
.realm-midgard {
  --realm-color: var(--color-midgard);
  --realm-color-dark: var(--color-midgard-dark);
  --realm-color-light: var(--color-midgard-light);
  --realm-color-glow: rgba(239, 68, 68, 0.3);
  --realm-color-subtle: rgba(239, 68, 68, 0.1);
}

/* Hibernia Theme - Green */
.realm-hibernia {
  --realm-color: var(--color-hibernia);
  --realm-color-dark: var(--color-hibernia-dark);
  --realm-color-light: var(--color-hibernia-light);
  --realm-color-glow: rgba(34, 197, 94, 0.3);
  --realm-color-subtle: rgba(34, 197, 94, 0.1);
}
```

### Header Theming

```css
/* src/App.css */

/* Header accent border */
.app-header {
  border-bottom: 3px solid var(--realm-color);
  transition: border-color var(--transition-normal);
}

/* Header title with realm-colored gradient */
.app-header h1 {
  background: linear-gradient(
    135deg,
    var(--realm-color-light) 0%,
    var(--realm-color) 50%,
    var(--realm-color-dark) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background var(--transition-normal);
}
```

### Button Theming

```css
/* src/App.css */

/* Primary action buttons */
.btn-primary {
  background: var(--realm-color);
  color: white;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
}

.btn-primary:hover {
  background: var(--realm-color-dark);
  box-shadow: 0 0 12px var(--realm-color-glow);
}

/* Secondary buttons on hover */
.btn-secondary:hover {
  border-color: var(--realm-color);
  color: var(--realm-color);
}

/* Action bar buttons */
.action-bar button:hover:not(:disabled) {
  border-color: var(--realm-color);
  color: var(--realm-color-light);
}
```

### Progress Bar Theming

```css
/* src/App.css */

/* Ability progress bars */
.ability-progress-fill {
  background: linear-gradient(
    90deg,
    var(--realm-color-dark) 0%,
    var(--realm-color) 100%
  );
  transition: background var(--transition-normal), width var(--transition-normal);
}

/* Maxed ability progress bar */
.ability-maxed .ability-progress-fill {
  background: linear-gradient(
    90deg,
    var(--color-success) 0%,
    var(--realm-color) 100%
  );
}

/* Point budget progress bar */
.budget-progress-fill {
  background: linear-gradient(
    90deg,
    var(--realm-color-dark) 0%,
    var(--realm-color) 100%
  );
}

/* Over budget warning */
.budget-progress-fill.over-budget {
  background: linear-gradient(
    90deg,
    var(--color-danger) 0%,
    var(--color-danger-dark) 100%
  );
}
```

### Card Border/Glow Theming

```css
/* src/App.css */

/* Purchasable ability card glow */
.ability-card.purchasable {
  box-shadow: 0 0 8px var(--realm-color-glow);
  border-color: var(--realm-color);
}

.ability-card.purchasable:hover {
  box-shadow: 0 0 16px var(--realm-color-glow);
}

/* Section cards */
.section-card {
  border-color: var(--realm-color-subtle);
  transition: border-color var(--transition-normal);
}

/* Selected class card */
.class-card.selected {
  border-color: var(--realm-color);
  box-shadow: 0 0 12px var(--realm-color-glow);
}
```

### Background Tint

```css
/* src/App.css */

/* Subtle background tint overlay */
.app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: radial-gradient(
    ellipse at top,
    var(--realm-color-subtle) 0%,
    transparent 70%
  );
  z-index: 0;
  transition: background var(--transition-slow);
}

.app > * {
  position: relative;
  z-index: 1;
}
```

### Icon Tinting

```css
/* src/App.css */

/* Icons that should adopt realm color */
.realm-themed-icon {
  color: var(--realm-color);
  transition: color var(--transition-fast);
}

/* Tree header icons */
.tree-group-header .icon {
  color: var(--realm-color-light);
}
```

### Transition Animation

```css
/* src/index.css */

/* Smooth theme transitions */
:root {
  --transition-theme: 0.4s ease-out;
}

/* Elements that transition on theme change */
.app-header,
.btn-primary,
.ability-progress-fill,
.budget-progress-fill,
.section-card,
.class-card,
.ability-card {
  transition:
    border-color var(--transition-theme),
    box-shadow var(--transition-theme),
    background var(--transition-theme),
    color var(--transition-theme);
}
```

## React Implementation

### App.tsx Integration

```tsx
// src/App.tsx
import { useMemo } from 'react';

function App() {
  const { build, selectedClass } = useBuild();

  // Generate realm class name
  const realmClassName = useMemo(() => {
    if (selectedClass?.realm) {
      return `realm-${selectedClass.realm.toLowerCase()}`;
    }
    return ''; // Default theme (gold)
  }, [selectedClass]);

  return (
    <div className={`app ${realmClassName}`}>
      <header className="app-header">
        {/* Header content */}
      </header>
      <main className="app-main">
        {/* Main content */}
      </main>
    </div>
  );
}
```

### Helper Function

```typescript
// src/utils/theme.ts
import { RealmType } from '../types';

export function getRealmClassName(realm?: RealmType): string {
  if (!realm) return '';
  return `realm-${realm.toLowerCase()}`;
}

export function getRealmColor(realm: RealmType): string {
  const colors: Record<RealmType, string> = {
    Albion: '#3b82f6',
    Midgard: '#ef4444',
    Hibernia: '#22c55e',
  };
  return colors[realm];
}
```

## Visual Mockups

### No Class Selected (Gold/Neutral)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ═══════════════════════════════════════════════════════════════════ │  Gold accent
│                     CAMELOT BUILDER                                 │
│ ═══════════════════════════════════════════════════════════════════ │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  Select a Class                                             │  │
│   │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                  │  │
│   │  │Cleric │ │Friar  │ │Paladin│ │ ...   │                  │  │
│   │  └───────┘ └───────┘ └───────┘ └───────┘                  │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Albion Class Selected (Blue)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ═══════════════════════════════════════════════════════════════════ │  Blue accent
│                     CAMELOT BUILDER                                 │  Blue gradient
│ ═══════════════════════════════════════════════════════════════════ │
│                                                                     │
│   ┌── Blue glow ────────────────────────────────────────────────┐  │
│   │  Cleric - Albion                                            │  │
│   │  ┌─────────────────────────────────────────────────────┐   │  │
│   │  │ Smiting                                             │   │  │
│   │  │ [████████████████████████░░░░░░░░░░░░░░░] Blue fill │   │  │
│   │  └─────────────────────────────────────────────────────┘   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Points: [████████████████████░░░░░░░░░░░░░░░░░░░░░░] Blue fill    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Midgard Class Selected (Red)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ═══════════════════════════════════════════════════════════════════ │  Red accent
│                     CAMELOT BUILDER                                 │  Red gradient
│ ═══════════════════════════════════════════════════════════════════ │
│                                                                     │
│   ┌── Red glow ─────────────────────────────────────────────────┐  │
│   │  Shaman - Midgard                                           │  │
│   │  ┌─────────────────────────────────────────────────────┐   │  │
│   │  │ Subterranean                                        │   │  │
│   │  │ [████████████████████████░░░░░░░░░░░░░░░] Red fill  │   │  │
│   │  └─────────────────────────────────────────────────────┘   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Hibernia Class Selected (Green)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ═══════════════════════════════════════════════════════════════════ │  Green accent
│                     CAMELOT BUILDER                                 │  Green gradient
│ ═══════════════════════════════════════════════════════════════════ │
│                                                                     │
│   ┌── Green glow ───────────────────────────────────────────────┐  │
│   │  Druid - Hibernia                                           │  │
│   │  ┌─────────────────────────────────────────────────────┐   │  │
│   │  │ Nature                                              │   │  │
│   │  │ [████████████████████████░░░░░░░░░░░░░░░] Green fill│   │  │
│   │  └─────────────────────────────────────────────────────┘   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Accessibility Considerations

### Color Contrast

All realm colors must maintain WCAG AA contrast ratios:

| Realm | Color | On Dark BG | On Light BG |
|-------|-------|------------|-------------|
| Albion | #3b82f6 | 4.5:1 ✓ | Needs light |
| Midgard | #ef4444 | 4.6:1 ✓ | Needs dark |
| Hibernia | #22c55e | 4.8:1 ✓ | Needs dark |

### Don't Rely on Color Alone

```css
/* Ensure meaning isn't conveyed by color alone */
.realm-indicator {
  /* Color */
  color: var(--realm-color);
  /* Plus text label */
}

.realm-indicator::after {
  content: attr(data-realm);
  /* Screen reader accessible realm name */
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Instant theme changes */
  .app-header,
  .btn-primary,
  .ability-progress-fill,
  .section-card {
    transition: none;
  }
}
```

## Testing Strategy

### Visual Testing

| Test | Method | Criteria |
|------|--------|----------|
| Each realm theme | Manual | Colors apply correctly |
| Theme switching | Manual | Smooth transition |
| No class state | Manual | Gold/neutral shows |
| All components | Manual | Theme applies everywhere |

### Accessibility Testing

| Test | Tool | Target |
|------|------|--------|
| Color contrast | axe DevTools | WCAG AA |
| Focus visibility | Manual | Visible on all themes |
| Color-only info | Manual | No meaning by color alone |

### Cross-Browser Testing

| Browser | Check |
|---------|-------|
| Chrome | Transitions smooth |
| Firefox | CSS variables work |
| Safari | Gradients render |
| Edge | No issues |

## Deliverable Checklist

### CSS Variables
- [ ] Default theme variables (gold)
- [ ] Albion theme variables (blue)
- [ ] Midgard theme variables (red)
- [ ] Hibernia theme variables (green)

### Themed Elements
- [ ] Header accent/border
- [ ] Header title gradient
- [ ] Primary buttons
- [ ] Button hover states
- [ ] Progress bar fills
- [ ] Card borders/glows
- [ ] Background subtle tint
- [ ] Icon colors where appropriate

### React Integration
- [ ] App.tsx applies realm class
- [ ] Theme updates on class selection
- [ ] Smooth transitions

### Accessibility
- [ ] Contrast ratios verified
- [ ] Reduced motion support
- [ ] Color not sole indicator

### Testing
- [ ] All three realms tested
- [ ] Theme switching tested
- [ ] Cross-browser tested

## Known Issues & Future Improvements

### Current Limitations
- No user preference to disable theming
- Theme is all-or-nothing
- No custom theme support

### Future Enhancements
- User preference to disable realm theming
- Theme intensity slider
- Custom color themes
- Animated theme transitions
- Theme presets beyond realms

## Code Reference

### Complete Realm CSS Variables

```css
/* src/index.css - Complete realm theming variables */

:root {
  /* Default theme (gold) */
  --realm-color: var(--color-gold);
  --realm-color-dark: var(--color-gold-dark);
  --realm-color-light: var(--color-gold-light);
  --realm-color-glow: rgba(251, 191, 36, 0.3);
  --realm-color-subtle: rgba(251, 191, 36, 0.1);
  --realm-color-rgb: 251, 191, 36;

  /* Theme transition timing */
  --transition-theme: 0.4s ease-out;
}

/* Albion - Blue Kingdom */
.realm-albion {
  --realm-color: var(--color-albion);
  --realm-color-dark: var(--color-albion-dark);
  --realm-color-light: var(--color-albion-light);
  --realm-color-glow: rgba(59, 130, 246, 0.3);
  --realm-color-subtle: rgba(59, 130, 246, 0.1);
  --realm-color-rgb: 59, 130, 246;
}

/* Midgard - Red Warriors */
.realm-midgard {
  --realm-color: var(--color-midgard);
  --realm-color-dark: var(--color-midgard-dark);
  --realm-color-light: var(--color-midgard-light);
  --realm-color-glow: rgba(239, 68, 68, 0.3);
  --realm-color-subtle: rgba(239, 68, 68, 0.1);
  --realm-color-rgb: 239, 68, 68;
}

/* Hibernia - Green Nature */
.realm-hibernia {
  --realm-color: var(--color-hibernia);
  --realm-color-dark: var(--color-hibernia-dark);
  --realm-color-light: var(--color-hibernia-light);
  --realm-color-glow: rgba(34, 197, 94, 0.3);
  --realm-color-subtle: rgba(34, 197, 94, 0.1);
  --realm-color-rgb: 34, 197, 94;
}
```

### Complete App.tsx with Realm Class

```tsx
// src/App.tsx
import React, { useMemo } from 'react';
import { useBuild } from './hooks/useBuild';
import { RealmType } from './types';
import './App.css';

function getRealmClassName(realm?: RealmType): string {
  if (!realm) return '';
  return `realm-${realm.toLowerCase()}`;
}

function App() {
  const { build, selectedClass, /* ... */ } = useBuild();

  const realmClassName = useMemo(
    () => getRealmClassName(selectedClass?.realm),
    [selectedClass?.realm]
  );

  return (
    <div className={`app ${realmClassName}`.trim()}>
      <header className="app-header">
        <h1>Camelot Builder</h1>
        {/* ... */}
      </header>

      <main className="app-main">
        {/* ... */}
      </main>

      <aside className="app-sidebar">
        {/* ... */}
      </aside>
    </div>
  );
}

export default App;
```
