/**
 * Created by corentin on 08/11/2018.
 */
const visitHandler = require("../../handlers/dialogflowHandler/visit");
const eatHandler = require("../../handlers/dialogflowHandler/eat");
const drinkHandler = require("../../handlers/dialogflowHandler/drink");
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const queryBar = require('../../helpers/graphql/bar/query');
const config = require("../../config");
const Message = require('../../helpers/Class/Message/message');
const helper = require('../../helpers/helper');
const MessageData = require("../../messenger/product_data");


module.exports = (senderId, response, locale) => {
  const product_data = new MessageData(locale);
  const messageObject = new Message(senderId);
  messageObject.typeMessage = "RESPONSE";
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
      return messageObject.sendMessage({"text": response.result.fulfillment.speech})
        .then((response) => {
          if (response.status === 200)
            return messageObject.sendWaitingMessage()
        })
        .then(helper.delayPromise(2000))
        .then(() => {
          return messageObject.sendMessage(product_data.question1MessageListView)
        });
    default:
      return messageObject.sendMessage({"text": response.result.fulfillment.speech})
        .then((response) => {
          if (response.status === 200)
            return messageObject.sendWaitingMessage()
        })
        .then(helper.delayPromise(2000))
        .then(() => {
          return messageObject.sendMessage(product_data.question1MessageListView)
        })
  }
};