# v0.3.0 "Access" - Release Overview

## Release Theme
**Accessibility First Pass** - Core accessibility improvements to support screen readers and keyboard navigation.

## Status: PLANNING

## Release Goals
1. Enable screen reader users to receive announcements for dynamic content changes
2. Provide keyboard users with skip links to bypass navigation
3. Ensure all interactive elements have visible focus indicators
4. Achieve WCAG 2.1 AA compliance for implemented features

## Feature Summary

| ID | Feature | Priority | Category | Status | Description |
|----|---------|----------|----------|--------|-------------|
| AC-01 | ARIA Live Regions | High | Accessibility | Planned | Announce state changes to screen readers |
| AC-02 | Skip Navigation Links | Medium | Accessibility | Planned | Allow keyboard users to jump to content areas |
| AC-03 | Enhanced Focus States | Medium | Accessibility | Planned | More visible focus indicators |

## Implementation Status Matrix

| Feature | Planning | Design | Implementation | Testing | Integration |
|---------|----------|--------|----------------|---------|-------------|
| AC-01 | [ ] | [ ] | [ ] | [ ] | [ ] |
| AC-02 | [ ] | [ ] | [ ] | [ ] | [ ] |
| AC-03 | [ ] | [ ] | [ ] | [ ] | [ ] |

## Current Accessibility State

### What Already Exists
| Feature | Status | Location |
|---------|--------|----------|
| Basic aria-labels | Partial | ActionBar, SearchFilter, Toast, ClassSelector |
| Semantic HTML | Good | App.tsx uses header, main, aside, footer |
| Keyboard shortcuts | Complete | useKeyboardShortcuts.ts |
| Button focus-visible | Partial | index.css (2px gold outline) |
| Class selector keyboard | Complete | Enter/Space handling |

### What's Missing
| Gap | Impact | Feature |
|-----|--------|---------|
| No aria-live regions | Screen reader users miss dynamic updates | AC-01 |
| No skip links | Keyboard users must tab through header | AC-02 |
| Inconsistent focus styles | Keyboard users can't see focused element | AC-03 |

## Feature Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                       v0.3.0 Access                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐                                              │
│   │     AC-01       │                                              │
│   │  ARIA Live      │───────────┐                                  │
│   │   Regions       │           │                                  │
│   │  (integrates    │           │                                  │
│   │   with Toast)   │           │                                  │
│   └─────────────────┘           │                                  │
│                                 ▼                                  │
│   ┌─────────────────┐    ┌─────────────────┐                      │
│   │     AC-02       │    │    v0.4.0       │                      │
│   │  Skip Links     │    │    Mobile       │                      │
│   │  (standalone)   │    │  (depends on    │                      │
│   └─────────────────┘    │  accessibility) │                      │
│                          └─────────────────┘                      │
│   ┌─────────────────┐                                              │
│   │     AC-03       │                                              │
│   │ Enhanced Focus  │                                              │
│   │  (standalone)   │                                              │
│   └─────────────────┘                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Dependency Notes:**
- **AC-01** integrates with existing Toast system from v0.2.0
- **AC-02** and **AC-03** are standalone with no dependencies
- All AC features must be complete before v0.4.0 Mobile features

## Recommended Implementation Order

1. **AC-03 Enhanced Focus States** - CSS-only changes, lowest risk
2. **AC-02 Skip Navigation Links** - Simple component, quick accessibility win
3. **AC-01 ARIA Live Regions** - Most complex, integrates with multiple components

## Files to Create/Modify

### New Components
| File | Feature | Description |
|------|---------|-------------|
| `src/components/SkipLinks.tsx` | AC-02 | Skip navigation links |
| `src/components/SkipLinks.css` | AC-02 | Skip link styling |

### New Hooks
| File | Feature | Description |
|------|---------|-------------|
| `src/hooks/useAnnounce.ts` | AC-01 | Programmatic screen reader announcements |

