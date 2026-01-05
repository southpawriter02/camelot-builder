# AC-02: Skip Navigation Links

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | AC-02 |
| **Name** | Skip Navigation Links |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Accessibility |
| **Complexity** | Low |
| **WCAG** | 2.4.1 Bypass Blocks |

## Description

Implement skip navigation links that allow keyboard and screen reader users to bypass repetitive content (like headers and navigation) and jump directly to main content areas.

## User Story

> As a keyboard user,
> I want to skip past the header and navigation,
> So that I can quickly reach the main content without pressing Tab dozens of times.

## Acceptance Criteria

- [ ] Skip links appear when focused via Tab key
- [ ] "Skip to main content" jumps to ability tree area
- [ ] "Skip to build summary" jumps to sidebar
- [ ] "Skip to search" jumps to search input
- [ ] Skip links are visually hidden until focused
- [ ] Skip links are announced by screen readers
- [ ] Focus moves to target after activation
- [ ] Target elements receive visible focus

## Current State Audit

### What Exists
| Element | ID | Status |
|---------|-----|--------|
| Main panel | class="main-panel" | No ID |
| Sidebar | class="sidebar" | No ID |
| Search input | ref in SearchFilter | No ID |
| Header | class="app-header" | No skip link |

### What's Missing
| Gap | Impact |
|-----|--------|
| No skip links | Keyboard users must tab through entire header |
| No target IDs | Skip links have nowhere to jump |
| No tabindex on targets | Focus may not move correctly |

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/SkipLinks.tsx` | Skip navigation component |
| `src/components/SkipLinks.css` | Skip link styling |
| `src/components/SkipLinks.test.tsx` | Unit tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add SkipLinks component, add IDs to targets |
| `src/components/SearchFilter.tsx` | Add id to input |

### Interfaces

```typescript
// src/components/SkipLinks.tsx
interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}
```

### Component Structure

```tsx
// SkipLinks.tsx
const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#build-summary', label: 'Skip to build summary' },
  { href: '#search-filter', label: 'Skip to search' },
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="skip-links" aria-label="Skip links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleClick(e, link.href)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Skip Links Architecture                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Document Flow (Tab Order)                                         │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 1. Skip Links (first focusable elements)                    │  │
│   │    ┌────────────────────────────────────────────────────┐   │  │
│   │    │ [Skip to main content] [Skip to summary] [Search]  │   │  │
│   │    └────────────────────────────────────────────────────┘   │  │
│   │                          │                                   │  │
│   │              (hidden until focused)                          │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 2. Header                                                    │  │
│   │    Logo, realm selector, action buttons                     │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 3. Main Content (id="main-content" tabindex="-1")          │  │
│   │    ┌────────────────────┐  ┌────────────────────────────┐  │  │
│   │    │ Search Filter      │  │ Ability Tree               │  │  │
│   │    │ (id="search-filter"│  │                            │  │  │
│   │    │  tabindex="-1")    │  │                            │  │  │
│   │    └────────────────────┘  └────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 4. Sidebar (id="build-summary" tabindex="-1")              │  │
│   │    Build Summary, Stats, Actions                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Mockup

### Skip Links (visible on focus)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │  [Skip to main content]  [Skip to build summary]  [Skip to search]│
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ╔════════════════════════════════════════════════════════════════╗  │
│ ║                        Header                                  ║  │
│ ╠════════════════════════════════════════════════════════════════╣  │
│ ║                                                                ║  │
│ ║                       Main Content                             ║  │
│ ║                                                                ║  │
│ ╚════════════════════════════════════════════════════════════════╝  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Skip Links (hidden - default state)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════════╗  │
│ ║                        Header                                  ║  │
│ ╠════════════════════════════════════════════════════════════════╣  │
│ ║                                                                ║  │
│ ║                       Main Content                             ║  │
│ ║                                                                ║  │
│ ╚════════════════════════════════════════════════════════════════╝  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Decision Tree

```
User presses Tab
        │
        ▼
┌───────────────────┐
│ Is first Tab?     │
└─────────┬─────────┘
          │ yes
          ▼
┌───────────────────┐
│ Focus skip link   │
│ (becomes visible) │
└─────────┬─────────┘
          │
          ▼
┌───────────────────────────────────────┐
│ User action                           │
├───────────────────────────────────────┤
│ • Tab → Next skip link                │
│ • Enter → Navigate to target          │
│ • Shift+Tab → Previous element        │
│ • Escape → Continue normal tab order  │
└─────────┬─────────────────────────────┘
          │ Enter pressed
          ▼
┌───────────────────┐
│ Prevent default   │
│ scroll behavior   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Query target      │
│ element by ID     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Call target.focus()│
│ and scrollIntoView│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Target receives   │
│ focus ring        │
└───────────────────┘
```

## Integration Points

### With App.tsx

```tsx
// App.tsx
import { SkipLinks } from './components/SkipLinks';

function App() {
  return (
    <>
      <SkipLinks />

      <header className="app-header">
        {/* header content */}
      </header>

      <main id="main-content" className="main-panel" tabIndex={-1}>
        <SearchFilter id="search-filter" />
        <AbilityTree />
      </main>

      <aside id="build-summary" className="sidebar" tabIndex={-1}>
        <BuildSummary />
      </aside>
    </>
  );
}
```

### With SearchFilter

```tsx
// SearchFilter.tsx
interface SearchFilterProps {
  id?: string;
  // ... existing props
}

export function SearchFilter({ id, ...props }: SearchFilterProps) {
  return (
    <div id={id} className="search-filter" tabIndex={-1}>
      <input
        ref={inputRef}
        type="text"
        // ...
      />
    </div>
  );
}
```

