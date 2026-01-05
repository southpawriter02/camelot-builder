# AC-03: Enhanced Focus States

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | AC-03 |
| **Name** | Enhanced Focus States |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Accessibility |
| **Complexity** | Low |
| **WCAG** | 2.4.7 Focus Visible |

## Description

Implement consistent, highly visible focus indicators on all interactive elements to ensure keyboard users can always identify which element is currently focused.

## User Story

> As a keyboard user,
> I want to clearly see which element is focused,
> So that I can navigate the application without losing my place.

## Acceptance Criteria

- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators use consistent styling (gold, 3px outline)
- [ ] Focus indicators have sufficient contrast (WCAG AA: 3:1)
- [ ] Class cards show focus when focused
- [ ] Ability cards show focus when focused
- [ ] Search clear button shows focus when focused
- [ ] Focus indicators don't overlap content
- [ ] Focus works with :focus-visible (keyboard only)

## Current State Audit

### What Exists

| Element | Focus Style | Status |
|---------|-------------|--------|
| Buttons (`<button>`) | 2px gold outline | Partial |
| Links (`<a>`) | Browser default | Missing |
| Class cards (`.class-card`) | None | Missing |
| Ability cards (`.ability-card`) | None | Missing |
| Search input | Border color change | Partial |
| Search clear button | None | Missing |
| Action bar buttons | 2px gold outline | OK |

### Current CSS (index.css:198-201)

```css
button:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
```

### What's Missing

| Gap | Impact | Elements Affected |
|-----|--------|-------------------|
| No focus on class cards | Can't see focused class | `.class-card` |
| No focus on ability buttons | Can't see focused ability | `.ability-card button` |
| No focus on clear button | Can't see focused clear | `.search-filter-clear` |
| Inconsistent outline width | Visual inconsistency | Various |
| No focus on links | Can't see focused links | `<a>` tags |

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Global focus-visible enhancements |
| `src/App.css` | Component-specific focus styles |

### No New Files Required

This feature is CSS-only - no new components or hooks needed.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Focus State Hierarchy                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Global Defaults (index.css)                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ *:focus-visible {                                           │  │
│   │   outline: 3px solid var(--color-gold);                     │  │
│   │   outline-offset: 2px;                                      │  │
│   │ }                                                           │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│              ┌───────────────┼───────────────┐                     │
│              ▼               ▼               ▼                     │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     │
│   │  Interactive    │ │   Form          │ │   Custom        │     │
│   │  Elements       │ │   Controls      │ │   Components    │     │
│   │                 │ │                 │ │                 │     │
│   │  - buttons      │ │  - inputs       │ │  - .class-card  │     │
│   │  - links        │ │  - select       │ │  - .ability-card│     │
│   │  - [tabindex]   │ │  - textarea     │ │  - .skip-link   │     │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘     │
│                                                                     │
│   Component Overrides (App.css)                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ .class-card:focus-visible { /* card-specific adjustments */ }│  │
│   │ .search-filter-input:focus { /* input-specific styles */ }  │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Focus Style Specification

### Standard Focus Ring

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Focus Ring Anatomy                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│         outline-offset: 2px                                         │
│         ◄─────────────────►                                         │
│                                                                     │
│   ┌─── 3px gold outline ───┐                                       │
│   │     ┌─────────────┐    │                                       │
│   │     │             │    │                                       │
│   │     │   Element   │    │                                       │
│   │     │             │    │                                       │
│   │     └─────────────┘    │                                       │
│   └────────────────────────┘                                       │
│                                                                     │
│   Color: var(--color-gold) = #fbbf24                               │
│   Width: 3px                                                        │
│   Offset: 2px                                                       │
│   Style: solid                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Contrast Requirements (WCAG 2.4.11)

