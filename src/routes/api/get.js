// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const frag = require('../../model/fragment');

const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports.get = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  try {
    var expand = req.query.expand == 1 ? true : false;

    frag.Fragment.byUser(req.user, expand).then((data) => {
      var resData = { fragments: data };
      res.status(200).json(createSuccessResponse(resData));
    });
  } catch (msg) {
    res.status(400).json(createErrorResponse(msg.message));
  }
};

module.exports.getOne = (req, res) => {
  try {
    var fragObj = new frag.Fragment({ id: req.params.id, ownerId: req.user, type: 'text/plain' });
    fragObj.getData().then((data) => {
      const buffObject = Buffer.from(data);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(buffObject.toString());
    });
  } catch (msg) {
    res.status(404).json(createErrorResponse(404, msg.message));
  }
};
