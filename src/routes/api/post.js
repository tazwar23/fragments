const frag = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const { URL } = require('url');

module.exports = (req, res) => {
  // TODO: Implement the logic for creating a fragment based on the request body

  // Assuming the request body contains necessary data for creating a fragment
  const fragmentData = req.body;

  var fragObj = new frag.Fragment({ ownerId: req.user, type: req.headers['content-type'] });

  fragObj.save().then(() => {
    fragObj.setData(fragmentData).then(() => {
      fragObj.getData().then((data) => {
        res.status(201).json(createSuccessResponse(data));
      });
    });
  });
};
