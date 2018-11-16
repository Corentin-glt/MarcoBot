const config = require("../../config");
const ApiDialogFlow = require("../../helpers/Api/apiDialogflow");
const Sentry = require("@sentry/node");
const MessageData = require("../../messenger/product_data");
const Message = require("../../helpers/Class/MessageFacebook/message");
const visitHandler = require("../../handlers/dialogflowHandler/visit");
const eatHandler = require("../../handlers/dialogflowHandler/eat");
const drinkHandler = require("../../handlers/dialogflowHandler/drink");
const contextDialogflow = require("./contextDialogflow");
const context = require("../../assets/context");

class DialogflowAi {
  constructor(event) {
    this.event = event;
  }

  start() {
    const product_data = new MessageData(this.event.locale);
    const messageObject = new Message(this.event.senderId);
    messageObject.typeMessage = "RESPONSE";
    const apiDialogFlow = new ApiDialogFlow(this.event.locale);
    apiDialogFlow
      .sendTextMessageToDialogFlow(this.event.message.text)
      .then(response => {
        return this.control(response);
      })
      .catch(err => {
        Sentry.captureException(err);
        return messageObject.sendMessage(product_data.question1MessageListView);
      });
  }

  control(response) {
    const product_data = new MessageData(this.event.locale);
    const messageObject = new Message(this.event.senderId);
    messageObject.typeMessage = "RESPONSE";
    const intent = response.intent
      ? response.intent.displayName
        ? response.intent.displayName
        : null
      : null;
    const parameters = response.parameters
      ? response.parameters.fields
        ? response.parameters.fields
        : null
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

module.exports = DialogflowAi;
