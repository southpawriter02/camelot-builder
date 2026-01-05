# SM-01: Loading States

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | SM-01 |
| **Name** | Loading States |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | State Management |
| **Complexity** | Low |

## Description

Display skeleton loaders during data initialization and loading to provide visual feedback to users while content is being prepared.

## User Story

> As a user loading the application,
> I want to see visual feedback while data is loading,
> So that I know the application is working and what content to expect.

## Acceptance Criteria

- [ ] Skeleton components match the shape of actual content
- [ ] Skeleton shows during initial app load
- [ ] Skeleton shows when class data is loading
- [ ] Skeleton shows when ability data is loading
- [ ] Smooth pulse animation on skeleton elements
- [ ] No layout shift when real content loads
- [ ] Minimum display time to prevent flicker (300ms)

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/Skeleton.tsx` | Skeleton component variants |
| `src/components/Skeleton.css` | Skeleton styling and animations |
| `src/components/Skeleton.test.tsx` | Unit tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/ClassSelector.tsx` | Add loading state with skeleton |
| `src/components/AbilityTree.tsx` | Add loading state with skeleton |
| `src/components/BuildSummary.tsx` | Add loading state with skeleton |
| `src/App.tsx` | Manage loading state |

### Interfaces

```typescript
// src/components/Skeleton.tsx
interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'progress' | 'button';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

interface SkeletonCardProps {
  showHeader?: boolean;
  lines?: number;
}
```

### Component Structure

```tsx
// Skeleton.tsx - Base component
export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

// Preset: Card skeleton
export function SkeletonCard({ showHeader = true, lines = 3 }: SkeletonCardProps) {
  return (
    <div className="skeleton-card">
      {showHeader && <Skeleton variant="text" width="60%" height={24} />}
      <Skeleton variant="text" count={lines} />
    </div>
  );
}

// Preset: Ability card skeleton
export function SkeletonAbilityCard() {
  return (
    <div className="skeleton-ability-card">
      <Skeleton variant="circle" width={40} height={40} />
      <div className="skeleton-ability-content">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="40%" height={12} />
      </div>
    </div>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Loading States                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   App Loading State                                                 │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ isLoading = true                                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│              │                                                      │
│              ▼                                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                   Conditional Rendering                      │  │
│   │                                                              │  │
│   │   isLoading ?                                                │  │
│   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │  │
│   │   │  Skeleton   │    │  Skeleton   │    │  Skeleton   │    │  │
│   │   │  Class      │    │  Ability    │    │  Summary    │    │  │
│   │   │  Selector   │    │  Tree       │    │  Panel      │    │  │
│   │   └─────────────┘    └─────────────┘    └─────────────┘    │  │
│   │                                                              │  │
│   │   : (loaded)                                                 │  │
│   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │  │
│   │   │  Class      │    │  Ability    │    │  Build      │    │  │
│   │   │  Selector   │    │  Tree       │    │  Summary    │    │  │
│   │   └─────────────┘    └─────────────┘    └─────────────┘    │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Skeleton Variants

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Skeleton Variants                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   TEXT (default)                                                    │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│   └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   CARD                                                              │
│   ╔════════════════════════════════════════════════════════════╗   │
│   ║ ░░░░░░░░░░░░░░░░░░░░                                       ║   │
│   ║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║   │
│   ║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║   │
│   ║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║   │
│   ╚════════════════════════════════════════════════════════════╝   │
│                                                                     │
│   CIRCLE                                                            │
│   ┌──────┐                                                          │
│   │ ░░░░ │                                                          │
│   │ ░░░░ │                                                          │
│   └──────┘                                                          │
│                                                                     │
│   PROGRESS                                                          │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│   └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   BUTTON                                                            │
│   ┌────────────────────┐                                           │
│   │ ░░░░░░░░░░░░░░░░░░ │                                           │
│   └────────────────────┘                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Component-Specific Skeletons

### ClassSelector Skeleton

```
┌─────────────────────────────────────────────────────────────┐
│  Select Class                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────┐ ┌───────────────────┐               │
│  │ ░░░░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░░░░ │               │
│  │ ░░░░░░░░░░░       │ │ ░░░░░░░░░░░       │               │
│  └───────────────────┘ └───────────────────┘               │
│                                                             │
│  ┌───────────────────┐ ┌───────────────────┐               │
│  │ ░░░░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░░░░ │               │
│  │ ░░░░░░░░░░░       │ │ ░░░░░░░░░░░       │               │
│  └───────────────────┘ └───────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### AbilityTree Skeleton

```
┌─────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░ Tree                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⬤  ░░░░░░░░░░░░░░░░░░                               │   │
│  │    ░░░░░░░░░░░                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⬤  ░░░░░░░░░░░░░░░░░░░░░░                           │   │
│  │    ░░░░░░░░░                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⬤  ░░░░░░░░░░░░░░░░                                 │   │
│  │    ░░░░░░░░░░░░░                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### BuildSummary Skeleton

```
┌─────────────────────────────────────────────────────────────┐
│  Build Summary                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ░░░░░░░░░░░░░░░                                           │
│  ░░░░░░░░░                                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## CSS Styling

