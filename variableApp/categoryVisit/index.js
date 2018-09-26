/**
 * Created by corentin on 26/09/2018.
 */
const categoryParis = require('./paris/index');
const categoryLondon = require('./london/index');
const categoryBarcelona = require('./barcelona/index');

const index = (city, trans) => {
  switch (city) {
    case 'paris':
      return categoryParis(trans);
    case 'london':
      return categoryLondon(trans);
    case 'barcelona':
      return categoryBarcelona(trans);
    default:
      break;
  }
};

module.exports = index;