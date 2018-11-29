const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const ErrorMessage = require('../error/error');
const config = require("../../../config");
const queryBar = require("../../../helpers/graphql/bar/query");
const queryMuseum = require("../../../helpers/graphql/museum/query");
const queryParc = require("../../../helpers/graphql/parc/query");
const queryRestaurant = require("../../../helpers/graphql/restaurant/query");
const querySite = require("../../../helpers/graphql/site/query");
const mutationUser = require("../../../helpers/graphql/user/mutation");
const mutationContext = require("../../../helpers/graphql/context/mutation");
const queryIndexLocation = require(
  "../../../helpers/graphql/indexLocation/query");
const ViewAroundMe = require('../../../view/aroundMe/ViewAroundMe');
const ViewVenue = require('../../../view/venue/ViewVenue');
const Error = require('../error/error');
const ApiReferral = require("../../../helpers/Api/apiReferral");
const async = require('async');

const events = {
  "bars_id": (id) => queryBar.queryBar(id),
  "museums_id": (id) => queryMuseum.queryMuseum(id),
  "parcs_id": (id) => queryParc.queryParc(id),
  "restaurants_id": (id) => queryRestaurant.queryRestaurant(id),
  "sites_id": (id) => querySite.querySite(id),
};

class AroundMe {
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
        if (typeof updateLocation !== "undefined"
          && updateLocation.value === 'true') {
          this.receiveLocation();
        } else {

          parseInt(this.context.page) > 0 ?
            this.sendVenuesAroundMe() : this.askForLocation();
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
  }

  sendVenuesAroundMe() {
    this.apiGraphql
      .sendQuery(queryIndexLocation.findByNearMe(this.user.geoLocation,
        parseInt(this.context.page), this.user.cityTraveling.toLowerCase()))
      .then(response => {
        if (response.findByNearMe !== null &&
          response.findByNearMe.length > 0) {
          let responses = [...response.findByNearMe];
          let newResponses = [];
          async.each(responses, (elem, callback) => {
            elem.kindElement = "";
            for (const propertyName in elem) {
              if (propertyName !== "id" && propertyName !== "users_id"
                && propertyName !== "lastClick" &&
                propertyName !== "dateClick" && elem[propertyName] !== null) {
                elem[propertyName].kindElement =
                  propertyName.slice(0, propertyName.indexOf("s_"))
                    .toLowerCase();
                if (elem[propertyName].kindElement ===
                  "ACTIVITIE") elem[propertyName].kindElement = "activity";
                newResponses.push(elem[propertyName]);
                return callback();
              }
            }
          }, (err) => {
            if (err) return Sentry.captureException(err);
            const venue = new ViewVenue(this.event.locale, this.user,
              newResponses, 'aroundMe', true);
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
                const newMessage = new Message(this.event.senderId,
                  messageArray);
                newMessage.sendMessage();
              })
          });
        } else {
          const aroundMeView = new ViewAroundMe(this.event.locale, this.user)
          const messageArray = [
            ViewChatAction.markSeen(),
            ViewChatAction.typingOn(),
            ViewChatAction.smallPause(),
            ViewChatAction.typingOff(),
            aroundMeView.emptyMessage(),
          ];
          const newMessage = new Message(this.event.senderId, messageArray);
          newMessage.sendMessage();
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }

  receiveLocation() {
    ApiReferral.sendReferral("around_me", this.event.senderId);
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
    this.apiGraphql
      .sendMutation(mutationUser.updateLocationByAccountMessenger(),
        {PSID: this.event.senderId, geoLocation: geoLocation})
      .then(res => {
        this.user.geoLocation = geoLocation;
        this.sendVenuesAroundMe()
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
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

  askForLocation() {
    const aroundMeView = new ViewAroundMe(this.event.locale, this.user);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      aroundMeView.askLocation(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }
}
module.exports = AroundMe;