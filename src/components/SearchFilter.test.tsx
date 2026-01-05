import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { SearchFilter } from './SearchFilter';
import type { SearchFilterRef } from './SearchFilter';

describe('SearchFilter rendering', () => {
  it('renders with placeholder', () => {
    render(<SearchFilter value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('Search abilities...');
    expect(input).toBeDefined();
  });

  it('renders search icon', () => {
    render(<SearchFilter value="" onChange={() => {}} />);

    // The search icon should be present (🔍)
    const searchIcon = screen.getByText('🔍');
    expect(searchIcon).toBeDefined();
  });

  it('renders keyboard hint', () => {
    render(<SearchFilter value="" onChange={() => {}} />);

    // The hint contains <kbd> tags which break the text up
    // Use container query to find the hint element by class
    const hint = document.querySelector('.search-filter-hint');
    expect(hint).toBeDefined();
    expect(hint?.textContent).toContain('Press');
    expect(hint?.textContent).toContain('/');
    expect(hint?.textContent).toContain('to search');
  });
});

describe('SearchFilter input', () => {
  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    render(<SearchFilter value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Search abilities...');
    await userEvent.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
  });

  it('displays current value', () => {
    render(<SearchFilter value="divine" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('Search abilities...') as HTMLInputElement;
    expect(input.value).toBe('divine');
  });
});

describe('SearchFilter clear button', () => {
  it('shows clear button when has value', () => {
    render(<SearchFilter value="test" onChange={() => {}} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeDefined();
  });

  it('hides clear button when empty', () => {
    render(<SearchFilter value="" onChange={() => {}} />);

    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).toBeNull();
  });

  it('clears query on click', async () => {
    const handleChange = vi.fn();
    render(<SearchFilter value="test" onChange={handleChange} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('focuses input after clearing', async () => {
    const handleChange = vi.fn();
    render(<SearchFilter value="test" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Search abilities...');
    const clearButton = screen.getByRole('button', { name: /clear/i });

    await userEvent.click(clearButton);

    expect(document.activeElement).toBe(input);
  });
});

describe('SearchFilter keyboard', () => {
  it('Escape clears query when not empty', () => {
    const handleChange = vi.fn();
    render(<SearchFilter value="test" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Search abilities...');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('Escape blurs input when empty', () => {
    const handleChange = vi.fn();
    render(<SearchFilter value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Search abilities...');
    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(document.activeElement).not.toBe(input);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('SearchFilter result count', () => {
  it('shows filtered count when filtering', () => {
    render(
      <SearchFilter
        value="test"
        onChange={() => {}}
        resultCount={5}
        totalCount={20}
      />
    );

    // When filtering, shows "Showing X of Y abilities"
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText(/of 20 abilities/)).toBeDefined();
  });

  it('shows total count when not filtering', () => {
    render(
      <SearchFilter
        value=""
        onChange={() => {}}
        resultCount={20}
        totalCount={20}
      />
    );

    // When not filtering, shows "X abilities available"
    const count = screen.getByText('20 abilities available');
    expect(count).toBeDefined();
  });

  it('hides count when resultCount not provided', () => {
    render(<SearchFilter value="" onChange={() => {}} totalCount={20} />);

    // Should not show count without resultCount
    const count = screen.queryByText(/abilities available/);
    expect(count).toBeNull();
  });

  it('hides count when totalCount not provided', () => {
    render(<SearchFilter value="" onChange={() => {}} resultCount={5} />);

    // Should not show count without totalCount
    const count = screen.queryByText(/abilities/);
    expect(count).toBeNull();
  });
});

describe('SearchFilter ref', () => {
  it('focus() method focuses input', () => {
    const ref = createRef<SearchFilterRef>();
    render(<SearchFilter ref={ref} value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('Search abilities...');
    expect(document.activeElement).not.toBe(input);

    ref.current?.focus();

    expect(document.activeElement).toBe(input);
  });
});

describe('SearchFilter accessibility', () => {
  it('input has proper label via aria-label', () => {
    render(<SearchFilter value="" onChange={() => {}} />);

    const input = screen.getByLabelText('Search abilities');
    expect(input).toBeDefined();
  });

  it('clear button has accessible name', () => {
    render(<SearchFilter value="test" onChange={() => {}} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeDefined();
  });
});
