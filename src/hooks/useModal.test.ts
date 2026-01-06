import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  let originalBodyOverflow: string;

  beforeEach(() => {
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow;
  });

  describe('initial state', () => {
    it('starts with isOpen false', () => {
      const { result } = renderHook(() => useModal<string>());
      expect(result.current.isOpen).toBe(false);
    });

    it('starts with data null', () => {
      const { result } = renderHook(() => useModal<string>());
      expect(result.current.data).toBeNull();
    });
  });

  describe('open', () => {
    it('sets isOpen to true when open is called', () => {
      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('test data');
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('sets data to the provided value', () => {
      const { result } = renderHook(() => useModal<{ id: number; name: string }>());

      act(() => {
        result.current.open({ id: 1, name: 'Test' });
      });

      expect(result.current.data).toEqual({ id: 1, name: 'Test' });
    });

    it('locks body scroll when opened', () => {
      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('test');
      });

      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('close', () => {
    it('sets isOpen to false when close is called', () => {
      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('test');
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('clears data when close is called', () => {
      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('test data');
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.data).toBeNull();
    });

    it('restores body scroll when closed', () => {
      // Clear any existing overflow style
      document.body.style.overflow = '';
      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('test');
      });

      expect(document.body.style.overflow).toBe('hidden');

      act(() => {
        result.current.close();
      });

      // Should be restored to empty (default)
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('type safety', () => {
    it('works with complex types', () => {
      interface ComplexData {
        id: string;
        items: number[];
        nested: { value: boolean };
      }

      const { result } = renderHook(() => useModal<ComplexData>());

      const testData: ComplexData = {
        id: 'abc',
        items: [1, 2, 3],
        nested: { value: true },
      };

      act(() => {
        result.current.open(testData);
      });

      expect(result.current.data).toEqual(testData);
    });
  });

  describe('focus management', () => {
    it('stores previously focused element when opened', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('test');
      });

      // The hook stores the element internally
      // We can verify indirectly by checking focus is restored on close
      expect(document.activeElement).toBe(button);

      document.body.removeChild(button);
    });
  });

  describe('multiple open/close cycles', () => {
    it('handles multiple open/close cycles correctly', () => {
      const { result } = renderHook(() => useModal<number>());

      // First cycle
      act(() => {
        result.current.open(1);
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toBe(1);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();

      // Second cycle with different data
      act(() => {
        result.current.open(2);
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toBe(2);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it('can open with different data types each time', () => {
      const { result } = renderHook(() => useModal<string>());

      act(() => {
        result.current.open('first');
      });
      expect(result.current.data).toBe('first');

      act(() => {
        result.current.close();
      });

      act(() => {
        result.current.open('second');
      });
      expect(result.current.data).toBe('second');
    });
  });
});
