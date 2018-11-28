const config = require("../../config");
const ApiDialogFlow = require("../../helpers/Api/apiDialogflow");
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const Sentry = require("@sentry/node");
const Message = require("../../view/messenger/Message");
const contextDialogflow = require("./contextDialogflow");
const valuesContext = require("./valuesContextDialogflow");
const Context = require("../../process/Context");
const Text = require('../../view/messenger/Text');
const contextQuery = require('../../helpers/graphql/context/query');
const contextMutation = require('../../helpers/graphql/context/mutation');
const ViewMenu = require('../../view/menu/ViewMenu');
const transformCity = require('../../helpers/transformCity');
const convertDuration = require('../../helpers/convertDuration');

class DialogflowAi {
  constructor(event) {
    this.event = event;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
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
    console.log(response.parameters.duration);
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
    if (intent !== 'Default Welcome Intent' && intent !== 'Default Fallback Intent') {
      if (intent === 'city') {
        this.apiGraphql.sendQuery(contextQuery.getUserContextByPage(this.event.senderId, 0))
          .then(res => {
              if (res.contextsByUserAndPage[0].name === 'changeCity') {
                this.checkFunctionValuesOfContext('changeCity', parameters)
                  .then(newValue => {
                    const context = new Context(
                      this.event,
                      'changeCity',
                      newValue,
                      contextDialogflow
                    );
                    context.mapContext();
                  })
                  .catch(err => Sentry.captureException(err));
              } else {
                this.checkFunctionValuesOfContext('trip', parameters)
                  .then(newValue => {
                    const context = new Context(
                      this.event,
                      'trip',
                      newValue,
                      contextDialogflow
                    );
                    context.mapContext();
                  })
                  .catch(err => Sentry.captureException(err));
              }
          })
          .catch(err => Sentry.captureException(err));
      } else {
        console.log("Normal func");
        console.log(intent);
        console.log(parameters);
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
    } else if (intent === 'Default Fallback Intent' && response.action.split('.')[0] !== 'smalltalk') {
      this.apiGraphql.sendQuery(contextQuery.getUserContextByPage(this.event.senderId, 0))
        .then(res => {
          if (res.contextsByUserAndPage[0].name === 'feedback') {
            this.apiGraphql.sendMutation(contextMutation.updateContext(), {
              contextId: res.contextsByUserAndPage[0].id,
              values: [{name: 'message', value: response.queryText}]
            })
              .then(res => {
                const context = new Context(
                  this.event,
                  intent,
                  {},
                  contextDialogflow
                );
                context.mapContext();
              })
              .catch(err => Sentry.captureException(err));
          } else {
            const context = new Context(
              this.event,
              intent,
              {},
              contextDialogflow
            );
            context.mapContext();
          }
        })
    } else if (intent === 'Default Fallback Intent' && response.action.split('.')[0] !== 'smalltalk') {
      this.responseToUser(response.fulfillmentText);
    } else {
      this.responseToUser(response.fulfillmentText);
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
        console.log(item);
        if (
          objectValues[item].stringValue !== "" &&
          item !== "duration" &&
          item !== "tripDate" &&
          item !== "ordinal"
        ) {
          console.log('IN FIRST IF ====> ' + item);
          if (item === "date-period") {
            console.log("DATE PERIOD");
            const datePeriodObject = objectValues[item].structValue.fields;
            newValuesObject["arrival"] = datePeriodObject.startDate.stringValue;
            newValuesObject["departure"] = datePeriodObject.endDate.stringValue;
          } else if (item === "date") {
            newValuesObject[objectValues["tripDate"].stringValue] =
              objectValues[item].stringValue;
          } else {
            if (item === 'geo-city') {
              console.log(objectValues[item].stringValue.toLowerCase());
                newValuesObject[valuesContext[item]] =
                  transformCity(objectValues[item].stringValue.toLowerCase(),
                    this.event.locale);
            } else {
              newValuesObject[valuesContext[item]] = objectValues[item].stringValue;
            }
          }
        } else if (item === "duration" &&
          objectValues[item].listValue.values.length > 0) {
          const durationArray = objectValues[item].listValue.values;
          console.log(durationArray);
          const durationTimes = [];
          durationArray.forEach(durationValue => {
            console.log(durationValue.structValue.fields);
            const amount = durationValue.structValue.fields.amount.numberValue;
            const unit = durationValue.structValue.fields.unit.stringValue;
            const time = convertDuration(amount, unit, this.event.locale) * 1000;
            durationTimes.push(time);
          });
          const fullTime = durationTimes.reduce((carry, number) => carry + number);
          newValuesObject['departure'] = fullTime.toString();
        }
      });
      resolve(newValuesObject);
    });
  }

  getValuesOfContext(objectValues) {
    let newValuesObject = {};
    return new Promise((resolve, reject) => {
      Object.keys(objectValues).map(item => {
        if (objectValues[item].stringValue !== "" && item !== 'geo-city') {
          newValuesObject[valuesContext[item]] = objectValues[item].stringValue;
        } else if (item === 'geo-city' && objectValues[item].stringValue !== "") {
          newValuesObject[valuesContext[item]] = transformCity(objectValues[item].stringValue.toLowerCase(), this.event.locale);
        }
      });
      resolve(newValuesObject);
    });
  }

  responseToUser(response) {

    const messageResponse = [new Text(response).get(), new ViewMenu({}, this.event.locale).menu()];
    const messageObject = new Message(this.event.senderId, messageResponse);
    messageObject.sendMessage();
  }
}

module.exports = DialogflowAi;
