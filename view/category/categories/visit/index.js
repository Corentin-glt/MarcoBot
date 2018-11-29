/**
 * Created by corentin on 26/09/2018.
 */
const categoryParis = require('./paris/index');
const categoryLondon = require('./london/index');
const categoryBarcelona = require('./barcelona/index');
const categoryRome = require('./rome/index');

const index = (city) => {
  switch (city) {
    case 'paris':
      return categoryParis;
    case 'london':
      return categoryLondon;
    case 'barcelona':
      return categoryBarcelona;
    case 'rome':
      return categoryRome;
    default:
      break;
  }
};

module.exports = index;
