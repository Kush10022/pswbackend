const express = require('express');

// Response helpers
const { createSuccessResponse } = require('../../response');

// Create a router on which to mount our API endpoints
const router = express.Router();

router.get('/', (req, res) => {
  res
    .status(200)
    .json(
      res.status(200).json(createSuccessResponse({ message: 'Hello from the Un-Protected API!' }))
    );
});

module.exports = router;