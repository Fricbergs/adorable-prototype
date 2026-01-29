import React, { useState, useRef, useEffect } from 'react';
import { Home, Users, Settings, UsersRound, Bed, Stethoscope, FileText, ChevronDown, User, Menu, X, Package } from 'lucide-react';
import Logo from './Logo';

/**
 * Main application header with navigation menu
 * Only Pieteikumi section is functional with dropdown
 */
const Header = ({ onNavigate, currentView, isCustomerView = false }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when navigating
  const handleMobileNavigate = (view) => {
    onNavigate(view);
    setShowMobileMenu(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, disabled: true },
    {
      id: 'rezidenti',
      label: 'Rezidenti',
      icon: Users,
      dropdown: [
        { id: 'all-residents', label: 'Visi rezidenti', view: 'residents' },
        { id: 'resident-reports', label: 'Atskaites', view: 'resident-reports' }
      ]
    },
    {
      id: 'pieteikumi',
      label: 'Pieteikumi',
      icon: Settings,
      dropdown: [
        { id: 'new-leads', label: 'Jauni pieteikumi', view: 'all-leads' },
        { id: 'queue', label: 'Rinda', view: 'queue' }
      ]
    },
    { id: 'ligumi', label: 'Līgumi', icon: FileText, view: 'contracts' },
    {
      id: 'noliktava',
      label: 'Noliktava',
      icon: Package,
      dropdown: [
        { id: 'bulk-inventory', label: 'Lielā noliktava', view: 'bulk-inventory' },
        { id: 'resident-inventory', label: 'Rezidentu noliktavas', view: 'resident-inventory' },
        { id: 'inventory-reports', label: 'Atskaites', view: 'inventory-reports' },
        { id: 'suppliers', label: 'Piegādātāji', view: 'suppliers' }
      ]
    },
    { id: 'grupas', label: 'Grupu pasākumi', icon: UsersRound, view: 'group-activities' },
    { id: 'gultu-fonds', label: 'Gultu fonds', icon: Bed, view: 'room-management' },
    { id: 'medicina', label: 'Medicīna', icon: Stethoscope, disabled: true },
    { id: 'atjauninasanas', label: 'Atjaunināšanas žurnāls', icon: FileText, disabled: true }
  ];

  const handleMenuClick = (item) => {
    if (item.disabled) return;

    if (item.dropdown) {
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
    } else if (item.view) {
      onNavigate(item.view);
      setActiveDropdown(null);
    }
  };

  const handleDropdownClick = (dropdownItem) => {
    onNavigate(dropdownItem.view);
    setActiveDropdown(null);
  };

  const isPieteikumiActive = currentView === 'all-leads' || currentView === 'queue';
  const isRezidentiActive = currentView === 'residents' || currentView === 'resident-reports';
  const isLigumiActive = currentView === 'contracts';
  const isNoliktavaActive = currentView === 'bulk-inventory' || currentView === 'resident-inventory' || currentView === 'inventory-reports' || currentView === 'suppliers';
  const isGultuFondsActive = currentView === 'room-management';
  const isGrupasActive = currentView === 'group-activities';
  const isSettingsActive = currentView === 'settings';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="mr-6">
            <Logo />
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = (item.id === 'pieteikumi' && isPieteikumiActive) ||
                              (item.id === 'rezidenti' && isRezidentiActive) ||
                              (item.id === 'ligumi' && isLigumiActive) ||
                              (item.id === 'noliktava' && isNoliktavaActive) ||
                              (item.id === 'gultu-fonds' && isGultuFondsActive) ||
                              (item.id === 'grupas' && isGrupasActive);
              const isDropdownOpen = activeDropdown === item.id;

              return (
                <div key={item.id} className="relative">
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
                    <span>{item.label}</span>
                    {item.dropdown && (
                      <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdown && isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
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

          {/* Mobile Menu Button + User Section */}
          <div className="flex items-center gap-2">
            {/* User Badge with Admin Dropdown */}
            <div className="relative hidden sm:block" ref={adminDropdownRef}>
              <button
                onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                  isSettingsActive
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                  isCustomerView ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  {isCustomerView ? 'C' : 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {isCustomerView ? 'Client' : 'Admin'}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showAdminDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Admin Dropdown Menu */}
              {showAdminDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowAdminDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                      isSettingsActive
                        ? 'bg-orange-50 text-orange-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Iestatījumi
                  </button>
                </div>
              )}
            </div>

            {/* Mobile-only user icon */}
            <div className={`sm:hidden w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ${
              isCustomerView ? 'bg-blue-500' : 'bg-orange-500'
            }`}>
              {isCustomerView ? 'C' : 'A'}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.dropdown) {
                // Render dropdown items directly in mobile menu
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </div>
                    {item.dropdown.map((dropdownItem) => (
                      <button
                        key={dropdownItem.id}
                        onClick={() => handleMobileNavigate(dropdownItem.view)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                          ${currentView === dropdownItem.view
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        {dropdownItem.label}
                      </button>
                    ))}
                  </div>
                );
              }

              // Handle items with direct view (like Gultu fonds)
              if (item.view) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavigate(item.view)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${currentView === item.view
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.disabled && (
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Drīzumā</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
