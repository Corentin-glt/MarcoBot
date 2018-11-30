/**
 * Created by corentin on 29/08/2018.
 */
const district1 = require('./district1');
const district2 = require('./district2');
const district3 = require('./district3');

const index = (page, trans) => {
  switch(page) {
    case 1:
      return district1(trans);
    case 2:
      return district2(trans);
    case 3:
      return district3(trans);
    default:
      break;
  }
};

module.exports = index;