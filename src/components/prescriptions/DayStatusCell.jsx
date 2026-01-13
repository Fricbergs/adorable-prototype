import { Check, X, Clock, Minus } from 'lucide-react';

/**
 * DayStatusCell - Shows aggregated day status for a prescription
 * Used in weekly view to show status of all time slots for a day
 * @param {boolean} compact - If true, uses smaller sizing for monthly view
 */
export default function DayStatusCell({ status, isToday = false, onClick, compact = false }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'complete':
        return {
          bg: 'bg-teal-500',
          hoverBg: 'hover:bg-teal-600',
          icon: <Check className="w-4 h-4 text-white" />,
          title: 'Visas devas iedotas'
        };
      case 'refused':
        return {
          bg: 'bg-red-500',
          hoverBg: 'hover:bg-red-600',
          icon: <X className="w-4 h-4 text-white" />,
          title: 'Ir atteikumi'
        };
      case 'partial':
        return {
          bg: 'bg-cyan-500',
          hoverBg: 'hover:bg-cyan-600',
          icon: <Clock className="w-4 h-4 text-white" />,
          title: 'Daļēji iedots'
        };
      case 'pending':
        return {
          bg: 'bg-cyan-400',
          hoverBg: 'hover:bg-cyan-500',
          icon: <Clock className="w-4 h-4 text-white" />,
          title: 'Gaida'
        };
      case 'future':
        return {
          bg: 'bg-gray-200',
          hoverBg: 'hover:bg-gray-300',
          icon: <Minus className="w-4 h-4 text-gray-400" />,
          title: 'Nākotne'
        };
      case 'not_scheduled':
        return {
          bg: 'bg-transparent',
          hoverBg: '',
          icon: null,
          title: 'Nav ieplānots'
        };
      default:
        return {
          bg: 'bg-gray-100',
          hoverBg: '',
          icon: null,
          title: ''
        };
    }
  };

  const config = getStatusConfig();

  // Sizes based on compact mode
  const cellSize = compact ? 'w-5 h-5' : 'w-8 h-8';
  const iconSize = compact ? 'w-3 h-3' : 'w-4 h-4';
  const padding = compact ? 'px-0.5 py-1' : 'px-1 py-2';

  if (status === 'not_scheduled') {
    return (
      <td className={`${padding} text-center`}>
        <div className={`${cellSize} mx-auto`} />
      </td>
    );
  }

  // Get icon with correct size
  const getIcon = () => {
    switch (status) {
      case 'complete':
        return <Check className={`${iconSize} text-white`} />;
      case 'refused':
        return <X className={`${iconSize} text-white`} />;
      case 'partial':
      case 'pending':
        return <Clock className={`${iconSize} text-white`} />;
      case 'future':
        return <Minus className={`${iconSize} text-gray-400`} />;
      default:
        return null;
    }
  };

  return (
    <td className={`${padding} text-center ${isToday ? 'bg-orange-50' : ''}`}>
      <button
        onClick={onClick}
        className={`${cellSize} rounded-full ${config.bg} ${config.hoverBg} flex items-center justify-center mx-auto transition-colors cursor-pointer`}
        title={config.title}
      >
        {getIcon()}
      </button>
    </td>
  );
}

/**
 * DayStatusLegend - Legend explaining status colors
 */
export function DayStatusLegend() {
  const items = [
    { status: 'complete', label: 'Iedots', color: 'bg-teal-500' },
    { status: 'refused', label: 'Atteikums', color: 'bg-red-500' },
    { status: 'pending', label: 'Gaida', color: 'bg-cyan-400' },
    { status: 'future', label: 'Nākotne', color: 'bg-gray-200' },
  ];

  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
      {items.map(item => (
        <div key={item.status} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-full ${item.color}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
