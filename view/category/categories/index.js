const categoryDrink = require('./drink')
const categoryEat = require('./eat')
const categoryVisit = require('./visit/index')

const index = (venue, city) => {
  switch (venue) {
    case 'eat':
      return categoryEat;
    case 'drink':
      return categoryDrink;
    case 'visit':
      return categoryVisit(city);
    default:
      break;
  }
};

module.exports = index;
