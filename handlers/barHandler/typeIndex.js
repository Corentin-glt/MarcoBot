const priceIndex = require('./priceIndex');
module.exports = (payload, price, senderID, locale) => {
  switch (payload) {
    case 'TRENDY':
      priceIndex(price, `trendy`, senderID, locale);
      break;
    case 'ATYPICAL':
      priceIndex(price, `atypical`, senderID, locale);
      break;
    case 'HIGHCLASS':
<<<<<<< HEAD
      priceIndex(price, `highclass`, senderID);
=======
      priceIndex(price, `high_class`, senderID, locale);
>>>>>>> development
      break;
    case 'PUB':
      priceIndex(price, `pub`, senderID, locale);
      break;
    case 'CAFE':
      priceIndex(price, `cafe`, senderID, locale);
      break;
    case 'WINE':
      priceIndex(price, `wine`, senderID, locale);
      break;
  }
};
