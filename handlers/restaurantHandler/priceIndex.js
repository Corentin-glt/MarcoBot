const restaurantHandler = require('./restaurant');

module.exports = (payload, type, senderID, locale) => {
  switch (payload) {
    case 'ONE':
      restaurantHandler(type, 1, senderID, locale);
      break;
    case 'TWO-THREE':
      restaurantHandler(type, 2, senderID, locale);
      break;
    // case 'THREE':
    //   restaurantHandler(type, 3, senderID);
    //   break;
    case 'FOUR':
      restaurantHandler(type, 4, senderID, locale);
      break;
  }
};