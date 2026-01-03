const mongoose = require('mongoose');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function ensurePositiveInt(value, label) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
  return num;
}

function parsePagination(query) {
  let page = DEFAULT_PAGE;
  let limit = DEFAULT_LIMIT;

  if (query.page !== undefined) {
    page = ensurePositiveInt(query.page, 'page');
  }

  if (query.limit !== undefined) {
    limit = ensurePositiveInt(query.limit, 'limit');
  }

  limit = Math.min(limit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const sortField = typeof query.sort === 'string' && query.sort.trim() ? query.sort.trim() : 'createdAt';
  const sortOrder = query.order === 'desc' ? -1 : 1;

  return { page, limit, skip, sort: { [sortField]: sortOrder } };
}

function ensureValidObjectId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${label} format`);
  }
}

function asString(value) {
  return typeof value === 'string' ? value.trim() : undefined;
}

function asNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(asString).filter(Boolean);
}

function normalizeRooms(rooms) {
  if (!Array.isArray(rooms)) return [];
  return rooms
    .map((room) => {
      if (!room || typeof room !== 'object') return null;
      const name = asString(room.name);
      const description = asString(room.description);
      const price = asNumber(room.price);
      if (!name || !description || price === undefined) return null;
      return { name, description, price };
    })
    .filter(Boolean);
}

function sanitizeHotelPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const hotel = {};

  const name = asString(payload.name);
  if (name) hotel.name = name;

  const nightlyPrice = asNumber(payload.nightlyPrice);
  if (nightlyPrice !== undefined) hotel.nightlyPrice = nightlyPrice;

  const cardBackground = asString(payload.cardBackground);
  if (cardBackground) hotel.cardBackground = cardBackground;

  const rating = asNumber(payload.rating);
  if (rating !== undefined) hotel.rating = rating;

  const accommodationType = asString(payload.accommodationType);
  if (accommodationType) hotel.accommodationType = accommodationType;

  const overview = asString(payload.overview);
  if (overview) hotel.overview = overview;

  const addressPayload = payload.address;
  if (addressPayload && typeof addressPayload === 'object') {
    const address = {
      streetAddress: asString(addressPayload.streetAddress),
      city: asString(addressPayload.city),
      state: asString(addressPayload.state),
      country: asString(addressPayload.country),
    };
    if (Object.values(address).every(Boolean)) {
      hotel.address = address;
    }
  }

  const locationPayload = payload.location;
  if (locationPayload && typeof locationPayload === 'object') {
    const location = {
      lat: asNumber(locationPayload.lat),
      lng: asNumber(locationPayload.lng),
    };
    if (location.lat !== undefined && location.lng !== undefined) {
      hotel.location = location;
    }
  }

  const photos = normalizeStringArray(payload.photos);
  if (photos.length) hotel.photos = photos;

  const amenities = normalizeStringArray(payload.amenities);
  if (amenities.length) hotel.amenities = amenities;

  const rooms = normalizeRooms(payload.rooms);
  if (rooms.length) hotel.rooms = rooms;

  return hotel;
}

function validateHotelCreate(sanitized) {
  const requiredFields = [
    'name',
    'nightlyPrice',
    'cardBackground',
    'address',
    'rating',
    'accommodationType',
    'photos',
    'overview',
    'rooms',
    'location',
    'amenities',
  ];

  const missing = requiredFields.filter((field) => !sanitized[field]);
  if (missing.length) {
    throw new Error(`Missing required field(s): ${missing.join(', ')}`);
  }

  if (!Array.isArray(sanitized.photos) || sanitized.photos.length === 0) {
    throw new Error('Photos must include at least one item');
  }

  if (!Array.isArray(sanitized.amenities) || sanitized.amenities.length === 0) {
    throw new Error('Amenities must include at least one item');
  }

  if (!Array.isArray(sanitized.rooms) || sanitized.rooms.length === 0) {
    throw new Error('Rooms must include at least one item');
  }
}

module.exports = {
  parsePagination,
  ensureValidObjectId,
  sanitizeHotelPayload,
  validateHotelCreate,
};
