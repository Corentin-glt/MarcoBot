/**
 * Created by corentin on 13/05/2018.
 */
const apiMessenger = require('../helpers/apiMessenger');
const ApiGraphql = require('../helpers/apiGraphql');
const queryBar = require('../graphql/bar/query');

const MessageData = require("../messenger/product_data");
const config = require("../config");
const helper = require("../helpers/helper");
const visitHandler = require("../handlers/dialogflowHandler/visit");
const eatHandler = require("../handlers/dialogflowHandler/eat");
const drinkHandler = require("../handlers/dialogflowHandler/drink");


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

module.exports = {
  checkDialogflow: (senderId, response, locale) => {
    const product_data = new MessageData(locale);
      const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
      const parameters = response.result.parameters ? response.result.parameters : null;
      const intent = response.result.metadata ?
        (response.result.metadata.intentName ? response.result.metadata.intentName : null) : null;
      switch (intent) {
        case 'visit_out':
          return visitHandler(parameters, senderId, locale);
        case 'drink_out':
          return drinkHandler(parameters, senderId, locale);
        case 'eating_out':
          return eatHandler(parameters, senderId, locale);
        case 'stop_input':
          return sendMessage(senderId, {"text" : response.result.fulfillment.speech}, "RESPONSE")
            .then((response) => {
              if (response.status === 200)
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderId},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
            })
            .then(helper.delayPromise(2000))
            .then(() => {
              return sendMessage(senderId, product_data.question1MessageListView, "RESPONSE")
            });
        default:
          return sendMessage(senderId, {"text" : response.result.fulfillment.speech}, "RESPONSE")
            .then((response) => {
              if (response.status === 200)
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderId},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
            })
            .then(helper.delayPromise(2000))
            .then(() => {
              return sendMessage(senderId, product_data.question1MessageListView, "RESPONSE")
            })
      }
  }
};
