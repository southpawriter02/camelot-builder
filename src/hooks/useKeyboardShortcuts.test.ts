import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardShortcuts, getShortcutHint } from './useKeyboardShortcuts';

// Helper to set platform
function setPlatform(platform: string) {
  Object.defineProperty(navigator, 'platform', {
    value: platform,
    writable: true,
    configurable: true,
  });
}

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
    // Default to Windows platform
    setPlatform('Win32');
  });

  describe('undo shortcut', () => {
    it('Ctrl+Z calls onUndo on Windows', () => {
      setPlatform('Win32');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'z', ctrlKey: true });

      expect(mockCallbacks.onUndo).toHaveBeenCalledTimes(1);
    });

    it('Cmd+Z calls onUndo on Mac', () => {
      setPlatform('MacIntel');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'z', metaKey: true });

      expect(mockCallbacks.onUndo).toHaveBeenCalledTimes(1);
    });

    it('Ctrl+Z does NOT call onUndo on Mac', () => {
      setPlatform('MacIntel');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'z', ctrlKey: true });

      expect(mockCallbacks.onUndo).not.toHaveBeenCalled();
    });

    it('does not call onUndo if shift is pressed', () => {
      setPlatform('Win32');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'z', ctrlKey: true, shiftKey: true });

      expect(mockCallbacks.onUndo).not.toHaveBeenCalled();
      // Should call onRedo instead
      expect(mockCallbacks.onRedo).toHaveBeenCalled();
    });
  });

  describe('redo shortcut', () => {
    it('Ctrl+Shift+Z calls onRedo on Windows', () => {
      setPlatform('Win32');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'z', ctrlKey: true, shiftKey: true });

      expect(mockCallbacks.onRedo).toHaveBeenCalledTimes(1);
    });

    it('Ctrl+Y calls onRedo on Windows', () => {
      setPlatform('Win32');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'y', ctrlKey: true });

      expect(mockCallbacks.onRedo).toHaveBeenCalledTimes(1);
    });

    it('Cmd+Shift+Z calls onRedo on Mac', () => {
      setPlatform('MacIntel');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'z', metaKey: true, shiftKey: true });

      expect(mockCallbacks.onRedo).toHaveBeenCalledTimes(1);
    });

    it('Cmd+Y calls onRedo on Mac', () => {
      setPlatform('MacIntel');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'y', metaKey: true });

      expect(mockCallbacks.onRedo).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset shortcut', () => {
    it('R calls onReset', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'r' });

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });

    it('R with Ctrl does NOT call onReset', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'r', ctrlKey: true });

      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
    });

    it('Shift+R does NOT call onReset', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'r', shiftKey: true });

      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
    });

    it('Alt+R does NOT call onReset', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'r', altKey: true });

      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
    });
  });

  describe('share shortcut', () => {
    it('S calls onShare', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 's' });

      expect(mockCallbacks.onShare).toHaveBeenCalledTimes(1);
    });

    it('S with Ctrl does NOT call onShare', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 's', ctrlKey: true });

      expect(mockCallbacks.onShare).not.toHaveBeenCalled();
    });

    it('Shift+S does NOT call onShare', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 's', shiftKey: true });

      expect(mockCallbacks.onShare).not.toHaveBeenCalled();
    });
  });

  describe('search shortcut', () => {
    it('/ calls onSearch', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: '/' });

      expect(mockCallbacks.onSearch).toHaveBeenCalledTimes(1);
    });

    it('Ctrl+F calls onSearch on Windows', () => {
      setPlatform('Win32');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'f', ctrlKey: true });

      expect(mockCallbacks.onSearch).toHaveBeenCalledTimes(1);
    });

    it('Cmd+F calls onSearch on Mac', () => {
      setPlatform('MacIntel');
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      fireEvent.keyDown(document, { key: 'f', metaKey: true });

      expect(mockCallbacks.onSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('input field handling', () => {
    let input: HTMLInputElement;
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
      input = document.createElement('input');
      textarea = document.createElement('textarea');
      document.body.appendChild(input);
      document.body.appendChild(textarea);
    });

    afterEach(() => {
      document.body.removeChild(input);
      document.body.removeChild(textarea);
    });

    it('ignores shortcuts when typing in input', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      input.focus();
      fireEvent.keyDown(input, { key: 'r' });

      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
    });

    it('ignores shortcuts when typing in textarea', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      textarea.focus();
      fireEvent.keyDown(textarea, { key: 's' });

      expect(mockCallbacks.onShare).not.toHaveBeenCalled();
    });

    it('Escape blurs input element', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      input.focus();
      expect(document.activeElement).toBe(input);

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(document.activeElement).not.toBe(input);
    });

    it('Escape blurs textarea element', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      textarea.focus();
      expect(document.activeElement).toBe(textarea);

      fireEvent.keyDown(textarea, { key: 'Escape' });

      expect(document.activeElement).not.toBe(textarea);
    });
  });

  describe('event prevention', () => {
    it('calls preventDefault for undo shortcut', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('calls preventDefault for reset shortcut', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = new KeyboardEvent('keydown', {
        key: 'r',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('calls preventDefault for search shortcut', () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = new KeyboardEvent('keydown', {
        key: '/',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboardShortcuts(mockCallbacks));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('optional callbacks', () => {
    it('handles missing onUndo callback', () => {
      renderHook(() => useKeyboardShortcuts({}));

      // Should not throw
      expect(() => {
        fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
      }).not.toThrow();
    });

    it('handles missing onRedo callback', () => {
      renderHook(() => useKeyboardShortcuts({}));

      expect(() => {
        fireEvent.keyDown(document, { key: 'z', ctrlKey: true, shiftKey: true });
      }).not.toThrow();
    });

    it('handles missing onReset callback', () => {
      renderHook(() => useKeyboardShortcuts({}));

      expect(() => {
        fireEvent.keyDown(document, { key: 'r' });
      }).not.toThrow();
    });
  });
});

describe('getShortcutHint', () => {
  describe('Windows platform', () => {
    beforeEach(() => {
      setPlatform('Win32');
    });

    it('returns Ctrl+Z for undo', () => {
      expect(getShortcutHint('undo')).toBe('Ctrl+Z');
    });

    it('returns Ctrl+Shift+Z for redo', () => {
      expect(getShortcutHint('redo')).toBe('Ctrl+Shift+Z');
    });

    it('returns R for reset', () => {
      expect(getShortcutHint('reset')).toBe('R');
    });

    it('returns S for share', () => {
      expect(getShortcutHint('share')).toBe('S');
    });

    it('returns / for search', () => {
      expect(getShortcutHint('search')).toBe('/');
    });
  });

  describe('Mac platform', () => {
    beforeEach(() => {
      setPlatform('MacIntel');
    });

    it('returns ⌘+Z for undo', () => {
      expect(getShortcutHint('undo')).toBe('⌘+Z');
    });

    it('returns ⌘+Shift+Z for redo', () => {
      expect(getShortcutHint('redo')).toBe('⌘+Shift+Z');
    });

    it('returns R for reset (same on all platforms)', () => {
      expect(getShortcutHint('reset')).toBe('R');
    });

    it('returns S for share (same on all platforms)', () => {
      expect(getShortcutHint('share')).toBe('S');
    });

    it('returns / for search (same on all platforms)', () => {
      expect(getShortcutHint('search')).toBe('/');
    });
  });

  describe('unknown actions', () => {
    it('returns empty string for unknown action', () => {
      expect(getShortcutHint('unknown')).toBe('');
    });

    it('returns empty string for empty action', () => {
      expect(getShortcutHint('')).toBe('');
    });
  });
});
