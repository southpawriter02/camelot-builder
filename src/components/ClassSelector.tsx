import type { IClass, RealmType } from '../types';

interface ClassSelectorProps {
  classes: IClass[];
  selectedClass: IClass | null;
  onClassSelect: (selectedClass: IClass) => void;
}

// Realm icons (using emoji as placeholders - can be replaced with actual icons)
const REALM_ICONS: Record<RealmType, string> = {
  Albion: '🏰',
  Midgard: '⚔️',
  Hibernia: '🍀',
};

// Get the CSS class for realm-specific styling
const getRealmClass = (realm: RealmType): string => {
  return `realm-${realm.toLowerCase()}`;
};

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClass,
  onClassSelect,
}) => {
  return (
    <section className="section-card class-selector">
      <div className="section-card-header">
        <h2>
          <span className="icon">👤</span>
          Select Your Class
        </h2>
        {selectedClass && (
          <span className={`badge badge-realm ${getRealmClass(selectedClass.realm)}`}>
            {selectedClass.realm}
          </span>
        )}
      </div>
      <div className="section-card-body">
        <div className="class-selector-grid">
          {classes.map(cls => {
            const isSelected = selectedClass?.name === cls.name;
            const realmClass = getRealmClass(cls.realm);

            return (
              <div
                key={cls.name}
                className={`class-card ${realmClass} ${isSelected ? 'selected' : ''}`}
                onClick={() => onClassSelect(cls)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClassSelect(cls);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Select ${cls.name} from ${cls.realm}`}
              >
                <div className="class-card-icon">
                  {REALM_ICONS[cls.realm]}
                </div>
                <div className="class-card-name">{cls.name}</div>
                <div className="class-card-realm">{cls.realm}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
