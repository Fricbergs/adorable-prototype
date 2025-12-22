import React from 'react';
import { AlertCircle, Phone, Clock } from 'lucide-react';

/**
 * Colored info notice component
 * @param {string} variant - Color variant ('blue', 'yellow', 'orange')
 * @param {string} title - Notice title
 * @param {string} children - Notice content
 * @param {string} icon - Icon to display ('info', 'phone', 'clock')
 */
const InfoNotice = ({ variant = 'blue', title, children, icon = 'info' }) => {
  const variantClasses = {
    blue: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      content: 'text-blue-700',
      subtitle: 'text-blue-600'
    },
    yellow: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      content: 'text-yellow-700',
      subtitle: 'text-yellow-600'
    },
    orange: {
      container: 'bg-orange-50 border-orange-200',
      icon: 'text-orange-600',
      title: 'text-orange-900',
      content: 'text-orange-700',
      subtitle: 'text-orange-600'
    }
  };

  const icons = {
    info: AlertCircle,
    phone: Phone,
    clock: Clock
  };

  const classes = variantClasses[variant];
  const IconComponent = icons[icon];

  return (
    <div className={`${classes.container} border rounded-lg p-4 flex gap-3`}>
      <IconComponent className={`w-5 h-5 ${classes.icon} flex-shrink-0 mt-0.5`} />
      <div className="text-sm">
        {title && <p className={`font-medium mb-1 ${classes.title}`}>{title}</p>}
        <div className={classes.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoNotice;
