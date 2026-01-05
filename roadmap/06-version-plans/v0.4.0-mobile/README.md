# v0.4.0 "Mobile" - Release Overview

## Release Theme
**Responsive Experience** - Mobile-first improvements for touch devices and smaller screens.

## Status: PLANNING

## Release Goals
1. Allow users to collapse ability trees to reduce scrolling on mobile
2. Enable touch-based swipe gestures for quick ability management
3. Provide persistent access to key build stats via bottom navigation
4. Ensure all mobile interactions meet accessibility standards

## Feature Summary

| ID | Feature | Priority | Category | Status | Description |
|----|---------|----------|----------|--------|-------------|
| MR-01 | Collapsible Tree Sections | High | Mobile/Responsive | Planned | Allow trees to collapse/expand on mobile |
| MR-02 | Swipe Gestures | Medium | Mobile/Responsive | Planned | Swipe on ability cards to add/remove ranks |
| MR-03 | Bottom Navigation Bar | Medium | Mobile/Responsive | Planned | Fixed bottom bar for quick stats access |

## Implementation Status Matrix

| Feature | Planning | Design | Implementation | Testing | Integration |
|---------|----------|--------|----------------|---------|-------------|
| MR-01 | [ ] | [ ] | [ ] | [ ] | [ ] |
| MR-02 | [ ] | [ ] | [ ] | [ ] | [ ] |
| MR-03 | [ ] | [ ] | [ ] | [ ] | [ ] |

## Current Mobile State

### Existing Responsive Features
| Feature | Breakpoint | Status |
|---------|------------|--------|
| Single-column layout | 1200px | Complete |
| Reduced header size | 768px | Complete |
| Icon-only action buttons | 768px | Complete |
| Hidden keyboard footer | 768px | Complete |
| Toast repositioning | 768px | Complete |

### What's Missing
| Gap | Impact | Feature |
|-----|--------|---------|
| No collapsible trees | Excessive scrolling | MR-01 |
| No touch gestures | Desktop-only interaction | MR-02 |
| No bottom nav | Stats hidden on scroll | MR-03 |

## Feature Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                       v0.4.0 Mobile                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Prerequisites: v0.3.0 Access (accessibility in place)            │
│                                                                     │
│   ┌─────────────────┐                                              │
│   │     MR-01       │                                              │
│   │  Collapsible    │                                              │
│   │    Trees        │                                              │
│   │  (standalone)   │                                              │
│   └─────────────────┘                                              │
│                                                                     │
│   ┌─────────────────┐    ┌─────────────────┐                      │
│   │     MR-02       │    │     MR-03       │                      │
│   │    Swipe        │    │   Bottom Nav    │                      │
│   │   Gestures      │    │     Bar         │                      │
│   │  (standalone)   │    │  (standalone)   │                      │
│   └─────────────────┘    └─────────────────┘                      │
│                                                                     │
│   All features are standalone with no internal dependencies        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Dependency Notes:**
- All MR features are standalone
- v0.3.0 accessibility features must be in place first
- Swipe gestures should use v0.3.0 announcements for accessibility

## Recommended Implementation Order

1. **MR-01 Collapsible Tree Sections** - State management foundation, quick UX win
2. **MR-03 Bottom Navigation Bar** - Independent component, high visibility
3. **MR-02 Swipe Gestures** - Most complex, requires careful touch handling

## Files to Create/Modify

### New Components
| File | Feature | Description |
|------|---------|-------------|
| `src/components/BottomNavBar.tsx` | MR-03 | Fixed mobile bottom bar |
| `src/components/BottomNavBar.css` | MR-03 | Bottom bar styling |

### New Hooks
| File | Feature | Description |
|------|---------|-------------|
| `src/hooks/useSwipeGesture.ts` | MR-02 | Touch swipe detection |
| `src/hooks/useMediaQuery.ts` | All | Responsive breakpoint detection |

### Modified Files
| File | Feature | Changes |
|------|---------|---------|
| `src/App.tsx` | MR-03 | Add BottomNavBar, layout adjustments |
| `src/App.css` | All | Mobile styles, safe areas, bottom padding |
| `src/components/AbilityTree.tsx` | MR-01, MR-02 | Collapsible logic, swipe handlers |

### Test Files
| File | Feature |
|------|---------|
| `src/components/BottomNavBar.test.tsx` | MR-03 |
| `src/hooks/useSwipeGesture.test.ts` | MR-02 |
| `src/components/AbilityTree.test.tsx` | MR-01 (additions) |

