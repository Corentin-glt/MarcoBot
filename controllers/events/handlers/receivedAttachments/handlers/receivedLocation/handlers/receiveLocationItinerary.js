/**
 * Created by corentin on 17/05/2018.
 */
const ApiGraphql = require("../../../../../../../helpers/Api/apiGraphql");
const queryGoing = require("../../../../../../../graphql/going/query");
const mutationUser = require("../../../../../../../graphql/user/mutation");
const queryBar = require("../../../../../../../graphql/bar/query");
const queryActivity = require("../../../../../../../graphql/activity/query");
const queryClub = require("../../../../../../../graphql/club/query");
const queryEvent = require("../../../../../../../graphql/event/query");
const queryExhibition = require("../../../../../../../graphql/exhibition/query");
const queryMuseum = require("../../../../../../../graphql/museum/query");
const queryParc = require("../../../../../../../graphql/parc/query");
const queryRestaurant = require("../../../../../../../graphql/restaurant/query");
const queryShop = require("../../../../../../../graphql/shop/query");
const queryShow = require("../../../../../../../graphql/show/query");
const querySite = require("../../../../../../../graphql/site/query");
const apiMessenger = require("../../../../../../../helpers/Api/apiMessenger");
const MessageData = require("../../../../../../../messenger/product_data");
const helper = require("../../../../../../../helpers/helper");
const config = require("../../../../../../../config");
const axios = require('axios');
const ApiReferral = require('../../../../../../../helpers/Api/apiReferral');

const events = {
  "bar": (id) => queryBar.queryBar(id),
  "activity": (id) => queryActivity.queryActivity(id),
  "club": (id) => queryClub.queryClub(id),
  "event": (id) => queryEvent.queryEvent(id),
  "exhibition": (id) => queryExhibition.queryExhibition(id),
  "museum": (id) => queryMuseum.queryMuseum(id),
  "parc": (id) => queryParc.queryParc(id),
  "restaurant": (id) => queryRestaurant.queryRestaurant(id),
  "shop": (id) => queryShop.queryShop(id),
  "show": (id) => queryShow.queryShow(id),
  "site": (id) => querySite.querySite(id)
};

const sendMessage = (senderId, data, typeMessage) => {
  return new Promise((resolve, reject) => {
    const objectToSend = {
      recipient: {id: senderId},
      messaging_types: typeMessage,
      message: data
    };
    apiMessenger.sendToFacebook(objectToSend)
      .then((res) => resolve(res))
      .catch(err => reject(err));
  });
};

module.exports = (_event) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const senderId = _event.sender.id;
  const locale = _event.locale;
  const product_data = new MessageData(locale);
  const nowDate = new Date();
  const location = _event.message.attachments[0].payload.coordinates;
  const geoLocation = {
    lat: location.lat,
    lng: location.long,
    lastUpdated: nowDate
  };
  let userObject = {};
  let event = "";
  let eventID = "";
  let eventObject = {};
  ApiReferral.sendReferral("location_go", senderId);
  return apiGraphql.sendMutation(mutationUser.updateLocationByAccountMessenger(),
    {PSID: senderId, geoLocation: geoLocation})
    .then(res => {
      if (res.updateLocationByAccountMessenger) {
        userObject = res.updateLocationByAccountMessenger;
        return apiGraphql.sendQuery(queryGoing.queryGoings(res.updateLocationByAccountMessenger.id, 1))
      }
    })
    .then(res => {
      if (res) {
        const going = res.goings[0];
        for (const propertyName in going) {
          if (propertyName !== "id" && propertyName !== "users_id"
            && propertyName !== "lastClick" && propertyName !== "dateClick" && going[propertyName] !== null) {
            eventID = going[propertyName];
            event = propertyName.slice(0, propertyName.indexOf("s_"));
            if (event === "activitie") event = "activity";
          }
        }
        return apiGraphql.sendQuery(events[event](eventID))
      }
    })
    .then(res => {
      if (res[event]) {
        eventObject = res[event];
        return apiMessenger.sendToFacebook({
          recipient: {id: senderId},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then((response) => {
      if (response.status === 200) {
        if (event === "exhibition") {
          return apiGraphql.sendQuery(queryMuseum.queryMuseum(eventObject.museums_id))
            .then(response => {
              if (response.museum) {
                return sendMessage(senderId, product_data.sendItinerary(geoLocation, response.museum.location), "RESPONSE")
              }
            })
        } else {
          return sendMessage(senderId, product_data.sendItinerary(geoLocation, eventObject.location), "RESPONSE")
        }
      }
    })
    .then(response => {
      if (response.status === 200) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderId},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200 && eventObject.tips !== null
        && typeof eventObject.tips !== 'undefined' && eventObject.tips.length > 0) {
        return sendMessage(senderId, {text: eventObject.tips}, "RESPONSE")
      } else {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderId},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
      }
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderId, product_data.question1MessageAfterLocation, "RESPONSE")
    })
    .catch(err => console.log(err))
};
