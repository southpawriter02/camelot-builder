# Camelot Builder - Enhancement Backlog

This document tracks planned GUI/UX enhancements for the Camelot Builder application.

---

## Visual Design Enhancements

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| VD-01 | Custom SVG Icons | Replace emoji icons with custom medieval-themed SVG icons for realms, trees, and UI elements | High | Backlog |
| VD-02 | Background Textures | Add subtle parchment/stone textures to sections for more medieval atmosphere | Medium | Backlog |
| VD-03 | Custom Medieval Font | Load the referenced 'Cinzel' font via Google Fonts or local files | Medium | Backlog |
| VD-04 | Ability Card Animations | Add staggered fade-in animations when abilities load | Low | Backlog |
| VD-05 | Particle Effects | Subtle sparkle/glow effects when purchasing max rank | Low | Backlog |
| VD-06 | Realm-specific Themes | Apply realm colors more pervasively when a class is selected | Medium | Backlog |

---

## Functional UX Improvements

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| FX-01 | Build Persistence | Save builds to localStorage so they survive page refreshes | High | In Progress |
| FX-02 | Build Sharing | Export builds as URL hash or shareable code | High | In Progress |
| FX-03 | Undo/Redo History | Track ability changes and allow reverting to previous states | Medium | In Progress |
| FX-04 | Bonus Aggregation | Calculate and display total stat bonuses from selected abilities | High | In Progress |
| FX-05 | Ability Search/Filter | Add search box to filter abilities by name or tree | Medium | In Progress |
| FX-06 | Keyboard Shortcuts | Add hotkeys for common actions (R to reset, number keys for trees) | Low | In Progress |
| FX-07 | Cost Calculator | Show remaining points budget and estimated total cost | Medium | In Progress |

---

## Mobile/Responsive Improvements

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| MR-01 | Collapsible Tree Sections | Allow trees to collapse/expand on mobile for easier navigation | High | Backlog |
| MR-02 | Swipe Gestures | Swipe left/right on ability cards to add/remove ranks | Medium | Backlog |
| MR-03 | Bottom Navigation Bar | Fixed bottom bar for quick stats access on mobile | Medium | Backlog |
| MR-04 | Pull-to-Refresh | Swipe down to reset build on mobile | Low | Backlog |
| MR-05 | Landscape Mode | Optimized two-column layout for tablets in landscape | Low | Backlog |

---

## Accessibility Improvements

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| AC-01 | ARIA Live Regions | Announce state changes (points spent, ability purchased) to screen readers | High | Backlog |
| AC-02 | Skip Navigation Links | Allow keyboard users to jump to main content areas | Medium | Backlog |
| AC-03 | Enhanced Focus States | More visible focus indicators across all interactive elements | Medium | Backlog |
| AC-04 | High Contrast Mode | Additional theme option for users needing higher contrast | Low | Backlog |
| AC-05 | Reduced Motion Mode | Respect `prefers-reduced-motion` for all animations | Low | Backlog |

---

## Information & Help

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| IH-01 | Ability Detail Modal | Click ability name to see full description, all ranks, and effects | High | Backlog |
| IH-02 | Tooltips Library | Replace CSS tooltips with a proper library (Tippy.js) for better positioning | Medium | Backlog |
| IH-03 | Onboarding Tutorial | First-time user guide explaining the interface | Medium | Backlog |
| IH-04 | Help Panel/FAQ | Collapsible help section explaining game mechanics | Low | Backlog |
| IH-05 | Prerequisite Visualization | Visual lines/arrows showing ability dependencies | Medium | Backlog |

---

## State Management & Feedback

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| SM-01 | Loading States | Skeleton loaders when data is being fetched | Medium | Backlog |
| SM-02 | Toast Notifications | Non-intrusive feedback for actions (build saved, copied to clipboard) | Medium | Backlog |
| SM-03 | Confirmation Dialogs | Confirm before reset or destructive actions | Medium | Backlog |
| SM-04 | Error Boundary UI | Graceful error display if something breaks | Low | Backlog |
| SM-05 | Progress Indicators | Show build completion percentage based on typical builds | Low | Backlog |

---

## Advanced Features

| ID | Enhancement | Description | Priority | Status |
|----|-------------|-------------|----------|--------|
| AF-01 | Build Comparison | Side-by-side comparison of different builds | Medium | Backlog |
| AF-02 | Build Templates | Pre-made popular builds users can start from | Medium | Backlog |
| AF-03 | Build Notes | Allow users to add notes/comments to their builds | Low | Backlog |
| AF-04 | Export to Image | Generate shareable image of the build summary | Medium | Backlog |
| AF-05 | Import/Export JSON | Download/upload build configurations | Low | Backlog |
| AF-06 | Dark/Light Toggle | Manual theme toggle instead of relying only on system preference | Medium | Backlog |

---

## Priority Legend

- **High**: Essential for core usability
- **Medium**: Significant improvement to user experience
- **Low**: Nice-to-have polish features

## Status Legend

- **Backlog**: Not yet started
- **In Progress**: Currently being implemented
- **Done**: Completed and deployed
