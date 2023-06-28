// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const frag = require('../../model/fragment');
const logger = require('../../logger');

const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports.get = (req, res) => {
  try {
    var expand = req.query.expand == 1 ? true : false;

    frag.Fragment.byUser(req.user, expand).then((data) => {
      var resData = { fragments: data };
      logger.debug({ resData }, 'Got fragments from V1/fragments/');
      res.status(200).json(createSuccessResponse(resData));
    });
  } catch (msg) {
    res.status(400).json(createErrorResponse(msg.message));
  }
};

module.exports.getOne = (req, res) => {
  var fragObj = new frag.Fragment({ id: req.params.id, ownerId: req.user, type: 'text/plain' });
  fragObj
    .getData()
    .then((data) => {
      if (data) {
        var buffObject = Buffer.from(data);
        buffObject = buffObject.toString();
        res.setHeader('Content-Type', 'text/plain');
        logger.debug({ buffObject }, 'Got fragments data from V1/fragments/:id');
        res.status(200).send(buffObject);
      } else {
        throw new Error('Object not found');
      }
    })
    .catch((error) => {
      res.status(404).json(createErrorResponse(404, error.message));
    });
};
