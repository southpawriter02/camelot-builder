# Camelot Builder - Version Roadmap to v1.0

This document outlines the release plan from the current state (v0.0.0) through the stable v1.0.0 release. Each version represents a themed milestone with specific features from the [Enhancement Backlog](./BACKLOG.md).

---

## Versioning Philosophy

- **Semantic Versioning:** v0.x.0 for pre-release milestones, v1.0.0 for stable release
- **Named Milestones:** Each version has a thematic name reflecting its focus
- **Incremental Releases:** Smaller, focused releases for faster iteration and feedback
- **v1.0 Criteria:** All 46 backlog items complete, production-ready quality

---

## Release Overview

| Version | Name | Theme | Features | Priority Mix |
|---------|------|-------|----------|--------------|
| v0.1.0 | Foundation | Core Stability | 7 | In Progress |
| v0.2.0 | Visibility | Info & Feedback | 4 | 1 High, 3 Medium |
| v0.3.0 | Access | Accessibility | 3 | 1 High, 2 Medium |
| v0.4.0 | Mobile | Responsive | 3 | 1 High, 2 Medium |
| v0.5.0 | Style | Visual Polish | 4 | 1 High, 3 Medium |
| v0.6.0 | Guide | Help & Onboarding | 4 | 3 Medium, 1 Low |
| v0.7.0 | Power | Advanced Features | 4 | 4 Medium |
| v0.8.0 | Complete | Remaining Items | 6 | 6 Low |
| v0.9.0 | Polish | Final Polish | 4 | 4 Low |
| v1.0.0 | Camelot | Stable Release | - | QA & Release |

**Total Features:** 39 items + 7 in-progress = 46 backlog items

---

## Detailed Version Breakdown

### v0.1.0 "Foundation" - Core Stability

**Focus:** Complete all in-progress features and establish a stable foundation for future development.

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| FX-01 | Build Persistence | Save builds to localStorage | In Progress |
| FX-02 | Build Sharing | Export builds as URL hash or shareable code | In Progress |
| FX-03 | Undo/Redo History | Track ability changes and allow reverting | In Progress |
| FX-04 | Bonus Aggregation | Calculate and display total stat bonuses | In Progress |
| FX-05 | Ability Search/Filter | Search box to filter abilities by name or tree | In Progress |
| FX-06 | Keyboard Shortcuts | Hotkeys for common actions | In Progress |
| FX-07 | Cost Calculator | Remaining points budget and total cost | In Progress |

**Dependencies:** None (foundational release)

**Release Criteria:**
- [ ] All 7 FX features fully functional
- [ ] Unit tests for core logic (build, history, sharing, storage)
- [ ] Build and lint pass
- [ ] Manual QA on desktop browsers

---

### v0.2.0 "Visibility" - Information & Feedback

**Focus:** Help users understand their builds and provide clear feedback for actions.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| IH-01 | Ability Detail Modal | Click ability to see full description and ranks | High |
| SM-01 | Loading States | Skeleton loaders when data is being fetched | Medium |
| SM-02 | Toast Notifications | Non-intrusive feedback for actions | Medium |
| SM-03 | Confirmation Dialogs | Confirm before reset or destructive actions | Medium |

**Dependencies:**
- SM-02 (Toast) should be implemented before SM-03 (Confirmation Dialogs) for consistent notification patterns

**Release Criteria:**
- [ ] Modal component with ability details
- [ ] Toast system integrated throughout app
- [ ] Confirmation flow for reset action
- [ ] Loading states for initial data fetch

---

### v0.3.0 "Access" - Accessibility First Pass

**Focus:** Core accessibility improvements to support screen readers and keyboard navigation.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| AC-01 | ARIA Live Regions | Announce state changes to screen readers | High |
| AC-02 | Skip Navigation Links | Allow keyboard users to jump to content areas | Medium |
| AC-03 | Enhanced Focus States | More visible focus indicators | Medium |

**Dependencies:**
- Should be complete before Mobile features (v0.4.0) for accessible mobile experience

**Release Criteria:**
- [ ] Screen reader testing with VoiceOver/NVDA
- [ ] Tab navigation works throughout app
- [ ] Focus states visible on all interactive elements
- [ ] WCAG 2.1 AA compliance for implemented features

---

### v0.4.0 "Mobile" - Responsive Experience

**Focus:** Mobile-first improvements for touch devices and smaller screens.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| MR-01 | Collapsible Tree Sections | Allow trees to collapse/expand on mobile | High |
| MR-02 | Swipe Gestures | Swipe on ability cards to add/remove ranks | Medium |
| MR-03 | Bottom Navigation Bar | Fixed bottom bar for quick stats access | Medium |

**Dependencies:**
- Requires v0.3.0 accessibility features for screen reader support on mobile

**Release Criteria:**
- [ ] Tested on iOS Safari and Android Chrome
- [ ] Touch targets minimum 44x44px
- [ ] Gesture handlers don't conflict with browser gestures
- [ ] Bottom nav doesn't obscure content

---

### v0.5.0 "Style" - Visual Polish

