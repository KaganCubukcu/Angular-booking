const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const addressSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const locationSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    nightlyPrice: {
        type: Number,
        required: true
    },
    cardBackground: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    accommodationType: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    rooms: {
        type: [roomSchema],
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = { Hotel }; 