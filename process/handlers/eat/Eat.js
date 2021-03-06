const eatValues = require("../../../assets/values/eat");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const config = require("../../../config");
const ViewCategory = require("../../../view/category/ViewCategory");
const ViewPrice = require("../../../view/price/ViewPrice");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const userMutation = require('../../../helpers/graphql/user/mutation');
const restaurantQuery = require('../../../helpers/graphql/restaurant/query');
const ViewVenue = require('../../../view/venue/ViewVenue');
const Error = require('../error/error');

class Eat {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.error = new Error(this.event);
  }

  start() {
    if (eatValues.length > this.context.values.length) {
      const value = this.findElemMissing();
      this[`${value}IsMissing`]();
    } else {
      this.sendRestaurants();
    }
  }

  findElemMissing() {
    let valueMissing = "";
    for (let i = 0; i < eatValues.length; i++) {
      const elemFound = this.context.values.find(value => {
        return value.name === eatValues[i].name;
      });
      if (typeof elemFound === "undefined") {
        valueMissing = eatValues[i].name;
        break;
      }
    }
    return valueMissing;
  }

  sendRestaurants() {
    const type = this.context.values.find(value => {
      return value.name === 'category';
    }).value;
    const price = this.context.values.find(value => {
      return value.name === 'price';
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
          restaurantQuery.queryRestaurantsByPriceAndType(this.event.senderId,
            type, parseInt(price), parseInt(this.context.page)));
      })
      .then(response => {
        const venue = new ViewVenue(this.event.locale, this.user,
          response.restaurantsByPriceAndType, 'restaurant', false);
        if (response.restaurantsByPriceAndType !== null &&
          response.restaurantsByPriceAndType.length > 0) {
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
                ViewChatAction.typingOn(),
                ViewChatAction.mediumPause(),
                ViewChatAction.typingOff(),
                venue.lastMessage()
              ];
              const newMessage = new Message(this.event.senderId, messageArray);
              newMessage.sendMessage();
            })
            .catch(err => {
              this.error.start();
              Sentry.captureException(err)
            });
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
        this.error.start();
        Sentry.captureException(err)
      })
  }

  categoryIsMissing() {
    const category = new ViewCategory(this.event.locale, "eat", this.user);
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
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }

  priceIsMissing() {
    const price = new ViewPrice(this.event.locale, "eat", this.user);
    price
      .init()
      .then(messagePrice => {
        const messageArray = [
          ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          messagePrice
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }
}

module.exports = Eat;
