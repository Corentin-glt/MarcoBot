const price = require('./price');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'GASTRONOMY':
      price(senderID, 'RESTAURANT', 'GASTRONOMY', locale);
      break;
    case 'VEGGIE':
      price(senderID, 'RESTAURANT', 'VEGGIE', locale);
      break;
    case 'BRUNCH':
      price(senderID, 'RESTAURANT', 'BRUNCH', locale);
      break;
    case 'STREET':
      price(senderID,  'RESTAURANT', 'STREET', locale);
      break;
    case 'TRADITIONAL':
      price(senderID,  'RESTAURANT', 'TRADITIONAL', locale);
      break;
    case 'OTHER':
      price(senderID,  'RESTAURANT', 'OTHER', locale);
      break;
  }
};