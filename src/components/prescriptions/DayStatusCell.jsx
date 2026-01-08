import { Check, X, Clock, Minus } from 'lucide-react';

/**
 * DayStatusCell - Shows aggregated day status for a prescription
 * Used in weekly view to show status of all time slots for a day
 */
export default function DayStatusCell({ status, isToday = false, onClick }) {
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

  if (status === 'not_scheduled') {
    return (
      <td className="px-1 py-2 text-center">
        <div className="w-8 h-8 mx-auto" />
      </td>
    );
  }

  return (
    <td className={`px-1 py-2 text-center ${isToday ? 'bg-orange-50' : ''}`}>
      <button
        onClick={onClick}
        className={`w-8 h-8 rounded-full ${config.bg} ${config.hoverBg} flex items-center justify-center mx-auto transition-colors cursor-pointer`}
        title={config.title}
      >
        {config.icon}
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
