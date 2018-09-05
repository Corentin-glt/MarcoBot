const excitementHandler = require('../handlers/excitementHandler/index');
const travelTypeHandler = require('../handlers/travelTypeHandler/index');
const restaurantHandler = require('../handlers/restaurantHandler/typeIndex');
const barHandler = require('../handlers/barHandler/typeIndex');
const searchHandler = require('../handlers/searchHandler/index');
const quickReplyLocation = require('../messenger/quickReplyBlocks/quickReplyLocation');
const postbackDefault = require('../messenger/postbackBlocks/default');
const noUpdateLocation = require('../messenger/quickReplyBlocks/noUpdateLocation');
const postbackInteractionWithCard = require('../messenger/postbackBlocks/interactionWithCard');
const backQuestionHandler = require('../handlers/backQuestionHandler/backQuestion');
const firstTimeCityHandler = require('../handlers/firstTimeCityHandler/firstTimeCity');
const alreadyInCityHandler = require('../handlers/alreadyInCityHandler/alreadyInCity');
const unsubscribeHandler = require('../handlers/subscribeHandler/unsubscribe');
const subscribeHandler = require('../handlers/subscribeHandler/susbcribe');

module.exports = (event) => {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const locale = event.locale;
  const timeOfMessage = event.timestamp;
  const payload = event.message.quick_reply.payload;
  const payloadType = payload.split("_");
  if (payload.includes("NOLOCATIONEVENT") || payload.includes("USEOLDLOCATIONEVENT")) {
    return quickReplyLocation(payload, senderID);
  } else if (payload.includes("GOING") || payload.includes("LATER") ) {
      return postbackInteractionWithCard(payload, senderID)
  } else {
    switch (payloadType[0]) {
      case 'EXCITEMENT':
        excitementHandler(payloadType[1], senderID, locale);
        break;
      case 'TRAVELTYPE':
        travelTypeHandler(payloadType[1], senderID, locale);
        break;
      case 'SEARCH':
        searchHandler(payloadType[1], senderID, locale);
        break;
      case 'NOUPDATELOCATION':
        noUpdateLocation(senderID, locale);
        break;
      case 'PRICERESTAURANT':
        restaurantHandler(payloadType[1], payloadType[2], senderID, locale);
        break;
      case 'PRICEBAR':
        barHandler(payloadType[1], payloadType[2], senderID, locale);
        break;
      case 'CATEGORY':
        backQuestionHandler(payloadType[1], senderID, locale);
        break;
      case 'FIRSTTIME':
        firstTimeCityHandler(payloadType[1], senderID, locale);
        break;
      case 'ALREADYINCITY':
        alreadyInCityHandler(senderID, locale);
        break;
      case  'UNSUBSCRIBE':
        unsubscribeHandler(senderID, locale);
        break;
      case  'SUBSCRIBE':
        subscribeHandler(senderID, locale);
        break;
      default :
        postbackDefault(senderID, locale);
        break;
    }
  }
};
