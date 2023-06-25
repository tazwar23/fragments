// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const frag = require('../../model/fragment');

const { createSuccessResponse } = require('../../response');
module.exports.get = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  var expand = req.query.expand == 1 ? true : false;

  frag.Fragment.byUser(req.user, expand).then((data) => {
    var resData = { fragments: data };
    res.status(200).json(createSuccessResponse(resData));
  });
};

module.exports.getOne = (req, res) => {
  var fragObj = new frag.Fragment({ id: req.params.id, ownerId: req.user, type: 'text/plain' });
  fragObj.getData().then((data) => {
    const buffObject = Buffer.from(data);
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(buffObject.toString());
  });
};
