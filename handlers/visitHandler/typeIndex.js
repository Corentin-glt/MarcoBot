const visitHandler = require('./visit');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'HISTORICAL':
      visitHandler(`historical`, senderID, locale);
      break;
    case 'SECRET':
      visitHandler(`secret`, senderID, locale);
      break;
    case 'FAMOUS':
      visitHandler(`must_see`, senderID, locale);
      break;
    case 'CULTURAL':
      visitHandler( `cultural`, senderID, locale);
      break;
    case 'OTHER':
      visitHandler(`other`, senderID, locale);
      break;
  }
};