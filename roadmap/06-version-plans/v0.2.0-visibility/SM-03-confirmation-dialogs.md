# SM-03: Confirmation Dialogs

## Feature Overview

| Property | Value |
|----------|-------|
| **ID** | SM-03 |
| **Name** | Confirmation Dialogs |
| **Status** | Planned |
| **Priority** | Medium |
| **Category** | State Management |
| **Complexity** | Medium |
| **Dependencies** | SM-02 (Toast Notifications) |

## Description

Modal confirmation dialogs for destructive actions, protecting users from accidentally losing their work. Provides a clear prompt before irreversible actions like resetting a build.

## User Story

> As a user who has spent time building my character,
> I want to be asked for confirmation before losing my work,
> So that I don't accidentally reset or delete my build.

## Acceptance Criteria

- [ ] Reset button shows confirmation when build has abilities
- [ ] Confirmation dialog has clear confirm/cancel options
- [ ] Dialog is accessible (focus trap, keyboard navigation)
- [ ] ESC key cancels the dialog
- [ ] Clicking outside dialog cancels it
- [ ] Toast notification shown after confirmed action
- [ ] Optional "Don't ask again" checkbox
- [ ] Dialog is visually distinct from ability modal

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/ConfirmDialog.tsx` | Confirmation dialog component |
| `src/components/ConfirmDialog.css` | Dialog styling |
| `src/components/ConfirmDialog.test.tsx` | Unit tests |
| `src/hooks/useConfirm.ts` | Promise-based confirmation hook |
| `src/hooks/useConfirm.test.ts` | Hook tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/ActionBar.tsx` | Use confirmation for reset |
| `src/App.tsx` | Add ConfirmProvider |

### Interfaces

```typescript
// src/hooks/useConfirm.ts
interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  showDontAskAgain?: boolean;
}

interface ConfirmResult {
  confirmed: boolean;
  dontAskAgain?: boolean;
}

interface UseConfirmReturn {
  confirm: (options: ConfirmOptions) => Promise<ConfirmResult>;
  isOpen: boolean;
}
```

```typescript
// src/components/ConfirmDialog.tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'default' | 'danger';
  showDontAskAgain: boolean;
  onConfirm: (dontAskAgain: boolean) => void;
  onCancel: () => void;
}
```

### Component Structure

```tsx
// ConfirmDialog.tsx
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant,
  showDontAskAgain,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className={`confirm-dialog confirm-${variant}`}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>

        {showDontAskAgain && (
          <label className="confirm-checkbox">
            <input
              type="checkbox"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
            />
            Don't ask again
          </label>
        )}

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            className={`confirm-confirm confirm-${variant}`}
            onClick={() => onConfirm(dontAskAgain)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Confirmation Dialog Architecture                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ConfirmProvider (Context)                                         │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                                                              │  │
│   │   state: { isOpen, options, resolve }                       │  │
│   │                                                              │  │
│   │   confirm(options) → Promise<ConfirmResult>                 │  │
│   │     1. Store options and resolve function                   │  │
│   │     2. Set isOpen = true                                    │  │
│   │     3. Return promise                                       │  │
│   │                                                              │  │
│   │   handleConfirm(dontAskAgain)                               │  │
│   │     1. resolve({ confirmed: true, dontAskAgain })           │  │
│   │     2. Set isOpen = false                                   │  │
│   │                                                              │  │
│   │   handleCancel()                                            │  │
│   │     1. resolve({ confirmed: false })                        │  │
│   │     2. Set isOpen = false                                   │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│   ConfirmDialog (rendered by provider)                              │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ ╔═══════════════════════════════════════════════════════╗   │  │
│   │ ║  Reset Build?                                         ║   │  │
│   │ ║  ─────────────────────────────────────────────────────║   │  │
│   │ ║  Are you sure you want to reset your build?           ║   │  │
│   │ ║  This action cannot be undone.                        ║   │  │
│   │ ║                                                       ║   │  │
│   │ ║  [ ] Don't ask again                                  ║   │  │
│   │ ║                                                       ║   │  │
│   │ ║                    [Cancel]  [Reset]                  ║   │  │
│   │ ╚═══════════════════════════════════════════════════════╝   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Mockup

### Default Variant

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│    ╔════════════════════════════════════════════════════╗   │
│    ║                                                    ║   │
│    ║   Reset Build?                                     ║   │
│    ║   ────────────────────────────────────────────     ║   │
│    ║                                                    ║   │
│    ║   Are you sure you want to reset your build?       ║   │
│    ║   You have 5 abilities and 12 points spent.        ║   │
│    ║                                                    ║   │
│    ║   [ ] Don't ask me again                           ║   │
│    ║                                                    ║   │
│    ║   ┌──────────┐  ┌───────────────────────────┐     ║   │
│    ║   │  Cancel  │  │        Reset Build        │     ║   │
│    ║   └──────────┘  └───────────────────────────┘     ║   │
│    ║                                                    ║   │
│    ╚════════════════════════════════════════════════════╝   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Danger Variant

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│    ╔════════════════════════════════════════════════════╗   │
│    ║                                                    ║   │
│    ║   ⚠ Delete Saved Build?                           ║   │
│    ║   ────────────────────────────────────────────     ║   │
│    ║                                                    ║   │
│    ║   This will permanently delete "My Cleric Build".  ║   │
│    ║   This action cannot be undone.                    ║   │
│    ║                                                    ║   │
│    ║   ┌──────────┐  ┌───────────────────────────┐     ║   │
│    ║   │  Cancel  │  │     Delete Permanently    │     ║   │
│    ║   └──────────┘  └───────────────────────────┘     ║   │
│    ║                       (danger red)                 ║   │
│    ╚════════════════════════════════════════════════════╝   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Decision Tree

```
User clicks Reset button
         │
         ▼
