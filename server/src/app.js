const express = require('express');
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsMiddleware = require('./middleware/corsMiddleware');

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling
app.use(errorHandler);

// Database connection
connectDB();

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
