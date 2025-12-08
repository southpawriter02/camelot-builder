# Camelot Builder: GUI/UX Enhancement Proposal

## 1. Executive Summary
The goal of this proposal is to elevate the "Camelot Builder" from a functional prototype to a polished, immersive tool for *Dark Age of Camelot* players. We will lean into the **"Dark Medieval"** aesthetic while prioritizing usability through clear controls (`+/-` buttons), improved information density (grid layouts), and professional iconography.

---

## 2. Design System

### 2.1. Color Palette
We will refine the existing variable-based palette to increase contrast and "richness".

| Token | Proposed Value | Usage |
| :--- | :--- | :--- |
| `bg-primary` | `#0f1115` | Main application background (Deep Charcoal) |
| `bg-card` | `#1a1d26` | Card background |
| `bg-header` | `#232730` | Headers and section titles |
| `accent-gold` | `#c6a55f` | Primary accent, borders, active states |
| `accent-gold-glow` | `rgba(198, 165, 95, 0.15)` | Hover states and selection glows |
| `text-primary` | `#e2e2e2` | Main readability |
| `text-muted` | `#9ca3af` | Secondary text, descriptions |
| `border-subtle` | `#323844` | Dividers and inactive borders |
| `realm-albion` | `#3b82f6` | Albion highlights |
| `realm-midgard` | `#ef4444` | Midgard highlights |
| `realm-hibernia` | `#22c55e` | Hibernia highlights |

### 2.2. Typography
To reinforce the theme, we will integrate Google Fonts:
*   **Headings**: [Cinzel](https://fonts.google.com/specimen/Cinzel) (weights: 600, 700). A serif font with a classic, epic feel.
*   **Body**: [Lato](https://fonts.google.com/specimen/Lato) or [Inter](https://fonts.google.com/specimen/Inter) (weights: 400, 500). Clean sans-serif for high readability on ability descriptions.

### 2.3. Iconography
Replace all emojis with SVG icons.
**Recommendation**: Use `lucide-react` for UI elements and a curated set of SVGs (or `lucide-react` approximations) for game concepts.

*   **UI Icons**: `Plus`, `Minus`, `Trash2`, `RotateCcw`, `Info`, `Search`.
*   **Tree Icons**:
    *   *Smiting/Combat*: `Sword` or `Zap`
    *   *Healing*: `Heart` or `PlusCircle`
    *   *Nature*: `Leaf`
    *   *Subterranean*: `Mountain` or `Pickaxe`

---

## 3. UX & Layout Improvements

### 3.1. Grid Layout for Abilities
**Current Issue**: The vertical list wastes horizontal space on desktop and requires excessive scrolling.
**Proposed Solution**:
*   Implement a responsive **Grid Layout** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
*   Abilities within a tree are displayed as cards in this grid.

### 3.2. Refined Ability Card
The ability card is the core interaction point.
**New Layout Specification**:
```
+-------------------------------------------------------+
|  [Icon]  Ability Name                [Rank: 2/5]      |
+-------------------------------------------------------+
|  Description text goes here...                        |
|  (Truncated with "Show more" or Tooltip for long text)|
+-------------------------------------------------------+
|  Next Rank: +5 Dex (Cost: 2)                          |
+-------------------------------------------------------+
|  [ - ]  [Progress Bar: 40%]            [ + 2 pts ]    |
+-------------------------------------------------------+
```

**Interaction Controls**:
*   **Purchase (`+`)**: A distinct button on the right.
    *   *Label*: Should show the cost (e.g., "+ 2").
    *   *State*: Disabled if unaffordable or maxed.
    *   *Hover*: Glows gold.
*   **Refund (`-`)**: A distinct button on the left.
    *   *State*: Disabled if Rank is 0.
    *   *Visual*: Subtle/muted until hovered (red glow on hover).
*   **Progress Bar**: Visualizes `Current Rank / Max Rank`.

### 3.3. Information Density
*   **Tooltips**: Move detailed "Next Rank" descriptions to a tooltip/popover interaction on desktop to clean up the card UI.
*   **Sticky Summary**: Ensure the "Build Summary" (sidebar) remains sticky on desktop so users always see their remaining points.

---

## 4. Component Implementation Specifications

### 4.1. `ClassSelector`
*   **Visual**: Transform into a "Hero" selection banner.
*   **Interaction**:
    *   Cards should have a subtle scale effect (`transform: scale(1.02)`) on hover.
    *   Selected class should have a "Golden Border" and a distinct background texture or gradient.

### 4.2. `AbilityTree` Container
*   **Filtering**: Add a simple text input "Search abilities..." at the top of the tree section.
*   **Tabs (Optional)**: If a class has many trees, consider a Tabbed interface (`[Smiting] [Healing] [Enhancement]`) for mobile devices to reduce scrolling.

### 4.3. `BuildSummary`
*   **Visual**: Make it look like a parchment or inventory scroll.
*   **Compact Mode**: List purchased abilities in a condensed table format:
    *   `Augment Dex` ... `Rank 3`
    *   `Serenity` ........... `Rank 1`

---

## 5. Technical Implementation Plan

### 5.1. Dependencies
Add the following packages:
```bash
npm install lucide-react clsx tailwind-merge
```
*(Note: `clsx` and `tailwind-merge` are useful helpers even with standard CSS modules for conditional class handling).*

### 5.2. CSS Architecture
Organize `index.css` or split into CSS Modules:
1.  `variables.css`: Define colors, fonts, spacing.
2.  `components/AbilityCard.module.css`: Specific styles for the card to ensure encapsulation.
3.  `layout.css`: Grid systems and responsive containers.

### 5.3. Accessibility (A11y)
*   Ensure `+` and `-` buttons have `aria-label="Purchase rank of [Ability Name]"` and `aria-label="Refund rank of [Ability Name]"`.
*   Ensure color contrast ratios between text (gray/white) and background (dark charcoal) meet WCAG AA standards.

---

## 6. Next Steps
1.  Approve this proposal.
2.  Developer installs icon libraries.
3.  Refactor `AbilityCard` component first (atomic change).
4.  Apply Grid Layout to `AbilityTree`.
5.  Apply Global Theme/CSS updates.
