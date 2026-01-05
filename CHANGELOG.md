# Changelog

All notable changes to Camelot Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### v0.2.0 "Visibility" Features (In Progress)

- **IH-01: Ability Detail Modal** - Click any ability card to view detailed information
  - Modal displays ability name, tree, and current rank indicator
  - Shows all ranks with costs, descriptions, and stat bonuses
  - Displays prerequisites when applicable
  - Fully accessible with dialog role, aria-modal, aria-labelledby
  - Focus trap keeps keyboard navigation within modal
  - Closes via ESC key, clicking outside, or close buttons
  - Body scroll is locked when modal is open
  - New files:
    - `src/hooks/useModal.ts` - Generic modal state hook with focus management
    - `src/components/AbilityModal.tsx` - Modal component
    - `src/components/AbilityModal.css` - Modal styling
  - Modified files:
    - `src/components/AbilityTree.tsx` - Added `onAbilityClick` prop
    - `src/App.tsx` - Integrated modal state and rendering
  - Tests: 36 new tests (12 for useModal hook, 24 for AbilityModal component)

#### v0.5.0 "Style" Planning Documentation

- Created comprehensive planning documentation for visual polish release:
  - `roadmap/06-version-plans/v0.5.0-style/README.md` - Release overview
  - `roadmap/06-version-plans/v0.5.0-style/VD-01-custom-svg-icons.md` - Medieval-themed SVG icons
  - `roadmap/06-version-plans/v0.5.0-style/VD-02-background-textures.md` - Parchment/stone textures
  - `roadmap/06-version-plans/v0.5.0-style/VD-03-custom-medieval-font.md` - Cinzel font loading
  - `roadmap/06-version-plans/v0.5.0-style/VD-06-realm-specific-themes.md` - Pervasive realm colors

### Fixed

- Fixed TypeScript import in `SearchFilter.test.tsx` (type-only import for `SearchFilterRef`)

---

## [0.1.0] - Foundation (Implemented)

### Added

#### Core Build System

- **Build Class** (`src/core/build.ts`)
  - Immutable build state management
  - Ability purchase and removal
  - Point tracking and calculation
  - Class selection and validation

- **Build Validation** (`src/core/validator.ts`)
  - Prerequisite checking
  - Point budget validation
  - Class-specific ability tree filtering

#### FX-01: Build Persistence

- **Local Storage** (`src/core/storage.ts`)
  - Automatic save on build changes
  - Load on application start
  - Graceful handling of corrupted data
  - Tests: 16 tests for storage functionality

#### FX-02: Build Sharing

- **URL Encoding/Decoding** (`src/core/sharing.ts`)
  - Base64 encoded build state in URL
  - Share links that restore full build
  - Backward-compatible URL parsing
  - Tests: 32 tests for sharing functionality

#### FX-03: Undo/Redo History

- **History Management** (`src/core/history.ts`)
  - Unlimited undo/redo stack
  - Immutable state snapshots
  - Reset functionality
  - Tests: 42 tests for history management

#### FX-04: Bonus Aggregation

- **Stats System** (`src/core/stats.ts`)
  - Aggregate stat bonuses from all purchased abilities
  - Support for all stat types (strength, constitution, dexterity, etc.)
  - Tests: 22 tests for stats aggregation

- **Stats Display** (`src/components/StatsDisplay.tsx`)
  - Visual display of aggregated stat bonuses
  - Integration with BuildSummary

#### FX-05: Ability Search/Filter

- **Search Filter** (`src/components/SearchFilter.tsx`)
  - Real-time ability filtering by name or tree
  - Result count display
  - Clear search functionality
  - Keyboard shortcut (`/`) to focus
  - Tests: 18 tests for search functionality

#### FX-06: Keyboard Shortcuts

- **Keyboard Shortcuts Hook** (`src/hooks/useKeyboardShortcuts.ts`)
  - `Ctrl+Z` - Undo
  - `Ctrl+Shift+Z` - Redo
  - `/` - Focus search
  - `S` - Share build
  - `R` - Reset build
  - Tests: 41 tests for keyboard shortcuts

