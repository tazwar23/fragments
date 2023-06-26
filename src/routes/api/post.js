const frag = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // TODO: Implement the logic for creating a fragment based on the request body

  // // Assuming the request body contains necessary data for creating a fragment
  try {
    const fragmentData = req.body;

    var fragObj = new frag.Fragment({ ownerId: req.user, type: req.headers['content-type'] });

    fragObj.save();
    await fragObj.setData(fragmentData);

    const fragmentURL = `http://${req.headers.host}/v1/fragments/${fragObj.id}`;

    // Set the Location header with the fragment URL
    res.setHeader('Location', fragmentURL);
    var fragment = { fragment: fragObj };

    res.status(201).json(createSuccessResponse(fragment));
  } catch (msg) {
    res.status(404).json(createErrorResponse(404, msg.message));
  }
};
