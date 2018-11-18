/**
 * Created by corentin on 17/05/2018.
 */
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const queryBar = require("../../helpers/graphql/bar/query");
const queryActivity = require("../../helpers/graphql/activity/query");
const queryClub = require("../../helpers/graphql/club/query");
const queryEvent = require("../../helpers/graphql/event/query");
const queryExhibition = require("../../helpers/graphql/exhibition/query");
const queryMuseum = require("../../helpers/graphql/museum/query");
const queryParc = require("../../helpers/graphql/parc/query");
const queryRestaurant = require("../../helpers/graphql/restaurant/query");
const queryShop = require("../../helpers/graphql/shop/query");
const queryShow = require("../../helpers/graphql/show/query");
const querySite = require("../../helpers/graphql/site/query");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const MessageData = require("../product_data");
const helper = require("../../helpers/helper");
const queryUser = require("../../helpers/graphql/user/query");
const config = require("../../config");

const events = {
  "BAR": (id) => queryBar.queryBar(id),
  "ACTIVITY": (id) => queryActivity.queryActivity(id),
  "CLUB": (id) => queryClub.queryClub(id),
  "EVENT": (id) => queryEvent.queryEvent(id),
  "EXHIBITION": (id) => queryExhibition.queryExhibition(id),
  "MUSEUM": (id) => queryMuseum.queryMuseum(id),
  "PARC": (id) => queryParc.queryParc(id),
  "RESTAURANT": (id) => queryRestaurant.queryRestaurant(id),
  "SHOP": (id) => queryShop.queryShop(id),
  "SHOW": (id) => queryShow.queryShow(id),
  "SITE": (id) => querySite.querySite(id)
};

const sendMessage = (senderID, data, typeMessage) => {
  return new Promise((resolve, reject) => {
    const objectToSend = {
      recipient: {id: senderID},
      messaging_types: typeMessage,
      message: data
    };
    apiMessenger.sendToFacebook(objectToSend)
      .then((res) => resolve(res))
      .catch(err => reject(err));
  });
};

const noLocation = (senderID, eventID, eventName, locale) => {
  const product_data = new MessageData(locale);
  let event = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(events[eventName](eventID))
    .then(res => {
      if (res[eventName.toLowerCase()]) {
        event = res[eventName.toLowerCase()];
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderID, product_data.noLocationEvent(event.name), "RESPONSE");
    })
    .then(response => {
      if (response.status === 200) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderID, product_data.noLocationEvent2(event.location.name), "RESPONSE");
    })
    .then(response => {
      if (response.status === 200) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200) {
        if (eventName.toLowerCase() === "exhibition") {
          return apiGraphql.sendQuery(queryMuseum.queryMuseum(event.museums_id))
            .then(response => {
              if (response.museum) {
                return sendMessage(senderID,
                  product_data.sendLocation(response.museum.location, event.name), "RESPONSE");
              }
            })
        } else {
          return sendMessage(senderID,
            product_data.sendLocation(event.location, event.name), "RESPONSE");
        }
      }
    })
    .then(response => {
      if (response.status === 200) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderID, product_data.question1MessageAfterLocation, "RESPONSE");
    })
    .catch(err => console.log(err))
};

const oldLocation = (senderID, eventID, eventName, locale) => {
  const product_data = new MessageData(locale);
  let event = {};
  let user = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
    .then((response) => {
      if (response.userByAccountMessenger) {
        user = response.userByAccountMessenger;
        return apiGraphql.sendQuery(events[eventName](eventID))
      }
    })
    .then(res => {
      if (res[eventName.toLowerCase()]) {
        event = res[eventName.toLowerCase()];
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderID, product_data.letsGoMessage2, "RESPONSE");
    })
    .then(response => {
      if (response.status === 200) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200) {
        if (eventName.toLowerCase() === "exhibition") {
          return apiGraphql.sendQuery(queryMuseum.queryMuseum(event.museums_id))
            .then(response => {
              if (response.museum) {
                return sendMessage(senderID, product_data.sendItinerary(
                  user.geoLocation, response.museum.location), "RESPONSE");
              }
            })
        } else {
          return sendMessage(senderID, product_data.sendItinerary(
            user.geoLocation, event.location), "RESPONSE");
        }
      }
    })
    .then(response => {
      if (response.status === 200) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200 && event.tips !== null
         && typeof event.tips !== 'undefined' && event.tips.length > 0 ) {
        return sendMessage(senderID, {text: event.tips}, "RESPONSE")
      } else {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderID, product_data.question1MessageAfterLocation, "RESPONSE")
    })
    .catch(err => console.log(err.response.data))
};
module.exports = (payload, senderID, locale) => {
  const newPayload = payload.slice(0, payload.indexOf("_"));
  const eventName = payload.slice(payload.indexOf("_") + 1, payload.indexOf(":"));
  const eventID = payload.slice(payload.indexOf(":") + 1);
  let userId = "";
  switch (newPayload) {
    case "NOLOCATIONEVENT":
      return noLocation(senderID, eventID, eventName, locale);
    case "USEOLDLOCATIONEVENT":
      return oldLocation(senderID, eventID, eventName, locale);
    default:
      break;
  }
};
