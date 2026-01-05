# VD-01: Custom SVG Icons

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | VD-01 |
| **Name** | Custom SVG Icons |
| **Status** | Planned |
| **Priority** | High |
| **Category** | Visual Design |
| **Complexity** | Medium |

## Description

Replace all emoji-based icons throughout the application with custom medieval-themed SVG icons. This creates a more polished, professional appearance and enables proper styling (color, size) via CSS.

## User Story

> As a user of Camelot Builder,
> I want to see custom medieval-themed icons,
> So that the application feels more immersive and professional.

## Acceptance Criteria

- [ ] All realm icons (Albion, Midgard, Hibernia) use custom SVG crests
- [ ] All ability tree icons use custom SVG symbols
- [ ] All action bar icons use custom SVG icons
- [ ] All status icons use consistent custom SVG set
- [ ] Icons scale appropriately at different sizes
- [ ] Icons inherit color from CSS (`currentColor`)
- [ ] Icons have appropriate accessible labels
- [ ] No visual regression from emoji to SVG transition

## Current State Audit

### What Exists
| Location | Current Icons | Type |
|----------|---------------|------|
| ClassSelector.tsx | 🏰 ⚔️ 🍀 | Emoji |
| AbilityTree.tsx | ✨ 💚 ⚡ 🌑 👻 🌿 🌸 📜 | Emoji |
| BuildSummary.tsx | 🏰 ⚔️ 🍀 | Emoji |
| ActionBar.tsx | ↶ ↷ 🔗 🔄 | Unicode/Emoji |
| SearchFilter.tsx | 🔍 ✕ | Emoji/Unicode |
| Toast.tsx | ✓ ✕ ℹ | Unicode |

### Current Icon Mappings

```typescript
// ClassSelector.tsx & BuildSummary.tsx (lines 10-14, 15-19)
const REALM_ICONS: Record<RealmType, string> = {
  Albion: '🏰',
  Midgard: '⚔️',
  Hibernia: '🍀',
};

// AbilityTree.tsx (lines 13-22)
const TREE_ICONS: Record<string, string> = {
  enhancements: '✨',
  healing: '💚',
  smiting: '⚡',
  subterranean: '🌑',
  spirit: '👻',
  nature: '🌿',
  nurture: '🌸',
  default: '📜',
};
```

