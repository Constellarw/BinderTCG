import React from 'react';

function DarkModeToggle({ isDark, onToggle }) {
  return (
    <div className="darkmode-toggle-popup" title="Alternar modo escuro">
      <button onClick={onToggle}>
        {isDark ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

export default DarkModeToggle;