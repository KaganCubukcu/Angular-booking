const { User } = require('../models/User.model');
const { Hotel } = require('../models/Hotel.model');
const mongoose = require('mongoose');

// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
}

// Toggle admin status of a user
async function toggleAdminStatus(req, res) {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Toggle isAdmin status
        user.isAdmin = !user.isAdmin;
        await user.save();

        // Return updated user without password
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Error toggling admin status:', error);
        res.status(500).json({ error: 'Failed to update admin status', details: error.message });
    }
}

// Get all hotels (for admin panel)
async function getAllHotelsAdmin(req, res) {
    try {
        const hotels = await Hotel.find({});
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
    }
}

// Add new hotel
async function addHotel(req, res) {
    try {
        const hotelData = req.body;

        // Validate required fields
        const requiredFields = ['name', 'nightlyPrice', 'address', 'rating', 'accommodationType'];
        for (const field of requiredFields) {
            if (!hotelData[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Check if hotel with same name already exists
        const existingHotel = await Hotel.findOne({ name: hotelData.name });
        if (existingHotel) {
            return res.status(400).json({ error: 'Hotel with this name already exists' });
        }

        const hotel = new Hotel(hotelData);
        await hotel.save();

        res.status(201).json(hotel);
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(400).json({ error: 'Failed to create hotel', details: error.message });
    }
}

// Update hotel
async function updateHotel(req, res) {
    try {
        const { hotelId } = req.params;
        const updates = req.body;

        // Validate hotelId format
        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res.status(400).json({ error: 'Invalid hotel ID format' });
        }

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            updates,
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.status(200).json(hotel);
    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(400).json({ error: 'Failed to update hotel', details: error.message });
    }
}

// Delete hotel
async function deleteHotel(req, res) {
    try {
        const { hotelId } = req.params;

        // Validate hotelId format
        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res.status(400).json({ error: 'Invalid hotel ID format' });
        }

        const hotel = await Hotel.findByIdAndDelete(hotelId);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.status(200).json({ message: 'Hotel deleted successfully', hotelId });
    } catch (error) {
        console.error('Error deleting hotel:', error);
        res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
    }
}

module.exports = {
    getAllUsers,
    toggleAdminStatus,
    getAllHotelsAdmin,
    addHotel,
    updateHotel,
    deleteHotel
}; 