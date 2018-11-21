const config = require("../../config");
const ApiDialogFlow = require("../../helpers/Api/apiDialogflow");
const Sentry = require("@sentry/node");
const Message = require("../../view/messenger/Message");
const contextDialogflow = require("./contextDialogflow");
const valuesContext = require("./valuesContextDialogflow");
const Context = require("../../process/Context");
const Text = require('../../view/messenger/Text');

class DialogflowAi {
  constructor(event) {
    this.event = event;
  }

  start() {
    const apiDialogFlow = new ApiDialogFlow(this.event.locale);
    apiDialogFlow
      .sendTextMessageToDialogFlow(this.event.message.text)
      .then(response => {
        console.log(response);
        return this.control(response);
      })
      .catch(err => {
        console.log(err);
        Sentry.captureException(err);
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
    if (intent !== 'Default Welcome Intent') {
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
    } else {
      this.responseToUser(response.fulfillmentText)
    }
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
          typeof objectValues[item].stringValue !== "undefined" &&
          item !== "tripDate" &&
          item !== "ordinal"
        ) {
          if (item === "date-period") {
            const datePeriodObject = objectValues[item].structValue.fields;
            newValuesObject["arrival"] = datePeriodObject.startDate.stringValue;
            newValuesObject["departure"] = datePeriodObject.endDate.stringValue;
          } else if (item === "date") {
            newValuesObject[objectValues["tripDate"].stringValue] =
              objectValues[item].stringValue;
          } else {
            newValuesObject[valuesContext[item]] =
              objectValues[item].stringValue;
          }
        } else if (item === "duration" &&
          objectValues[item].listValue.values.length > 0) {
          //TODO CHECK IN BACK END TO KNOW WHAT TO DO
          const amount =
            objectValues[item].structValue.fields.amount.numberValue;
          const unit = objectValues[item].structValue.fields.unit.stringValue;
          newValuesObject["duration"] = amount + ":" + unit;
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

  responseToUser(response) {
    const messageResponse = new Text(response).get();
    const messageObject = new Message(this.event.senderId, messageResponse);
    messageObject.sendMessage();
  }
}

module.exports = DialogflowAi;
