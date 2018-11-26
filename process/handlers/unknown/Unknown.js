const async = require('async');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const config = require("../../../config");
const contextQuery = require("../../../helpers/graphql/context/query");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const ViewDefault = require("../../../view/default/ViewDefault");
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const tripValues = require("../../../assets/values/trip");
const eatValues = require("../../../assets/values/eat");
const ViewCategory = require('../../../view/Category/Category');
const ViewPrice = require('../../../view/Price/Price');


class Unknown {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    this.findContext()
      .then(context => {
          const defaultMessage = new ViewDefault(this.user, this.event.locale);
          let messageArray = [ViewChatAction.markSeen(),
            ViewChatAction.typingOn(), ViewChatAction.typingOff()];
          switch (context.name) {
            case 'start':
              if (context.values.length !== 0) {
                const tempArray = [defaultMessage.tripCityDefault1(),
                  ViewChatAction.typingOn(), ViewChatAction.typingOff(),
                  defaultMessage.tripCityDefault2()];
                messageArray.push.apply(messageArray, tempArray);
              } else {
                messageArray.push(defaultMessage.startDefault());
              }
              new Message(this.event.senderId, messageArray).sendMessage();
              break;
            case 'trip':
              if (context.values.length !== 0) {
                const value = this.findElemMissing(tripValues, context);
                console.log(value);
                if (value === 'city')
                  messageArray.push(defaultMessage.tripCityDefault1(),
                    defaultMessage.tripCityDefault2());
                else if (value === 'firstTime')
                  messageArray.push(defaultMessage.firstTimeDefault());
                else if (value === 'departure')
                  messageArray.push(defaultMessage.departureDefault());
                else if (value === 'arrival')
                  messageArray.push(defaultMessage.arrivalDefault());
                else
                  messageArray.push(defaultMessage.menuDefault());
              } else {
                messageArray.push(defaultMessage.tripCityDefault1(),
                  defaultMessage.tripCityDefault2());
              }
              new Message(this.event.senderId, messageArray).sendMessage();
              break;
            case 'itinerary':
              messageArray.push(defaultMessage.itineraryDefault());
              new Message(this.event.senderId, messageArray).sendMessage();
              break;
            case 'eat':
              const eatCategory = new ViewCategory(this.event.locale, "eat",
                this.user);
              if (context.values.length !== 0) {
                const value = this.findElemMissing(eatValues, context);
                if (value === 'category') {
                  eatCategory
                    .init()
                    .then(messageCategory => {
                      const tempArray = [defaultMessage.categoryDefault(),
                        messageCategory];
                      messageArray.push.apply(messageArray, tempArray);
                      new Message(this.event.senderId, messageArray).sendMessage();
                    })
                    .catch(err => Sentry.captureException(err));
                } else if (value === 'price') {
                  const price = new ViewPrice(this.event.locale, 'eat',
                    this.user);
                  messageArray.push(price.defaultPrice());
                  new Message(this.event.senderId, messageArray).sendMessage();
                } else {
                  messageArray.push(defaultMessage.menuDefault());
                  new Message(this.event.senderId, messageArray).sendMessage();

                }
              } else {
                eatCategory
                  .init()
                  .then(messageCategory => {
                    const tempArray = [defaultMessage.categoryDefault(),
                      messageCategory];
                    messageArray.push.apply(messageArray, tempArray);
                    new Message(this.event.senderId, messageArray).sendMessage();
                  })
                  .catch(err => Sentry.captureException(err));
              }
              break;
            case 'drink':
              const drinkCategory = new ViewCategory(this.event.locale, "drink",
                this.user);
              if (context.values.length !== 0) {
                const value = this.findElemMissing(eatValues, context);
                if (value === 'category') {
                  drinkCategory
                    .init()
                    .then(messageCategory => {
                      const tempArray = [defaultMessage.categoryDefault(),
                        messageCategory];
                      messageArray.push.apply(messageArray, tempArray);
                      new Message(this.event.senderId, messageArray).sendMessage();
                    })
                    .catch(err => Sentry.captureException(err));
                } else if (value === 'price') {
                  const price = new ViewPrice(this.event.locale, 'drink',
                    this.user);
                  messageArray.push(price.defaultPrice());
                  new Message(this.event.senderId, messageArray).sendMessage();
                } else {
                  messageArray.push(defaultMessage.menuDefault());
                  new Message(this.event.senderId, messageArray).sendMessage();
                }
              } else {
                drinkCategory
                  .init()
                  .then(messageCategory => {
                    const tempArray = [defaultMessage.categoryDefault(),
                      messageCategory];
                    messageArray.push.apply(messageArray, tempArray);
                    new Message(this.event.senderId, messageArray).sendMessage();
                  })
                  .catch(err => Sentry.captureException(err));
              }
              break;
            case 'visit':
              const visitCategory = new ViewCategory(this.event.locale, "visit",
                this.user);
              visitCategory
                .init()
                .then(messageCategory => {
                  const tempArray = [defaultMessage.categoryDefault(),
                    messageCategory];
                  messageArray.push.apply(messageArray, tempArray);
                  new Message(this.event.senderId, messageArray).sendMessage();
                })
                .catch(err => Sentry.captureException(err));
              break;
            case 'feedback':
              // this.apiGraphql.sendMutation(contextMutation.updateContext({
              //   contextId: context.id,
              //   values: [{name: 'message', value: }]
              // }));
              messageArray.push(defaultMessage.feedbackDefault());
              new Message(this.event.senderId, messageArray).sendMessage();
              break;
            default:
              messageArray.push(defaultMessage.menuDefault());
              new Message(this.event.senderId, messageArray).sendMessage();
              break;

          }

        }
      )
      .catch(err => Sentry.captureException(err))
  }

  findElemMissing(allValues, context) {
    let valueMissing = "";
    for (let i = 0; i < allValues.length; i++) {
      const elemFound = context.values.find(value => {
        console.log(value.name);
        return value.name === allValues[i].name;
      });
      console.log(elemFound);
      if (typeof elemFound === "undefined") {
        valueMissing = allValues[i].name;
        break;
      }
    }
    return valueMissing;
  }

  findContext() {
    let page = 0;
    let contextFound = false;
    return new Promise((resolve, reject) => {
      async.whilst(
        () => contextFound === false,
        (callback) => {
          this.apiGraphql
            .sendQuery(
              contextQuery.getUserContextByPage(this.event.senderId, page))
            .then(res => {
              page++;
              const contextArray = res.contextsByUserAndPage;
              if (contextArray[0].name !== 'unknown' && contextArray[0].name !==
                'next') {
                contextFound = true;
                callback(null, contextArray[0]);
              } else {
                callback(null, contextArray[0]);
              }
            })
            .catch(err => callback(err))
        },
        (err, context) => {
          if (err) return reject(err);
          if (contextFound) {
            return resolve(context)
          }
        }
      )
    })
  }

}

module.exports = Unknown;