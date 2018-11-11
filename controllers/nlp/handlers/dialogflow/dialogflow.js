/**
 * Created by corentin on 13/05/2018.
 */
const apiMessenger = require('../../../../helpers/Api/apiMessenger');
const MessageData = require("../../../../messenger/product_data");
const config = require("../../../../config");
const helper = require("../../../../helpers/helper");
const apiAiClient = require("apiai")(config.clientTokenDialogflow);
const control = require('./handlers/control');
const Sentry = require('@sentry/node');
const Message = require('../../../../helpers/Class/Message/message');

module.exports = (event) => {
  const senderID = event.sender.id;
  apiAiClient.language = event.locale;
  const product_data = new MessageData(event.locale);
  const messageObject = new Message(senderID);
  messageObject.typeMessage = "RESPONSE";
  const apiaiSession = apiAiClient.textRequest(message,
    {sessionId: config.projectIDDialogflow, lang: event.locale});
  apiaiSession.on("response", (response) => {
    return control(senderID, response, event.locale)
  });
  apiaiSession.on("error", error => {
    Sentry.captureException(error);
    return messageObject.sendMessage(product_data.question1MessageListView)
  });
  apiaiSession.end();
};