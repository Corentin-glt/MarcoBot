const price = require('./price');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'TRENDY':
      price(senderID, 'BAR', 'TRENDY', locale);
      break;
    case 'ATYPICAL':
      price(senderID, 'BAR', 'ATYPICAL', locale);
      break;
    case 'HIGHCLASS':
      price(senderID, 'BAR', 'HIGHCLASS', locale);
      break;
    case 'PUB':
      price(senderID,  'BAR', 'PUB', locale);
      break;
    case 'CAFE':
      price(senderID,  'BAR', 'CAFE', locale);
      break;
    case 'WINE':
      price(senderID,  'BAR', 'WINE', locale);
      break;
  }
};