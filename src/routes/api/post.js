const frag = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    // // Assuming the request body contains necessary data for creating a fragment
    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
    }

    logger.info('Creating fragment via post route');
    const fragmentData = req.body;

    let fragObj = new frag.Fragment({
      ownerId: req.user,
      type: req.headers['content-type'],
      size: fragmentData.length,
    });

    await fragObj.setData(fragmentData);
    await fragObj.save();

    const fragmentURL = `http://${req.headers.host}/v1/fragments/${fragObj.id}`;

    // Set the Location header with the fragment URL
    res.setHeader('Location', fragmentURL);
    var fragment = { fragment: fragObj };
    logger.debug({ fragment }, 'Fragment created with post route');
    return res.status(201).json(createSuccessResponse(fragment));
  } catch (msg) {
    return res.status(415).json(createErrorResponse(415, msg.message));
  }
};
