import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  onSearch?: () => void;
}

/**
 * Hook to handle keyboard shortcuts
 */
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

/**
 * Get a formatted string of keyboard shortcuts for display
 */
export function getShortcutHint(action: string): string {
  const isMac = typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const mod = isMac ? '⌘' : 'Ctrl';

  const shortcuts: Record<string, string> = {
    undo: `${mod}+Z`,
    redo: `${mod}+Shift+Z`,
    reset: 'R',
    share: 'S',
    search: '/',
  };

  return shortcuts[action] || '';
}
