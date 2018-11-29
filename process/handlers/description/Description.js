/**
 * Created by corentin on 23/11/2018.
 */
const descriptionValues = require("../../../assets/values/description");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const config = require("../../../config");
const queryBar = require("../../../helpers/graphql/bar/query");
const queryMuseum = require("../../../helpers/graphql/museum/query");
const queryParc = require("../../../helpers/graphql/parc/query");
const queryRestaurant = require("../../../helpers/graphql/restaurant/query");
const querySite = require("../../../helpers/graphql/site/query");
const ViewDescription = require('../../../view/description/Description');
const ErrorMessage = require('../error/error');
const events = {
  "bar": (id) => queryBar.queryBar(id),
  "museum": (id) => queryMuseum.queryMuseum(id),
  "parc": (id) => queryParc.queryParc(id),
  "restaurant": (id) => queryRestaurant.queryRestaurant(id),
  "site": (id) => querySite.querySite(id),
};

class Description {
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
    if (descriptionValues.length !== this.context.values.length) {
      this.defaultAnswer();
    } else {
      this.findContext()
    }
  }

  findContext() {
    const event = this.context.values.find(value => {
      return value.name === 'event';
    }).value;
    const idEvent = this.context.values.find(value => {
      return value.name === 'id';
    }).value;
    this.apiGraphql
      .sendQuery(events[event](idEvent))
      .then(res => {
        const venue = res[event];
        const description = new ViewDescription(this.event.locale, event,
          this.user, venue);
        return description
          .init()
          .then(messageDescription => {
            const messageArray = [
              ViewChatAction.markSeen(),
              ViewChatAction.typingOn(),
              ViewChatAction.smallPause(),
              ViewChatAction.typingOff(),
              messageDescription
            ];
            const newMessage = new Message(this.event.senderId, messageArray);
            newMessage.sendMessage();
          })
      })
      .catch(err => {
        const Error = new ErrorMessage(this.event);
        Error.start();
        Sentry.captureException(err)
      })
  }
}

module.exports = Description;