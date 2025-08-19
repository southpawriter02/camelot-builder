import React from 'react';
import { IClass } from '../types';

interface ClassSelectorProps {
  classes: IClass[];
  selectedClass: IClass | null;
  onClassSelect: (selectedClass: IClass) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClass,
  onClassSelect,
}) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClassName = event.target.value;
    const newSelectedClass = classes.find(c => c.name === selectedClassName);
    if (newSelectedClass) {
      onClassSelect(newSelectedClass);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h2>Class Selector</h2>
      <select
        value={selectedClass?.name || ''}
        onChange={handleSelect}
      >
        <option value="" disabled>-- Select a Class --</option>
        {classes.map(c => (
          <option key={c.name} value={c.name}>
            {c.name} ({c.realm})
          </option>
        ))}
      </select>
    </div>
  );
};
