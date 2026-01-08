/**
 * Tests for inventoryScheduler.js
 * Tests the auto-dispense integration for medication administration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the dependencies
vi.mock('../../domain/inventoryHelpers', () => ({
  getResidentInventory: vi.fn(),
  getInventoryForPrescription: vi.fn(),
  updateResidentInventoryQuantity: vi.fn(),
  createDispenseLog: vi.fn(),
  getResidentInventoryItem: vi.fn(),
  getAllDispenseLogs: vi.fn()
}));

vi.mock('../../domain/prescriptionHelpers', () => ({
  getPrescriptionById: vi.fn()
}));

// Import after mocking
import { processAdministrationEvent, checkInventoryNeeds } from '../../domain/inventoryScheduler';
import {
  getResidentInventory,
  updateResidentInventoryQuantity,
  createDispenseLog,
  getAllDispenseLogs
} from '../../domain/inventoryHelpers';
import { getPrescriptionById } from '../../domain/prescriptionHelpers';
import { DISPENSE_TYPES } from '../../constants/inventoryConstants';

describe('inventoryScheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processAdministrationEvent', () => {
    it('should return null for null input', () => {
      const result = processAdministrationEvent(null);
      expect(result).toBeNull();
    });

    it('should return null for unrecognized status', () => {
      const result = processAdministrationEvent({
        prescriptionId: 'P1',
        residentId: 'R1',
        status: 'pending',
        timeSlot: 'morning',
        id: 'LOG1'
      });
      expect(result).toBeNull();
    });

    describe('medication given (dispense)', () => {
      const mockPrescription = {
        id: 'P1',
        medicationName: 'Aspirin',
        schedule: {
          morning: { enabled: true, dose: '2', unit: 'tabletes' }
        }
      };

      const mockInventoryItem = {
        id: 'INV1',
        medicationName: 'Aspirin',
        quantity: 100
      };

      it('should deduct inventory when medication is given', () => {
        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([mockInventoryItem]);
        createDispenseLog.mockReturnValue({ id: 'DL1' });

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'given',
          timeSlot: 'morning',
          id: 'LOG1'
        });

        expect(updateResidentInventoryQuantity).toHaveBeenCalledWith('INV1', -2);
        expect(createDispenseLog).toHaveBeenCalledWith(
          expect.objectContaining({
            quantityDispensed: 2,
            type: DISPENSE_TYPES.auto.value,
            previousQuantity: 100,
            newQuantity: 98
          })
        );
        expect(result).toEqual({ id: 'DL1' });
      });

      it('should return null if prescription not found', () => {
        getPrescriptionById.mockReturnValue(null);

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'given',
          timeSlot: 'morning',
          id: 'LOG1'
        });

        expect(result).toBeNull();
        expect(updateResidentInventoryQuantity).not.toHaveBeenCalled();
      });

      it('should return null if no inventory found', () => {
        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([]);

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'given',
          timeSlot: 'morning',
          id: 'LOG1'
        });

        expect(result).toBeNull();
        expect(updateResidentInventoryQuantity).not.toHaveBeenCalled();
      });

      it('should handle insufficient inventory by dispensing what is available', () => {
        const lowInventory = { ...mockInventoryItem, quantity: 1 };
        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([lowInventory]);
        createDispenseLog.mockReturnValue({ id: 'DL1' });

        processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'given',
          timeSlot: 'morning',
          id: 'LOG1'
        });

        // Should only dispense 1 (what's available), not 2 (the dose)
        expect(updateResidentInventoryQuantity).toHaveBeenCalledWith('INV1', -1);
        expect(createDispenseLog).toHaveBeenCalledWith(
          expect.objectContaining({
            quantityDispensed: 1,
            previousQuantity: 1,
            newQuantity: 0
          })
        );
      });
    });

    describe('medication refused (restore)', () => {
      const mockPrescription = {
        id: 'P1',
        medicationName: 'Aspirin',
        schedule: {
          morning: { enabled: true, dose: '2', unit: 'tabletes' }
        }
      };

      const mockInventoryItem = {
        id: 'INV1',
        medicationName: 'Aspirin',
        quantity: 98
      };

      const today = new Date().toISOString().split('T')[0];

      it('should restore inventory when medication refused AND prior dispense exists', () => {
        const priorDispenseLog = {
          prescriptionId: 'P1',
          timeSlot: 'morning',
          type: DISPENSE_TYPES.auto.value,
          dispensedAt: `${today}T08:00:00.000Z`
        };

        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([mockInventoryItem]);
        getAllDispenseLogs.mockReturnValue([priorDispenseLog]);
        createDispenseLog.mockReturnValue({ id: 'DL2' });

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'refused',
          timeSlot: 'morning',
          id: 'LOG2'
        });

        expect(updateResidentInventoryQuantity).toHaveBeenCalledWith('INV1', 2);
        expect(createDispenseLog).toHaveBeenCalledWith(
          expect.objectContaining({
            quantityDispensed: -2, // Negative for restore
            type: DISPENSE_TYPES.restore.value,
            previousQuantity: 98,
            newQuantity: 100
          })
        );
        expect(result).toEqual({ id: 'DL2' });
      });

      it('should NOT restore inventory when no prior dispense exists (BUG FIX)', () => {
        // This is the critical test for the bugbot issue
        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([mockInventoryItem]);
        getAllDispenseLogs.mockReturnValue([]); // No prior dispense!

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'refused',
          timeSlot: 'morning',
          id: 'LOG2'
        });

        // Should NOT update inventory or create log
        expect(updateResidentInventoryQuantity).not.toHaveBeenCalled();
        expect(createDispenseLog).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });

      it('should NOT restore if prior dispense was on different day', () => {
        const yesterdayDispenseLog = {
          prescriptionId: 'P1',
          timeSlot: 'morning',
          type: DISPENSE_TYPES.auto.value,
          dispensedAt: '2020-01-01T08:00:00.000Z' // Different day
        };

        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([mockInventoryItem]);
        getAllDispenseLogs.mockReturnValue([yesterdayDispenseLog]);

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'refused',
          timeSlot: 'morning',
          id: 'LOG2'
        });

        expect(updateResidentInventoryQuantity).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });

      it('should NOT restore if prior dispense was for different timeSlot', () => {
        const differentSlotLog = {
          prescriptionId: 'P1',
          timeSlot: 'evening', // Different slot
          type: DISPENSE_TYPES.auto.value,
          dispensedAt: `${today}T18:00:00.000Z`
        };

        getPrescriptionById.mockReturnValue(mockPrescription);
        getResidentInventory.mockReturnValue([mockInventoryItem]);
        getAllDispenseLogs.mockReturnValue([differentSlotLog]);

        const result = processAdministrationEvent({
          prescriptionId: 'P1',
          residentId: 'R1',
          status: 'refused',
          timeSlot: 'morning',
          id: 'LOG2'
        });

        expect(updateResidentInventoryQuantity).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });
  });

  describe('checkInventoryNeeds', () => {
    it('should identify medications with insufficient stock for 4 days', () => {
      const prescriptions = [{
        id: 'P1',
        medicationName: 'Aspirin',
        status: 'active',
        frequency: 'daily',
        schedule: {
          morning: { enabled: true, dose: '2' },
          evening: { enabled: true, dose: '1' }
        }
      }];

      // Daily dose = 3, 4-day need = 12
      // Current stock = 5, so shortage = 7
      getResidentInventory.mockReturnValue([{
        id: 'INV1',
        medicationName: 'Aspirin',
        quantity: 5
      }]);

      const needs = checkInventoryNeeds('R1', prescriptions);

      expect(needs).toHaveLength(1);
      expect(needs[0]).toEqual({
        prescriptionId: 'P1',
        medicationName: 'Aspirin',
        currentStock: 5,
        fourDayNeed: 12,
        shortage: 7,
        inventoryItemId: 'INV1'
      });
    });

    it('should skip as_needed prescriptions', () => {
      const prescriptions = [{
        id: 'P1',
        medicationName: 'Paracetamol',
        status: 'active',
        frequency: 'as_needed',
        schedule: {
          morning: { enabled: true, dose: '2' }
        }
      }];

      getResidentInventory.mockReturnValue([]);

      const needs = checkInventoryNeeds('R1', prescriptions);

      expect(needs).toHaveLength(0);
    });

    it('should skip inactive prescriptions', () => {
      const prescriptions = [{
        id: 'P1',
        medicationName: 'Aspirin',
        status: 'discontinued',
        frequency: 'daily',
        schedule: {
          morning: { enabled: true, dose: '2' }
        }
      }];

      getResidentInventory.mockReturnValue([]);

      const needs = checkInventoryNeeds('R1', prescriptions);

      expect(needs).toHaveLength(0);
    });

    it('should adjust for specific_days frequency', () => {
      const prescriptions = [{
        id: 'P1',
        medicationName: 'Vitamins',
        status: 'active',
        frequency: 'specific_days',
        specificDays: ['monday', 'wednesday', 'friday'], // 3 days per week
        schedule: {
          morning: { enabled: true, dose: '1' }
        }
      }];

      // Daily average = 1 * 3/7 ≈ 0.43
      // 4-day need = ceil(0.43 * 4) = 2
      getResidentInventory.mockReturnValue([{
        id: 'INV1',
        medicationName: 'Vitamins',
        quantity: 1
      }]);

      const needs = checkInventoryNeeds('R1', prescriptions);

      expect(needs).toHaveLength(1);
      expect(needs[0].fourDayNeed).toBe(2);
      expect(needs[0].shortage).toBe(1);
    });

    it('should return empty array when all prescriptions have sufficient stock', () => {
      const prescriptions = [{
        id: 'P1',
        medicationName: 'Aspirin',
        status: 'active',
        frequency: 'daily',
        schedule: {
          morning: { enabled: true, dose: '1' }
        }
      }];

      // Daily dose = 1, 4-day need = 4
      // Current stock = 100, plenty available
      getResidentInventory.mockReturnValue([{
        id: 'INV1',
        medicationName: 'Aspirin',
        quantity: 100
      }]);

      const needs = checkInventoryNeeds('R1', prescriptions);

      expect(needs).toHaveLength(0);
    });
  });
});
