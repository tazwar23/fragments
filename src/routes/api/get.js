// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse } = require('../../response');
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  var resData = { fragments: [] };
  res.status(200).json(createSuccessResponse(resData));
};
