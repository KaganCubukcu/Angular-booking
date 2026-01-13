const app = require('../server/src/app');
const { connectDB } = require('../server/src/config/database');

connectDB();

module.exports = app;
