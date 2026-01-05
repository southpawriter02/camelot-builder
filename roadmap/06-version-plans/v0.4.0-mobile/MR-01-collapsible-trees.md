# MR-01: Collapsible Tree Sections

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | MR-01 |
| **Name** | Collapsible Tree Sections |
| **Status** | Planned |
| **Priority** | High |
| **Category** | Mobile/Responsive |
| **Complexity** | Medium |

## Description

Allow ability tree sections to collapse and expand, reducing scrolling on mobile devices and allowing users to focus on specific trees they're building.

## User Story

> As a mobile user building my character,
> I want to collapse ability trees I'm not currently using,
> So that I can focus on the trees I care about without excessive scrolling.

## Acceptance Criteria

- [ ] Each tree section has a collapse/expand toggle
- [ ] Clicking the toggle collapses/expands the tree content
- [ ] Collapse animation is smooth (max-height transition)
- [ ] Toggle icon rotates when collapsed
- [ ] Trees start collapsed on mobile (< 768px)
- [ ] Trees start expanded on desktop (>= 768px)
- [ ] Collapsed state persists during session
- [ ] Screen readers announce collapse state changes
- [ ] Collapse toggle is keyboard accessible

## Current State Audit

### What Exists
| Component | Current Behavior | Status |
|-----------|------------------|--------|
| AbilityTree.tsx | Renders all trees expanded | No collapse |
| Tree headers | Display name and count | No toggle |
| Tree content | Always visible | No animation |

### What's Missing
| Gap | Required Change |
|-----|-----------------|
| No collapse state | Add useState or custom hook |
| No toggle button | Add button to tree header |
| No animation | Add CSS max-height transition |
| No responsive behavior | Detect viewport for default state |

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/AbilityTree.tsx` | Add collapse state, toggle, animation |
| `src/App.css` | Add collapse animation styles |

### Files to Create (Optional)

| File | Purpose |
|------|---------|
| `src/hooks/useCollapseState.ts` | Reusable collapse state hook |
| `src/hooks/useMediaQuery.ts` | Responsive breakpoint detection |

### Interfaces

```typescript
// State for tracking collapsed trees
type CollapsedTrees = Record<string, boolean>;

