import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateLeadId,
  getCurrentDate,
  getCurrentTime,
  createProspect,
  upgradeToLead
} from './leadHelpers';

describe('Lead Helpers Module', () => {
  describe('generateLeadId', () => {
    it('should generate ID with correct format', () => {
      const id = generateLeadId();
      const year = new Date().getFullYear();
      expect(id).toMatch(new RegExp(`^L-${year}-\\d{3}$`));
    });

    it('should generate different IDs on multiple calls', () => {
      const ids = new Set();
      for (let i = 0; i < 10; i++) {
        ids.add(generateLeadId());
      }
      // Should have at least a few unique IDs (probability of collision is low)
      expect(ids.size).toBeGreaterThan(1);
    });
  });

  describe('getCurrentDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getCurrentDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return today\'s date', () => {
      const expected = new Date().toISOString().split('T')[0];
      expect(getCurrentDate()).toBe(expected);
    });
  });

  describe('getCurrentTime', () => {
    it('should return time in HH:MM format', () => {
      const time = getCurrentTime();
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('createProspect', () => {
    it('should create prospect with all required fields', () => {
      const leadData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000',
        comment: 'Test comment'
      };

      const prospect = createProspect(leadData);

      expect(prospect).toHaveProperty('id');
      expect(prospect).toHaveProperty('firstName', 'Anna');
      expect(prospect).toHaveProperty('lastName', 'Bērziņa');
      expect(prospect).toHaveProperty('email', 'anna@example.com');
      expect(prospect).toHaveProperty('phone', '+371 20000000');
      expect(prospect).toHaveProperty('comment', 'Test comment');
      expect(prospect).toHaveProperty('status', 'prospect');
      expect(prospect).toHaveProperty('createdDate');
      expect(prospect).toHaveProperty('createdTime');
      expect(prospect).toHaveProperty('source', 'manual');
      expect(prospect).toHaveProperty('assignedTo', 'Kristens Blūms');
    });

    it('should generate valid ID', () => {
      const prospect = createProspect({ firstName: 'Test', lastName: 'User', email: 'test@test.com', phone: '123' });
      expect(prospect.id).toMatch(/^L-\d{4}-\d{3}$/);
    });

    it('should set status to prospect', () => {
      const prospect = createProspect({ firstName: 'Test', lastName: 'User', email: 'test@test.com', phone: '123' });
      expect(prospect.status).toBe('prospect');
    });
  });

  describe('upgradeToLead', () => {
    it('should upgrade prospect to lead with consultation data', () => {
      const prospect = {
        id: 'L-2025-001',
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000',
        status: 'prospect'
      };

      const consultation = {
        facility: 'melodija',
        careLevel: '3',
        duration: 'long',
        roomType: 'single',
        price: 77,
        notes: 'Test notes'
      };

      const lead = upgradeToLead(prospect, consultation);

      expect(lead).toHaveProperty('id', 'L-2025-001');
      expect(lead).toHaveProperty('firstName', 'Anna');
      expect(lead).toHaveProperty('lastName', 'Bērziņa');
      expect(lead).toHaveProperty('status', 'lead');
      expect(lead).toHaveProperty('consultation');
      expect(lead.consultation).toEqual(consultation);
    });

    it('should preserve all prospect fields', () => {
      const prospect = {
        id: 'L-2025-001',
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000',
        status: 'prospect',
        createdDate: '2025-12-20',
        createdTime: '10:00',
        assignedTo: 'Test User',
        comment: 'Test comment'
      };

      const consultation = {
        facility: 'melodija',
        careLevel: '3',
        duration: 'long',
        roomType: 'single',
        price: 77
      };

      const lead = upgradeToLead(prospect, consultation);

      expect(lead.createdDate).toBe('2025-12-20');
      expect(lead.createdTime).toBe('10:00');
      expect(lead.assignedTo).toBe('Test User');
      expect(lead.comment).toBe('Test comment');
    });

    it('should change status from prospect to lead', () => {
      const prospect = {
        id: 'L-2025-001',
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000',
        status: 'prospect'
      };

      const lead = upgradeToLead(prospect, {});
      expect(lead.status).toBe('lead');
    });
  });
});
