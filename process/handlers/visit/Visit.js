const visitValues = require("../../../assets/values/visit");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const config = require("../../../config");
const ViewCategory = require("../../../view/Category/Category");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const userMutation = require('../../../helpers/graphql/user/mutation');
const visitQuery = require('../../../helpers/graphql/visit/query');
const ViewVenue = require('../../../view/Venue/Venue');

class Visit {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start() {
    if (visitValues.length > this.context.values.length) {
      const value = this.findElemMissing();
      this[`${value}IsMissing`]();
    } else {
      this.sendVisits();
    }
  }

  findElemMissing() {
    let valueMissing = "";
    for (let i = 0; i < visitValues.length; i++) {
      const elemFound = this.context.values.find(value => {
        return value.name === visitValues[i].name;
      });
      if (typeof elemFound === "undefined") {
        valueMissing = visitValues[i].name;
        break;
      }
    }
    return valueMissing;
  }

  sendVisits() {
    const type = this.context.values.find(value => {
      return value.name === 'category';
    }).value;
    const apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi);
    const recommandationApi = new ApiGraphql(
      config.category[config.indexCategory].recommendationApilUrl,
      config.accessTokenRecommendationApi);
    return apiGraphql.sendMutation(
      userMutation.addCategoryByAccountMessenger(), {
        PSID: this.event.senderId.toString(),
        category: type
      })
      .then(response => {
        return recommandationApi.sendQuery(
          visitQuery.queryVisitsByPriceAndType(this.event.senderId,
            type, parseInt(this.context.page)));
      })
      .then(response => {
        const venue = new ViewVenue(this.event.locale, this.user,
          response.visitsByPriceAndType, 'visit', true);
        if (response.visitsByPriceAndType !== null &&
          response.visitsByPriceAndType.length > 0) {
          return venue
            .init()
            .then(messageVenue => {
              const messageArray = [
                ViewChatAction.markSeen(),
                ViewChatAction.typingOn(),
                ViewChatAction.smallPause(),
                ViewChatAction.typingOff(),
                venue.firstMessage(),
                ViewChatAction.typingOn(),
                ViewChatAction.smallPause(),
                ViewChatAction.typingOff(),
                messageVenue,
              ];
              const newMessage = new Message(this.event.senderId, messageArray);
              newMessage.sendMessage();
            })
        } else {
          const messageArray = [
            ViewChatAction.markSeen(),
            ViewChatAction.typingOn(),
            ViewChatAction.smallPause(),
            ViewChatAction.typingOff(),
            venue.emptyVenuesMessage(),
          ];
          const newMessage = new Message(this.event.senderId, messageArray);
          newMessage.sendMessage();
        }
      })
      .catch(err => {
        Sentry.captureException(err)
      })
  }

  categoryIsMissing() {
    const category = new ViewCategory(this.event.locale, "visit", this.user);
    category
      .init()
      .then(messageCategory => {
        const messageArray = [
          ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          category.firstMessage(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          category.secondMessage(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          messageCategory
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => Sentry.captureException(err));
  }
}

module.exports = Visit;