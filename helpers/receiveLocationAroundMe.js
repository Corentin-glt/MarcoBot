const ApiGraphql = require("./apiGraphql");
const mutationUser = require("../graphql/user/mutation");
const apiMessenger = require("./apiMessenger");
const MessageData = require("../messenger/product_data");
const helper = require("./helper");
const config = require("../config");
const indexLocationQuery = require("../graphql/indexLocation/query");
const async = require("async");
const queryUser = require('../graphql/user/query');
const axios = require('axios');


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

module.exports = (_event) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const senderID = _event.sender.id;
  let dataToSend = {};
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
  axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
    event: 'CUSTOM_APP_EVENTS',
    custom_events: JSON.stringify([
      {
        _eventName: 'around_me',
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
  return apiGraphql.sendMutation(mutationUser.updateLocationByAccountMessenger(),
    {PSID: senderID, geoLocation: geoLocation})
    .then(res => {
      if (res.updateLocationByAccountMessenger) {
        userObject = res.updateLocationByAccountMessenger;
        return apiGraphql.sendQuery(indexLocationQuery.findByNearMe(geoLocation, 0, userObject.cityTraveling))
      }
    })
    .then(response => {
      if(response.findByNearMe !== null && response.findByNearMe.length > 0){
        let responses = [...response.findByNearMe];
        let newResponses = [];
        async.each(responses, (elem, callback) => {
          elem.kindElement = "";
          for (const propertyName in elem) {
            if (propertyName !== "id" && propertyName !== "users_id"
              && propertyName !== "lastClick" && propertyName !== "dateClick" && elem[propertyName] !== null) {
              elem[propertyName].kindElement = propertyName.slice(0, propertyName.indexOf("s_")).toUpperCase();
              if (elem[propertyName].kindElement === "ACTIVITIE") elem[propertyName].kindElement = "ACTIVITY";
              newResponses.push(elem[propertyName]);
              return callback();
            }
          }
        }, (err) => {
          if(err) return sendMessage(senderID,
            {text: "Hmmm... I think the machine's gone crazy! Try again later."}, "RESPONSE");
          return product_data.templateListFromDifferentEvent(newResponses, 0, "AROUNDME", "mongo")
            .then(result => {
              if (result) {
                dataToSend = Object.assign({}, result);
                return sendMessage(senderID, product_data.aroundMeChoice, "RESPONSE")
              }
            })
            .then((response) => {
              if (response.status === 200)
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderID},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                })
            })
            .then(helper.delayPromise(2000))
            .then((response) => {
              if (response.status === 200)
                return sendMessage(senderID, dataToSend, "RESPONSE")
            })
            .then((response) => {
              if (response.status === 200)
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderID},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
            })
            .then(helper.delayPromise(2000))
            .then((response) => {
              if (response.status === 200)
                return sendMessage(senderID, product_data.question1MessageAfterGeoLocation, "RESPONSE")
            })
            .catch(err => console.log(err.response.data.error));
        })
      } else {
        apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
          .then(res => {
            if (res.userByAccountMessenger) {
              const city = res.userByAccountMessenger.cityTraveling.length > 0 ?
                res.userByAccountMessenger.cityTraveling : "paris";
              return sendMessage(senderID, product_data.noAroundMe(city), "RESPONSE")
            }
          })
          .then((response) => {
            if (response.status === 200)
              return apiMessenger.sendToFacebook({
                recipient: {id: senderID},
                sender_action: 'typing_on',
                messaging_types: "RESPONSE",
                message: ""
              })
          })
          .then(helper.delayPromise(2000))
          .then((response) => {
            if (response.status === 200)
              return sendMessage(senderID,
                product_data.question1MessageAfterGeoLocation, "RESPONSE")
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
};
