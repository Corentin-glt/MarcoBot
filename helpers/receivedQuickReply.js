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
const itineraryNextHandler = require('../handlers/itineraryHandler/nextItinerary');
const itineraryOnMap = require('../handlers/mapsHandler/itineraryOnMap');
const seeMenu = require('../handlers/menuHandler/menu');
const axios = require('axios');
const config = require('../config');

module.exports = (event) => {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const locale = event.locale;
  const timeOfMessage = event.timestamp;
  const payload = event.message.quick_reply.payload;
  const payloadType = payload.split("_");
  if (payload.includes("NOLOCATIONEVENT") || payload.includes("USEOLDLOCATIONEVENT")) {
    return quickReplyLocation(payload, senderID, locale);
  } else if (payload.includes("GOING") || payload.includes("LATER")) {
    return postbackInteractionWithCard(payload, senderID, locale)
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
        axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify([
            {
              _eventName: 'first_second_time',
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(['mb1']),
          page_id: config.category[config.indexCategory].pageId,
          page_scoped_user_id: senderID
        })
          .then(response => {
            console.log("SUCCESS event start");
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
        firstTimeCityHandler(payloadType[1], senderID, locale);
        break;
      case 'ALREADYINCITY':
        axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify([
            {
              _eventName: 'arrival_date',
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(['mb1']),
          page_id: config.category[config.indexCategory].pageId,
          page_scoped_user_id: senderID
        })
          .then(response => {
            console.log("SUCCESS event start");
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
        alreadyInCityHandler(senderID, locale);
        break;
      case  'UNSUBSCRIBE':
        unsubscribeHandler(senderID, locale);
        break;
      case 'SUBSCRIBE':
        subscribeHandler(senderID, locale);
        break;
      case  'ITINERARYNEXT':
        axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify([
            {
              _eventName: 'next_itinerary',
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(['mb1']),
          page_id: config.category[config.indexCategory].pageId,
          page_scoped_user_id: senderID
        })
          .then(response => {
            console.log("SUCCESS event start");
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
        itineraryNextHandler(payloadType[1], senderID, locale);
        break;
      case  'SEEITINERARYONMAP':
        axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify([
            {
              _eventName: 'map_itinerary',
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(['mb1']),
          page_id: config.category[config.indexCategory].pageId,
          page_scoped_user_id: senderID
        })
          .then(response => {
            console.log("SUCCESS event start");
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
        itineraryOnMap(payloadType[1], senderID, locale);
        break;
      case  'SEEMENU':
        axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify([
            {
              _eventName: 'menu_itinerary',
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(['mb1']),
          page_id: config.category[config.indexCategory].pageId,
          page_scoped_user_id: senderID
        })
          .then(response => {
            console.log("SUCCESS event start");
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
        seeMenu(senderID, locale);
        break;
      default :
        postbackDefault(senderID, locale);
        break;
    }
  }
};
