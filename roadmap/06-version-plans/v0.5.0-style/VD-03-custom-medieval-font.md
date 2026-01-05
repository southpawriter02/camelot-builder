# VD-03: Custom Medieval Font

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | VD-03 |
| **Name** | Custom Medieval Font |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | Visual Design |
| **Complexity** | Low |

## Description

Load and apply the Cinzel font for headings throughout the application. Cinzel is a classical serif font inspired by Roman inscriptions, providing an authentic medieval/fantasy aesthetic that's already defined in the CSS but not currently loaded.

## User Story

> As a user of Camelot Builder,
> I want headings to display in an elegant medieval-style font,
> So that the application feels more thematically immersive.

## Acceptance Criteria

- [ ] Cinzel font loads from Google Fonts
- [ ] All headings (h1, h2, h3) display in Cinzel
- [ ] Font loads without blocking page render (font-display: swap)
- [ ] Fallback to serif fonts works when Cinzel unavailable
- [ ] No Flash of Unstyled Text (FOUT) or minimal
- [ ] Font preloaded for critical weights
- [ ] Total font file size under 100KB

## Current State Audit

### What Exists
| Element | Current Definition | Actual Rendering |
|---------|-------------------|------------------|
| CSS Variable | `--font-family-heading: 'Cinzel', 'Times New Roman', serif` | Falls back to serif |
| h1 usage | Uses `--font-family-heading` | Times New Roman/serif |
| h2 usage | Uses `--font-family-heading` | Times New Roman/serif |
| h3 usage | Uses `--font-family-heading` | Times New Roman/serif |

### Current Font CSS

```css
/* src/index.css */
:root {
  --font-family-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-family-heading: 'Cinzel', 'Times New Roman', serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}
```

### What's Missing
| Gap | Impact |
|-----|--------|
| Font not loaded | Falls back to serif |
| No preload | Potential FOUT |
| No font-display | May block render |

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add Google Fonts link and preload |
| `src/index.css` | Add @font-face fallback (optional) |

### Font Selection

| Font | Weights | Usage |
|------|---------|-------|
| Cinzel | 400, 600, 700 | Main headings |
| Cinzel Decorative | 400 (optional) | Special titles |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Font Loading Strategy                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   index.html                                                        │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  <head>                                                      │  │
│   │    <!-- Preconnect to Google Fonts -->                      │  │
│   │    <link rel="preconnect" href="fonts.googleapis.com">      │  │
│   │    <link rel="preconnect" href="fonts.gstatic.com">         │  │
│   │                                                              │  │
│   │    <!-- Preload critical font weight -->                     │  │
│   │    <link rel="preload" as="font" ...>                       │  │
│   │                                                              │  │
│   │    <!-- Load Google Fonts stylesheet -->                     │  │
│   │    <link href="fonts.googleapis.com/css2?..." rel="style">  │  │
│   │  </head>                                                     │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   Font Loading Timeline                                             │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 1. Browser starts parsing HTML                               │  │
│   │ 2. Preconnect establishes connection to fonts.googleapis.com │  │
│   │ 3. Preload begins fetching critical font weight              │  │
│   │ 4. CSS loads with @font-face rules                          │  │
│   │ 5. font-display: swap shows fallback immediately            │  │
│   │ 6. Cinzel swaps in when loaded                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   CSS Application                                                   │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  h1, h2, h3 {                                                │  │
│   │    font-family: 'Cinzel', 'Times New Roman', serif;         │  │
│   │  }                                                           │  │
│   │                                                              │  │
│   │  Fallback chain:                                             │  │
│   │  1. Cinzel (loaded from Google Fonts)                       │  │
│   │  2. Times New Roman (system)                                │  │
│   │  3. serif (generic)                                         │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Implementation Options

### Option A: Google Fonts CDN (Recommended)

**Pros:** Simple, cached across sites, automatic optimization
**Cons:** External dependency, potential privacy concerns

```html
<!-- index.html -->
<head>
  <!-- Preconnect for faster loading -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Load Cinzel font -->
  <link
    href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap"
    rel="stylesheet"
  >
</head>
```

### Option B: Self-Hosted Fonts

**Pros:** No external dependency, full control
**Cons:** More setup, larger bundle

```css
/* src/fonts/fonts.css */
@font-face {
  font-family: 'Cinzel';
  src: url('./Cinzel-Regular.woff2') format('woff2'),
       url('./Cinzel-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Cinzel';
  src: url('./Cinzel-SemiBold.woff2') format('woff2'),
       url('./Cinzel-SemiBold.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Cinzel';
  src: url('./Cinzel-Bold.woff2') format('woff2'),
       url('./Cinzel-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Option C: Variable Font (Best Performance)

**Pros:** Single file, all weights
**Cons:** Larger single file, less browser support

```css
@font-face {
  font-family: 'Cinzel';
  src: url('./Cinzel-Variable.woff2') format('woff2-variations');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

## Recommended Implementation (Option A)

### Step 1: Update index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Preconnect to Google Fonts for faster loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Load Cinzel font with display=swap for no FOIT -->
    <link
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap"
      rel="stylesheet"
    >

    <title>Camelot Builder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 2: Verify CSS (Already Correct)

```css
/* src/index.css - No changes needed */
:root {
  --font-family-heading: 'Cinzel', 'Times New Roman', serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}
```

### Step 3: Optional - Add Cinzel Decorative

```html
<!-- For special decorative elements -->
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative&display=swap"
  rel="stylesheet"
>
```

```css
.decorative-title {
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
}
```

## Font Weights Usage

| Weight | CSS Value | Usage |
|--------|-----------|-------|
| Regular | 400 | h3, subtitles |
| Semi-Bold | 600 | h2, section headers |
| Bold | 700 | h1, main title |

```css
/* Explicit weight usage */
h1 {
  font-family: var(--font-family-heading);
  font-weight: 700; /* Bold */
}

h2 {
  font-family: var(--font-family-heading);
  font-weight: 600; /* Semi-Bold */
}

h3 {
  font-family: var(--font-family-heading);
  font-weight: 400; /* Regular */
}
```

## Performance Optimization

### Preload Critical Font

```html
<!-- Preload the most important weight (Bold for h1) -->
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnfY3lCQ.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

### Subset to Latin Only

Google Fonts automatically subsets, but for self-hosted:

```bash
# Using glyphhanger or fonttools
pyftsubset Cinzel-Bold.ttf --unicodes="U+0000-00FF" --output-file="Cinzel-Bold-Latin.woff2"
```

### Font Loading API (Advanced)

```javascript
// Optional: Detect when font is loaded
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});

