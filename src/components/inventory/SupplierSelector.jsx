import React, { useState, useEffect } from 'react';
import { getActiveSuppliers } from '../../domain/supplierHelpers';

/**
 * Dropdown selector for choosing a supplier from active suppliers list
 */
const SupplierSelector = ({ value, onChange, includeAll = false, disabled = false, className = '' }) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setSuppliers(getActiveSuppliers());
  }, []);

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      } ${className}`}
    >
      {includeAll && (
        <option value="">Visi piegādātāji</option>
      )}
      {!includeAll && !value && (
        <option value="">Izvēlieties piegādātāju</option>
      )}
      {suppliers.map((supplier) => (
        <option key={supplier.id} value={supplier.id}>
          {supplier.name}
        </option>
      ))}
    </select>
  );
};

export default SupplierSelector;
