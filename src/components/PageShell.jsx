import React from 'react';

/**
 * Page layout wrapper component
 * Provides consistent padding and centering for all views
 */
const PageShell = ({ children, maxWidth = 'max-w-6xl' }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
      <div className={`${maxWidth} mx-auto`}>
        {children}
      </div>
    </div>
  );
};

export default PageShell;
