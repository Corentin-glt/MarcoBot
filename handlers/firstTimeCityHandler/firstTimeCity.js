/**
 * Created by corentin on 07/08/2018.
 */
const MessageData = require("../../messenger/product_data");
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

module.exports = (payload, senderID, locale) => {
  const product_data = new MessageData(locale);
  const isItFirstTime = (payload === "YES");
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger) {
        return apiGraphql.sendMutation(userMutation.updateFirstTimeCity(),
          {PSID: senderID, isItFirstTimeCity: isItFirstTime})
      }
    })
    .then(res => {
      if(res.updateFirstTimeCity) {
        const city = res.updateFirstTimeCity.cityTraveling.charAt(0).toUpperCase()
          + res.updateFirstTimeCity.cityTraveling.slice(1);
        return sendMessage(senderID, product_data.whenAreYouArriving(isItFirstTime, city), "RESPONSE")
      }
    })
};