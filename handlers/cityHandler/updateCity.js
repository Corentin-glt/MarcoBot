/**
 * Created by corentin on 28/08/2018.
 */
const product_data = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const userQuery = require("../../graphql/user/query");
const userMutation = require("../../graphql/user/mutation");
const ApiGraphql = require("../../helpers/apiGraphql");
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

module.exports = (payload, senderID) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger) {
        return apiGraphql.sendMutation(userMutation.updateCityTraveling(),
          {PSID: senderID, cityTraveling: payload.toLowerCase()})
      }
    })
    .then(res => {
      const city = payload.charAt(0) + payload.slice(1).toLowerCase();
      if(res.updateCityTraveling) {
        return apiMessenger.sendToFacebook({
          recipient: {id: senderID},
          sender_action: 'typing_on',
          messaging_types: "RESPONSE",
          message: ""
        })
          .then(helper.delayPromise(2000))
          .then(() => {
            return sendMessage(senderID, product_data.updateCityDone(city), "RESPONSE")
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
            return sendMessage(senderID, product_data.question1Message, "RESPONSE")
          })
          .catch(err => console.log(err))
      }
    })
};