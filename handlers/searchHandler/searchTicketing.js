/**
 * Created by corentin on 23/10/2018.
 */

const async = require("async");
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const helper = require("../../helpers/helper");
const config = require("../../config");
const ApiGraphql = require("../../helpers/apiGraphql");
const affiliationQuery = require("../../graphql/affiliation/query");
const queryUser = require('../../graphql/user/query');

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
  let user = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger){
        user = res.userByAccountMessenger;
        return apiGraphql.sendQuery(affiliationQuery.affiliations(0, user.cityTraveling))
      }
    })
    .then(res => {
      if(res.affiliations && res.affiliations.length > 0){
        return product_data.ticketingModel(res.affiliations, 0)
          .then(res => {
            if (res){
              return sendMessage(senderID, res, "RESPONSE")
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
              return sendMessage(senderID, product_data.question1MessageListView, "RESPONSE")
          })
      } else {
        return sendMessage(senderID, product_data.jokeMarco2(user.cityTraveling), "RESPONSE")
      }
    })

    .catch(err => console.log(err.response.errors || err))

};