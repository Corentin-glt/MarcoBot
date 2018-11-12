const config = require("../../config");
const apiAiClient = require("apiai")(config.clientTokenDialogflow);
const Sentry = require('@sentry/node');
const control = require('../handlers/control');
const MessageData = require("../../messenger/product_data");
const Message = require('../../helpers/Class/Message/message');


class DialogflowAi {
  constructor(event) {
    this.event = event;
  }

  start() {
    apiAiClient.language = this.event.locale;
    const product_data = new MessageData(this.event.locale);
    const messageObject = new Message(this.event.senderId);
    messageObject.typeMessage = "RESPONSE";
    const apiaiSession = apiAiClient.textRequest(this.event.message.text,
      {sessionId: config.projectIDDialogflow, lang: this.event.locale});
    apiaiSession.on("response", (response) => {
      return control(this.event.senderId, response, this.event.locale)
    });
    apiaiSession.on("error", error => {
      Sentry.captureException(error);
      return messageObject.sendMessage(product_data.question1MessageListView)
    });
    apiaiSession.end();
  }
}

module.exports = DialogflowAi;