const priceIndex = require('./priceIndex');
module.exports = (payload, price, senderID) => {
  switch (payload) {
    case 'TRENDY':
      priceIndex(price, `trendy`, senderID);
      break;
    case 'ATYPICAL':
      priceIndex(price, `atypical`, senderID);
      break;
    case 'HIGHCLASS':
      priceIndex(price, `highclass`, senderID);
      break;
    case 'PUB':
      priceIndex(price, `pub`, senderID);
      break;
    case 'CAFE':
      priceIndex(price, `cafe`, senderID);
      break;
    case 'WINE':
      priceIndex(price, `wine`, senderID);
      break;
  }
};