```css
/* Skeleton.css */

.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Variants */
.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-text:last-child {
  margin-bottom: 0;
}

.skeleton-card {
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-secondary);
}

.skeleton-circle {
  border-radius: 50%;
}

.skeleton-progress {
  height: 8px;
  border-radius: 4px;
}

.skeleton-button {
  height: 36px;
  border-radius: 4px;
  width: 100px;
}

/* Preset: Ability card */
.skeleton-ability-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 8px;
}

.skeleton-ability-content {
  flex: 1;
}

/* CSS Variables for theming */
:root {
  --skeleton-base: #e0e0e0;
  --skeleton-highlight: #f5f5f5;
}

/* Dark mode */
[data-theme="dark"] {
  --skeleton-base: #2a2a2a;
  --skeleton-highlight: #3a3a3a;
}
```

## Decision Tree

```
App starts loading
        │
        ▼
┌───────────────────┐
│ Set isLoading     │
│ = true            │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Render skeleton   │
│ components        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Fetch data        │
│ (classes, etc)    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────────────────────────┐
│ Data loaded?                          │
├───────────────────────────────────────┤
│ No  → Continue showing skeleton       │
│ Yes → Check minimum display time      │
└─────────┬─────────────────────────────┘
          │ yes + time elapsed
          ▼
┌───────────────────┐
│ Set isLoading     │
│ = false           │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Render actual     │
│ content           │
└───────────────────┘
```

## Integration Points

### With App.tsx

```tsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const loadStartTime = useRef(Date.now());

  useEffect(() => {
    // Simulate or actual data loading
    loadData().then(() => {
      const elapsed = Date.now() - loadStartTime.current;
      const remaining = Math.max(0, 300 - elapsed); // Min 300ms display

      setTimeout(() => setIsLoading(false), remaining);
    });
  }, []);

  if (isLoading) {
    return <AppSkeleton />;
  }

  return <ActualApp />;
}
```

### With ClassSelector

```tsx
function ClassSelector({ classes, isLoading }) {
  if (isLoading) {
    return (
      <div className="class-selector">
        <h2>Select Class</h2>
        <div className="class-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
      </div>
    );
  }

  return (
    // Actual content
  );
}
```

## Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                     Loading State Flow                             │
└────────────────────────────────────────────────────────────────────┘

  Time    App State           UI                    Data
   │
   │      isLoading=true      ┌──────────────┐
   │      ─────────────────►  │   Skeleton   │
   │                          │   Display    │
   │                          └──────────────┘
   │                                 │
   │      Data fetching...           │        fetchClasses()
   │      ◄──────────────────────────┼────────────────────►
   │                                 │
   │                                 │        fetchAbilities()
   │      ◄──────────────────────────┼────────────────────►
   │                                 │
   │      300ms elapsed?             │
   │      ◄──────────────────────────┤
   │                                 │
   │      isLoading=false     ┌──────────────┐
   │      ─────────────────►  │   Actual     │
   │                          │   Content    │
   │                          └──────────────┘
   ▼
```

## Testing Strategy

### Unit Tests (Skeleton.test.tsx)

```typescript
describe('Skeleton', () => {
  describe('base component', () => {
    it('renders with default text variant');
    it('renders with specified variant class');
    it('applies custom width and height');
    it('renders multiple skeletons with count prop');
    it('has aria-hidden for accessibility');
  });

  describe('SkeletonCard', () => {
    it('renders header when showHeader is true');
    it('hides header when showHeader is false');
    it('renders specified number of lines');
  });

  describe('SkeletonAbilityCard', () => {
    it('renders circle and text elements');
    it('has correct layout structure');
  });

  describe('styling', () => {
    it('applies pulse animation');
    it('has correct border-radius for each variant');
  });
});
```

### Integration Tests

```typescript
describe('Loading states integration', () => {
  it('ClassSelector shows skeleton while loading');
  it('AbilityTree shows skeleton while loading');
  it('BuildSummary shows skeleton while loading');
  it('skeleton disappears when data loads');
  it('minimum display time prevents flicker');
});
```

## Deliverable Checklist

### Implementation
- [ ] `Skeleton` base component created
- [ ] `SkeletonCard` preset created
- [ ] `SkeletonAbilityCard` preset created
- [ ] CSS animations working smoothly
- [ ] ClassSelector loading state integrated
- [ ] AbilityTree loading state integrated
- [ ] BuildSummary loading state integrated
- [ ] Minimum display time implemented
- [ ] No layout shift on content load

### Testing
- [ ] `Skeleton.test.tsx` complete
- [ ] Integration tests complete
- [ ] Animation performance verified (60fps)

### Accessibility
- [ ] Skeletons hidden from screen readers (`aria-hidden`)
- [ ] Loading state announced to screen readers

### Documentation
- [ ] Component JSDoc comments
- [ ] Usage examples in code

## Known Issues & Future Improvements

### Current Limitations
- Fixed animation timing (not configurable)
- No reduced motion support

### Future Enhancements
- `prefers-reduced-motion` media query support
- Configurable animation duration
- Skeleton for individual ability loading
- Progressive loading (show parts as they load)

## Code Reference

### Complete Skeleton Component

```typescript
// src/components/Skeleton.tsx
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'progress' | 'button';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

interface SkeletonCardProps {
  showHeader?: boolean;
  lines?: number;
}

export function SkeletonCard({ showHeader = true, lines = 3 }: SkeletonCardProps) {
  return (
    <div className="skeleton-card-container">
      {showHeader && <Skeleton variant="text" width="60%" height={24} />}
      <Skeleton variant="text" count={lines} />
    </div>
  );
}

export function SkeletonAbilityCard() {
  return (
    <div className="skeleton-ability-card">
      <Skeleton variant="circle" width={40} height={40} />
      <div className="skeleton-ability-content">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="40%" height={12} />
      </div>
    </div>
  );
}
```
