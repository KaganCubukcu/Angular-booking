const express = require('express');
const {
    getAllHotels,
    getHotelById,
    getHotelByName,
    createHotel,
    updateHotel,
    deleteHotel
} = require('../controllers/HotelController');

const router = express.Router();

// Get all hotels
router.get('/', getAllHotels);

// Get hotel by ID
router.get('/id/:id', getHotelById);

// Get hotel by name (for slug-based routing)
router.get('/name/:name', getHotelByName);

// Create a new hotel
router.post('/', createHotel);

// Update hotel
router.put('/:id', updateHotel);

// Delete hotel
router.delete('/:id', deleteHotel);

module.exports = router; 