**Focus:** Enhance the medieval fantasy theme with custom visual elements.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| VD-01 | Custom SVG Icons | Medieval-themed icons for realms, trees, UI | High |
| VD-02 | Background Textures | Subtle parchment/stone textures | Medium |
| VD-03 | Custom Medieval Font | Load Cinzel font for headings | Medium |
| VD-06 | Realm-specific Themes | Apply realm colors pervasively when class selected | Medium |

**Dependencies:**
- VD-01 (Icons) should be complete before VD-06 (Realm themes) for consistent icon coloring

**Release Criteria:**
- [ ] SVG icon set complete (realms, trees, actions)
- [ ] Fonts load without FOUT (Flash of Unstyled Text)
- [ ] Textures don't impact performance
- [ ] Realm colors apply to header, accents, icons

---

### v0.6.0 "Guide" - Help & Onboarding

**Focus:** Guide new users and provide in-context help.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| IH-02 | Tooltips Library | Replace CSS tooltips with Tippy.js | Medium |
| IH-03 | Onboarding Tutorial | First-time user guide | Medium |
| IH-05 | Prerequisite Visualization | Visual lines/arrows showing dependencies | Medium |
| IH-04 | Help Panel/FAQ | Collapsible help section | Low |

**Dependencies:**
- IH-01 (Modal from v0.2.0) enables IH-05 (Prerequisite Visualization) for detailed views

**Release Criteria:**
- [ ] Tooltips position correctly on all screen sizes
- [ ] Tutorial can be dismissed and re-triggered
- [ ] Prerequisite lines render without performance issues
- [ ] Help content covers core mechanics

---

### v0.7.0 "Power" - Advanced Features

**Focus:** Features for power users and community engagement.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| AF-01 | Build Comparison | Side-by-side comparison of builds | Medium |
| AF-02 | Build Templates | Pre-made popular builds to start from | Medium |
| AF-04 | Export to Image | Generate shareable image of build summary | Medium |
| AF-06 | Dark/Light Toggle | Manual theme toggle | Medium |

**Dependencies:**
- FX-01 (Build Persistence) and FX-02 (Build Sharing) from v0.1.0

**Release Criteria:**
- [ ] Compare up to 2 builds side-by-side
- [ ] At least 3 templates per realm
- [ ] Image export includes build summary stats
- [ ] Theme preference persists across sessions

---

### v0.8.0 "Complete" - Remaining Features

**Focus:** Complete all remaining backlog items before final polish.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| AF-03 | Build Notes | Add notes/comments to builds | Low |
| AF-05 | Import/Export JSON | Download/upload build configurations | Low |
| SM-04 | Error Boundary UI | Graceful error display | Low |
| SM-05 | Progress Indicators | Build completion percentage | Low |
| MR-04 | Pull-to-Refresh | Swipe down to reset on mobile | Low |
| MR-05 | Landscape Mode | Two-column layout for tablets | Low |

**Dependencies:**
- All previous versions complete

**Release Criteria:**
- [ ] Notes persist with builds
- [ ] JSON export/import round-trips successfully
- [ ] Error boundary catches React errors gracefully
- [ ] Landscape layout tested on iPad

---

### v0.9.0 "Polish" - Final Accessibility & Animations

**Focus:** Low-priority polish items and motion preferences.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| AC-04 | High Contrast Mode | Additional theme for higher contrast | Low |
| AC-05 | Reduced Motion Mode | Respect prefers-reduced-motion | Low |
| VD-04 | Ability Card Animations | Staggered fade-in on load | Low |
| VD-05 | Particle Effects | Sparkle/glow on max rank purchase | Low |

**Dependencies:**
- VD-04 and VD-05 require AC-05 to respect motion preferences

**Release Criteria:**
- [ ] High contrast mode passes WCAG AAA contrast ratios
- [ ] All animations respect prefers-reduced-motion
- [ ] Animations don't impact performance on low-end devices
- [ ] Particle effects can be disabled

---

### v1.0.0 "Camelot" - Stable Release

**Focus:** Final quality assurance, performance optimization, and production deployment.

**Release Activities:**
- [ ] Full regression testing across all features
- [ ] Performance audit (Lighthouse, bundle analysis)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Accessibility audit (automated + manual)
- [ ] Security review (CSP, XSS prevention)
- [ ] Documentation completion (README, contributing guide)
- [ ] Production deployment configuration
- [ ] Update package.json to v1.0.0

**Definition of Done for v1.0:**
- All 46 backlog items marked as "Done" in BACKLOG.md
- Zero critical or high-severity bugs
- Lighthouse Performance score > 90
- WCAG 2.1 AA compliant
- Works offline (PWA optional stretch goal)

---

## Dependency Graph

```
v0.1.0 Foundation
    │
    ├──► v0.2.0 Visibility
    │        │
    │        └──► v0.6.0 Guide (IH-01 Modal → IH-05 Prerequisites)
    │
    ├──► v0.3.0 Access
    │        │
    │        └──► v0.4.0 Mobile (Accessibility before touch)
    │
    ├──► v0.5.0 Style
    │        │
    │        └──► v0.9.0 Polish (Icons before animations)
    │
    └──► v0.7.0 Power (Build features → Advanced features)
             │
             └──► v0.8.0 Complete
                      │
                      └──► v0.9.0 Polish
                               │
                               └──► v1.0.0 Camelot
```

