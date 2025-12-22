import React from 'react';

/**
 * Adorable logo component
 * Uses the actual logo.png from public folder
 */
const Logo = ({ size = 'default' }) => {
  const heightClasses = {
    small: 'h-8',
    default: 'h-10',
    large: 'h-12'
  };

  return (
    <div className="flex items-center">
      <img
        src="/adorable-prototype/logo.png"
        alt="Adorable"
        className={heightClasses[size]}
        style={{ height: '40px', width: 'auto' }}
      />
    </div>
  );
};

export default Logo;
