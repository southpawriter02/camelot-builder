import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AbilityModal } from './AbilityModal';
import type { IAbility } from '../types';

// Mock ability for testing
const mockAbility: IAbility = {
  id: 'test_ability',
  name: 'Test Ability',
  tree: 'Test Tree',
  prerequisites: [],
  ranks: [
    {
      rank: 1,
      cost: 5,
      description: 'Rank 1 description',
      stats: [{ type: 'strength', value: 5 }],
    },
    {
      rank: 2,
      cost: 10,
      description: 'Rank 2 description',
      stats: [{ type: 'strength', value: 10 }],
    },
    {
      rank: 3,
      cost: 15,
      description: 'Rank 3 description',
      stats: [{ type: 'strength', value: 15 }],
    },
  ],
};

const mockAbilityWithPrereqs: IAbility = {
  id: 'advanced_ability',
  name: 'Advanced Ability',
  tree: 'Advanced Tree',
  prerequisites: [
    { type: 'ability', ability: 'test_ability', rank: 2 },
  ],
  ranks: [
    {
      rank: 1,
      cost: 20,
      description: 'Advanced rank 1',
    },
  ],
};

const mockAllAbilities: Record<string, IAbility> = {
  test_ability: mockAbility,
  advanced_ability: mockAbilityWithPrereqs,
};

describe('AbilityModal rendering', () => {
  it('renders ability name in header', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Test Ability')).toBeDefined();
  });

  it('renders ability tree name in subtitle', () => {
    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    const subtitle = container.querySelector('.modal-subtitle');
    expect(subtitle?.textContent).toContain('Test Tree');
  });

  it('renders current rank indicator', () => {
    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={1}
        onClose={() => {}}
      />
    );

    const rankValue = container.querySelector('.modal-rank-value');
    expect(rankValue?.textContent).toContain('1');
    expect(rankValue?.textContent).toContain('3');
  });

  it('shows MAX badge when ability is maxed', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={3}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('MAX')).toBeDefined();
  });

  it('renders all ranks in the table', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Rank 1 description')).toBeDefined();
    expect(screen.getByText('Rank 2 description')).toBeDefined();
    expect(screen.getByText('Rank 3 description')).toBeDefined();
  });

  it('renders rank costs', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('5 pts')).toBeDefined();
    expect(screen.getByText('10 pts')).toBeDefined();
    expect(screen.getByText('15 pts')).toBeDefined();
  });

  it('marks owned ranks with checkmark', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={2}
        onClose={() => {}}
      />
    );

    // Two owned indicators for rank 1 and 2
    const ownedIndicators = screen.getAllByText('✓');
    expect(ownedIndicators.length).toBe(2);
  });

  it('renders stat bonuses', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    // Stat type is capitalized in formatStats
    expect(screen.getByText('+5 Strength')).toBeDefined();
    expect(screen.getByText('+10 Strength')).toBeDefined();
    expect(screen.getByText('+15 Strength')).toBeDefined();
  });

  it('renders close button in footer', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Close')).toBeDefined();
  });
});

describe('AbilityModal prerequisites', () => {
  it('renders prerequisites section when ability has prerequisites', () => {
    render(
      <AbilityModal
        ability={mockAbilityWithPrereqs}
        currentRank={0}
        onClose={() => {}}
        allAbilities={mockAllAbilities}
      />
    );

    expect(screen.getByText('Prerequisites')).toBeDefined();
  });

  it('shows prerequisite ability name when allAbilities is provided', () => {
    render(
      <AbilityModal
        ability={mockAbilityWithPrereqs}
        currentRank={0}
        onClose={() => {}}
        allAbilities={mockAllAbilities}
      />
    );

    expect(screen.getByText(/Test Ability Rank 2/)).toBeDefined();
  });

  it('does not render prerequisites section when ability has none', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    expect(screen.queryByText('Prerequisites')).toBeNull();
  });
});

describe('AbilityModal interactions', () => {
  it('calls onClose when footer close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button in header is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={handleClose}
      />
    );

    // The X button in the header
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={handleClose}
      />
    );

    // Click on the overlay (the modal-overlay element)
    const overlay = container.querySelector('.modal-overlay');
    expect(overlay).toBeDefined();
    if (overlay) {
      await user.click(overlay);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={handleClose}
      />
    );

    // Click on the modal content
    const content = container.querySelector('.modal-content');
    expect(content).toBeDefined();
    if (content) {
      await user.click(content);
    }

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();

    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={handleClose}
      />
    );

    const overlay = container.querySelector('.modal-overlay');
    expect(overlay).toBeDefined();
    if (overlay) {
      fireEvent.keyDown(overlay, { key: 'Escape' });
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('AbilityModal accessibility', () => {
  it('has dialog role', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('has aria-modal attribute', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('has aria-labelledby pointing to title', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBe('modal-title');

    const title = document.getElementById(labelledBy!);
    expect(title).toBeDefined();
    expect(title?.textContent).toBe('Test Ability');
  });

  it('focuses the close button on mount', () => {
    render(
      <AbilityModal
        ability={mockAbility}
        currentRank={0}
        onClose={() => {}}
      />
    );

    // The X button in the header should be focused
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close modal');
  });
});

describe('AbilityModal rank styling', () => {
  it('applies owned class to owned ranks', () => {
    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={1}
        onClose={() => {}}
      />
    );

    const rows = container.querySelectorAll('.modal-ranks-row');
    expect(rows[0].classList.contains('owned')).toBe(true);
    expect(rows[1].classList.contains('owned')).toBe(false);
    expect(rows[2].classList.contains('owned')).toBe(false);
  });

  it('applies next class to the next purchasable rank', () => {
    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={1}
        onClose={() => {}}
      />
    );

    const rows = container.querySelectorAll('.modal-ranks-row');
    expect(rows[0].classList.contains('next')).toBe(false);
    expect(rows[1].classList.contains('next')).toBe(true);
    expect(rows[2].classList.contains('next')).toBe(false);
  });

  it('does not apply next class when maxed', () => {
    const { container } = render(
      <AbilityModal
        ability={mockAbility}
        currentRank={3}
        onClose={() => {}}
      />
    );

    const rows = container.querySelectorAll('.modal-ranks-row');
    rows.forEach(row => {
      expect(row.classList.contains('next')).toBe(false);
    });
  });
});
