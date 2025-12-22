import React from 'react';

/**
 * Lead avatar component showing initials
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} size - Size variant ('sm', 'md', 'lg')
 */
const LeadAvatar = ({ firstName, lastName, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg',
    xl: 'w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl'
  };

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
};

export default LeadAvatar;
