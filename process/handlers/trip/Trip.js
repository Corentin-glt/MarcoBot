const tripValues = require("../../../assets/values/trip");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewCategory = require("../../../view/Category/Category");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");

class Trip {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start() {
    if (tripValues.length > this.context.values.length) {
      const value = this.findElemMissing();
      this[`${value}IsMissing`]();
    } else {
      // this.sendRestaurants();
    }
  }

  findElemMissing() {
    let valueMissing = "";
    tripValues.forEach(item => {
      const elemFound = this.context.values.find(value => {
        return value.name === item.name;
      });
      if (typeof elemFound === "undefined") {
        valueMissing = item.name;
      }
    });
    return valueMissing;
  }



}