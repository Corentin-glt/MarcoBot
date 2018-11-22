const drinkValues = require("../../../assets/values/drink");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewCategory = require("../../../view/Category/Category");
const ViewPrice = require("../../../view/Price/Price");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const userMutation = require('../../../helpers/graphql/user/mutation');
const barQuery = require('../../../helpers/graphql/bar/query');
const ViewVenue = require('../../../view/Venue/Venue');
const config = require("../../../config");

class Drink {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start() {
    if (drinkValues.length > this.context.values.length) {
      const value = this.findElemMissing();
      this[`${value}IsMissing`]();
    } else {
      this.sendBars();
    }
  }

  findElemMissing() {
    let valueMissing = "";
    for (let i = 0; i < drinkValues.length; i++) {
      const elemFound = this.context.values.find(value => {
        return value.name === drinkValues[i].name;
      });
      if (typeof elemFound === "undefined") {
        valueMissing = drinkValues[i].name;
        break;
      }
    }
    return valueMissing;
  }

  sendBars() {
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
          barQuery.queryBarsByPriceAndType(this.event.senderId, type,
            parseInt(price), parseInt(this.context.page)));
        // return apiGraphql.sendQuery(
        //   barQuery.queryBars(parseInt(this.context.page),
        //     this.user.cityTraveling));
      })
      .then(response => {
        if(response.barsByPriceAndType.length > 0){
          const venue = new ViewVenue(this.event.locale, this.user,
            response.barsByPriceAndType, 'bar');
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

        }
      })
      .catch(err => {
        Sentry.captureException(err)
      })
  }

  categoryIsMissing() {
    const category = new ViewCategory(this.event.locale, "drink", this.user);
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
    const price = new ViewPrice(this.event.locale, "drink", this.user);
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

module
  .exports = Drink;
