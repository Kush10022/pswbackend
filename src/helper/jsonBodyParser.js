
const express = require('express');
const contentType = require('content-type');

const jsonBody = () =>
  express.json({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return type
    },
  });

module.exports = jsonBody;