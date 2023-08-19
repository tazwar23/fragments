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
      return res.status(200).json(createSuccessResponse(resData));
    });
  } catch (msg) {
    return res.status(400).json(createErrorResponse(msg.message));
  }
};

module.exports.getOne = async (req, res) => {
  //Splitting the parameter in two to seperate the extension
  const paramParts = req.params.id.split('.');

  //Getting fragment object through the user and the request parameter
  frag.Fragment.byId(req.user, paramParts[0])
    .then(async (fragObj) => {
      fragObj = new frag.Fragment(fragObj);

      let data = await fragObj.getData();
      let mimeType = fragObj.mimeType;

      //Checking if the extension is required
      if (paramParts.length > 1) {
        const conversionResult = await fragObj.convert(data, paramParts[1]);
        data = conversionResult.data;
        mimeType = conversionResult.mimeType;
      }
      res.type(mimeType);
      logger.debug({ data }, 'Got fragments data from V1/fragments/:id');
      return res.status(200).send(data);
    })
    .catch((error) => {
      return res.status(404).json(createErrorResponse(404, error.message));
    });
};

module.exports.getOneWithInfo = async (req, res) => {
  //Getting fragment object through the user and the request parameter
  frag.Fragment.byId(req.user, req.params.id)
    .then((fragObject) => {
      return res.status(200).send(createSuccessResponse({ fragment: fragObject }));
    })
    .catch((error) => {
      return res.status(404).json(createErrorResponse(404, error.message));
    });
};
