/**
 * Created by corentin on 28/08/2018.
 */
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const userQuery = require("../../graphql/user/query");
const tripQuery = require("../../graphql/trip/query");
const userMutation = require("../../graphql/user/mutation");
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const helper = require("../../helpers/helper");
const config = require("../../config");
const async = require('async');

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

module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger) {
        const cityUser = res.userByAccountMessenger.cityTraveling.length > 0
          ? res.userByAccountMessenger.cityTraveling : 'paris';
        return apiGraphql.sendQuery(tripQuery.getTripsByUsersId(res.userByAccountMessenger.id))
          .then(trips => {
            if (trips.getTripsByUsersId) {
              let cities = [];
              async.each(trips.getTripsByUsersId, (trip, callback) => {
                const indexOfCity = cities.indexOf(elem => elem === trip.cityTraveling);
                if (indexOfCity === -1) {
                  cities.push(trip.cityTraveling)
                }
                callback();
              }, (err) => {
                if (err) return sendMessage(senderID,
                  {text: "Hmmm... I think the machine's gone crazy! Try again later."}, "RESPONSE");
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderID},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
                  .then(helper.delayPromise(2000))
                  .then(() => {
                    if (cities.length > 0) {
                      return sendMessage(senderID, product_data.yourCityActual(cityUser), "RESPONSE")
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
                          return sendMessage(senderID, product_data.changeMyCity, "RESPONSE")
                        });
                    } else {
                      return sendMessage(senderID, product_data.noMoreCityInTrip(cityUser), "RESPONSE")
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
                          return sendMessage(senderID, product_data.changeMyCity, "RESPONSE")
                        });
                    }
                  })
              })
            }
          })
      }
    })
    .catch(err => console.log(err));
}