### What's Missing
| Gap | Impact |
|-----|--------|
| No SVG icon files | Cannot replace emoji |
| No Icon component | No reusable icon system |
| No icon color control | Emoji colors are fixed |
| No icon size consistency | Emoji render differently |

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/assets/icons/realms/albion.svg` | Albion realm crest |
| `src/assets/icons/realms/midgard.svg` | Midgard realm crest |
| `src/assets/icons/realms/hibernia.svg` | Hibernia realm crest |
| `src/assets/icons/trees/*.svg` | 8 ability tree icons |
| `src/assets/icons/actions/*.svg` | 8 action icons |
| `src/assets/icons/status/*.svg` | 6 status icons |
| `src/components/Icon.tsx` | Reusable icon component |
| `src/components/Icon.css` | Icon styling |
| `src/components/Icon.test.tsx` | Icon component tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/ClassSelector.tsx` | Replace REALM_ICONS with Icon component |
| `src/components/AbilityTree.tsx` | Replace TREE_ICONS with Icon component |
| `src/components/BuildSummary.tsx` | Replace REALM_ICONS with Icon component |
| `src/components/ActionBar.tsx` | Replace action icons with Icon component |
| `src/components/SearchFilter.tsx` | Replace search/clear icons |
| `src/components/Toast.tsx` | Replace status icons |

### Directory Structure

```
src/assets/icons/
├── realms/
│   ├── albion.svg       # Blue castle/shield crest
│   ├── midgard.svg      # Red crossed swords crest
│   └── hibernia.svg     # Green clover/Celtic crest
├── trees/
│   ├── enhancements.svg # Sparkles/stars
│   ├── healing.svg      # Heart with cross
│   ├── smiting.svg      # Lightning bolt
│   ├── subterranean.svg # Moon/cave
│   ├── spirit.svg       # Ghost/wisp
│   ├── nature.svg       # Leaf/plant
│   ├── nurture.svg      # Flower/bloom
│   └── default.svg      # Scroll/generic
├── actions/
│   ├── undo.svg         # Curved arrow left
│   ├── redo.svg         # Curved arrow right
│   ├── share.svg        # Link chain
│   ├── reset.svg        # Circular arrows
│   ├── search.svg       # Magnifying glass
│   ├── clear.svg        # X in circle
│   ├── add.svg          # Plus sign
│   └── remove.svg       # Minus sign
└── status/
    ├── success.svg      # Checkmark
    ├── error.svg        # X mark
    ├── warning.svg      # Triangle with !
    ├── info.svg         # Circle with i
    ├── locked.svg       # Padlock closed
    └── unlocked.svg     # Padlock open
```

### Interfaces

```typescript
// src/components/Icon.tsx
export type IconName =
  // Realms
  | 'realm-albion'
  | 'realm-midgard'
  | 'realm-hibernia'
  // Trees
  | 'tree-enhancements'
  | 'tree-healing'
  | 'tree-smiting'
  | 'tree-subterranean'
  | 'tree-spirit'
  | 'tree-nature'
  | 'tree-nurture'
  | 'tree-default'
  // Actions
  | 'action-undo'
  | 'action-redo'
  | 'action-share'
  | 'action-reset'
  | 'action-search'
  | 'action-clear'
  | 'action-add'
  | 'action-remove'
  // Status
  | 'status-success'
  | 'status-error'
  | 'status-warning'
  | 'status-info'
  | 'status-locked'
  | 'status-unlocked';

export interface IconProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
```

### Component Implementation

```tsx
// src/components/Icon.tsx
import React from 'react';
import './Icon.css';

// Import all SVG icons as React components
import { ReactComponent as AlbionIcon } from '../assets/icons/realms/albion.svg';
import { ReactComponent as MidgardIcon } from '../assets/icons/realms/midgard.svg';
import { ReactComponent as HiberniaIcon } from '../assets/icons/realms/hibernia.svg';
// ... import all other icons

const iconMap: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'realm-albion': AlbionIcon,
  'realm-midgard': MidgardIcon,
  'realm-hibernia': HiberniaIcon,
  // ... map all icons
};

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export function Icon({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const IconComponent = iconMap[name];
  const pixelSize = sizeMap[size];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={`icon icon-${size} ${className}`}
      width={pixelSize}
      height={pixelSize}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    />
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SVG Icon Architecture                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   src/assets/icons/                                                 │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  realms/          trees/          actions/       status/    │  │
│   │  ├── albion.svg   ├── healing.svg ├── undo.svg   ├── ✓.svg │  │
│   │  ├── midgard.svg  ├── smiting.svg ├── redo.svg   ├── ✕.svg │  │
│   │  └── hibernia.svg └── ...         └── ...        └── ...   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  Icon Component (src/components/Icon.tsx)                    │  │
│   │  ┌───────────────────────────────────────────────────────┐  │  │
│   │  │  Props: name, size, className, aria-label             │  │  │
│   │  │                                                        │  │  │
│   │  │  <Icon name="realm-albion" size="lg" />               │  │  │
│   │  │        ↓                                               │  │  │
│   │  │  Renders: <svg class="icon icon-lg" ...>              │  │  │
│   │  └───────────────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│           ┌───────────────┼───────────────┬───────────────┐        │
│           ▼               ▼               ▼               ▼        │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│   │ClassSelector│ │ AbilityTree │ │BuildSummary │ │  ActionBar  │ │
│   │             │ │             │ │             │ │             │ │
│   │ <Icon       │ │ <Icon       │ │ <Icon       │ │ <Icon       │ │
│   │  name=      │ │  name=      │ │  name=      │ │  name=      │ │
│   │  "realm-*"  │ │  "tree-*"   │ │  "realm-*"  │ │  "action-*" │ │
│   │ />          │ │ />          │ │ />          │ │ />          │ │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Design Specifications

### SVG Structure

Each SVG icon should follow this template:

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Icon paths here -->
</svg>
```

### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| sm | 16x16 | Inline with text |
| md | 24x24 | Default, buttons |
| lg | 32x32 | Section headers |
| xl | 48x48 | Realm crests, featured |

### Color Usage

Icons use `currentColor` to inherit from parent:

```css
/* Parent sets color */
.class-card { color: var(--color-albion); }
.class-card .icon { /* Inherits blue */ }

