const Message = require('../../../view/messenger/Message');
const ViewFavorite = require('../../../view/favorite/ViewFavorite');
const ViewVenue = require('../../../view/Venue/Venue');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const laterQuery = require('../../../helpers/graphql/later/query');
const config = require("../../../config");
const Sentry = require("@sentry/node");
const async = require('async');
const Error = require('../error/error');

class Favorite {
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
    this.apiGraphql
      .sendQuery(
        laterQuery.queryLaters(this.user.id,
          parseInt(this.context.page)))
      .then(res => {
        if (res.laters === null) {
          this.sendNothing();
        } else {
          this.sendFavorites(res.laters)
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }

  sendFavorites(laters) {
    let responses = [...laters];
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
      if (err) {
        this.error.start();
        return Sentry.captureException(err);
      }
      const venue = new ViewVenue(this.event.locale, this.user,
        newResponses, 'favorite', true);
      return venue
        .init()
        .then(messageVenue => {
          const messageArray = [
            ViewChatAction.markSeen(),
            ViewChatAction.typingOn(),
            ViewChatAction.smallPause(),
            ViewChatAction.typingOff(),
            venue.favoriteMessage(),
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
        .catch(err => {
          const Error = new ErrorMessage(this.event);
          Error.start();
          Sentry.captureException(err);
        })
    });
  }

  sendNothing() {
    const favoriteMessage = new ViewFavorite(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.typingOff(),
      favoriteMessage.nothing()
    ];
    new Message(this.event.senderId, messageArray).sendMessage();
  }
}

module.exports = Favorite;