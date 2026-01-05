import React, { useEffect, useRef } from 'react';
import type { IAbility, IStatBonus } from '../types';
import './AbilityModal.css';

export interface AbilityModalProps {
  /** The ability to display details for */
  ability: IAbility;
  /** The current rank the player has purchased (0 if not purchased) */
  currentRank: number;
  /** Callback when the modal should close */
  onClose: () => void;
  /** All abilities (for resolving prerequisite names) */
  allAbilities?: Record<string, IAbility>;
}

/**
 * Format stat bonuses for display
 */
const formatStats = (stats?: IStatBonus[]): string => {
  if (!stats || stats.length === 0) return '—';
  return stats
    .map(s => `+${s.value} ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}`)
    .join(', ');
};

/**
 * Modal dialog displaying detailed information about an ability,
 * including all ranks, costs, descriptions, and prerequisites.
 */
export const AbilityModal: React.FC<AbilityModalProps> = ({
  ability,
  currentRank,
  onClose,
  allAbilities = {},
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus the close button when modal opens
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Handle click on overlay (outside modal content)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle tab key to trap focus within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  const maxRank = ability.ranks.length;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="modal-title" className="modal-title">
              {ability.name}
            </h2>
            <span className="modal-subtitle">
              {ability.tree.charAt(0).toUpperCase() + ability.tree.slice(1)} Tree
            </span>
          </div>
          <button
            ref={closeButtonRef}
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Current Rank Indicator */}
        <div className="modal-rank-indicator">
          <span className="modal-rank-label">Your Rank:</span>
          <span className={`modal-rank-value ${currentRank === maxRank ? 'maxed' : ''}`}>
            {currentRank} / {maxRank}
            {currentRank === maxRank && <span className="badge badge-success">MAX</span>}
          </span>
        </div>

        {/* Ranks Table */}
        <div className="modal-section">
          <h3 className="modal-section-title">Rank Details</h3>
          <div className="modal-ranks-table">
            <div className="modal-ranks-header">
              <span className="col-rank">Rank</span>
              <span className="col-cost">Cost</span>
              <span className="col-description">Effect</span>
              <span className="col-stats">Stats</span>
            </div>
            {ability.ranks.map((rank) => (
              <div
                key={rank.rank}
                className={`modal-ranks-row ${
                  rank.rank <= currentRank ? 'owned' : ''
                } ${rank.rank === currentRank + 1 ? 'next' : ''}`}
              >
                <span className="col-rank">
                  {rank.rank}
                  {rank.rank <= currentRank && (
                    <span className="owned-indicator" title="Owned">✓</span>
                  )}
                </span>
                <span className="col-cost">{rank.cost} pts</span>
                <span className="col-description">{rank.description}</span>
                <span className="col-stats">{formatStats(rank.stats)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites Section */}
        {ability.prerequisites.length > 0 && (
          <div className="modal-section">
            <h3 className="modal-section-title">Prerequisites</h3>
            <ul className="modal-prerequisites">
              {ability.prerequisites.map((prereq, index) => {
                const prereqAbility = allAbilities[prereq.ability];
                const prereqName = prereqAbility?.name || prereq.ability;
                return (
                  <li key={index} className="modal-prerequisite-item">
                    <span className="prereq-icon">⚠️</span>
                    <span>
                      {prereqName} Rank {prereq.rank}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Footer with Close Button */}
        <div className="modal-footer">
          <button className="modal-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