┌─────────────────────┐
│ Build has abilities │
│ purchased?          │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
   Yes          No
    │           │
    ▼           ▼
┌───────────┐   ┌───────────┐
│ Check     │   │ Reset     │
│ dont_ask  │   │ immediately│
│ preference│   └───────────┘
└─────┬─────┘
      │
  ┌───┴───┐
  │       │
 Skip    Show
  │       │
  ▼       ▼
┌─────┐  ┌─────────────────┐
│Reset│  │ Show confirm    │
│     │  │ dialog          │
└─────┘  └────────┬────────┘
                  │
         ┌───────┴───────┐
         │               │
      Confirm          Cancel
         │               │
         ▼               ▼
   ┌───────────┐   ┌───────────┐
   │ Reset     │   │ Do nothing│
   │ + toast   │   │           │
   └───────────┘   └───────────┘
```

## Integration Points

### With ActionBar

```tsx
// ActionBar.tsx
function ActionBar() {
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [skipConfirm, setSkipConfirm] = useState(false);

  const handleReset = async () => {
    // Skip if no abilities purchased
    if (build.abilityCount === 0) {
      resetBuild();
      return;
    }

    // Check preference
    if (skipConfirm) {
      resetBuild();
      showToast('Build reset', { type: 'info' });
      return;
    }

    // Show confirmation
    const result = await confirm({
      title: 'Reset Build?',
      message: `Are you sure you want to reset your build? You have ${build.abilityCount} abilities and ${build.spentPoints} points spent.`,
      confirmText: 'Reset Build',
      cancelText: 'Cancel',
      variant: 'default',
      showDontAskAgain: true,
    });

    if (result.confirmed) {
      if (result.dontAskAgain) {
        setSkipConfirm(true);
      }
      resetBuild();
      showToast('Build reset', { type: 'info' });
    }
  };

  return (
    <button onClick={handleReset}>Reset</button>
  );
}
```

### With App.tsx

```tsx
// App.tsx
function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AppContent />
      </ConfirmProvider>
    </ToastProvider>
  );
}
```

## Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                  Confirmation Dialog Flow                          │
└────────────────────────────────────────────────────────────────────┘

  User            ActionBar         useConfirm      ConfirmDialog    Toast
   │                  │                  │                │            │
   │ click Reset      │                  │                │            │
   ├─────────────────►│                  │                │            │
   │                  │                  │                │            │
   │                  │ confirm(options) │                │            │
   │                  ├─────────────────►│                │            │
   │                  │                  │                │            │
   │                  │                  │ render dialog  │            │
   │                  │                  ├───────────────►│            │
   │                  │                  │                │            │
   │◄─────────────────┼──────────────────┼────────────────┤            │
   │                  │                  │     Dialog     │            │
   │                  │                  │    displayed   │            │
   │                  │                  │                │            │
   │ click Confirm    │                  │                │            │
   ├──────────────────┼──────────────────┼───────────────►│            │
   │                  │                  │                │            │
   │                  │                  │◄───────────────┤            │
   │                  │                  │ onConfirm()    │            │
   │                  │                  │                │            │
   │                  │◄─────────────────┤                │            │
   │                  │ Promise resolves │                │            │
   │                  │ {confirmed: true}│                │            │
   │                  │                  │                │            │
   │                  │ resetBuild()     │                │            │
   │                  ├──────────────────┼────────────────┼───────────►│
   │                  │                  │                │  showToast │
   │                  │                  │                │            │
   │◄─────────────────┼──────────────────┼────────────────┼────────────┤
   │                  │                  │                │  "Build    │
   │                  │                  │                │   reset"   │
   ▼                  ▼                  ▼                ▼            ▼
```

## CSS Styling

