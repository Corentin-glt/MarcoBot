const barHandler = require('./bar');

module.exports = (payload, type, senderID, locale) => {
  switch (payload) {
    case 'ONE':
      barHandler(type, 1, senderID, locale);
      break;
    case 'TWO-THREE':
      barHandler(type , 2, senderID, locale);
      break;
    // case 'THREE':
    //   barHandler(type , 3, senderID);
    //   break;
    case 'FOUR':
      barHandler(type , 4, senderID, locale);
      break;
  }
};



