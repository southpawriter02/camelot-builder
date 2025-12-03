import { useRef, forwardRef, useImperativeHandle } from 'react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export interface SearchFilterRef {
  focus: () => void;
}

export const SearchFilter = forwardRef<SearchFilterRef, SearchFilterProps>(({
  value,
  onChange,
  placeholder = 'Search abilities...',
  resultCount,
  totalCount,
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (value) {
        onChange('');
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const showCount = resultCount !== undefined && totalCount !== undefined;
  const isFiltered = value.length > 0;

  return (
    <div className="search-filter">
      <div className="search-filter-input-wrapper">
        <span className="search-filter-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-filter-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search abilities"
        />
        {value && (
          <button
            className="search-filter-clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      {showCount && (
        <div className="search-filter-count">
          {isFiltered ? (
            <span>
              Showing <strong>{resultCount}</strong> of {totalCount} abilities
            </span>
          ) : (
            <span>{totalCount} abilities available</span>
          )}
        </div>
      )}
      <div className="search-filter-hint">
        Press <kbd>/</kbd> to search, <kbd>Esc</kbd> to clear
      </div>
    </div>
  );
});

SearchFilter.displayName = 'SearchFilter';
