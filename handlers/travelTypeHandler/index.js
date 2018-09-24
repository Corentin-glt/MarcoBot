const quickReplyTravelType = require('./travelType');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'ALONE':
      quickReplyTravelType(senderID, 'alone', locale);
      break;
    case 'PARTNER':
      quickReplyTravelType(senderID, 'couple', locale);
      break;
    case 'FRIENDS':
      quickReplyTravelType(senderID, 'friend', locale);
      break;
    case 'FAMILY':
      quickReplyTravelType(senderID, 'family', locale);
      break;
  }
};