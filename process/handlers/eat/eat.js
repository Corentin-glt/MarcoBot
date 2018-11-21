const eatValues = require("../../../assets/values/eat");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const config = require("../../../config");
const ViewCategory = require("../../../view/Category/Category");
const ViewPrice = require("../../../view/Price/Price");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const userMutation = require('../../../helpers/graphql/user/mutation');
const restaurant = require('../../helpers/graphql/restaurant/query');

class Eat {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
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
    console.log("final step restaurants ");
    const type = this.context.values.find(value => {
      return value.name === 'category';
    }).name;
    const price = this.context.values.find(value => {
      return value.name === 'price';
    }).name;
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
          restaurant.queryRestaurantsByPriceAndType(this.event.senderId, type,
            price, this.context.page));
      })
      .then(restaurants => {

      })
      .catch(err => Sentry.captureException(err))
  }

  categoryIsMissing() {
    console.log("MISSING CATEGORY ");
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
      .catch(err => Sentry.captureException(err));
  }

  priceIsMissing() {
    console.log("MISSING PRICE ");
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
      .catch(err => Sentry.captureException(err));
  }
}

module.exports = Eat;
