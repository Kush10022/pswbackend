// src/routes/index.js
/* global */

// Express
const express = require('express');

// Get the hostname of the server
const { hostname } = require('os');

// Our authentication middleware
const { authenticate } = require('../authorization');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

// Getting success response
const { createSuccessResponse } = require('../response');

/**
 * Expose all of our API routes on /v1/prt* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1/prt`, authenticate(), require('./protected-api'));

/**
 * Expose all of our upnrotected API routes on /v1/unprt/* to include an API version.
 */
router.use(`/v1/unprt`, require('./unprotected-api'));

// Expose the auth routes for user authorization and authentication
router.use('/v1/auth', require('./auth'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response
  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/BTS-2023-2024/Group_08',
      version,
      hostname: hostname(),
    })
  );
});

module.exports = router;
