const goValues = require("../../../assets/values/go");
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
const ViewGo = require('../../../view/go/Go');
const ApiReferral = require("../../../helpers/Api/apiReferral");
const mutationUser = require("../../../helpers/graphql/user/mutation");
const mutationGoing = require("../../../helpers/graphql/going/mutation");
const LIMIT_HOUR_ASK_LOCATION = 2;


const events = {
  "bar": (id) => queryBar.queryBar(id),
  "museum": (id) => queryMuseum.queryMuseum(id),
  "parc": (id) => queryParc.queryParc(id),
  "restaurant": (id) => queryRestaurant.queryRestaurant(id),
  "site": (id) => querySite.querySite(id),
};

class Go {
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
    //TODO check if the context has updateLocation = false || rememberLocation = true
    this.createGoing()
      .then(res => {
        (this.user.geoLocation.lat !== null) ?
          this.checkoutLastUpdate()
          : this.askForLocation()
      })
      .catch(err => Sentry.captureException(err))
  }

  createGoing() {
    const event = this.context.values.find(value => {
      return value.name === 'event';
    }).value;
    const idEvent = this.context.values.find(value => {
      return value.name === 'id';
    }).value;
    return new Promise((resolve, reject) => {
      ApiReferral.sendReferral("lets_go", this.event.senderId);
      this.apiGraphql
        .sendMutation(mutationGoing.createGoing(), {
          users_id: this.user.id,
          eventName: event,
          key: idEvent,
        })
        .then(res => resolve(res))
        .catch(err => reject(err))
    });
  }

  checkoutLastUpdate() {
    const diffHour = Math.abs(
        new Date() - new Date(this.user.geoLocation.lastUpdated)) / 36e5;
    if (diffHour >= LIMIT_HOUR_ASK_LOCATION) {
      const goView =  new ViewGo(this.event.locale, this.user, event);
      const messageArray = [
        ViewChatAction.markSeen(),
        ViewChatAction.typingOn(),
        ViewChatAction.smallPause(),
        ViewChatAction.typingOff(),
        goView.rememberLocation(),
      ];
      const newMessage = new Message(this.event.senderId, messageArray);
      newMessage.sendMessage();
    } else {
      this.sendItinerary()
    }
  }

  sendItinerary() {
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
        const goView =  new ViewGo(this.event.locale, this.user, event);
        const messageArray = [
          ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          goView.letsGoMessage(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          goView.sendItinerary(venue.location),
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
  }

  sendLocation(){
    //TODO just send the venue location (if the guy doesnt send his location)
  }

  askForLocation() {
    const goView =  new ViewGo(this.event.locale, this.user, event);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      goView.updateLocation(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }
}

module.exports = Go;