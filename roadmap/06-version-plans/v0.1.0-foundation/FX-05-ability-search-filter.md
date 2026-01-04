# FX-05: Ability Search/Filter

**Feature ID:** FX-05
**Status:** Complete
**Priority:** Medium
**Category:** Functional UX

---

## Overview

Ability Search/Filter provides a real-time search interface that allows users to quickly find abilities by name or tree, improving navigation for classes with many abilities.

### User Story

> As a player, I want to quickly find specific abilities by typing their name so that I don't have to scroll through all ability trees.

---

## Implementation Details

### Primary File
`src/components/SearchFilter.tsx`

### Component Interface

```typescript
interface SearchFilterProps {
  value: string;                    // Current search query
  onChange: (value: string) => void;  // Query change handler
  placeholder?: string;             // Input placeholder text
  resultCount?: number;             // Filtered count
  totalCount?: number;              // Total abilities
}

interface SearchFilterRef {
  focus: () => void;                // Programmatic focus
}
```

### Features

| Feature | Implementation |
|---------|----------------|
| Real-time filtering | Controlled input with `onChange` |
| Result count | Shows "X of Y abilities" |
| Clear button | Appears when query not empty |
| ESC key support | Clears query or blurs input |
| Focus management | `forwardRef` with `useImperativeHandle` |
| Keyboard hint | Shows "/" shortcut indicator |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│                                                              │
│  State: searchQuery: string                                  │
│  State: filteredAbilities: IAbility[]                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               Search Query Logic                        │ │
│  │                                                         │ │
│  │  const filteredAbilities = useMemo(() => {             │ │
│  │    if (!searchQuery) return allAbilities;              │ │
│  │    const query = searchQuery.toLowerCase();            │ │
│  │    return allAbilities.filter(ability =>               │ │
│  │      ability.name.toLowerCase().includes(query) ||     │ │
│  │      ability.tree.toLowerCase().includes(query)        │ │
│  │    );                                                   │ │
│  │  }, [searchQuery, allAbilities]);                       │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SearchFilter.tsx                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   🔍 [Search abilities...________________] [✕]       │   │
│  │                                                       │   │
│  │   Showing 5 of 23 abilities                          │   │
│  │   Press / to search, Esc to clear                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Props:                                                      │
│  ├── value: searchQuery                                      │
│  ├── onChange: setSearchQuery                                │
│  ├── resultCount: filteredAbilities.length                   │
│  └── totalCount: allAbilities.length                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree

### Key Press Handling

```
                    ┌─────────────────┐
                    │ Key pressed in  │
                    │ search input    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Is key Escape?  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ No                          │ Yes
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Default input   │           │ Has query text? │
    │ behavior        │           └────────┬────────┘
    └─────────────────┘                    │
                                ┌──────────┼──────────┐
                                │ Yes                 │ No
                                ▼                     ▼
                      ┌─────────────────┐   ┌─────────────────┐
                      │ Clear query     │   │ Blur input      │
                      │ onChange('')    │   │ (unfocus)       │
                      └─────────────────┘   └─────────────────┘
```

### Clear Button Visibility

```
                    ┌─────────────────┐
                    │ Render clear    │
                    │ button?         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ value.length > 0│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ No (empty)                  │ Yes (has query)
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Hide button     │           │ Show [✕] button │
    │ {null}          │           │ onClick: clear  │
    └─────────────────┘           │ + focus input   │
                                  └─────────────────┘
```

---

## Integration Points

### Inbound Dependencies
- React's `forwardRef` and `useImperativeHandle`

### Outbound Integration
- Used by `App.tsx` for filtering abilities
- Referenced by `useKeyboardShortcuts.ts` for "/" focus

### Related Features
| Feature | Relationship |
|---------|--------------|
| FX-06 Keyboard Shortcuts | "/" focuses search input |
| AbilityTree | Receives filtered abilities to display |

---

## Workflow Diagram

### Search Flow

```
User Action              System Response
───────────────────────────────────────────────────────
User types "heal"   →    onChange("heal")
                         │
                         ▼
                    setSearchQuery("heal")
                         │
                         ▼
                    useMemo recalculates
                    filteredAbilities
                         │
                    ┌────┴────────────────────────┐
                    │ Filter all abilities where: │
                    │ name.includes("heal") OR    │
                    │ tree.includes("heal")       │
                    └────┬────────────────────────┘
                         │
                         ▼
                    AbilityTree receives
                    filtered list
                         │
                         ▼
                    SearchFilter shows:
                    "Showing 3 of 23 abilities"
                         │
                         ▼
                    Only matching abilities
                    rendered in tree view
```

