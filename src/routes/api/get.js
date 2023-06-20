// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const frag = require('../../model/fragment');

const { createSuccessResponse } = require('../../response');
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...

  frag.Fragment.byUser(req.user).then((data) => {
    var resData = { fragments: data };
    res.status(200).json(createSuccessResponse(resData));
  });
};
