# FX-06: Keyboard Shortcuts

**Feature ID:** FX-06
**Status:** Complete
**Priority:** Low
**Category:** Functional UX

---

## Overview

Keyboard Shortcuts provides power users with quick access to common actions through keyboard combinations, improving efficiency and accessibility.

### User Story

> As a power user, I want to use keyboard shortcuts to quickly undo, redo, reset, and share my builds without using the mouse.

---

## Implementation Details

### Primary File
`src/hooks/useKeyboardShortcuts.ts`

### Exported Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `useKeyboardShortcuts(shortcuts)` | Hook to register keyboard listeners | `void` |
| `getShortcutHint(action)` | Get display string for shortcut | `string` |

### Supported Shortcuts

| Action | Windows/Linux | macOS | Callback |
|--------|---------------|-------|----------|
| Undo | Ctrl+Z | Cmd+Z | `onUndo` |
| Redo | Ctrl+Shift+Z or Ctrl+Y | Cmd+Shift+Z | `onRedo` |
| Reset | R | R | `onReset` |
| Share | S | S | `onShare` |
| Search | / or Ctrl+F | / or Cmd+F | `onSearch` |

### Hook Interface

```typescript
interface KeyboardShortcuts {
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  onSearch?: () => void;
}

function useKeyboardShortcuts(shortcuts: KeyboardShortcuts): void
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              useKeyboardShortcuts({                     │ │
│  │                onUndo: handleUndo,                      │ │
│  │                onRedo: handleRedo,                      │ │
│  │                onReset: handleReset,                    │ │
│  │                onShare: handleShare,                    │ │
│  │                onSearch: () => searchRef.current.focus()│ │
│  │              })                                         │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  useKeyboardShortcuts.ts                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    useEffect                            │ │
│  │                                                         │ │
│  │  document.addEventListener('keydown', handleKeyDown)    │ │
│  │                                                         │ │
│  │  return () =>                                          │ │
│  │    document.removeEventListener('keydown', handleKeyDown)│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  handleKeyDown                          │ │
│  │                                                         │ │
│  │  1. Check if in input/textarea → ignore (except Esc)   │ │
│  │  2. Detect platform (Mac vs Windows)                   │ │
│  │  3. Match key combo to shortcut                        │ │
│  │  4. Call appropriate callback                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree

### Main Key Handler

```
                    ┌─────────────────┐
                    │ keydown event   │
                    │ fired           │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Is target input │
                    │ or textarea?    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ Yes                         │ No
              ▼                             │
    ┌─────────────────┐                     │
    │ Is key Escape?  │                     │
    └────────┬────────┘                     │
             │                              │
      ┌──────┼──────┐                       │
      │ No         │ Yes                   │
      ▼            ▼                       │
┌──────────┐ ┌──────────┐                  │
│ Return   │ │ Blur     │                  │
│ (ignore) │ │ element  │                  │
└──────────┘ └──────────┘                  │
                                           │
                              ┌────────────┘
                              ▼
                    ┌─────────────────┐
                    │ Detect platform │
                    │ isMac = ...     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ modifier =      │
                    │ isMac ? ⌘ : Ctrl│
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │        Match Shortcut         │
              └──────────────┬───────────────┘
                             │
       ┌─────────┬───────────┼───────────┬─────────┐
       │         │           │           │         │
       ▼         ▼           ▼           ▼         ▼
   mod+Z    mod+⇧Z/Y      R (solo)   S (solo)   / or mod+F
     │         │             │           │         │
     ▼         ▼             ▼           ▼         ▼
  onUndo    onRedo       onReset     onShare   onSearch
```

### Platform Detection

```
                    ┌─────────────────┐
                    │ Detect platform │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ navigator       │
                    │ .platform       │
                    │ .includes('MAC')│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ Yes                         │ No
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Use event       │           │ Use event       │
    │ .metaKey        │           │ .ctrlKey        │
    │ (⌘ Command)     │           │ (Ctrl)          │
    └─────────────────┘           └─────────────────┘
