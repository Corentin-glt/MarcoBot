const eatValues = require("../../../assets/values/eat");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewCategory = require("../../../view/Category/Category");
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
    
  }
}

module.exports = Eat;
