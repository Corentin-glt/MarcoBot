/**
 * Created by corentin on 08/08/2018.
 */
const MessageData = require("../messenger/product_data");
const apiMessenger = require("./apiMessenger");
const userQuery = require("../graphql/user/query");
const userMutation = require("../graphql/user/mutation");
const ApiGraphql = require("./apiGraphql");
const helper = require("./helper");
const config = require("../config");
const async = require('async');
const queryProgram = require('../graphql/program/query');
const numberDayProgramByCity = require('../variableApp/limitCityProgram');
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

module.exports = (event) => {
  const locale = event.locale;
  const product_data = new MessageData(locale);
  const senderID = event.sender.id;
  const duration = event.message.nlp.entities.duration[0].normalized.value;
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
    event: 'CUSTOM_APP_EVENTS',
    custom_events: JSON.stringify([
      {
        _eventName: 'duration_travel',
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
 return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger && res.userByAccountMessenger.arrivalDateToCity !== null
        && res.userByAccountMessenger.arrivalDateToCity.length > 0) {
        const departureDateToCity = new Date(new Date(res.userByAccountMessenger.arrivalDateToCity).setSeconds(duration));
        return apiGraphql.sendMutation(userMutation.updateDepartureDate(),
          {PSID: senderID, departureDateToCity: departureDateToCity})
          .then(res => {
            if (res.updateDepartureDate) {
              if (new Date(res.updateDepartureDate.arrivalDateToCity) > new Date()) {
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderID},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
                  .then(helper.delayPromise(2000))
                  .then(() => {
                    return sendMessage(senderID, product_data.arrivalLater, "RESPONSE")
                  })
              } else {
                const city = res.updateDepartureDate.cityTraveling;
                let numberDay = duration / (24 * 60 * 60) < 1 ? 1 : duration / (24 * 60 * 60);
                numberDay > numberDayProgramByCity[city] ? numberDay = numberDayProgramByCity[city] : null;
                return apiGraphql.sendQuery(queryProgram.getOneProgram(res.updateDepartureDate.cityTraveling, numberDay))
                  .then(program => {
                    if(program.getOneProgram) {
                      const idProgram = program.getOneProgram.id;
                      return apiMessenger.sendToFacebook({
                        recipient: {id: senderID},
                        sender_action: 'typing_on',
                        messaging_types: "RESPONSE",
                        message: ""
                      })
                        .then(helper.delayPromise(2000))
                        .then(() => {
                          return sendMessage(senderID, product_data.isHereNow, "RESPONSE")
                        })
                        .then(() => {
                          return apiMessenger.sendToFacebook({
                            recipient: {id: senderID},
                            sender_action: 'typing_on',
                            messaging_types: "RESPONSE",
                            message: ""
                          })
                        })
                        .then(helper.delayPromise(2000))
                        .then(() => {
                          return sendMessage(senderID,
                            product_data.messageOfItineraryNotification2(city, 1, idProgram), "RESPONSE")
                        })
                    } else {
                      return sendMessage(senderID, product_data.noPropgramForThisStaying, "RESPONSE")
                    }
                  })
              }
            } else {
              return sendMessage(senderID,
                {"text": "Oopss something wrong happened 😕, please try to type again your duration in this city"}, "RESPONSE")
            }
          })
      } else if (res.userByAccountMessenger && res.userByAccountMessenger.cityTraveling !== null
        && res.userByAccountMessenger.cityTraveling.length > 0) {
        const city = res.userByAccountMessenger.cityTraveling;
        return sendMessage(senderID, product_data.whenAreYouArriving2(city), "RESPONSE")
      } else {
        return sendMessage(senderID, product_data.forgetCity, "RESPONSE")
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
          .then(() => {
            return sendMessage(senderID, product_data.whichCity2, "RESPONSE")
          })
      }
    })

};