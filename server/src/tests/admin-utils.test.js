const { parsePagination, ensureValidObjectId, sanitizeHotelPayload, validateHotelCreate } = require('../utils/adminUtils');

const mongoose = require('mongoose');

describe('parsePagination', () => {
  test('returns defaults when no params', () => {
    const result = parsePagination({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(0);
    expect(result.sort).toEqual({ createdAt: 1 });
  });

  test('parses valid params and caps limit', () => {
    const result = parsePagination({ page: '2', limit: '500', sort: 'name', order: 'desc' });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(100);
    expect(result.skip).toBe(100);
    expect(result.sort).toEqual({ name: -1 });
  });

  test('throws on invalid page', () => {
    expect(() => parsePagination({ page: 'zero' })).toThrow('page must be a positive integer');
  });
});

describe('ensureValidObjectId', () => {
  test('accepts valid id', () => {
    expect(() => ensureValidObjectId(new mongoose.Types.ObjectId().toString(), 'userId')).not.toThrow();
  });

  test('throws on invalid id', () => {
    expect(() => ensureValidObjectId('not-an-id', 'userId')).toThrow('Invalid userId format');
  });
});

describe('sanitizeHotelPayload and validateHotelCreate', () => {
  test('sanitizes and keeps only allowed fields', () => {
    const payload = {
      name: 'Hotel A',
      nightlyPrice: '120',
      cardBackground: '#fff',
      address: { streetAddress: '123', city: 'X', state: 'Y', country: 'Z', extra: 'nope' },
      rating: '4.5',
      accommodationType: 'resort',
      photos: ['p1', ' ', null],
      overview: 'Nice place',
      rooms: [{ name: 'R1', description: 'D', price: '50', extra: 'x' }, { bad: true }],
      location: { lat: '10', lng: '20' },
      amenities: ['wifi', '', 'pool'],
      unexpected: 'drop',
    };

    const sanitized = sanitizeHotelPayload(payload);
    expect(sanitized).toEqual({
      name: 'Hotel A',
      nightlyPrice: 120,
      cardBackground: '#fff',
      address: { streetAddress: '123', city: 'X', state: 'Y', country: 'Z' },
      rating: 4.5,
      accommodationType: 'resort',
      photos: ['p1'],
      overview: 'Nice place',
      rooms: [{ name: 'R1', description: 'D', price: 50 }],
      location: { lat: 10, lng: 20 },
      amenities: ['wifi', 'pool'],
    });
  });

  test('validateHotelCreate throws when required fields missing', () => {
    expect(() => validateHotelCreate({ name: 'Only name' })).toThrow('Missing required field');
  });
});