// Or check specific font
document.fonts.load('700 1em Cinzel').then(() => {
  console.log('Cinzel Bold loaded');
});
```

## Performance Metrics

### File Sizes (Approximate)

| Font File | Size |
|-----------|------|
| Cinzel Regular (Latin) | ~18KB |
| Cinzel SemiBold (Latin) | ~18KB |
| Cinzel Bold (Latin) | ~18KB |
| **Total** | ~54KB |

### Loading Performance Targets

| Metric | Target |
|--------|--------|
| Time to swap | < 100ms (with preload) |
| CLS impact | < 0.05 |
| Total font size | < 60KB |

## Accessibility Considerations

### Font Readability

| Check | Requirement |
|-------|-------------|
| Size | Minimum 16px for body, larger for Cinzel headings |
| Contrast | Maintain WCAG AA (4.5:1) |
| Weight | Use appropriate weights for hierarchy |

### User Preferences

```css
/* Respect user font preferences */
@media (prefers-reduced-data: reduce) {
  /* Skip loading web fonts */
  :root {
    --font-family-heading: 'Times New Roman', serif;
  }
}
```

### Dyslexia-Friendly Alternative

```css
/* Optional toggle for accessibility */
.dyslexia-friendly h1,
.dyslexia-friendly h2,
.dyslexia-friendly h3 {
  font-family: system-ui, sans-serif;
  letter-spacing: 0.05em;
}
```

## Testing Strategy

### Font Loading Tests

| Test | Method | Criteria |
|------|--------|----------|
| Font loads | DevTools Network | Cinzel files downloaded |
| Font applies | Visual inspection | Headings use Cinzel |
| Fallback works | Block Cinzel | Times New Roman shows |
| FOUT minimal | Slow 3G test | Acceptable swap delay |

### Cross-Browser Testing

| Browser | Check |
|---------|-------|
| Chrome | Font loads and renders |
| Firefox | Font loads and renders |
| Safari | Font loads and renders |
| Edge | Font loads and renders |

### Performance Testing

| Tool | Metric | Target |
|------|--------|--------|
| Lighthouse | Font display | No font-related warnings |
| WebPageTest | FOUT duration | < 200ms |
| Chrome DevTools | Network | < 60KB fonts |

## Deliverable Checklist

### Implementation
- [ ] Google Fonts link added to index.html
- [ ] Preconnect links added
- [ ] font-display: swap confirmed
- [ ] All heading weights available (400, 600, 700)

### Verification
- [ ] h1 displays in Cinzel Bold
- [ ] h2 displays in Cinzel SemiBold
- [ ] h3 displays in Cinzel Regular
- [ ] Fallback works when offline

### Performance
- [ ] Font files cached
- [ ] No significant CLS
- [ ] Total size under budget

### Accessibility
- [ ] Readability maintained
- [ ] Contrast ratios unchanged
- [ ] Fallback fonts acceptable

## Known Issues & Future Improvements

### Current Limitations
- Relies on external CDN (Google Fonts)
- No offline support without service worker
- Single font family only

### Future Enhancements
- Self-host fonts for offline support
- Add Cinzel Decorative for special elements
- Variable font for more weight options
- Font loading indicator/skeleton

## Code Reference

### Complete index.html Head

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Camelot Builder - Dark Age of Camelot Character Builder" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />

    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Load Cinzel font family -->
    <link
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap"
      rel="stylesheet"
    >

    <title>Camelot Builder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Font-Related CSS Variables

```css
/* src/index.css */
:root {
  /* Typography - Font Families */
  --font-family-primary: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-heading: 'Cinzel', 'Times New Roman', Georgia, serif;

  /* Typography - Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* Headings with Cinzel */
h1 {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-4xl);
}

h2 {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
}

h3 {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-lg);
  text-transform: capitalize;
}
```

### Self-Hosted Alternative

```css
/* src/fonts/cinzel.css - If self-hosting */
@font-face {
  font-family: 'Cinzel';
  src: url('./fonts/Cinzel-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA;
}

@font-face {
  font-family: 'Cinzel';
  src: url('./fonts/Cinzel-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA;
}

@font-face {
  font-family: 'Cinzel';
  src: url('./fonts/Cinzel-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA;
}
```