```css
/* ConfirmDialog.css */

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100; /* Above ability modal (1000) */
  animation: fade-in 0.15s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirm-dialog {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: scale-in 0.15s ease-out;
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.confirm-dialog h2 {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
}

.confirm-dialog p {
  margin: 0 0 20px 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Checkbox */
.confirm-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.confirm-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Actions */
.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-cancel {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-cancel:hover {
  background: var(--bg-hover);
}

.confirm-confirm {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-confirm:hover {
  background: var(--color-primary-hover);
}

/* Danger variant */
.confirm-danger .confirm-confirm {
  background: var(--color-danger);
}

.confirm-danger .confirm-confirm:hover {
  background: var(--color-danger-hover);
}

.confirm-danger h2::before {
  content: '⚠ ';
  color: var(--color-danger);
}

/* Focus styles */
.confirm-cancel:focus-visible,
.confirm-confirm:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

## Accessibility

### ARIA Attributes

```tsx
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="confirm-title"
  aria-describedby="confirm-message"
>
```

### Focus Management

```tsx
function ConfirmDialog({ isOpen, onConfirm, onCancel }) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus confirm button
      confirmButtonRef.current?.focus();
    }

    return () => {
      // Restore focus on close
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Focus trap
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
    if (e.key === 'Tab') {
      // Trap focus within dialog
    }
  };
}
```

### Keyboard Navigation

- **Tab**: Move between Cancel and Confirm buttons
- **Escape**: Cancel and close dialog
- **Enter**: Activate focused button

## Testing Strategy

### Unit Tests (ConfirmDialog.test.tsx)

```typescript
describe('ConfirmDialog', () => {
  describe('rendering', () => {
    it('renders when isOpen is true');
    it('does not render when isOpen is false');
    it('displays title and message');
    it('displays confirm and cancel buttons');
    it('shows checkbox when showDontAskAgain is true');
    it('hides checkbox when showDontAskAgain is false');
    it('applies danger variant styling');
  });

  describe('interactions', () => {
    it('calls onConfirm when confirm button clicked');
    it('calls onCancel when cancel button clicked');
    it('calls onCancel when overlay clicked');
    it('does not close when dialog content clicked');
    it('calls onCancel when ESC pressed');
    it('passes dontAskAgain value to onConfirm');
  });

  describe('accessibility', () => {
    it('has alertdialog role');
    it('has aria-modal attribute');
    it('focuses confirm button on open');
    it('restores focus on close');
    it('traps focus within dialog');
  });
});
```

### Unit Tests (useConfirm.test.ts)

```typescript
describe('useConfirm', () => {
  it('isOpen starts as false');
  it('confirm() opens dialog and returns promise');
  it('onConfirm resolves promise with confirmed: true');
  it('onCancel resolves promise with confirmed: false');
  it('dontAskAgain is passed through');
  it('only one dialog can be open at a time');
});
```

### Integration Tests

```typescript
describe('ActionBar + ConfirmDialog', () => {
  it('reset shows confirmation when abilities purchased');
  it('reset skips confirmation when no abilities');
  it('confirmed reset clears build and shows toast');
  it('cancelled reset keeps build intact');
  it('dont ask again skips future confirmations');
});
```

## Deliverable Checklist

### Implementation
- [ ] `ConfirmDialog` component created
- [ ] `useConfirm` hook created
- [ ] CSS styling complete
- [ ] ActionBar integration complete
- [ ] ConfirmProvider added to App
- [ ] Keyboard navigation working
- [ ] Focus management working
- [ ] Toast feedback after confirm

### Testing
- [ ] `ConfirmDialog.test.tsx` complete
- [ ] `useConfirm.test.ts` complete
- [ ] Integration tests complete
- [ ] Accessibility tests pass

### Accessibility
- [ ] Proper ARIA attributes
- [ ] Focus trap implemented
- [ ] Focus restoration on close
- [ ] Screen reader announcements

## Known Issues & Future Improvements

### Current Limitations
- No animation on close
- Single dialog at a time
- Preference stored in memory only

### Future Enhancements
- Persist "Don't ask again" preference to localStorage
- Close animation
- Queue multiple confirmations
- Custom content (not just text)
- Variant icons (warning, danger, info)

## Code Reference

### useConfirm Hook Implementation

```typescript
// src/hooks/useConfirm.ts
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  showDontAskAgain?: boolean;
}

interface ConfirmResult {
  confirmed: boolean;
  dontAskAgain?: boolean;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolve: ((result: ConfirmResult) => void) | null;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<ConfirmResult>;
  isOpen: boolean;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<ConfirmResult> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback((dontAskAgain: boolean) => {
    state.resolve?.({ confirmed: true, dontAskAgain });
    setState({ isOpen: false, options: null, resolve: null });
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.({ confirmed: false });
    setState({ isOpen: false, options: null, resolve: null });
  }, [state.resolve]);

  return (
    <ConfirmContext.Provider value={{ confirm, isOpen: state.isOpen }}>
      {children}
      {state.options && (
        <ConfirmDialog
          isOpen={state.isOpen}
          title={state.options.title}
          message={state.options.message}
          confirmText={state.options.confirmText || 'Confirm'}
          cancelText={state.options.cancelText || 'Cancel'}
          variant={state.options.variant || 'default'}
          showDontAskAgain={state.options.showDontAskAgain || false}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
```
