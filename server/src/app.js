const express = require('express');
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsMiddleware = require('./middleware/corsMiddleware');
const { Hotel } = require('./models/Hotel.model');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/hotels', hotelRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling
app.use(errorHandler);

// Seed hotels data if database is empty
async function checkAndSeedHotels() {
  try {
    const count = await Hotel.countDocuments();
    if (count === 0) {
      console.log('No hotels found in database. Seeding from JSON file...');
      try {
        const filePath = path.join(__dirname, '../../', 'src/assets/data.json');
        const data = await fs.readFile(filePath, 'utf8');
        const hotels = JSON.parse(data);
        await Hotel.insertMany(hotels);
        console.log(`Seeded ${hotels.length} hotels into the database.`);
      } catch (error) {
        console.error('Error seeding hotels:', error);
      }
    } else {
      console.log(`Database already has ${count} hotels.`);
    }
  } catch (error) {
    console.error('Error checking hotel collection:', error);
  }
}

// Database connection and server start
if (require.main === module) {
  (async () => {
    try {
      // Connect to database
      await connectDB();

      // Check and seed hotels
      await checkAndSeedHotels();

      // Start server
      const port = process.env.PORT || 8000;
      app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  })();
}

module.exports = app;
