const priceIndex = require('./priceIndex');


module.exports = (payload, price, senderID) => {
  switch (payload) {
    case 'GASTRONOMY':
      priceIndex(price, `gastronomic`, senderID);
      break;
    case 'VEGGIE':
      priceIndex(price, `healthy`, senderID);
      break;
    case 'BRUNCH':
      priceIndex(price, `brunch`, senderID);
      break;
    case 'STREET':
      priceIndex(price, `streetfood`, senderID);
      break;
    case 'TRADITIONAL':
      priceIndex(price, `traditional`,senderID);
      break;
    case 'OTHER':
      priceIndex(price, `other`, senderID);
      break;
  }
};