### Keyboard Focus Flow

```
User Action              System Response
───────────────────────────────────────────────────────
Press "/" key       →    useKeyboardShortcuts fires
                         │
                         ▼
                    shortcuts.onSearch?.()
                         │
                         ▼
                    searchRef.current.focus()
                         │
                         ▼
                    Search input gains focus
                         │
                         ▼
                    User can start typing
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('SearchFilter', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with placeholder', () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        placeholder="Search..."
      />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('calls onChange when typing', async () => {
    render(
      <SearchFilter value="" onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'heal');

    expect(mockOnChange).toHaveBeenCalledWith('h');
    expect(mockOnChange).toHaveBeenCalledWith('e');
    // etc.
  });

  test('shows clear button when has value', () => {
    render(
      <SearchFilter value="test" onChange={mockOnChange} />
    );

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  test('hides clear button when empty', () => {
    render(
      <SearchFilter value="" onChange={mockOnChange} />
    );

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  test('clear button calls onChange with empty string', async () => {
    render(
      <SearchFilter value="test" onChange={mockOnChange} />
    );

    await userEvent.click(screen.getByLabelText('Clear search'));
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  test('Escape clears query when not empty', async () => {
    render(
      <SearchFilter value="test" onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{Escape}');

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  test('shows result count when provided', () => {
    render(
      <SearchFilter
        value="heal"
        onChange={mockOnChange}
        resultCount={3}
        totalCount={23}
      />
    );

    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/of 23/)).toBeInTheDocument();
  });

  test('focus() method works via ref', () => {
    const ref = React.createRef<SearchFilterRef>();

    render(
      <SearchFilter
        ref={ref}
        value=""
        onChange={mockOnChange}
      />
    );

    ref.current?.focus();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});
```

### Integration Tests

```typescript
describe('search integration', () => {
  test('filtering updates ability tree', async () => {
    render(<App />);

    // Select a class first
    await userEvent.click(screen.getByText('Cleric'));

    // Verify all abilities shown
    expect(screen.getByText('23 abilities available')).toBeInTheDocument();

    // Type search query
    const search = screen.getByPlaceholderText('Search abilities...');
    await userEvent.type(search, 'augment');

    // Verify filtered count
    expect(screen.getByText(/Showing.*of 23/)).toBeInTheDocument();

    // Verify only matching abilities visible
    expect(screen.getByText('Augment Dexterity')).toBeInTheDocument();
    expect(screen.queryByText('Long Wind')).not.toBeInTheDocument();
  });

  test('/ key focuses search', async () => {
    render(<App />);

    await userEvent.keyboard('/');

    expect(screen.getByPlaceholderText('Search abilities...')).toHaveFocus();
  });
});
```

---

## Deliverable Checklist

### Implementation
- [x] Controlled input component
- [x] `onChange` prop for query updates
- [x] Clear button with focus return
- [x] ESC key handling
- [x] Result count display
- [x] Keyboard shortcut hint
- [x] `forwardRef` for external focus control
- [x] Accessibility labels

### Testing
- [x] Unit tests for all behaviors
- [x] Integration test with filtering
- [x] Keyboard navigation test

### Integration
- [x] Connected in App.tsx
- [x] Keyboard shortcut "/" wired up
- [x] Filter logic in useMemo

---

## Known Issues & Future Improvements

### Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No match highlighting | Users can't see why result matched | Medium |
| No search history | Can't access previous searches | Low |
| No advanced syntax | Can't do AND/OR/NOT queries | Low |
| Case-sensitive tree filter | Tree names might not match | Low |

### Future Enhancements

1. **Match Highlighting** (v0.3.0)
   ```typescript
   function highlightMatch(text: string, query: string): JSX.Element {
     const parts = text.split(new RegExp(`(${query})`, 'gi'));
     return (
       <>
         {parts.map((part, i) =>
           part.toLowerCase() === query.toLowerCase()
             ? <mark key={i}>{part}</mark>
             : part
         )}
       </>
     );
   }
   ```

2. **Search History** (v0.4.0)
   - Store recent searches in localStorage
   - Show dropdown with history
   - Quick select from previous searches

3. **Advanced Filters** (v0.5.0)
   ```typescript
   // Filter by tree
   tree:healing

   // Filter by cost range
   cost:1-5

   // Filter by rank
   rank:max
   ```

4. **Fuzzy Matching** (v1.0)
   - Use library like Fuse.js
   - Typo tolerance
   - Relevance scoring

---

## Code Reference

### Component Implementation

```typescript
// src/components/SearchFilter.tsx - Full component
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
```

---

*Document created: January 2025*
