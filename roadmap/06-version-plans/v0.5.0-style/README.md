# v0.5.0 "Style" - Release Overview

## Release Theme
**Visual Polish** - Enhance the medieval fantasy theme with custom visual elements including icons, textures, fonts, and pervasive realm theming.

## Status: PLANNING

## Release Goals
1. Replace emoji icons with custom medieval-themed SVG icons
2. Add subtle background textures for visual depth
3. Load and apply the Cinzel medieval font for headings
4. Apply realm colors pervasively throughout the UI when a class is selected

## Feature Summary

| ID | Feature | Priority | Category | Status | Description |
|----|---------|----------|----------|--------|-------------|
| VD-01 | Custom SVG Icons | High | Visual Design | Planned | Medieval-themed icons for realms, trees, UI |
| VD-02 | Background Textures | Medium | Visual Design | Planned | Subtle parchment/stone textures |
| VD-03 | Custom Medieval Font | Medium | Visual Design | Planned | Load Cinzel font for headings |
| VD-06 | Realm-specific Themes | Medium | Visual Design | Planned | Apply realm colors pervasively when class selected |

## Implementation Status Matrix

| Feature | Planning | Design | Implementation | Testing | Integration |
|---------|----------|--------|----------------|---------|-------------|
| VD-01 | [ ] | [ ] | [ ] | [ ] | [ ] |
| VD-02 | [ ] | [ ] | [ ] | [ ] | [ ] |
| VD-03 | [ ] | [ ] | [ ] | [ ] | [ ] |
| VD-06 | [ ] | [ ] | [ ] | [ ] | [ ] |

## Current Visual State

### Existing Design System
| Element | Current | Status |
|---------|---------|--------|
| Color Variables | Comprehensive (realm, status, accent) | Complete |
| Typography Variables | Defined with Cinzel fallback | Font not loaded |
| Spacing/Sizing | Full scale (xs through 2xl) | Complete |
| Animations | fadeIn, pulse, glow keyframes | Complete |
| Dark Theme | Primary with light mode support | Complete |

### Icon Implementation
| Category | Current | Target |
|----------|---------|--------|
| Realm icons | Emoji (🏰⚔️🍀) | Custom SVG crests |
| Tree icons | Emoji (✨💚⚡🌑👻🌿🌸📜) | Custom SVG symbols |
| Action icons | Unicode (↶↷🔗🔄🔍) | Custom SVG icons |
| Status icons | Mixed (⚠️ℹ️✓✕) | Consistent SVG set |

### Typography
| Element | Current | Target |
|---------|---------|--------|
| Headings | `'Cinzel', serif` (fallback) | Cinzel loaded from Google Fonts |
| Body | System fonts | No change |
| Special | None | Cinzel Decorative (optional) |

