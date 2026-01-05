# VD-02: Background Textures

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | VD-02 |
| **Name** | Background Textures |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Visual Design |
| **Complexity** | Low |

## Description

Add subtle medieval-themed background textures to enhance the visual depth and atmosphere of the application. Textures should be subtle enough to not interfere with readability while adding a tactile, parchment-like quality to the interface.

## User Story

> As a user of Camelot Builder,
> I want the interface to have subtle textures,
> So that it feels more like an authentic medieval document or artifact.

## Acceptance Criteria

- [ ] Subtle parchment texture applied to card backgrounds
- [ ] Optional stone texture for header area
- [ ] Noise overlay for visual depth on main background
- [ ] Textures don't interfere with text readability
- [ ] Textures don't cause performance issues
- [ ] Textures work with light and dark themes
- [ ] Total texture assets under 100KB
- [ ] Textures tile seamlessly (if tiled)

## Current State Audit

### What Exists
| Element | Current Style | Status |
|---------|---------------|--------|
| Body background | Gradient (#1a1a2e → #16213e → #0f0f1a) | Solid gradient |
| Card backgrounds | Solid color with shadow | Flat appearance |
| Header | Transparent | No texture |
| Sections | Border + shadow | No texture |

### Current Background CSS

```css
/* index.css */
body {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
  background-attachment: fixed;
}

/* App.css - Cards */
.section-card {
  background: linear-gradient(
    135deg,
    var(--color-bg-card) 0%,
    var(--color-bg-secondary) 100%
  );
}
```

### What's Missing
| Gap | Impact |
|-----|--------|
| No texture overlays | Flat, digital appearance |
| No depth variation | Less immersive feel |
| No parchment effect | Missing medieval aesthetic |

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/assets/textures/parchment.webp` | Card texture overlay |
| `src/assets/textures/parchment.png` | Fallback for older browsers |
| `src/assets/textures/noise.svg` | Noise pattern for depth |
| `src/assets/textures/stone.webp` | Optional header texture |

### Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add noise overlay to body |
| `src/App.css` | Add parchment texture to cards |

### Directory Structure

```
src/assets/textures/
├── parchment.webp     # ~20KB, 256x256 tileable
├── parchment.png      # ~30KB fallback
├── noise.svg          # <2KB, inline-able
└── stone.webp         # ~25KB, optional
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Background Texture Layers                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Body Background (bottom layer)                                    │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  linear-gradient(135deg, #1a1a2e, #16213e, #0f0f1a)        │  │
│   │  + noise.svg overlay (5% opacity, multiply)                 │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Header (optional stone texture)                                   │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  background-color + stone.webp (10% opacity, overlay)       │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Cards (parchment texture)                                         │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  ┌─────────────────────────────────────────────────────┐   │  │
│   │  │  Card Content Layer                                  │   │  │
│   │  │  - Text, buttons, etc.                              │   │  │
│   │  └─────────────────────────────────────────────────────┘   │  │
│   │  Parchment texture (8% opacity, multiply blend)            │  │
│   │  Base gradient color                                        │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Layer Order (bottom to top):                                      │
│   1. Body gradient                                                  │
│   2. Body noise overlay (::before pseudo-element)                  │
│   3. Cards with parchment texture                                  │
│   4. Card content                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Texture Specifications

### Parchment Texture

| Property | Value |
|----------|-------|
| Size | 256x256px (tileable) |
| Format | WebP primary, PNG fallback |
| File size | < 25KB |
| Opacity | 5-10% |
| Blend mode | multiply |
| Color | Grayscale (works with any theme) |

### Noise Texture

| Property | Value |
|----------|-------|
| Format | Inline SVG |
| Pattern | fractalNoise filter |
| Opacity | 3-5% |
| File size | < 2KB (inline) |

### Stone Texture (Optional)

| Property | Value |
|----------|-------|
| Size | 512x512px (tileable) |
| Format | WebP |
| File size | < 30KB |
| Opacity | 8-12% |
| Usage | Header only |

## CSS Implementation

### Body Noise Overlay

```css
/* src/index.css */

/* SVG noise pattern (inline) */
body {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
  background-attachment: fixed;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.04;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Ensure content is above noise */
body > * {
  position: relative;
  z-index: 1;
}
```

### Card Parchment Texture

```css
/* src/App.css */

/* Cards with parchment texture */
.section-card,
.class-card,
.ability-card {
  position: relative;
  overflow: hidden;
}

.section-card::before,
.class-card::before,
.ability-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url('../assets/textures/parchment.webp');
  background-size: 256px 256px;
  background-repeat: repeat;
  z-index: 1;
}

/* Fallback for browsers without WebP support */
@supports not (background-image: url('test.webp')) {
  .section-card::before,
  .class-card::before,
  .ability-card::before {
    background-image: url('../assets/textures/parchment.png');
  }
}

/* Ensure card content is above texture */
.section-card > *,
.class-card > *,
.ability-card > * {
  position: relative;
  z-index: 2;
}

/* Disable texture on performance preference */
@media (prefers-reduced-motion: reduce) {
  .section-card::before,
  .class-card::before,
  .ability-card::before {
    display: none;
  }
}
```

### Optional Header Stone Texture

```css
/* src/App.css */

.app-header {
  position: relative;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.1;
  mix-blend-mode: overlay;
  background-image: url('../assets/textures/stone.webp');
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.app-header > * {
  position: relative;
  z-index: 1;
}
```

## Light Theme Adjustments

```css
/* Adjust texture for light theme */
@media (prefers-color-scheme: light) {
  body::before {
    opacity: 0.02; /* Lighter noise */
  }

  .section-card::before,
  .class-card::before,
  .ability-card::before {
    opacity: 0.05; /* Subtler parchment */
    mix-blend-mode: darken; /* Better for light backgrounds */
  }
}
```

## Texture Creation Guide

### Creating Parchment Texture

```
1. Start with a neutral gray base (128, 128, 128)
2. Add noise layer (Gaussian, 5-10%)
3. Add subtle paper fiber texture
4. Apply slight vignette (darker edges)
5. Ensure seamless tiling
6. Export as:
   - WebP at 80% quality (~20KB)
   - PNG-8 with 64 colors (~30KB fallback)
7. Dimensions: 256x256px (power of 2 for tiling)
```

### Creating Noise SVG

```xml
<!-- noise.svg -->
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <filter id="noise">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.65"
      numOctaves="3"
      stitchTiles="stitch"
    />
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" />
</svg>
```

### Texture Asset Sources

| Option | Notes |
|--------|-------|
| Create custom | Most control, requires design skills |
| Subtle Patterns | subtlepatterns.com (free, check license) |
| Textures.com | High quality (check license) |
| Generate with CSS | Pure CSS noise (performance impact) |

## Performance Considerations

### File Size Budget

| Asset | Max Size | Actual Target |
|-------|----------|---------------|
| parchment.webp | 30KB | ~20KB |
| parchment.png | 40KB | ~30KB |
| noise.svg | 2KB | Inline (~0.5KB) |
| stone.webp | 35KB | ~25KB |
| **Total** | 107KB | ~75KB |

### Rendering Performance

| Concern | Mitigation |
|---------|------------|
| GPU compositing | Use transform: translateZ(0) |
| Blend mode cost | Limit to key elements |
| Repaints | Fixed positioning for overlays |
| Mobile performance | Test on low-end devices |

### Loading Strategy

```css
/* Preload textures */
@supports (background-image: url('test.webp')) {
  body {
    /* Modern browsers get WebP */
  }
}

/* Consider lazy loading textures */
/* Only load when elements are in viewport */
```

## Accessibility Considerations

### Text Readability

| Check | Requirement |
|-------|-------------|
| Contrast ratio | Maintain WCAG AA (4.5:1 for text) |
| Texture opacity | Keep low enough to not obscure |
| Text backgrounds | Solid or semi-transparent overlay |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Remove all texture overlays */
  body::before,
  .section-card::before,
  .class-card::before,
  .ability-card::before {
    display: none;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  /* Remove textures for maximum contrast */
  body::before,
  .section-card::before {
    display: none;
  }
}
```

## Testing Strategy

### Visual Testing

| Test | Method | Criteria |
|------|--------|----------|
| Texture visibility | Manual | Subtle but noticeable |
| Text readability | Manual | All text remains clear |
| Tiling seamless | Manual | No visible seams |
| Color harmony | Manual | Works with theme colors |

### Performance Testing

| Test | Tool | Target |
|------|------|--------|
| GPU usage | Chrome DevTools | No excessive layers |
| FPS | Performance monitor | 60fps maintained |
| Memory | DevTools Memory | No memory leaks |
| Mobile | Real devices | Smooth on mid-range |

### Accessibility Testing

| Test | Tool | Target |
|------|------|--------|
| Contrast ratio | axe DevTools | WCAG AA |
| Reduced motion | Browser setting | Textures disabled |
| Screen reader | VoiceOver/NVDA | No interference |

## Deliverable Checklist

### Assets
- [ ] parchment.webp created and optimized
- [ ] parchment.png fallback created
- [ ] noise.svg created (or inline)
- [ ] stone.webp created (optional)
- [ ] All assets under size budget

### CSS Implementation
- [ ] Body noise overlay added
- [ ] Card parchment texture added
- [ ] Light theme adjustments
- [ ] Reduced motion support
- [ ] High contrast support
- [ ] WebP fallback support

### Testing
- [ ] Visual testing complete
- [ ] Performance testing complete
- [ ] Accessibility testing complete
- [ ] Cross-browser testing complete

## Known Issues & Future Improvements

### Current Limitations
- Static textures only (no animation)
- Same texture for all card types
- No texture customization option

### Future Enhancements
- Animated subtle paper grain
- Different textures per section
- User preference to disable
- Realm-specific texture tints
- Seasonal texture variations

## Code Reference

### Complete Body Texture CSS

```css
/* src/index.css - Body with noise texture */

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-bg-primary) 0%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-attachment: fixed;
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  line-height: var(--line-height-normal);
  position: relative;
}

/* Noise overlay */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.04;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

#root {
  position: relative;
  z-index: 1;
}

/* Disable for reduced motion */
@media (prefers-reduced-motion: reduce) {
  body::before {
    display: none;
  }
}

/* Adjust for light theme */
@media (prefers-color-scheme: light) {
  body::before {
    opacity: 0.02;
  }
}
```

### Complete Card Texture CSS

```css
/* src/App.css - Cards with parchment texture */

.section-card,
.ability-card,
.class-card {
  position: relative;
  overflow: hidden;
  isolation: isolate; /* Create stacking context */
}

.section-card::before,
.ability-card::before,
.class-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url('../assets/textures/parchment.webp');
  background-size: 256px 256px;
  background-repeat: repeat;
  z-index: -1;
}

/* WebP fallback */
@supports not (background-image: url('_.webp')) {
  .section-card::before,
  .ability-card::before,
  .class-card::before {
    background-image: url('../assets/textures/parchment.png');
  }
}

/* Disable for accessibility preferences */
@media (prefers-reduced-motion: reduce), (prefers-contrast: high) {
  .section-card::before,
  .ability-card::before,
  .class-card::before {
    display: none;
  }
}
```
