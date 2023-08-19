const frag = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }
  //Getting the existing fragment object
  frag.Fragment.byId(req.user, req.params.id)
    .then(async (fragObj) => {
      //converting it into a fragment class
      fragObj = new frag.Fragment(fragObj);

      if (fragObj.type !== req.headers['content-type']) {
        logger.info("Content Type doesn't match");
        return res
          .status(400)
          .json(createErrorResponse(400, 'Content type does not match with the fragment object!'));
      }

      const fragmentData = req.body;
      await fragObj.setData(fragmentData);
      await fragObj.save();

      return res.status(200).send(createSuccessResponse({ fragment: fragObj }));
    })
    .catch((error) => {
      return res.status(404).json(createErrorResponse(404, error.message));
    });
};
