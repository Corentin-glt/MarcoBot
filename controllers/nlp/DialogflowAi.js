const config = require("../../config");
const apiAiClient = require("apiai")(config.clientTokenDialogflow);
const Sentry = require("@sentry/node");
const MessageData = require("../../messenger/product_data");
const Message = require("../../helpers/Class/MessageFacebook/message");
const visitHandler = require("../../handlers/dialogflowHandler/visit");
const eatHandler = require("../../handlers/dialogflowHandler/eat");
const drinkHandler = require("../../handlers/dialogflowHandler/drink");
const contextDialogflow = require('./contextDialogflow');
const context = require('../../assets/context');

class DialogflowAi {
  constructor(event) {
    this.event = event;
  }

  start() {
    apiAiClient.language = this.event.locale;
    const product_data = new MessageData(this.event.locale);
    const messageObject = new Message(this.event.senderId);
    messageObject.typeMessage = "RESPONSE";
    const apiaiSession = apiAiClient.textRequest(this.event.message.text, {
      sessionId: config.projectIDDialogflow,
      lang: this.event.locale
    });
    apiaiSession.on("response", response => {
      return this.control(response);
    });
    apiaiSession.on("error", error => {
      Sentry.captureException(error);
      return messageObject.sendMessage(product_data.question1MessageListView);
    });
    apiaiSession.end();
  }

  control(response) {
    const product_data = new MessageData(this.event.locale);
    const messageObject = new Message(this.event.senderId);
    messageObject.typeMessage = "RESPONSE";
    const parameters = response.result.parameters
      ? response.result.parameters
      : null;
    const intent =
      response.result.metadata && response.result.metadata.intentName
        ? response.result.metadata.intentName
        : null;
    
    // switch (intent) {
    //   case "visit_out":
    //     return visitHandler(parameters, this.event.senderId, this.event.locale);
    //   case "drink_out":
    //     return drinkHandler(parameters, this.event.senderId, this.event.locale);
    //   case "eating_out":
    //     return eatHandler(parameters, this.event.senderId, this.event.locale);
    //   case "stop_input":
    //     return messageObject
    //       .sendMessage({ text: response.result.fulfillment.speech })
    //       .then(response => {
    //         if (response.status === 200)
    //           return messageObject.sendWaitingMessage();
    //       })
    //       .then(helper.delayPromise(2000))
    //       .then(() => {
    //         return messageObject.sendMessage(
    //           product_data.question1MessageListView
    //         );
    //       });
    //   default:
    //     return messageObject
    //       .sendMessage({ text: response.result.fulfillment.speech })
    //       .then(response => {
    //         if (response.status === 200)
    //           return messageObject.sendWaitingMessage();
    //       })
    //       .then(helper.delayPromise(2000))
    //       .then(() => {
    //         return messageObject.sendMessage(
    //           product_data.question1MessageListView
    //         );
    //       });
    }
  }

}

module.exports = DialogflowAi;
