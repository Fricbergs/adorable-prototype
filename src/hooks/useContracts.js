import { useState, useEffect, useCallback } from 'react';
import {
  CONTRACT_STATUS,
  generateContractNumber,
  activateContract,
  validateContractForActivation
} from '../domain/contracts';
import { DEFAULT_PRODUCTS } from '../domain/products';

const STORAGE_KEY = 'adorable-contracts';
const PRODUCTS_KEY = 'adorable-products';
const PRODUCTS_VERSION_KEY = 'adorable-products-version';
const CURRENT_PRODUCTS_VERSION = 2; // Increment when products structure changes

/**
 * Check if products need migration (old GIR format to new 1-4 format)
 */
const checkProductsMigration = () => {
  try {
    const version = localStorage.getItem(PRODUCTS_VERSION_KEY);
    if (!version || parseInt(version) < CURRENT_PRODUCTS_VERSION) {
      // Clear old products to force reload from defaults
      localStorage.removeItem(PRODUCTS_KEY);
      localStorage.setItem(PRODUCTS_VERSION_KEY, String(CURRENT_PRODUCTS_VERSION));
      console.log('Products migrated to version', CURRENT_PRODUCTS_VERSION);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking products migration:', error);
    return false;
  }
};

// Run migration check on module load
checkProductsMigration();

/**
 * Custom hook for persisting state to localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if nothing in localStorage
 * @param {Function} validator - Optional validator function, returns true if data is valid
 * @returns {[*, Function]} - [value, setValue] tuple
 */
const useLocalStorage = (key, initialValue, validator = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // If validator provided and data is invalid, return initial value
        if (validator && !validator(parsed)) {
          console.log(`Invalid data format for "${key}", using defaults`);
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          return initialValue;
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

/**
 * Validate that products have correct care level format (1-4, not GIR)
 */
const validateProductsFormat = (products) => {
  if (!products || products.length === 0) return false;
  // Check first product - if it has GIR format, it's old data
  const firstProduct = products[0];
  if (firstProduct.careLevel && firstProduct.careLevel.includes('GIR')) {
    return false;
  }
  return true;
};

/**
 * Custom hook for managing contracts with localStorage persistence
 * @returns {Object} Contract management functions
 */
export const useContracts = () => {
  const [contracts, setContracts] = useLocalStorage(STORAGE_KEY, []);
  const [products, setProducts] = useLocalStorage(PRODUCTS_KEY, DEFAULT_PRODUCTS, validateProductsFormat);

  /**
   * Add or update a contract
   * @param {Object} contract - Contract object
   * @returns {Object} Saved contract
   */
  const saveContract = useCallback((contract) => {
    // Read current contracts directly from localStorage for synchronous save
    let currentContracts = [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        currentContracts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading contracts from localStorage:', error);
    }

    let savedContract;
    let newContracts;

    const existingIndex = currentContracts.findIndex(c => c.id === contract.id);

    if (existingIndex >= 0) {
      // Update existing contract
      savedContract = {
        ...currentContracts[existingIndex],
        ...contract,
        updatedAt: new Date().toISOString()
      };
      newContracts = [...currentContracts];
      newContracts[existingIndex] = savedContract;
    } else {
      // Add new contract
      savedContract = {
        ...contract,
        createdAt: contract.createdAt || new Date().toISOString()
      };
      newContracts = [...currentContracts, savedContract];
    }

    // Write to localStorage immediately (synchronous)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newContracts));
    } catch (error) {
      console.error('Error writing contracts to localStorage:', error);
    }

    // Also update React state
    setContracts(newContracts);

    return savedContract;
  }, [setContracts]);

  /**
   * Save contract as draft
   * @param {Object} contract - Contract object
   * @returns {Object} Saved draft contract
   */
  const saveDraft = useCallback((contract) => {
    return saveContract({
      ...contract,
      status: CONTRACT_STATUS.DRAFT
    });
  }, [saveContract]);

  /**
   * Activate a draft contract
   * @param {Object} contract - Contract to activate
   * @returns {Object} { success: boolean, contract?: Object, errors?: string[] }
   */
  const saveAndActivate = useCallback((contract) => {
    // Validate first
    const validation = validateContractForActivation(contract);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Generate contract number and activate
    const activated = activateContract(contract, contracts);
    const saved = saveContract(activated);

    return { success: true, contract: saved };
  }, [contracts, saveContract]);

  /**
   * Update a contract
   * @param {string} id - Contract ID
   * @param {Object} updates - Fields to update
   */
  const updateContract = useCallback((id, updates) => {
    setContracts(prevContracts =>
      prevContracts.map(contract =>
        contract.id === id
          ? { ...contract, ...updates, updatedAt: new Date().toISOString() }
          : contract
      )
    );
  }, [setContracts]);

  /**
   * Delete a contract
   * @param {string} id - Contract ID
   */
  const deleteContract = useCallback((id) => {
    setContracts(prevContracts =>
      prevContracts.filter(contract => contract.id !== id)
    );
  }, [setContracts]);

  /**
   * Cancel a contract (soft delete)
   * @param {string} id - Contract ID
   */
  const cancelContract = useCallback((id) => {
    updateContract(id, {
      status: CONTRACT_STATUS.CANCELLED,
      cancelledAt: new Date().toISOString()
    });
  }, [updateContract]);

  /**
   * Terminate a contract with termination date
   * @param {string} id - Contract ID
   * @param {string} terminationDate - Date when contract ends (YYYY-MM-DD)
   * @param {string} reason - Optional termination reason
   */
  const terminateContract = useCallback((id, terminationDate, reason = '') => {
    updateContract(id, {
      status: CONTRACT_STATUS.TERMINATED,
      terminatedAt: new Date().toISOString(),
      terminationDate: terminationDate,
      terminationReason: reason
    });
  }, [updateContract]);

  /**
   * Get contract by ID
   * @param {string} id - Contract ID
   * @returns {Object|undefined} Contract or undefined
   */
  const getContractById = useCallback((id) => {
    return contracts.find(contract => contract.id === id);
  }, [contracts]);

  /**
   * Get contract by contract number
   * @param {string} contractNumber - Contract number
   * @returns {Object|undefined} Contract or undefined
   */
  const getContractByNumber = useCallback((contractNumber) => {
    return contracts.find(contract => contract.contractNumber === contractNumber);
  }, [contracts]);

  /**
   * Get contracts by status
   * @param {string} status - Contract status
   * @returns {Array} Filtered contracts
   */
  const getContractsByStatus = useCallback((status) => {
    return contracts.filter(contract => contract.status === status);
  }, [contracts]);

  /**
   * Get contracts for a resident
   * @param {string} residentId - Resident ID
   * @returns {Array} Filtered contracts
   */
  const getContractsByResident = useCallback((residentId) => {
    return contracts.filter(contract => contract.residentId === residentId);
  }, [contracts]);

  /**
   * Get active contract for a resident
   * @param {string} residentId - Resident ID
   * @returns {Object|undefined} Active contract or undefined
   */
  const getActiveContractForResident = useCallback((residentId) => {
    return contracts.find(
      contract =>
        contract.residentId === residentId &&
        contract.status === CONTRACT_STATUS.ACTIVE
    );
  }, [contracts]);

  /**
   * Check if contract number is unique
   * @param {string} contractNumber - Contract number to check
   * @param {string} excludeId - Contract ID to exclude from check
   * @returns {boolean} True if unique
   */
  const isContractNumberUnique = useCallback((contractNumber, excludeId = null) => {
    return !contracts.some(
      c => c.contractNumber === contractNumber && c.id !== excludeId
    );
  }, [contracts]);

  /**
   * Get next contract number for a residence
   * @param {string} residence - 'melodija' or 'sampeteris'
   * @returns {string} Next contract number
   */
  const getNextContractNumber = useCallback((residence) => {
    const year = new Date().getFullYear();
    return generateContractNumber(residence, year, contracts);
  }, [contracts]);

  /**
   * Clear all contracts (for testing)
   */
  const clearContracts = useCallback(() => {
    setContracts([]);
  }, [setContracts]);

  /**
   * Get all products
   * @returns {Array} Product catalog
   */
  const getProducts = useCallback(() => {
    return products;
  }, [products]);

  /**
   * Reset products to defaults
   */
  const resetProducts = useCallback(() => {
    setProducts(DEFAULT_PRODUCTS);
  }, [setProducts]);

  return {
    // State
    contracts,
    products,

    // Contract CRUD
    saveContract,
    saveDraft,
    saveAndActivate,
    updateContract,
    deleteContract,
    cancelContract,
    terminateContract,

    // Queries
    getContractById,
    getContractByNumber,
    getContractsByStatus,
    getContractsByResident,
    getActiveContractForResident,
    isContractNumberUnique,
    getNextContractNumber,

    // Products
    getProducts,
    resetProducts,

    // Utils
    clearContracts
  };
};

export default useContracts;
