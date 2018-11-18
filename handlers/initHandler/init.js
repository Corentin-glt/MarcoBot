const ApiGraphql = require("../../helpers/Api/apiGraphql");
const user = require("../../helpers/graphql/user/query");
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const helper = require("../../helpers/helper");
const messengerMethods = require("../../messenger/messengerMethods");
const config = require('../../config');

module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };

  const messageQueue = (userMessenger) => {
    messageData.message =
      product_data.initialMessage(userMessenger);
    apiMessenger.sendToFacebook(messageData)
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
      .then(helper.delayPromise(7000))
      .then(response => {
        messageData.message = product_data.initialMessage2;
        if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
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
      .then(helper.delayPromise(3000))
      .then(response => {
        messageData.message = product_data.initialMessage3;
        if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
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
      .then(helper.delayPromise(6000))
      .then(response => {
        messageData.message = product_data.excitementMessage;
        if (response.status === 200)
          return apiMessenger.sendToFacebook(messageData);
      })
      .then(response => {
        console.log("end of first batch");
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  apiGraphql.sendQuery(user.queryUserByAccountMessenger(senderID))
    .then(response => {
      if (response.userByAccountMessenger === null) {
        messengerMethods.createUser(senderID)
          .then(response => {
            messageQueue(response.createUser);
          })
          .catch(err => console.log("Error to create USER: ", err))
      } else {
        messageQueue(response.userByAccountMessenger);
      }
    })
    .catch(err => {
      console.log(err);
    });
};