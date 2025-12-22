import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if nothing in localStorage
 * @returns {[*, Function]} - [value, setValue] tuple
 */
export const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
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
 * Custom hook for managing persisted leads array
 * @returns {Object} - { leads, addLead, updateLead, removeLead, clearLeads }
 */
export const usePersistedLeads = () => {
  const [leads, setLeads] = useLocalStorage('adorable-leads', []);

  const addLead = (lead) => {
    setLeads(prevLeads => {
      // Check if lead already exists (by id)
      const existingIndex = prevLeads.findIndex(l => l.id === lead.id);
      if (existingIndex >= 0) {
        // Update existing lead
        const updated = [...prevLeads];
        updated[existingIndex] = lead;
        return updated;
      }
      // Add new lead
      return [...prevLeads, lead];
    });
  };

  const updateLead = (id, updates) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === id ? { ...lead, ...updates } : lead
      )
    );
  };

  const removeLead = (id) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
  };

  const clearLeads = () => {
    setLeads([]);
  };

  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id);
  };

  return {
    leads,
    addLead,
    updateLead,
    removeLead,
    clearLeads,
    getLeadById
  };
};
