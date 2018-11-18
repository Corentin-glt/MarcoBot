const config = require("../../config");
const ApiDialogFlow = require("../../helpers/Api/apiDialogflow");
const Sentry = require("@sentry/node");
const MessageData = require("../../messenger/product_data");
const Message = require("../../view/messenger/Message");
const visitHandler = require("../../handlers/dialogflowHandler/visit");
const eatHandler = require("../../handlers/dialogflowHandler/eat");
const drinkHandler = require("../../handlers/dialogflowHandler/drink");
const contextDialogflow = require("./contextDialogflow");
const context = require("../../assets/context");
const valuesContext = require("./valuesContextDialogflow");

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
    console.log(parameters);
    console.log(intent);
    this.checkFunctionValuesOfContext(intent, parameters)
  }

  checkFunctionValuesOfConstext(context, parameters) {
    return context === "trip"
      ? this.getValuesOfContextTrip(parameters)
      : this.getValuesOfContext(parameters);
  }

  getValuesOfContextTrip(objectValues) {
    let newValuesObject = {};
    objectValues.keys(item => {
      if (item.stringValue !== "" && item !== "tripDate") {
        if (item !== "date-period" && item !== "duration") {
          newValuesObject[valuesContext[item]] = objectValues[item].stringValue;
        } else {
          //item === 'date-period' ? this.getDatePeriod(objectValues[item]) :
        }
      }
    });
  }

  getValuesOfContext(objectValues) {
    let newValuesObject = {};
    objectValues.keys(item => {
      if (item.stringValue !== "") {
        newValuesObject[valuesContext[item]] = objectValues[item].stringValue;
      }
    });
  }
}

module.exports = DialogflowAi;