```

---

## Integration Points

### Inbound Dependencies
- React hooks: `useEffect`, `useCallback`

### Outbound Integration
- Callbacks wired to actions in `App.tsx`
- `getShortcutHint()` used by UI for display

### Related Features
| Feature | Relationship |
|---------|--------------|
| FX-03 Undo/Redo | Ctrl+Z/Ctrl+Shift+Z triggers history |
| FX-05 Search | "/" focuses search input |
| FX-02 Share | "S" triggers share action |

---

## Workflow Diagram

### Undo Shortcut Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Press Ctrl+Z        →    Document keydown listener
                         │
                         ▼
                    Not in input field
                         │
                         ▼
                    isMac = false
                    modifier = ctrlKey
                         │
                         ▼
                    ctrlKey && key === 'z'
                    && !shiftKey
                         │
                         ▼
                    event.preventDefault()
                    (Prevent browser undo)
                         │
                         ▼
                    shortcuts.onUndo?.()
                         │
                         ▼
                    history.undo() called
                         │
                         ▼
                    UI updates with
                    previous build state
```

### Search Focus Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Press "/" key       →    Document keydown listener
                         │
                         ▼
                    Not in input field
                         │
                         ▼
                    key === '/'
                         │
                         ▼
                    event.preventDefault()
                    (Prevent "/" in page)
                         │
                         ▼
                    shortcuts.onSearch?.()
                         │
                         ▼
                    searchRef.current.focus()
                         │
                         ▼
                    Search input focused
                    User can type query
```

---

## Testing Strategy

### Unit Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, getShortcutHint } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  const mockCallbacks = {
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onReset: vi.fn(),
    onShare: vi.fn(),
    onSearch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset platform detection
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      writable: true,
    });
  });

  test('Ctrl+Z calls onUndo', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, {
      key: 'z',
      ctrlKey: true,
    });

    expect(mockCallbacks.onUndo).toHaveBeenCalled();
  });

  test('Ctrl+Shift+Z calls onRedo', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
    });

    expect(mockCallbacks.onRedo).toHaveBeenCalled();
  });

  test('Ctrl+Y calls onRedo (alternative)', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, {
      key: 'y',
      ctrlKey: true,
    });

    expect(mockCallbacks.onRedo).toHaveBeenCalled();
  });

  test('R calls onReset', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, { key: 'r' });

    expect(mockCallbacks.onReset).toHaveBeenCalled();
  });

  test('S calls onShare', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, { key: 's' });

    expect(mockCallbacks.onShare).toHaveBeenCalled();
  });

  test('/ calls onSearch', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, { key: '/' });

    expect(mockCallbacks.onSearch).toHaveBeenCalled();
  });

  test('Ctrl+F calls onSearch', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    fireEvent.keyDown(document, {
      key: 'f',
      ctrlKey: true,
    });

    expect(mockCallbacks.onSearch).toHaveBeenCalled();
  });

  test('ignores shortcuts in input fields', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    fireEvent.keyDown(input, { key: 'r' });

    expect(mockCallbacks.onReset).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  test('Escape in input blurs element', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const blurSpy = vi.spyOn(input, 'blur');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(blurSpy).toHaveBeenCalled();

    document.body.removeChild(input);
  });

  test('uses metaKey on Mac', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
    });

    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    // Ctrl+Z should NOT work on Mac
    fireEvent.keyDown(document, {
      key: 'z',
      ctrlKey: true,
    });
    expect(mockCallbacks.onUndo).not.toHaveBeenCalled();

    // Cmd+Z should work on Mac
    fireEvent.keyDown(document, {
      key: 'z',
      metaKey: true,
    });
    expect(mockCallbacks.onUndo).toHaveBeenCalled();
  });
});

describe('getShortcutHint', () => {
  test('returns correct hints for Windows', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
    });

    expect(getShortcutHint('undo')).toBe('Ctrl+Z');
    expect(getShortcutHint('redo')).toBe('Ctrl+Shift+Z');
    expect(getShortcutHint('reset')).toBe('R');
    expect(getShortcutHint('share')).toBe('S');
    expect(getShortcutHint('search')).toBe('/');
  });

  test('returns correct hints for Mac', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
    });

    expect(getShortcutHint('undo')).toBe('⌘+Z');
    expect(getShortcutHint('redo')).toBe('⌘+Shift+Z');
  });

  test('returns empty string for unknown action', () => {
    expect(getShortcutHint('unknown')).toBe('');
  });
});
```

### Integration Tests

