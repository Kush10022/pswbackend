/* global process */
// src/authorization/jwt-auth.js
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const authorize = require('./authorize-middleware');
const logger = require('../logger');

// User Model
const User = require('../models/userModel');

// Ensure that the JWT_SECRET environment variable is set
if (!process.env.JWT_SECRET) {
  throw new Error('missing expected env var: JWT_SECRET');
}

// Configuration options for passport-jwt
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
  //algorithms: ['HS256'], // the algorithm used to sign the token
};

// Configure the strategy to use with passport

logger.info('Configured to use JWT strategy');

module.exports.strategy = () => {
  return new JwtStrategy(options, async (jwt_payload, done) => {
    logger.debut('payload received', jwt_payload);
    if (!jwt_payload) {
      return done(null, false); // No payload received
    }

    try {
      const email = jwt_payload.email; // Ensure jwt_payload has the 'email' field
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false); // No user found
      }

      // If user is found, proceed with the user object instead of just the email
      return done(null, user); // Authenticated, pass the user object
    } catch (err) {
      return done(err, false); // In case of error
    }
  });
};

module.exports.authenticate = () => authorize('jwt');