/* Direct color override */
.icon.success { color: var(--color-success); }
.icon.error { color: var(--color-danger); }
```

### Design Style Guidelines

| Property | Guideline |
|----------|-----------|
| Style | Line art (stroke-based) |
| Stroke width | 1.5-2px at 24x24 |
| Corners | Rounded (stroke-linecap: round) |
| Fill | None (outline only) or subtle fill |
| Complexity | Simple, recognizable at small sizes |
| Theme | Medieval fantasy appropriate |

## Icon Designs

### Realm Icons (48x48, detailed)

| Realm | Description | Key Elements |
|-------|-------------|--------------|
| Albion | Castle shield | Castle towers, shield shape, blue |
| Midgard | Warrior crest | Crossed swords, round shield, red |
| Hibernia | Celtic design | Four-leaf clover, Celtic knots, green |

### Tree Icons (24x24, symbolic)

| Tree | Description | Key Elements |
|------|-------------|--------------|
| Enhancements | Magic sparkles | 3-4 stars/sparkles |
| Healing | Heart with cross | Heart shape, small cross |
| Smiting | Lightning bolt | Jagged lightning shape |
| Subterranean | Moon/cave | Crescent moon, cave entrance |
| Spirit | Ghost wisp | Ethereal flame/wisp shape |
| Nature | Leaf | Single detailed leaf |
| Nurture | Flower | Simple flower blossom |
| Default | Scroll | Rolled scroll/parchment |

### Action Icons (24x24, functional)

| Action | Description | Key Elements |
|--------|-------------|--------------|
| Undo | Curved arrow | Left-pointing curved arrow |
| Redo | Curved arrow | Right-pointing curved arrow |
| Share | Link | Chain link or share symbol |
| Reset | Circular arrows | Two arrows in circle |
| Search | Magnifying glass | Circle with handle |
| Clear | X in circle | Circle with X inside |
| Add | Plus | Plus sign |
| Remove | Minus | Minus sign |

### Status Icons (24x24, clear meaning)

| Status | Description | Key Elements |
|--------|-------------|--------------|
| Success | Checkmark | Check in circle |
| Error | X mark | X in circle |
| Warning | Alert | Triangle with exclamation |
| Info | Information | Circle with "i" |
| Locked | Padlock | Closed padlock |
| Unlocked | Padlock open | Open padlock |

## CSS Styling

```css
/* src/components/Icon.css */

/* Base icon styles */
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  color: currentColor;
  transition: color var(--transition-fast);
}

/* Size variants */
.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

.icon-lg {
  width: 32px;
  height: 32px;
}

.icon-xl {
  width: 48px;
  height: 48px;
}

/* Realm-specific colors (when not inheriting) */
.icon.realm-albion {
  color: var(--color-albion);
}

.icon.realm-midgard {
  color: var(--color-midgard);
}

.icon.realm-hibernia {
  color: var(--color-hibernia);
}

/* Status colors */
.icon.status-success {
  color: var(--color-success);
}

.icon.status-error {
  color: var(--color-danger);
}

.icon.status-warning {
  color: var(--color-warning);
}

.icon.status-info {
  color: var(--color-info);
}

/* Interactive states */
button .icon,
a .icon {
  pointer-events: none;
}

/* Animation for loading/processing */
.icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## Integration Points

### With ClassSelector

```tsx
// Before
const REALM_ICONS: Record<RealmType, string> = {
  Albion: '🏰',
  Midgard: '⚔️',
  Hibernia: '🍀',
};

<span className="class-realm-icon">{REALM_ICONS[cls.realm]}</span>

// After
import { Icon } from './Icon';

const REALM_ICON_NAMES: Record<RealmType, IconName> = {
  Albion: 'realm-albion',
  Midgard: 'realm-midgard',
  Hibernia: 'realm-hibernia',
};

<Icon
  name={REALM_ICON_NAMES[cls.realm]}
  size="lg"
  aria-label={`${cls.realm} realm`}
/>
```

### With AbilityTree

```tsx
// Before
const TREE_ICONS: Record<string, string> = {
  enhancements: '✨',
  healing: '💚',
  // ...
};

<span className="tree-icon">{TREE_ICONS[treeName] || TREE_ICONS.default}</span>

// After
const getTreeIconName = (treeName: string): IconName => {
  const iconMap: Record<string, IconName> = {
    enhancements: 'tree-enhancements',
    healing: 'tree-healing',
    smiting: 'tree-smiting',
    subterranean: 'tree-subterranean',
    spirit: 'tree-spirit',
    nature: 'tree-nature',
    nurture: 'tree-nurture',
  };
  return iconMap[treeName] || 'tree-default';
};

<Icon
  name={getTreeIconName(treeName)}
  size="md"
  aria-hidden="true"
/>
```

