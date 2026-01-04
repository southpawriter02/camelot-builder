# v0.1.0 "Foundation" - Release Planning

**Version:** 0.1.0
**Codename:** Foundation
**Theme:** Core Stability
**Status:** In Progress

---

## Release Overview

v0.1.0 "Foundation" establishes the core functional infrastructure for Camelot Builder. This release completes all in-progress features that enable users to create, save, share, and manage their realm ability builds.

### Goals

1. Complete all functional UX features currently in progress
2. Establish stable core for future feature development
3. Ensure seamless user experience for basic build workflows
4. Enable build persistence and sharing capabilities

---

## Feature Summary

| ID | Feature | Priority | Status | Primary File |
|----|---------|----------|--------|--------------|
| FX-01 | Build Persistence | High | Complete | `src/core/storage.ts` |
| FX-02 | Build Sharing | High | Complete | `src/core/sharing.ts` |
| FX-03 | Undo/Redo History | Medium | Complete | `src/core/history.ts` |
| FX-04 | Bonus Aggregation | High | **Partial** | `src/core/build.ts` |
| FX-05 | Ability Search/Filter | Medium | Complete | `src/components/SearchFilter.tsx` |
| FX-06 | Keyboard Shortcuts | Low | Complete | `src/hooks/useKeyboardShortcuts.ts` |
| FX-07 | Cost Calculator | Medium | Complete | `src/components/BuildSummary.tsx` |

---

## Implementation Status Matrix

```
Feature          Implementation  Tests  Integration  Docs
─────────────────────────────────────────────────────────
FX-01 Persist    [████████████]  [██  ]  [████████]  [    ]
FX-02 Share      [████████████]  [██  ]  [████████]  [    ]
FX-03 History    [████████████]  [████]  [████████]  [    ]
FX-04 Bonuses    [███         ]  [    ]  [██      ]  [    ]
FX-05 Search     [████████████]  [██  ]  [████████]  [    ]
FX-06 Shortcuts  [████████████]  [    ]  [████████]  [    ]
FX-07 Costs      [████████████]  [██  ]  [████████]  [    ]

Legend: [████] = Complete, [██  ] = Partial, [    ] = Not Started
```

---

## Feature Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    Core Build System                     │
│                   (src/core/build.ts)                   │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │ FX-01   │    │  FX-02   │    │  FX-03   │
    │ Storage │◄──►│ Sharing  │    │ History  │
    └────┬────┘    └────┬─────┘    └────┬─────┘
         │              │               │
         └──────────────┼───────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    App.tsx      │
              │  (Coordinator)  │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │ FX-04   │  │  FX-05   │  │  FX-06   │
    │ Bonuses │  │  Search  │  │ Keyboard │
    └────┬────┘  └────┬─────┘  └────┬─────┘
         │            │             │
         └────────────┼─────────────┘
                      │
                      ▼
              ┌─────────────────┐
              │     FX-07       │
              │ Cost Calculator │
              │ (BuildSummary)  │
              └─────────────────┘
```

---

## Critical Path

The following features are blocking for release:

1. **FX-04: Bonus Aggregation** - Currently incomplete
   - Requires data model changes to support stat bonuses
   - Requires UI component for displaying aggregated stats
   - See [FX-04-bonus-aggregation.md](./FX-04-bonus-aggregation.md) for full spec

---

## Release Criteria Checklist

### Code Quality
- [ ] All 7 features fully implemented
- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run test` passes all tests

### Feature Verification
- [ ] FX-01: Build persists across browser refresh
- [ ] FX-02: Share URL correctly restores build
- [ ] FX-03: Undo/redo works for all ability changes
- [ ] FX-04: Stats display aggregated bonuses correctly
- [ ] FX-05: Search filters abilities in real-time
- [ ] FX-06: All keyboard shortcuts functional
- [ ] FX-07: Point budget accurately tracks spending

### Documentation
- [ ] All feature planning docs complete
- [ ] BACKLOG.md updated with "Done" status
- [ ] VERSION_ROADMAP.md progress updated

### Release
- [ ] package.json version set to 0.1.0
- [ ] Git tag v0.1.0 created
- [ ] GitHub release published

---

## Files Modified in This Release

### Core Logic
- `src/core/build.ts` - Build class with ability management
- `src/core/storage.ts` - localStorage persistence
- `src/core/sharing.ts` - URL encoding/decoding
- `src/core/history.ts` - Undo/redo state management
- `src/core/validator.ts` - Build validation rules

### Components
- `src/components/BuildSummary.tsx` - Cost display and stats
- `src/components/SearchFilter.tsx` - Ability search
- `src/components/ActionBar.tsx` - Undo/redo/share buttons

### Hooks
- `src/hooks/useKeyboardShortcuts.ts` - Keyboard bindings

### Types
- `src/types/index.ts` - Type definitions (needs FX-04 additions)

### Data
- `src/data/abilities.json` - Ability definitions (needs FX-04 stats)

---

## Testing Strategy

### Unit Tests
- Build class methods (purchase, remove, clone)
- History class (push, undo, redo)
- Validator functions
- Encoding/decoding functions

### Integration Tests
- Save → Refresh → Load cycle
- Share URL → New tab → Load cycle
- Undo/redo across multiple operations

### Manual QA
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness check
- Keyboard navigation verification

---

## Known Risks

| Risk | Mitigation |
|------|------------|
| FX-04 data model changes may break existing saves | Implement version migration in storage.ts |
| Share URLs with old format won't work | Add backward compatibility in decoding |
| localStorage quota exceeded | Add size check and warning |

---

## Planning Documents

1. [FX-01: Build Persistence](./FX-01-build-persistence.md)
2. [FX-02: Build Sharing](./FX-02-build-sharing.md)
3. [FX-03: Undo/Redo History](./FX-03-undo-redo-history.md)
4. [FX-04: Bonus Aggregation](./FX-04-bonus-aggregation.md) ← Critical incomplete feature
5. [FX-05: Ability Search/Filter](./FX-05-ability-search-filter.md)
6. [FX-06: Keyboard Shortcuts](./FX-06-keyboard-shortcuts.md)
7. [FX-07: Cost Calculator](./FX-07-cost-calculator.md)

---

*Last updated: January 2025*
