const postbackDefault = require('../messenger/postbackBlocks/default');
const initHandler = require('../handlers/initHandler/init');
const priceHandlerRestaurant = require('../handlers/priceHandler/restaurantIndex');
const priceHandlerBar = require('../handlers/priceHandler/barIndex');
const aroundDistrictHandler = require('../handlers/searchHandler/aroundByDistrict');
const searchHandler = require('../handlers/searchHandler/index');
const nextPageEventHandler = require('../handlers/nextPageHandler/nextPageEvent');
const visitHandler = require('../handlers/visitHandler/typeIndex');
const stopTalkingWithHuman = require('../messenger/quickReplyBlocks/stopTalkingWithHuman');
const nextPageDiffEventHandler = require('../handlers/nextPageHandler/nextPageDiffEvent');
const nextPageRecommendationHandler = require('../handlers/nextPageHandler/nextPageRecommendation');
const nextPageDiffEventRecommendationHandler = require('../handlers/nextPageHandler/nextPageDiffEventRecommendation');
const laterViewHandler = require('../handlers/laterViewHandler/laterView');
const helpHandler = require('../handlers/helpHandler/help');
const unsubscribeHandler = require('../handlers/subscribeHandler/unsubscribe');
const subscriptionHandler = require('../handlers/subscribeHandler/subscription');
const shareHandler = require('../handlers/shareHandler/share');
const itineraryStartHandler = require('../handlers/itineraryHandler/startItinerary');
const itineraryNextHandler = require('../handlers/itineraryHandler/nextItinerary');
const cityHandler = require('../handlers/cityHandler/city');
const changeMyCityHandler = require('../handlers/cityHandler/changeMyCity');
const updateCityHandler = require('../handlers/cityHandler/updateCity');
const newTripHandler = require('../handlers/cityHandler/newTrip');


const postbackInteractionWithCard = require('../messenger/postbackBlocks/interactionWithCard');
const postbackLocation = require('../messenger/quickReplyBlocks/quickReplyLocation');

module.exports = (event) => {

  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const locale = event.locale;
  const timeOfMessage = event.timestamp;
  const payload = event.postback.payload;
  const payloadType = payload.split("_");
  const message = event.message ? event.message : null;
  if(payload.includes("GOING") || payload.includes("LATER") || payload.includes("VIEWMORE")){
    return postbackInteractionWithCard(payload, senderID);
  } else {
    switch (payloadType[0]) {
      case 'INIT':
        initHandler(senderID, locale);
        break;
      case 'TRAVELINGTO':
        cityHandler(payloadType[1], senderID, locale);
        break;
      case 'RESTAURANT':
        priceHandlerRestaurant(payloadType[1], senderID);
        break;
      case 'BAR':
        priceHandlerBar(payloadType[1], senderID);
        break;
      case 'AROUND':
        aroundDistrictHandler(payload.slice(7), senderID);
        break;
      case 'SEARCH':
        searchHandler(payloadType[1], senderID);
        break;
      case 'SITE':
        visitHandler(payloadType[1], senderID);
        break;
      case 'STOPTALKING':
        stopTalkingWithHuman(senderID);
        break;
      case 'NEXTPAGEEVENT':
        nextPageEventHandler(payloadType[1], senderID);
        break;
      case 'NEXTPAGENEO4J':
        nextPageRecommendationHandler(payloadType[1], payloadType[2], payloadType[3], senderID);
        break;
      case 'NEXTPAGEDIFFEVENT':
        nextPageDiffEventHandler(payload.slice(18), senderID);
        break;
      case 'NEXTPAGEDIFFEVENTNEO4J':
        nextPageDiffEventRecommendationHandler(payloadType[1], senderID);
        break;
      case 'MYFAVORITE':
        laterViewHandler(payloadType[1], senderID);
        break;
      case 'HELP':
        helpHandler(senderID);
        break;
      case  'SUBSCRIPTION':
        subscriptionHandler(senderID);
        break;
      case  'INVITE':
        shareHandler(senderID);
        break;
      case  'STARTITINERARY':
        itineraryStartHandler(payloadType[1], senderID);
        break;
      case  'ITINERARYNEXT':
        itineraryNextHandler(payloadType[1], senderID);
        break;
      case 'CHANGEMYCITY':
        changeMyCityHandler(senderID);
        break;
      case 'MODIFYCITY':
        updateCityHandler(payloadType[1], senderID);
        break;
      case 'NEWTRIP':
        newTripHandler(senderID, locale);
        break;
      default :
        postbackDefault(senderID);
        break;
    }
  }
};