**Feature-Level Dependencies:**

```
SM-02 Toast ──────────► SM-03 Confirmation Dialogs
VD-01 Icons ──────────► VD-06 Realm Themes
IH-01 Modal ──────────► IH-05 Prerequisite Visualization
AC-01 ARIA ───────────► MR-01/02/03 Mobile Features
FX-01/02 Persistence ─► AF-01/02/04 Advanced Features
AC-05 Reduced Motion ─► VD-04/05 Animations
```

---

## Release Criteria Checklist

Every release must pass the following gates before publishing:

### Code Quality
- [ ] All features in scope implemented and tested
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes with no errors

### Documentation
- [ ] BACKLOG.md updated with status changes
- [ ] VERSION_ROADMAP.md progress updated
- [ ] Changelog entry written (if maintaining CHANGELOG.md)

### Version Management
- [ ] package.json version bumped
- [ ] Git tag created (e.g., v0.1.0)
- [ ] GitHub release published with notes

### Quality Assurance
- [ ] No critical or high-severity bugs
- [ ] Manual smoke test on Chrome, Firefox, Safari
- [ ] Mobile testing on iOS and Android
- [ ] Accessibility spot-check

---

## Feature Cross-Reference by Category

### Visual Design (VD) - 6 items
| ID | Feature | Version |
|----|---------|---------|
| VD-01 | Custom SVG Icons | v0.5.0 |
| VD-02 | Background Textures | v0.5.0 |
| VD-03 | Custom Medieval Font | v0.5.0 |
| VD-04 | Ability Card Animations | v0.9.0 |
| VD-05 | Particle Effects | v0.9.0 |
| VD-06 | Realm-specific Themes | v0.5.0 |

### Functional UX (FX) - 7 items
| ID | Feature | Version |
|----|---------|---------|
| FX-01 | Build Persistence | v0.1.0 |
| FX-02 | Build Sharing | v0.1.0 |
| FX-03 | Undo/Redo History | v0.1.0 |
| FX-04 | Bonus Aggregation | v0.1.0 |
| FX-05 | Ability Search/Filter | v0.1.0 |
| FX-06 | Keyboard Shortcuts | v0.1.0 |
| FX-07 | Cost Calculator | v0.1.0 |

### Mobile/Responsive (MR) - 5 items
| ID | Feature | Version |
|----|---------|---------|
| MR-01 | Collapsible Tree Sections | v0.4.0 |
| MR-02 | Swipe Gestures | v0.4.0 |
| MR-03 | Bottom Navigation Bar | v0.4.0 |
| MR-04 | Pull-to-Refresh | v0.8.0 |
| MR-05 | Landscape Mode | v0.8.0 |

### Accessibility (AC) - 5 items
| ID | Feature | Version |
|----|---------|---------|
| AC-01 | ARIA Live Regions | v0.3.0 |
| AC-02 | Skip Navigation Links | v0.3.0 |
| AC-03 | Enhanced Focus States | v0.3.0 |
| AC-04 | High Contrast Mode | v0.9.0 |
| AC-05 | Reduced Motion Mode | v0.9.0 |

### Information & Help (IH) - 5 items
| ID | Feature | Version |
|----|---------|---------|
| IH-01 | Ability Detail Modal | v0.2.0 |
| IH-02 | Tooltips Library | v0.6.0 |
| IH-03 | Onboarding Tutorial | v0.6.0 |
| IH-04 | Help Panel/FAQ | v0.6.0 |
| IH-05 | Prerequisite Visualization | v0.6.0 |

### State Management & Feedback (SM) - 5 items
| ID | Feature | Version |
|----|---------|---------|
| SM-01 | Loading States | v0.2.0 |
| SM-02 | Toast Notifications | v0.2.0 |
| SM-03 | Confirmation Dialogs | v0.2.0 |
| SM-04 | Error Boundary UI | v0.8.0 |
| SM-05 | Progress Indicators | v0.8.0 |

### Advanced Features (AF) - 6 items
| ID | Feature | Version |
|----|---------|---------|
| AF-01 | Build Comparison | v0.7.0 |
| AF-02 | Build Templates | v0.7.0 |
| AF-03 | Build Notes | v0.8.0 |
| AF-04 | Export to Image | v0.7.0 |
| AF-05 | Import/Export JSON | v0.8.0 |
| AF-06 | Dark/Light Toggle | v0.7.0 |

---

## Progress Tracking

Update this section as releases are completed:

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| v0.1.0 | In Progress | - | Core features being completed |
| v0.2.0 | Planned | - | - |
| v0.3.0 | Planned | - | - |
| v0.4.0 | Planned | - | - |
| v0.5.0 | Planned | - | - |
| v0.6.0 | Planned | - | - |
| v0.7.0 | Planned | - | - |
| v0.8.0 | Planned | - | - |
| v0.9.0 | Planned | - | - |
| v1.0.0 | Planned | - | - |

---

*Last updated: January 2025*
