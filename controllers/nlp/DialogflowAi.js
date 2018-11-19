const config = require("../../config");
const ApiDialogFlow = require("../../helpers/Api/apiDialogflow");
const Sentry = require("@sentry/node");
const MessageData = require("../../messenger/product_data");
const Message = require("../../view/messenger/Message");
const visitHandler = require("../../handlers/dialogflowHandler/visit");
const eatHandler = require("../../handlers/dialogflowHandler/eat");
const drinkHandler = require("../../handlers/dialogflowHandler/drink");
const contextDialogflow = require("./contextDialogflow");
const valuesContext = require("./valuesContextDialogflow");
const Context = require("../../process/Context");

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
    const intent = response.intent
      ? response.intent.displayName
        ? response.intent.displayName
        : "Default Fallback Intent"
      : "Default Fallback Intent";
    const parameters = response.parameters
      ? response.parameters.fields
        ? response.parameters.fields
        : {}
      : {};
    console.log("INTENT ==> ", intent);
    console.log("PARAMETERS ==> ", parameters);
    this.checkFunctionValuesOfContext(intent, parameters)
      .then(newValue => {
        const context = new Context(
          this.event,
          intent,
          newValue,
          contextDialogflow
        );
        context.mapContext();
      })
      .catch(err => Sentry.captureException(err));
  }

  checkFunctionValuesOfContext(context, parameters) {
    return new Promise((resolve, reject) => {
      context === "trip"
        ? this.getValuesOfContextTrip(parameters)
            .then(newValue => resolve(newValue))
            .catch(err => reject(err))
        : this.getValuesOfContext(parameters)
            .then(newValue => resolve(newValue))
            .catch(err => reject(err));
    });
  }

  getValuesOfContextTrip(objectValues) {
    let newValuesObject = {};
    return new Promise((resolve, reject) => {
      Object.keys(objectValues).map(item => {
        if (
          objectValues[item].stringValue !== "" &&
          item !== "tripDate" &&
          item !== "ordinal"
        ) {
          if (item === "date-period") {
            const datePeriodObject = objectValues[item].structValue.fields;
            newValuesObject["arrival"] = datePeriodObject.startDate.stringValue;
            newValuesObject["departure"] = datePeriodObject.endDate.stringValue;
          } else if (item === "duration") {
            //TODO CHECK IN BACK END TO KNOW WHAT TO DO
            const amount =
              objectValues[item].structValue.fields.amount.numberValue;
            const unit = objectValues[item].structValue.fields.unit.stringValue;
            newValuesObject["duration"] = amount + ":" + unit;
          } else if (item === "date") {
            newValuesObject[objectValues["tripDate"].stringValue] =
              objectValues[item].stringValue;
          } else {
            newValuesObject[valuesContext[item]] =
              objectValues[item].stringValue;
          }
        }
      });
      resolve(newValuesObject);
    });
  }

  getValuesOfContext(objectValues) {
    let newValuesObject = {};
    return new Promise((resolve, reject) => {
      Object.keys(objectValues).map(item => {
        if (objectValues[item].stringValue !== "") {
          newValuesObject[valuesContext[item]] = objectValues[item].stringValue;
        }
      });
      resolve(newValuesObject);
    });
  }
}

module.exports = DialogflowAi;
