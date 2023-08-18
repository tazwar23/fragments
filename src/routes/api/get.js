// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const frag = require('../../model/fragment');
const logger = require('../../logger');
var md = require('markdown-it')();

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
      res.type(fragObj.mimeType);
      return await fragObj.getData();
    })
    .then((data) => {
      if (data) {
        //Checking if the extension required is .html
        if (paramParts[1] === 'html') {
          //using mark-it-down
          data = md.render(data.toString('utf-8'));
          //converting it to buffer
          data = Buffer.from(data, 'utf-8');
        }

        logger.debug({ data }, 'Got fragments data from V1/fragments/:id');
        return res.status(200).send(data);
      } else {
        throw new Error('Object not found');
      }
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
