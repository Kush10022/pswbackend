/* global process */

const mongoose = require('mongoose');
const logger = require('../logger');

async function connectDB() {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URI);

    const connection = mongoose.connection;

    connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
      resolve();
    });

    connection.on('error', (err) => {
      logger.error('MongoDB connection error. Please make sure MongoDB is running. ' + err);
      reject(err);
    });
  });
}


module.exports = connectDB;
