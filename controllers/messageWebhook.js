/**
 * Created by corentin on 27/04/2018.
 */
const Init = require('./setup/Init');

module.exports = (req, res) => {
  if (req.body.object === "page") {
    const init = new Init(req.body.entry);
    init.handleEntry();
    res.status(200).end();
  }
};
