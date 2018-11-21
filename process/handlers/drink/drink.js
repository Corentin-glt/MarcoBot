const drinkValues = require("../../../assets/values/drink");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewCategory = require("../../../view/Category/Category");
const ViewPrice = require("../../../view/Price/Price");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");

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
    console.log("FINAL STEP BARS ");

  }

  categoryIsMissing() {
    console.log("MISSING CATEGORY ");
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
    console.log("MISSING PRICE ");
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

module.exports = Drink;
