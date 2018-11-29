const Message = require('../../../view/messenger/Message');
const ViewError = require('../../../view/error/ViewError');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const config = require("../../../config");
const Sentry = require("@sentry/node");

class Error {
  constructor(event) {
    this.event = event;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    const errorMessage = new ViewError(this.event.locale);
    const messageArray = [ViewChatAction.markSeen(),
      ViewChatAction.typingOn(), ViewChatAction.typingOff(),
      errorMessage.mainError()];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }
}

module.exports = Error;
