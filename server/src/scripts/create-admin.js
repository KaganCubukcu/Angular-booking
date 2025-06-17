const mongoose = require('mongoose');
const { User } = require('../models/User.model');
require('dotenv').config();

async function promoteUserToAdmin(email) {
    try {
        // Connect to the database
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found`);
            return;
        }

        // Update user to admin
        user.isAdmin = true;
        await user.save();

        console.log(`User ${user.firstName} ${user.lastName} (${user.email}) has been promoted to admin`);
    } catch (error) {
        console.error('Error promoting user to admin:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: npm run create-admin user@example.com');
    process.exit(1);
}

// Run the promote function
promoteUserToAdmin(email)
    .then(() => {
        console.log('Promotion completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Promotion failed:', error);
        process.exit(1);
    });