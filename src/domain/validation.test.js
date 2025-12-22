import { describe, it, expect } from 'vitest';
import { validateLeadForm, isValidForm, validateField, getFieldStatus } from './validation';

describe('Validation Module', () => {
  describe('validateLeadForm', () => {
    it('should return no errors for valid data', () => {
      const validData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(validData);
      expect(errors).toEqual({});
    });

    it('should require first name', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('firstName');
      expect(errors.firstName).toBe('Vārds ir obligāts');
    });

    it('should require last name', () => {
      const invalidData = {
        firstName: 'Anna',
        lastName: '',
        email: 'anna@example.com',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('lastName');
    });

    it('should require email', () => {
      const invalidData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: '',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('email');
    });

    it('should validate email format', () => {
      const invalidData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'invalid-email',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('email');
      expect(errors.email).toBe('Nederīgs e-pasta formāts');
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user+tag@domain.co.uk',
        'firstname.lastname@company.com'
      ];

      validEmails.forEach(email => {
        const data = {
          firstName: 'Anna',
          lastName: 'Bērziņa',
          email,
          phone: '+371 20000000'
        };
        const errors = validateLeadForm(data);
        expect(errors).not.toHaveProperty('email');
      });
    });

    it('should require phone', () => {
      const invalidData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: ''
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('phone');
    });

    it('should validate phone format', () => {
      const validPhones = [
        '+371 20000000',
        '+37120000000',
        '+1 (555) 123-4567'
      ];

      validPhones.forEach(phone => {
        const data = {
          firstName: 'Anna',
          lastName: 'Bērziņa',
          email: 'anna@example.com',
          phone
        };
        const errors = validateLeadForm(data);
        expect(errors).not.toHaveProperty('phone');
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: 'abc123'
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('phone');
      expect(errors.phone).toBe('Nederīgs tālruņa numurs');
    });

    it('should trim whitespace from fields', () => {
      const dataWithSpaces = {
        firstName: '  Anna  ',
        lastName: '  Bērziņa  ',
        email: '  anna@example.com  ',
        phone: '  +371 20000000  '
      };
      const errors = validateLeadForm(dataWithSpaces);
      expect(errors).toEqual({});
    });
  });

  describe('isValidForm', () => {
    it('should return true for empty errors object', () => {
      expect(isValidForm({})).toBe(true);
    });

    it('should return false for errors object with properties', () => {
      expect(isValidForm({ firstName: 'error' })).toBe(false);
    });
  });

  describe('validateField', () => {
    it('should validate firstName', () => {
      expect(validateField('firstName', 'Anna')).toBeNull();
      expect(validateField('firstName', '')).toBe('Vārds ir obligāts');
      expect(validateField('firstName', '   ')).toBe('Vārds ir obligāts');
    });

    it('should validate lastName', () => {
      expect(validateField('lastName', 'Bērziņa')).toBeNull();
      expect(validateField('lastName', '')).toBe('Uzvārds ir obligāts');
    });

    it('should validate email', () => {
      expect(validateField('email', 'test@example.com')).toBeNull();
      expect(validateField('email', '')).toBe('E-pasts ir obligāts');
      expect(validateField('email', 'invalid')).toBe('Nederīgs e-pasta formāts');
    });

    it('should validate phone', () => {
      expect(validateField('phone', '+371 20000000')).toBeNull();
      expect(validateField('phone', '')).toBe('Telefons ir obligāts');
      expect(validateField('phone', 'abc')).toBe('Nederīgs tālruņa numurs');
    });

    it('should return null for unknown field', () => {
      expect(validateField('unknown', 'value')).toBeNull();
    });
  });

  describe('getFieldStatus', () => {
    it('should return correct status for valid field', () => {
      const status = getFieldStatus('firstName', 'Anna', true);
      expect(status.isValid).toBe(true);
      expect(status.error).toBeNull();
      expect(status.showSuccess).toBe(true);
    });

    it('should return correct status for invalid field', () => {
      const status = getFieldStatus('firstName', '', true);
      expect(status.isValid).toBe(false);
      expect(status.error).toBe('Vārds ir obligāts');
      expect(status.showSuccess).toBe(false);
    });

    it('should not show success if not touched', () => {
      const status = getFieldStatus('firstName', 'Anna', false);
      expect(status.isValid).toBe(true);
      expect(status.showSuccess).toBe(false);
    });

    it('should not show success for empty field', () => {
      const status = getFieldStatus('firstName', '', true);
      expect(status.showSuccess).toBe(false);
    });
  });
});