// Props if extracted to separate component
interface TreeSectionProps {
  treeName: string;
  abilities: IAbility[];
  isCollapsed: boolean;
  onToggle: () => void;
  // ... existing props
}
```

### Component Enhancement

```tsx
// AbilityTree.tsx enhancement
export function AbilityTree({ abilities, build, onPurchase, onRemove }: AbilityTreeProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Initialize all trees as collapsed on mobile
  const [collapsedTrees, setCollapsedTrees] = useState<Record<string, boolean>>(() => {
    if (isMobile) {
      return Object.keys(abilitiesByTree).reduce((acc, tree) => {
        acc[tree] = true; // Start collapsed on mobile
        return acc;
      }, {} as Record<string, boolean>);
    }
    return {}; // Start expanded on desktop
  });

  const toggleTree = (treeName: string) => {
    setCollapsedTrees((prev) => ({
      ...prev,
      [treeName]: !prev[treeName],
    }));
  };

  return (
    <div className="ability-tree">
      {Object.entries(abilitiesByTree).map(([treeName, treeAbilities]) => {
        const isCollapsed = collapsedTrees[treeName] ?? false;

        return (
          <section key={treeName} className="tree-group">
            <button
              className="tree-group-header"
              onClick={() => toggleTree(treeName)}
              aria-expanded={!isCollapsed}
              aria-controls={`tree-content-${treeName}`}
            >
              <span className="tree-icon">{getTreeIcon(treeName)}</span>
              <h3 className="tree-name">{treeName}</h3>
              <span className="tree-count">({treeAbilities.length})</span>
              <span className={`tree-toggle ${isCollapsed ? 'collapsed' : ''}`}>
                ▼
              </span>
            </button>

            <div
              id={`tree-content-${treeName}`}
              className={`tree-content ${isCollapsed ? 'collapsed' : ''}`}
            >
              {treeAbilities.map((ability) => (
                <AbilityCard key={ability.id} ability={ability} {...props} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Collapsible Tree Architecture                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   AbilityTree Component                                             │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                                                              │  │
│   │   State: collapsedTrees = { healing: true, smiting: false } │  │
│   │                                                              │  │
│   │   ┌──────────────────────────────────────────────────────┐  │  │
│   │   │  Tree Section: Healing                            ▼  │  │  │
│   │   │  ─────────────────────────────────────────────────── │  │  │
│   │   │  (collapsed - content hidden)                        │  │  │
│   │   └──────────────────────────────────────────────────────┘  │  │
│   │                                                              │  │
│   │   ┌──────────────────────────────────────────────────────┐  │  │
│   │   │  Tree Section: Smiting                            ▲  │  │  │
│   │   │  ─────────────────────────────────────────────────── │  │  │
│   │   │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │  │
│   │   │  │ Ability  │ │ Ability  │ │ Ability  │            │  │  │
│   │   │  │  Card 1  │ │  Card 2  │ │  Card 3  │            │  │  │
│   │   │  └──────────┘ └──────────┘ └──────────┘            │  │  │
│   │   └──────────────────────────────────────────────────────┘  │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Click Handler Flow:                                               │
│   ┌──────────┐    ┌──────────────┐    ┌────────────────┐           │
│   │  Click   │ -> │ toggleTree() │ -> │ setState()     │           │
│   │  Header  │    │              │    │ flip collapsed │           │
│   └──────────┘    └──────────────┘    └────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Mockup

### Expanded State

```
┌─────────────────────────────────────────────────────────────┐
│ ⚔️ Smiting (5)                                          ▲  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Holy Strike                         Rank 1/3           │ │
│ │ [████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │ │
│ │                                          [+] [-]       │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Divine Fury                         Rank 0/5           │ │
│ │ [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │ │
│ │                                          [+]           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Collapsed State

```
┌─────────────────────────────────────────────────────────────┐
│ ⚔️ Smiting (5)                                          ▼  │
└─────────────────────────────────────────────────────────────┘
```

## CSS Styling

```css
/* Tree header as button */
.tree-group-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  gap: 8px;
  text-align: left;
  transition: background 0.2s;
}

.tree-group-header:hover {
  background: var(--bg-hover);
}

.tree-group-header:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
}

/* Collapse toggle icon */
.tree-toggle {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.tree-toggle.collapsed {
  transform: rotate(-90deg);
}

/* Tree content with animation */
.tree-content {
  max-height: 2000px; /* Large enough for any tree */
  overflow: hidden;
  transition: max-height 0.3s ease-out, opacity 0.2s ease;
  opacity: 1;
}

.tree-content.collapsed {
  max-height: 0;
  opacity: 0;
}

/* Border radius adjustment when collapsed */
.tree-group:has(.tree-content.collapsed) .tree-group-header {
  border-radius: 8px;
}

/* Touch-friendly header on mobile */
@media (max-width: 767px) {
  .tree-group-header {
    padding: 16px;
    min-height: 48px; /* Touch target */
  }

  .tree-toggle {
    font-size: 16px;
    padding: 8px;
  }
}
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
│ Init    │  │ Init    │
│ trees   │  │ trees   │
│collapsed│  │ expanded│
└────┬────┘  └────┬────┘
     │            │
     └──────┬─────┘
            │
            ▼
┌───────────────────────────────────────┐
│ User clicks tree header               │
├───────────────────────────────────────┤
│ 1. Call toggleTree(treeName)          │
│ 2. Flip collapsed state               │
│ 3. CSS transition animates            │
│ 4. aria-expanded updates              │
│ 5. Screen reader announces            │
└───────────────────────────────────────┘
```

## Integration Points

### With AbilityTree.tsx

```tsx
// Current structure in AbilityTree
{Object.entries(abilitiesByTree).map(([treeName, abilities]) => (
  <section key={treeName} className="tree-group">
    <div className="tree-group-header">
      {/* Currently static header */}
    </div>
    <div className="tree-content">
      {abilities.map(ability => <AbilityCard ... />)}
    </div>
  </section>
))}

// Enhanced structure
{Object.entries(abilitiesByTree).map(([treeName, abilities]) => (
  <section key={treeName} className="tree-group">
    <button
      className="tree-group-header"
      onClick={() => toggleTree(treeName)}
      aria-expanded={!collapsedTrees[treeName]}
    >
      {/* Interactive header */}
    </button>
    <div
      className={`tree-content ${collapsedTrees[treeName] ? 'collapsed' : ''}`}
    >
      {abilities.map(ability => <AbilityCard ... />)}
    </div>
  </section>
))}
```

### With useMediaQuery Hook

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

## Accessibility

### ARIA Attributes

```tsx
<button
  className="tree-group-header"
  onClick={() => toggleTree(treeName)}
  aria-expanded={!isCollapsed}
  aria-controls={`tree-content-${treeName}`}
>
  <span className="tree-name">{treeName}</span>
  <span className="sr-only">
    {isCollapsed ? 'expand section' : 'collapse section'}
  </span>
</button>

<div
  id={`tree-content-${treeName}`}
  role="region"
  aria-labelledby={`tree-header-${treeName}`}
  hidden={isCollapsed}
>
```

### Screen Reader Announcements

When collapsed: "Smiting section, collapsed, button"
When expanded: "Smiting section, expanded, button"

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus next/prev tree header |
| Enter/Space | Toggle collapse state |
| Escape | No action (keep expanded) |

## Testing Strategy

### Unit Tests

```typescript
describe('AbilityTree collapse', () => {
  describe('rendering', () => {
    it('renders all tree sections');
    it('renders toggle button in each header');
    it('has aria-expanded attribute');
    it('has aria-controls pointing to content');
  });

  describe('toggle behavior', () => {
    it('toggles collapsed state on click');
    it('applies collapsed class to content');
    it('rotates toggle icon when collapsed');
    it('updates aria-expanded on toggle');
  });

  describe('responsive behavior', () => {
    it('starts collapsed on mobile viewport');
    it('starts expanded on desktop viewport');
    it('responds to viewport changes');
  });

  describe('accessibility', () => {
    it('toggle is keyboard accessible');
    it('Enter key toggles section');
    it('Space key toggles section');
  });

  describe('animation', () => {
    it('applies transition class');
    it('content has max-height style');
  });
});
```

### Integration Tests

```typescript
describe('AbilityTree integration', () => {
  it('collapsing tree hides ability cards');
  it('expanding tree shows ability cards');
  it('multiple trees can have different states');
  it('ability purchase works when tree expanded');
});
```

## Deliverable Checklist

### Implementation
- [ ] Collapse state management added
- [ ] Toggle button in tree headers
- [ ] aria-expanded attribute updates
- [ ] aria-controls links to content
- [ ] CSS transition animation
- [ ] Icon rotation on collapse
- [ ] Mobile default collapsed
- [ ] Desktop default expanded
- [ ] useMediaQuery hook created

### Testing
- [ ] Unit tests complete
- [ ] Integration tests complete
- [ ] Keyboard navigation verified
- [ ] Screen reader tested

### Documentation
- [ ] Component JSDoc comments
- [ ] Hook documentation

## Known Issues & Future Improvements

### Current Limitations
- Collapse state not persisted to localStorage
- No "collapse all" / "expand all" buttons
- No animation for icon rotation in older browsers

### Future Enhancements
- Persist collapse state to localStorage
- Add collapse all / expand all controls
- Remember last state across sessions
- Animate ability cards staggered on expand

## Code Reference

### Complete useMediaQuery Hook

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 767px)');
```

### Complete Toggle Implementation

```typescript
// In AbilityTree.tsx
const [collapsedTrees, setCollapsedTrees] = useState<Record<string, boolean>>({});
const isMobile = useMediaQuery('(max-width: 767px)');

// Initialize based on viewport
useEffect(() => {
  if (isMobile) {
    // Collapse all on mobile
    const allCollapsed = Object.keys(abilitiesByTree).reduce((acc, tree) => {
      acc[tree] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setCollapsedTrees(allCollapsed);
  } else {
    // Expand all on desktop
    setCollapsedTrees({});
  }
}, [isMobile, abilitiesByTree]);

const toggleTree = useCallback((treeName: string) => {
  setCollapsedTrees((prev) => ({
    ...prev,
    [treeName]: !prev[treeName],
  }));
}, []);
```