### With ActionBar

```tsx
// Before
<button>↶ Undo</button>
<button>↷ Redo</button>

// After
<button aria-label="Undo">
  <Icon name="action-undo" size="md" aria-hidden="true" />
  <span className="button-label">Undo</span>
</button>
<button aria-label="Redo">
  <Icon name="action-redo" size="md" aria-hidden="true" />
  <span className="button-label">Redo</span>
</button>
```

## Accessibility

### ARIA Labels

```tsx
// Decorative icons (next to text)
<Icon name="tree-healing" aria-hidden="true" />
<span>Healing</span>

// Meaningful icons (standalone)
<Icon name="status-warning" aria-label="Warning" />

// Icons in buttons (button has label)
<button aria-label="Undo last action">
  <Icon name="action-undo" aria-hidden="true" />
</button>
```

### Screen Reader Considerations

| Context | Approach |
|---------|----------|
| Icon with visible text | `aria-hidden="true"` on icon |
| Icon only (meaning conveyed) | `aria-label` on icon |
| Icon in labeled button | `aria-hidden="true"`, label on button |
| Decorative icon | `aria-hidden="true"` |

## Testing Strategy

### Unit Tests (Icon.test.tsx)

```typescript
describe('Icon', () => {
  describe('rendering', () => {
    it('renders SVG for valid icon name');
    it('returns null for invalid icon name');
    it('applies correct size class');
    it('applies additional className');
  });

  describe('accessibility', () => {
    it('sets aria-hidden when no label provided');
    it('sets aria-label when provided');
    it('sets role="img" when aria-label provided');
  });

  describe('sizing', () => {
    it('renders at 16px for sm size');
    it('renders at 24px for md size');
    it('renders at 32px for lg size');
    it('renders at 48px for xl size');
  });

  describe('color inheritance', () => {
    it('inherits color from parent element');
    it('applies realm-specific color class');
    it('applies status-specific color class');
  });
});
```

### Visual Testing

| Test | Method | Criteria |
|------|--------|----------|
| All icons render | Manual | Each icon displays correctly |
| Size variants | Manual | All 4 sizes work |
| Color inheritance | Manual | Icons pick up parent color |
| Cross-browser | Manual | Chrome, Firefox, Safari |

## Deliverable Checklist

### Assets
- [ ] 3 realm icons (albion, midgard, hibernia)
- [ ] 8 tree icons (enhancements, healing, smiting, subterranean, spirit, nature, nurture, default)
- [ ] 8 action icons (undo, redo, share, reset, search, clear, add, remove)
- [ ] 6 status icons (success, error, warning, info, locked, unlocked)
- [ ] All SVGs optimized (SVGO)

### Component
- [ ] Icon.tsx component created
- [ ] Icon.css styles created
- [ ] IconName type exported
- [ ] All icons imported and mapped

### Integration
- [ ] ClassSelector uses Icon component
- [ ] AbilityTree uses Icon component
- [ ] BuildSummary uses Icon component
- [ ] ActionBar uses Icon component
- [ ] SearchFilter uses Icon component
- [ ] Toast uses Icon component

### Testing
- [ ] Unit tests complete
- [ ] Visual testing complete
- [ ] Accessibility verified

## Known Issues & Future Improvements

### Current Limitations
- No animated icons
- No multi-color icons (single currentColor)
- No icon search/preview tool

### Future Enhancements
- Icon animation on hover/click
- Two-tone icon variants
- Icon sprite sheet for performance
- Storybook icon gallery
- Additional icon sets (class-specific)

## Code Reference

### Example SVG (Healing Tree)

```xml
<!-- src/assets/icons/trees/healing.svg -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Heart shape -->
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  <!-- Cross inside -->
  <line x1="12" y1="8" x2="12" y2="14" />
  <line x1="9" y1="11" x2="15" y2="11" />
</svg>
```

### Vite SVG Import Configuration

```typescript
// vite.config.ts (if using SVGR)
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
});
```

### Alternative: Inline SVG Approach

```tsx
// If not using SVGR, inline SVGs directly
const icons: Record<IconName, React.ReactNode> = {
  'tree-healing': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67..." />
    </svg>
  ),
  // ... other icons
};
```
