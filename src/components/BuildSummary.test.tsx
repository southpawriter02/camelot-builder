import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BuildSummary } from './BuildSummary';
import { Build } from '../core/build';
import type { IClass, IAbility } from '../types';

// Mock class for testing
const mockClass: IClass = {
  name: 'Cleric',
  realm: 'Albion',
  ra_trees: ['smiting', 'healing', 'enhancements'],
};

// Mock abilities for testing
const mockAbilities: Record<string, IAbility> = {
  ability1: {
    id: 'ability1',
    name: 'Test Ability One',
    tree: 'enhancements',
    ranks: [
      { rank: 1, cost: 5, description: 'Rank 1' },
      { rank: 2, cost: 7, description: 'Rank 2' },
      { rank: 3, cost: 10, description: 'Rank 3' },
    ],
    prerequisites: [],
  },
  ability2: {
    id: 'ability2',
    name: 'Test Ability Two',
    tree: 'healing',
    ranks: [
      { rank: 1, cost: 3, description: 'Rank 1' },
      { rank: 2, cost: 5, description: 'Rank 2' },
    ],
    prerequisites: [],
  },
};

describe('BuildSummary', () => {
  describe('budget progress display', () => {
    it('shows spent/budget ratio', () => {
      const build = new Build(mockClass, 35, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('35 / 100')).toBeDefined();
    });

    it('shows remaining points when under budget', () => {
      const build = new Build(mockClass, 35, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('65 points remaining')).toBeDefined();
    });

    it('shows over budget warning when exceeded', () => {
      const build = new Build(mockClass, 115, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText(/15 points over budget/)).toBeDefined();
    });

    it('progress bar has correct width percentage', () => {
      const build = new Build(mockClass, 50, {});

      const { container } = render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      const progressFill = container.querySelector('.budget-progress-fill');
      expect(progressFill).toBeDefined();
      expect(progressFill?.getAttribute('style')).toContain('width: 50%');
    });

    it('progress bar caps at 100% when over budget', () => {
      const build = new Build(mockClass, 150, {});

      const { container } = render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      const progressFill = container.querySelector('.budget-progress-fill');
      expect(progressFill?.getAttribute('style')).toContain('width: 100%');
    });

    it('uses remainingPoints prop when provided', () => {
      const build = new Build(mockClass, 40, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
          remainingPoints={60}
        />
      );

      expect(screen.getByText('60 points remaining')).toBeDefined();
    });
  });

  describe('per-ability costs', () => {
    it('displays total cost per ability', () => {
      // ability1 rank 2: cost = 5 + 7 = 12 pts
      const build = new Build(mockClass, 12, { ability1: 2 });

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('12 pts')).toBeDefined();
    });

    it('shows MAX badge when ability maxed', () => {
      // ability1 has 3 ranks, purchase all 3
      const build = new Build(mockClass, 22, { ability1: 3 });

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('MAX')).toBeDefined();
    });

    it('shows rank progress when not maxed', () => {
      // ability1 rank 2 of 3
      const build = new Build(mockClass, 12, { ability1: 2 });

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('2/3')).toBeDefined();
    });

    it('displays ability name', () => {
      const build = new Build(mockClass, 5, { ability1: 1 });

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Test Ability One')).toBeDefined();
    });

    it('displays multiple purchased abilities', () => {
      const build = new Build(mockClass, 8, { ability1: 1, ability2: 1 });

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Test Ability One')).toBeDefined();
      expect(screen.getByText('Test Ability Two')).toBeDefined();
    });
  });

  describe('empty states', () => {
    it('shows no class message when class not selected', () => {
      const build = new Build(null, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('No class selected')).toBeDefined();
    });

    it('shows empty abilities message when none purchased', () => {
      const build = new Build(mockClass, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText(/No abilities purchased yet/)).toBeDefined();
    });

    it('shows select class message when no class and no abilities', () => {
      const build = new Build(null, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Select a class to begin.')).toBeDefined();
    });
  });

  describe('class display', () => {
    it('shows class name when selected', () => {
      const build = new Build(mockClass, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Cleric')).toBeDefined();
    });

    it('shows realm name', () => {
      const build = new Build(mockClass, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Albion')).toBeDefined();
    });

    it('shows realm icon for Albion', () => {
      const build = new Build(mockClass, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('🏰')).toBeDefined();
    });

    it('shows realm icon for Midgard', () => {
      const midgardClass: IClass = {
        name: 'Healer',
        realm: 'Midgard',
        ra_trees: ['healing'],
      };
      const build = new Build(midgardClass, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('⚔️')).toBeDefined();
    });

    it('shows realm icon for Hibernia', () => {
      const hiberniaClass: IClass = {
        name: 'Druid',
        realm: 'Hibernia',
        ra_trees: ['healing'],
      };
      const build = new Build(hiberniaClass, 0, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('🍀')).toBeDefined();
    });
  });

  describe('stats display', () => {
    it('shows Points Spent stat', () => {
      const build = new Build(mockClass, 25, {});

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Points Spent')).toBeDefined();
      expect(screen.getByText('25')).toBeDefined();
    });

    it('shows Abilities count stat', () => {
      const build = new Build(mockClass, 8, { ability1: 1, ability2: 1 });

      render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      expect(screen.getByText('Abilities')).toBeDefined();
      expect(screen.getByText('2')).toBeDefined();
    });
  });

  describe('over budget styling', () => {
    it('applies over-budget class to progress value', () => {
      const build = new Build(mockClass, 110, {});

      const { container } = render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      const progressValue = container.querySelector('.budget-progress-value');
      expect(progressValue?.classList.contains('over-budget')).toBe(true);
    });

    it('applies over-budget class to progress fill', () => {
      const build = new Build(mockClass, 110, {});

      const { container } = render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      const progressFill = container.querySelector('.budget-progress-fill');
      expect(progressFill?.classList.contains('over-budget')).toBe(true);
    });

    it('applies over-budget class to remaining text', () => {
      const build = new Build(mockClass, 110, {});

      const { container } = render(
        <BuildSummary
          build={build}
          allAbilities={mockAbilities}
          pointBudget={100}
        />
      );

      const remaining = container.querySelector('.budget-remaining');
      expect(remaining?.classList.contains('over-budget')).toBe(true);
    });
  });
});
