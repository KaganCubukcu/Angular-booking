const { User } = require('../models/User.model');
const { Hotel } = require('../models/Hotel.model');
const { AuditLog } = require('../models/AuditLog.model');
const { parsePagination, ensureValidObjectId, sanitizeHotelPayload, validateHotelCreate } = require('../utils/adminUtils');

function maskEmail(value) {
  if (typeof value !== 'string') return value;
  const [user, domain] = value.split('@');
  if (!domain) return value;
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}*`;
  return `${maskedUser}@${domain}`;
}

function maskPhone(value) {
  if (typeof value !== 'string') return value;
  if (value.length <= 4) return '***';
  const tail = value.slice(-4);
  return `***${tail}`;
}

function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return undefined;
  const sanitized = {};
  Object.entries(metadata).forEach(([key, val]) => {
    if (typeof val === 'string') {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('email')) {
        sanitized[key] = maskEmail(val);
      } else if (lowerKey.includes('phone')) {
        sanitized[key] = maskPhone(val);
      } else {
        sanitized[key] = val;
      }
    } else {
      sanitized[key] = val;
    }
  });
  return sanitized;
}

async function recordAudit(req, { action, targetType, targetId, metadata }) {
  try {
    await AuditLog.create({
      action,
      actorId: req.user?._id,
      targetType,
      targetId,
      metadata: sanitizeMetadata(metadata),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const { page, limit, skip, sort } = parsePagination(req.query);

    const [users, total] = await Promise.all([User.find({}).select('-password').sort(sort).skip(skip).limit(limit), User.countDocuments()]);

    res.set('X-Total-Count', total.toString());
    res.set('X-Page', page.toString());
    res.set('X-Limit', limit.toString());

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    const status = error.message.includes('positive integer') ? 400 : 500;
    res.status(status).json({ error: 'Failed to fetch users', details: error.message });
  }
}

// Toggle admin status of a user
async function toggleAdminStatus(req, res) {
  try {
    const { userId } = req.params;
    ensureValidObjectId(userId, 'userId');

    if (req.user && req.user._id.toString() === userId) {
      return res.status(403).json({ error: 'Cannot change your own admin status', code: 'CANNOT_SELF_DEMOTE' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return res.status(409).json({ error: 'At least one admin is required', code: 'LAST_ADMIN_PROTECTED' });
      }
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();

    await recordAudit(req, {
      action: user.isAdmin ? 'grant_admin' : 'revoke_admin',
      targetType: 'User',
      targetId: user._id,
      metadata: { userId: user._id },
    });

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error toggling admin status:', error);
    const status = error.message.includes('Invalid userId format') ? 400 : 500;
    res.status(status).json({ error: 'Failed to update admin status', details: error.message });
  }
}

// Get all hotels (for admin panel)
async function getAllHotelsAdmin(req, res) {
  try {
    const { page, limit, skip, sort } = parsePagination(req.query);

    const [hotels, total] = await Promise.all([Hotel.find({}).sort(sort).skip(skip).limit(limit), Hotel.countDocuments()]);

    res.set('X-Total-Count', total.toString());
    res.set('X-Page', page.toString());
    res.set('X-Limit', limit.toString());

    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    const status = error.message.includes('positive integer') ? 400 : 500;
    res.status(status).json({ error: 'Failed to fetch hotels', details: error.message });
  }
}

// Get hotel by ID (for admin panel)
async function getHotelById(req, res) {
  try {
    const { hotelId } = req.params;
    ensureValidObjectId(hotelId, 'hotelId');

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    const status = error.message.includes('Invalid hotelId format') ? 400 : 500;
    res.status(status).json({ error: 'Failed to fetch hotel', details: error.message });
  }
}

// Add new hotel
async function addHotel(req, res) {
  try {
    const sanitized = sanitizeHotelPayload(req.body);
    validateHotelCreate(sanitized);

    const existingHotel = await Hotel.findOne({ name: sanitized.name });
    if (existingHotel) {
      return res.status(409).json({ error: 'Hotel with this name already exists', code: 'DUPLICATE_HOTEL' });
    }

    const hotel = new Hotel(sanitized);
    await hotel.save();

    await recordAudit(req, {
      action: 'create_hotel',
      targetType: 'Hotel',
      targetId: hotel._id,
      metadata: { name: hotel.name },
    });

    res.status(201).json(hotel);
  } catch (error) {
    console.error('Error creating hotel:', error);
    const status = error.message.startsWith('Missing required field') || error.message.includes('must include') ? 400 : 500;
    res.status(status).json({ error: 'Failed to create hotel', details: error.message });
  }
}

// Update hotel
async function updateHotel(req, res) {
  try {
    const { hotelId } = req.params;
    ensureValidObjectId(hotelId, 'hotelId');

    const updates = sanitizeHotelPayload(req.body);
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'No valid fields to update', code: 'EMPTY_UPDATE' });
    }

    const hotel = await Hotel.findByIdAndUpdate(hotelId, { $set: updates }, { new: true, runValidators: true });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    await recordAudit(req, {
      action: 'update_hotel',
      targetType: 'Hotel',
      targetId: hotel._id,
      metadata: { fields: Object.keys(updates) },
    });

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    const isBadRequest = error.message.includes('Invalid hotelId format') || error.message.includes('No valid fields');
    res.status(isBadRequest ? 400 : 500).json({ error: 'Failed to update hotel', details: error.message });
  }
}

// Delete hotel
async function deleteHotel(req, res) {
  try {
    const { hotelId } = req.params;
    ensureValidObjectId(hotelId, 'hotelId');

    const hotel = await Hotel.findByIdAndDelete(hotelId);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    await recordAudit(req, {
      action: 'delete_hotel',
      targetType: 'Hotel',
      targetId: hotel._id,
      metadata: { name: hotel.name },
    });

    res.status(200).json({ message: 'Hotel deleted successfully', hotelId });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    const status = error.message.includes('Invalid hotelId format') ? 400 : 500;
    res.status(status).json({ error: 'Failed to delete hotel', details: error.message });
  }
}

module.exports = {
  getAllUsers,
  toggleAdminStatus,
  getAllHotelsAdmin,
  getHotelById,
  addHotel,
  updateHotel,
  deleteHotel,
};
