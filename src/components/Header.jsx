import React, { useState, useRef, useEffect } from 'react';
import { Home, Users, Settings, UsersRound, Bed, Stethoscope, FileText, ChevronDown, User } from 'lucide-react';
import Logo from './Logo';

/**
 * Main application header with navigation menu
 * Only Pieteikumi section is functional with dropdown
 */
const Header = ({ onNavigate, currentView, isCustomerView = false }) => {
  const [showPieteikumiDropdown, setShowPieteikumiDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPieteikumiDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, disabled: true },
    { id: 'rezidenti', label: 'Rezidenti', icon: Users, disabled: true },
    {
      id: 'pieteikumi',
      label: 'Pieteikumi',
      icon: Settings,
      dropdown: [
        { id: 'new-leads', label: 'Jauni pieteikumi', view: 'all-leads' },
        { id: 'queue', label: 'Rinda', view: 'queue' }
      ]
    },
    { id: 'grupas', label: 'Grupas pasākumi', icon: UsersRound, disabled: true },
    { id: 'gultu-fonds', label: 'Gultu fonds', icon: Bed, disabled: true },
    { id: 'medicina', label: 'Medicīna', icon: Stethoscope, disabled: true },
    { id: 'atjauninasanas', label: 'Atjaunināšanas žurnāls', icon: FileText, disabled: true }
  ];

  const handleMenuClick = (item) => {
    if (item.disabled) return;

    if (item.dropdown) {
      setShowPieteikumiDropdown(!showPieteikumiDropdown);
    }
  };

  const handleDropdownClick = (dropdownItem) => {
    onNavigate(dropdownItem.view);
    setShowPieteikumiDropdown(false);
  };

  const isPieteikumiActive = currentView === 'all-leads' || currentView === 'queue';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="mr-6">
            <Logo />
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'pieteikumi' && isPieteikumiActive;

              return (
                <div key={item.id} className="relative" ref={item.id === 'pieteikumi' ? dropdownRef : null}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    disabled={item.disabled}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-500'
                        : item.disabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                    {item.dropdown && (
                      <ChevronDown className={`w-3 h-3 transition-transform ${showPieteikumiDropdown ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdown && showPieteikumiDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      {item.dropdown.map((dropdownItem) => (
                        <button
                          key={dropdownItem.id}
                          onClick={() => handleDropdownClick(dropdownItem)}
                          className={`
                            w-full text-left px-4 py-2 text-sm transition-colors
                            ${currentView === dropdownItem.view
                              ? 'bg-orange-50 text-orange-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
              <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                isCustomerView ? 'bg-blue-500' : 'bg-orange-500'
              }`}>
                {isCustomerView ? 'C' : 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {isCustomerView ? 'Client' : 'Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
