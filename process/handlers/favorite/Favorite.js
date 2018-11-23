const Message = require('../../../view/messenger/Message');
const ViewFavorite = require('../../../view/favorite/ViewFavorite');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const laterQuery = require('../../../helpers/graphql/later/query');
const config = require("../../../config");
const Sentry = require("@sentry/node");


class Favorite {
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
    const favoriteMessage = new ViewFavorite(this.user, this.event.locale);
    let messageArray = null;
    this.apiGraphql.sendQuery(laterQuery.queryLaters(this.event.senderId, this.context.page))
      .then(res => {
        if (res.laters === null) {
          messageArray = [
            ViewChatAction.markSeen(),
            ViewChatAction.typingOn(), ViewChatAction.typingOff(), favoriteMessage.nothing()
          ];
          new Message(this.event.senderId, messageArray).sendMessage();
        } else {

        }
      })
      .catch(err => Sentry.captureException(err));
  }
}

module.exports = Favorite;