## CSS Styling

```css
/* SkipLinks.css */

.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  gap: 8px;
  padding: 8px;
}

.skip-link {
  /* Visually hidden by default */
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;

  /* Styling */
  padding: 12px 16px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--color-gold);
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.skip-link:focus {
  /* Reveal when focused */
  position: static;
  width: auto;
  height: auto;
  overflow: visible;

  /* Focus styling */
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.skip-link:hover {
  background: var(--bg-secondary);
}

/* Target element focus styling */
#main-content:focus,
#build-summary:focus,
#search-filter:focus {
  outline: 3px solid var(--color-gold);
  outline-offset: -3px;
}

/* Remove default focus ring for non-keyboard focus */
#main-content:focus:not(:focus-visible),
#build-summary:focus:not(:focus-visible),
#search-filter:focus:not(:focus-visible) {
  outline: none;
}
```

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next skip link |
| Shift+Tab | Move to previous element |
| Enter | Navigate to target |
| Space | Navigate to target (same as Enter) |

### Screen Reader Behavior

1. User tabs into page
2. Screen reader announces: "Skip links navigation"
3. First link focused: "Skip to main content, link"
4. User presses Enter
5. Focus moves to main content
6. Screen reader announces: "Main content, region"

### Focus Management

```tsx
const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const target = document.querySelector(href);

  if (target instanceof HTMLElement) {
    // Set tabindex if not already focusable
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    // Move focus to target
    target.focus();

    // Smooth scroll into view
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
```

## Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                     Skip Link Navigation Flow                      │
└────────────────────────────────────────────────────────────────────┘

  User            Browser           Skip Link        Target Element
   │                 │                  │                  │
   │ Tab (first)     │                  │                  │
   ├────────────────►│                  │                  │
   │                 │                  │                  │
   │                 │ focus()          │                  │
   │                 ├─────────────────►│                  │
   │                 │                  │                  │
   │◄────────────────┼──────────────────┤                  │
   │                 │   Link visible   │                  │
   │                 │                  │                  │
   │ Enter           │                  │                  │
   ├────────────────►│                  │                  │
   │                 │                  │                  │
   │                 │ click handler    │                  │
   │                 ├─────────────────►│                  │
   │                 │                  │                  │
   │                 │                  │ querySelector()  │
   │                 │                  ├─────────────────►│
   │                 │                  │                  │
   │                 │                  │ focus()          │
   │                 │                  ├─────────────────►│
   │                 │                  │                  │
   │                 │                  │ scrollIntoView() │
   │                 │                  ├─────────────────►│
   │                 │                  │                  │
   │◄────────────────┼──────────────────┼──────────────────┤
   │                 │        Target focused & visible     │
   │                 │                  │                  │
```

## Testing Strategy

### Unit Tests (SkipLinks.test.tsx)

```typescript
describe('SkipLinks', () => {
  describe('rendering', () => {
    it('renders all default skip links');
    it('renders custom links when provided');
    it('has nav role with aria-label');
    it('links have correct href attributes');
  });

  describe('visibility', () => {
    it('links are visually hidden by default');
    it('links become visible on focus');
    it('links hide when focus leaves');
  });

  describe('navigation', () => {
    it('prevents default link behavior');
    it('focuses target element on click');
    it('scrolls target into view');
    it('handles missing target gracefully');
  });

  describe('keyboard', () => {
    it('Enter activates link');
    it('Space activates link');
    it('Tab moves to next link');
  });

  describe('accessibility', () => {
    it('has nav landmark');
    it('has descriptive aria-label');
    it('links are keyboard accessible');
  });
});
```

### Integration Tests

```typescript
describe('Skip links integration', () => {
  it('first Tab focuses skip link');
  it('clicking "Skip to main content" focuses main panel');
  it('clicking "Skip to build summary" focuses sidebar');
  it('clicking "Skip to search" focuses search input');
  it('targets have tabindex for focus management');
});
```

## Deliverable Checklist

### Implementation
- [ ] `SkipLinks` component created
- [ ] `SkipLinks.css` styling complete
- [ ] Skip links visually hidden until focused
- [ ] Target IDs added to App.tsx
- [ ] tabindex="-1" on target elements
- [ ] Focus moves to target on activation
- [ ] Smooth scroll behavior

### Testing
- [ ] `SkipLinks.test.tsx` complete
- [ ] Integration tests complete
- [ ] Keyboard navigation verified
- [ ] Screen reader testing complete

### Documentation
- [ ] Component JSDoc comments
- [ ] Usage examples in code

## Known Issues & Future Improvements

### Current Limitations
- Fixed skip link targets (not configurable per page)
- No skip link for footer
- No return-to-top link

### Future Enhancements
- Dynamic skip links based on page content
- Return to previous position after skip
- Skip link for ability tree sections
- Configurable skip link order

## Code Reference

### Complete SkipLinks Component

```typescript
// src/components/SkipLinks.tsx
import React from 'react';
import './SkipLinks.css';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#build-summary', label: 'Skip to build summary' },
  { href: '#search-filter', label: 'Skip to search' },
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);

    if (target instanceof HTMLElement) {
      // Ensure target is focusable
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }

      // Move focus and scroll
      target.focus();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="skip-links" aria-label="Skip links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleClick(e, link.href)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
```

### Complete CSS

```css
/* src/components/SkipLinks.css */

.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  gap: 8px;
  padding: 8px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;

  padding: 12px 16px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--color-gold);
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: box-shadow 0.2s;
}

.skip-link:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;

  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.skip-link:hover {
  background: var(--bg-secondary);
}
```
