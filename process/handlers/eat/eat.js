const eatValues = require("../../../assets/values/eat");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewCategory = require("../../../view/Category/Category");
const ViewPrice = require("../../../view/Price/Price");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");

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
    eatValues.forEach(item => {
      const elemFound = this.context.values.find(value => {
        return value.name === item.name;
      });
      if (typeof elemFound === "undefined") {
        valueMissing = item.name;
      }
    });
    return valueMissing;
  }

  sendRestaurants() {
    console.log("FINAL STEP RESTAURANTS ");
  }

  categoryIsMissing() {
    console.log("MISSING CATEGORY ");
    const category = new ViewCategory(this.event.locale, "eat", this.user);
    category
      .init()
      .then(res => {
        const messageCategory = res;
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
      .then(res => {
        const messagePrice = res;
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