### Modified Files
| File | Feature | Changes |
|------|---------|---------|
| `src/App.tsx` | AC-01, AC-02 | Add SkipLinks, aria-live regions, skip target IDs |
| `src/App.css` | AC-03 | Enhanced focus states for interactive elements |
| `src/index.css` | AC-03 | Global focus state enhancements |
| `src/components/Toast.tsx` | AC-01 | Add aria-live, role="alert" |
| `src/components/SearchFilter.tsx` | AC-01 | aria-live for result count |
| `src/components/BuildSummary.tsx` | AC-01 | role="status" for point display |

### Test Files
| File | Feature |
|------|---------|
| `src/components/SkipLinks.test.tsx` | AC-02 |
| `src/hooks/useAnnounce.test.ts` | AC-01 |

## WCAG 2.1 AA Compliance Targets

| Guideline | Criteria | Feature | Current | Target |
|-----------|----------|---------|---------|--------|
| 1.3.1 | Info and Relationships | AC-01 | Partial | Full |
| 2.1.1 | Keyboard | AC-02, AC-03 | Partial | Full |
| 2.4.1 | Bypass Blocks | AC-02 | None | Full |
| 2.4.7 | Focus Visible | AC-03 | Partial | Full |
| 4.1.3 | Status Messages | AC-01 | None | Full |

## Release Criteria Checklist

### Functionality
- [ ] AC-01: Toast notifications announced to screen readers
- [ ] AC-01: Build state changes announced (ability add/remove, class select)
- [ ] AC-01: Search results count announced
- [ ] AC-02: Skip to main content link works
- [ ] AC-02: Skip to build summary link works
- [ ] AC-02: Skip to search link works
- [ ] AC-03: All interactive elements have visible focus
- [ ] AC-03: Focus indicators are consistent (gold, 3px)

### Testing
- [ ] All new components have test coverage
- [ ] All new hooks have test coverage
- [ ] Screen reader testing with VoiceOver (macOS)
- [ ] Screen reader testing with NVDA (Windows) - if available
- [ ] Keyboard navigation testing (Tab, Shift+Tab, Enter)
- [ ] All existing tests still pass

### Accessibility Audit
- [ ] WCAG 2.4.1 Bypass Blocks - pass
- [ ] WCAG 2.4.7 Focus Visible - pass
- [ ] WCAG 4.1.3 Status Messages - pass
- [ ] No new accessibility violations introduced

### Performance
- [ ] aria-live announcements don't cause layout shifts
- [ ] Focus styles don't impact render performance

## Testing Strategy

### Unit Tests
- SkipLinks component rendering
- useAnnounce hook functionality
- Focus state CSS application

### Integration Tests
- Skip links navigate to correct targets
- Screen reader announcements fire on state changes
- Focus visible on all interactive elements

### Manual Accessibility Testing
| Test | Tool | Criteria |
|------|------|----------|
| Screen reader | VoiceOver | All dynamic changes announced |
| Screen reader | NVDA | All dynamic changes announced |
| Keyboard | Manual | All elements reachable via Tab |
| Focus visible | Manual | All focused elements visible |
| Skip links | Manual | Links appear on focus, navigate correctly |

### Automated Accessibility Testing
| Tool | Purpose |
|------|---------|
| axe-core | Automated WCAG violation detection |
| Lighthouse | Accessibility score baseline |

## Known Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| aria-live announcement timing | Low | Test with actual screen readers, not just automated tools |
| Skip link z-index conflicts | Low | Test with all modals and overlays open |
| Focus outline conflicts with existing styles | Low | Use outline-offset to prevent overlap |
| Cross-browser focus-visible support | Low | Fallback to :focus for older browsers |

## Future Considerations (Out of Scope)

- AC-04: High Contrast Mode (v0.9.0)
- AC-05: Reduced Motion Mode (v0.9.0)
- Custom aria-live verbosity settings
- Keyboard shortcut customization

## Related Documentation

- [AC-01 ARIA Live Regions](./AC-01-aria-live-regions.md)
- [AC-02 Skip Navigation](./AC-02-skip-navigation.md)
- [AC-03 Enhanced Focus States](./AC-03-enhanced-focus-states.md)
