const priceIndex = require('./priceIndex');


module.exports = (payload, price, senderID, locale) => {
  switch (payload) {
    case 'GASTRONOMY':
      priceIndex(price, `gastronomic`, senderID, locale);
      break;
    case 'VEGGIE':
      priceIndex(price, `healthy`, senderID, locale);
      break;
    case 'BRUNCH':
      priceIndex(price, `brunch`, senderID, locale);
      break;
    case 'STREET':
<<<<<<< HEAD
      priceIndex(price, `streetfood`, senderID);
=======
      priceIndex(price, `street_food`, senderID, locale);
>>>>>>> development
      break;
    case 'TRADITIONAL':
      priceIndex(price, `traditional`,senderID, locale);
      break;
    case 'OTHER':
      priceIndex(price, `other`, senderID, locale);
      break;
  }
};
