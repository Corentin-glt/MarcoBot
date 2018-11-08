/**
 * Created by corentin on 07/08/2018.
 */
const MessageData = require("../../../../../messenger/product_data");
const apiMessenger = require("../../../../../helpers/Api/apiMessenger");
const userQuery = require("../../../../../graphql/user/query");
const userMutation = require("../../../../../graphql/user/mutation");
const ApiGraphql = require("../../../../../helpers/Api/apiGraphql");
const helper = require("../../../../../helpers/helper");
const config = require("../../../../../config");
const async = require('async');
const axios = require('axios');
const ApiReferral = require('../../../../../helpers/Api/apiReferral');

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

module.exports = (event) => {
  const locale = event.locale;
  const product_data = new MessageData(locale);
  const senderID = event.sender.id;
  const dateArrival = event.message.nlp.entities.datetime[0].value;
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  ApiReferral.sendReferral("arrival_date", senderID)
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger && res.userByAccountMessenger.cityTraveling !== null
        && res.userByAccountMessenger.cityTraveling.length > 0) {
        return apiGraphql.sendMutation(userMutation.updateArrivalDate(),
          {PSID: senderID, arrivalDateToCity: dateArrival})
          .then(res => {
            if (res.updateArrivalDate) {
              const city = res.updateArrivalDate.cityTraveling;
              return sendMessage(senderID, product_data.howManyDayAreStaying(city), "RESPONSE")
            }
          })
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