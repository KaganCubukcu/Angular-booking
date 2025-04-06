const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const { Hotel } = require('../models/Hotel.model');
require('dotenv').config();

async function seedHotels() {
    try {
        // Connect to the database
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');

        // Check if there are hotels in the database
        const count = await Hotel.countDocuments();
        if (count > 0) {
            console.log(`Database already has ${count} hotels. Skipping seeding.`);
            return;
        }

        // Read JSON file
        const filePath = path.join(__dirname, '../../../src/assets/data.json');
        const data = await fs.readFile(filePath, 'utf8');
        const hotels = JSON.parse(data);

        // Insert hotels into the database
        const result = await Hotel.insertMany(hotels);
        console.log(`Seeded ${result.length} hotels into the database`);
    } catch (error) {
        console.error('Error seeding hotels:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
    seedHotels()
        .then(() => {
            console.log('Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedHotels }; 