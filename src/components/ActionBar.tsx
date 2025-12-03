import { getShortcutHint } from '../hooks/useKeyboardShortcuts';

interface ActionBarProps {
  canUndo: boolean;
  canRedo: boolean;
  canReset: boolean;
  canShare: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onShare: () => void;
  undoCount?: number;
  redoCount?: number;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  canUndo,
  canRedo,
  canReset,
  canShare,
  onUndo,
  onRedo,
  onReset,
  onShare,
  undoCount = 0,
  redoCount = 0,
}) => {
  return (
    <div className="action-bar">
      <div className="action-bar-group">
        <button
          className="action-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title={`Undo (${getShortcutHint('undo')})`}
          aria-label="Undo last action"
        >
          <span className="action-btn-icon">↶</span>
          <span className="action-btn-label">Undo</span>
          {undoCount > 0 && (
            <span className="action-btn-badge">{undoCount}</span>
          )}
        </button>
        <button
          className="action-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title={`Redo (${getShortcutHint('redo')})`}
          aria-label="Redo last action"
        >
          <span className="action-btn-icon">↷</span>
          <span className="action-btn-label">Redo</span>
          {redoCount > 0 && (
            <span className="action-btn-badge">{redoCount}</span>
          )}
        </button>
      </div>

      <div className="action-bar-group">
        <button
          className="action-btn action-btn-share"
          onClick={onShare}
          disabled={!canShare}
          title={`Share build (${getShortcutHint('share')})`}
          aria-label="Copy shareable link"
        >
          <span className="action-btn-icon">🔗</span>
          <span className="action-btn-label">Share</span>
        </button>
        <button
          className="action-btn action-btn-danger"
          onClick={onReset}
          disabled={!canReset}
          title={`Reset build (${getShortcutHint('reset')})`}
          aria-label="Reset all abilities"
        >
          <span className="action-btn-icon">🔄</span>
          <span className="action-btn-label">Reset</span>
        </button>
      </div>
    </div>
  );
};