### Background/Textures
| Element | Current | Target |
|---------|---------|--------|
| Body | Gradient (#1a1a2e → #16213e → #0f0f1a) | Keep + noise overlay |
| Cards | Solid color | Subtle parchment texture |
| Header | Transparent | Stone texture (optional) |

## Feature Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                       v0.5.0 Style                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Prerequisites: v0.4.0 Mobile (responsive in place)               │
│                                                                     │
│   ┌─────────────────┐                                              │
│   │     VD-03       │                                              │
│   │  Custom Font    │  ← Start here (quick win)                    │
│   │  (standalone)   │                                              │
│   └─────────────────┘                                              │
│                                                                     │
│   ┌─────────────────┐                                              │
│   │     VD-01       │                                              │
│   │  Custom SVG     │───────────┐                                  │
│   │    Icons        │           │                                  │
│   │  (foundation)   │           │                                  │
│   └─────────────────┘           │                                  │
│                                 ▼                                  │
│   ┌─────────────────┐    ┌─────────────────┐                      │
│   │     VD-02       │    │     VD-06       │                      │
│   │  Background     │    │  Realm-specific │                      │
│   │   Textures      │    │    Themes       │                      │
│   │  (standalone)   │    │ (uses icons)    │                      │
│   └─────────────────┘    └─────────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Dependency Notes:**
- VD-01 (Icons) should be completed before VD-06 (Realm Themes) for consistent icon coloring
- VD-02 (Textures) and VD-03 (Font) are standalone
- All features enhance the existing CSS variable system

## Recommended Implementation Order

1. **VD-03 Custom Medieval Font** - Simple addition, immediate visual impact
2. **VD-01 Custom SVG Icons** - Foundation for theme consistency
3. **VD-02 Background Textures** - Visual enhancement, performance testing needed
4. **VD-06 Realm-specific Themes** - Builds on icons, comprehensive application

## Files to Create/Modify

### New Directories
| Directory | Purpose |
|-----------|---------|
| `src/assets/icons/` | SVG icon files |
| `src/assets/textures/` | Background texture images |

### New Components (Optional)
| File | Feature | Description |
|------|---------|-------------|
| `src/components/Icon.tsx` | VD-01 | Reusable icon component |
| `src/components/Icon.css` | VD-01 | Icon styling |

### Modified Files
| File | Feature | Changes |
|------|---------|---------|
| `index.html` | VD-03 | Add Google Fonts preload/link |
| `src/index.css` | VD-02, VD-03 | Font loading, texture backgrounds |
| `src/App.css` | VD-02, VD-06 | Realm theme classes, texture overlays |
| `src/App.tsx` | VD-06 | Apply realm class to container |
| `src/components/ClassSelector.tsx` | VD-01 | Replace REALM_ICONS with SVG |
| `src/components/AbilityTree.tsx` | VD-01 | Replace TREE_ICONS with SVG |
| `src/components/BuildSummary.tsx` | VD-01 | Replace REALM_ICONS with SVG |
| `src/components/ActionBar.tsx` | VD-01 | Replace action icons with SVG |

### Test Files
| File | Feature |
|------|---------|
| `src/components/Icon.test.tsx` | VD-01 |

## Asset Requirements

### SVG Icons (VD-01)

| Category | Icons Needed | Count |
|----------|--------------|-------|
| Realms | Albion crest, Midgard crest, Hibernia crest | 3 |
| Trees | enhancements, healing, smiting, subterranean, spirit, nature, nurture, default | 8 |
| Actions | undo, redo, share, reset, search, clear, add, remove | 8 |
| Status | warning, info, success, error, locked, unlocked | 6 |
| **Total** | | **25** |

### Background Textures (VD-02)

| Texture | Format | Max Size | Usage |
|---------|--------|----------|-------|
| Parchment | WebP/PNG | 30KB | Card backgrounds |
| Stone | WebP/PNG | 30KB | Header (optional) |
| Noise | SVG/PNG | 10KB | Overlay for depth |

### Fonts (VD-03)

| Font | Weights | Format | Source |
|------|---------|--------|--------|
| Cinzel | 400, 600, 700 | WOFF2 | Google Fonts |
| Cinzel Decorative | 400 (optional) | WOFF2 | Google Fonts |

## Design Specifications

### Icon Standards
| Property | Value |
|----------|-------|
| Base size | 24x24px |
| Large size | 48x48px (realm crests) |
| Stroke width | 1.5-2px |
| Color | `currentColor` (inherits) |
| Format | SVG with viewBox |

### Texture Standards
| Property | Value |
|----------|-------|
| Opacity | 5-15% |
| Blend mode | multiply or overlay |
| Repeat | tile or cover |
| Format | WebP preferred, PNG fallback |

### Font Standards
| Property | Value |
|----------|-------|
| Display | swap (prevent FOIT) |
| Preload | Yes (critical weights) |
| Subset | Latin (reduce size) |

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Font file size | < 50KB per weight | Subset to Latin |
| Texture file size | < 30KB each | Optimized WebP |
| Icon sprite size | < 20KB total | SVG optimized |
| Largest Contentful Paint | < 2.5s | No regression |
| Cumulative Layout Shift | < 0.1 | font-display: swap |
| Total added assets | < 200KB | All new assets combined |

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| SVG icons | ✓ | ✓ | ✓ | ✓ |
| WOFF2 fonts | ✓ | ✓ | ✓ | ✓ |
| WebP images | ✓ | ✓ | ✓ | ✓ |
| CSS blend modes | ✓ | ✓ | ✓ | ✓ |
| CSS custom properties | ✓ | ✓ | ✓ | ✓ |

## Release Criteria Checklist

### Functionality
- [ ] VD-01: All emoji icons replaced with SVG
- [ ] VD-01: Icons scale correctly at different sizes
- [ ] VD-01: Icons inherit color from parent
- [ ] VD-02: Textures visible on cards
- [ ] VD-02: Textures don't obscure text
- [ ] VD-03: Cinzel font loads successfully
- [ ] VD-03: Headings display in Cinzel
- [ ] VD-03: Fallback works when font fails
- [ ] VD-06: Realm colors apply when class selected
- [ ] VD-06: Smooth transition between realms
- [ ] VD-06: All targeted elements receive theme

### Testing
- [ ] Visual regression tests (if available)
- [ ] Manual visual inspection across browsers
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility testing (color contrast)
- [ ] All existing tests still pass

### Performance
- [ ] No Lighthouse score regression
- [ ] Fonts load without FOUT/FOIT
- [ ] Textures don't cause layout shifts
- [ ] Total asset size within target

### Accessibility
- [ ] Text remains readable over textures
- [ ] Icons have appropriate aria-labels
- [ ] Color contrast meets WCAG AA
- [ ] Focus states remain visible with themes

## Testing Strategy

### Visual Testing
| Test | Method | Criteria |
|------|--------|----------|
| Icon rendering | Manual | All icons display correctly |
| Font loading | Manual + DevTools | Cinzel loads, fallback works |
| Texture visibility | Manual | Subtle but visible |
| Realm theming | Manual | Colors apply consistently |

### Performance Testing
| Tool | Metric | Target |
|------|--------|--------|
| Lighthouse | Performance | > 90 |
| Lighthouse | LCP | < 2.5s |
| Chrome DevTools | Network | < 200KB added |
| WebPageTest | TTFB | No regression |

### Cross-Browser Testing
| Browser | Priority | Notes |
|---------|----------|-------|
| Chrome | High | Primary dev browser |
| Firefox | High | Different rendering engine |
| Safari | Medium | WebKit differences |
| Edge | Low | Chromium-based |

## Known Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Font loading delay | Medium | Preload, font-display: swap |
| Texture performance | Low | Optimize, test on low-end |
| Icon color inheritance | Low | Test with all themes |
| SVG compatibility | Low | Test across browsers |
| Asset bloat | Medium | Set size budgets, optimize |

## Future Considerations (Out of Scope)

- VD-04: Ability Card Animations (v0.9.0)
- VD-05: Particle Effects (v0.9.0)
- Icon animations on hover
- Seasonal/event themes
- User-selectable themes

## Related Documentation

- [VD-01 Custom SVG Icons](./VD-01-custom-svg-icons.md)
- [VD-02 Background Textures](./VD-02-background-textures.md)
- [VD-03 Custom Medieval Font](./VD-03-custom-medieval-font.md)
- [VD-06 Realm-specific Themes](./VD-06-realm-specific-themes.md)
