//src/routes/api/delete.js
const frag = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  frag.Fragment.delete(req.user, req.params.id)
    .then(() => {
      logger.info('Delete route is executed');
      res.status(200).send(createSuccessResponse());
    })
    .catch((msg) => {
      logger.info('Delete route failed');
      res.status(404).send(createErrorResponse(404, msg));
    });
};
