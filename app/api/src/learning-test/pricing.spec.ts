import { describe, expect, it } from 'vitest';
import {
  applyTax,
  calculateDiscount,
  chunkArray,
  formatCurrency,
  slugify,
} from './pricing';

describe('calculate discount ', () => {
  it('should calculate discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
    expect(calculateDiscount(100, 50)).toBe(50);
    expect(calculateDiscount(100, 100)).toBe(0);
  });
  it('should throw error', () => {
    expect(() => calculateDiscount(100, -1)).toThrow(
      'percentOff must be between 0 and 100',
    );
    expect(() => calculateDiscount(100, 101)).toThrow(
      'percentOff must be between 0 and 100',
    );
  });
});

describe('format currency', () => {
  it('should return currency formatted', () => {
    expect(formatCurrency(10, 'USD')).toBe('$10.00');
    expect(formatCurrency(10, 'EUR')).toBe('€10.00');
    expect(formatCurrency(100)).toBe('$100.00');
  });

  describe('chunk array', () => {
    it('should return chunk array', () => {
      expect(chunkArray([1, 2, 3, 4, 5, 6], 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      expect(chunkArray([1, 2, 3, 4, 5, 6], 3)).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      expect(chunkArray([], 3)).toEqual([]);
    });
    it('should throw error', () => {
      expect(() => chunkArray([1, 2, 3, 4, 5, 6], -1)).toThrow(
        'size must be greater than 0',
      );
    });
  });
  describe('slugify fuction', () => {
    it('should return slugified string', () => {
      expect(slugify('Hello, world!')).toBe('hello-world');
      expect(slugify('Hello, @$world!')).toBe('hello-world');
      expect(slugify('HELLO WORLD @x')).toBe('hello-world-x');
    });
  });
  describe('apply tax rate ', () => {
    it('should apply tax rate', () => {
      expect(applyTax(100, 0)).toBe(100);
      expect(applyTax(100, 50)).toBe(5100);
      expect(applyTax(100, 100)).toBe(10100);
    });
  });
});
