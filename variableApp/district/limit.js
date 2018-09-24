/**
 * Created by corentin on 29/08/2018.
 */
const limitParis = require('./paris/limit');
const limitLondon = require('./london/limit');
const limitBarcelona = require('./barcelona/limit');

const limit = (city) => {
  switch(city){
    case 'paris':
      return limitParis;
    case 'london':
      return limitLondon;
    case 'barcelona':
      return limitBarcelona;
    default:
      break;
  }
};

module.exports = limit;