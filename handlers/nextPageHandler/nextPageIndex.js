const nextPageDiffEvent = require('./nextPageDiffEvent');
const nextPageAroundEvent = require('./nextPageAroundEvent');

module.exports = (payload, senderID, locale) => {
  const newPayload = payload.split(':')[0];
  switch (newPayload) {
    case 'AROUNDME':
      console.log("around me");
      nextPageAroundEvent(payload, senderID, locale);
      break;
    default:
      nextPageDiffEvent(payload, senderID, locale);
  }
};