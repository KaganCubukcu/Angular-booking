const { Hotel } = require('../models/Hotel.model');
const fs = require('fs').promises;
const path = require('path');

// Get all hotels
async function getAllHotels(req, res) {
    try {
        const hotels = await Hotel.find();

        // If no hotels found in database, initialize from JSON file
        if (hotels.length === 0) {
            const rawData = await fs.readFile(
                path.join(__dirname, '../../..', 'src/assets/data.json'),
                'utf8'
            );
            const hotelsData = JSON.parse(rawData);

            await Hotel.insertMany(hotelsData);
            return res.status(200).json(hotelsData);
        }

        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
    }
}

// Get hotel by ID
async function getHotelById(req, res) {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).json({ error: 'Failed to fetch hotel', details: error.message });
    }
}

// Get hotel by name (for slug-based routing)
async function getHotelByName(req, res) {
    try {
        const hotelName = req.params.name;

        // Try exact match first
        let hotel = await Hotel.findOne({ name: hotelName });

        // If not found, try matching slugified version (hyphens instead of spaces)
        if (!hotel) {
            const nameWithSpaces = hotelName.replace(/-/g, ' ');
            hotel = await Hotel.findOne({
                name: { $regex: new RegExp('^' + nameWithSpaces.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
            });
        }

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        console.error('Error fetching hotel by name:', error);
        res.status(500).json({ error: 'Failed to fetch hotel', details: error.message });
    }
}

// Create a new hotel
async function createHotel(req, res) {
    try {
        const hotel = new Hotel(req.body);
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
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
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
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error('Error deleting hotel:', error);
        res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
    }
}

module.exports = {
    getAllHotels,
    getHotelById,
    getHotelByName,
    createHotel,
    updateHotel,
    deleteHotel
}; 