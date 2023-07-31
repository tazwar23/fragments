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

module.exports.getOne = async (req, res) => {
  //Getting fragment object through the user and the request parameter
  frag.Fragment.byId(req.user, req.params.id)
    //Using fragment.getData() to get the buffer object which holds the data
    .then((fragObj) => fragObj.getData())
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

module.exports.getOneWithInfo = async (req, res) => {
  //Getting fragment object through the user and the request parameter
  frag.Fragment.byId(req.user, req.params.id)
    .then((fragObject) => {
      //If the fragment object is valid
      if (fragObject) {
        res.status(200).send(createSuccessResponse({ fragment: fragObject }));
      } else {
        throw new Error('Object not found');
      }
    })
    .catch((error) => {
      res.status(404).json(createErrorResponse(404, error.message));
    });
};
