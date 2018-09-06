/**
 * Created by corentin on 29/08/2018.
 */
const districtParis = require('./paris/index');
const districtLondon = require('./london/index');
const districtBarcelona = require('./barcelona/index');

const index = (city, page, trans) => {
  switch (city) {
    case 'paris':
      return districtParis(page, trans);
    case 'london':
      return districtLondon(page, trans);
    case 'barcelona':
      return districtBarcelona(page, trans);
    default:
      break;
  }
};

module.exports = index;