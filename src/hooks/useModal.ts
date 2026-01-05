import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Return type for the useModal hook
 */
export interface UseModalReturn<T> {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** The data associated with the open modal, null when closed */
  data: T | null;
  /** Open the modal with the given data */
  open: (data: T) => void;
  /** Close the modal */
  close: () => void;
}

/**
 * A generic hook for managing modal state with associated data.
 * Handles opening, closing, and storing data to display in the modal.
 * Also manages focus restoration when the modal closes.
 *
 * @returns Modal state and control functions
 *
 * @example
 * const { isOpen, data, open, close } = useModal<IAbility>();
 *
 * // Open modal with data
 * <button onClick={() => open(ability)}>View Details</button>
 *
 * // Render modal conditionally
 * {isOpen && data && (
 *   <AbilityModal ability={data} onClose={close} />
 * )}
 */
export function useModal<T>(): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const open = useCallback((modalData: T) => {
    // Store the currently focused element to restore later
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);

    // Restore focus to previously focused element
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
      previouslyFocusedElement.current = null;
    }
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return { isOpen, data, open, close };
}