```typescript
describe('keyboard shortcuts integration', () => {
  test('Ctrl+Z undoes last action', async () => {
    render(<App />);

    // Select class
    await userEvent.click(screen.getByText('Cleric'));

    // Purchase ability
    await userEvent.click(screen.getByText('+'));

    expect(screen.getByText(/1 point/)).toBeInTheDocument();

    // Undo
    await userEvent.keyboard('{Control>}z{/Control}');

    expect(screen.getByText(/0 point/)).toBeInTheDocument();
  });

  test('/ focuses search from anywhere', async () => {
    render(<App />);

    await userEvent.keyboard('/');

    expect(screen.getByPlaceholderText('Search abilities...')).toHaveFocus();
  });
});
```

---

## Deliverable Checklist

### Implementation
- [x] `useKeyboardShortcuts` hook
- [x] Platform detection (Mac vs Windows)
- [x] Undo shortcut (Ctrl/Cmd+Z)
- [x] Redo shortcuts (Ctrl/Cmd+Shift+Z, Ctrl/Cmd+Y)
- [x] Reset shortcut (R)
- [x] Share shortcut (S)
- [x] Search shortcuts (/, Ctrl/Cmd+F)
- [x] Input field detection
- [x] Escape to blur inputs
- [x] `getShortcutHint` helper

### Testing
- [x] Unit tests for all shortcuts
- [x] Platform-specific tests
- [x] Integration tests

### UI
- [x] Shortcut hints in footer
- [x] Shortcut hints on buttons (title attribute)
- [ ] Keyboard shortcuts help panel

---

## Known Issues & Future Improvements

### Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No customization | Users can't remap shortcuts | Low |
| No conflict detection | May conflict with browser shortcuts | Low |
| No visual feedback | No indication when shortcut fires | Low |
| No help panel | Users must discover shortcuts | Medium |

### Browser Conflicts

| Shortcut | Potential Conflict |
|----------|-------------------|
| Ctrl+S | Browser save dialog (prevented) |
| Ctrl+F | Browser find (prevented) |
| R | Firefox reader mode (only with modifier) |

### Future Enhancements

1. **Customizable Shortcuts** (v0.5.0)
   ```typescript
   interface ShortcutConfig {
     action: string;
     key: string;
     modifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[];
   }

   const userShortcuts: ShortcutConfig[] = [
     { action: 'undo', key: 'z', modifiers: ['ctrl'] },
     { action: 'redo', key: 'y', modifiers: ['ctrl'] },
   ];
   ```

2. **Keyboard Shortcuts Modal** (v0.4.0)
   - Press "?" to show all shortcuts
   - Categorized list with descriptions
   - Platform-aware display

3. **Visual Feedback** (v0.3.0)
   ```typescript
   // Flash button when shortcut pressed
   onUndo: () => {
     undoButtonRef.current?.classList.add('shortcut-flash');
     handleUndo();
     setTimeout(() => {
       undoButtonRef.current?.classList.remove('shortcut-flash');
     }, 200);
   }
   ```

4. **Vim-style Shortcuts** (v1.0+)
   - Number prefixes: `5j` to purchase 5 ranks
   - Motion keys: `j/k` to navigate abilities
   - Commands: `:w` to save, `:q` to quit

---

## Code Reference

### Hook Implementation

```typescript
// src/hooks/useKeyboardShortcuts.ts - Lines 14-65
export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts): void {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      // Allow Escape to blur the input
      if (event.key === 'Escape') {
        (event.target as HTMLElement).blur();
      }
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? event.metaKey : event.ctrlKey;

    // Ctrl/Cmd + Z = Undo
    if (modifier && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      shortcuts.onUndo?.();
      return;
    }

    // Ctrl/Cmd + Shift + Z OR Ctrl/Cmd + Y = Redo
    if (modifier && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      shortcuts.onRedo?.();
      return;
    }

    // R = Reset (when not using modifier)
    if (event.key === 'r' && !modifier && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      shortcuts.onReset?.();
      return;
    }

    // S = Share (when not using modifier for save)
    if (event.key === 's' && !modifier && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      shortcuts.onShare?.();
      return;
    }

    // / or Ctrl+F = Focus search
    if (event.key === '/' || (modifier && event.key === 'f')) {
      event.preventDefault();
      shortcuts.onSearch?.();
      return;
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

---

*Document created: January 2025*