| Background | Focus Color | Contrast Ratio | Status |
|------------|-------------|----------------|--------|
| Dark (#1a1a1a) | Gold (#fbbf24) | 8.2:1 | Pass |
| Light (#ffffff) | Gold (#fbbf24) | 1.9:1 | Needs enhancement |

**Solution for light backgrounds:** Add a shadow or double outline.

```css
.element:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  /* Additional contrast for light backgrounds */
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
}
```

## CSS Implementation

### Global Styles (index.css)

```css
/* ==========================================================================
   Focus States - WCAG 2.4.7 Focus Visible
   ========================================================================== */

/**
 * Global focus-visible styles
 * Using :focus-visible to only show focus for keyboard navigation
 */

/* Default focus ring for all focusable elements */
:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
}

/* Remove default focus styles (use :focus-visible instead) */
:focus:not(:focus-visible) {
  outline: none;
}

/* Buttons - already have some focus styles, enhance them */
button:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.15);
}

/* Links */
a:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Form inputs */
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 0;
  border-color: var(--color-gold);
}

/* Elements with tabindex (custom interactive elements) */
[tabindex]:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
}
```

### Component Styles (App.css)

```css
/* ==========================================================================
   Component-Specific Focus States
   ========================================================================== */

/* Class Selector Cards */
.class-card:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.15);
  /* Prevent outline from being clipped */
  z-index: 1;
  position: relative;
}

/* Selected class card gets different treatment */
.class-card.selected:focus-visible {
  outline-color: var(--color-gold);
  box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.25);
}

/* Ability Cards */
.ability-card:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
}

/* Ability Card Buttons (add/remove rank) */
.ability-card button:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 1px;
  z-index: 1;
  position: relative;
}

/* Search Filter Input - enhance existing */
.search-filter-input:focus-visible {
  outline: none; /* Use border instead for inputs */
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
}

/* Search Clear Button */
.search-filter-clear:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 1px;
  border-radius: 50%;
}

/* Action Bar Buttons - enhance existing */
.action-bar button:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.15);
}

/* Skip Link Targets (when focused via skip link) */
#main-content:focus-visible,
#build-summary:focus-visible,
#search-filter:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: -3px; /* Inset to not extend beyond container */
}

/* Remove focus ring for mouse/touch on skip targets */
#main-content:focus:not(:focus-visible),
#build-summary:focus:not(:focus-visible),
#search-filter:focus:not(:focus-visible) {
  outline: none;
}

/* Modal close button (if modals exist from v0.2.0) */
.modal-close:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 2px;
}

/* Toast dismiss button */
.toast button:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 1px;
}
```

## Focus State Visual Examples

### Button Focus

```
Normal                          Focused
┌──────────────┐               ┌──────────────┐
│    Button    │               ║    Button    ║
└──────────────┘               └──────────────┘
                                    ▲
                               3px gold outline
                               + 2px offset
                               + subtle shadow
```

### Class Card Focus

```
Normal                          Focused
┌──────────────────┐           ╔══════════════════╗
│   ⚔️ Warrior     │           ║   ⚔️ Warrior     ║
│   Albion         │           ║   Albion         ║
└──────────────────┘           ╚══════════════════╝
                                        ▲
                                   3px gold outline
                                   with glow shadow
```

### Input Focus

```
Normal                          Focused
┌──────────────────────┐       ┌══════════════════════┐
│ Search abilities...  │       │ Search abilities...  │
└──────────────────────┘       └══════════════════════┘
                                        ▲
                               Gold border + outer glow
```

## Decision Tree

```
User interacts with element
            │
            ▼
┌───────────────────────┐
│ Was interaction via   │
│ keyboard (Tab, Enter)?│
└─────────┬─────────────┘
          │
    ┌─────┴─────┐
    │           │
   Yes          No (mouse/touch)
    │           │
    ▼           ▼
┌─────────┐  ┌─────────────────┐
│ Apply   │  │ No focus ring   │
│ :focus- │  │ (via :focus:not │
│ visible │  │ (:focus-visible))│
└────┬────┘  └─────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Is element type special? │
├──────────────────────────┤
│ • Input: border + shadow │
│ • Card: outline + glow   │
│ • Button: outline + glow │
│ • Link: outline only     │
└──────────────────────────┘
```

## Integration Points

### With Existing Styles

The new focus styles should:
1. Override existing 2px outlines with 3px
2. Add shadows for enhanced visibility
3. Maintain existing color scheme (gold)
4. Not conflict with hover states

### With Theme System

```css
:root {
  /* Focus variables for consistency */
  --focus-outline-width: 3px;
  --focus-outline-color: var(--color-gold);
  --focus-outline-offset: 2px;
  --focus-shadow: 0 0 0 6px rgba(251, 191, 36, 0.15);
}

/* Usage */
.element:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
  box-shadow: var(--focus-shadow);
}
```

### With Future High Contrast Mode (v0.9.0)

```css
/* Prepare for high contrast mode */
@media (prefers-contrast: more) {
  :focus-visible {
    outline-width: 4px;
    outline-color: #000000;
    box-shadow: 0 0 0 8px #ffffff;
  }
}
```

## Testing Strategy

### Visual Regression Tests

| Test Case | Expected Result |
|-----------|-----------------|
| Tab to button | 3px gold outline with shadow |
| Tab to class card | 3px gold outline with glow |
| Tab to search input | Gold border with outer glow |
| Tab to clear button | 3px circular gold outline |
| Tab to ability card | 3px gold outline |
| Tab to link | 3px gold outline with radius |

### Keyboard Navigation Tests

```typescript
describe('Focus states', () => {
  describe('visibility', () => {
    it('shows focus ring on keyboard navigation');
    it('hides focus ring on mouse click');
    it('shows focus ring on Tab after click');
  });

  describe('buttons', () => {
    it('action bar buttons show focus ring');
    it('ability card buttons show focus ring');
    it('search clear button shows focus ring');
  });

  describe('custom elements', () => {
    it('class cards show focus ring');
    it('ability cards show focus ring');
  });

  describe('form controls', () => {
    it('search input shows focus border');
    it('input focus has visible shadow');
  });

  describe('consistency', () => {
    it('all focus rings use same color');
    it('all focus rings use same width');
    it('all focus rings have offset');
  });
});
```

### Contrast Verification

| Element | Background | Focus Color | Ratio | Pass |
|---------|------------|-------------|-------|------|
| Button | #1a1a1a | #fbbf24 | 8.2:1 | Yes |
| Card | #2a2a2a | #fbbf24 | 6.8:1 | Yes |
| Input | #1a1a1a | #fbbf24 | 8.2:1 | Yes |
| Link | #1a1a1a | #fbbf24 | 8.2:1 | Yes |

## Deliverable Checklist

### Implementation
- [ ] Global `:focus-visible` styles in index.css
- [ ] `:focus:not(:focus-visible)` reset added
- [ ] Button focus styles enhanced (3px)
- [ ] Link focus styles added
- [ ] `.class-card` focus styles added
- [ ] `.ability-card` focus styles added
- [ ] `.search-filter-clear` focus styles added
- [ ] `.search-filter-input` focus enhanced
- [ ] Action bar button focus enhanced
- [ ] Focus shadow added for visibility
- [ ] CSS variables for focus consistency

### Testing
- [ ] Keyboard navigation verified
- [ ] Focus visible on all interactive elements
- [ ] Focus hidden on mouse click
- [ ] Contrast ratios verified
- [ ] No focus ring overlap issues

### Documentation
- [ ] CSS comments added
- [ ] Focus variable documentation

## Known Issues & Future Improvements

### Current Limitations
- No high contrast mode support (v0.9.0)
- Fixed gold color (not theme-aware beyond dark mode)
- No animation on focus (may add subtle transition)

### Future Enhancements (v0.9.0)
- AC-04: High Contrast Mode
- Focus ring animation (subtle pulse)
- Customizable focus colors
- prefers-contrast media query support

### Browser Compatibility

| Browser | :focus-visible Support |
|---------|------------------------|
| Chrome 86+ | Yes |
| Firefox 85+ | Yes |
| Safari 15.4+ | Yes |
| Edge 86+ | Yes |

**Fallback for older browsers:**
```css
/* Fallback for browsers without :focus-visible */
@supports not selector(:focus-visible) {
  :focus {
    outline: 3px solid var(--color-gold);
    outline-offset: 2px;
  }
}
```

## Code Reference

### Complete index.css Focus Styles

```css
/* ==========================================================================
   Focus States - WCAG 2.4.7 Focus Visible
   ========================================================================== */

/* CSS Custom Properties for Focus */
:root {
  --focus-outline-width: 3px;
  --focus-outline-color: var(--color-gold);
  --focus-outline-offset: 2px;
  --focus-shadow: 0 0 0 6px rgba(251, 191, 36, 0.15);
  --focus-shadow-strong: 0 0 0 6px rgba(251, 191, 36, 0.25);
}

/* Global focus-visible styles */
:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
}

/* Remove focus ring for mouse/touch interactions */
:focus:not(:focus-visible) {
  outline: none;
}

/* Buttons */
button:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
  box-shadow: var(--focus-shadow);
}

/* Links */
a:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
  border-radius: 2px;
}

/* Form Inputs */
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: none;
  border-color: var(--focus-outline-color);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
}

/* Custom Interactive Elements */
[tabindex]:focus-visible:not([tabindex="-1"]) {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
}

/* Fallback for browsers without :focus-visible */
@supports not selector(:focus-visible) {
  :focus {
    outline: 3px solid var(--color-gold);
    outline-offset: 2px;
  }
}

/* High Contrast Mode Preparation */
@media (prefers-contrast: more) {
  :focus-visible {
    outline-width: 4px;
    outline-color: currentColor;
  }
}
```

### Complete App.css Component Focus Styles

```css
/* ==========================================================================
   Component Focus States
   ========================================================================== */

/* Class Cards */
.class-card:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
  box-shadow: var(--focus-shadow);
  z-index: 1;
  position: relative;
}

.class-card.selected:focus-visible {
  box-shadow: var(--focus-shadow-strong);
}

/* Ability Cards */
.ability-card:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
}

.ability-card button:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: 1px;
  z-index: 1;
  position: relative;
}

/* Search Filter */
.search-filter-input:focus-visible {
  outline: none;
  border-color: var(--focus-outline-color);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
}

.search-filter-clear:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: 1px;
  border-radius: 50%;
}

/* Action Bar */
.action-bar button:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
  box-shadow: var(--focus-shadow);
}

/* Skip Link Targets */
#main-content:focus-visible,
#build-summary:focus-visible,
#search-filter:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: -3px;
}

#main-content:focus:not(:focus-visible),
#build-summary:focus:not(:focus-visible),
#search-filter:focus:not(:focus-visible) {
  outline: none;
}
```
