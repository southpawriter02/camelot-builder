# SM-02: Toast Notifications

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | SM-02 |
| **Name** | Toast Notifications |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | State Management |
| **Complexity** | Medium |

## Description

Enhance the existing toast notification system to provide richer feedback for user actions, including new toast variants, action buttons within toasts, and improved accessibility.

## Current State

The project already has a toast system with the following:
- `src/components/Toast.tsx` - Toast component
- `src/components/Toast.css` - Toast styling
- `src/hooks/useToast.ts` - Toast context and hook
- Types: `success`, `error`, `info`

## User Story

> As a user performing actions in the application,
> I want clear, non-intrusive feedback about the results of my actions,
> So that I know what happened and can take corrective action if needed.

## Acceptance Criteria

- [ ] Add `warning` toast type with appropriate styling
- [ ] Support action buttons within toasts (e.g., "Undo")
- [ ] Show progress indicator for timed toasts
- [ ] Improve stacking behavior for multiple toasts
- [ ] Add accessibility announcements for screen readers
- [ ] Toast actions are keyboard accessible

## Enhancements

### New Toast Type: Warning

```typescript
type ToastType = 'success' | 'error' | 'info' | 'warning';
```

### Action Buttons

Allow toasts to include optional action buttons:

```typescript
interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
}
```

### Progress Indicator

Show remaining time visually for dismissible toasts.

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/Toast.tsx` | Add warning type, actions, progress |
| `src/components/Toast.css` | New styles for warning, action, progress |
| `src/hooks/useToast.ts` | Update interface for new features |
| `src/components/Toast.test.tsx` | New tests for enhancements |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/Toast.test.tsx` | Unit tests (if not existing) |

### Interface Changes

```typescript
// src/hooks/useToast.ts

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
  action?: ToastAction;
  createdAt: number;
}

interface ToastContext {
  toasts: Toast[];
  showToast: (message: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

interface ToastOptions {
  type?: Toast['type'];
  duration?: number;
  action?: ToastAction;
}
```

### Component Structure

```tsx
// Enhanced Toast.tsx
export function Toast({ toast, onDismiss }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + toast.duration;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const percent = (remaining / toast.duration) * 100;
      setProgress(Math.max(0, percent));

      if (percent <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.duration]);

  return (
    <div
      className={`toast toast-${toast.type}`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="toast-content">
        <span className="toast-icon">{getIcon(toast.type)}</span>
        <span className="toast-message">{toast.message}</span>
      </div>

      {toast.action && (
        <button
          className="toast-action"
          onClick={() => {
            toast.action.onClick();
            onDismiss();
          }}
        >
          {toast.action.label}
        </button>
      )}

      <button
        className="toast-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>

      <div
        className="toast-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Toast System Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ToastProvider (Context)                                           │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                                                              │  │
│   │   state: Toast[]                                             │  │
│   │   showToast(message, options) → id                          │  │
│   │   dismissToast(id)                                          │  │
│   │   clearAllToasts()                                          │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   ToastContainer                                                    │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │   position: fixed (top-right)                               │  │
│   │   max-toasts: 5 (oldest auto-dismissed)                     │  │
│   │                                                              │  │
│   │   ┌─────────────────────────────────────────────────────┐  │  │
│   │   │  Toast 1 (newest)                              [×]  │  │  │
│   │   │  ════════════════════════════════════════════════   │  │  │
│   │   └─────────────────────────────────────────────────────┘  │  │
│   │                                                              │  │
│   │   ┌─────────────────────────────────────────────────────┐  │  │
│   │   │  Toast 2                                       [×]  │  │  │
│   │   │  ══════════════════════════════════════             │  │  │
│   │   └─────────────────────────────────────────────────────┘  │  │
│   │                                                              │  │
│   │   ┌─────────────────────────────────────────────────────┐  │  │
│   │   │  Toast 3 (oldest)                   [Undo]    [×]  │  │  │
│   │   │  ══════════════════════                             │  │  │
│   │   └─────────────────────────────────────────────────────┘  │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Toast Variants

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Toast Variants                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   SUCCESS                                                           │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ ✓  Build saved successfully                            [×]  │  │
│   │ ████████████████████████████████████████████████████████████│  │
│   └─────────────────────────────────────────────────────────────┘  │
│   Background: #10b981 (green)                                       │
│                                                                     │
│   ERROR                                                             │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ ✗  Failed to share build                               [×]  │  │
│   │ ████████████████████████████████████████████████████████████│  │
│   └─────────────────────────────────────────────────────────────┘  │
│   Background: #ef4444 (red)                                         │
│                                                                     │
│   WARNING (NEW)                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ ⚠  Build is over budget by 5 points                    [×]  │  │
│   │ ████████████████████████████████████████████████████████████│  │
│   └─────────────────────────────────────────────────────────────┘  │
│   Background: #f59e0b (amber)                                       │
│                                                                     │
│   INFO                                                              │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ ℹ  Build reset                                         [×]  │  │
│   │ ████████████████████████████████████████████████████████████│  │
│   └─────────────────────────────────────────────────────────────┘  │
│   Background: #3b82f6 (blue)                                        │
│                                                                     │
│   WITH ACTION                                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ ℹ  Ability removed                      [Undo]         [×]  │  │
│   │ ██████████████████████████████████████                      │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Usage Examples

### Basic Toast

```tsx
const { showToast } = useToast();

// Success
showToast('Build saved successfully', { type: 'success' });

// Error
showToast('Failed to share build', { type: 'error' });

// Warning (new)
showToast('Build is over budget by 5 points', { type: 'warning' });