#### FX-07: Cost Calculator

- **Build Summary** (`src/components/BuildSummary.tsx`)
  - Point budget display (spent/total)
  - Remaining points calculation
  - Over-budget warning
  - Visual progress bar
  - Tests: 24 tests for build summary

#### UI Components

- **Class Selector** (`src/components/ClassSelector.tsx`)
  - Realm-grouped class selection
  - Visual realm indicators (Albion, Midgard, Hibernia)
  - Selected class highlighting

- **Ability Tree** (`src/components/AbilityTree.tsx`)
  - Tree-grouped ability display
  - Purchase/remove buttons
  - Rank progress indicators
  - Prerequisite warnings
  - Right-click to remove ranks

- **Action Bar** (`src/components/ActionBar.tsx`)
  - Undo/Redo buttons with count badges
  - Share button
  - Reset button

- **Toast Notifications** (`src/components/Toast.tsx`)
  - Success, error, and info variants
  - Auto-dismiss with configurable duration
  - Manual dismiss option

#### Data

- **Class Data** (`src/data/classes.json`)
  - All DAoC classes by realm
  - Realm ability tree assignments

- **Ability Data** (`src/data/abilities.json`)
  - Realm abilities with ranks
  - Costs and descriptions
  - Prerequisites
  - Stat bonuses

#### Styling

- **CSS Variables** (`src/index.css`)
  - Comprehensive color system
  - Realm colors (Albion blue, Midgard red, Hibernia green)
  - Typography scale
  - Spacing scale
  - Animation tokens

- **App Styles** (`src/App.css`)
  - Medieval fantasy theme
  - Dark mode as default
  - Card-based layout
  - Responsive grid

### Technical

- React 18 with TypeScript
- Vite build system
- Vitest for testing
- CSS custom properties for theming
- localStorage for persistence
- URL-based sharing

---

## Version Roadmap

### Planned Releases

| Version | Codename | Theme | Status |
|---------|----------|-------|--------|
| 0.1.0 | Foundation | Core Stability | **Complete** |
| 0.2.0 | Visibility | Information & Feedback | **In Progress** |
| 0.3.0 | Access | Accessibility | Planned |
| 0.4.0 | Mobile | Mobile Responsiveness | Planned |
| 0.5.0 | Style | Visual Polish | Planned |

### v0.2.0 "Visibility" Features

| ID | Feature | Status |
|----|---------|--------|
| IH-01 | Ability Detail Modal | **Complete** |
| SM-01 | Loading States | Planned |
| SM-02 | Toast Notifications Enhancement | Planned |
| SM-03 | Confirmation Dialogs | Planned |

### v0.3.0 "Access" Features (Planned)

| ID | Feature | Status |
|----|---------|--------|
| AC-01 | ARIA Live Regions | Planned |
| AC-02 | Skip Navigation | Planned |
| AC-03 | Enhanced Focus States | Planned |

### v0.4.0 "Mobile" Features (Planned)

| ID | Feature | Status |
|----|---------|--------|
| MR-01 | Collapsible Trees | Planned |
| MR-02 | Swipe Gestures | Planned |
| MR-03 | Bottom Nav Bar | Planned |

### v0.5.0 "Style" Features (Planned)

| ID | Feature | Status |
|----|---------|--------|
| VD-01 | Custom SVG Icons | Planned |
| VD-02 | Background Textures | Planned |
| VD-03 | Custom Medieval Font | Planned |
| VD-06 | Realm-specific Themes | Planned |

---

## Test Coverage

| Category | Tests |
|----------|-------|
| Core (build, history, sharing, storage, stats) | 132 |
| Hooks (useKeyboardShortcuts, useModal) | 53 |
| Components (BuildSummary, SearchFilter, AbilityModal) | 66 |
| **Total** | **251** |

---

## Contributors

- Development assisted by Claude Code (Anthropic)

---

[Unreleased]: https://github.com/southpawriter02/camelot-builder/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/southpawriter02/camelot-builder/releases/tag/v0.1.0
