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
const ViewGo = require('../../../view/go/ViewGo');
const ApiReferral = require("../../../helpers/Api/apiReferral");
const mutationUser = require("../../../helpers/graphql/user/mutation");
const mutationGoing = require("../../../helpers/graphql/going/mutation");
const mutationContext = require("../../../helpers/graphql/context/mutation");
const FindContext = require('../findContext/FindContext');
const contextMutation = require("../../../helpers/graphql/context/mutation");
const ErrorMessage = require("../error/error");
//const LIMIT_HOUR_ASK_LOCATION = 2;

const contextsCanGo = ['description'];
const Error = require('../error/error');

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
    this.error = new Error(this.event);
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    this.cleanContext()
      .then(() => {
        const updateLocation = this.context.values.find(
          item => item.name === "updateLocation");
        const rememberLocation = this.context.values.find(
          item => item.name === "rememberLocation");
        if (typeof updateLocation !== "undefined") {
          updateLocation.value === 'false' ?
            this.sendLocation() : this.receiveLocation()
        } else if (typeof rememberLocation !== "undefined" &&
          rememberLocation.value === 'false') {
          this.sendItinerary()
        } else {
          this.createGoing()
            .then(res => {
              (this.user.geoLocation.lat !== null) ?
                this.checkoutLastUpdate()
                : this.askForLocation()
            })
            .catch(err => {
              this.error.start();
              Sentry.captureException(err)
            })
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
  }

  createGoing() {
    let event = this.context.values.find(value => {
      return value.name === 'event';
    });
    let idEvent = this.context.values.find(value => {
      return value.name === 'id';
    });
    if (typeof event === "undefined" || typeof idEvent === "undefined") {
      new FindContext(this.event, contextsCanGo)
        .start()
        .then(context => this.updateContext(context))
        .catch(err => this.sendErrorMessage())
    } else {
      event = event.value;
      idEvent = idEvent.value;
      return new Promise((resolve, reject) => {
        ApiReferral.sendReferral("lets_go", this.event.senderId);
        const paramsGoing = {
          users_id: this.user.id,
          eventName: `${event}s_id`,
        };
        paramsGoing[`${event}s_id`] = idEvent;
        this.apiGraphql
          .sendMutation(mutationGoing.createGoing(), paramsGoing)
          .then(res => resolve(res))
          .catch(err => reject(err))
      });

    }
  }

  receiveLocation() {
    const lat = this.context.values.find(value => {
      return value.name === 'lat';
    }).value;
    const lng = this.context.values.find(value => {
      return value.name === 'lng';
    }).value;
    const geoLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      lastUpdated: new Date()
    };
    ApiReferral.sendReferral("location_go", this.event.senderId);
    this.apiGraphql
      .sendMutation(mutationUser.updateLocationByAccountMessenger(),
        {PSID: this.event.senderId, geoLocation: geoLocation})
      .then(res => {
        this.user.geoLocation = geoLocation;
        this.sendItinerary()
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
  }

  checkoutLastUpdate() {
    const event = this.context.values.find(value => {
      return value.name === 'event';
    }).value;
    const goView = new ViewGo(this.event.locale, this.user, event);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      goView.rememberLocation(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
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
        const goView = new ViewGo(this.event.locale, this.user, event);
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
          ViewChatAction.typingOn(),
          ViewChatAction.mediumPause(),
          ViewChatAction.typingOff(),
          goView.finaleMessage()
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
  }

  sendLocation() {
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
        const goView = new ViewGo(this.event.locale, this.user, event);
        const messageArray = [
          ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          goView.noItinerary(venue.name),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          goView.sendLocation(venue.location.name, venue.name),
          ViewChatAction.typingOn(),
          ViewChatAction.mediumPause(),
          ViewChatAction.typingOff(),
          goView.finaleMessage()
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
  }

  askForLocation() {
    const event = this.context.values.find(value => {
      return value.name === 'event';
    }).value;
    const goView = new ViewGo(this.event.locale, this.user, event);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      goView.askLocation(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }

  cleanContext() {
    const newValues = [];
    this.context.values.forEach(item => {
      if (item.name === "event" || item.name === "id") {
        newValues.push(item);
      }
    });
    return new Promise((resolve, reject) => {
      const filter = {
        contextId: this.context.id,
        values: newValues,
      };
      this.apiGraphql
        .sendMutation(mutationContext.updateContextByPage(), filter)
        .then(res => resolve())
        .catch(err => reject(err))
    })
  }

  sendErrorMessage() {
    const goView = new ViewGo(this.event.locale, this.user, 'undefined');
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      goView.errorMessage(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }

  updateContext(context) {
    const filter = {
      contextId: this.context.id,
      values: context.values,
    };
    this.apiGraphql
      .sendMutation(contextMutation.updateContextByPage(), filter)
      .then(res => {
        this.context = res.updateContextByPage;
        this.createGoing();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err);
      });
  }
}

module.exports = Go;