// Info
showToast('Build reset', { type: 'info' });
```

### Toast with Action

```tsx
const { showToast } = useToast();

// Undo action
showToast('Ability removed', {
  type: 'info',
  action: {
    label: 'Undo',
    onClick: () => {
      history.undo();
    },
  },
});
```

### Custom Duration

```tsx
// Longer duration for important messages
showToast('Build shared! Link copied to clipboard', {
  type: 'success',
  duration: 5000, // 5 seconds
});

// Shorter duration for quick feedback
showToast('Copied!', {
  type: 'success',
  duration: 2000, // 2 seconds
});
```

## Integration Points

### With ActionBar

```tsx
// After reset
showToast('Build reset', { type: 'info' });

// After share
showToast('Build link copied to clipboard', { type: 'success' });
```

### With Undo/Redo

```tsx
// After undo
showToast('Undo: Removed ability', {
  type: 'info',
  action: {
    label: 'Redo',
    onClick: () => history.redo(),
  },
});
```

### With Over-Budget Warning

```tsx
// When budget exceeded
useEffect(() => {
  if (build.spentPoints > POINT_BUDGET) {
    showToast(`Build is over budget by ${build.spentPoints - POINT_BUDGET} points`, {
      type: 'warning',
    });
  }
}, [build.spentPoints]);
```

## CSS Styling

```css
/* Toast.css - Enhancements */

/* Warning type */
.toast-warning {
  background: var(--color-warning);
  color: var(--color-warning-text);
}

.toast-warning .toast-icon {
  color: var(--color-warning-icon);
}

/* Action button */
.toast-action {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  padding: 4px 12px;
  color: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: auto;
  margin-right: 8px;
}

.toast-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.toast-action:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

/* Progress bar */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  transition: width 50ms linear;
}

/* Stacking improvements */
.toast-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  animation: toast-slide-in 0.3s ease-out;
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-exit {
  animation: toast-slide-out 0.2s ease-in forwards;
}

@keyframes toast-slide-out {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* CSS Variables */
:root {
  --color-warning: #f59e0b;
  --color-warning-text: #1f2937;
  --color-warning-icon: #92400e;
}
```

## Accessibility

### Screen Reader Announcements

```tsx
// Use aria-live regions appropriately
<div
  role="alert"
  aria-live={type === 'error' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  {message}
</div>
```

### Keyboard Navigation

```tsx
// Action buttons should be focusable
<button
  className="toast-action"
  onClick={handleAction}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
>
  {action.label}
</button>
```

### Focus Management

- Toasts should not steal focus
- Action buttons should be reachable via Tab
- Dismiss button should be keyboard accessible

## Testing Strategy

### Unit Tests (Toast.test.tsx)

```typescript
describe('Toast', () => {
  describe('rendering', () => {
    it('renders success toast with correct styling');
    it('renders error toast with correct styling');
    it('renders warning toast with correct styling');
    it('renders info toast with correct styling');
    it('renders message text');
    it('renders dismiss button');
  });

  describe('actions', () => {
    it('renders action button when action provided');
    it('calls action onClick when action button clicked');
    it('dismisses toast after action');
    it('does not render action button when no action');
  });

  describe('progress', () => {
    it('shows progress bar');
    it('progress decreases over time');
    it('auto-dismisses when progress reaches 0');
  });

  describe('interactions', () => {
    it('calls onDismiss when dismiss button clicked');
    it('dismisses on Escape key');
  });

  describe('accessibility', () => {
    it('has role="alert"');
    it('uses aria-live="assertive" for errors');
    it('uses aria-live="polite" for other types');
    it('action button is keyboard accessible');
  });
});

describe('ToastProvider', () => {
  it('showToast adds toast to list');
  it('dismissToast removes toast from list');
  it('clearAllToasts removes all toasts');
  it('auto-dismisses after duration');
  it('limits maximum visible toasts');
});
```

## Deliverable Checklist

### Implementation
- [ ] Add `warning` toast type
- [ ] Add action button support
- [ ] Add progress indicator
- [ ] Improve stacking/positioning
- [ ] Add enter/exit animations
- [ ] Limit max visible toasts (5)
- [ ] Update useToast hook interface

### Testing
- [ ] `Toast.test.tsx` complete
- [ ] ToastProvider tests complete
- [ ] Accessibility tests pass

### Accessibility
- [ ] Proper aria-live regions
- [ ] Keyboard navigation works
- [ ] Focus not stolen by toasts

### Integration
- [ ] ActionBar uses toasts for feedback
- [ ] Undo/Redo shows toasts with actions
- [ ] Over-budget warning toast

## Known Issues & Future Improvements

### Current Limitations
- No toast queue management
- No custom icons
- Fixed position (top-right only)

### Future Enhancements
- Configurable position (top-left, bottom-right, etc.)
- Custom icons per toast
- Persistent toasts (no auto-dismiss)
- Toast grouping (stack similar messages)
- Rich content (HTML in messages)

## Code Reference

### Enhanced useToast Hook

```typescript
// src/hooks/useToast.ts
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
  action?: ToastAction;
  createdAt: number;
}

interface ToastOptions {
  type?: Toast['type'];
  duration?: number;
  action?: ToastAction;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const toast: Toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || DEFAULT_DURATION,
      action: options.action,
      createdAt: Date.now(),
    };

    setToasts((prev) => {
      const newToasts = [toast, ...prev];
      // Remove oldest if over limit
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(0, MAX_TOASTS);
      }
      return newToasts;
    });

    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, clearAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
```
