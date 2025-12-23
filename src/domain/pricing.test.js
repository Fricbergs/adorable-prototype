import { describe, it, expect } from 'vitest';
import { calculatePrice, PRICING_TABLE } from './pricing';

describe('Pricing Module', () => {
  describe('PRICING_TABLE', () => {
    it('should have pricing data for both facilities', () => {
      expect(PRICING_TABLE).toHaveProperty('melodija');
      expect(PRICING_TABLE).toHaveProperty('sampeteris');
    });

    it('should have pricing for all duration types', () => {
      expect(PRICING_TABLE.melodija).toHaveProperty('long');
      expect(PRICING_TABLE.melodija).toHaveProperty('short');
    });

    it('should have pricing for all room types', () => {
      expect(PRICING_TABLE.melodija.long).toHaveProperty('single');
      expect(PRICING_TABLE.melodija.long).toHaveProperty('double');
      expect(PRICING_TABLE.melodija.long).toHaveProperty('triple');
    });

    it('should have pricing for all care levels (1-4)', () => {
      const roomPrices = PRICING_TABLE.melodija.long.single;
      expect(roomPrices).toHaveProperty('1');
      expect(roomPrices).toHaveProperty('2');
      expect(roomPrices).toHaveProperty('3');
      expect(roomPrices).toHaveProperty('4');
    });
  });

  describe('calculatePrice', () => {
    it('should calculate correct price for šampēteris long-term single room level 1', () => {
      const price = calculatePrice({
        duration: 'long',
        roomType: 'single',
        careLevel: '1'
      });
      expect(price).toBe(69); // Šampēteris pricing
    });

    it('should calculate correct price for šampēteris short-term double room level 4', () => {
      const price = calculatePrice({
        duration: 'short',
        roomType: 'double',
        careLevel: '4'
      });
      expect(price).toBe(71); // Šampēteris pricing
    });

    it('should calculate correct price for šampēteris long-term single room level 3', () => {
      const price = calculatePrice({
        duration: 'long',
        roomType: 'single',
        careLevel: '3'
      });
      expect(price).toBe(82); // Šampēteris pricing
    });

    it('should calculate correct price for šampēteris long-term triple room level 2', () => {
      const price = calculatePrice({
        duration: 'long',
        roomType: 'triple',
        careLevel: '2'
      });
      expect(price).toBe(49); // Šampēteris pricing
    });

    it('should return null if any parameter is missing', () => {
      expect(calculatePrice({ duration: 'long', roomType: 'single' })).toBeNull();
      expect(calculatePrice({ duration: 'long', careLevel: '1' })).toBeNull();
      expect(calculatePrice({ roomType: 'single', careLevel: '1' })).toBeNull();
    });

    it('should return null for invalid duration', () => {
      const price = calculatePrice({
        duration: 'invalid',
        roomType: 'single',
        careLevel: '1'
      });
      expect(price).toBeNull();
    });

    it('should return null for invalid room type', () => {
      const price = calculatePrice({
        duration: 'long',
        roomType: 'invalid',
        careLevel: '1'
      });
      expect(price).toBeNull();
    });

    it('should return null for invalid care level', () => {
      const price = calculatePrice({
        duration: 'long',
        roomType: 'single',
        careLevel: '99'
      });
      expect(price).toBeNull();
    });
  });
});
