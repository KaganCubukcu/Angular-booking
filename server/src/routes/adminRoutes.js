const express = require('express');
const {
  getAllUsers,
  toggleAdminStatus,
  getAllHotelsAdmin,
  getHotelById,
  addHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/AdminController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply auth and isAdmin middleware to all routes
router.use(auth, isAdmin);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:userId/toggle-admin', toggleAdminStatus);

// Hotel management routes
router.get('/hotels', getAllHotelsAdmin);
router.get('/hotels/:hotelId', getHotelById);
router.post('/hotels', addHotel);
router.put('/hotels/:hotelId', updateHotel);
router.delete('/hotels/:hotelId', deleteHotel);

module.exports = router;