## Current Breakpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Responsive Breakpoints                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Desktop (> 1200px)                                                │
│   ┌───────────────────────────────────┬──────────────────┐         │
│   │        Main Panel (trees)         │     Sidebar      │         │
│   │                                   │   (sticky)       │         │
│   └───────────────────────────────────┴──────────────────┘         │
│   - Full header with icons                                          │
│   - Trees always expanded                                           │
│   - Action buttons with labels                                      │
│   - Keyboard hints visible                                          │
│                                                                     │
│   Tablet (768px - 1200px)                                          │
│   ┌─────────────────────────────────────────────────────┐          │
│   │                Main Panel (trees)                    │          │
│   ├─────────────────────────────────────────────────────┤          │
│   │                Sidebar (below)                       │          │
│   └─────────────────────────────────────────────────────┘          │
│   - Trees expanded (consider collapse)                              │
│   - Sidebar scrolls below main content                              │
│   - Full button labels                                              │
│                                                                     │
│   Mobile (< 768px)                                                  │
│   ┌─────────────────────────────────────────────────────┐          │
│   │                Main Panel (trees)                    │          │
│   │  [MR-01: Trees collapsed by default]                │          │
│   ├─────────────────────────────────────────────────────┤          │
│   │  [MR-02: Swipe gestures on ability cards]           │          │
│   ├─────────────────────────────────────────────────────┤          │
│   │                Sidebar (below)                       │          │
│   └─────────────────────────────────────────────────────┘          │
│   [MR-03: Bottom Navigation Bar - fixed]                           │
│   ┌─────────────────────────────────────────────────────┐          │
│   │   Points: 15/40  │  Abilities: 5  │  [Actions]      │          │
│   └─────────────────────────────────────────────────────┘          │
│   - Reduced header                                                  │
│   - Icon-only action buttons                                        │
│   - No keyboard hints                                               │
│   - Touch-optimized interactions                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Mobile UX Requirements

### Touch Targets (WCAG 2.5.5)
| Element | Minimum Size | Current | Action |
|---------|--------------|---------|--------|
| Ability card buttons | 44x44px | ~32px | Increase |
| Tree collapse toggle | 44x44px | N/A | Create |
| Bottom nav items | 44x44px | N/A | Create |
| Swipe trigger area | 44px height | N/A | Use card height |

### Gesture Requirements
| Gesture | Action | Threshold | Feedback |
|---------|--------|-----------|----------|
| Swipe right | Add rank | 50px | Visual + announcement |
| Swipe left | Remove rank | 50px | Visual + announcement |
| Tap toggle | Collapse tree | N/A | Icon rotation |

## Release Criteria Checklist

### Functionality
- [ ] MR-01: Trees can collapse/expand
- [ ] MR-01: Collapsed state persists during session
- [ ] MR-01: Animation smooth (no jank)
- [ ] MR-02: Swipe right adds rank
- [ ] MR-02: Swipe left removes rank
- [ ] MR-02: Swipe does not conflict with scroll
- [ ] MR-03: Bottom nav shows on mobile only
- [ ] MR-03: Points and ability count visible
- [ ] MR-03: Bottom nav doesn't obscure content

### Testing
- [ ] All new components have test coverage
- [ ] All new hooks have test coverage
- [ ] iOS Safari tested
- [ ] Android Chrome tested
- [ ] Touch targets verified (44x44px minimum)
- [ ] All existing tests still pass

### Accessibility
- [ ] Swipe actions have button fallbacks
- [ ] Collapse state announced to screen readers
- [ ] Bottom nav accessible via keyboard
- [ ] No motion-based requirements (WCAG 2.5.4)

### Performance
- [ ] Collapse animations smooth (60fps)
- [ ] Swipe detection doesn't block scroll
- [ ] Bottom nav doesn't cause layout thrashing

## Testing Strategy

### Device Testing Matrix
| Device | OS | Browser | Priority |
|--------|-----|---------|----------|
| iPhone 14 | iOS 17 | Safari | High |
| iPhone SE | iOS 17 | Safari | High (small screen) |
| Pixel 7 | Android 14 | Chrome | High |
| iPad | iPadOS 17 | Safari | Medium |
| Galaxy S23 | Android 14 | Chrome | Medium |

### Touch Testing Checklist
- [ ] Single tap works as expected
- [ ] Swipe gesture recognized correctly
- [ ] Swipe doesn't interfere with scroll
- [ ] Long press doesn't trigger swipe
- [ ] Multi-touch doesn't break gestures

### Responsive Testing
- [ ] 320px width (iPhone SE)
- [ ] 375px width (iPhone 14)
- [ ] 414px width (iPhone Plus sizes)
- [ ] 768px width (tablet portrait)
- [ ] 1024px width (tablet landscape)
- [ ] 1200px width (breakpoint boundary)

## Known Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Swipe conflicts with scroll | High | Use horizontal threshold, cancel if vertical |
| Safe area on notched devices | Medium | Use env(safe-area-inset-*) |
| Bottom nav obscures content | Medium | Add padding-bottom to content |
| Animation jank on low-end devices | Low | Use CSS transforms, test on real devices |
| Touch target overlap | Low | Ensure minimum spacing between targets |

## Future Considerations (Out of Scope)

- MR-04: Pull-to-Refresh (v0.8.0)
- MR-05: Landscape Mode (v0.8.0)
- Haptic feedback for gestures
- Gesture customization
- Offline PWA support

## Related Documentation

- [MR-01 Collapsible Tree Sections](./MR-01-collapsible-trees.md)
- [MR-02 Swipe Gestures](./MR-02-swipe-gestures.md)
- [MR-03 Bottom Navigation Bar](./MR-03-bottom-nav-bar.md)
